import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const checks = [
  { name: "selftest", command: ["node", ".specforge/tools/self-test.mjs"] },
  { name: "validate", command: ["node", ".specforge/tools/validate-structure.mjs"] },
  { name: "status", command: ["node", ".specforge/tools/status.mjs"] },
  { name: "graph", command: ["node", ".specforge/tools/artifact-graph-status.mjs"] },
];

if (existsSync("specforge/SKILL.md")) {
  checks.splice(1, 0, { name: "validate-skills", command: ["node", ".specforge/tools/validate-skills.mjs"] });
}

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
