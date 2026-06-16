#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { layout, localDateIso, resolveWorkItem } from "../../lib/specforge.mjs";

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
      "# 知识库索引\n\n## 当前项目摘要\n\n- 项目定位：暂无。\n- 当前状态：暂无。\n- 主要技术栈：暂无。\n- 主要入口：暂无。\n- 最重要模块：暂无。\n- 最近更新：暂无。\n- 当前风险：暂无。\n\n## 任务入口导航\n\n| 场景 | 先读 | 再查 | 常用命令 / 线索 |\n|---|---|---|---|\n| 新需求 / 功能变更 | `01-project-overview.md`、`02-product-rules.md` | `module-<name>.md`、`api-<domain>.md` | 业务域、页面、API、数据 |\n| bugfix / issue | `03-architecture.md`、`08-risks.md` | 相关 module / API / data | 报错路径、调用链、回归测试 |\n| API / 集成改动 | `external-interfaces.md` | `api-<domain>.md`、`integration-<system>.md` | route、handler、client、tests |\n| 数据改动 | `04-data-model.md` | model、migration、repository、fixture | schema、migration、DB init |\n| 配置 / 权限 / 安全 | `config-env.md`、`security-auth.md` | env、auth middleware、policy | secret、feature flag、permission |\n| 后台任务 / 事件 | `jobs-events.md` | worker、queue、cron、event handler | topic、job、DLQ、retry |\n| 验证 / 发布 | `05-operations.md`、`08-risks.md` | verification report、CI | 启动、测试、回滚、已知风险 |\n\n## 当前知识项\n\n- [项目概览](01-project-overview.md)\n- [产品规则](02-product-rules.md)\n- [架构概览](03-architecture.md)\n- [数据模型](04-data-model.md)\n- [运行与运维](05-operations.md)\n- [决策记录](06-decisions.md)\n- [术语表](07-glossary.md)\n- [风险与技术债](08-risks.md)\n- [对外接口总览](external-interfaces.md)\n- [配置与环境](config-env.md)\n- [安全与权限](security-auth.md)\n- [任务与事件](jobs-events.md)\n\n## 按需知识项\n\n暂无。新增 `module-<name>.md`、`api-<domain>.md`、`integration-<system>.md` 或 `design-system.md` 后同步到这里。\n\n## 最后同步\n\n暂无。\n",
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
      "# 数据模型\n\n## 1. 当前数据权威\n\n| 权威来源 | 路径 / 工具 | 角色 | 证据 | 置信度 |\n|---|---|---|---|---|\n| 未确认 | 未确认 | 当前 schema 来源 | 未确认 | 未确认 |\n\n## 2. 存储概览\n\n| 存储 | 类型 | 用途 | 配置来源 | 运行证据 | 置信度 |\n|---|---|---|---|---|---|\n| 未确认 | postgres / mysql / sqlite / redis / file / object storage / unknown | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 3. 当前实体 / 表\n\n| 实体 / 表 | 用途 | 关键字段 | 状态字段 | 读取路径 | 写入路径 | 测试 | 证据 | 置信度 |\n|---|---|---|---|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 4. 关系与约束\n\n| 来源 | 关系 | 目标 | 约束 / 索引 | 证据 | 置信度 |\n|---|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 5. 迁移与初始化\n\n| 产物 | 角色 | 被谁引用 | 当前状态 | 证据 |\n|---|---|---|---|---|\n| 未确认 | migration / seed / init / legacy / unknown | 未确认 | 未确认 | 未确认 |\n\n## 6. 历史 / 未受信 SQL 产物\n\n| 文件 | 不作为当前事实的原因 | 已扫描证据 | 下一步验证 |\n|---|---|---|---|\n| 未确认 | SQL / DDL / dump 文件默认不是当前事实 | 未确认 | 检查 migration、runtime、CI、tests 或询问 owner |\n\n## 7. 数据生命周期\n\n| 实体 | 创建 | 更新 | 删除 / 归档 | 审计 | 证据 |\n|---|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 8. 数据风险 / 未确认项\n\n| 缺口 | 影响 | 已查证据 | 负责人 | 下一步 |\n|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | TBD | 未确认 |\n",
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
      "# 风险与技术债\n\n| 风险 / 缺口 | 影响 | 已扫范围 / 证据 | 当前缓解 | 负责人 | 下一步 |\n|---|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | TBD | 未确认 |\n",
  },
  "external-interfaces.md": {
    title: "对外接口总览",
    kind: "integration",
    body:
      "# 对外接口总览\n\n## 1. 接口范围说明\n\n| 类型 | 是否存在 | 主要位置 | 证据 | 备注 |\n|---|---|---|---|---|\n| 入站 HTTP API | 未确认 | | | |\n| Webhook 接收端 | 未确认 | | | |\n| GraphQL / RPC / gRPC | 未确认 | | | |\n| CLI / 命令 | 未确认 | | | |\n| SDK / 公共导出 | 未确认 | | | |\n| 文件导入 / 导出 | 未确认 | | | |\n| 出站第三方 API | 未确认 | | | |\n| 事件 / 队列 / 消息 | 未确认 | | | |\n| 公开前端路由 | 未确认 | | | |\n\n## 2. 入站 API 索引\n\n| 方法 | 路径 | 领域 | 鉴权 | 处理入口 | 服务 | 请求 / 响应 | 错误 | 测试 | 证据 | 置信度 |\n|---|---|---|---|---|---|---|---|---|---|---|\n| | | | | | | | | | | 已确认 / 可能 / 未确认 |\n\n## 3. 出站集成索引\n\n| 系统 | 用途 | 客户端 / 适配器 | 鉴权 / 配置 | 重试 / 超时 | 失败行为 | 测试 | 证据 | 置信度 |\n|---|---|---|---|---|---|---|---|---|\n| | | | | | | | | |\n\n## 4. 文件导入 / 导出契约\n\n| 流程 | 方向 | 格式 | 生产者 | 消费者 | 校验 | 错误处理 | 证据 |\n|---|---|---|---|---|---|---|---|\n| | 导入 / 导出 | csv / xlsx / json / pdf / other | | | | | |\n\n## 5. 事件 / 队列 / 消息契约\n\n| 事件 / Topic / 队列 | 方向 | 生产者 | 消费者 | 载荷 | 重试 / 死信队列 | 证据 |\n|---|---|---|---|---|---|---|\n| | 入站 / 出站 | | | | | |\n\n## 6. 未确认接口缺口\n\n| 缺口 | 为什么重要 | 已查证据 | 下一证据来源 | 负责人 |\n|---|---|---|---|---|\n| | | | | |\n",
  },
  "config-env.md": {
    title: "配置与环境",
    kind: "operations",
    body:
      "# 配置与环境\n\n## 1. 运行时配置来源\n\n| 来源 | 路径 / 系统 | 范围 | 证据 | 置信度 |\n|---|---|---|---|---|\n| 未确认 | 未确认 | env / file / secret / feature flag | 未确认 | 未确认 |\n\n## 2. 环境变量\n\n| 名称 | 用途 | 是否必填 | 默认值 / 示例 | 负责人 | 证据 | 风险 |\n|---|---|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | TBD | 未确认 | 未确认 |\n\n## 3. 功能开关\n\n| 开关 | 用途 | 默认值 | 灰度 / 熔断 | 证据 |\n|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 4. 配置风险 / 未确认项\n\n| 缺口 | 影响 | 已查证据 | 下一证据来源 |\n|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 |\n",
  },
  "security-auth.md": {
    title: "安全与权限",
    kind: "runbook",
    body:
      "# 安全与权限\n\n## 1. 认证\n\n| 机制 | 入口 / 中间件 | Token / Session | 证据 | 置信度 |\n|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 2. 授权\n\n| 资源 / 操作 | 角色 / 策略 | 执行路径 | 失败行为 | 证据 |\n|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 3. 敏感数据边界\n\n| 数据 | 分类 | 存储 / 传输 | 脱敏 / 遮蔽 | 证据 |\n|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 4. 安全风险 / 未确认项\n\n| 缺口 | 影响 | 已查证据 | 下一证据来源 |\n|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 |\n",
  },
  "jobs-events.md": {
    title: "任务与事件",
    kind: "operations",
    body:
      "# 任务与事件\n\n## 1. 后台任务\n\n| 任务 | 触发 | 处理入口 | 调度 / 队列 | 重试 / 超时 | 测试 | 证据 |\n|---|---|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 2. 事件 / 队列 / 消息契约\n\n| 事件 / Topic / 队列 | 方向 | 生产者 | 消费者 | 载荷 | 重试 / 死信队列 | 证据 |\n|---|---|---|---|---|---|---|\n| 未确认 | 入站 / 出站 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 3. 定时调度\n\n| 调度 | 用途 | 入口 | 失败行为 | 证据 |\n|---|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |\n\n## 4. 任务 / 事件风险\n\n| 缺口 | 影响 | 已查证据 | 下一证据来源 |\n|---|---|---|---|\n| 未确认 | 未确认 | 未确认 | 未确认 |\n",
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
