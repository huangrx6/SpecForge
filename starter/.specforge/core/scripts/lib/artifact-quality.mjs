import { exists, readText } from "./specforge.mjs";

const summaryHeadings = ["一页摘要", "摘要", "Executive Summary", "Decision Summary", "判定摘要", "发布摘要", "回滚摘要", "CI 摘要"];

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
      const output = qualityForOutput(diagnosis.work_item.path, outputPath, options);
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
