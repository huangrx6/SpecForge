import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const maxFiles = Number(option("--max-files", "25000"));
const maxCandidates = Number(option("--max-candidates", "40"));

function option(name, fallback) {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1];
}

const ignoredDirNames = new Set([
  ".git",
  ".hg",
  ".svn",
  ".specforge",
  ".claude",
  ".cache",
  ".next",
  ".nuxt",
  ".turbo",
  ".venv",
  "__pycache__",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "target",
  "tmp",
  "vendor",
]);

const ignoredPathPrefixes = [
  "starter/.specforge/",
  "docs/legacy/",
  "core/skills/",
];

const sourceExtensions = new Set([
  ".c",
  ".cc",
  ".cpp",
  ".cs",
  ".css",
  ".dart",
  ".ex",
  ".exs",
  ".go",
  ".h",
  ".hpp",
  ".html",
  ".java",
  ".js",
  ".jsx",
  ".cjs",
  ".kt",
  ".lua",
  ".mjs",
  ".php",
  ".py",
  ".rb",
  ".rs",
  ".scala",
  ".scss",
  ".swift",
  ".ts",
  ".tsx",
  ".vue",
]);

const languageByExtension = new Map([
  [".c", "C"],
  [".cc", "C++"],
  [".cpp", "C++"],
  [".cs", "C#"],
  [".css", "CSS"],
  [".dart", "Dart"],
  [".ex", "Elixir"],
  [".exs", "Elixir"],
  [".go", "Go"],
  [".h", "C/C++ Header"],
  [".hpp", "C++ Header"],
  [".html", "HTML"],
  [".java", "Java"],
  [".js", "JavaScript"],
  [".jsx", "React"],
  [".cjs", "JavaScript"],
  [".kt", "Kotlin"],
  [".lua", "Lua"],
  [".mjs", "JavaScript"],
  [".php", "PHP"],
  [".py", "Python"],
  [".rb", "Ruby"],
  [".rs", "Rust"],
  [".scala", "Scala"],
  [".scss", "SCSS"],
  [".swift", "Swift"],
  [".ts", "TypeScript"],
  [".tsx", "React TypeScript"],
  [".vue", "Vue"],
]);

const manifestNames = new Set([
  "package.json",
  "pnpm-workspace.yaml",
  "turbo.json",
  "nx.json",
  "tsconfig.json",
  "vite.config.ts",
  "vite.config.js",
  "next.config.ts",
  "next.config.js",
  "nuxt.config.ts",
  "pyproject.toml",
  "requirements.txt",
  "poetry.lock",
  "Pipfile",
  "pom.xml",
  "build.gradle",
  "settings.gradle",
  "go.mod",
  "Cargo.toml",
  "composer.json",
  "Gemfile",
]);

const opsNames = new Set([
  "Dockerfile",
  "docker-compose.yml",
  "docker-compose.yaml",
  "Makefile",
  "Procfile",
  "Jenkinsfile",
  "skaffold.yaml",
  "kustomization.yaml",
]);

function normalize(path) {
  return path.replaceAll("\\", "/");
}

function shouldSkip(relativePath, entry) {
  const rel = normalize(relativePath);
  if (entry.isDirectory() && ignoredDirNames.has(entry.name)) return true;
  return ignoredPathPrefixes.some((prefix) => rel === prefix.slice(0, -1) || rel.startsWith(prefix));
}

function walk(directory, state) {
  if (state.truncated) return;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);
    const rel = normalize(relative(root, absolute));
    if (!rel || shouldSkip(rel, entry)) continue;

    if (entry.isDirectory()) {
      walk(absolute, state);
      if (state.truncated) return;
      continue;
    }

    if (!entry.isFile()) continue;
    const stat = statSync(absolute);
    const ext = extname(entry.name).toLowerCase();
    const record = {
      path: rel,
      name: entry.name,
      ext,
      size: stat.size,
      top: rel.includes("/") ? rel.split("/")[0] : ".",
      source: sourceExtensions.has(ext),
    };
    state.files.push(record);
    if (state.files.length >= maxFiles) {
      state.truncated = true;
      return;
    }
  }
}

function inc(map, key, by = 1) {
  map.set(key, (map.get(key) ?? 0) + by);
}

function topEntries(map, limit = 12) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

function candidate(files, predicate) {
  return files
    .filter(predicate)
    .sort((a, b) => a.path.localeCompare(b.path))
    .slice(0, maxCandidates)
    .map((file) => file.path);
}

function parsePackageJson(path) {
  try {
    const json = JSON.parse(readFileSync(join(root, path), "utf8"));
    return {
      path,
      name: json.name ?? null,
      private: json.private ?? null,
      scripts: Object.keys(json.scripts ?? {}),
      dependencies: Object.keys(json.dependencies ?? {}).slice(0, 30),
      devDependencies: Object.keys(json.devDependencies ?? {}).slice(0, 30),
      workspaces: json.workspaces ?? null,
    };
  } catch {
    return { path, parse_error: true };
  }
}

function hasCodebase(files) {
  return files.some((file) => file.source && !file.path.startsWith("core/") && !file.path.startsWith("agent-skills/"));
}

const state = { files: [], truncated: false };
walk(root, state);

const byTopDirectory = new Map();
const byExtension = new Map();
const byLanguage = new Map();
let sourceFileCount = 0;
let totalBytes = 0;

for (const file of state.files) {
  inc(byTopDirectory, file.top);
  if (file.ext) inc(byExtension, file.ext);
  if (file.source) {
    sourceFileCount += 1;
    inc(byLanguage, languageByExtension.get(file.ext) ?? file.ext.slice(1).toUpperCase());
  }
  totalBytes += file.size;
}

const manifests = candidate(state.files, (file) => manifestNames.has(file.name));
const packageManifests = manifests.filter((path) => basename(path) === "package.json").map(parsePackageJson);
const apiCandidates = candidate(
  state.files,
  (file) =>
    file.source &&
    /(^|\/)(api|apis|routes|router|routers|controllers|controller|handlers|handler|endpoints|views)(\/|$)/i.test(file.path),
);
const dataCandidates = candidate(
  state.files,
  (file) =>
    /(^|\/)(migrations?|models?|entities|entity|repositories|repository|schema|schemas|prisma|sequelize|typeorm|db|database)(\/|$)/i.test(
      file.path,
    ) || ["schema.prisma", "dbml", "ddl.sql"].some((name) => file.name.toLowerCase().endsWith(name)),
);
const testCandidates = candidate(
  state.files,
  (file) => /(^|\/)(__tests__|tests?|specs?|e2e|integration)(\/|$)/i.test(file.path) || /\.(test|spec)\.[cm]?[jt]sx?$/i.test(file.name),
);
const opsCandidates = candidate(
  state.files,
  (file) =>
    opsNames.has(file.name) ||
    file.path.startsWith(".github/workflows/") ||
    /(^|\/)(deploy|deployment|helm|k8s|kubernetes|terraform|infra|ops)(\/|$)/i.test(file.path),
);
const entryCandidates = candidate(
  state.files,
  (file) =>
    file.source &&
    (file.path.startsWith("cli/") ||
      file.path.startsWith("bin/") ||
      /(^|\/)(main|index|app|server|bootstrap|cmd|manage)\.[a-z0-9]+$/i.test(file.path.replace(/\.(tsx|jsx)$/, ".ts"))),
);

const sourceRoots = topEntries(
  new Map(
    [...byTopDirectory.entries()].filter(([name]) =>
      state.files.some((file) => file.top === name && file.source),
    ),
  ),
  20,
);

const result = {
  root,
  scanned_files: state.files.length,
  truncated: state.truncated,
  max_files: maxFiles,
  has_codebase: hasCodebase(state.files),
  source_files: sourceFileCount,
  total_bytes: totalBytes,
  top_directories: topEntries(byTopDirectory, 20),
  languages: topEntries(byLanguage, 15),
  extensions: topEntries(byExtension, 15),
  source_roots: sourceRoots,
  manifests,
  package_manifests: packageManifests,
  candidates: {
    entries: entryCandidates,
    api: apiCandidates,
    data: dataCandidates,
    tests: testCandidates,
    operations: opsCandidates,
  },
  scale:
    sourceFileCount >= 3000 || state.truncated
      ? "large"
      : sourceFileCount >= 500
        ? "medium"
        : sourceFileCount > 0
          ? "small"
          : "empty",
};

function printList(title, items, render = (item) => `- ${item}`) {
  console.log(title);
  if (!items || items.length === 0) {
    console.log("- none");
    return;
  }
  for (const item of items) console.log(render(item));
}

if (asJson) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log("SpecForge Codebase Map");
  console.log("");
  console.log(`Root: ${result.root}`);
  console.log(`Scale: ${result.scale}`);
  console.log(`Files scanned: ${result.scanned_files}${result.truncated ? ` (truncated at ${maxFiles})` : ""}`);
  console.log(`Source files: ${result.source_files}`);
  console.log(`Has codebase: ${result.has_codebase ? "yes" : "no"}`);
  console.log("");
  printList("Top directories:", result.top_directories, (item) => `- ${item.name}: ${item.count}`);
  console.log("");
  printList("Languages:", result.languages, (item) => `- ${item.name}: ${item.count}`);
  console.log("");
  printList("Manifests:", result.manifests);
  console.log("");
  printList("Entry candidates:", result.candidates.entries);
  console.log("");
  printList("API candidates:", result.candidates.api);
  console.log("");
  printList("Data candidates:", result.candidates.data);
  console.log("");
  printList("Test candidates:", result.candidates.tests);
  console.log("");
  printList("Operations candidates:", result.candidates.operations);
}
