import { readdirSync } from "node:fs";
import { basename } from "node:path";
import { abs, exists, layout, listWorkItems, readText } from "./specforge.mjs";

const REQUIRED_FRONTMATTER = ["title", "kind", "owner", "last_updated", "source_work", "status"];
const ALLOWED_KINDS = new Set([
  "index",
  "project",
  "product-rules",
  "architecture",
  "data",
  "operations",
  "decisions",
  "glossary",
  "risks",
  "module",
  "api",
  "design-system",
  "integration",
  "runbook",
  "adr",
]);
const CURRENT_STATUSES = new Set(["current"]);
const ALLOWED_STATUSES = new Set(["current", "replaced", "archived", "deprecated"]);
const PLACEHOLDER_PATTERN = /(暂无|未确认|TBD|TODO|待补充)/gi;
const DATED_FILENAME_PATTERN = /(^\d{4}[-_]?\d{2}[-_]?\d{2})|(\d{8})|(work-\d{8})|(v\d+(\.\d+)*)/i;
const NAVIGATION_KINDS = new Set(["project", "architecture", "data", "operations", "module", "api", "integration", "runbook"]);

function issue(severity, code, file, message) {
  return { severity, code, file, message };
}

function parseFrontmatter(text) {
  if (!text.startsWith("---\n") && !text.startsWith("---\r\n")) return { data: {}, body: text, exists: false };
  const end = text.search(/\r?\n---\r?\n/);
  if (end === -1) return { data: {}, body: text, exists: false };
  const raw = text.slice(text.indexOf("\n") + 1, end);
  const body = text.slice(end).replace(/^\r?\n---\r?\n/, "");
  const data = {};
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    data[match[1]] = match[2].trim();
  }
  return { data, body, exists: true };
}

function normalizedKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function placeholderCount(text) {
  return [...text.matchAll(PLACEHOLDER_PATTERN)].length;
}

function hasNavigationEvidence(body) {
  return /(入口|路径|命令|测试|路由|API|接口|表|模型|检索词|symbol|route|command|test|path)/i.test(body);
}

function listWikiFiles(wikiRoot) {
  if (!exists(wikiRoot)) return [];
  return readdirSync(abs(wikiRoot), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
}

function graphFactReportPaths() {
  const paths = new Set([`${layout.workItems}/inbox/codebase-intelligence.md`]);
  for (const kind of ["active", "archive"]) {
    for (const name of listWorkItems(kind)) {
      paths.add(`${layout.workItems}/${kind}/${name}/00-steering/codebase-intelligence.md`);
    }
  }
  return [...paths].filter((path) => exists(path)).sort();
}

function parseJsonSummary(text) {
  const match = text.match(/## 9\. 原始 JSON 摘要[\s\S]*?```json\r?\n([\s\S]*?)\r?\n```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function graphFactsFromReports(reportPaths = graphFactReportPaths()) {
  const facts = [];
  for (const reportPath of reportPaths.filter((path) => exists(path))) {
    const payload = parseJsonSummary(readText(reportPath));
    const graphFacts = payload?.graph_facts ?? payload?.normalized_context?.graph_facts ?? [];
    for (const fact of Array.isArray(graphFacts) ? graphFacts : []) {
      facts.push({
        id: String(fact.id ?? "").trim(),
        type: String(fact.type ?? "").trim(),
        subject: String(fact.subject ?? "").trim(),
        relation: String(fact.relation ?? "").trim(),
        object: String(fact.object ?? "").trim(),
        provider: String(fact.provider ?? "").trim(),
        confidence: String(fact.confidence ?? "").trim(),
        source_paths: Array.isArray(fact.source_paths) ? fact.source_paths.filter(Boolean) : [],
        used_for_wiki: Boolean(fact.used_for_wiki),
        report_path: reportPath,
      });
    }
  }
  return facts;
}

export function wikiQualitySummary(options = {}) {
  const wikiRoot = options.wikiRoot ?? `${layout.workspace}/wiki`;
  const files = listWikiFiles(wikiRoot);
  const issues = [];
  const entries = [];

  if (!exists(wikiRoot)) {
    issues.push(issue("FAIL", "wiki-root-missing", wikiRoot, `Wiki root is missing: ${wikiRoot}.`));
    return {
      wiki_root: wikiRoot,
      exists: false,
      files: [],
      entries: [],
      graph_facts: { reports: [], total: 0, wiki_candidates: 0, referenced_candidates: 0 },
      issues,
      summary: { total_files: 0, current_files: 0, fail: 1, warn: 0, pass: 0 },
    };
  }

  if (!files.includes("00-index.md")) {
    issues.push(issue("FAIL", "index-missing", `${wikiRoot}/00-index.md`, "Wiki index is missing: 00-index.md."));
  }

  const indexText = files.includes("00-index.md") ? readText(`${wikiRoot}/00-index.md`) : "";
  const currentKeys = new Map();

  for (const file of files) {
    const path = `${wikiRoot}/${file}`;
    const text = readText(path);
    const parsed = parseFrontmatter(text);
    const data = parsed.data;
    const body = parsed.body.trim();
    const placeholders = placeholderCount(text);
    const entry = {
      file,
      path,
      title: data.title ?? "",
      kind: data.kind ?? "",
      owner: data.owner ?? "",
      last_updated: data.last_updated ?? "",
      source_work: data.source_work ?? "",
      status: data.status ?? "",
      body_lines: body ? body.split(/\r?\n/).filter((line) => line.trim()).length : 0,
      placeholders,
    };
    entries.push(entry);

    if (!parsed.exists) {
      issues.push(issue("FAIL", "frontmatter-missing", path, "Wiki file is missing YAML frontmatter."));
      continue;
    }

    for (const field of REQUIRED_FRONTMATTER) {
      if (!data[field]) issues.push(issue("FAIL", `frontmatter-${field}-missing`, path, `Missing required frontmatter field: ${field}.`));
    }

    if (data.kind && !ALLOWED_KINDS.has(data.kind)) {
      issues.push(issue("FAIL", "kind-invalid", path, `Invalid wiki kind: ${data.kind}.`));
    }

    if (data.last_updated === "YYYY-MM-DD") {
      issues.push(issue("WARN", "last-updated-placeholder", path, "last_updated is still the bootstrap placeholder YYYY-MM-DD."));
    } else if (data.last_updated && !/^\d{4}-\d{2}-\d{2}$/.test(data.last_updated)) {
      issues.push(issue("FAIL", "last-updated-invalid", path, `last_updated must use YYYY-MM-DD: ${data.last_updated}.`));
    }

    if (data.status && !ALLOWED_STATUSES.has(data.status)) {
      issues.push(issue("FAIL", "status-invalid", path, `Invalid wiki status: ${data.status}.`));
    }

    if (data.status && CURRENT_STATUSES.has(data.status)) {
      const key = `${normalizedKey(data.kind)}:${normalizedKey(data.title)}`;
      const existing = currentKeys.get(key);
      if (existing) {
        issues.push(issue("FAIL", "duplicate-current", path, `Duplicate current wiki item with ${existing}: ${data.kind}/${data.title}.`));
      } else {
        currentKeys.set(key, file);
      }

      if (file !== "00-index.md" && !indexText.includes(file)) {
        issues.push(issue("WARN", "index-reference-missing", path, `Current wiki file is not referenced by 00-index.md: ${file}.`));
      }
    }

    if (file !== "00-index.md" && DATED_FILENAME_PATTERN.test(basename(file, ".md"))) {
      issues.push(issue("WARN", "dated-or-versioned-filename", path, "Wiki file name looks dated, work-item scoped, or versioned; prefer one current file per knowledge item."));
    }

    if (entry.body_lines < 6) {
      issues.push(issue("WARN", "body-too-thin", path, "Wiki file is very thin; keep only if the gap is intentional and visible."));
    }

    if (placeholders >= 3) {
      issues.push(issue("WARN", "placeholder-heavy", path, `Wiki file still contains ${placeholders} placeholder marker(s).`));
    }

    if (NAVIGATION_KINDS.has(data.kind) && body && !hasNavigationEvidence(body)) {
      issues.push(issue("WARN", "navigation-evidence-missing", path, "Operational wiki item should include path, command, API, test, or search navigation evidence."));
    }
  }

  const graphFacts = graphFactsFromReports(options.graphFactReports ?? graphFactReportPaths());
  const wikiText = files.map((file) => readText(`${wikiRoot}/${file}`)).join("\n");
  const wikiCandidates = graphFacts.filter((fact) => fact.used_for_wiki);

  for (const fact of wikiCandidates) {
    if (!fact.id) {
      issues.push(issue("WARN", "graph-fact-id-missing", fact.report_path, "A graph fact marked used_for_wiki is missing an id."));
      continue;
    }
    if (!wikiText.includes(fact.id)) {
      issues.push(issue(
        "WARN",
        "graph-fact-wiki-reference-missing",
        fact.report_path,
        `Graph fact ${fact.id} is marked used_for_wiki but no wiki file references that fact id.`,
      ));
    }
    if (fact.confidence === "high" && fact.source_paths.length === 0) {
      issues.push(issue(
        "WARN",
        "graph-fact-source-path-missing",
        fact.report_path,
        `Graph fact ${fact.id} has high confidence but no source_paths.`,
      ));
    }
  }

  const finalFail = issues.filter((item) => item.severity === "FAIL").length;
  const finalWarn = issues.filter((item) => item.severity === "WARN").length;
  return {
    wiki_root: wikiRoot,
    exists: true,
    files,
    entries,
    graph_facts: {
      reports: [...new Set(graphFacts.map((fact) => fact.report_path))],
      total: graphFacts.length,
      wiki_candidates: wikiCandidates.length,
      referenced_candidates: wikiCandidates.filter((fact) => fact.id && wikiText.includes(fact.id)).length,
    },
    issues,
    summary: {
      total_files: files.length,
      current_files: entries.filter((entry) => entry.status === "current").length,
      fail: finalFail,
      warn: finalWarn,
      pass: finalFail === 0 && finalWarn === 0 ? 1 : 0,
    },
  };
}
