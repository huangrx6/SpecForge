import { exists, layout, readText } from "./specforge.mjs";

const summaryHeadings = ["一页摘要", "摘要", "Executive Summary", "Decision Summary", "判定摘要", "发布摘要", "回滚摘要", "CI 摘要"];
const unresolvedDecisionPattern = /\[(?:NEEDS (?:CLARIFICATION|PRODUCT DECISION|UI DECISION|TECH DECISION|DEPENDENCY DECISION|TOOLING DECISION)|DEPENDENCY DECISION REQUIRED|TOOLING DECISION REQUIRED)[^\]]*\]/i;
const placeholderPattern = /\.\.\.|<[^>]+>|请输入内容|待填写|待补充|TBD|example|示例|real marker if needed|yes\s*\/\s*no|pass\s*\/\s*fail/i;
const taskPattern = /^\s*[-*]\s+\[[ xX]\]\s+(T\d{3})\b(.+)$/;
const taskFieldPattern = /^\s*_(Trace|Files|Verification|Rollback|Risk|Impact|Boundary|Depends|TestCase):_\s*(.*)$/i;
const designModeValues = new Set(["Product UI", "Brand Surface", "Hybrid", "Avatar-IP", "Empty State"]);
const designScopeValues = new Set(["avatar", "empty_state", "both"]);
const contrastStatusValues = new Set(["pass", "fail", "not-checked"]);
const highSeverityVisualDetectors = new Set([
  "Generic SaaS shell",
  "Color-only design",
  "Empty dashboard skeleton",
  "KPI wallpaper",
  "Blank framed content",
  "Todo list without workflow",
  "Card soup",
  "Fake premium gradient",
  "Motion noise",
  "State missing",
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

function designDataIds(fileName) {
  const path = `${layout.runtime}/skills/ui-ux/design-system/data/${fileName}`;
  if (!exists(path)) return new Set();
  const lines = readText(path).split(/\r?\n/).filter((line) => line.trim());
  return new Set(lines.slice(1).map((line) => line.split(",")[0]?.trim()).filter(Boolean));
}

function addMissingFields(issues, object, fields, outputPath, owner, code = "design-contract-field-missing") {
  const missing = fields.filter((field) => !Object.prototype.hasOwnProperty.call(object ?? {}, field));
  if (missing.length > 0) {
    issues.push({
      severity: "FAIL",
      code,
      message: `${outputPath} 的 ${owner} 缺少字段：${missing.join(", ")}。`,
      fix: "按 design-contract.schema.json 补齐字段；不适用时填空数组或明确 N/A 文本，不要省略字段。",
    });
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

function lintDesignScanManifest(issues, scanManifest, outputPath) {
  if (!scanManifest || typeof scanManifest !== "object") {
    issues.push({
      severity: "FAIL",
      code: "design-contract-scan-manifest-missing",
      message: `${outputPath} 缺少 scan_manifest。`,
      fix: "按 design-system-orchestration.md 输出扫描过的文件、选择的数据 id 和跳过理由。",
    });
    return;
  }

  addMissingFields(issues, scanManifest, ["workflow", "scanned_files", "selected_data", "skipped_with_reason"], outputPath, "scan_manifest");
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
      fix: "记录至少 design-system-orchestration、design-mode-routing、font-source-index 和 design-composition 的扫描结果。",
    });
  }

  const scannedPaths = new Set((scanManifest.scanned_files ?? []).map((entry) => entry?.path).filter(Boolean));
  for (const requiredPath of [
    "references/design-system-orchestration.md",
    "references/design-mode-routing.md",
    "references/font-source-index.md",
    "references/design-composition.md",
  ]) {
    if (!scannedPaths.has(requiredPath)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-required-scan-missing",
        message: `${outputPath} 的 scan_manifest.scanned_files 缺少 ${requiredPath}。`,
        fix: "按 orchestration 链路记录该文件的用途、状态和结论；不适用也要写 skipped 与理由。",
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
    ["font_pairing_id", "font-pairing-recipes.csv"],
    ["type_scale_id", "type-scales.csv"],
    ["spacing_density_id", "spacing-density-scales.csv"],
    ["radius_shadow_recipe_id", "radius-shadow-recipes.csv"],
    ["motion_recipe_id", "motion-recipes.csv"],
    ["advanced_interaction_recipe_id", "advanced-interaction-recipes.csv"],
  ];
  for (const [field, fileName] of idSources) {
    const value = String(selected?.[field] ?? "").trim();
    if (!isMeaningfulCell(value)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-selected-data-missing",
        message: `${outputPath} 的 scan_manifest.selected_data.${field} 缺失或仍像占位。`,
        fix: `从 data/${fileName} 选择一个 id；不使用高级交互时写 none-product-ui 或明确 N/A recipe。`,
      });
      continue;
    }
    if (/^N\/A$/i.test(value)) continue;
    const ids = designDataIds(fileName);
    if (ids.size > 0 && !ids.has(value)) {
      issues.push({
        severity: "FAIL",
        code: "design-contract-selected-data-unknown",
        message: `${outputPath} 的 ${field} 不存在于 ${fileName}：${value}。`,
        fix: `改用 data/${fileName} 中存在的 id，或先把新 recipe 记录进数据表。`,
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
    "signature",
    "color_system",
    "foundation_system",
    "token_source",
    "component_strategy",
    "shadcn_vue",
    "motion",
    "verification_hooks",
    "anti_slop_rules",
  ], outputPath, "Design Contract JSON");

  lintDesignScanManifest(issues, contract.scan_manifest, outputPath);

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
