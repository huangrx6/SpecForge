#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { layout, localDateIso, resolveWorkItem } from "./lib/specforge.mjs";

const root = process.cwd();
const args = process.argv.slice(2);

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function writeIfMissing(relativePath, content) {
  const target = join(root, relativePath);
  if (existsSync(target)) return;
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, "utf8");
}

const today = localDateIso();
const wikiRoot = `${layout.workspace}/wiki`;

const wikiFiles = {
  "index.md": {
    title: "Wiki Index",
    kind: "index",
    body:
      "# Wiki Index\n\n## 当前项目摘要\n\n暂无。\n\n## 当前知识项\n\n- [项目概览](project-overview.md)\n- [产品规则](product-rules.md)\n- [架构概览](architecture.md)\n- [数据模型](data-model.md)\n- [运行与运维](operations.md)\n- [决策记录](decisions.md)\n- [术语表](glossary.md)\n- [风险与技术债](risks.md)\n",
  },
  "project-overview.md": { title: "项目概览", kind: "project", body: "# 项目概览\n\n暂无。\n" },
  "product-rules.md": { title: "产品规则", kind: "product-rules", body: "# 产品规则\n\n暂无。\n" },
  "architecture.md": { title: "架构概览", kind: "architecture", body: "# 架构概览\n\n暂无。\n" },
  "data-model.md": { title: "数据模型", kind: "data", body: "# 数据模型\n\n暂无。\n" },
  "operations.md": { title: "运行与运维", kind: "operations", body: "# 运行与运维\n\n暂无。\n" },
  "decisions.md": { title: "决策记录", kind: "decisions", body: "# 决策记录\n\n暂无。\n" },
  "glossary.md": { title: "术语表", kind: "glossary", body: "# 术语表\n\n暂无。\n" },
  "risks.md": { title: "风险与技术债", kind: "risks", body: "# 风险与技术债\n\n暂无。\n" },
};

try {
  let sourceWork = "manual";
  try {
    sourceWork = resolveWorkItem({ workItem: argValue("--work-item"), activeOnly: false, defaultToLatestArchive: true }).name;
  } catch {
    // No work item is fine for bootstrapping wiki files.
  }

  for (const [file, meta] of Object.entries(wikiFiles)) {
    writeIfMissing(
      `${wikiRoot}/${file}`,
      `---\ntitle: ${meta.title}\nkind: ${meta.kind}\nowner: TBD\nlast_updated: ${today}\nsource_work: ${sourceWork}\nstatus: current\n---\n\n${meta.body}`,
    );
  }

  console.log(`SpecForge wiki files are present at ${wikiRoot}.`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
