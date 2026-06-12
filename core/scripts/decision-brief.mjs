import { diagnoseWorkspace, diagnoseWorkItem } from "./lib/diagnostics.mjs";
import { contractForArtifact, focusArtifactId } from "./lib/stage-contracts.mjs";
import { effectiveSchema, loadSchema, localDateIso, parseField, readText, resolveWorkItem } from "./lib/specforge.mjs";
import { qualitySuiteSummary } from "./lib/quality-suite.mjs";

const args = process.argv.slice(2);
const json = args.includes("--json");

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function bullet(items, emptyText, renderItem = (item) => item) {
  if (!items || items.length === 0) return `- ${emptyText}`;
  return items.map((item) => `- ${renderItem(item)}`).join("\n");
}

function activeContract(diagnosis) {
  if (!diagnosis.work_item) return null;
  const yaml = readText(`${diagnosis.work_item.path}/work.yaml`);
  const workflow = parseField(yaml, "workflow") || "standard";
  const schema = effectiveSchema(loadSchema(workflow), yaml);
  return contractForArtifact(schema, focusArtifactId(diagnosis));
}

function decisionKind(marker = "") {
  const normalized = marker.toUpperCase();
  if (normalized.includes("DEPENDENCY")) return "dependency";
  if (normalized.includes("TOOLING")) return "tooling";
  if (normalized.includes("TECH")) return "technical direction";
  if (normalized.includes("UI")) return "UI direction";
  if (normalized.includes("PRODUCT")) return "product direction";
  if (normalized.includes("CLARIFICATION")) return "clarification";
  return "decision";
}

function responseOptions(marker = "") {
  const kind = decisionKind(marker);
  if (kind === "dependency") return "approve dependency / reject dependency / ask for alternatives / defer with owner";
  if (kind === "tooling") return "approve tooling / keep existing tooling / ask for comparison / defer with trigger";
  if (kind === "technical direction") return "approve design direction / choose simpler option / ask for ADR / defer";
  if (kind === "UI direction") return "approve direction / request prototype / choose alternate flow / mark no UI impact";
  if (kind === "product direction") return "approve MVP / narrow scope / split follow-up / reject";
  if (kind === "clarification") return "answer question / mark N/A / authorize default / defer";
  return "approve / reject / ask for more evidence / defer";
}

function topDecision(checkpoints) {
  return checkpoints?.open?.[0] ?? null;
}

function decisionLocation(decision) {
  return decision ? `${decision.path}:${decision.line}` : "N/A";
}

function approvalBoundary(diagnosis, contract) {
  if (!diagnosis.work_item) return "当前没有 active work item。";
  const next = diagnosis.route ?? "next stage";
  const artifact = contract?.id ?? diagnosis.ready_artifact ?? "current artifact";
  return `本次确认只授权 ${artifact} 按 ${next} 继续推进；不代表批准生产发布、范围扩大或无关实现。`;
}

function humanRequest(diagnosis, contract, decision, options) {
  if (!decision) return "No open decision markers. No human reply is required right now.";
  return `请确认 SpecForge 当前决策点：

- 需求 / 工作项：${diagnosis.work_item?.title || diagnosis.work_item?.id}
- 当前阶段：${contract?.id ?? diagnosis.ready_artifact ?? "N/A"} / ${diagnosis.route}
- 决策位置：${decisionLocation(decision)}
- 待确认内容：${decision.text}
- 可选回复方向：${options}
- 批准边界：${approvalBoundary(diagnosis, contract)}

建议直接按下面格式回复：

Decision:
Scope:
Rationale:
Risk acceptance: yes / no / N/A
Owner:
Revalidation trigger:`;
}

function traceabilitySummaryLine(traceability) {
  if (!traceability) return "unavailable";
  const summary = traceability.summary;
  return `sources=${summary.source_items}, tasks=${summary.tasks}, verification=${summary.verification_items}, uncovered=${summary.uncovered_sources}, missing_trace=${summary.tasks_missing_trace}, missing_verification=${summary.tasks_missing_verification}, missing_testcase=${summary.tasks_without_testcase}`;
}

function markdown(diagnosis) {
  const generated = localDateIso();
  if (!diagnosis.work_item) {
    return `# SpecForge Decision Brief

No active work item.

- Route: ${diagnosis.route}
- Reason: ${diagnosis.route_reason}
- Generated: ${generated}
`;
  }

  const item = diagnosis.work_item;
  const checkpoints = diagnosis.decision_checkpoints;
  const contract = activeContract(diagnosis);
  const decision = topDecision(checkpoints);
  const options = responseOptions(decision?.marker);
  const qualitySuite = qualitySuiteSummary(diagnosis);

  return `# SpecForge Decision Brief: ${item.id}

## Snapshot

- Title: ${item.title || "N/A"}
- Path: ${item.path}
- Workflow: ${item.workflow}@${diagnosis.schema.version}
- Stage: ${item.stage}
- Route: ${diagnosis.route}
- Generated: ${generated}

## Human Request

\`\`\`text
${humanRequest(diagnosis, contract, decision, options)}
\`\`\`

## Decision Needed

${decision ? `- Marker: ${decision.marker}
- Location: ${decision.path}:${decision.line}
- Question / context: ${decision.text}
- Decision kind: ${decisionKind(decision.marker)}
- Acceptable responses: ${options}
- Approval boundary: ${approvalBoundary(diagnosis, contract)}
- Record back to: ${decision.path} near line ${decision.line}, replacing or closing the marker with the decision, owner, rationale, risk impact, and revalidation trigger.` : "- No open decision markers."}

## Recommended Reply Format

\`\`\`text
Decision: approve / reject / choose option / defer / ask for more evidence
Scope:
Rationale:
Risk acceptance: yes / no / N/A
Owner:
Revalidation trigger:
\`\`\`

## Current Stage Context

${contract ? `- Artifact: ${contract.id} · ${contract.title}
- Goal: ${contract.goal}
- Exit standard: ${contract.exit}

Must prove:

${bullet(contract.must_prove, "N/A")}` : "- N/A"}

## Evidence Snapshot

- Traceability: ${traceabilitySummaryLine(diagnosis.traceability)}
- Quality Suite: ${qualitySuite.summary.overall}; checked=${qualitySuite.summary.checked}; fail=${qualitySuite.summary.failures}; warn=${qualitySuite.summary.warnings}
- Blockers: ${diagnosis.blockers.length}
- Quality warnings: ${diagnosis.quality_warnings.length}
- Open decisions: ${checkpoints.summary.open}
- Risk acceptance candidates: ${checkpoints.summary.risk_acceptance}

## 需要升级确认而不是直接批准的情况

- 本次回复会改变用户可见行为、数据模型、权限、生产发布或外部依赖边界。
- 高风险假设缺少证据，且没有 owner / 重新验证触发条件。
- 人工回复会批准超过上方“批准边界”的内容。
- 对方回复“你看着办”，但该决策影响架构、安全、数据迁移或业务验收。

## Open Decisions

${bullet(checkpoints.open.slice(0, 10), "none", (entry) => `${entry.marker}: ${entry.path}:${entry.line} - ${entry.text}`)}

## Risk Acceptance Candidates

${bullet(checkpoints.risk_acceptance.slice(0, 10), "none", (entry) => `${entry.path}:${entry.line} - ${entry.text}`)}

## Blockers And Quality Warnings

Blockers:

${bullet(diagnosis.blockers.slice(0, 8), "none", (blocker) => `[${blocker.severity}] ${blocker.message} (route=${blocker.route}; owner=${blocker.owner_artifact})`)}

Quality warnings:

${bullet(diagnosis.quality_warnings.slice(0, 8), "none", (warning) => `[${warning.severity}] ${warning.message} (route=${warning.route}; owner=${warning.owner_artifact})`)}
`;
}

try {
  const requestedWorkItem = argValue("--work-item");
  let diagnosis;

  if (requestedWorkItem) {
    const workItem = resolveWorkItem({ workItem: requestedWorkItem, activeOnly: false });
    diagnosis = diagnoseWorkItem({ workItem: workItem.name, activeOnly: false });
  } else {
    diagnosis = diagnoseWorkspace();
  }

  if (json) {
    console.log(
      JSON.stringify(
        {
          work_item: diagnosis.work_item,
          top_decision: topDecision(diagnosis.decision_checkpoints),
          decision_checkpoints: diagnosis.decision_checkpoints,
          contract: activeContract(diagnosis),
          traceability: diagnosis.traceability,
          blockers: diagnosis.blockers,
          quality_warnings: diagnosis.quality_warnings,
        },
        null,
        2,
      ),
    );
    process.exit(0);
  }

  console.log(markdown(diagnosis));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
