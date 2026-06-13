import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  abs,
  exists,
  effectiveSchema,
  localDateIso,
  loadSchema,
  parseField,
  readText,
  resolveWorkItem,
} from "../../lib/specforge.mjs";
import { summarizeOutput } from "../../lib/artifact-summary.mjs";
import { actionCommands, actionReason, actionState, readingOrder, traceabilityPolicyLine, traceGapCount } from "../../lib/action-board.mjs";
import { diagnoseWorkItem, gateLine } from "../../lib/diagnostics.mjs";
import { workflowHealth } from "../../lib/workflow-health.mjs";
import { qualitySuiteSummary } from "../../lib/quality-suite.mjs";
import { contractForArtifact, focusArtifactId } from "../../lib/stage-contracts.mjs";

const args = process.argv.slice(2);

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

const requestedWorkItem = argValue("--work-item");
const requestedOutput = argValue("--output");
const stdout = args.includes("--stdout");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function renderLines(lines) {
  return `<pre>${escapeHtml(lines.join("\n"))}</pre>`;
}

function renderStatusBadge(value) {
  const normalized = String(value ?? "").toLowerCase();
  const className = ["approved", "done", "pass"].includes(normalized)
    ? "ok"
    : ["request_changes", "rejected", "blocked", "fail"].includes(normalized)
      ? "bad"
      : ["ready", "partial", "pending"].includes(normalized)
        ? "warn"
        : "neutral";
  return `<span class="badge ${className}">${escapeHtml(value || "N/A")}</span>`;
}

function statusClass(status) {
  const normalized = String(status ?? "").toLowerCase();
  if (["approved", "done", "pass"].includes(normalized)) return "ok";
  if (["request_changes", "rejected", "blocked", "fail"].includes(normalized)) return "bad";
  if (["ready", "partial", "pending"].includes(normalized)) return "warn";
  return "neutral";
}

function renderList(items, emptyText, renderItem) {
  if (!items || items.length === 0) return `<p class="muted">${escapeHtml(emptyText)}</p>`;
  return `<ul>${items.map(renderItem).join("")}</ul>`;
}

function renderCommandBlock(commands) {
  return `<pre><code>${escapeHtml(commands.join("\n"))}</code></pre>`;
}

function activeContract(diagnosis, workItemYaml) {
  const workflow = parseField(workItemYaml, "workflow") || "standard";
  const schema = effectiveSchema(loadSchema(workflow), workItemYaml);
  return contractForArtifact(schema, focusArtifactId(diagnosis));
}

function truncate(value, max = 22) {
  const text = String(value ?? "");
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function renderArtifactFlow(artifacts) {
  const nodeWidth = 210;
  const nodeHeight = 70;
  const gapX = 48;
  const gapY = 46;
  const perRow = 4;
  const margin = 28;
  const rows = Math.max(1, Math.ceil(artifacts.length / perRow));
  const width = margin * 2 + perRow * nodeWidth + (perRow - 1) * gapX;
  const height = margin * 2 + rows * nodeHeight + (rows - 1) * gapY;
  const positions = new Map();

  artifacts.forEach((artifact, index) => {
    const row = Math.floor(index / perRow);
    const col = index % perRow;
    const x = margin + col * (nodeWidth + gapX);
    const y = margin + row * (nodeHeight + gapY);
    positions.set(artifact.id, { x, y });
  });

  const edges = artifacts
    .flatMap((artifact) =>
      artifact.requires.map((dependency) => {
        const from = positions.get(dependency);
        const to = positions.get(artifact.id);
        if (!from || !to) return "";
        const startX = from.x + nodeWidth;
        const startY = from.y + nodeHeight / 2;
        const endX = to.x;
        const endY = to.y + nodeHeight / 2;
        const midX = startX + Math.max(20, (endX - startX) / 2);
        return `<path d="M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX - 8} ${endY}" class="flow-edge" marker-end="url(#arrow)" />`;
      }),
    )
    .join("");

  const nodes = artifacts
    .map((artifact) => {
      const position = positions.get(artifact.id);
      const title = `${artifact.id} · ${artifact.title}`;
      return `
        <a href="#artifact-${slug(artifact.id)}" aria-label="${escapeHtml(title)}">
          <g class="flow-node ${statusClass(artifact.status)}" transform="translate(${position.x} ${position.y})">
            <rect width="${nodeWidth}" height="${nodeHeight}" rx="8"></rect>
            <text x="14" y="25" class="flow-title">${escapeHtml(truncate(artifact.id, 24))}</text>
            <text x="14" y="47" class="flow-subtitle">${escapeHtml(truncate(artifact.title, 26))}</text>
            <text x="${nodeWidth - 14}" y="25" text-anchor="end" class="flow-status">${escapeHtml(artifact.status)}</text>
          </g>
        </a>
      `;
    })
    .join("");

  return `
    <div class="flow-wrap" role="img" aria-label="Artifact dependency graph">
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="auto">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L8,3 z" class="flow-arrow"></path>
          </marker>
        </defs>
        ${edges}
        ${nodes}
      </svg>
    </div>
  `;
}

function renderArtifactCards(workItemBase, artifacts) {
  return artifacts
    .map((artifact) => {
      const outputs = artifact.outputs
        .map((output) => {
          const path = output.output;
          const fileExists = exists(`${workItemBase}/${path}`);
          const summary = summarizeOutput(workItemBase, path, 10);
          return `
            <article class="output">
              <h4>${escapeHtml(path)} ${renderStatusBadge(fileExists ? "exists" : "missing")}</h4>
              <p class="muted">${escapeHtml(summary.heading)} · ${escapeHtml(summary.source)}</p>
              ${renderLines(summary.lines)}
            </article>
          `;
        })
        .join("");
      const deps = artifact.requires.length > 0 ? artifact.requires.join(", ") : "none";
      return `
        <section class="card" id="artifact-${slug(artifact.id)}">
          <h3>${escapeHtml(artifact.id)} · ${escapeHtml(artifact.title)}</h3>
          <p>${renderStatusBadge(artifact.status)} <span class="muted">stage=${escapeHtml(artifact.stage)}; requires=${escapeHtml(deps)}</span></p>
          ${artifact.gate ? `<p>Gate ${escapeHtml(artifact.gate)}: ${renderStatusBadge(artifact.gateStatus)} <span class="muted">${escapeHtml(artifact.gateEvidence ?? "no evidence")}</span></p>` : ""}
          ${outputs}
        </section>
      `;
    })
    .join("");
}

function renderTraceability(traceability) {
  if (!traceability) return `<p class="muted">No traceability summary available.</p>`;
  const summary = traceability.summary;
  const topGaps = [
    ...traceability.gaps.uncovered_sources.slice(0, 5).map((item) => ({
      type: "Uncovered source",
      id: item.id,
      location: `${item.path}:${item.line}`,
      text: item.text,
    })),
    ...traceability.gaps.tasks_missing_trace.slice(0, 5).map((task) => ({
      type: "Task missing trace",
      id: task.id,
      location: `${task.path}:${task.line}`,
      text: task.title,
    })),
    ...traceability.gaps.tasks_missing_verification.slice(0, 5).map((task) => ({
      type: "Task missing verification",
      id: task.id,
      location: `${task.path}:${task.line}`,
      text: task.title,
    })),
  ].slice(0, 10);

  return `
    <div class="summary" aria-label="Traceability summary">
      <div class="metric">Source Items<strong>${escapeHtml(summary.source_items)}</strong></div>
      <div class="metric">Tasks<strong>${escapeHtml(summary.tasks)}</strong></div>
      <div class="metric">Verification Items<strong>${escapeHtml(summary.verification_items)}</strong></div>
      <div class="metric">Uncovered Sources<strong>${escapeHtml(summary.uncovered_sources)}</strong></div>
      <div class="metric">Tasks Missing Trace<strong>${escapeHtml(summary.tasks_missing_trace)}</strong></div>
      <div class="metric">Tasks Missing Verification<strong>${escapeHtml(summary.tasks_missing_verification)}</strong></div>
      <div class="metric">Tasks Without TestCase<strong>${escapeHtml(summary.tasks_without_testcase)}</strong></div>
    </div>
    <table>
      <thead><tr><th>Gap</th><th>ID</th><th>Location</th><th>Excerpt</th></tr></thead>
      <tbody>
        ${topGaps.map((gap) => `<tr><td>${escapeHtml(gap.type)}</td><td>${escapeHtml(gap.id)}</td><td>${escapeHtml(gap.location)}</td><td>${escapeHtml(gap.text)}</td></tr>`).join("") || `<tr><td colspan="4">No traceability gaps.</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderHealth(health) {
  if (!health) return `<p class="muted">No workflow health summary available.</p>`;
  return `
    <div class="summary" aria-label="Workflow health summary">
      <div class="metric">Health Score<strong>${escapeHtml(health.score ?? "N/A")}${health.score === null ? "" : "/100"}</strong></div>
      <div class="metric">Health Level<strong>${escapeHtml(health.level)}</strong></div>
      <div class="metric">Priorities<strong>${escapeHtml(health.priorities.length)}</strong></div>
    </div>
    <table>
      <thead><tr><th>Dimension</th><th>Status</th><th>Count</th><th>Penalty</th></tr></thead>
      <tbody>
        ${health.dimensions.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${renderStatusBadge(item.status)}</td><td>${escapeHtml(item.count)}</td><td>${escapeHtml(item.penalty)}</td></tr>`).join("") || `<tr><td colspan="4">No dimensions.</td></tr>`}
      </tbody>
    </table>
    <h3>Top Priorities</h3>
    ${renderList(health.priorities, "No priorities.", (item) => `<li>${renderStatusBadge(item.severity)} <strong>${escapeHtml(item.area)}</strong>: ${escapeHtml(item.message)} <span class="muted">route=${escapeHtml(item.route || "N/A")}</span></li>`)}
  `;
}

function renderQualitySuite(qualitySuite) {
  if (!qualitySuite?.work_item) return `<p class="muted">No active work item quality suite.</p>`;
  return `
    <div class="summary" aria-label="Quality suite summary">
      <div class="metric">Overall<strong>${renderStatusBadge(qualitySuite.summary.overall)}</strong></div>
      <div class="metric">Checks<strong>${escapeHtml(qualitySuite.summary.checked)}</strong><span>${escapeHtml(qualitySuite.summary.skipped)} skipped by stage</span></div>
      <div class="metric">Failures<strong>${escapeHtml(qualitySuite.summary.failures)}</strong></div>
      <div class="metric">Warnings<strong>${escapeHtml(qualitySuite.summary.warnings)}</strong></div>
    </div>
    <h3>Recommended Commands</h3>
    ${renderCommandBlock(qualitySuite.recommended_commands.length > 0 ? qualitySuite.recommended_commands : ["# none"])}
    <table>
      <thead><tr><th>Check</th><th>Status</th><th>Fail</th><th>Warn</th><th>Route</th><th>Message</th></tr></thead>
      <tbody>
        ${qualitySuite.checks
          .map((item) => `<tr><td>${escapeHtml(item.title)}</td><td>${renderStatusBadge(item.status)}</td><td>${escapeHtml(item.failures)}</td><td>${escapeHtml(item.warnings)}</td><td>${escapeHtml(item.route ?? "N/A")}</td><td>${escapeHtml(item.message)}</td></tr>`)
          .join("") || `<tr><td colspan="6">No checks.</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderQualityHotspots(qualitySuite) {
  const issues = (qualitySuite?.checks ?? [])
    .filter((check) => check.status !== "PASS")
    .flatMap((check) =>
      (check.issues ?? []).slice(0, 3).map((issue) => ({
        check: check.title,
        severity: issue.severity ?? check.status,
        path: issue.path ?? "N/A",
        message: issue.message ?? check.message,
      })),
    )
    .slice(0, 5);

  return renderList(
    issues,
    "No quality hotspots.",
    (item) => `<li>${renderStatusBadge(item.severity)} <strong>${escapeHtml(item.check)}</strong> <span class="muted">${escapeHtml(item.path)}</span><br>${escapeHtml(item.message)}</li>`,
  );
}

function renderCurrentFocus(diagnosis, contract, qualitySuite) {
  const artifact = (diagnosis.artifacts ?? []).find((item) => item.id === contract?.id);
  if (!contract) return `<p class="muted">No current stage contract available.</p>`;

  return `
    <div class="summary" aria-label="Current focus summary">
      <div class="metric">Artifact<strong>${escapeHtml(contract.id)}</strong><span>${escapeHtml(contract.title)}</span></div>
      <div class="metric">Status<strong>${renderStatusBadge(artifact?.status ?? "unknown")}</strong><span>${escapeHtml(contract.stage)}</span></div>
      <div class="metric">Gate<strong>${escapeHtml(contract.gate ?? "N/A")}</strong></div>
      <div class="metric">Quality<strong>${renderStatusBadge(qualitySuite.summary.overall)}</strong><span>${escapeHtml(`${qualitySuite.summary.failures} fail / ${qualitySuite.summary.warnings} warn`)}</span></div>
    </div>
    <div class="grid two">
      <section class="card">
        <h3>Exit Standard</h3>
        <p>${escapeHtml(contract.exit)}</p>
        <h3>Must Prove</h3>
        ${renderList(contract.must_prove, "N/A", (item) => `<li>${escapeHtml(item)}</li>`)}
      </section>
      <section class="card">
        <h3>Human Decisions</h3>
        ${renderList(contract.human_decisions, "none", (item) => `<li>${escapeHtml(item)}</li>`)}
        <h3>Quality Hotspots</h3>
        ${renderQualityHotspots(qualitySuite)}
      </section>
    </div>
  `;
}

function renderActionBoard(diagnosis, health, qualitySuite) {
  const state = actionState(diagnosis, health);
  const topPriority = health.priorities?.[0];
  const openDecision = diagnosis.decision_checkpoints?.open?.[0];
  const blocker = diagnosis.blockers?.[0];
  const nextText = actionReason(diagnosis);
  const commands = [...new Set([...actionCommands(diagnosis), ...(qualitySuite?.recommended_commands ?? [])])];

  return `
    <section id="action-board" class="action-board">
      <div>
        <p class="eyebrow">Action Board</p>
        <h2>${escapeHtml(state)}</h2>
        <p>${escapeHtml(nextText)}</p>
        <p class="muted">Route: ${escapeHtml(diagnosis.route)} · Ready artifact: ${escapeHtml(diagnosis.ready_artifact ?? "none")} · Traceability policy: ${escapeHtml(traceabilityPolicyLine(diagnosis.traceability_policy))}</p>
      </div>
      <div class="action-grid">
        <article class="metric">Health<strong>${escapeHtml(health.score ?? "N/A")}${health.score === null ? "" : "/100"}</strong><span>${escapeHtml(health.level)}</span></article>
        <article class="metric">Open Decisions<strong>${escapeHtml(diagnosis.decision_checkpoints?.summary?.open ?? 0)}</strong><span>${escapeHtml(openDecision?.marker ?? "none")}</span></article>
        <article class="metric">Blockers<strong>${escapeHtml(diagnosis.blockers?.length ?? 0)}</strong><span>${escapeHtml(blocker?.severity ?? "none")}</span></article>
        <article class="metric">Trace Gaps<strong>${escapeHtml(traceGapCount(diagnosis.traceability))}</strong><span>${escapeHtml(diagnosis.traceability_policy?.mode ?? "advisory")}</span></article>
        <article class="metric">Quality<strong>${renderStatusBadge(qualitySuite?.summary?.overall ?? "N/A")}</strong><span>${escapeHtml(`${qualitySuite?.summary?.failures ?? 0} fail / ${qualitySuite?.summary?.warnings ?? 0} warn`)}</span></article>
      </div>
      <div class="grid two">
        <section class="card">
          <h3>Next Commands</h3>
          ${renderCommandBlock(commands)}
        </section>
        <section class="card">
          <h3>Read First</h3>
          <ol>
            ${readingOrder().map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ol>
          ${topPriority ? `<p class="muted">Top priority: [${escapeHtml(topPriority.severity)}] ${escapeHtml(topPriority.message)}</p>` : ""}
        </section>
      </div>
    </section>
  `;
}

function decisionKind(marker = "") {
  const normalized = String(marker).toUpperCase();
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

function approvalBoundary(diagnosis, contract) {
  const artifact = contract?.id ?? diagnosis.ready_artifact ?? "current artifact";
  return `本次确认只授权 ${artifact} 按 ${diagnosis.route} 继续推进；不代表批准生产发布、范围扩大或无关实现。`;
}

function renderHumanRequest(diagnosis, contract, topDecision) {
  if (!topDecision) return renderLines(["No open decision markers. No human reply is required right now."]);
  return renderLines([
    "请确认 SpecForge 当前决策点：",
    "",
    `- 需求 / 工作项：${diagnosis.work_item?.title || diagnosis.work_item?.id}`,
    `- 当前阶段：${contract?.id ?? diagnosis.ready_artifact ?? "N/A"} / ${diagnosis.route}`,
    `- 决策位置：${topDecision.path}:${topDecision.line}`,
    `- 待确认内容：${topDecision.text}`,
    `- 可选回复方向：${responseOptions(topDecision.marker)}`,
    `- 批准边界：${approvalBoundary(diagnosis, contract)}`,
    "",
    "建议直接按下面格式回复：",
    "",
    "Decision:",
    "Scope:",
    "Rationale:",
    "Risk acceptance: yes / no / N/A",
    "Owner:",
    "Revalidation trigger:",
  ]);
}

function renderDecisionBrief(diagnosis, contract) {
  const checkpoints = diagnosis.decision_checkpoints;
  const topDecision = checkpoints?.open?.[0];

  if (!topDecision) {
    return `
      <p class="muted">No open decision markers. Use this section when a future gate or stage needs human approval, clarification, or risk acceptance.</p>
      <p><code>node .specforge/core/scripts/decision-brief.mjs</code></p>
    `;
  }

  return `
    <div class="summary" aria-label="Decision brief summary">
      <div class="metric">Open Decisions<strong>${escapeHtml(checkpoints.summary.open)}</strong></div>
      <div class="metric">Decision Kind<strong>${escapeHtml(decisionKind(topDecision.marker))}</strong></div>
      <div class="metric">Risk Candidates<strong>${escapeHtml(checkpoints.summary.risk_acceptance)}</strong></div>
      <div class="metric">Command<strong>decision-brief</strong></div>
    </div>
    <section class="card">
      <h3>Top Decision</h3>
      <h4>Human Request</h4>
      ${renderHumanRequest(diagnosis, contract, topDecision)}
      <p>${renderStatusBadge(topDecision.marker)} <span class="muted">${escapeHtml(topDecision.path)}:${escapeHtml(topDecision.line)}</span></p>
      <p>${escapeHtml(topDecision.text)}</p>
      <p><strong>Acceptable responses:</strong> ${escapeHtml(responseOptions(topDecision.marker))}</p>
      <p><strong>Approval boundary:</strong> ${escapeHtml(approvalBoundary(diagnosis, contract))}</p>
      <h4>Reply Format</h4>
      ${renderLines([
        "Decision: approve / reject / choose option / defer / ask for more evidence",
        "Scope:",
        "Rationale:",
        "Risk acceptance: yes / no / N/A",
        "Owner:",
        "Revalidation trigger:",
      ])}
    </section>
  `;
}

function render(diagnosis, workItemYaml, generatedAt) {
  const item = diagnosis.work_item;
  const title = `${item.id} - ${item.title || "SpecForge Work Report"}`;
  const progress = `${diagnosis.progress.done}/${diagnosis.progress.total}`;
  const qualitySuite = qualitySuiteSummary(diagnosis);
  const health = workflowHealth(diagnosis, { qualitySuite });
  const contract = activeContract(diagnosis, workItemYaml);
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f7f8fb;
      --panel: #ffffff;
      --text: #20242a;
      --muted: #667085;
      --line: #d8dde8;
      --accent: #245fce;
      --ok: #137333;
      --warn: #a15c00;
      --bad: #b3261e;
      --neutral: #4b5565;
      --flow-edge: #98a2b3;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font: 14px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    header {
      background: var(--panel);
      border-bottom: 1px solid var(--line);
      padding: 24px clamp(16px, 4vw, 48px);
    }
    main {
      padding: 24px clamp(16px, 4vw, 48px) 48px;
      max-width: 1280px;
      margin: 0 auto;
    }
    h1, h2, h3, h4 { line-height: 1.25; margin: 0 0 12px; }
    h1 { font-size: 28px; }
    h2 { font-size: 20px; margin-top: 28px; }
    h3 { font-size: 16px; }
    h4 { font-size: 14px; }
    nav {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
    }
    nav a {
      color: var(--accent);
      text-decoration: none;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 6px 10px;
      background: #fbfcff;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--panel);
      border: 1px solid var(--line);
    }
    th, td {
      border-bottom: 1px solid var(--line);
      padding: 10px 12px;
      text-align: left;
      vertical-align: top;
    }
    th { background: #eef2f8; }
    pre {
      margin: 0;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-word;
      background: #f4f6fa;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 10px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-top: 16px;
    }
    .metric, .card, .output {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 14px;
    }
    .metric strong {
      display: block;
      font-size: 18px;
      margin-top: 4px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 14px;
    }
    .two { grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); }
    .action-board {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 18px;
      margin-bottom: 24px;
    }
    .action-board h2 {
      font-size: 24px;
      margin-bottom: 8px;
    }
    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 12px;
      margin: 16px 0;
    }
    .eyebrow {
      margin: 0 0 4px;
      color: var(--accent);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0;
    }
    ol { margin: 0; padding-left: 20px; }
    .output { margin-top: 10px; }
    .badge {
      display: inline-block;
      border-radius: 999px;
      padding: 2px 8px;
      font-size: 12px;
      border: 1px solid currentColor;
      font-weight: 600;
    }
    .ok { color: var(--ok); }
    .warn { color: var(--warn); }
    .bad { color: var(--bad); }
    .neutral { color: var(--neutral); }
    .muted { color: var(--muted); }
    .flow-wrap {
      overflow-x: auto;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 10px;
      margin-bottom: 14px;
    }
    .flow-edge {
      fill: none;
      stroke: var(--flow-edge);
      stroke-width: 2;
    }
    .flow-arrow { fill: var(--flow-edge); }
    .flow-node rect {
      fill: #ffffff;
      stroke: currentColor;
      stroke-width: 2;
    }
    .flow-node text {
      fill: var(--text);
      font-size: 13px;
      dominant-baseline: middle;
      pointer-events: none;
    }
    .flow-node .flow-title { font-weight: 700; }
    .flow-node .flow-subtitle { fill: var(--muted); }
    .flow-node .flow-status {
      font-size: 11px;
      font-weight: 700;
      fill: currentColor;
    }
  </style>
</head>
<body>
  <header>
    <p class="muted">SpecForge derived report · Markdown artifacts remain the source of truth</p>
    <h1>${escapeHtml(title)}</h1>
    <div class="summary" aria-label="Work item summary">
      <div class="metric">Workflow<strong>${escapeHtml(item.workflow)}</strong></div>
      <div class="metric">Stage<strong>${escapeHtml(item.stage)}</strong></div>
      <div class="metric">Progress<strong>${escapeHtml(progress)}</strong></div>
      <div class="metric">Health<strong>${escapeHtml(health.score ?? "N/A")}${health.score === null ? "" : "/100"}</strong></div>
      <div class="metric">Route<strong>${escapeHtml(diagnosis.route)}</strong></div>
      <div class="metric">Generated<strong>${escapeHtml(generatedAt)}</strong></div>
    </div>
    <nav aria-label="Report sections">
      <a href="#action-board">Action Board</a>
      <a href="#current-focus">Current Focus</a>
      <a href="#route">Route</a>
      <a href="#health">Health</a>
      <a href="#quality-suite">Quality Suite</a>
      <a href="#gates">Gates</a>
      <a href="#graph">Artifact Graph</a>
      <a href="#traceability">Traceability</a>
      <a href="#warnings">Warnings</a>
      <a href="#decision-checkpoints">Decisions</a>
      <a href="#decision-brief">Decision Brief</a>
      <a href="#artifacts">Artifact Excerpts</a>
    </nav>
  </header>
  <main>
    ${renderActionBoard(diagnosis, health, qualitySuite)}

    <section id="current-focus">
      <h2>Current Focus</h2>
      <p class="muted">The smallest useful reading layer for the current stage: what is being produced, what must be proven, what needs human judgment, and which quality issues should be fixed first.</p>
      ${renderCurrentFocus(diagnosis, contract, qualitySuite)}
    </section>

    <section id="route">
      <h2>Route</h2>
      <p>${escapeHtml(diagnosis.route_reason)}</p>
      <p class="muted">Work path: ${escapeHtml(item.path)}</p>
      <p class="muted">Title source: ${escapeHtml(parseField(workItemYaml, "title") || "N/A")}</p>
    </section>

    <section id="health">
      <h2>Workflow Health</h2>
      <p class="muted">A derived readiness score for scanning blockers, human decisions, quality warnings, traceability, and gates. It is advisory and does not replace gate evidence.</p>
      ${renderHealth(health)}
    </section>

    <section id="quality-suite">
      <h2>Quality Suite</h2>
      <p class="muted">Stage-aware quality checks for artifact readability, decision closure, traceability, source quality, implementation ledger, evidence, wiki, and closure readiness. Markdown artifacts remain the source of truth.</p>
      ${renderQualitySuite(qualitySuite)}
    </section>

    <section id="gates">
      <h2>Gates</h2>
      <p>${escapeHtml(gateLine(diagnosis.gates))}</p>
      <table>
        <thead><tr><th>Gate</th><th>Status</th><th>Evidence</th><th>Evidence Exists</th></tr></thead>
        <tbody>
          ${diagnosis.gates
            .map((gate) => `<tr><td>${escapeHtml(gate.gate)}</td><td>${renderStatusBadge(gate.status)}</td><td>${escapeHtml(gate.evidence ?? "N/A")}</td><td>${escapeHtml(gate.evidenceExists ? "yes" : "no")}</td></tr>`)
            .join("") || `<tr><td colspan="4">No gates.</td></tr>`}
        </tbody>
      </table>
    </section>

    <section id="graph">
      <h2>Artifact Graph</h2>
      ${renderArtifactFlow(diagnosis.artifacts)}
      <table>
        <thead><tr><th>Artifact</th><th>Status</th><th>Stage</th><th>Requires</th><th>Missing Deps</th></tr></thead>
        <tbody>
          ${diagnosis.artifacts
            .map((artifact) => `<tr><td><a href="#artifact-${slug(artifact.id)}">${escapeHtml(artifact.id)}</a></td><td>${renderStatusBadge(artifact.status)}</td><td>${escapeHtml(artifact.stage)}</td><td>${escapeHtml(artifact.requires.join(", ") || "none")}</td><td>${escapeHtml(artifact.missingDeps.join(", ") || "none")}</td></tr>`)
            .join("")}
        </tbody>
      </table>
    </section>

    <section id="traceability">
      <h2>Traceability</h2>
      <p class="muted">Source IDs, tasks, and verification IDs are summarized to expose gaps early. Policy: ${escapeHtml(traceabilityPolicyLine(diagnosis.traceability_policy))}.</p>
      ${renderTraceability(diagnosis.traceability)}
    </section>

    <section id="warnings">
      <h2>Blockers And Quality Warnings</h2>
      <h3>Blockers</h3>
      ${renderList(diagnosis.blockers, "No blockers.", (blocker) => `<li>${renderStatusBadge(blocker.severity)} ${escapeHtml(blocker.message)} <span class="muted">route=${escapeHtml(blocker.route)}</span></li>`)}
      <h3>Quality Warnings</h3>
      ${renderList(diagnosis.quality_warnings, "No quality warnings.", (warning) => `<li>${renderStatusBadge(warning.severity)} ${escapeHtml(warning.message)} <span class="muted">missing=${escapeHtml((warning.missing_sections ?? []).join(", ") || "N/A")}</span></li>`)}
    </section>

    <section id="decision-checkpoints">
      <h2>Decision Checkpoints</h2>
      <p>
        ${renderStatusBadge(`open=${diagnosis.decision_checkpoints?.summary?.open ?? 0}`)}
        ${renderStatusBadge(`confirmed=${diagnosis.decision_checkpoints?.summary?.confirmed ?? 0}`)}
        ${renderStatusBadge(`risk=${diagnosis.decision_checkpoints?.summary?.risk_acceptance ?? 0}`)}
      </p>
      <h3>Open Decisions</h3>
      ${renderList(diagnosis.decision_checkpoints?.open, "No open decision markers.", (item) => `<li><strong>${escapeHtml(item.marker)}</strong> <span class="muted">${escapeHtml(item.path)}:${escapeHtml(item.line)}</span><br>${escapeHtml(item.text)}</li>`)}
      <h3>Risk Acceptance Candidates</h3>
      ${renderList(diagnosis.decision_checkpoints?.risk_acceptance, "No risk acceptance candidates.", (item) => `<li><span class="muted">${escapeHtml(item.path)}:${escapeHtml(item.line)}</span><br>${escapeHtml(item.text)}</li>`)}
    </section>

    <section id="decision-brief">
      <h2>Decision Brief</h2>
      <p class="muted">A compact, human-facing approval package for open decisions. Markdown remains the source of truth; this section is generated from current markers and diagnostics.</p>
      ${renderDecisionBrief(diagnosis, contract)}
    </section>

    <section id="artifacts">
      <h2>Artifact Excerpts</h2>
      <div class="grid">
        ${renderArtifactCards(item.path, diagnosis.artifacts)}
      </div>
    </section>
  </main>
</body>
</html>
`;
}

try {
  const workItem = resolveWorkItem({
    workItem: requestedWorkItem,
    activeOnly: false,
    defaultToLatestArchive: true,
  });
  const diagnosis = diagnoseWorkItem({ workItem: workItem.name, activeOnly: false });
  const workItemYaml = readText(`${workItem.base}/work.yaml`);
  const generatedAt = localDateIso();
  const html = render(diagnosis, workItemYaml, generatedAt);
  const output = requestedOutput ?? `${workItem.base}/07-report/work-summary.html`;

  if (stdout) {
    console.log(html);
  } else {
    mkdirSync(dirname(abs(output)), { recursive: true });
    writeFileSync(abs(output), html, "utf8");
    console.log(`Rendered SpecForge work report: ${output}`);
    console.log("Markdown artifacts remain the source of truth.");
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
