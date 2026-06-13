import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { layout } from "../../lib/specforge.mjs";

const checks = [
  { name: "selftest", command: ["node", `${layout.tools}/self-test.mjs`] },
  { name: "framework-audit", command: ["node", `${layout.tools}/framework-audit.mjs`] },
  { name: "validate", command: ["node", `${layout.tools}/validate-structure.mjs`] },
  { name: "status", command: ["node", `${layout.tools}/status.mjs`] },
  { name: "instructions", command: ["node", `${layout.tools}/instructions.mjs`] },
  { name: "graph", command: ["node", `${layout.tools}/artifact-graph-status.mjs`] },
];

if (existsSync("skills/sf-router/SKILL.md") || existsSync("sf-router/SKILL.md")) {
  checks.splice(1, 0, { name: "validate-skills", command: ["node", `${layout.tools}/validate-skills.mjs`] });
}

checks.splice(2, 0, {
  name: "validate-external-skills",
  command: ["node", `${layout.tools}/validate-external-skills.mjs`],
});

let failed = false;

console.log("SpecForge Doctor");
console.log("");

for (const check of checks) {
  const result = spawnSync(check.command[0], check.command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
  });

  const ok = result.status === 0;
  if (!ok) failed = true;

  console.log(`## ${check.name}: ${ok ? "PASS" : "FAIL"}`);
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
  if (output) {
    const summary = output
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .slice(0, 20)
      .join("\n");
    console.log(summary);
  }
  console.log("");
}

if (failed) {
  console.error("SpecForge doctor found failures.");
  process.exit(1);
}

console.log("SpecForge doctor passed.");
