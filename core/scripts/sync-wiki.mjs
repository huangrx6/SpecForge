#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { layout, localDateIso, resolveWorkItem } from "./lib/specforge.mjs";

const root = process.cwd();
const args = process.argv.slice(2);

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function writeIfMissing(relativePath, content, legacyRelativePath = null) {
  const target = join(root, relativePath);
  if (existsSync(target)) return;

  if (legacyRelativePath) {
    const legacyTarget = join(root, legacyRelativePath);
    if (existsSync(legacyTarget)) {
      mkdirSync(dirname(target), { recursive: true });
      renameSync(legacyTarget, target);
      return;
    }
  }

  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, "utf8");
}

function updateProjectYamlIndexPath() {
  const projectYaml = join(root, `${layout.workspace}/project.yaml`);
  if (!existsSync(projectYaml)) return;

  const current = readFileSync(projectYaml, "utf8");
  const next = current.replace(
    "index: .specforge/wiki/index.md",
    "index: .specforge/wiki/00-index.md",
  );
  if (next !== current) writeFileSync(projectYaml, next, "utf8");
}

const today = localDateIso();
const wikiRoot = `${layout.workspace}/wiki`;

const wikiFiles = {
  "00-index.md": {
    title: "知识库索引",
    kind: "index",
    legacy: "index.md",
    body:
      "# 知识库索引\n\n## 当前项目摘要\n\n暂无。\n\n## 任务入口导航\n\n| 场景 | 优先读取 | 入口线索 |\n|---|---|---|\n| 新需求 / 功能变更 | `01-project-overview.md`、`02-product-rules.md`、相关 `module-<name>.md` | 业务域、页面、API、数据 |\n| bugfix / issue | `03-architecture.md`、相关 `module-<name>.md`、`08-risks.md` | 报错路径、调用链、回归测试 |\n| 技术设计 / 重构 | `03-architecture.md`、`04-data-model.md`、`05-operations.md` | 模块边界、数据读写、运行约束 |\n| 验证 / 发布 | `05-operations.md`、`08-risks.md` | 启动、测试、回滚、已知风险 |\n\n## 当前知识项\n\n- [项目概览](01-project-overview.md)\n- [产品规则](02-product-rules.md)\n- [架构概览](03-architecture.md)\n- [数据模型](04-data-model.md)\n- [运行与运维](05-operations.md)\n- [决策记录](06-decisions.md)\n- [术语表](07-glossary.md)\n- [风险与技术债](08-risks.md)\n\n## 按需知识项\n\n暂无。新增 `module-<name>.md`、`api-<domain>.md` 或 `design-system.md` 后同步到这里。\n\n## 最后同步\n\n暂无。\n",
  },
  "01-project-overview.md": {
    title: "项目概览",
    kind: "project",
    legacy: "project-overview.md",
    body:
      "# 项目概览\n\n## 项目定位\n\n暂无。\n\n## 主要用户与场景\n\n| 用户 / 角色 | 场景 | 目标 | 证据 |\n|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 核心能力\n\n| 能力 | 当前状态 | 相关模块 | 证据 |\n|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 明确边界\n\n- 未确认。\n\n## 子系统与常见任务入口\n\n| 名称 | 类型 | 职责 | 优先读取 | 入口 / 路径 | 证据 |\n|---|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | `03-architecture.md` | 未确认 | 未确认 |\n\n## 当前接入状态\n\n暂无。\n",
  },
  "02-product-rules.md": {
    title: "产品规则",
    kind: "product-rules",
    legacy: "product-rules.md",
    body:
      "# 产品规则\n\n## 角色与权限\n\n| 角色 | 能做什么 | 不能做什么 | 证据 |\n|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 核心流程\n\n| 流程 | 触发 | 关键步骤 | 结束状态 | 证据 |\n|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 状态与审批规则\n\n| 对象 | 状态 / 规则 | 流转条件 | 异常处理 | 证据 |\n|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 业务约束\n\n- 未确认。\n",
  },
  "03-architecture.md": {
    title: "架构概览",
    kind: "architecture",
    legacy: "architecture.md",
    body:
      "# 架构概览\n\n## 技术栈与运行形态\n\n| 层 | 技术 / 框架 | 入口 | 证据 |\n|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 模块 / 服务边界\n\n| 模块 / 服务 | 职责 | 入口路径 | 上游 | 下游 | 测试位置 | 证据 |\n|---|---|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 关键链路\n\n| 链路 | 入口 | 主要处理 | 数据 / 外部依赖 | 证据 |\n|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 同步 / 异步机制\n\n| 机制 | 用途 | 入口 / 配置 | 证据 |\n|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 代码导航\n\n- 常用入口路径：未确认\n- 关键符号 / 路由：未确认\n- 推荐检索词：未确认\n\n## 外部集成与鉴权边界\n\n| 集成 / 边界 | 用途 | 鉴权 / 配置 | 证据 |\n|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 架构风险与未知\n\n- 未确认。\n",
  },
  "04-data-model.md": {
    title: "数据模型",
    kind: "data",
    legacy: "data-model.md",
    body:
      "# 数据模型\n\n## 存储与配置\n\n| 存储 | 用途 | 配置来源 | 证据 |\n|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 核心实体 / 表\n\n| 实体 / 表 | 职责 | 关键字段 | 主键 / 唯一约束 | 读写入口 | 证据 |\n|---|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 关系与索引\n\n| 来源 | 关系 | 目标 | 索引 / 约束 | 证据 |\n|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 状态机\n\n| 对象 | 状态字段 | 状态 | 流转规则 | 证据 |\n|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 迁移与初始化\n\n| 项 | 当前方式 | 路径 / 命令 | 风险 | 证据 |\n|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 关联模块与追踪入口\n\n- 未确认。\n\n## 数据生命周期\n\n- 未确认。\n",
  },
  "05-operations.md": {
    title: "运行与运维",
    kind: "operations",
    legacy: "operations.md",
    body:
      "# 运行与运维\n\n## 本地运行\n\n| 场景 | 命令 | 工作目录 | 前置条件 | 证据 |\n|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 构建与测试\n\n| 类型 | 命令 | 覆盖范围 | 证据 |\n|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 配置与环境变量\n\n| 名称 | 用途 | 来源 | 默认值 / 示例 | 证据 |\n|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 依赖服务\n\n| 服务 | 用途 | 初始化方式 | 证据 |\n|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 部署、回滚与观测\n\n| 项 | 当前方式 | 路径 / 工具 | 证据 |\n|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 常见故障与验证入口\n\n- 未确认。\n",
  },
  "06-decisions.md": {
    title: "决策记录",
    kind: "decisions",
    legacy: "decisions.md",
    body:
      "# 决策记录\n\n| 决策 | 状态 | 背景 | 选择 | 影响范围 | 证据 |\n|---|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n",
  },
  "07-glossary.md": {
    title: "术语表",
    kind: "glossary",
    legacy: "glossary.md",
    body:
      "# 术语表\n\n| 术语 | 定义 | 代码命名 / 别名 | 容易混淆点 | 证据 |\n|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n",
  },
  "08-risks.md": {
    title: "风险与技术债",
    kind: "risks",
    legacy: "risks.md",
    body:
      "# 风险与技术债\n\n| 风险 / 缺口 | 影响 | 已扫范围 / 证据 | 当前缓解 | Owner | 下一步 |\n|---|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | TBD | 未确认 |\n",
  },
};

try {
  updateProjectYamlIndexPath();

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
      meta.legacy ? `${wikiRoot}/${meta.legacy}` : null,
    );
  }

  console.log(`SpecForge wiki files are present at ${wikiRoot}.`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
