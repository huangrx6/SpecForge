import { exists, readText } from "./specforge.mjs";

function issue(severity, code, path, line, message, route = "decision-brief") {
  return { severity, code, path, line, message, route };
}

function contextForEntry(workItemBase, entry, radius = 3) {
  const filePath = `${workItemBase}/${entry.path}`;
  if (!exists(filePath)) return entry.text ?? "";
  const lines = readText(filePath).split(/\r?\n/);
  const index = Math.max(0, (entry.line ?? 1) - 1);
  const start = Math.max(0, index - radius);
  const end = Math.min(lines.length, index + radius + 1);
  return lines
    .slice(start, end)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function hasOwner(text) {
  return /(owner|负责人|责任人|确认人|人工确认人|assignee)\s*[:：|]?\s*[^|\n\s]+/i.test(text);
}

function hasImpact(text) {
  return /(impact|影响|风险|risk|blast radius|范围|后果|consequence)/i.test(text);
}

function hasTrigger(text) {
  return /(revalidation|重新验证|补证触发|触发条件|trigger|复核条件|回归条件|观察点|rollback|回退)/i.test(text);
}

function hasRationale(text) {
  return /(rationale|reason|理由|原因|取舍|why|推荐理由|默认理由)/i.test(text);
}

function isDelegatedDefault(text) {
  return /delegated_default|授权默认|按推荐方案默认|默认做|默认采用/i.test(text);
}

function isRiskAcceptance(text) {
  return /\b(manual-confirmed|deferred)\b|人工确认|外部补证|接受跳过|低风险跳过|风险接受/i.test(text);
}

function hasConfirmationSource(text) {
  return /(用户|负责人|确认|confirmed|approved|source|来源|marker|brief|prd|requirements|wiki|代码路径|证据)/i.test(text);
}

function classifyConfirmedDecision(workItemBase, entry) {
  const context = contextForEntry(workItemBase, entry);
  const issues = [];

  if (isDelegatedDefault(context)) {
    const missing = [];
    if (!hasRationale(context)) missing.push("rationale");
    if (!hasImpact(context)) missing.push("impact");
    if (!hasTrigger(context)) missing.push("rollback/revalidation trigger");
    if (missing.length > 0) {
      issues.push(
        issue(
          "FAIL",
          "delegated-default-incomplete",
          entry.path,
          entry.line,
          `delegated_default 缺少 ${missing.join(", ")}；授权默认必须说明默认理由、风险影响和回退 / 重新验证触发条件。`,
        ),
      );
    }
  } else if (!hasConfirmationSource(context)) {
    issues.push(
      issue(
        "WARN",
        "confirmation-source-weak",
        entry.path,
        entry.line,
        "确认记录缺少明确来源或确认人线索；建议写明用户消息、负责人、brief / PRD / wiki / 代码证据。",
      ),
    );
  }

  return issues;
}

function classifyRiskAcceptance(workItemBase, entry) {
  const context = contextForEntry(workItemBase, entry);
  if (!isRiskAcceptance(context)) return [];

  const missing = [];
  if (!hasOwner(context)) missing.push("owner");
  if (!hasImpact(context)) missing.push("impact/risk");
  if (!hasTrigger(context)) missing.push("revalidation trigger");
  if (missing.length === 0) return [];

  return [
    issue(
      "FAIL",
      "risk-acceptance-incomplete",
      entry.path,
      entry.line,
      `风险接受 / 外部补证记录缺少 ${missing.join(", ")}；manual-confirmed / deferred 必须可追责、可复验。`,
    ),
  ];
}

export function decisionQualitySummary(diagnosis) {
  const checkpoints = diagnosis.decision_checkpoints ?? {
    open: [],
    confirmed: [],
    risk_acceptance: [],
    summary: { open: 0, confirmed: 0, risk_acceptance: 0 },
  };
  const workItemBase = diagnosis.work_item?.path;
  const issues = [];

  for (const entry of checkpoints.open ?? []) {
    issues.push(
      issue(
        "FAIL",
        "open-decision",
        entry.path,
        entry.line,
        `${entry.marker || "NEEDS decision"} 尚未关闭：${entry.text}`,
        "decision-brief",
      ),
    );
  }

  if (workItemBase) {
    for (const entry of checkpoints.confirmed ?? []) {
      issues.push(...classifyConfirmedDecision(workItemBase, entry));
    }
    for (const entry of checkpoints.risk_acceptance ?? []) {
      issues.push(...classifyRiskAcceptance(workItemBase, entry));
    }
  }

  return {
    work_item: diagnosis.work_item ?? null,
    summary: {
      open: checkpoints.summary.open,
      confirmed: checkpoints.summary.confirmed,
      risk_acceptance: checkpoints.summary.risk_acceptance,
      fail: issues.filter((item) => item.severity === "FAIL").length,
      warn: issues.filter((item) => item.severity === "WARN").length,
    },
    issues,
  };
}
