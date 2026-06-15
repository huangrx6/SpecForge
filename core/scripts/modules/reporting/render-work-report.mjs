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
  return `<span class="badge ${className}">${escapeHtml(displayValue(value || "N/A"))}</span>`;
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

const valueLabels = new Map([
  ["N/A", "不适用"],
  ["none", "无"],
  ["unknown", "未知"],
  ["exists", "已存在"],
  ["missing", "缺失"],
  ["yes", "是"],
  ["no", "否"],
  ["PASS", "通过"],
  ["WARN", "警告"],
  ["FAIL", "失败"],
  ["READY", "可继续"],
  ["BLOCKED", "已阻断"],
  ["NEEDS_DECISION", "需要人工确认"],
  ["NEEDS_ATTENTION", "需要关注"],
  ["READY_FOR_INTAKE", "可进入 Intake"],
  ["APPROVED", "已批准"],
  ["REQUEST_CHANGES", "需修改"],
  ["REJECTED", "已拒绝"],
  ["PENDING", "待处理"],
  ["ready", "可继续"],
  ["blocked", "已阻断"],
  ["partial", "部分完成"],
  ["pending", "待处理"],
  ["done", "已完成"],
  ["pass", "通过"],
  ["fail", "失败"],
  ["healthy", "健康"],
  ["at_risk", "有风险"],
  ["needs_attention", "需要关注"],
  ["needs_decision", "需要决策"],
  ["ready_for_intake", "可进入 Intake"],
  ["advisory", "建议模式"],
]);

const artifactLabels = new Map([
  ["prd", "产品需求文档"],
  ["requirements", "需求规格"],
  ["ui_design", "界面设计"],
  ["technical_design", "技术设计"],
  ["tasks", "任务拆分"],
  ["spec_review", "规格评审"],
  ["implementation", "实现记录"],
  ["code_review", "代码评审"],
  ["verification", "验证报告"],
  ["wiki_sync", "知识沉淀"],
  ["closure", "关闭归档"],
  ["research", "调研"],
  ["gap_report", "问题分析"],
]);

const dimensionLabels = new Map([
  ["blockers", "阻断项"],
  ["human_decisions", "人工决策"],
  ["quality_warnings", "质量提醒"],
  ["traceability", "追踪关系"],
  ["gates", "门禁"],
  ["quality_suite", "质量套件"],
  ["blocker", "阻断项"],
  ["decision", "决策"],
  ["quality", "质量"],
  ["verification", "验证"],
  ["testcase", "测试用例"],
  ["next", "下一步"],
]);

const qualityCheckLabels = new Map([
  ["artifact-quality", "产物可读性"],
  ["decision-quality", "决策质量"],
  ["source-quality", "来源质量"],
  ["traceability", "追踪关系"],
  ["implementation-quality", "实现账本"],
  ["test-case-quality", "测试用例质量"],
  ["evidence-summary", "证据摘要"],
  ["wiki-quality", "Wiki 质量"],
  ["closure-quality", "关闭材料质量"],
]);

function displayValue(value) {
  const text = String(value ?? "");
  return valueLabels.get(text) ?? valueLabels.get(text.toLowerCase()) ?? text;
}

function artifactName(id, fallback = "") {
  const label = artifactLabels.get(String(id));
  return label ? `${label}（${id}）` : fallback ? `${fallback}（${id}）` : id;
}

function displayListValue(items) {
  if (!items || items.length === 0) return "无";
  return items.map((item) => artifactLabels.get(item) ?? item).join(", ");
}

function displayHealthDimension(name) {
  return dimensionLabels.get(String(name)) ?? name;
}

function displayQualityCheck(item) {
  return qualityCheckLabels.get(String(item?.id ?? "")) ?? item?.title ?? "";
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
            <text x="14" y="47" class="flow-subtitle">${escapeHtml(truncate(artifactLabels.get(artifact.id) ?? artifact.title, 26))}</text>
            <text x="${nodeWidth - 14}" y="25" text-anchor="end" class="flow-status">${escapeHtml(displayValue(artifact.status))}</text>
          </g>
        </a>
      `;
    })
    .join("");

  return `
    <div class="flow-wrap" role="img" aria-label="产物依赖图">
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
      const deps = displayListValue(artifact.requires);
      return `
        <section class="card" id="artifact-${slug(artifact.id)}">
          <h3>${escapeHtml(artifactName(artifact.id, artifact.title))}</h3>
          <p>${renderStatusBadge(artifact.status)} <span class="muted">阶段=${escapeHtml(displayValue(artifact.stage))}; 依赖=${escapeHtml(deps)}</span></p>
          ${artifact.gate ? `<p>门禁 ${escapeHtml(artifact.gate)}：${renderStatusBadge(artifact.gateStatus)} <span class="muted">${escapeHtml(artifact.gateEvidence ?? "无证据")}</span></p>` : ""}
          ${outputs}
        </section>
      `;
    })
    .join("");
}

function renderTraceability(traceability) {
  if (!traceability) return `<p class="muted">暂无追踪关系摘要。</p>`;
  const summary = traceability.summary;
  const topGaps = [
    ...traceability.gaps.uncovered_sources.slice(0, 5).map((item) => ({
      type: "未覆盖来源",
      id: item.id,
      location: `${item.path}:${item.line}`,
      text: item.text,
    })),
    ...traceability.gaps.tasks_missing_trace.slice(0, 5).map((task) => ({
      type: "任务缺少 Trace",
      id: task.id,
      location: `${task.path}:${task.line}`,
      text: task.title,
    })),
    ...traceability.gaps.tasks_missing_verification.slice(0, 5).map((task) => ({
      type: "任务缺少 Verification",
      id: task.id,
      location: `${task.path}:${task.line}`,
      text: task.title,
    })),
  ].slice(0, 10);

  return `
    <div class="summary" aria-label="追踪关系摘要">
      <div class="metric">来源项<strong>${escapeHtml(summary.source_items)}</strong></div>
      <div class="metric">任务<strong>${escapeHtml(summary.tasks)}</strong></div>
      <div class="metric">验证项<strong>${escapeHtml(summary.verification_items)}</strong></div>
      <div class="metric">未覆盖来源<strong>${escapeHtml(summary.uncovered_sources)}</strong></div>
      <div class="metric">缺少 Trace 的任务<strong>${escapeHtml(summary.tasks_missing_trace)}</strong></div>
      <div class="metric">缺少 Verification 的任务<strong>${escapeHtml(summary.tasks_missing_verification)}</strong></div>
      <div class="metric">未关联测试用例的任务<strong>${escapeHtml(summary.tasks_without_testcase)}</strong></div>
    </div>
    <table>
      <thead><tr><th>缺口</th><th>ID</th><th>位置</th><th>摘录</th></tr></thead>
      <tbody>
        ${topGaps.map((gap) => `<tr><td>${escapeHtml(gap.type)}</td><td>${escapeHtml(gap.id)}</td><td>${escapeHtml(gap.location)}</td><td>${escapeHtml(gap.text)}</td></tr>`).join("") || `<tr><td colspan="4">暂无追踪关系缺口。</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderHealth(health) {
  if (!health) return `<p class="muted">暂无流程健康度摘要。</p>`;
  return `
    <div class="summary" aria-label="流程健康度摘要">
      <div class="metric">健康分<strong>${escapeHtml(health.score ?? "N/A")}${health.score === null ? "" : "/100"}</strong></div>
      <div class="metric">健康等级<strong>${escapeHtml(displayValue(health.level))}</strong></div>
      <div class="metric">优先事项<strong>${escapeHtml(health.priorities.length)}</strong></div>
    </div>
    <table>
      <thead><tr><th>维度</th><th>状态</th><th>数量</th><th>扣分</th></tr></thead>
      <tbody>
        ${health.dimensions.map((item) => `<tr><td>${escapeHtml(displayHealthDimension(item.name))}</td><td>${renderStatusBadge(item.status)}</td><td>${escapeHtml(item.count)}</td><td>${escapeHtml(item.penalty)}</td></tr>`).join("") || `<tr><td colspan="4">暂无健康度维度。</td></tr>`}
      </tbody>
    </table>
    <h3>优先处理项</h3>
    ${renderList(health.priorities, "暂无优先处理项。", (item) => `<li>${renderStatusBadge(item.severity)} <strong>${escapeHtml(displayHealthDimension(item.area))}</strong>：${escapeHtml(item.message)} <span class="muted">路由=${escapeHtml(item.route || "N/A")}</span></li>`)}
  `;
}

function renderQualitySuite(qualitySuite) {
  if (!qualitySuite?.work_item) return `<p class="muted">当前没有 active work item 的质量套件结果。</p>`;
  return `
    <div class="summary" aria-label="质量套件摘要">
      <div class="metric">总体结果<strong>${renderStatusBadge(qualitySuite.summary.overall)}</strong></div>
      <div class="metric">检查项<strong>${escapeHtml(qualitySuite.summary.checked)}</strong><span>${escapeHtml(qualitySuite.summary.skipped)} 项按阶段跳过</span></div>
      <div class="metric">失败<strong>${escapeHtml(qualitySuite.summary.failures)}</strong></div>
      <div class="metric">警告<strong>${escapeHtml(qualitySuite.summary.warnings)}</strong></div>
    </div>
    <h3>建议命令</h3>
    ${renderCommandBlock(qualitySuite.recommended_commands.length > 0 ? qualitySuite.recommended_commands : ["# 无"])}
    <table>
      <thead><tr><th>检查项</th><th>状态</th><th>失败</th><th>警告</th><th>路由</th><th>说明</th></tr></thead>
      <tbody>
        ${qualitySuite.checks
          .map((item) => `<tr><td>${escapeHtml(displayQualityCheck(item))}</td><td>${renderStatusBadge(item.status)}</td><td>${escapeHtml(item.failures)}</td><td>${escapeHtml(item.warnings)}</td><td>${escapeHtml(item.route ?? "N/A")}</td><td>${escapeHtml(item.message)}</td></tr>`)
          .join("") || `<tr><td colspan="6">暂无检查项。</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderQualityHotspots(qualitySuite) {
  const issues = (qualitySuite?.checks ?? [])
    .filter((check) => check.status !== "PASS")
    .flatMap((check) =>
      (check.issues ?? []).slice(0, 3).map((issue) => ({
        check: displayQualityCheck(check),
        severity: issue.severity ?? check.status,
        path: issue.path ?? "N/A",
        message: issue.message ?? check.message,
      })),
    )
    .slice(0, 5);

  return renderList(
    issues,
    "暂无质量热点。",
    (item) => `<li>${renderStatusBadge(item.severity)} <strong>${escapeHtml(item.check)}</strong> <span class="muted">${escapeHtml(item.path)}</span><br>${escapeHtml(item.message)}</li>`,
  );
}

function renderCurrentFocus(diagnosis, contract, qualitySuite) {
  const artifact = (diagnosis.artifacts ?? []).find((item) => item.id === contract?.id);
  if (!contract) return `<p class="muted">暂无当前阶段契约。</p>`;

  return `
    <div class="summary" aria-label="当前焦点摘要">
      <div class="metric">当前产物<strong>${escapeHtml(contract.id)}</strong><span>${escapeHtml(artifactLabels.get(contract.id) ?? contract.title)}</span></div>
      <div class="metric">状态<strong>${renderStatusBadge(artifact?.status ?? "unknown")}</strong><span>${escapeHtml(displayValue(contract.stage))}</span></div>
      <div class="metric">门禁<strong>${escapeHtml(contract.gate ?? "N/A")}</strong></div>
      <div class="metric">质量<strong>${renderStatusBadge(qualitySuite.summary.overall)}</strong><span>${escapeHtml(`${qualitySuite.summary.failures} 失败 / ${qualitySuite.summary.warnings} 警告`)}</span></div>
    </div>
    <div class="grid two">
      <section class="card">
        <h3>退出标准</h3>
        <p>${escapeHtml(contract.exit)}</p>
        <h3>必须证明</h3>
        ${renderList(contract.must_prove, "N/A", (item) => `<li>${escapeHtml(item)}</li>`)}
      </section>
      <section class="card">
        <h3>人工决策</h3>
        ${renderList(contract.human_decisions, "无", (item) => `<li>${escapeHtml(item)}</li>`)}
        <h3>质量热点</h3>
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
        <p class="eyebrow">行动面板</p>
        <h2>${escapeHtml(displayValue(state))}</h2>
        <p>${escapeHtml(nextText)}</p>
        <p class="muted">路由：${escapeHtml(diagnosis.route)} · 就绪产物：${escapeHtml(artifactLabels.get(diagnosis.ready_artifact) ?? diagnosis.ready_artifact ?? "无")} · 追踪策略：${escapeHtml(traceabilityPolicyLine(diagnosis.traceability_policy))}</p>
      </div>
      <div class="action-grid">
        <article class="metric">健康度<strong>${escapeHtml(health.score ?? "N/A")}${health.score === null ? "" : "/100"}</strong><span>${escapeHtml(displayValue(health.level))}</span></article>
        <article class="metric">待确认决策<strong>${escapeHtml(diagnosis.decision_checkpoints?.summary?.open ?? 0)}</strong><span>${escapeHtml(openDecision?.marker ?? "无")}</span></article>
        <article class="metric">阻断项<strong>${escapeHtml(diagnosis.blockers?.length ?? 0)}</strong><span>${escapeHtml(blocker?.severity ?? "无")}</span></article>
        <article class="metric">追踪缺口<strong>${escapeHtml(traceGapCount(diagnosis.traceability))}</strong><span>${escapeHtml(displayValue(diagnosis.traceability_policy?.mode ?? "advisory"))}</span></article>
        <article class="metric">质量<strong>${renderStatusBadge(qualitySuite?.summary?.overall ?? "N/A")}</strong><span>${escapeHtml(`${qualitySuite?.summary?.failures ?? 0} 失败 / ${qualitySuite?.summary?.warnings ?? 0} 警告`)}</span></article>
      </div>
      <div class="grid two">
        <section class="card">
          <h3>下一步命令</h3>
          ${renderCommandBlock(commands)}
        </section>
        <section class="card">
          <h3>优先阅读</h3>
          <ol>
            ${readingOrder().map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ol>
          ${topPriority ? `<p class="muted">最高优先级：[${escapeHtml(topPriority.severity)}] ${escapeHtml(topPriority.message)}</p>` : ""}
        </section>
      </div>
    </section>
  `;
}

function decisionKind(marker = "") {
  const normalized = String(marker).toUpperCase();
  if (normalized.includes("DEPENDENCY")) return "依赖决策";
  if (normalized.includes("TOOLING")) return "工具链决策";
  if (normalized.includes("TECH")) return "技术方向";
  if (normalized.includes("UI")) return "界面方向";
  if (normalized.includes("PRODUCT")) return "产品方向";
  if (normalized.includes("CLARIFICATION")) return "澄清问题";
  return "普通决策";
}

function responseOptions(marker = "") {
  const kind = decisionKind(marker);
  if (kind === "依赖决策") return "批准依赖 / 拒绝依赖 / 要求备选方案 / 指定负责人后延后";
  if (kind === "工具链决策") return "批准工具链 / 沿用现有工具链 / 要求补充对比 / 指定触发条件后延后";
  if (kind === "技术方向") return "批准设计方向 / 选择更简单方案 / 要求补充 ADR / 延后";
  if (kind === "界面方向") return "批准方向 / 要求补充原型 / 选择其他流程 / 标记无 UI 影响";
  if (kind === "产品方向") return "批准 MVP / 收窄范围 / 拆成后续事项 / 拒绝";
  if (kind === "澄清问题") return "回答问题 / 标记不适用 / 授权默认方案 / 延后";
  return "批准 / 拒绝 / 要求更多证据 / 延后";
}

function approvalBoundary(diagnosis, contract) {
  const artifact = contract?.id ?? diagnosis.ready_artifact ?? "current artifact";
  return `本次确认只授权 ${artifact} 按 ${diagnosis.route} 继续推进；不代表批准生产发布、范围扩大或无关实现。`;
}

function renderHumanRequest(diagnosis, contract, topDecision) {
  if (!topDecision) return renderLines(["当前没有待处理决策点，暂时不需要人工回复。"]);
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
    "决策：",
    "范围：",
    "理由：",
    "是否接受风险：是 / 否 / 不适用",
    "负责人：",
    "重新验证触发条件：",
  ]);
}

function renderDecisionBrief(diagnosis, contract) {
  const checkpoints = diagnosis.decision_checkpoints;
  const topDecision = checkpoints?.open?.[0];

  if (!topDecision) {
    return `
      <p class="muted">当前没有待处理决策点。后续阶段需要人工批准、澄清或风险接受时，这里会生成可直接转发的确认材料。</p>
      <p><code>node .specforge/core/scripts/decision-brief.mjs</code></p>
    `;
  }

  return `
    <div class="summary" aria-label="决策简报摘要">
      <div class="metric">待处理决策<strong>${escapeHtml(checkpoints.summary.open)}</strong></div>
      <div class="metric">决策类型<strong>${escapeHtml(decisionKind(topDecision.marker))}</strong></div>
      <div class="metric">风险接受候选<strong>${escapeHtml(checkpoints.summary.risk_acceptance)}</strong></div>
      <div class="metric">命令<strong>decision-brief</strong></div>
    </div>
    <section class="card">
      <h3>最高优先级决策</h3>
      <h4>人工确认请求</h4>
      ${renderHumanRequest(diagnosis, contract, topDecision)}
      <p>${renderStatusBadge(topDecision.marker)} <span class="muted">${escapeHtml(topDecision.path)}:${escapeHtml(topDecision.line)}</span></p>
      <p>${escapeHtml(topDecision.text)}</p>
      <p><strong>可接受回复：</strong>${escapeHtml(responseOptions(topDecision.marker))}</p>
      <p><strong>批准边界：</strong>${escapeHtml(approvalBoundary(diagnosis, contract))}</p>
      <h4>回复格式</h4>
      ${renderLines([
        "决策：批准 / 拒绝 / 选择某方案 / 延后 / 要求更多证据",
        "范围：",
        "理由：",
        "是否接受风险：是 / 否 / 不适用",
        "负责人：",
        "重新验证触发条件：",
      ])}
    </section>
  `;
}

function render(diagnosis, workItemYaml, generatedAt) {
  const item = diagnosis.work_item;
  const title = `${item.id} - ${item.title || "SpecForge 工作报告"}`;
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
      --bg: #f5f7f8;
      --surface: #ffffff;
      --surface-soft: #f8fafb;
      --surface-tint: #eef6f3;
      --text: #172026;
      --text-strong: #0c151a;
      --muted: #66747e;
      --line: #d9e2e5;
      --line-strong: #c2ced3;
      --accent: #245e71;
      --accent-strong: #184a59;
      --accent-soft: #e4f1f3;
      --ok: #16794f;
      --ok-bg: #e6f5ee;
      --warn: #a76614;
      --warn-bg: #fff3dc;
      --bad: #b42334;
      --bad-bg: #fde8eb;
      --neutral: #53606a;
      --neutral-bg: #eef1f3;
      --shadow: 0 18px 48px rgba(20, 38, 45, 0.08);
      --shadow-soft: 0 8px 22px rgba(20, 38, 45, 0.06);
      --flow-edge: #8aa0a8;
      --radius-sm: 8px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --duration-fast: 140ms;
      --duration-base: 220ms;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      background:
        radial-gradient(circle at 12% -10%, rgba(36, 94, 113, 0.12), transparent 32%),
        linear-gradient(180deg, #edf5f4 0, #f5f7f8 280px),
        var(--bg);
      color: var(--text);
      font: 14px/1.62 Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    header {
      max-width: 1320px;
      margin: 0 auto;
      padding: 28px clamp(16px, 4vw, 44px) 16px;
    }
    main {
      padding: 16px clamp(16px, 4vw, 44px) 56px;
      max-width: 1320px;
      margin: 0 auto;
    }
    h1, h2, h3, h4 {
      color: var(--text-strong);
      line-height: 1.25;
      margin: 0 0 12px;
      letter-spacing: 0;
    }
    h1 {
      max-width: 920px;
      font-size: 32px;
      font-weight: 760;
    }
    h2 {
      font-size: 20px;
      margin-top: 34px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--line);
    }
    h3 { font-size: 16px; }
    h4 { font-size: 14px; color: var(--neutral); }
    p { margin: 0 0 12px; }
    a {
      color: var(--accent);
      text-decoration: none;
    }
    a:hover { color: var(--accent-strong); }
    nav {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 18px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.88);
      border: 1px solid var(--line);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-soft);
      backdrop-filter: blur(14px);
    }
    nav a {
      color: var(--neutral);
      border: 1px solid transparent;
      border-radius: var(--radius-sm);
      padding: 7px 10px;
      background: transparent;
      font-size: 13px;
      font-weight: 650;
      transition: background var(--duration-fast) ease, border-color var(--duration-fast) ease, color var(--duration-fast) ease;
    }
    nav a:hover {
      color: var(--accent-strong);
      background: var(--accent-soft);
      border-color: #c7e1e6;
    }
    main > section {
      scroll-margin-top: 82px;
    }
    table {
      width: 100%;
      margin: 12px 0 18px;
      border-collapse: collapse;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-soft);
    }
    th, td {
      border-bottom: 1px solid var(--line);
      padding: 11px 13px;
      text-align: left;
      vertical-align: top;
    }
    tr:last-child td { border-bottom: 0; }
    tbody tr {
      transition: background var(--duration-fast) ease;
    }
    tbody tr:hover {
      background: #fbfdfd;
    }
    th {
      background: var(--surface-soft);
      color: var(--neutral);
      font-size: 12px;
      font-weight: 760;
      text-transform: uppercase;
      letter-spacing: 0;
    }
    pre {
      margin: 0;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-word;
      background: #f7f9f9;
      border: 1px solid var(--line);
      border-radius: var(--radius-sm);
      padding: 12px;
      color: #263238;
      font-size: 13px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-top: 16px;
    }
    .metric, .card, .output {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-md);
      padding: 15px;
      box-shadow: var(--shadow-soft);
      transition: transform var(--duration-base) ease, box-shadow var(--duration-base) ease, border-color var(--duration-base) ease;
    }
    .card:hover, .output:hover {
      border-color: var(--line-strong);
      box-shadow: var(--shadow);
      transform: translateY(-1px);
    }
    .metric strong {
      display: block;
      color: var(--text-strong);
      font-size: 20px;
      line-height: 1.2;
      margin-top: 4px;
    }
    .metric span {
      display: block;
      color: var(--muted);
      margin-top: 4px;
      font-size: 12px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 14px;
    }
    .two { grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); }
    .action-board {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      padding: 22px;
      margin-bottom: 26px;
      box-shadow: var(--shadow);
    }
    .action-board h2 {
      border: 0;
      padding: 0;
      margin-top: 0;
      font-size: 26px;
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
      padding: 3px 9px;
      font-size: 12px;
      border: 1px solid transparent;
      font-weight: 700;
    }
    .badge.ok { color: var(--ok); background: var(--ok-bg); border-color: #bfe7d4; }
    .badge.warn { color: var(--warn); background: var(--warn-bg); border-color: #f1d197; }
    .badge.bad { color: var(--bad); background: var(--bad-bg); border-color: #f3b8c0; }
    .badge.neutral { color: var(--neutral); background: var(--neutral-bg); border-color: #dce2e5; }
    .ok { color: var(--ok); }
    .warn { color: var(--warn); }
    .bad { color: var(--bad); }
    .neutral { color: var(--neutral); }
    .muted { color: var(--muted); }
    .flow-wrap {
      overflow-x: auto;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-md);
      padding: 12px;
      margin-bottom: 14px;
      box-shadow: var(--shadow-soft);
    }
    .flow-edge {
      fill: none;
      stroke: var(--flow-edge);
      stroke-width: 2;
    }
    .flow-arrow { fill: var(--flow-edge); }
    .flow-node rect {
      fill: var(--surface);
      stroke: currentColor;
      stroke-width: 2;
      transition: fill var(--duration-fast) ease, stroke var(--duration-fast) ease;
    }
    a:hover .flow-node rect { fill: var(--surface-tint); }
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
    @media (max-width: 720px) {
      header { padding-top: 20px; }
      h1 { font-size: 24px; }
      nav { position: static; }
      .two { grid-template-columns: 1fr; }
      table { display: block; overflow-x: auto; }
    }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
      }
      .card:hover, .output:hover { transform: none; }
    }
  </style>
</head>
<body>
  <header>
    <p class="muted">SpecForge 派生阅读报告 · Markdown 产物仍是事实源</p>
    <h1>${escapeHtml(title)}</h1>
    <div class="summary" aria-label="工作项摘要">
      <div class="metric">流程<strong>${escapeHtml(item.workflow)}</strong></div>
      <div class="metric">阶段<strong>${escapeHtml(displayValue(item.stage))}</strong></div>
      <div class="metric">进度<strong>${escapeHtml(progress)}</strong></div>
      <div class="metric">健康度<strong>${escapeHtml(health.score ?? "N/A")}${health.score === null ? "" : "/100"}</strong></div>
      <div class="metric">路由<strong>${escapeHtml(diagnosis.route)}</strong></div>
      <div class="metric">生成时间<strong>${escapeHtml(generatedAt)}</strong></div>
    </div>
    <nav aria-label="报告章节">
      <a href="#action-board">行动面板</a>
      <a href="#current-focus">当前焦点</a>
      <a href="#route">路由</a>
      <a href="#health">健康度</a>
      <a href="#quality-suite">质量套件</a>
      <a href="#gates">门禁</a>
      <a href="#graph">产物图</a>
      <a href="#traceability">追踪关系</a>
      <a href="#warnings">阻断与提醒</a>
      <a href="#decision-checkpoints">决策点</a>
      <a href="#decision-brief">决策简报</a>
      <a href="#artifacts">产物摘要</a>
    </nav>
  </header>
  <main>
    ${renderActionBoard(diagnosis, health, qualitySuite)}

    <section id="current-focus">
      <h2>当前焦点</h2>
      <p class="muted">当前阶段最小可读层：正在产出什么、必须证明什么、哪些内容需要人工判断，以及哪些质量问题应优先处理。</p>
      ${renderCurrentFocus(diagnosis, contract, qualitySuite)}
    </section>

    <section id="route">
      <h2>路由</h2>
      <p>${escapeHtml(diagnosis.route_reason)}</p>
      <p class="muted">工作目录：${escapeHtml(item.path)}</p>
      <p class="muted">标题来源：${escapeHtml(parseField(workItemYaml, "title") || "N/A")}</p>
    </section>

    <section id="health">
      <h2>流程健康度</h2>
      <p class="muted">用于快速扫描阻断项、人工决策、质量提醒、追踪关系和门禁状态的派生就绪分。它只做辅助判断，不替代门禁证据。</p>
      ${renderHealth(health)}
    </section>

    <section id="quality-suite">
      <h2>质量套件</h2>
      <p class="muted">按当前阶段检查产物可读性、决策闭环、追踪关系、来源质量、实现账本、验证证据、Wiki 和关闭就绪度。Markdown 产物仍是事实源。</p>
      ${renderQualitySuite(qualitySuite)}
    </section>

    <section id="gates">
      <h2>门禁</h2>
      <p>${escapeHtml(gateLine(diagnosis.gates))}</p>
      <table>
        <thead><tr><th>门禁</th><th>状态</th><th>证据</th><th>证据是否存在</th></tr></thead>
        <tbody>
          ${diagnosis.gates
            .map((gate) => `<tr><td>${escapeHtml(gate.gate)}</td><td>${renderStatusBadge(gate.status)}</td><td>${escapeHtml(gate.evidence ?? "N/A")}</td><td>${escapeHtml(gate.evidenceExists ? "是" : "否")}</td></tr>`)
            .join("") || `<tr><td colspan="4">暂无门禁。</td></tr>`}
        </tbody>
      </table>
    </section>

    <section id="graph">
      <h2>产物依赖图</h2>
      ${renderArtifactFlow(diagnosis.artifacts)}
      <table>
        <thead><tr><th>产物</th><th>状态</th><th>阶段</th><th>依赖</th><th>缺失依赖</th></tr></thead>
        <tbody>
          ${diagnosis.artifacts
            .map((artifact) => `<tr><td><a href="#artifact-${slug(artifact.id)}">${escapeHtml(artifactName(artifact.id, artifact.title))}</a></td><td>${renderStatusBadge(artifact.status)}</td><td>${escapeHtml(displayValue(artifact.stage))}</td><td>${escapeHtml(displayListValue(artifact.requires))}</td><td>${escapeHtml(displayListValue(artifact.missingDeps))}</td></tr>`)
            .join("")}
        </tbody>
      </table>
    </section>

    <section id="traceability">
      <h2>追踪关系</h2>
      <p class="muted">这里汇总来源 ID、任务和验证 ID，用来尽早暴露缺口。策略：${escapeHtml(traceabilityPolicyLine(diagnosis.traceability_policy))}。</p>
      ${renderTraceability(diagnosis.traceability)}
    </section>

    <section id="warnings">
      <h2>阻断项与质量提醒</h2>
      <h3>阻断项</h3>
      ${renderList(diagnosis.blockers, "暂无阻断项。", (blocker) => `<li>${renderStatusBadge(blocker.severity)} ${escapeHtml(blocker.message)} <span class="muted">路由=${escapeHtml(blocker.route)}</span></li>`)}
      <h3>质量提醒</h3>
      ${renderList(diagnosis.quality_warnings, "暂无质量提醒。", (warning) => `<li>${renderStatusBadge(warning.severity)} ${escapeHtml(warning.message)} <span class="muted">缺失=${escapeHtml((warning.missing_sections ?? []).join(", ") || "N/A")}</span></li>`)}
    </section>

    <section id="decision-checkpoints">
      <h2>决策点</h2>
      <p>
        ${renderStatusBadge(`open=${diagnosis.decision_checkpoints?.summary?.open ?? 0}`)}
        ${renderStatusBadge(`confirmed=${diagnosis.decision_checkpoints?.summary?.confirmed ?? 0}`)}
        ${renderStatusBadge(`risk=${diagnosis.decision_checkpoints?.summary?.risk_acceptance ?? 0}`)}
      </p>
      <h3>待处理决策</h3>
      ${renderList(diagnosis.decision_checkpoints?.open, "暂无待处理决策标记。", (item) => `<li><strong>${escapeHtml(item.marker)}</strong> <span class="muted">${escapeHtml(item.path)}:${escapeHtml(item.line)}</span><br>${escapeHtml(item.text)}</li>`)}
      <h3>风险接受候选</h3>
      ${renderList(diagnosis.decision_checkpoints?.risk_acceptance, "暂无风险接受候选。", (item) => `<li><span class="muted">${escapeHtml(item.path)}:${escapeHtml(item.line)}</span><br>${escapeHtml(item.text)}</li>`)}
    </section>

    <section id="decision-brief">
      <h2>决策简报</h2>
      <p class="muted">面向人工确认的轻量审批材料。Markdown 仍是事实源；本区块由当前决策标记和诊断信息生成。</p>
      ${renderDecisionBrief(diagnosis, contract)}
    </section>

    <section id="artifacts">
      <h2>产物摘要</h2>
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
    console.log(`已生成 SpecForge 工作报告：${output}`);
    console.log("Markdown 产物仍是事实源。");
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
