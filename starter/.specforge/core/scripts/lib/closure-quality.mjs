import { exists, readText } from "./specforge.mjs";

function issue(severity, code, path, message, route = "sf-close") {
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

function tableRows(content, headingPattern) {
  const rows = [];
  let header = null;
  for (const line of sectionLines(content, headingPattern)) {
    const cells = splitRow(line);
    if (!cells) continue;
    if (isSeparator(cells)) continue;
    if (!header) {
      header = cells;
      continue;
    }
    if (cells.every((cell) => !cell)) continue;
    rows.push(cells);
  }
  return rows;
}

function keyValueRows(content, headingPattern) {
  return Object.fromEntries(tableRows(content, headingPattern).map((row) => [row[0], row[1] ?? ""]));
}

function isPlaceholder(value) {
  const text = String(value ?? "").trim();
  return !text || /^(TBD|待填写|待补充|未确认|请输入内容)$/i.test(text) || /^是\s*\/\s*否/.test(text);
}

function isNo(value) {
  return /^(否|no|false|失败)$/i.test(String(value ?? "").trim());
}

function isYesOrNA(value) {
  return /^(是|yes|true|通过|N\/A|不涉及|无)$/i.test(String(value ?? "").trim());
}

function hasUsefulBody(content, headingPattern) {
  return sectionLines(content, headingPattern).some((line) => {
    const trimmed = line.trim();
    return trimmed && !/^>/.test(trimmed) && !/^#{1,6}\s/.test(trimmed) && !/^\d+\.\s*$/.test(trimmed) && !/^\|\s*[-:|\s]+\|?$/.test(trimmed);
  });
}

function validateRelease(workItemBase, releaseText, issues) {
  const path = "06-close/release.md";
  const summary = keyValueRows(releaseText, /^##\s+1\.\s+发布摘要/i);
  if (isPlaceholder(summary["工作项"])) issues.push(issue("WARN", "release-work-item-missing", path, "release.md 缺少工作项。"));
  if (isPlaceholder(summary["影响范围"])) issues.push(issue("FAIL", "release-impact-missing", path, "release.md 缺少影响范围。"));
  if (isPlaceholder(summary["发布结论"])) issues.push(issue("FAIL", "release-conclusion-missing", path, "release.md 缺少发布结论。"));

  const prechecks = tableRows(releaseText, /^##\s+3\.\s+发布前检查/i).map((row) => ({
    check: row[0],
    result: row[1],
    evidence: row[2],
  }));
  for (const row of prechecks) {
    if (!row.check || /检查项/.test(row.check)) continue;
    const allowsNA = /残余风险|manual-confirmed|deferred/.test(row.check);
    if (isPlaceholder(row.result) || isNo(row.result) || (!allowsNA && !isYesOrNA(row.result))) {
      issues.push(issue("FAIL", "release-precheck-not-passed", path, `发布前检查未通过或未填写：${row.check}=${row.result || "empty"}。`));
    }
    if (!allowsNA && isPlaceholder(row.evidence)) {
      issues.push(issue("WARN", "release-precheck-evidence-missing", path, `发布前检查缺少证据：${row.check}。`));
    }
  }

  const evidenceRows = tableRows(releaseText, /^##\s+4\.\s+证据引用/i);
  for (const row of evidenceRows) {
    const evidencePath = String(row[1] ?? "").replace(/`/g, "").trim();
    if (!evidencePath || /路径\s*\/\s*链接/.test(evidencePath)) continue;
    if (!/^https?:\/\//.test(evidencePath) && !exists(`${workItemBase}/${evidencePath}`)) {
      issues.push(issue("WARN", "release-evidence-path-missing", path, `release.md 引用了不存在的证据：${evidencePath}。`));
    }
  }

  const releaseType = summary["发布类型"] ?? "";
  if (!/N\/A|不涉及/i.test(releaseType) && !hasUsefulBody(releaseText, /^##\s+6\.\s+发布后观察/i)) {
    issues.push(issue("FAIL", "release-observation-missing", path, "涉及发布时必须填写发布后观察项。"));
  }
  if (/N\/A|不涉及/.test(releaseType) && !hasUsefulBody(releaseText, /^##\s+7\.\s+不涉及生产发布的说明/i)) {
    issues.push(issue("FAIL", "release-na-reason-missing", path, "不涉及生产发布时必须写明原因、交付状态和后续触发条件。"));
  }
}

function validateRollback(rollbackText, issues) {
  const path = "06-close/rollback.md";
  const summary = keyValueRows(rollbackText, /^##\s+1\.\s+回滚摘要/i);
  const rollbackMode = summary["是否可回滚"] ?? "";
  if (isPlaceholder(rollbackMode)) issues.push(issue("FAIL", "rollback-mode-missing", path, "rollback.md 缺少是否可回滚结论。"));
  if (!/不涉及/.test(rollbackMode) && isPlaceholder(summary["回滚负责人"])) {
    issues.push(issue("FAIL", "rollback-owner-missing", path, "可回滚或不可回滚场景必须填写回滚负责人。"));
  }
  if (/否/.test(rollbackMode) && isPlaceholder(summary["风险接受人"])) {
    issues.push(issue("FAIL", "rollback-risk-acceptor-missing", path, "不可回滚时必须填写风险接受人。"));
  }

  if (!/不涉及/.test(rollbackMode) && tableRows(rollbackText, /^##\s+2\.\s+回滚触发条件/i).length === 0) {
    issues.push(issue("FAIL", "rollback-triggers-missing", path, "rollback.md 缺少回滚触发条件。"));
  }

  for (const row of tableRows(rollbackText, /^##\s+3\.\s+风险来源对账/i)) {
    const source = row[0];
    const covered = row[1];
    if (!source || /风险来源/.test(source)) continue;
    if (isPlaceholder(covered) || isNo(covered)) {
      issues.push(issue("FAIL", "rollback-risk-source-uncovered", path, `风险来源未覆盖触发条件：${source}=${covered || "empty"}。`));
    }
  }

  if (/否/.test(rollbackMode)) {
    if (!hasUsefulBody(rollbackText, /^##\s+7\.\s+不可回滚说明/i)) {
      issues.push(issue("FAIL", "rollback-compensation-missing", path, "不可回滚时必须填写原因、风险和补偿措施。"));
    }
  } else if (!/不涉及/.test(rollbackMode) && !hasUsefulBody(rollbackText, /^##\s+4\.\s+回滚步骤/i)) {
    issues.push(issue("FAIL", "rollback-steps-missing", path, "可回滚时必须填写可执行回滚步骤。"));
  }
}

export function closureQualitySummary(workItemBase) {
  const releasePath = "06-close/release.md";
  const rollbackPath = "06-close/rollback.md";
  const wikiSyncPath = "06-close/wiki-sync.md";
  const releaseText = readIfExists(workItemBase, releasePath);
  const rollbackText = readIfExists(workItemBase, rollbackPath);
  const wikiSyncText = readIfExists(workItemBase, wikiSyncPath);
  const issues = [];

  if (!releaseText) issues.push(issue("FAIL", "release-missing", releasePath, "release.md 不存在。"));
  if (!rollbackText) issues.push(issue("FAIL", "rollback-missing", rollbackPath, "rollback.md 不存在。"));
  if (!wikiSyncText) issues.push(issue("WARN", "wiki-sync-missing", wikiSyncPath, "wiki-sync.md 不存在，closure 前通常需要完成 wiki_sync gate。", "sf-wiki"));

  if (/状态：待填写|状态：待判断/.test(releaseText)) issues.push(issue("FAIL", "release-template-status", releasePath, "release.md 仍是待填写状态。"));
  if (/状态：待填写|状态：待判断/.test(rollbackText)) issues.push(issue("FAIL", "rollback-template-status", rollbackPath, "rollback.md 仍是待填写状态。"));

  if (releaseText) validateRelease(workItemBase, releaseText, issues);
  if (rollbackText) validateRollback(rollbackText, issues);

  return {
    work_item_path: workItemBase,
    paths: { release: releasePath, rollback: rollbackPath, wiki_sync: wikiSyncPath },
    exists: { release: Boolean(releaseText), rollback: Boolean(rollbackText), wiki_sync: Boolean(wikiSyncText) },
    issues,
    summary: {
      fail: issues.filter((item) => item.severity === "FAIL").length,
      warn: issues.filter((item) => item.severity === "WARN").length,
    },
  };
}
