import { exists, readText } from "./specforge.mjs";

const sourcePaths = [
  "01-spec/requirements.md",
  "01-spec/gap-report.md",
  "01-spec/research.md",
  "01-spec/ui-design.md",
  "01-spec/technical-design.md",
  "04-code-review/code-review-v1.md",
];

const verificationPaths = ["05-verification/test-cases.md", "05-verification/report.md"];
const idPattern = /\b(?:REQ|AC|NFR|GAP|UI|TD|REVIEW|TC|PW)-\d{3}\b/g;
const taskPattern = /^\s*[-*]\s+\[[ xX]\]\s+(T\d{3})\b(.+)$/;
const fieldPattern = /^\s*_(Trace|Verification|TestCase):_\s*(.+)$/i;
const placeholderPattern = /\.\.\.|xxx|待补充|示例|example/i;

function unique(values) {
  return [...new Set(values)].sort();
}

function idsIn(text) {
  return unique([...String(text ?? "").matchAll(idPattern)].map((match) => match[0]));
}

function readIfExists(workItemBase, path) {
  const fullPath = `${workItemBase}/${path}`;
  return exists(fullPath) ? readText(fullPath) : "";
}

function collectSourceItems(workItemBase) {
  const byId = new Map();
  for (const path of sourcePaths) {
    const content = readIfExists(workItemBase, path);
    if (!content) continue;
    const lines = content.split(/\r?\n/);
    for (const [index, line] of lines.entries()) {
      if (placeholderPattern.test(line)) continue;
      for (const id of idsIn(line)) {
        if (/^(TC|PW)-/.test(id)) continue;
        if (!byId.has(id)) byId.set(id, { id, path, line: index + 1, text: line.trim().slice(0, 220) });
      }
    }
  }
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

function collectTasks(workItemBase) {
  const path = "01-spec/tasks.md";
  const content = readIfExists(workItemBase, path);
  if (!content) return [];

  const tasks = [];
  let current = null;
  for (const [index, line] of content.split(/\r?\n/).entries()) {
    const taskMatch = line.match(taskPattern);
    if (taskMatch) {
      current = {
        id: taskMatch[1],
        title: taskMatch[2].trim(),
        path,
        line: index + 1,
        trace_ids: [],
        verification_ids: [],
        testcase_ids: [],
        has_trace_field: false,
        has_verification_field: false,
      };
      tasks.push(current);
      continue;
    }
    if (!current) continue;
    const fieldMatch = line.match(fieldPattern);
    if (!fieldMatch) continue;
    const field = fieldMatch[1].toLowerCase();
    const value = fieldMatch[2];
    if (field === "trace") {
      current.has_trace_field = true;
      current.trace_ids = idsIn(value);
    } else if (field === "verification") {
      current.has_verification_field = true;
      current.verification_ids = idsIn(value);
    } else if (field === "testcase") {
      current.testcase_ids = idsIn(value).filter((id) => /^(TC|PW)-/.test(id));
    }
  }

  return tasks;
}

function collectVerificationItems(workItemBase) {
  const byId = new Map();
  for (const path of verificationPaths) {
    const content = readIfExists(workItemBase, path);
    if (!content) continue;
    const lines = content.split(/\r?\n/);
    for (const [index, line] of lines.entries()) {
      if (placeholderPattern.test(line)) continue;
      for (const id of idsIn(line).filter((value) => /^(TC|PW)-/.test(value))) {
        if (!byId.has(id)) byId.set(id, { id, path, line: index + 1, text: line.trim().slice(0, 220) });
      }
    }
  }
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

export function traceabilitySummary(workItemBase) {
  const sourceItems = collectSourceItems(workItemBase);
  const tasks = collectTasks(workItemBase);
  const verificationItems = collectVerificationItems(workItemBase);
  const tracedIds = new Set(tasks.flatMap((task) => task.trace_ids));
  const testcaseIds = new Set([
    ...tasks.flatMap((task) => task.testcase_ids),
    ...verificationItems.map((item) => item.id),
  ]);

  const uncoveredSources = sourceItems.filter((item) => !tracedIds.has(item.id));
  const tasksMissingTrace = tasks.filter((task) => !task.has_trace_field || task.trace_ids.length === 0);
  const tasksMissingVerification = tasks.filter((task) => !task.has_verification_field);
  const tasksWithoutTestCase = tasks.filter((task) => task.testcase_ids.length === 0);

  return {
    summary: {
      source_items: sourceItems.length,
      tasks: tasks.length,
      verification_items: verificationItems.length,
      uncovered_sources: uncoveredSources.length,
      tasks_missing_trace: tasksMissingTrace.length,
      tasks_missing_verification: tasksMissingVerification.length,
      tasks_without_testcase: tasksWithoutTestCase.length,
    },
    source_items: sourceItems,
    tasks,
    verification_items: verificationItems,
    gaps: {
      uncovered_sources: uncoveredSources,
      tasks_missing_trace: tasksMissingTrace,
      tasks_missing_verification: tasksMissingVerification,
      tasks_without_testcase: tasksWithoutTestCase,
      verification_ids: unique([...testcaseIds]),
    },
  };
}
