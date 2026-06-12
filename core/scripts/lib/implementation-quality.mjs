import { spawnSync } from "node:child_process";
import { exists, readText } from "./specforge.mjs";

const VALID_TASK_STATUSES = new Set(["DONE", "DONE_WITH_CONCERNS", "BLOCKED", "NEEDS_SPEC"]);
const REQUIRED_TASK_FIELDS = ["Trace", "Files", "Verification", "Rollback", "Risk"];

function issue(severity, code, path, message, route = "sf-implement") {
  return { severity, code, path, message, route };
}

function readIfExists(workItemBase, path) {
  const fullPath = `${workItemBase}/${path}`;
  return exists(fullPath) ? readText(fullPath) : "";
}

function splitRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return null;
  return trimmed
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

function isSeparator(cells) {
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s+/g, "")));
}

function isChoiceCell(value) {
  return /\bDONE\s*\/\s*DONE_WITH_CONCERNS\b|是\s*\/\s*否|yes\s*\/\s*no|modified\s*\/\s*added/i.test(String(value ?? ""));
}

function sectionLines(content, headingPattern) {
  const lines = content.split(/\r?\n/);
  const start = lines.findIndex((line) => headingPattern.test(line));
  if (start === -1) return [];
  const level = lines[start].match(/^(#{1,6})\s+/)?.[1]?.length ?? 1;
  const result = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const nextLevel = lines[index].match(/^(#{1,6})\s+/)?.[1]?.length ?? 0;
    if (nextLevel > 0 && nextLevel <= level) break;
    result.push(lines[index]);
  }
  return result;
}

function parseTableRows(lines) {
  const rows = [];
  let header = null;
  for (const line of lines) {
    const cells = splitRow(line);
    if (!cells) continue;
    if (isSeparator(cells)) continue;
    if (!header) {
      header = cells;
      continue;
    }
    if (cells.every((cell) => !cell) || cells.some(isChoiceCell)) continue;
    rows.push(cells);
  }
  return rows;
}

function parseTasks(content) {
  const tasks = [];
  let current = null;
  for (const [index, line] of content.split(/\r?\n/).entries()) {
    const taskMatch = line.match(/^\s*[-*]\s+\[[ xX]\]\s+(T\d{3})\b(.+)$/);
    if (taskMatch) {
      current = {
        id: taskMatch[1],
        title: taskMatch[2].trim(),
        line: index + 1,
        checked: /\[[xX]\]/.test(line),
        fields: {},
      };
      tasks.push(current);
      continue;
    }
    if (!current) continue;
    const fieldMatch = line.match(/^\s*_(Trace|Files|Verification|Rollback|Risk|Impact|Boundary|Depends|TestCase):_\s*(.+)$/i);
    if (fieldMatch) current.fields[fieldMatch[1]] = fieldMatch[2].trim();
  }
  return tasks;
}

function parseImplementationRows(report) {
  return parseTableRows(sectionLines(report, /^##\s+2\.\s+任务执行/i))
    .filter((row) => /^T\d{3}/.test(row[0] ?? ""))
    .map((row) => ({
      task: row[0],
      status: String(row[1] ?? "").trim().toUpperCase(),
      files: row[2] ?? "",
      evidence: row[3] ?? "",
      notes: row[4] ?? "",
    }));
}

function parseChangedFileRows(changedFiles) {
  return parseTableRows(sectionLines(changedFiles, /^#\s+变更文件清单|^##\s+变更文件清单/i))
    .filter((row) => row.length >= 8)
    .filter((row) => row[0] && !/文件\s*\/\s*目录/.test(row[0]))
    .map((row) => ({
      file: String(row[0] ?? "").replace(/`/g, "").trim(),
      status: row[1],
      task: row[2],
      reason: row[3],
      boundary_source: row[4],
      in_boundary: row[5],
      verification: row[6],
      risk: row[7],
    }))
    .filter((row) => row.file);
}

function parseExcludedRows(changedFiles) {
  return parseTableRows(sectionLines(changedFiles, /^##\s+未登记或排除的改动/i))
    .filter((row) => row[0] && !/文件\s*\/\s*目录/.test(row[0]))
    .map((row) => ({
      file: String(row[0] ?? "").replace(/`/g, "").trim(),
      reason: row[1] ?? "",
      handling: row[2] ?? "",
    }))
    .filter((row) => row.file);
}

function gitFiles(args) {
  const result = spawnSync("git", args, { cwd: process.cwd(), encoding: "utf8" });
  if (result.status !== 0) return null;
  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function gitStatusFiles() {
  const result = spawnSync("git", ["status", "--short", "--untracked-files=all"], { cwd: process.cwd(), encoding: "utf8" });
  if (result.status !== 0) return null;
  return result.stdout
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => line.slice(3).replace(/^.* -> /, "").trim())
    .filter(Boolean);
}

function isWorkflowMetadata(file) {
  return file === ".specforge/registry.yaml" || file.startsWith(".specforge/work/");
}

function gitDiffSummary() {
  const unstaged = gitFiles(["diff", "--name-only"]);
  const staged = gitFiles(["diff", "--cached", "--name-only"]);
  const status = gitStatusFiles();
  if (!unstaged || !staged || !status) return { available: false, files: [] };
  return { available: true, files: [...new Set([...unstaged, ...staged, ...status])].filter((file) => !isWorkflowMetadata(file)).sort() };
}

function fileCovered(file, rows) {
  return rows.some((row) => {
    const candidate = typeof row === "string" ? row : row?.file;
    if (!candidate) return false;
    return candidate === file || file.startsWith(`${candidate.replace(/\/$/, "")}/`);
  });
}

function isPlaceholder(value) {
  const text = String(value ?? "").trim();
  return !text || /^N\/A$/i.test(text) || /^(TBD|待补充|未确认|请输入内容)$/.test(text);
}

export function implementationQualitySummary(workItemBase) {
  const tasksPath = "01-spec/tasks.md";
  const reportPath = "03-implementation/report.md";
  const changedFilesPath = "03-implementation/changed-files.md";
  const tasksText = readIfExists(workItemBase, tasksPath);
  const reportText = readIfExists(workItemBase, reportPath);
  const changedFilesText = readIfExists(workItemBase, changedFilesPath);
  const tasks = tasksText ? parseTasks(tasksText) : [];
  const implementationRows = reportText ? parseImplementationRows(reportText) : [];
  const changedRows = changedFilesText ? parseChangedFileRows(changedFilesText) : [];
  const excludedRows = changedFilesText ? parseExcludedRows(changedFilesText) : [];
  const git = gitDiffSummary();
  const issues = [];

  if (!tasksText) issues.push(issue("FAIL", "tasks-missing", tasksPath, "tasks.md 不存在，无法证明 implementation 边界。", "sf-tasking"));
  if (!reportText) issues.push(issue("FAIL", "implementation-report-missing", reportPath, "implementation report 不存在。"));
  if (!changedFilesText) issues.push(issue("FAIL", "changed-files-missing", changedFilesPath, "changed-files.md 不存在。"));

  for (const task of tasks) {
    const missing = REQUIRED_TASK_FIELDS.filter((field) => isPlaceholder(task.fields[field]));
    if (missing.length > 0) {
      issues.push(issue("FAIL", "task-core-fields-missing", tasksPath, `${task.id} 缺少核心字段：${missing.map((field) => `_${field}:_`).join(", ")}。`, "sf-tasking"));
    }
  }

  const taskIds = new Set(tasks.map((task) => task.id));
  const implementationByTask = new Map(implementationRows.map((row) => [row.task, row]));
  for (const row of implementationRows) {
    if (!VALID_TASK_STATUSES.has(row.status)) {
      issues.push(issue("FAIL", "implementation-status-invalid", reportPath, `${row.task} 使用了无效状态：${row.status || "empty"}。`));
    }
    if (!taskIds.has(row.task)) {
      issues.push(issue("WARN", "implementation-task-not-in-tasks", reportPath, `${row.task} 不存在于 tasks.md。`));
    }
    if (["DONE", "DONE_WITH_CONCERNS"].includes(row.status) && (isPlaceholder(row.files) || isPlaceholder(row.evidence))) {
      issues.push(issue("FAIL", "done-task-missing-evidence", reportPath, `${row.task} 标记为 ${row.status}，但缺少变更文件或快速验证证据。`));
    }
    if (["BLOCKED", "NEEDS_SPEC", "DONE_WITH_CONCERNS"].includes(row.status) && isPlaceholder(row.notes)) {
      issues.push(issue("WARN", "non-done-task-missing-notes", reportPath, `${row.task} 状态为 ${row.status}，需要在备注中说明影响、owner 或回退路径。`));
    }
  }

  for (const task of tasks.filter((task) => task.checked)) {
    if (!implementationByTask.has(task.id)) {
      issues.push(issue("FAIL", "checked-task-missing-report-row", reportPath, `${task.id} 已在 tasks.md 勾选，但 implementation report 没有对应任务执行行。`));
    }
  }

  for (const row of changedRows) {
    if (isPlaceholder(row.task) || !/^T\d{3}/.test(row.task)) {
      issues.push(issue("FAIL", "changed-file-missing-task", changedFilesPath, `${row.file} 缺少对应任务 ID。`));
    }
    if (!/^(是|yes|true|in-boundary|N\/A)$/i.test(row.in_boundary)) {
      issues.push(issue("WARN", "changed-file-boundary-unconfirmed", changedFilesPath, `${row.file} 未明确在批准边界内。`));
    }
    if (isPlaceholder(row.verification)) {
      issues.push(issue("FAIL", "changed-file-missing-verification", changedFilesPath, `${row.file} 缺少验证方式。`));
    }
  }

  if (!git.available) {
    issues.push(issue("WARN", "git-diff-unavailable", changedFilesPath, "当前目录不是可读取的 git 仓库，跳过真实 diff 对账。", "sf-code-review"));
  } else {
    const explainedFiles = [...changedRows.map((row) => row.file), ...excludedRows.map((row) => row.file)];
    for (const file of git.files) {
      if (!fileCovered(file, explainedFiles)) {
        issues.push(issue("FAIL", "git-file-not-registered", changedFilesPath, `${file} 出现在真实 git diff/status 中，但未在 changed-files.md 登记或排除。`));
      }
    }
    for (const row of changedRows) {
      if (!fileCovered(row.file, git.files)) {
        issues.push(issue("WARN", "registered-file-not-in-git-diff", changedFilesPath, `${row.file} 已登记，但当前真实 git diff/status 未出现。`));
      }
    }
  }

  return {
    work_item_path: workItemBase,
    paths: { tasks: tasksPath, report: reportPath, changed_files: changedFilesPath },
    tasks,
    implementation_rows: implementationRows,
    changed_files: changedRows,
    excluded_files: excludedRows,
    git,
    issues,
    summary: {
      tasks: tasks.length,
      implementation_rows: implementationRows.length,
      changed_files: changedRows.length,
      excluded_files: excludedRows.length,
      git_files: git.files.length,
      fail: issues.filter((item) => item.severity === "FAIL").length,
      warn: issues.filter((item) => item.severity === "WARN").length,
    },
  };
}
