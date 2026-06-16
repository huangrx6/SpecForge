import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative as pathRelative } from "node:path";
import { layout } from "../../lib/specforge.mjs";

const root = process.cwd();
const errors = [];
const skillsRoot = join(root, layout.runtime, "skills");
const registryPath = join(skillsRoot, "registry.json");
const designLocalPath = "ui-ux/design-system";
const designRoot = join(skillsRoot, designLocalPath);
const starterDesignRoot = join(root, "starter/.specforge/core/skills", designLocalPath);

const referencePickerFiles = [
  "references/reference-picker.md",
  "references/reference-source-routing.md",
  "references/reference-extraction-protocol.md",
  "data/reference-source-catalog.csv",
  "contracts/reference-selection.schema.json",
  "prompts/reference-picker.md",
  "prompts/reference-extraction.md",
  "prompts/source-routing.md",
  "prompts/shadcn-resource-audit.md",
  "prompts/domestic-design-case-extraction.md",
];

const deprecatedReferenceSelectionTerms = [
  "visual_completion",
  "domestic_design_case",
  "industry_case",
  "borrow_strength: expressive",
];

const criticalFiles = [
  "contracts/design-contract.schema.json",
  "contracts/reference-selection.schema.json",
  "contracts/selected-data.schema.json",
  "contracts/visual-qa.schema.json",
  "data/advanced-interaction-recipes.csv",
  "data/aesthetic-palettes.csv",
  "data/font-pairing-recipes.csv",
  "data/motion-recipes.csv",
  "data/radius-shadow-recipes.csv",
  "data/reference-source-catalog.csv",
  "data/spacing-density-scales.csv",
  "data/type-scales.csv",
  "prompts/domestic-design-case-extraction.md",
  "prompts/reference-extraction.md",
  "prompts/reference-picker.md",
  "prompts/shadcn-resource-audit.md",
  "prompts/source-routing.md",
  "references/advanced-interaction-source-index.md",
  "references/color-system.md",
  "references/composition-source-index.md",
  "references/design-composition.md",
  "references/design-system-orchestration.md",
  "references/font-source-index.md",
  "references/output-contract.md",
  "references/palette-source-index.md",
  "references/product-ui-layout-quality.md",
  "references/read-profiles.md",
  "references/reference-extraction-protocol.md",
  "references/reference-picker.md",
  "references/reference-source-routing.md",
  "references/visual-calibration.md",
  "references/visual-qa-detectors.md",
];

function relative(path) {
  return path.startsWith(root) ? path.slice(root.length + 1) : path;
}

function read(path) {
  return readFileSync(path, "utf8");
}

function safeJson(path, label) {
  try {
    return JSON.parse(read(path));
  } catch (error) {
    errors.push(`${label}: invalid JSON (${error.message})`);
    return null;
  }
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function validateSchemaNode(node, label) {
  if (typeof node === "boolean") return;
  if (!node || typeof node !== "object" || Array.isArray(node)) {
    errors.push(`${label}: schema node must be an object or boolean`);
    return;
  }

  const validTypes = new Set(["array", "boolean", "integer", "null", "number", "object", "string"]);
  const validateType = (type, path) => {
    if (Array.isArray(type)) {
      for (const item of type) validateType(item, `${path}[]`);
      return;
    }
    if (typeof type !== "string" || !validTypes.has(type)) {
      errors.push(`${path}: invalid JSON Schema type ${JSON.stringify(type)}`);
    }
  };

  if (node.type !== undefined) validateType(node.type, `${label}.type`);
  if (node.required !== undefined) {
    if (!Array.isArray(node.required) || node.required.some((item) => typeof item !== "string")) {
      errors.push(`${label}.required: must be an array of strings`);
    } else if (new Set(node.required).size !== node.required.length) {
      errors.push(`${label}.required: duplicate required key`);
    }
  }
  if (node.properties !== undefined && (!node.properties || typeof node.properties !== "object" || Array.isArray(node.properties))) {
    errors.push(`${label}.properties: must be an object`);
  }
  if (node.$defs !== undefined && (!node.$defs || typeof node.$defs !== "object" || Array.isArray(node.$defs))) {
    errors.push(`${label}.$defs: must be an object`);
  }
  if (
    node.additionalProperties !== undefined &&
    typeof node.additionalProperties !== "boolean" &&
    (typeof node.additionalProperties !== "object" || Array.isArray(node.additionalProperties))
  ) {
    errors.push(`${label}.additionalProperties: must be boolean or schema object`);
  }
  if (node.enum !== undefined && !Array.isArray(node.enum)) {
    errors.push(`${label}.enum: must be an array`);
  }

  for (const [key, value] of Object.entries(node.properties ?? {})) validateSchemaNode(value, `${label}.properties.${key}`);
  for (const [key, value] of Object.entries(node.$defs ?? {})) validateSchemaNode(value, `${label}.$defs.${key}`);
  for (const keyword of ["items", "additionalProperties", "if", "then", "else", "not"]) {
    const value = node[keyword];
    if (value && typeof value === "object" && !Array.isArray(value)) validateSchemaNode(value, `${label}.${keyword}`);
  }
  for (const keyword of ["allOf", "anyOf", "oneOf", "prefixItems"]) {
    const value = node[keyword];
    if (value === undefined) continue;
    if (!Array.isArray(value)) {
      errors.push(`${label}.${keyword}: must be an array`);
      continue;
    }
    value.forEach((item, index) => validateSchemaNode(item, `${label}.${keyword}[${index}]`));
  }
}

function validateJsonSchemaFile(path, label) {
  const schema = safeJson(path, label);
  if (!schema) return null;
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    errors.push(`${label}: JSON Schema must be an object`);
    return schema;
  }
  if (schema.$schema !== undefined && (typeof schema.$schema !== "string" || !schema.$schema.includes("json-schema.org"))) {
    errors.push(`${label}: $schema must point to json-schema.org`);
  }
  if (!schema.type && !schema.properties && !schema.$defs && !schema.allOf && !schema.anyOf && !schema.oneOf) {
    errors.push(`${label}: does not look like a JSON Schema`);
  }
  validateSchemaNode(schema, label);
  return schema;
}

function parseCsvLine(line, label) {
  const cells = [];
  let cell = "";
  let inQuotes = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      cells.push(cell.trim());
      cell = "";
      continue;
    }
    cell += char;
  }
  if (inQuotes) errors.push(`${label}: unclosed quoted CSV field`);
  cells.push(cell.trim());
  return cells;
}

function parseCsv(path, label) {
  const lines = read(path)
    .split(/\r?\n/)
    .map((line, index) => ({ line, number: index + 1 }))
    .filter((entry) => entry.line.trim());
  if (lines.length === 0) {
    errors.push(`${label}: CSV is empty`);
    return [];
  }
  const header = parseCsvLine(lines[0].line, `${label}:1`);
  const rows = [];
  for (const entry of lines.slice(1)) {
    const cells = parseCsvLine(entry.line, `${label}:${entry.number}`);
    if (cells.length !== header.length) {
      errors.push(`${label}:${entry.number}: expected ${header.length} columns, got ${cells.length}`);
    }
    const row = {};
    for (let index = 0; index < header.length; index += 1) row[header[index]] = cells[index] ?? "";
    rows.push({ row, line: entry.number });
  }
  return rows;
}

function isSafeSupportPath(path) {
  const normalized = String(path ?? "").replaceAll("\\", "/");
  const parts = normalized.split("/");
  return normalized && !normalized.startsWith("/") && !parts.includes("..");
}

function walkFiles(dir, prefix = "") {
  if (!existsSync(dir)) return [];
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath, relativePath));
      continue;
    }
    if (entry.isFile()) files.push(relativePath);
  }
  return files.sort((a, b) => a.localeCompare(b));
}

function extractSupportReferences(file) {
  if (!existsSync(file)) return [];
  const content = read(file);
  const pattern = /\b(?:components|contracts|data|foundations|pages|prompts|references)\/[A-Za-z0-9_./*<>-]+(?:\.(?:csv|json|md)|\/README\.md)\b/g;
  const matches = new Set();
  for (const match of content.matchAll(pattern)) {
    const candidate = match[0].replace(/[),.;:]+$/g, "");
    if (candidate.includes("*") || candidate.includes("<") || candidate.includes(">")) continue;
    matches.add(candidate);
  }
  return [...matches].sort((a, b) => a.localeCompare(b));
}

function loadDesignSystemRegistryEntry() {
  const registry = safeJson(registryPath, "core/skills/registry.json");
  const skills = registry?.skills;
  if (!Array.isArray(skills)) {
    errors.push("core/skills/registry.json: missing skills array");
    return null;
  }
  const entry = skills.find((skill) => skill?.id === "design-system");
  if (!entry) {
    errors.push("core/skills/registry.json: missing design-system registry entry");
    return null;
  }
  if (entry.localPath !== designLocalPath) {
    errors.push(`design-system: localPath must be ${designLocalPath}`);
  }
  if (entry.source?.path !== "core/skills/ui-ux/design-system/SKILL.md") {
    errors.push("design-system: source.path must point at core/skills/ui-ux/design-system/SKILL.md");
  }
  return entry;
}

function validateRegistryPaths(entry, registryFiles) {
  for (const file of entry.source?.files ?? []) {
    if (!isSafeSupportPath(file.path)) {
      errors.push(`design-system: unsafe registry source file path ${file.path}`);
      continue;
    }
    const supportPath = join(designRoot, file.path);
    if (!existsSync(supportPath)) {
      errors.push(`design-system: registry lists missing file ${relative(supportPath)}`);
    }
    registryFiles.add(file.path);
  }
}

function validateAllSupportFilesRegistered(registryFiles) {
  const supportFiles = walkFiles(designRoot).filter((file) => file !== "SKILL.md");
  for (const file of supportFiles) {
    if (!registryFiles.has(file)) {
      errors.push(`design-system: support file not registered in source.files: ${file}`);
    }
  }
  return supportFiles;
}

function validateCriticalFiles(registryFiles) {
  for (const file of criticalFiles) {
    const fullPath = join(designRoot, file);
    if (!existsSync(fullPath)) {
      errors.push(`design-system: critical file missing ${relative(fullPath)}`);
      continue;
    }
    if (!registryFiles.has(file)) {
      errors.push(`design-system: critical file missing from source.files: ${file}`);
    }
  }
}

function validateReferencedFiles(registryFiles) {
  const referenceSources = [
    join(designRoot, "SKILL.md"),
    join(designRoot, "references/design-system-orchestration.md"),
  ];
  const referencedFiles = [...new Set(referenceSources.flatMap((file) => extractSupportReferences(file)))].sort((a, b) => a.localeCompare(b));
  for (const file of referencedFiles) {
    const fullPath = join(designRoot, file);
    if (!existsSync(fullPath)) {
      errors.push(`design-system: referenced file does not exist: ${file}`);
      continue;
    }
    if (!registryFiles.has(file)) {
      errors.push(`design-system: referenced file missing from source.files: ${file}`);
    }
  }
  return referencedFiles;
}

function validateReferencePickerFiles(registryFiles) {
  const skillPath = join(designRoot, "SKILL.md");
  const skillContent = existsSync(skillPath) ? read(skillPath) : "";
  for (const file of referencePickerFiles) {
    const fullPath = join(designRoot, file);
    if (!existsSync(fullPath)) {
      errors.push(`design-system reference picker: required file missing ${relative(fullPath)}`);
    }
    if (!registryFiles.has(file)) {
      errors.push(`design-system reference picker: required file missing from source.files: ${file}`);
    }
    if (skillContent && !skillContent.includes(file)) {
      errors.push(`core/skills/ui-ux/design-system/SKILL.md: missing Reference Picker file reference ${file}`);
    }
  }
}

function validateReferenceSourceCatalog() {
  const catalogPath = join(designRoot, "data/reference-source-catalog.csv");
  const label = "core/skills/ui-ux/design-system/data/reference-source-catalog.csv";
  if (!existsSync(catalogPath)) return;
  const rows = parseCsv(catalogPath, label);
  const requiredColumns = ["id", "name", "type", "best_for", "reuse_policy", "offline_fallback", "avoid"];
  const seenIds = new Set();
  for (const { row, line } of rows) {
    for (const column of requiredColumns) {
      if (!String(row[column] ?? "").trim()) {
        errors.push(`${label}:${line}: ${column} must be non-empty`);
      }
    }
    const id = String(row.id ?? "").trim();
    if (id) {
      if (seenIds.has(id)) errors.push(`${label}:${line}: duplicate id ${id}`);
      seenIds.add(id);
    }
    const offlineFallback = String(row.offline_fallback ?? "").trim();
    if (offlineFallback && !["yes", "no"].includes(offlineFallback)) {
      errors.push(`${label}:${line}: offline_fallback must be yes or no`);
    }
  }
}

function validateReferenceSelectionSchemas() {
  const referenceSchemaPath = join(designRoot, "contracts/reference-selection.schema.json");
  const designSchemaPath = join(designRoot, "contracts/design-contract.schema.json");
  const referenceLabel = "core/skills/ui-ux/design-system/contracts/reference-selection.schema.json";
  const designLabel = "core/skills/ui-ux/design-system/contracts/design-contract.schema.json";
  const referenceSchema = existsSync(referenceSchemaPath) ? validateJsonSchemaFile(referenceSchemaPath, referenceLabel) : null;
  const designSchema = existsSync(designSchemaPath) ? validateJsonSchemaFile(designSchemaPath, designLabel) : null;
  if (!referenceSchema || !designSchema) return;

  const referenceSelection = designSchema.properties?.reference_selection;
  if (!referenceSelection) return;

  const workflowEnum = designSchema.properties?.scan_manifest?.properties?.workflow?.items?.enum;
  if (Array.isArray(workflowEnum) && !workflowEnum.includes("reference")) {
    errors.push(`${designLabel}: scan_manifest.workflow enum must include "reference" when reference_selection is supported`);
  }

  const embedded =
    referenceSelection.$ref === "#/$defs/referenceSelection"
      ? designSchema.$defs?.referenceSelection
      : referenceSelection;
  if (!embedded) {
    errors.push(`${designLabel}: reference_selection points to missing #/$defs/referenceSelection`);
    return;
  }

  const standaloneShape = {
    type: referenceSchema.type,
    additionalProperties: referenceSchema.additionalProperties,
    required: referenceSchema.required,
    properties: referenceSchema.properties,
  };
  if (stableStringify(embedded) !== stableStringify(standaloneShape)) {
    errors.push(`${designLabel}: reference_selection schema must match contracts/reference-selection.schema.json`);
  }
}

function validateReferenceSelectionTerminology() {
  const docsToCheck = [
    "SKILL.md",
    "references/read-profiles.md",
    "references/output-contract.md",
    "references/design-system-orchestration.md",
    "references/reference-picker.md",
    "prompts/reference-picker.md",
  ];
  for (const file of docsToCheck) {
    const fullPath = join(designRoot, file);
    if (!existsSync(fullPath)) continue;
    const content = read(fullPath);
    for (const term of deprecatedReferenceSelectionTerms) {
      if (content.includes(term)) {
        errors.push(`design-system reference picker: deprecated enum term ${term} found in ${file}`);
      }
    }
  }
}

function validateStarterMirror(registryFiles) {
  if (layout.kind !== "source" || !existsSync(starterDesignRoot)) return;
  const filesToCompare = [...new Set(["SKILL.md", ...registryFiles, ...referencePickerFiles])].sort((a, b) => a.localeCompare(b));
  for (const file of filesToCompare) {
    const sourcePath = join(designRoot, file);
    const starterPath = join(starterDesignRoot, file);
    if (!existsSync(starterPath)) {
      errors.push(`design-system: starter missing ${relative(starterPath)}`);
      continue;
    }
    if (existsSync(sourcePath) && read(sourcePath) !== read(starterPath)) {
      errors.push(`design-system: starter mirror differs for ${file}`);
    }
  }
}

if (!existsSync(designRoot)) {
  errors.push(`missing design-system directory: ${relative(designRoot)}`);
}

const entry = loadDesignSystemRegistryEntry();
const registryFiles = new Set();
if (entry) {
  validateRegistryPaths(entry, registryFiles);
  const supportFiles = validateAllSupportFilesRegistered(registryFiles);
  validateCriticalFiles(registryFiles);
  const referencedFiles = validateReferencedFiles(registryFiles);
  validateReferencePickerFiles(registryFiles);
  validateReferenceSourceCatalog();
  validateReferenceSelectionSchemas();
  validateReferenceSelectionTerminology();
  validateStarterMirror(registryFiles);

  if (errors.length === 0) {
    console.log("design-system reference picker validation passed");
    console.log(`Checked ${registryFiles.size} registry files, ${supportFiles.length} support files, ${referencedFiles.length} referenced files, and ${criticalFiles.length} critical files.`);
  }
}

if (errors.length > 0) {
  console.error("Design-system registry validation failed.");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
