import { wikiQualitySummary } from "./lib/wiki-quality.mjs";

const args = process.argv.slice(2);
const json = args.includes("--json");

function bullet(items, emptyText, renderItem) {
  if (!items || items.length === 0) return `- ${emptyText}`;
  return items.map((item) => `- ${renderItem(item)}`).join("\n");
}

function markdown(quality) {
  return `# SpecForge Wiki Quality

## Summary

- Wiki root: ${quality.wiki_root}
- Files: ${quality.summary.total_files}
- Current files: ${quality.summary.current_files}
- Failures: ${quality.summary.fail}
- Warnings: ${quality.summary.warn}

## Issues

${bullet(quality.issues, "none", (issue) => `[${issue.severity}] ${issue.file}: ${issue.message}`)}

## Files

| File | Kind | Title | Status | Owner | Updated | Source Work | Placeholders |
|---|---|---|---|---|---|---|---|
${quality.entries.map((entry) => `| ${entry.file} | ${entry.kind || "-"} | ${entry.title || "-"} | ${entry.status || "-"} | ${entry.owner || "-"} | ${entry.last_updated || "-"} | ${entry.source_work || "-"} | ${entry.placeholders} |`).join("\n")}
`;
}

try {
  const quality = wikiQualitySummary();
  if (json) {
    console.log(JSON.stringify({ wiki_quality: quality }, null, 2));
  } else {
    console.log(markdown(quality));
  }
  process.exit(quality.summary.fail > 0 ? 1 : 0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
