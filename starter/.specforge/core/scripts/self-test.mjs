import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  appendArchiveRegistryEntry,
  makeArchiveRegistryEntry,
  normalizeEmptyActive,
  parseRegistryEntries,
  removeRegistryEntry,
  validateSchema,
} from "./lib/specforge.mjs";
import { wikiQualitySummary } from "./lib/wiki-quality.mjs";

function writeFixture(path, content) {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function testRegistrySingleActiveRemoval() {
  const registry = `active:\n  - id: 20260512-feat-001-demo\n    title: Demo\n    type: FEATURE\n    status: INTAKE\n    path: .specforge/work/active/20260512-feat-001-demo\n\nblocked: []\narchive: []\n`;
  const next = normalizeEmptyActive(removeRegistryEntry(registry, "20260512-feat-001-demo"));
  assert.equal(next.includes(".specforge/work/active/20260512-feat-001-demo"), false);
  assert.equal(parseRegistryEntries(next, "active").length, 0);
  assert.match(next, /^active:\s*\[\]/m);
}

function testRegistryKeepsOtherActiveEntries() {
  const registry = `active:\n  - id: 20260512-feat-001-first\n    title: First\n    type: FEATURE\n    status: INTAKE\n    path: .specforge/work/active/20260512-feat-001-first\n  - id: 20260512-feat-002-second\n    title: Second\n    type: FEATURE\n    status: INTAKE\n    path: .specforge/work/active/20260512-feat-002-second\n\nblocked: []\narchive: []\n`;
  const next = removeRegistryEntry(registry, "20260512-feat-001-first");
  const active = parseRegistryEntries(next, "active");
  assert.deepEqual(active.map((entry) => entry.id), ["20260512-feat-002-second"]);
  assert.equal(next.includes("20260512-feat-001-first"), false);
}

function testArchiveAppend() {
  const registry = "active: []\n\nblocked: []\narchive:\n";
  const yaml = "title: Demo Archive\ntype: FEATURE\n";
  const entry = makeArchiveRegistryEntry("20260512-feat-003-demo", yaml, ".specforge/work/archive/20260512-feat-003-demo");
  const next = appendArchiveRegistryEntry(registry, entry);
  const archive = parseRegistryEntries(next, "archive");
  assert.equal(archive.length, 1);
  assert.equal(archive[0].id, "20260512-feat-003-demo");
  assert.equal(archive[0].status, "ARCHIVED");
}

function testQualityPolicyValidation() {
  const valid = validateSchema({
    id: "quality-policy-valid",
    artifacts: [
      {
        id: "requirements",
        stage: "01-spec",
        title: "Requirements",
        outputs: ["01-spec/requirements.md"],
        requires: [],
      },
    ],
    quality_policy: {
      section_checks: [
        {
          artifact: "requirements",
          path: "01-spec/requirements.md",
          sections: ["Spec Quality Gate"],
          severity: "P2",
        },
      ],
    },
  });
  assert.deepEqual(valid, []);

  const invalid = validateSchema({
    id: "quality-policy-invalid",
    artifacts: [
      {
        id: "requirements",
        stage: "01-spec",
        title: "Requirements",
        outputs: ["01-spec/requirements.md"],
        requires: [],
      },
    ],
    quality_policy: {
      section_checks: [
        {
          artifact: "missing",
          path: "01-spec/not-owned.md",
          sections: [],
          severity: "P9",
        },
      ],
    },
  });
  assert.ok(invalid.some((error) => error.includes("unknown artifact")));
  assert.ok(invalid.some((error) => error.includes("path must match an output of its artifact")));
  assert.ok(invalid.some((error) => error.includes("sections must be a non-empty array")));
  assert.ok(invalid.some((error) => error.includes("severity must be P0, P1, P2, or P3")));
}

function testWikiQualityGraphFactReferences() {
  const base = mkdtempSync("tmp-specforge-selftest-");
  try {
    const wikiRoot = `${base}/wiki`;
    const reportPath = `${base}/codebase-intelligence.md`;
    mkdirSync(wikiRoot, { recursive: true });
    writeFixture(
      `${wikiRoot}/00-index.md`,
      "---\ntitle: Index\nkind: index\nowner: test\nlast_updated: 2026-06-13\nsource_work: test\nstatus: current\n---\n\n# Index\n\n- [Architecture](03-architecture.md)\n",
    );
    writeFixture(
      `${wikiRoot}/03-architecture.md`,
      "---\ntitle: Architecture\nkind: architecture\nowner: test\nlast_updated: 2026-06-13\nsource_work: test\nstatus: current\n---\n\n# Architecture\n\n## Code navigation\n\n- path: src/orders/service.ts\n- command: npm test\n",
    );
    writeFixture(
      reportPath,
      `# Codebase Intelligence\n\n## 9. 原始 JSON 摘要\n\n\`\`\`json\n${JSON.stringify({
        graph_facts: [
          {
            id: "GF-TEST-001",
            type: "call",
            subject: "orders.submit",
            relation: "calls",
            object: "payment.authorize",
            provider: "codegraph",
            confidence: "high",
            source_paths: ["src/orders/service.ts"],
            used_for_wiki: true,
          },
        ],
      })}\n\`\`\`\n`,
    );

    const missingReference = wikiQualitySummary({ wikiRoot, graphFactReports: [reportPath] });
    assert.ok(missingReference.issues.some((issue) => issue.code === "graph-fact-wiki-reference-missing"));

    writeFixture(
      `${wikiRoot}/03-architecture.md`,
      "---\ntitle: Architecture\nkind: architecture\nowner: test\nlast_updated: 2026-06-13\nsource_work: test\nstatus: current\n---\n\n# Architecture\n\n## Code navigation\n\n- GF-TEST-001: orders.submit calls payment.authorize, source `src/orders/service.ts`.\n",
    );
    const referenced = wikiQualitySummary({ wikiRoot, graphFactReports: [reportPath] });
    assert.equal(referenced.graph_facts.referenced_candidates, 1);
    assert.equal(referenced.issues.some((issue) => issue.code === "graph-fact-wiki-reference-missing"), false);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}

testRegistrySingleActiveRemoval();
testRegistryKeepsOtherActiveEntries();
testArchiveAppend();
testQualityPolicyValidation();
testWikiQualityGraphFactReferences();

console.log("SpecForge self-test passed.");
