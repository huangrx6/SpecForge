import { exists, readText } from "./specforge.mjs";

const summaryHeadings = ["一页摘要", "摘要", "Executive Summary", "Decision Summary", "判定摘要", "发布摘要", "回滚摘要", "CI 摘要"];
const unresolvedDecisionPattern = /\[(?:NEEDS (?:CLARIFICATION|PRODUCT DECISION|UI DECISION|TECH DECISION|DEPENDENCY DECISION|TOOLING DECISION)|DEPENDENCY DECISION REQUIRED|TOOLING DECISION REQUIRED)[^\]]*\]/i;
const placeholderPattern = /\.\.\.|<[^>]+>|请输入内容|待填写|待补充|TBD|example|示例|real marker if needed|yes\s*\/\s*no|pass\s*\/\s*fail/i;
const taskPattern = /^\s*[-*]\s+\[[ xX]\]\s+(T\d{3})\b(.+)$/;
const taskFieldPattern = /^\s*_(Trace|Files|Verification|Rollback|Risk|Impact|Boundary|Depends|TestCase):_\s*(.*)$/i;

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
    "边界",
    "影响面确认",
    "功能需求",
    "行为覆盖矩阵",
    "验收标准",
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

function profileIssues(artifactId, content, outputPath) {
  if (artifactId === "requirements") return lintRequirements(content, outputPath);
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
