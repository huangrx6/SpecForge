import { diagnoseWorkItem, diagnoseWorkspace } from "../../lib/diagnostics.mjs";
import { evidenceSummary } from "../../lib/evidence.mjs";
import { resolveWorkItem } from "../../lib/specforge.mjs";

const args = process.argv.slice(2);
const json = args.includes("--json");

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function bullet(items, emptyText, renderItem) {
  if (!items || items.length === 0) return `- ${emptyText}`;
  return items.map((item) => `- ${renderItem(item)}`).join("\n");
}

function countsLine(counts) {
  return ["proven", "mocked", "manual-confirmed", "deferred", "missing"].map((level) => `${level}=${counts[level] ?? 0}`).join(", ");
}

function markdown(diagnosis, summary) {
  if (!diagnosis.work_item) {
    return `# SpecForge Evidence Summary\n\nNo active work item.\n\n- Route: ${diagnosis.route}\n- Reason: ${diagnosis.route_reason}\n`;
  }

  return `# SpecForge Evidence Summary: ${diagnosis.work_item.id}

## Summary

- Report: ${summary.report_path}
- Exists: ${summary.exists ? "yes" : "no"}
- Graded evidence rows: ${summary.rows.length}
- Evidence counts: ${countsLine(summary.counts)}
- Manual confirmations: ${summary.manual_confirmations.length}
- Issues: ${summary.issues.length}

## Issues

${bullet(summary.issues, "none", (issue) => `[${issue.severity}] ${issue.code}: ${issue.message}`)}

## Evidence Rows

${bullet(summary.rows.slice(0, 20), "none", (row) => `${row.source || "unknown"}: ${row.level}; evidence=${row.evidence || "N/A"}; gate=${row.gate_impact || "N/A"}`)}

## Manual Confirmations

${bullet(summary.manual_confirmations.slice(0, 20), "none", (row) => `${row.gap || "unknown"}: risk=${row.risk || "N/A"}; owner=${row.owner || "N/A"}; trigger=${row.revalidation_trigger || "N/A"}`)}
`;
}

try {
  const requestedWorkItem = argValue("--work-item");
  const reportPath = argValue("--report") ?? "05-verification/report.md";
  let diagnosis;

  if (requestedWorkItem) {
    const workItem = resolveWorkItem({ workItem: requestedWorkItem, activeOnly: false });
    diagnosis = diagnoseWorkItem({ workItem: workItem.name, activeOnly: false });
  } else {
    diagnosis = diagnoseWorkspace();
  }

  const summary = diagnosis.work_item ? evidenceSummary(diagnosis.work_item.path, reportPath) : null;
  if (json) {
    console.log(JSON.stringify({ work_item: diagnosis.work_item, evidence: summary }, null, 2));
    process.exit(0);
  }

  console.log(markdown(diagnosis, summary));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
