import assert from "node:assert/strict";
import {
  appendArchiveRegistryEntry,
  makeArchiveRegistryEntry,
  normalizeEmptyActive,
  parseRegistryEntries,
  removeRegistryEntry,
} from "./lib/specforge.mjs";

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

testRegistrySingleActiveRemoval();
testRegistryKeepsOtherActiveEntries();
testArchiveAppend();

console.log("SpecForge self-test passed.");
