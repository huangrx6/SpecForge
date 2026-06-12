import { exists, readText } from "./specforge.mjs";

export const evidenceLevels = ["proven", "mocked", "manual-confirmed", "deferred", "missing"];

function splitRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return null;
  return trimmed
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

function sectionLines(content, headingPattern) {
  const lines = content.split(/\r?\n/);
  const start = lines.findIndex((line) => headingPattern.test(line));
  if (start === -1) return [];
  const result = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^#{1,3}\s+/.test(line)) break;
    result.push(line);
  }
  return result;
}

function normalizeLevel(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  return evidenceLevels.includes(normalized) ? normalized : null;
}

function isChoiceCell(value) {
  return /\//.test(String(value ?? ""));
}

function parseEvidenceRows(content) {
  const rows = [];
  for (const line of sectionLines(content, /^##\s+3\.2\s+证据强度分级/i)) {
    const cells = splitRow(line);
    if (!cells || cells.length < 6) continue;
    if (/^-+$/.test(cells.join("").replaceAll(" ", ""))) continue;
    if (/证据等级|来源项/.test(cells.join(" "))) continue;
    if (isChoiceCell(cells[1])) continue;
    const level = normalizeLevel(cells[1]);
    if (!level) continue;
    rows.push({
      source: cells[0],
      level,
      evidence: cells[2],
      proves: cells[3],
      limits: cells[4],
      gate_impact: cells[5],
    });
  }
  return rows;
}

function parseManualConfirmationRows(content) {
  const rows = [];
  for (const line of sectionLines(content, /^##\s+12\.\s+人工确认与外部补证/i)) {
    const cells = splitRow(line);
    if (!cells || cells.length < 7) continue;
    if (/^-+$/.test(cells.join("").replaceAll(" ", ""))) continue;
    if (/缺口|已有证据|人工确认人/.test(cells.join(" "))) continue;
    if (isChoiceCell(cells[2]) || isChoiceCell(cells[4])) continue;
    if (cells.every((cell) => !cell)) continue;
    rows.push({
      gap: cells[0],
      existing_evidence: cells[1],
      risk: cells[2],
      confirmer: cells[3],
      conclusion: cells[4],
      owner: cells[5],
      revalidation_trigger: cells[6],
    });
  }
  return rows;
}

function emptyCounts() {
  return Object.fromEntries(evidenceLevels.map((level) => [level, 0]));
}

function classifyIssues(rows, manualRows) {
  const issues = [];
  if (rows.length === 0) {
    issues.push({
      severity: "FAIL",
      code: "no-graded-evidence",
      message: "verification report 缺少可解析的证据强度分级行。",
    });
  }

  for (const row of rows) {
    if (row.level === "missing") {
      issues.push({
        severity: "FAIL",
        code: "missing-evidence",
        message: `${row.source || "unknown source"} 的证据等级为 missing，不能批准 verification gate。`,
      });
    }
  }

  const weakRows = rows.filter((row) => ["manual-confirmed", "deferred"].includes(row.level));
  if (weakRows.length > 0 && manualRows.length === 0) {
    issues.push({
      severity: "FAIL",
      code: "manual-evidence-without-confirmation",
      message: "存在 manual-confirmed / deferred 证据，但缺少人工确认与外部补证记录。",
    });
  }

  for (const row of manualRows) {
    if (!row.owner || !row.revalidation_trigger) {
      issues.push({
        severity: "WARN",
        code: "manual-confirmation-incomplete",
        message: `${row.gap || "manual confirmation"} 缺少 owner 或重新验证触发条件。`,
      });
    }
  }

  return issues;
}

export function evidenceSummary(workItemBase, reportPath = "05-verification/report.md") {
  const fullPath = `${workItemBase}/${reportPath}`;
  if (!exists(fullPath)) {
    return {
      report_path: reportPath,
      exists: false,
      counts: emptyCounts(),
      rows: [],
      manual_confirmations: [],
      issues: [
        {
          severity: "FAIL",
          code: "missing-verification-report",
          message: `verification report 不存在：${reportPath}`,
        },
      ],
    };
  }

  const content = readText(fullPath);
  const rows = parseEvidenceRows(content);
  const manualConfirmations = parseManualConfirmationRows(content);
  const counts = emptyCounts();
  for (const row of rows) counts[row.level] += 1;
  const issues = classifyIssues(rows, manualConfirmations);

  return {
    report_path: reportPath,
    exists: true,
    counts,
    rows,
    manual_confirmations: manualConfirmations,
    issues,
  };
}
