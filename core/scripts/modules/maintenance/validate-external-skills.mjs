import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function run(script, args = []) {
  const result = spawnSync(process.execPath, [join(__dirname, script), ...args], {
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run("validate-skills.mjs", ["--external"]);
run("validate-design-system-registry.mjs");
