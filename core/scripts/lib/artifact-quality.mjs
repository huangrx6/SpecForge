import { exists, layout, readText } from "./specforge.mjs";

const summaryHeadings = ["一页摘要", "摘要", "Executive Summary", "Decision Summary", "判定摘要", "发布摘要", "回滚摘要", "CI 摘要"];
const unresolvedDecisionPattern = /\[(?:NEEDS (?:CLARIFICATION|PRODUCT DECISION|UI DECISION|TECH DECISION|DEPENDENCY DECISION|TOOLING DECISION)|DEPENDENCY DECISION REQUIRED|TOOLING DECISION REQUIRED)[^\]]*\]/i;
const placeholderPattern = /\.\.\.|<[^>]+>|请输入内容|待填写|待补充|TBD|example|示例|real marker if needed|yes\s*\/\s*no|pass\s*\/\s*fail/i;
const taskPattern = /^\s*[-*]\s+\[[ xX]\]\s+(T\d{3})\b(.+)$/;
const taskFieldPattern = /^\s*_(Trace|Files|Verification|Rollback|Risk|Impact|Boundary|Depends|TestCase):_\s*(.*)$/i;
const designModeValues = new Set(["Product UI", "Brand Surface", "Hybrid", "Avatar-IP", "Empty State"]);
const designScopeValues = new Set(["avatar", "empty_state", "both"]);
const contrastStatusValues = new Set(["pass", "fail", "not-checked"]);
const selectionConfidenceValues = new Set(["confirmed", "likely", "unclear"]);
const visualQaResultValues = new Set(["ok", "issue", "not-applicable"]);
const visualQaSeverityValues = new Set(["low", "medium", "high"]);
const visualQaStatusValues = new Set(["fixed", "accepted", "pending", "blocked", "not-applicable"]);
const humanConfirmationStatusValues = new Set(["confirmed", "defaulted", "pending"]);
const referenceUiTypeValues = new Set(["admin", "data-table", "dashboard", "settings", "auth", "onboarding", "ai-assistant", "brand-surface", "mobile-h5", "empty-state"]);
const referenceStackValues = new Set(["vue", "shadcn-vue", "react", "shadcn-ui", "tailwind", "element-plus", "existing-component-library", "unknown"]);
const referenceNeedValues = new Set(["component-wrapper", "page-structure", "block-composition", "visual-completion", "motion", "domestic-ui-case", "industry-case", "ux-ia", "state-system"]);
const referenceBorrowStrengthValues = new Set(["conservative", "moderate", "strong", "review-only"]);
const referenceAdminModuleValues = new Set(["app-shell", "dashboard", "data-table", "chart-metrics", "form-flow", "user-permission", "settings", "auth", "feedback-overlays", "state-system"]);
const referenceVisualDirectionValues = new Set(["clean-professional", "high-density-efficient", "light-brand", "tech-without-ai-neon", "domestic-internet-product", "portfolio-level-polish", "warm-friendly", "dark-professional"]);
const referenceReuseModeValues = new Set(["component-contract-only", "pattern-only", "page-pattern-only", "inspiration-only", "method-only", "implementation-reference", "translate-to-vue-contract"]);
const selectionRationaleMap = [
  ["palette_id", "palette"],
  ["font_source_id", "font_source"],
  ["font_pairing_id", "font_pairing"],
  ["type_scale_id", "type_scale"],
  ["spacing_density_id", "spacing_density"],
  ["radius_shadow_recipe_id", "radius_shadow"],
  ["motion_recipe_id", "motion"],
  ["advanced_interaction_recipe_id", "advanced_interaction"],
];
const highSeverityVisualDetectors = new Set([
  "Generic SaaS shell",
  "Default admin shell",
  "Color-only design",
  "Empty dashboard skeleton",
  "KPI wallpaper",
  "Blank framed content",
  "Todo list without workflow",
  "Missing creative direction",
  "Reference claim without evidence",
  "Assetless brand surface",
  "Decorative motion signature",
  "Card soup",
  "Fake premium gradient",
  "Default AI neon",
  "Motion noise",
  "State missing",
  "Primitive pile",
  "Token drift",
  "Text overflow",
  "Low contrast subtlety",
]);

function headingLevel(line) {
  return line.match(/^(#{1,6})\s+/)?.[1]?.length ?? 0;
}

function findSummary(content) {
  const lines = content.split(/\r?\n/);
  for (const heading of summaryHeadings) {
    const start = lines.findIndex((line) => /^#{1,6}\s+/.test(line) && line.includes(heading));
    if (start === -1) continue;
    const level = headingLevel(lines[start]);
    let end = lines.length;
    for (let index = start + 1; index < lines.length; index += 1) {
      const nextLevel = headingLevel(lines[index]);
      if (nextLevel > 0 && nextLevel <= level) {
        end = index;
        break;
      }
    }
    const contentLines = lines.slice(start + 1, end).map((line) => line.trim()).filter(Boolean);
    return {
      heading,
      line: start + 1,
      lines: contentLines,
    };
  }
  return null;
}

function isPlaceholderLine(line) {
  return (
    /^[-*]\s*[^：:]+[：:]\s*$/.test(line) ||
    /^\|\s*[^|]+\s*\|\s*$/.test(line) ||
    /请输入内容|待填写|TBD|N\/A\s*\/|yes\s*\/\s*no|pass\s*\/\s*fail/i.test(line)
  );
}

function hasHeading(content, heading) {
  return content
    .split(/\r?\n/)
    .some((line) => /^#{1,6}\s+/.test(line) && line.replace(/^#{1,6}\s+/, "").trim() === heading);
}

function addRequiredHeadingIssues(issues, content, outputPath, headings) {
  for (const heading of headings) {
    if (!hasHeading(content, heading)) {
      issues.push({
        severity: "WARN",
        code: "required-section-missing",
        message: `${outputPath} 缺少必要 section：${heading}。`,
        fix: `补齐 ${heading}，或明确写 N/A 理由。`,
      });
    }
  }
}

function getSectionBody(content, heading) {
  const lines = content.split(/\r?\n/);
  const start = lines.findIndex((line) => /^#{1,6}\s+/.test(line) && line.replace(/^#{1,6}\s+/, "").trim() === heading);
  if (start === -1) return null;
  const level = headingLevel(lines[start]);
  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    const nextLevel = headingLevel(lines[index]);
    if (nextLevel > 0 && nextLevel <= level) {
      end = index;
      break;
    }
  }
  return lines.slice(start + 1, end).join("\n");
}

function getSectionBodyLoose(content, headingText) {
  const lines = content.split(/\r?\n/);
  const normalizedHeading = headingText.trim().toLowerCase();
  const start = lines.findIndex((line) => {
    if (!/^#{1,6}\s+/.test(line)) return false;
    const text = line.replace(/^#{1,6}\s+/, "").replace(/^\d+(?:\.\d+)*\.\s+/, "").trim().toLowerCase();
    return text === normalizedHeading;
  });
  if (start === -1) return null;
  const level = headingLevel(lines[start]);
  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    const nextLevel = headingLevel(lines[index]);
    if (nextLevel > 0 && nextLevel <= level) {
      end = index;
      break;
    }
  }
  return lines.slice(start + 1, end).join("\n");
}

function isMeaningfulCell(value) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/^[-:| ]+$/.test(trimmed)) return false;
  if (/^(内容|结论|设计|证据|证据\s*\/\s*N\/A|N\/A|TBD|待填写|请输入内容)$/i.test(trimmed)) return false;
  if (/^(Context|Container|Component|Runtime|Data|Deployment)(\s*\/\s*(Context|Container|Component|Runtime|Data|Deployment))*$/i.test(trimmed)) return false;
  return !placeholderPattern.test(trimmed);
}

function hasMeaningfulSectionContent(body) {
  if (!body) return false;
  if (/N\/A\s*[-：:]\s*\S{4,}/i.test(body)) return true;
  for (const line of body.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(trimmed)) continue;
    if (/^\|/.test(trimmed)) {
      const cells = trimmed.split("|").map((cell) => cell.trim()).filter(Boolean);
      if (cells.length < 2) continue;
      const valueCells = cells.slice(1);
      if (valueCells.some(isMeaningfulCell)) return true;
      continue;
    }
    if (isRealContentLine(trimmed)) return true;
  }
  return false;
}

function addRequiredFilledSectionIssue(issues, content, outputPath, heading, code, fix) {
  const body = getSectionBody(content, heading);
  if (!body || !hasMeaningfulSectionContent(body)) {
    issues.push({
      severity: "FAIL",
      code,
      message: `${outputPath} 缺少可审查的 ${heading} 内容。`,
      fix,
    });
  }
}

function isRealContentLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (/^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(trimmed)) return false;
  return !placeholderPattern.test(trimmed);
}

function realRowsWithId(content, prefix) {
  const pattern = new RegExp(`\\b${prefix}-\\d{3}\\b`);
  return content
    .split(/\r?\n/)
    .filter((line) => pattern.test(line) && isRealContentLine(line));
}

function unresolvedDecisionMarkers(content) {
  return content
    .split(/\r?\n/)
    .map((line, index) => ({ line: index + 1, text: line.trim() }))
    .filter((entry) => unresolvedDecisionPattern.test(entry.text));
}

function lintRequirements(content, outputPath) {
  const issues = [];
  addRequiredHeadingIssues(issues, content, outputPath, [
    "0.1 Spec Quality Gate",
    "Applied Requirement Patterns",
    "上游确认输入",
    "Source -> Requirement 转译",
    "边界",
    "影响面确认",
    "功能需求",
    "行为覆盖矩阵",
    "验收标准",
    "REQ / AC Trace",
    "Downstream Handoff",
  ]);

  const openMarkers = unresolvedDecisionMarkers(content);
  if (openMarkers.length > 0) {
    issues.push({
      severity: "FAIL",
      code: "open-requirements-decision",
      message: `${outputPath} 仍有 ${openMarkers.length} 个未决需求 / 依赖 / 工具链 marker。`,
      fix: "回到 sf-brainstorm / sf-prd / sf-requirements 确认后再进入设计或 tasking。",
    });
  }

  if (realRowsWithId(content, "REQ").length === 0) {
    issues.push({
      severity: "FAIL",
      code: "requirements-no-real-req",
      message: `${outputPath} 没有真实 REQ-xxx 需求行。`,
      fix: "至少写入一个可测试的 REQ-xxx，避免只保留模板示例。",
    });
  }
  if (realRowsWithId(content, "AC").length === 0) {
    issues.push({
      severity: "FAIL",
      code: "requirements-no-real-ac",
      message: `${outputPath} 没有真实 AC-xxx 验收标准。`,
      fix: "为每个关键 REQ 写入 Given / When / Then 或等价验收方式。",
    });
  }
  const reqRowsMissingAc = realRowsWithId(content, "REQ").filter((line) => !/\bAC-\d+\b/.test(line));
  if (reqRowsMissingAc.length > 0) {
    issues.push({
      severity: "WARN",
      code: "requirements-req-missing-ac-link",
      message: `${outputPath} 有 ${reqRowsMissingAc.length} 条 REQ 行未直接链接 AC-xxx。`,
      fix: "在功能需求或 REQ / AC Trace 中为每条 REQ 挂接对应 AC，或写明 N/A 理由。",
    });
  }
  if (hasHeading(content, "验收标准")) {
    const acceptanceBody = getSectionBody(content, "验收标准") ?? "";
    if (!/\|\s*ID\s*\|\s*Given\s*\|\s*When\s*\|\s*Then\s*\|\s*验证方式\s*\|/.test(acceptanceBody)) {
      issues.push({
        severity: "WARN",
        code: "requirements-ac-not-gwt",
        message: `${outputPath} 的验收标准表没有使用 Given / When / Then / 验证方式列。`,
        fix: "优先使用 Given / When / Then / 验证方式，无法使用时在 Spec Quality Gate 写明原因。",
      });
    }
  }
  if (/has-untestable-items/i.test(content)) {
    issues.push({
      severity: "WARN",
      code: "requirements-has-untestable-items",
      message: `${outputPath} 标记了 has-untestable-items。`,
      fix: "把不可测试项改写为可观察行为，或记录 owner、影响和后续补证路径。",
    });
  }
  return issues;
}

function lintTechnicalDesign(content, outputPath) {
  const issues = [];
  addRequiredHeadingIssues(issues, content, outputPath, [
    "0. 影响面与读取计划",
    "0.1 Design Quality Gate",
    "1. 技术选型与依赖确认",
    "3. Requirements Trace",
    "7. 总体架构与边界承诺",
    "7.1 Architecture Contract",
    "Implementation Handoff",
    "12. Operability & Maintenance",
    "16. 技术验证策略",
  ]);

  const openMarkers = unresolvedDecisionMarkers(content);
  if (openMarkers.length > 0) {
    issues.push({
      severity: "FAIL",
      code: "open-technical-decision",
      message: `${outputPath} 仍有 ${openMarkers.length} 个未决技术 / 依赖 / 工具链 marker。`,
      fix: "先完成技术方向、依赖或工具链确认，再进入 tasking / spec_review。",
    });
  }

  const unknownRows = content
    .split(/\r?\n/)
    .filter((line) => /^\|/.test(line) && /\|\s*unknown\s*\|/i.test(line))
    .filter((line) => !/yes\s*\/\s*no\s*\/\s*unknown/i.test(line))
    .filter(isRealContentLine);
  if (unknownRows.length > 0) {
    issues.push({
      severity: "FAIL",
      code: "technical-design-has-unknown-impact",
      message: `${outputPath} 仍有 ${unknownRows.length} 行关键影响面为 unknown。`,
      fix: "把 unknown 改成 yes/no/N/A，并记录证据；会影响架构、数据、安全、成本或上线风险时先暂停确认。",
    });
  }

  const traceRows = content
    .split(/\r?\n/)
    .filter((line) => /^\|/.test(line) && /\b(?:REQ|GAP|UI|NFR)-\d{3}\b/.test(line))
    .filter(isRealContentLine);
  if (traceRows.length === 0) {
    issues.push({
      severity: "WARN",
      code: "technical-design-missing-trace-rows",
      message: `${outputPath} 没有可追溯的 requirements / gap / UI / NFR 响应行。`,
      fix: "在 Requirements Trace 中写入来源 ID、技术设计响应和验证钩子。",
    });
  }
  addRequiredFilledSectionIssue(
    issues,
    content,
    outputPath,
    "7.1 Architecture Contract",
    "technical-design-architecture-contract-empty",
    "补齐架构视图、边界、职责、接口、状态、数据、安全、运行、交付、可测试性和维护成本；无架构影响时写明确 N/A 理由。",
  );
  addRequiredFilledSectionIssue(
    issues,
    content,
    outputPath,
    "Implementation Handoff",
    "technical-design-implementation-handoff-empty",
    "补齐 change slices、files/modules、sequence、test seams、rollout、rollback、do-not-touch 和 open assumptions，确保 tasks 可直接拆解。",
  );
  addRequiredFilledSectionIssue(
    issues,
    content,
    outputPath,
    "12. Operability & Maintenance",
    "technical-design-operability-maintenance-empty",
    "补齐日志/指标/追踪、告警/健康检查、owner、扩展点、废弃路径、wiki target、技术债和重看触发；无运行维护影响时写明确 N/A 理由。",
  );
  return issues;
}

function collectTaskBlocks(content) {
  const tasks = [];
  let current = null;
  for (const [index, line] of content.split(/\r?\n/).entries()) {
    const taskMatch = line.match(taskPattern);
    if (taskMatch) {
      current = {
        id: taskMatch[1],
        title: taskMatch[2].trim(),
        line: index + 1,
        fields: new Map(),
      };
      tasks.push(current);
      continue;
    }
    if (!current) continue;
    const fieldMatch = line.match(taskFieldPattern);
    if (fieldMatch) {
      current.fields.set(fieldMatch[1].toLowerCase(), fieldMatch[2].trim());
    }
  }
  return tasks;
}

function lintTasks(content, outputPath) {
  const issues = [];
  addRequiredHeadingIssues(issues, content, outputPath, [
    "1. 规划输入",
    "2. 来源审计与覆盖矩阵",
    "4. 并行波次",
    "5. 任务列表",
    "6. 验证计划",
  ]);

  const tasks = collectTaskBlocks(content);
  if (tasks.length === 0) {
    issues.push({
      severity: "FAIL",
      code: "tasks-no-real-task",
      message: `${outputPath} 没有 Txxx 任务。`,
      fix: "至少拆出一个 Txxx，并补齐 trace、files、verification、rollback 和 risk。",
    });
    return issues;
  }

  const requiredFields = ["trace", "files", "verification", "rollback", "risk"];
  for (const task of tasks) {
    const missing = requiredFields.filter((field) => !task.fields.has(field));
    if (missing.length > 0) {
      issues.push({
        severity: "FAIL",
        code: "task-core-field-missing",
        message: `${outputPath}:${task.line} ${task.id} 缺少核心字段：${missing.map((field) => `_${field[0].toUpperCase()}${field.slice(1)}:_`).join(", ")}。`,
        fix: "补齐任务核心字段，让 implementation、code review 和 verification 能逐项追踪。",
      });
    }

    const trace = task.fields.get("trace") ?? "";
    if (trace && !/\b(?:REQ|AC|NFR|GAP|UI|TD|RESEARCH|CONTEXT)-\d{3}\b/.test(trace) && !/N\/A/i.test(trace)) {
      issues.push({
        severity: "WARN",
        code: "task-trace-not-specific",
        message: `${outputPath}:${task.line} ${task.id} 的 _Trace:_ 不够具体。`,
        fix: "优先引用 REQ/GAP/UI/TD 等具体 ID 或章节；确实无来源时写 N/A 理由。",
      });
    }

    const verification = task.fields.get("verification") ?? "";
    if (verification && placeholderPattern.test(verification)) {
      issues.push({
        severity: "FAIL",
        code: "task-verification-placeholder",
        message: `${outputPath}:${task.line} ${task.id} 的 _Verification:_ 仍像模板占位。`,
        fix: "写入可执行命令、测试类型、人工检查或后续 verification 证据。",
      });
    }
  }

  return issues;
}

function parseDesignContractJson(content) {
  const blocks = [...content.matchAll(/```json\s*([\s\S]*?)```/g)];
  const parseErrors = [];
  for (const block of blocks) {
    try {
      const value = JSON.parse(block[1]);
      if (value && typeof value === "object" && (value.design_mode || value.color_system)) {
        return { contract: value, parseErrors };
      }
    } catch (error) {
      parseErrors.push(error.message);
    }
  }
  return { contract: null, parseErrors };
}

function paletteIds() {
  const path = `${layout.runtime}/skills/ui-ux/design-system/data/aesthetic-palettes.csv`;
  if (!exists(path)) return new Set();
  const lines = readText(path).split(/\r?\n/).filter((line) => line.trim());
  return new Set(lines.slice(1).map((line) => line.split(",")[0]?.trim()).filter(Boolean));
}

function foundationRecipeIds(recipeType) {
  const path = `${layout.runtime}/skills/ui-ux/design-system/data/foundation-recipes.csv`;
  if (!exists(path)) return new Set();
  const lines = readText(path).split(/\r?\n/).filter((line) => line.trim());
  return new Set(lines.slice(1)
    .map((line) => line.split(","))
    .filter((cells) => cells[0]?.trim() === recipeType)
    .map((cells) => cells[1]?.trim())
    .filter(Boolean));
}

function addMissingFields(issues, object, fields, outputPath, owner, code = "design-contract-field-missing") {
  const missing = fields.filter((field) => !Object.prototype.hasOwnProperty.call(object ?? {}, field));
  if (missing.length > 0) {
    issues.push({
      severity: "FAIL",
      code,
      message: `${outputPath} 的 ${owner} 缺少字段：${missing.join(", ")}。`,
      fix: "按 design-contract.schema.json 补齐字段；schema required 字段写可消费值。条件字段不适用时不要声明对应 workflow / 字段，并在 scan_manifest.skipped_with_reason 说明。",
    });
  }
}

function addEnumValueIssue(issues, value, allowedValues, outputPath, owner, fix) {
  const text = String(value ?? "").trim();
  if (allowedValues.has(text)) return;
  issues.push({
    severity: "FAIL",
    code: "design-contract-reference-selection-enum-invalid",
    message: `${outputPath} 的 ${owner} 非法：${text || "missing"}。`,
    fix,
  });
}

function addEnumArrayIssues(issues, value, allowedValues, outputPath, owner, fix) {
  if (!Array.isArray(value)) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-reference-selection-array-invalid",
      message: `${outputPath} 的 ${owner} 必须是数组。`,
      fix,
    });
    return;
  }

  for (const [index, item] of value.entries()) {
    const text = String(item ?? "").trim();
    if (!allowedValues.has(text)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-reference-selection-enum-invalid",
        message: `${outputPath} 的 ${owner}[${index}] 非法：${text || "missing"}。`,
        fix,
      });
    }
  }
}

function lintContrastChecks(issues, accessibility, outputPath) {
  if (!accessibility || typeof accessibility !== "object") {
    issues.push({
      severity: "FAIL",
      code: "design-contract-accessibility-missing",
      message: `${outputPath} 的 color_system.accessibility 缺失。`,
      fix: "补齐 requires_contrast_check、dark_mode_ready 和 contrast_checks。",
    });
    return;
  }

  addMissingFields(issues, accessibility, ["requires_contrast_check", "dark_mode_ready", "contrast_checks"], outputPath, "color_system.accessibility");
  if (!Array.isArray(accessibility.contrast_checks) || accessibility.contrast_checks.length === 0) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-contrast-checks-missing",
      message: `${outputPath} 没有记录 contrast_checks。`,
      fix: "至少记录 text_on_surface、text_muted_on_surface、primary_button_text 等关键 token pair 的 ratio 和 status。",
    });
    return;
  }

  let checked = 0;
  for (const [index, check] of accessibility.contrast_checks.entries()) {
    const pair = String(check?.pair ?? "").trim();
    const ratio = String(check?.ratio ?? "").trim();
    const status = String(check?.status ?? "").trim();
    if (!pair || !ratio || !contrastStatusValues.has(status)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-contrast-check-invalid",
        message: `${outputPath} 的 contrast_checks[${index}] 不完整或 status 非法。`,
        fix: "每条 contrast check 必须包含 pair、ratio 和 status: pass / fail / not-checked。",
      });
      continue;
    }
    if (status !== "not-checked") checked += 1;
    if ((status === "pass" || status === "fail") && !/\d/.test(ratio)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-contrast-ratio-missing",
        message: `${outputPath} 的 ${pair} 标记为 ${status}，但 ratio 没有可读数值。`,
        fix: "写入实际对比度，例如 4.8 或 4.8:1。",
      });
    }
  }

  if (accessibility.requires_contrast_check === true && checked === 0) {
    issues.push({
      severity: "WARN",
      code: "design-contract-contrast-not-checked",
      message: `${outputPath} 要求 contrast check，但所有 contrast_checks 都还是 not-checked。`,
      fix: "在进入 technical design / implementation 前补齐至少正文、弱文案、按钮文字和非文本 UI 的对比度结果。",
    });
  }
}

function lintVisualQaDetectors(issues, content, outputPath) {
  const body = getSectionBodyLoose(content, "Visual QA Detectors");
  if (!body) {
    issues.push({
      severity: "WARN",
      code: "ui-design-visual-qa-detectors-missing",
      message: `${outputPath} 缺少 Visual QA Detectors section。`,
      fix: "按 visual-qa-detectors.md 输出 detector、result、evidence 和 fix / accepted reason。",
    });
    return;
  }

  for (const line of body.split(/\r?\n/)) {
    if (!line.trim().startsWith("|")) continue;
    if (/^\|?\s*:?-{3,}:?/.test(line)) continue;
    const rawCells = line.split("|").map((cell) => cell.trim());
    const cells = rawCells[0] === "" ? rawCells.slice(1, -1) : rawCells;
    if (cells.length < 4 || /^detector$/i.test(cells[0])) continue;
    const [detector, result, , fix] = cells;
    if (!highSeverityVisualDetectors.has(detector)) continue;
    if (!/\b(issue|fail|failed|high|block)\b/i.test(result)) continue;
    if (!isMeaningfulCell(fix)) {
      issues.push({
        severity: "FAIL",
        code: "ui-design-high-visual-qa-unresolved",
        message: `${outputPath} 的 high severity visual QA detector 未给出修复动作或接受理由：${detector}。`,
        fix: "修复 detector 对应问题，或在 Fix / Accepted reason 写明为什么接受该风险以及后续验证方式。",
      });
    }
  }
}

function lintVisualQaContract(issues, visualQa, outputPath) {
  if (!Array.isArray(visualQa) || visualQa.length === 0) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-visual-qa-missing",
      message: `${outputPath} 缺少 Design Contract JSON.visual_qa 或数组为空。`,
      fix: "按 visual-qa-detectors.md 把 detector 扫描结果写入 visual_qa，至少包含 detector、result、severity、evidence、fix、status 和 owner。",
    });
    return;
  }

  for (const [index, entry] of visualQa.entries()) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-visual-qa-entry-invalid",
        message: `${outputPath} 的 visual_qa[${index}] 不是对象。`,
        fix: "每条 visual_qa 必须写成 { detector, result, severity, evidence, fix, status, owner }。",
      });
      continue;
    }

    addMissingFields(
      issues,
      entry,
      ["detector", "result", "severity", "evidence", "fix", "status", "owner"],
      outputPath,
      `visual_qa[${index}]`,
      "design-contract-visual-qa-field-missing",
    );

    const detector = String(entry.detector ?? "").trim();
    const result = String(entry.result ?? "").trim();
    const severity = String(entry.severity ?? "").trim();
    const status = String(entry.status ?? "").trim();

    if (!isMeaningfulCell(detector)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-visual-qa-detector-missing",
        message: `${outputPath} 的 visual_qa[${index}].detector 缺失或仍像占位。`,
        fix: "detector 使用 visual-qa-detectors.md 中的稳定名称，方便 sf-verify 自动 gate。",
      });
    }
    if (!visualQaResultValues.has(result)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-visual-qa-result-invalid",
        message: `${outputPath} 的 visual_qa[${index}].result 非法：${result || "missing"}。`,
        fix: "result 只能写 ok / issue / not-applicable。",
      });
    }
    if (!visualQaSeverityValues.has(severity)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-visual-qa-severity-invalid",
        message: `${outputPath} 的 visual_qa[${index}].severity 非法：${severity || "missing"}。`,
        fix: "severity 只能写 low / medium / high。",
      });
    }
    if (!visualQaStatusValues.has(status)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-visual-qa-status-invalid",
        message: `${outputPath} 的 visual_qa[${index}].status 非法：${status || "missing"}。`,
        fix: "status 只能写 fixed / accepted / pending / blocked / not-applicable。",
      });
    }

    if (highSeverityVisualDetectors.has(detector) && severity !== "high") {
      issues.push({
        severity: "FAIL",
        code: "design-contract-visual-qa-severity-downgraded",
        message: `${outputPath} 的 high severity detector 被降级：${detector} -> ${severity || "missing"}。`,
        fix: "visual-qa-detectors.md 中定义为 high 的 detector 不能在 JSON 中降级。",
      });
    }

    const evidence = entry.evidence;
    if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-visual-qa-evidence-missing",
        message: `${outputPath} 的 visual_qa[${index}].evidence 缺失。`,
        fix: "补齐 evidence.artifact、evidence.viewport 和 evidence.region，让 sf-verify 能定位截图或页面区域。",
      });
    } else {
      for (const field of ["artifact", "viewport", "region"]) {
        if (!isMeaningfulCell(String(evidence[field] ?? ""))) {
          issues.push({
            severity: "FAIL",
            code: "design-contract-visual-qa-evidence-field-missing",
            message: `${outputPath} 的 visual_qa[${index}].evidence.${field} 缺失或仍像占位。`,
            fix: "写入截图 / 原型 / 页面 artifact、viewport 和具体区域；无法截图时写文本 artifact 与 region。",
          });
        }
      }
    }

    if (result === "issue" && !isMeaningfulCell(String(entry.fix ?? ""))) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-visual-qa-fix-missing",
        message: `${outputPath} 的 visual_qa[${index}] 标记为 issue，但 fix 为空。`,
        fix: "为 issue 写明修复动作或 accepted reason；不要只记录问题。",
      });
    }

    if (result === "issue" && severity === "high" && !["fixed", "accepted"].includes(status)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-high-visual-qa-pending",
        message: `${outputPath} 仍有 high severity visual QA 未修复或未接受：${detector} (${status || "missing"})。`,
        fix: "修复 high severity issue，或写明确 accepted reason 并把 status 改为 accepted；pending / blocked 不能进入 verify。",
      });
    }

    if (!isMeaningfulCell(String(entry.owner ?? ""))) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-visual-qa-owner-missing",
        message: `${outputPath} 的 visual_qa[${index}].owner 缺失或仍像占位。`,
        fix: "owner 写 sf-ui-design、sf-implement、用户确认人或具体阶段，便于后续追责。",
      });
    }
  }
}

function lintDesignScanManifest(issues, scanManifest, outputPath) {
  if (!scanManifest || typeof scanManifest !== "object") {
    issues.push({
      severity: "FAIL",
      code: "design-contract-scan-manifest-missing",
      message: `${outputPath} 缺少 scan_manifest。`,
      fix: "按 read-profiles.md 的 full-system orchestration 与 output-contract.md 输出扫描过的文件、选择的数据 id 和跳过理由。",
    });
    return;
  }

  addMissingFields(issues, scanManifest, ["profile", "workflow", "scanned_files", "selected_data", "selection_rationale", "skipped_with_reason"], outputPath, "scan_manifest");
  if (!Array.isArray(scanManifest.workflow) || scanManifest.workflow.length === 0) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-scan-workflow-empty",
      message: `${outputPath} 的 scan_manifest.workflow 为空。`,
      fix: "记录 mode / source / font / color / composition / advanced_interaction / component / qa 等扫描步骤。",
    });
  }
  if (!Array.isArray(scanManifest.scanned_files) || scanManifest.scanned_files.length === 0) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-scanned-files-empty",
      message: `${outputPath} 的 scan_manifest.scanned_files 为空。`,
      fix: "记录至少 read-profiles 和 design-composition 的扫描结果。",
    });
  }

  const scannedPaths = new Set((scanManifest.scanned_files ?? []).map((entry) => entry?.path).filter(Boolean));
  for (const requiredPath of [
    "references/read-profiles.md",
    "references/design-composition.md",
  ]) {
    if (!scannedPaths.has(requiredPath)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-required-scan-missing",
        message: `${outputPath} 的 scan_manifest.scanned_files 缺少 ${requiredPath}。`,
        fix: "按 read-profiles.md 的 profile / full-system 链路记录该文件的用途、状态和结论；不适用也要写 skipped 与理由。",
      });
    }
  }

  const selected = scanManifest.selected_data;
  addMissingFields(issues, selected, [
    "palette_id",
    "font_source_id",
    "font_pairing_id",
    "type_scale_id",
    "spacing_density_id",
    "radius_shadow_recipe_id",
    "motion_recipe_id",
    "advanced_interaction_recipe_id",
  ], outputPath, "scan_manifest.selected_data");

  const idSources = [
    ["font_pairing_id", "font_pairing"],
    ["type_scale_id", "type_scale"],
    ["spacing_density_id", "spacing_density"],
    ["radius_shadow_recipe_id", "radius_shadow"],
    ["motion_recipe_id", "motion"],
    ["advanced_interaction_recipe_id", "advanced_interaction"],
  ];
  for (const [field, recipeType] of idSources) {
    const value = String(selected?.[field] ?? "").trim();
    if (!isMeaningfulCell(value)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-selected-data-missing",
        message: `${outputPath} 的 scan_manifest.selected_data.${field} 缺失或仍像占位。`,
        fix: `从 data/foundation-recipes.csv 的 recipe_type=${recipeType} 选择一个 id；不使用高级交互时写 none-product-ui 或明确 N/A recipe。`,
      });
      continue;
    }
    if (/^N\/A$/i.test(value)) continue;
    const ids = foundationRecipeIds(recipeType);
    if (ids.size > 0 && !ids.has(value)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-selected-data-unknown",
        message: `${outputPath} 的 ${field} 不存在于 foundation-recipes.csv#${recipeType}：${value}。`,
        fix: `改用 data/foundation-recipes.csv 中 recipe_type=${recipeType} 的现有 id，或先把新 recipe 记录进数据表。`,
      });
    }
  }

  lintSelectionRationale(issues, selected, scanManifest.selection_rationale, outputPath);
}

function lintReferenceSelectionContract(issues, contract, outputPath) {
  const hasReferenceWorkflow = Array.isArray(contract.scan_manifest?.workflow)
    && contract.scan_manifest.workflow.includes("reference");
  const hasReferenceSelection = Object.prototype.hasOwnProperty.call(contract, "reference_selection");

  if (hasReferenceSelection) {
    const referenceSelection = contract.reference_selection;
    if (!referenceSelection || typeof referenceSelection !== "object" || Array.isArray(referenceSelection)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-reference-selection-invalid",
        message: `${outputPath} 的 reference_selection 必须是 object，不能是 N/A、null、空字符串或数组。`,
        fix: "无外部参考时省略 reference_selection；有外部参考时按 design-contract.schema.json#/$defs/referenceSelection 补齐 object。",
      });
      return;
    }

    addMissingFields(
      issues,
      referenceSelection,
      ["ui_type", "stack", "selected_needs", "borrow_strength", "source_routing", "reuse_boundary", "offline_behavior", "human_confirmation", "forbidden"],
      outputPath,
      "reference_selection",
      "design-contract-reference-selection-field-missing",
    );

    addEnumArrayIssues(issues, referenceSelection.ui_type, referenceUiTypeValues, outputPath, "reference_selection.ui_type", "ui_type 必须使用 design-contract.schema.json#/$defs/referenceSelection 中的稳定枚举。");
    addEnumArrayIssues(issues, referenceSelection.stack, referenceStackValues, outputPath, "reference_selection.stack", "stack 必须使用 design-contract.schema.json#/$defs/referenceSelection 中的稳定枚举。");
    addEnumArrayIssues(issues, referenceSelection.selected_needs, referenceNeedValues, outputPath, "reference_selection.selected_needs", "selected_needs 必须使用 design-contract.schema.json#/$defs/referenceSelection 中的稳定枚举。");
    addEnumValueIssue(issues, referenceSelection.borrow_strength, referenceBorrowStrengthValues, outputPath, "reference_selection.borrow_strength", "borrow_strength 只能写 conservative / moderate / strong / review-only。");
    if (Object.prototype.hasOwnProperty.call(referenceSelection, "admin_modules")) {
      addEnumArrayIssues(issues, referenceSelection.admin_modules, referenceAdminModuleValues, outputPath, "reference_selection.admin_modules", "admin_modules 必须使用 design-contract.schema.json#/$defs/referenceSelection 中的稳定枚举。");
    }
    if (Object.prototype.hasOwnProperty.call(referenceSelection, "visual_direction")) {
      addEnumArrayIssues(issues, referenceSelection.visual_direction, referenceVisualDirectionValues, outputPath, "reference_selection.visual_direction", "visual_direction 必须使用 design-contract.schema.json#/$defs/referenceSelection 中的稳定枚举。");
    }

    if (!Array.isArray(referenceSelection.source_routing)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-reference-selection-array-invalid",
        message: `${outputPath} 的 reference_selection.source_routing 必须是数组。`,
        fix: "source_routing 按 design-contract.schema.json#/$defs/referenceSelection 写成数组；无外部来源时省略 reference_selection。",
      });
    } else {
      for (const [index, route] of referenceSelection.source_routing.entries()) {
        if (!route || typeof route !== "object" || Array.isArray(route)) {
          issues.push({
            severity: "FAIL",
            code: "design-contract-reference-source-routing-entry-invalid",
            message: `${outputPath} 的 reference_selection.source_routing[${index}] 不是对象。`,
            fix: "每条 source_routing 必须写成 { selected_need, source_pool, use_for, reuse_mode, required_extraction, avoid, offline_fallback? }。",
          });
          continue;
        }

        addMissingFields(
          issues,
          route,
          ["selected_need", "source_pool", "use_for", "reuse_mode", "required_extraction", "avoid"],
          outputPath,
          `reference_selection.source_routing[${index}]`,
          "design-contract-reference-source-routing-field-missing",
        );
        addEnumValueIssue(issues, route.reuse_mode, referenceReuseModeValues, outputPath, `reference_selection.source_routing[${index}].reuse_mode`, "reuse_mode 必须使用 design-contract.schema.json#/$defs/referenceSelection 中的稳定枚举。");
      }
    }

    const confirmation = referenceSelection.human_confirmation;
    if (!confirmation || typeof confirmation !== "object" || Array.isArray(confirmation)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-reference-confirmation-invalid",
        message: `${outputPath} 的 reference_selection.human_confirmation 不是对象。`,
        fix: "human_confirmation 必须写成 { status, reason }，明确 confirmed / defaulted / pending。",
      });
    } else {
      addMissingFields(
        issues,
        confirmation,
        ["status", "reason"],
        outputPath,
        "reference_selection.human_confirmation",
        "design-contract-reference-confirmation-field-missing",
      );
      addEnumValueIssue(issues, confirmation.status, humanConfirmationStatusValues, outputPath, "reference_selection.human_confirmation.status", "status 只能写 confirmed / defaulted / pending。");
    }
  }

  if (hasReferenceSelection && !hasReferenceWorkflow) {
    issues.push({
      severity: "WARN",
      code: "design-contract-reference-selection-without-workflow",
      message: `${outputPath} 包含 reference_selection，但 scan_manifest.workflow 没有 reference。`,
      fix: "如果使用了外部参考，把 reference 加入 scan_manifest.workflow；如果没有外部参考，则删除 reference_selection 并写 skipped_with_reason。",
    });
  }

  if (hasReferenceWorkflow && !hasReferenceSelection) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-reference-workflow-missing-selection",
      message: `${outputPath} 的 scan_manifest.workflow 包含 reference，但缺少 reference_selection。`,
      fix: "有外部参考流程时必须写 object 形式的 reference_selection；否则从 workflow 移除 reference，并写 skipped_with_reason。",
    });
  }

  if (!hasReferenceWorkflow && !hasReferenceSelection) {
    const skipped = contract.scan_manifest?.skipped_with_reason;
    const text = Array.isArray(skipped)
      ? skipped.map((entry) => (typeof entry === "string" ? entry : JSON.stringify(entry))).join(" ")
      : String(skipped ?? "");
    if (!/reference_selection|external reference|外部参考|no external reference requested/i.test(text)) {
      issues.push({
        severity: "WARN",
        code: "design-contract-reference-selection-skip-reason-missing",
        message: `${outputPath} 没有 reference_selection，但 skipped_with_reason 未记录无外部参考理由。`,
        fix: "在 scan_manifest.skipped_with_reason 写入 reference_selection: no external reference requested。",
      });
    }
  }
}

function hasDesignWorkflow(contract, key) {
  return Array.isArray(contract.scan_manifest?.workflow) && contract.scan_manifest.workflow.includes(key);
}

function hasOwnContractField(contract, key) {
  return Object.prototype.hasOwnProperty.call(contract ?? {}, key);
}

function lintCreativeDirectionContract(issues, contract, outputPath) {
  const requiredByWorkflow = hasDesignWorkflow(contract, "creative_direction");
  if (!requiredByWorkflow && !hasOwnContractField(contract, "creative_direction")) return;

  const value = contract.creative_direction;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-creative-direction-missing",
      message: `${outputPath} 的 scan_manifest.workflow 声明了 creative_direction，但缺少 object 形式的 creative_direction。`,
      fix: "按 creative-direction.md 输出 selected、why、alternatives、rejected_defaults 和 signature_carrier，先拒绝默认后台壳再定设计方向。",
    });
    return;
  }

  addMissingFields(
    issues,
    value,
    ["selected", "why", "alternatives", "rejected_defaults", "signature_carrier"],
    outputPath,
    "creative_direction",
    "design-contract-creative-direction-field-missing",
  );
  addMeaningfulFieldIssue(issues, value.selected, outputPath, "creative_direction.selected", "写入被采用的创意方向，不要只写 Product UI / 后台管理。");
  addMeaningfulFieldIssue(issues, value.why, outputPath, "creative_direction.why", "写清该方向如何服务用户、业务对象和交互任务。");
  addNonEmptyArrayIssue(issues, value.rejected_defaults, outputPath, "creative_direction.rejected_defaults", "列出至少一个被拒绝的默认套路，例如固定侧栏 + KPI 卡片 + 大表格。");
  addNonEmptyArrayIssue(issues, value.alternatives, outputPath, "creative_direction.alternatives", "至少给一个互斥候选方向，避免单一路线自证合理。");

  const carrier = String(value.signature_carrier ?? "").trim();
  if (!["structure", "typography", "asset", "motion", "material", "interaction", "mixed"].includes(carrier)) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-creative-direction-carrier-invalid",
      message: `${outputPath} 的 creative_direction.signature_carrier 非法：${carrier || "missing"}。`,
      fix: "signature_carrier 只能写 structure / typography / asset / motion / material / interaction / mixed。",
    });
  }

  for (const [index, alternative] of (Array.isArray(value.alternatives) ? value.alternatives : []).entries()) {
    if (!alternative || typeof alternative !== "object" || Array.isArray(alternative)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-creative-direction-alternative-invalid",
        message: `${outputPath} 的 creative_direction.alternatives[${index}] 不是对象。`,
        fix: "每个 candidate 写成 { id, positioning, fit, risk }，方便用户确认或后续复盘。",
      });
      continue;
    }
    addMissingFields(
      issues,
      alternative,
      ["id", "positioning", "fit", "risk"],
      outputPath,
      `creative_direction.alternatives[${index}]`,
      "design-contract-creative-direction-alternative-field-missing",
    );
  }
}

function lintReferenceEvidenceContract(issues, contract, outputPath) {
  const requiredByWorkflow = hasDesignWorkflow(contract, "live_reference");
  if (!requiredByWorkflow && !hasOwnContractField(contract, "reference_evidence")) return;

  const value = contract.reference_evidence;
  if (!Array.isArray(value) || value.length === 0) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-reference-evidence-missing",
      message: `${outputPath} 的 scan_manifest.workflow 声明了 live_reference，但 reference_evidence 缺失或为空。`,
      fix: "记录每个外部网站 / 模板 / 截图的 access、viewport、observed、borrowed、rejected 和 confidence；无法访问也要写 offline-fallback。",
    });
    return;
  }

  for (const [index, entry] of value.entries()) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-reference-evidence-entry-invalid",
        message: `${outputPath} 的 reference_evidence[${index}] 不是对象。`,
        fix: "每条 evidence 写成 { source, source_url?, access, viewport, observed, borrowed, rejected, confidence }。",
      });
      continue;
    }
    addMissingFields(
      issues,
      entry,
      ["source", "access", "viewport", "observed", "borrowed", "rejected", "confidence"],
      outputPath,
      `reference_evidence[${index}]`,
      "design-contract-reference-evidence-field-missing",
    );
    addMeaningfulFieldIssue(issues, entry.source, outputPath, `reference_evidence[${index}].source`, "写明具体来源，不要只写“优秀网站”。");
    addMeaningfulFieldIssue(issues, entry.viewport, outputPath, `reference_evidence[${index}].viewport`, "记录观察视口，例如 desktop 1440px / mobile 390px。");
    addNonEmptyArrayIssue(issues, entry.observed, outputPath, `reference_evidence[${index}].observed`, "记录实际观察到的布局、滚动、交互或视觉事实。");
    const access = String(entry.access ?? "").trim();
    if (!["catalog", "static", "scroll", "interactive", "comparative", "offline-fallback"].includes(access)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-reference-evidence-access-invalid",
        message: `${outputPath} 的 reference_evidence[${index}].access 非法：${access || "missing"}。`,
        fix: "access 只能写 catalog / static / scroll / interactive / comparative / offline-fallback。",
      });
    }
    const confidence = String(entry.confidence ?? "").trim();
    if (!selectionConfidenceValues.has(confidence)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-reference-evidence-confidence-invalid",
        message: `${outputPath} 的 reference_evidence[${index}].confidence 非法：${confidence || "missing"}。`,
        fix: "confidence 只能写 confirmed / likely / unclear。",
      });
    }
  }
}

function lintAssetManifestContract(issues, contract, outputPath) {
  const requiredByWorkflow = hasDesignWorkflow(contract, "asset_brief");
  if (!requiredByWorkflow && !hasOwnContractField(contract, "asset_manifest")) return;

  const value = contract.asset_manifest;
  if (!Array.isArray(value) || value.length === 0) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-asset-manifest-missing",
      message: `${outputPath} 的 scan_manifest.workflow 声明了 asset_brief，但 asset_manifest 缺失或为空。`,
      fix: "按 motion-block-library.md#Asset Brief Add-on 写入每个图片、3D、纹理、视频或图标素材的目标路径、用途、生成提示词/来源、落位和许可说明。",
    });
    return;
  }

  for (const [index, entry] of value.entries()) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-asset-manifest-entry-invalid",
        message: `${outputPath} 的 asset_manifest[${index}] 不是对象。`,
        fix: "每条 asset 写成 { kind, target_path, purpose, prompt_or_source, placement, required, license_note }。",
      });
      continue;
    }
    addMissingFields(
      issues,
      entry,
      ["kind", "target_path", "purpose", "prompt_or_source", "placement", "required", "license_note"],
      outputPath,
      `asset_manifest[${index}]`,
      "design-contract-asset-manifest-field-missing",
    );
    for (const field of ["target_path", "purpose", "prompt_or_source", "placement", "license_note"]) {
      addMeaningfulFieldIssue(issues, entry[field], outputPath, `asset_manifest[${index}].${field}`, "素材 brief 必须能直接交给生成工具或实现阶段，不要留空占位。");
    }
    const kind = String(entry.kind ?? "").trim();
    if (!["image", "illustration", "icon", "3d-model", "video", "texture", "lottie", "audio"].includes(kind)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-asset-kind-invalid",
        message: `${outputPath} 的 asset_manifest[${index}].kind 非法：${kind || "missing"}。`,
        fix: "kind 只能写 image / illustration / icon / 3d-model / video / texture / lottie / audio。",
      });
    }
    if (typeof entry.required !== "boolean") {
      issues.push({
        severity: "FAIL",
        code: "design-contract-asset-required-invalid",
        message: `${outputPath} 的 asset_manifest[${index}].required 必须是 boolean。`,
        fix: "required 写 true / false，明确该素材是否阻断实现。",
      });
    }
  }
}

function lintInteractionSignatureContract(issues, contract, outputPath) {
  const advancedId = String(contract.scan_manifest?.selected_data?.advanced_interaction_recipe_id ?? "").trim();
  const selectedAdvancedInteraction = isMeaningfulCell(advancedId)
    && !/^(N\/A|none|none-product-ui|no-advanced-interaction)$/i.test(advancedId);
  const hasGsapEntries = Array.isArray(contract.motion?.layer_3_gsap) && contract.motion.layer_3_gsap.length > 0;
  const requiredByWorkflow = hasDesignWorkflow(contract, "interaction_signature") || selectedAdvancedInteraction || hasGsapEntries;
  if (!requiredByWorkflow && !hasOwnContractField(contract, "interaction_signature")) return;

  const value = contract.interaction_signature;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-interaction-signature-missing",
      message: `${outputPath} 声明了高级交互 / GSAP / signature motion，但缺少 object 形式的 interaction_signature。`,
      fix: "按 motion-block-library.md 写 purpose、trigger、technique、motion_blocks、fallback 和 verification，证明动效服务任务而不是装饰。",
    });
    return;
  }

  addMissingFields(
    issues,
    value,
    ["purpose", "trigger", "technique", "motion_blocks", "fallback", "verification"],
    outputPath,
    "interaction_signature",
    "design-contract-interaction-signature-field-missing",
  );
  for (const field of ["purpose", "trigger", "fallback", "verification"]) {
    addMeaningfulFieldIssue(issues, value[field], outputPath, `interaction_signature.${field}`, "高级交互必须写清任务目的、触发方式、降级和验证证据。");
  }
  addNonEmptyArrayIssue(issues, value.motion_blocks, outputPath, "interaction_signature.motion_blocks", "至少选择一个 motion block，避免只写“炫酷动效”。");
  const technique = String(value.technique ?? "").trim();
  if (!["css", "motion-vue", "gsap", "three", "canvas", "webgl", "mixed"].includes(technique)) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-interaction-technique-invalid",
      message: `${outputPath} 的 interaction_signature.technique 非法：${technique || "missing"}。`,
      fix: "technique 只能写 css / motion-vue / gsap / three / canvas / webgl / mixed。",
    });
  }
}

function lintDesignEnhancementContracts(issues, contract, outputPath) {
  lintCreativeDirectionContract(issues, contract, outputPath);
  lintReferenceEvidenceContract(issues, contract, outputPath);
  lintAssetManifestContract(issues, contract, outputPath);
  lintInteractionSignatureContract(issues, contract, outputPath);
}

function lintSelectionRationale(issues, selected, rationale, outputPath) {
  if (!rationale || typeof rationale !== "object") {
    issues.push({
      severity: "FAIL",
      code: "design-contract-selection-rationale-missing",
      message: `${outputPath} 缺少 scan_manifest.selection_rationale。`,
      fix: "为 palette、font、type scale、spacing、radius/shadow、motion 和 advanced interaction 补齐选择理由、拒绝项、风险和置信度。",
    });
    return;
  }

  addMissingFields(
    issues,
    rationale,
    selectionRationaleMap.map(([, key]) => key),
    outputPath,
    "scan_manifest.selection_rationale",
    "design-contract-selection-rationale-field-missing",
  );

  for (const [selectedField, rationaleKey] of selectionRationaleMap) {
    const entry = rationale?.[rationaleKey];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-selection-rationale-entry-invalid",
        message: `${outputPath} 的 scan_manifest.selection_rationale.${rationaleKey} 不是对象。`,
        fix: "每个 selection rationale 必须写成 { id, why, rejected, risk, confidence, license? }。",
      });
      continue;
    }

    addMissingFields(
      issues,
      entry,
      ["id", "why", "rejected", "risk", "confidence"],
      outputPath,
      `scan_manifest.selection_rationale.${rationaleKey}`,
      "design-contract-selection-rationale-field-missing",
    );

    const selectedId = String(selected?.[selectedField] ?? "").trim();
    const rationaleId = String(entry.id ?? "").trim();
    if (!isMeaningfulCell(rationaleId)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-selection-rationale-id-missing",
        message: `${outputPath} 的 selection_rationale.${rationaleKey}.id 缺失或仍像占位。`,
        fix: `让 selection_rationale.${rationaleKey}.id 与 selected_data.${selectedField} 保持一致。`,
      });
    } else if (isMeaningfulCell(selectedId) && !/^N\/A$/i.test(selectedId) && rationaleId !== selectedId) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-selection-rationale-id-mismatch",
        message: `${outputPath} 的 selected_data.${selectedField}=${selectedId}，但 selection_rationale.${rationaleKey}.id=${rationaleId}。`,
        fix: "selected_data 负责机器读取，selection_rationale 负责解释；两边 id 必须一致，避免后续阶段不知道真正选了什么。",
      });
    }

    for (const field of ["why", "risk"]) {
      if (!isMeaningfulCell(String(entry[field] ?? ""))) {
        issues.push({
          severity: "FAIL",
          code: "design-contract-selection-rationale-text-missing",
          message: `${outputPath} 的 selection_rationale.${rationaleKey}.${field} 缺失或仍像占位。`,
          fix: "写清选择原因和替换风险；后续 tech-design / implement 需要知道为什么不能随便换。",
        });
      }
    }

    if (!Array.isArray(entry.rejected) || entry.rejected.length === 0 || entry.rejected.some((item) => !isMeaningfulCell(String(item ?? "")))) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-selection-rationale-rejected-missing",
        message: `${outputPath} 的 selection_rationale.${rationaleKey}.rejected 缺少明确拒绝项。`,
        fix: "至少记录一个被拒绝的备选 id / 方向 / 组合；没有真实备选时写明 none-with-reason。",
      });
    }

    if (!selectionConfidenceValues.has(String(entry.confidence ?? ""))) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-selection-rationale-confidence-invalid",
        message: `${outputPath} 的 selection_rationale.${rationaleKey}.confidence 非法：${entry.confidence ?? "missing"}。`,
        fix: "confidence 只能写 confirmed / likely / unclear。",
      });
    }
  }
}

function lintFoundationSystem(issues, foundation, outputPath) {
  if (!foundation || typeof foundation !== "object") {
    issues.push({
      severity: "FAIL",
      code: "design-contract-foundation-system-missing",
      message: `${outputPath} 缺少 foundation_system。`,
      fix: "补齐 typography、spacing、radius_shadow 和 motion；这些字段必须来自 design-composition 与 foundation 数据表。",
    });
    return;
  }

  addMissingFields(issues, foundation, ["source_basis", "typography", "spacing", "radius_shadow", "motion"], outputPath, "foundation_system");
  addMissingFields(issues, foundation.typography, ["font_family", "scale", "line_height", "numeric", "usage_rules"], outputPath, "foundation_system.typography");
  addMissingFields(issues, foundation.spacing, ["density", "grid", "page_padding", "section_gap", "component_gap", "usage_rules"], outputPath, "foundation_system.spacing");
  addMissingFields(issues, foundation.radius_shadow, ["radius_scale", "surface_treatment", "overlay_shadow", "usage_rules"], outputPath, "foundation_system.radius_shadow");
  addMissingFields(issues, foundation.motion, ["motion_personality", "css_tokens", "gsap_signature", "reduced_motion"], outputPath, "foundation_system.motion");

  const requiredArrays = [
    ["foundation_system.source_basis", foundation.source_basis],
    ["foundation_system.typography.usage_rules", foundation.typography?.usage_rules],
    ["foundation_system.spacing.usage_rules", foundation.spacing?.usage_rules],
    ["foundation_system.radius_shadow.usage_rules", foundation.radius_shadow?.usage_rules],
    ["foundation_system.motion.css_tokens", foundation.motion?.css_tokens],
  ];
  for (const [owner, value] of requiredArrays) {
    if (!Array.isArray(value) || value.length === 0) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-foundation-array-empty",
        message: `${outputPath} 的 ${owner} 为空。`,
        fix: "写入至少一条可执行规则或 token；不要只写字段名。",
      });
    }
  }
}

function lintTokenDeliveryHint(issues, hint, outputPath) {
  if (!hint || typeof hint !== "object" || Array.isArray(hint)) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-token-delivery-hint-missing",
      message: `${outputPath} 缺少 token_delivery_hint。`,
      fix: "补齐 CSS variables、Tailwind mapping、Pencil variables 和 notes；该字段是 implementation hint，不替代 sf-tech-design 的最终工程决策。",
    });
    return;
  }

  addMissingFields(
    issues,
    hint,
    ["css_variables", "tailwind_mapping", "pencil_variables", "notes"],
    outputPath,
    "token_delivery_hint",
    "design-contract-token-delivery-hint-field-missing",
  );

  if (!Array.isArray(hint.css_variables) || hint.css_variables.length === 0) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-token-delivery-css-vars-empty",
      message: `${outputPath} 的 token_delivery_hint.css_variables 为空。`,
      fix: "至少写入背景、surface、text、primary、radius、motion 等 CSS variable hint。",
    });
  } else {
    for (const [index, variable] of hint.css_variables.entries()) {
      const value = String(variable ?? "").trim();
      if (!/^--[A-Za-z0-9_-]+$/.test(value)) {
        issues.push({
          severity: "FAIL",
          code: "design-contract-token-delivery-css-var-invalid",
          message: `${outputPath} 的 token_delivery_hint.css_variables[${index}] 不是合法 CSS variable：${value || "missing"}。`,
          fix: "CSS variable hint 必须形如 --sf-bg、--sf-primary、--sf-radius-card。",
        });
      }
    }
  }

  const mapping = hint.tailwind_mapping;
  if (!mapping || typeof mapping !== "object" || Array.isArray(mapping) || Object.keys(mapping).length === 0) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-token-delivery-tailwind-empty",
      message: `${outputPath} 的 token_delivery_hint.tailwind_mapping 为空。`,
      fix: "至少写入 colors.background、colors.primary、borderRadius.card 等 Tailwind theme hint。",
    });
  } else {
    for (const [key, value] of Object.entries(mapping)) {
      if (!isMeaningfulCell(String(key)) || !isMeaningfulCell(String(value ?? ""))) {
        issues.push({
          severity: "FAIL",
          code: "design-contract-token-delivery-tailwind-invalid",
          message: `${outputPath} 的 token_delivery_hint.tailwind_mapping 存在空 key 或 value。`,
          fix: "Tailwind mapping 用 theme path -> var(--token) 的形式，例如 colors.background: var(--sf-bg)。",
        });
      }
      if (!/^var\(--[A-Za-z0-9_-]+\)$/.test(String(value ?? "").trim())) {
        issues.push({
          severity: "WARN",
          code: "design-contract-token-delivery-tailwind-not-var",
          message: `${outputPath} 的 token_delivery_hint.tailwind_mapping.${key} 不是 var(--token) 形式。`,
          fix: "优先映射到 CSS variables，最终 Tailwind theme 由 sf-tech-design 决定。",
        });
      }
    }
  }

  if (!Array.isArray(hint.pencil_variables) || hint.pencil_variables.length === 0 || hint.pencil_variables.some((item) => !isMeaningfulCell(String(item ?? "")))) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-token-delivery-pencil-empty",
      message: `${outputPath} 的 token_delivery_hint.pencil_variables 为空或含占位值。`,
      fix: "至少写入 color.background、color.surface、type.body、space.3 等 Pencil variable hint。",
    });
  }

  const notes = String(hint.notes ?? "");
  if (!isMeaningfulCell(notes)) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-token-delivery-notes-missing",
      message: `${outputPath} 的 token_delivery_hint.notes 缺失或仍像占位。`,
      fix: "写清这是 hint，不是最终工程决策；最终 CSS / Tailwind / Pencil 落地由 sf-tech-design 确认。",
    });
  } else if (!/\bhint\b|提示|tech-design|技术设计|最终/i.test(notes)) {
    issues.push({
      severity: "WARN",
      code: "design-contract-token-delivery-notes-not-hint",
      message: `${outputPath} 的 token_delivery_hint.notes 没有说明该字段只是实现提示。`,
      fix: "补一句：这是 design-system 输出的 hint，最终 token delivery 由 sf-tech-design 决定。",
    });
  }
}

function lintHumanConfirmation(issues, confirmation, outputPath) {
  if (!confirmation || typeof confirmation !== "object" || Array.isArray(confirmation)) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-human-confirmation-missing",
      message: `${outputPath} 缺少 human_confirmation。`,
      fix: "补齐 required、reason、options_presented、selected、status 和 default_reversibility，明确是用户确认、低风险默认还是未决。",
    });
    return;
  }

  addMissingFields(
    issues,
    confirmation,
    ["required", "reason", "options_presented", "selected", "status", "default_reversibility"],
    outputPath,
    "human_confirmation",
    "design-contract-human-confirmation-field-missing",
  );

  const required = confirmation.required;
  const status = String(confirmation.status ?? "").trim();
  const options = Array.isArray(confirmation.options_presented) ? confirmation.options_presented.map((item) => String(item ?? "").trim()).filter(Boolean) : [];
  const selected = String(confirmation.selected ?? "").trim();

  if (typeof required !== "boolean") {
    issues.push({
      severity: "FAIL",
      code: "design-contract-human-confirmation-required-invalid",
      message: `${outputPath} 的 human_confirmation.required 不是 boolean。`,
      fix: "required 用 true / false：影响审美方向、IA 或首屏层级时为 true；低风险可逆小改为 false。",
    });
  }

  if (!humanConfirmationStatusValues.has(status)) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-human-confirmation-status-invalid",
      message: `${outputPath} 的 human_confirmation.status 非法：${status || "missing"}。`,
      fix: "status 只能写 confirmed / defaulted / pending。",
    });
  }

  for (const field of ["reason", "selected"]) {
    if (!isMeaningfulCell(String(confirmation[field] ?? ""))) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-human-confirmation-text-missing",
        message: `${outputPath} 的 human_confirmation.${field} 缺失或仍像占位。`,
        fix: "写明为什么需要确认 / 默认，以及用户选择或低风险默认项；不要把 Agent 推荐当成用户确认。",
      });
    }
  }

  if (!Array.isArray(confirmation.options_presented) || options.length === 0 || options.some((item) => !isMeaningfulCell(item))) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-human-confirmation-options-missing",
      message: `${outputPath} 的 human_confirmation.options_presented 缺少明确选项。`,
      fix: "写入呈现给用户的互斥方向，低风险默认也要写默认项，例如 current-system-default。",
    });
  }

  if (required === true) {
    if (options.length < 2) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-human-confirmation-options-too-few",
        message: `${outputPath} 标记 required: true，但没有给用户至少 2 个方向选项。`,
        fix: "影响审美方向、IA 或首屏任务层级时，必须给 2-3 个互斥选项，或把 status 标为 pending。",
      });
    }
    if (status === "defaulted") {
      issues.push({
        severity: "FAIL",
        code: "design-contract-human-confirmation-defaulted-required",
        message: `${outputPath} 的 human_confirmation.required 为 true，但 status 写成 defaulted。`,
        fix: "需要人工确认的方向不能被 Agent 默认；改为 confirmed（有用户证据）或 pending。",
      });
    }
    if (status === "pending") {
      issues.push({
        severity: "FAIL",
        code: "design-contract-human-confirmation-pending",
        message: `${outputPath} 的 human_confirmation 仍是 pending。`,
        fix: "方向会影响审美、IA 或首屏层级时，pending 不能进入 tech-design / implement；先回到用户确认。",
      });
    }
  }

  if (required === false && status === "defaulted" && !isMeaningfulCell(String(confirmation.default_reversibility ?? ""))) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-human-confirmation-default-reversibility-missing",
      message: `${outputPath} 的低风险默认缺少 default_reversibility。`,
      fix: "说明为什么这个默认可逆，例如只影响 palette / spacing / copy，不涉及 schema、IA、权限或数据迁移。",
    });
  }

  if (status === "confirmed") {
    if (/agent\s*(recommendation|recommended)|ai\s*推荐|agent\s*建议|系统推荐|建议方向/i.test(selected)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-human-confirmation-agent-recommendation-as-confirmed",
        message: `${outputPath} 把 Agent 推荐写成了 confirmed：${selected}。`,
        fix: "只有用户明确选择才能写 confirmed；Agent 推荐应写 defaulted（低风险可逆）或 pending（需要用户确认）。",
      });
    }
    if (options.length > 0 && !options.includes(selected)) {
      issues.push({
        severity: "WARN",
        code: "design-contract-human-confirmation-selected-not-in-options",
        message: `${outputPath} 的 selected 不在 options_presented 中：${selected}。`,
        fix: "确认用户选择是否来自已展示选项；如用户自由选择了新方向，把它补入 options_presented。",
      });
    }
  }
}

function addMeaningfulFieldIssue(issues, value, outputPath, owner, fix) {
  if (isMeaningfulCell(String(value ?? ""))) return;
  issues.push({
    severity: "FAIL",
    code: "design-contract-mode-field-empty",
    message: `${outputPath} 的 ${owner} 缺失或仍像占位。`,
    fix,
  });
}

function addNonEmptyArrayIssue(issues, value, outputPath, owner, fix) {
  if (Array.isArray(value) && value.length > 0) return;
  issues.push({
    severity: "FAIL",
    code: "design-contract-mode-array-empty",
    message: `${outputPath} 的 ${owner} 为空。`,
    fix,
  });
}

function lintGsapMotionEntries(issues, motion, outputPath) {
  const entries = motion?.layer_3_gsap;
  if (!Array.isArray(entries) || entries.length === 0) return;

  for (const [index, entry] of entries.entries()) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-gsap-entry-invalid",
        message: `${outputPath} 的 motion.layer_3_gsap[${index}] 不是带 effect / fallback / verification 的对象。`,
        fix: "GSAP 一旦使用，就必须写成对象：{ effect, fallback, verification }，不要只写字符串。",
      });
      continue;
    }
    for (const field of ["effect", "fallback", "verification"]) {
      if (!isMeaningfulCell(String(entry[field] ?? ""))) {
        issues.push({
          severity: "FAIL",
          code: "design-contract-gsap-entry-field-missing",
          message: `${outputPath} 的 motion.layer_3_gsap[${index}].${field} 缺失或仍像占位。`,
          fix: "补齐 GSAP 效果说明、reduced motion / 静态降级，以及截图、像素、动画状态或交互验证方式。",
        });
      }
    }
  }
}

function lintDesignModeConditionalContract(issues, contract, outputPath) {
  const mode = contract?.design_mode;
  lintGsapMotionEntries(issues, contract?.motion, outputPath);

  if (mode === "Product UI" || mode === "Hybrid") {
    addMissingFields(issues, contract, ["layout", "state_matrix", "product_ui_quality"], outputPath, `${mode} conditional contract`, "design-contract-mode-required-field-missing");
    addMeaningfulFieldIssue(
      issues,
      contract.layout?.primary_work_surface,
      outputPath,
      "layout.primary_work_surface",
      "Product UI / Hybrid 必须写真实工作表面，例如 table、workflow board、timeline、split panel 或业务对象列表；不能只写 dashboard shell。",
    );
    addNonEmptyArrayIssue(
      issues,
      contract.state_matrix?.required_states,
      outputPath,
      "state_matrix.required_states",
      "写入 default / loading / empty / error / permission / success 中适用状态，避免只交付默认态。",
    );
    for (const field of ["primary_user", "primary_object", "primary_job"]) {
      addMeaningfulFieldIssue(
        issues,
        contract.product_ui_quality?.[field],
        outputPath,
        `product_ui_quality.${field}`,
        "Product UI / Hybrid 必须绑定主要使用者、主要业务对象和主要任务，避免 KPI wallpaper 和空壳工作台。",
      );
    }
    addNonEmptyArrayIssue(
      issues,
      contract.verification_hooks,
      outputPath,
      "verification_hooks",
      "写入至少一个截图、DOM、a11y、responsive、motion 或状态验证 hook。",
    );
    addNonEmptyArrayIssue(
      issues,
      contract.anti_slop_rules,
      outputPath,
      "anti_slop_rules",
      "写入至少一个反模板 / 反廉价感规则，让后续 review 有可执行检查点。",
    );
  }

  if (mode === "Brand Surface") {
    addMissingFields(issues, contract, ["layout", "motion"], outputPath, "Brand Surface conditional contract", "design-contract-mode-required-field-missing");
    const signatureType = String(contract.signature?.type ?? "");
    if (!["typographic", "material", "motion"].includes(signatureType)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-brand-signature-invalid",
        message: `${outputPath} 的 Brand Surface signature.type 不能是 ${signatureType || "missing"}。`,
        fix: "Brand Surface 的 signature.type 使用 typographic / material / motion 之一；不要只写 structural 这类后台布局签名。",
      });
    }
    addMeaningfulFieldIssue(
      issues,
      contract.motion?.reduced_motion,
      outputPath,
      "motion.reduced_motion",
      "Brand Surface 可以更强表达，但必须写 reduced motion 降级策略。",
    );
  }

  if (mode === "Avatar-IP" || mode === "Empty State") {
    if (!designScopeValues.has(contract.scope)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-avatar-empty-scope-missing",
        message: `${outputPath} 的 ${mode} 缺少合法 scope。`,
        fix: "Avatar-IP / Empty State 必须写 scope: avatar / empty_state / both；不要把组合值写进 design_mode。",
      });
    }
    if (contract.token_source === "new") {
      issues.push({
        severity: "FAIL",
        code: "design-contract-local-token-pollution",
        message: `${outputPath} 的 ${mode} 使用 token_source: new，可能污染全局 token。`,
        fix: "头像、IP 或空态默认使用 existing / delta；只记录局部 token delta，不新建全局设计系统。",
      });
    }
    addNonEmptyArrayIssue(
      issues,
      contract.anti_slop_rules,
      outputPath,
      "anti_slop_rules",
      "写入局部插画 / 空态 / IP 不污染主系统 token 的限制。",
    );
  }
}

function lintUiDesign(content, outputPath) {
  const issues = [];
  addRequiredHeadingIssues(issues, content, outputPath, ["Design Contract Summary"]);

  const { contract, parseErrors } = parseDesignContractJson(content);
  if (!contract) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-json-missing",
      message: `${outputPath} 缺少可解析的 Design Contract JSON block。`,
      fix: "在 Design Contract Summary 后输出 ```json fenced block，并包含 design_mode 与 color_system。",
    });
    if (parseErrors.length > 0) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-json-invalid",
        message: `${outputPath} 存在 JSON fenced block，但无法解析：${parseErrors[0]}。`,
        fix: "修正 JSON 语法；不要在 JSON block 内写注释或 Markdown。",
      });
    }
    lintVisualQaDetectors(issues, content, outputPath);
    return issues;
  }

  addMissingFields(issues, contract, [
    "scan_manifest",
    "design_mode",
    "aesthetic_direction",
    "human_confirmation",
    "signature",
    "color_system",
    "foundation_system",
    "token_source",
    "token_delivery_hint",
    "component_strategy",
    "shadcn_vue",
    "motion",
    "visual_qa",
    "verification_hooks",
    "anti_slop_rules",
  ], outputPath, "Design Contract JSON");

  lintDesignScanManifest(issues, contract.scan_manifest, outputPath);
  lintReferenceSelectionContract(issues, contract, outputPath);
  lintDesignEnhancementContracts(issues, contract, outputPath);
  lintHumanConfirmation(issues, contract.human_confirmation, outputPath);

  if (!designModeValues.has(contract.design_mode)) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-invalid-design-mode",
      message: `${outputPath} 的 design_mode 非稳定枚举：${contract.design_mode ?? "missing"}。`,
      fix: "design_mode 只允许 Product UI、Brand Surface、Hybrid、Avatar-IP、Empty State；组合关系写 scope。",
    });
  }
  if (["Avatar-IP", "Empty State"].includes(contract.design_mode) && contract.scope && !designScopeValues.has(contract.scope)) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-invalid-scope",
      message: `${outputPath} 的 scope 非法：${contract.scope}。`,
      fix: "Avatar-IP / Empty State 组合只能写 scope: avatar / empty_state / both。",
    });
  }

  const color = contract.color_system;
  addMissingFields(issues, color, [
    "palette_id",
    "aesthetic_direction",
    "design_mode",
    "tokens",
    "usage_rules",
    "accessibility",
    "source",
    "source_url",
    "license_note",
  ], outputPath, "color_system");

  if (color && color.design_mode !== contract.design_mode) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-color-mode-mismatch",
      message: `${outputPath} 的 design_mode 与 color_system.design_mode 不一致。`,
      fix: "让两个字段使用同一个稳定 design mode；不要使用 Avatar-IP / Empty State 组合值。",
    });
  }

  const ids = paletteIds();
  if (ids.size > 0 && color?.palette_id && !ids.has(color.palette_id)) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-unknown-palette",
      message: `${outputPath} 的 palette_id 不存在于 aesthetic-palettes.csv：${color.palette_id}。`,
      fix: "改用 data/aesthetic-palettes.csv 中存在的 palette_id，或先把新 palette 记录进 palette library。",
    });
  }
  for (const field of ["source", "source_url", "license_note"]) {
    if (!isMeaningfulCell(String(color?.[field] ?? ""))) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-source-field-missing",
        message: `${outputPath} 的 color_system.${field} 缺失或仍像占位。`,
        fix: "记录 palette 来源、入口 URL 和 license / redistribution note。",
      });
    }
  }
  if (color?.source_url && !/^https?:\/\//i.test(color.source_url)) {
    issues.push({
      severity: "FAIL",
      code: "design-contract-source-url-invalid",
      message: `${outputPath} 的 color_system.source_url 不是可追溯 URL。`,
      fix: "写入 Radix、Tailwind、ColorBrewer、Happy Hues 等来源入口 URL。",
    });
  }
  lintContrastChecks(issues, color?.accessibility, outputPath);
  lintFoundationSystem(issues, contract.foundation_system, outputPath);
  lintTokenDeliveryHint(issues, contract.token_delivery_hint, outputPath);
  lintVisualQaContract(issues, contract.visual_qa, outputPath);
  lintDesignModeConditionalContract(issues, contract, outputPath);
  lintVisualQaDetectors(issues, content, outputPath);
  return issues;
}

function profileIssues(artifactId, content, outputPath) {
  if (artifactId === "requirements") return lintRequirements(content, outputPath);
  if (artifactId === "ui_design") return lintUiDesign(content, outputPath);
  if (artifactId === "technical_design") return lintTechnicalDesign(content, outputPath);
  if (artifactId === "tasks") return lintTasks(content, outputPath);
  return [];
}

function qualityForOutput(workItemBase, outputPath, options = {}) {
  const path = `${workItemBase}/${outputPath}`;
  if (!exists(path)) {
    return {
      path: outputPath,
      exists: false,
      non_empty_lines: 0,
      summary: null,
      issues: [],
    };
  }

  const content = readText(path);
  const lines = content.split(/\r?\n/);
  const nonEmptyLines = lines.map((line) => line.trim()).filter(Boolean);
  const summary = findSummary(content);
  const issues = [];
  const summaryLineLimit = options.summaryLineLimit ?? 12;
  const longArtifactLineLimit = options.longArtifactLineLimit ?? 220;
  const artifactId = options.artifactId ?? null;

  if (nonEmptyLines.length >= 25 && !summary) {
    issues.push({
      severity: "WARN",
      code: "missing-summary",
      message: `${outputPath} 内容较长但缺少一页摘要 / 摘要 section。`,
    });
  }

  if (summary) {
    const realSummaryLines = summary.lines.filter((line) => !isPlaceholderLine(line));
    if (summary.lines.length > summaryLineLimit) {
      issues.push({
        severity: "WARN",
        code: "summary-too-long",
        message: `${outputPath} 的摘要有 ${summary.lines.length} 行，建议控制在 ${summaryLineLimit} 行以内。`,
      });
    }
    if (nonEmptyLines.length >= 25 && realSummaryLines.length === 0) {
      issues.push({
        severity: "WARN",
        code: "empty-summary",
        message: `${outputPath} 有摘要 section，但摘要内容仍像模板占位。`,
      });
    }
  }

  if (nonEmptyLines.length > longArtifactLineLimit) {
    issues.push({
      severity: "INFO",
      code: "long-artifact",
      message: `${outputPath} 有 ${nonEmptyLines.length} 行非空内容，建议确认是否需要 HTML / review package / 附录分层。`,
    });
  }

  issues.push(...profileIssues(artifactId, content, outputPath));

  return {
    path: outputPath,
    exists: true,
    non_empty_lines: nonEmptyLines.length,
    summary: summary
      ? {
          heading: summary.heading,
          line: summary.line,
          lines: summary.lines.length,
        }
      : null,
    profile: artifactId,
    issues,
  };
}

export function artifactQualitySummary(diagnosis, options = {}) {
  if (!diagnosis.work_item) {
    return {
      work_item: null,
      outputs: [],
      issues: [],
    };
  }

  const outputs = [];
  for (const artifact of diagnosis.artifacts ?? []) {
    for (const outputEntry of artifact.outputs ?? []) {
      const outputPath = typeof outputEntry === "string" ? outputEntry : outputEntry.output;
      if (!outputPath) continue;
      const output = qualityForOutput(diagnosis.work_item.path, outputPath, { ...options, artifactId: artifact.id });
      outputs.push({
        artifact: artifact.id,
        status: artifact.status,
        ...output,
      });
    }
  }

  const issues = outputs.flatMap((output) =>
    output.issues.map((issue) => ({
      ...issue,
      artifact: output.artifact,
      path: output.path,
    })),
  );

  return {
    work_item: diagnosis.work_item,
    outputs,
    issues,
  };
}
