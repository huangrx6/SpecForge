import { wikiUpdatePlan } from "../../lib/wiki-plan.mjs";

const args = process.argv.slice(2);
const asJson = args.includes("--json");

function option(name, fallback = null) {
  const index = args.indexOf(name);
  const value = args[index + 1];
  return index === -1 || !value || value.startsWith("--") ? fallback : value;
}

function bullet(items, emptyText, renderItem) {
  if (!items || items.length === 0) return `- ${emptyText}`;
  return items.map((item) => `- ${renderItem(item)}`).join("\n");
}

function markdown(plan) {
  return `# SpecForge Wiki Update Plan

## Summary

- Work item: ${plan.work_item?.id ?? "N/A"}
- Wiki state: ${plan.wiki_state.status}
- Verification approved: ${plan.work_item?.verification_approved ? "yes" : "no"}
- Long-term fact candidates: ${plan.long_term_fact_candidates.length}
- Required targets: ${plan.required_targets.length}
- Can write N/A: ${plan.can_write_na ? "yes" : "no"}
- Blocking gaps: ${plan.blocking_gaps.length}

## Long-Term Fact Candidates

| ID | Target | Confidence | Evidence | Reason | Source |
|---|---|---|---|---|---|
${plan.long_term_fact_candidates.length === 0 ? "| N/A | N/A | N/A | N/A | N/A | N/A |" : plan.long_term_fact_candidates.map((item) => `| ${item.id} | ${item.target} | ${item.confidence} | ${item.evidence} | ${item.reason} | ${item.source || "N/A"} |`).join("\n")}

## Required Targets

${bullet(plan.required_targets, "none", (item) => `\`${item.file}\` — ${item.reason}`)}

## Blocking Gaps

${bullet(plan.blocking_gaps, "none", (item) => `\`${item.target}\` — ${item.reason}`)}
`;
}

try {
  const plan = wikiUpdatePlan({
    workItem: option("--work-item"),
    wikiRoot: option("--wiki-root") ?? undefined,
  });
  if (asJson) {
    console.log(JSON.stringify({ wiki_update_plan: plan }, null, 2));
  } else {
    console.log(markdown(plan));
  }
  process.exit(0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
