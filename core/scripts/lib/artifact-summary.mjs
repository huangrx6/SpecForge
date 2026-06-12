import { exists, readText } from "./specforge.mjs";

const summaryHeadingCandidates = [
  "一页摘要",
  "摘要",
  "Executive Summary",
  "Decision Summary",
  "判定摘要",
  "发布摘要",
  "回滚摘要",
  "CI 摘要",
  "审查结论",
  "验证结论",
];

function headingLevel(line) {
  return line.match(/^(#{1,6})\s+/)?.[1]?.length ?? 0;
}

function cleanLines(lines, limit) {
  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^---$/.test(line))
    .filter((line) => !/^\|?\s*-{3,}/.test(line))
    .slice(0, limit);
}

function findSummarySection(content) {
  const lines = content.split(/\r?\n/);

  for (const candidate of summaryHeadingCandidates) {
    const start = lines.findIndex((line) => /^#{1,6}\s+/.test(line) && line.includes(candidate));
    if (start === -1) continue;
    const level = headingLevel(lines[start]);
    let end = lines.length;
    for (let i = start + 1; i < lines.length; i += 1) {
      const nextLevel = headingLevel(lines[i]);
      if (nextLevel > 0 && nextLevel <= level) {
        end = i;
        break;
      }
    }
    return {
      heading: lines[start].replace(/^#{1,6}\s+/, "").trim(),
      lines: lines.slice(start + 1, end),
    };
  }

  return null;
}

export function summarizeArtifactContent(content, limit = 10) {
  const section = findSummarySection(content);
  if (section) {
    const lines = cleanLines(section.lines, limit);
    if (lines.length > 0) {
      return {
        source: "summary-section",
        heading: section.heading,
        lines,
      };
    }
  }

  const lines = cleanLines(content.split(/\r?\n/), limit);
  return {
    source: "file-start",
    heading: "File excerpt",
    lines: lines.length > 0 ? lines : ["No summary content yet."],
  };
}

export function summarizeOutput(workItemBase, outputPath, limit = 10) {
  const path = `${workItemBase}/${outputPath}`;
  if (!exists(path)) {
    return {
      path: outputPath,
      exists: false,
      source: "missing",
      heading: "Missing output",
      lines: ["Missing output."],
    };
  }

  return {
    path: outputPath,
    exists: true,
    ...summarizeArtifactContent(readText(path), limit),
  };
}
