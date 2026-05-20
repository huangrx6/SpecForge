import { fork } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const child = fork(join(__dirname, "status.mjs"), ["--graph", ...process.argv.slice(2)], {
  stdio: "inherit"
});
child.on("exit", (code) => {
  process.exit(code ?? 0);
});
