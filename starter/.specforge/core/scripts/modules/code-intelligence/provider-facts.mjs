export const graphFactTypes = new Set([
  "module",
  "entry",
  "symbol",
  "call",
  "dependency",
  "api",
  "data",
  "test",
  "operation",
  "risk",
]);

export const confidenceLevels = new Set(["high", "medium", "low", "unknown"]);

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizeString(value, fallback = "") {
  return String(value ?? fallback).trim();
}

function normalizeConfidence(value) {
  const normalized = normalizeString(value || "unknown").toLowerCase();
  return confidenceLevels.has(normalized) ? normalized : "unknown";
}

function normalizeType(value) {
  const normalized = normalizeString(value || "dependency").toLowerCase();
  return graphFactTypes.has(normalized) ? normalized : "dependency";
}

export function normalizeProviderFacts(input, defaults = {}) {
  const rawFacts = Array.isArray(input) ? input : input?.graph_facts ?? input?.facts ?? [];
  return rawFacts.map((fact, index) => {
    const sourcePaths = asArray(fact.source_paths ?? fact.sourcePaths ?? fact.paths ?? fact.files)
      .map((item) => normalizeString(item))
      .filter(Boolean);
    return {
      id: normalizeString(fact.id, `GF-${String(index + 1).padStart(3, "0")}`),
      type: normalizeType(fact.type),
      subject: normalizeString(fact.subject ?? fact.from ?? fact.module ?? fact.symbol),
      relation: normalizeString(fact.relation ?? fact.edge ?? fact.kind, "related_to"),
      object: normalizeString(fact.object ?? fact.to ?? fact.target),
      source_paths: sourcePaths,
      provider: normalizeString(fact.provider, defaults.provider ?? "unknown"),
      query: normalizeString(fact.query ?? fact.query_id ?? fact.command, defaults.query ?? "manual-import"),
      confidence: normalizeConfidence(fact.confidence),
      indexed_at: normalizeString(fact.indexed_at ?? fact.indexedAt, defaults.indexed_at ?? new Date().toISOString()),
      used_for_wiki: Boolean(fact.used_for_wiki ?? fact.usedForWiki ?? false),
      notes: normalizeString(fact.notes ?? fact.summary),
    };
  });
}

export function graphFactSummary(facts = []) {
  const byType = {};
  const byConfidence = {};
  for (const fact of facts) {
    byType[fact.type] = (byType[fact.type] ?? 0) + 1;
    byConfidence[fact.confidence] = (byConfidence[fact.confidence] ?? 0) + 1;
  }
  return {
    count: facts.length,
    by_type: byType,
    by_confidence: byConfidence,
    wiki_candidates: facts.filter((fact) => fact.used_for_wiki).length,
    with_source_paths: facts.filter((fact) => fact.source_paths.length > 0).length,
  };
}
