import { exists, readText } from "./specforge.mjs";

const SOURCE_LEVELS = new Set(["primary", "secondary", "anecdotal", "stale", "unknown"]);
const WEAK_SOURCE_LEVELS = new Set(["anecdotal", "stale", "unknown"]);

function issue(severity, code, artifact, path, message) {
  return { severity, code, artifact, path, message };
}

function headingLevel(line) {
  return line.match(/^(#{1,6})\s+/)?.[1]?.length ?? 0;
}

function sectionLines(content, headingPattern, options = {}) {
  const lines = content.split(/\r?\n/);
  const start = lines.findIndex((line) => headingPattern.test(line));
  if (start === -1) return [];
  const level = headingLevel(lines[start]);
  const result = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    const nextLevel = headingLevel(line);
    if (nextLevel > 0 && nextLevel <= level) break;
    if (nextLevel > 0 && options.includeSubsections === false) break;
    result.push(line);
  }
  return result;
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

function isPlaceholder(value) {
  const text = String(value ?? "").trim();
  return !text || /^N\/A$/i.test(text) || /^(TBD|待补充|未确认|请输入内容)$/.test(text) || /\byes\s*\/\s*no\b/i.test(text);
}

function isChoiceCell(value) {
  const text = String(value ?? "").trim();
  return /primary\s*\/\s*secondary|yes\s*\/\s*no|ADOPT\s*\/\s*REJECT|confirmed\s*\/\s*delegated/i.test(text);
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
    if (cells.every(isPlaceholder) || cells.some(isChoiceCell)) continue;
    rows.push(cells);
  }
  return rows;
}

function normalizeSourceLevel(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  for (const level of SOURCE_LEVELS) {
    if (normalized.includes(level)) return level;
  }
  return null;
}

function looksLikeDateOrVersion(value) {
  const text = String(value ?? "").trim();
  return /\d{4}-\d{2}-\d{2}|\d{4}年|\bv?\d+\.\d+|lockfile|package|commit|release/i.test(text);
}

function analyzeResearch(workItemBase) {
  const path = "01-spec/research.md";
  const fullPath = `${workItemBase}/${path}`;
  if (!exists(fullPath)) return { artifact: "research", path, exists: false, rows: [], issues: [] };

  const content = readText(fullPath);
  const rows = parseTableRows(sectionLines(content, /^##\s+2\.\s+来源与情报池/i, { includeSubsections: false }));
  const issues = [];

  if (rows.length === 0) {
    issues.push(issue("FAIL", "research-source-rows-missing", "research", path, "research.md 缺少可解析的来源与情报池记录。"));
  }

  for (const [index, row] of rows.entries()) {
    const [source, versionOrDate, authority, conclusion] = row;
    const label = source || `row ${index + 1}`;
    const level = normalizeSourceLevel(authority);
    if (isPlaceholder(source)) issues.push(issue("FAIL", "research-source-missing", "research", path, `来源行缺少来源名称：${label}.`));
    if (isPlaceholder(versionOrDate) || !looksLikeDateOrVersion(versionOrDate)) {
      issues.push(issue("WARN", "research-source-date-weak", "research", path, `${label} 缺少明确版本、日期、lockfile 或 release 证据。`));
    }
    if (!level) {
      issues.push(issue("FAIL", "research-authority-missing", "research", path, `${label} 缺少 primary / secondary / anecdotal / stale / unknown 权威度分级。`));
    } else if (WEAK_SOURCE_LEVELS.has(level)) {
      issues.push(issue("WARN", `research-${level}-source`, "research", path, `${label} 的来源分级为 ${level}，不能单独支撑关键技术决策。`));
    }
    if (isPlaceholder(conclusion)) {
      issues.push(issue("WARN", "research-conclusion-missing", "research", path, `${label} 缺少关键结论。`));
    }
  }

  return { artifact: "research", path, exists: true, rows, issues };
}

function analyzeTechnicalDesign(workItemBase) {
  const path = "01-spec/technical-design.md";
  const fullPath = `${workItemBase}/${path}`;
  if (!exists(fullPath)) return { artifact: "technical_design", path, exists: false, version_facts: [], baseline_rows: [], issues: [] };

  const content = readText(fullPath);
  const versionFacts = parseTableRows(sectionLines(content, /^###\s+当前版本事实/i));
  const baselineRows = parseTableRows(sectionLines(content, /^##\s+5\.\s+规则基准与偏离/i));
  const issues = [];

  if (versionFacts.length === 0 && /新增|替换|SDK|provider|框架|数据库|测试工具|安全|依赖/.test(content)) {
    issues.push(issue("WARN", "version-facts-missing", "technical_design", path, "technical-design.md 提到了技术选择或依赖影响，但缺少可解析的当前版本事实。"));
  }

  for (const [index, row] of versionFacts.entries()) {
    const [item, versionOrFact, source, date] = row;
    const label = item || `row ${index + 1}`;
    if (isPlaceholder(versionOrFact)) {
      issues.push(issue("WARN", "version-fact-missing", "technical_design", path, `${label} 缺少版本或事实。`));
    }
    if (isPlaceholder(source)) {
      issues.push(issue("WARN", "version-source-missing", "technical_design", path, `${label} 缺少官方文档、lockfile、manifest 或 wiki 来源。`));
    }
    if (isPlaceholder(date) || !looksLikeDateOrVersion(date)) {
      issues.push(issue("WARN", "version-date-weak", "technical_design", path, `${label} 缺少明确日期或版本定位。`));
    }
  }

  for (const [index, row] of baselineRows.entries()) {
    const [impact, ruleEntry, baseline, officialChecked, adoption] = row;
    const label = impact || `row ${index + 1}`;
    if (/N\/A/i.test(ruleEntry) || /N\/A/i.test(baseline)) continue;
    if (!/yes|已查|confirmed|N\/A/i.test(officialChecked || "")) {
      issues.push(issue("WARN", "official-baseline-unchecked", "technical_design", path, `${label} 的官方基准来源未确认已查。`));
    }
    if (isPlaceholder(adoption)) {
      issues.push(issue("WARN", "baseline-adoption-missing", "technical_design", path, `${label} 缺少采用点或偏离说明。`));
    }
  }

  return { artifact: "technical_design", path, exists: true, version_facts: versionFacts, baseline_rows: baselineRows, issues };
}

export function sourceQualitySummary(workItemBase) {
  const research = analyzeResearch(workItemBase);
  const technicalDesign = analyzeTechnicalDesign(workItemBase);
  const issues = [...research.issues, ...technicalDesign.issues];
  return {
    work_item_path: workItemBase,
    artifacts: [research, technicalDesign],
    issues,
    summary: {
      checked_artifacts: [research, technicalDesign].filter((artifact) => artifact.exists).length,
      fail: issues.filter((item) => item.severity === "FAIL").length,
      warn: issues.filter((item) => item.severity === "WARN").length,
    },
  };
}
