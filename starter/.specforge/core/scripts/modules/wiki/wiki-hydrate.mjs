import { exists, layout, localDateIso, readText, writeText } from "../../lib/specforge.mjs";
import { codebaseIntelligenceSummary, readPackageScripts, wikiUpdatePlan } from "../../lib/wiki-plan.mjs";

const args = process.argv.slice(2);
const shouldWrite = args.includes("--write");
const asJson = args.includes("--json");

function option(name, fallback = null) {
  const index = args.indexOf(name);
  const value = args[index + 1];
  return index === -1 || !value || value.startsWith("--") ? fallback : value;
}

function list(items = [], render = (item) => String(item)) {
  if (!items.length) return "- none";
  return items.map((item) => `- ${render(item)}`).join("\n");
}

function firstItems(items = [], limit = 10) {
  return (Array.isArray(items) ? items : []).slice(0, limit);
}

function itemPath(item) {
  if (typeof item === "string") return item;
  return item?.path ?? item?.name ?? item?.file ?? item?.id ?? JSON.stringify(item);
}

function dataGroups(summary) {
  const groups = summary?.normalized_context?.data_candidate_groups ?? summary?.wiki_seed?.data_model?.groups ?? {};
  const empty = {
    active_models: [],
    repositories: [],
    migration_artifacts: [],
    schema_authorities: [],
    seed_or_init: [],
    legacy_sql_candidates: [],
    untrusted_sql: [],
    data_candidates: [],
  };
  return Object.fromEntries(Object.entries(empty).map(([key]) => [key, Array.isArray(groups[key]) ? groups[key] : []]));
}

function artifact(workItemBase, path) {
  const full = workItemBase ? `${workItemBase}/${path}` : "";
  return full && exists(full) ? { path: full, text: readText(full) } : { path: full, text: "" };
}

function linesFromText(text, patterns, limit = 8) {
  const lines = String(text ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && patterns.some((pattern) => pattern.test(line)))
    .filter((line) => !/^[-|:\s]*$/.test(line));
  return [...new Set(lines)].slice(0, limit);
}

function frontmatter(title, kind, sourceWork) {
  return `---\ntitle: ${title}\nkind: ${kind}\nowner: SpecForge\nlast_updated: ${localDateIso()}\nsource_work: ${sourceWork}\nstatus: current\n---\n\n`;
}

function sourceWork(plan, fallback) {
  return plan.work_item?.id ?? fallback ?? "steering";
}

function buildIndex(files, plan) {
  return `${frontmatter("知识库索引", "index", sourceWork(plan, "wiki-hydrate"))}# 知识库索引

最后同步：${localDateIso()}

## 当前知识入口

${list(files, (file) => `[\`${file}\`](${file})`)}

## 同步摘要

- 回填前 Wiki 状态：${plan.wiki_state.status}
- 必须更新的目标：${plan.required_targets.map((item) => item.file).join(", ") || "无"}
- 当前工作是否允许不回写：${plan.can_write_na ? "是" : "否"}

## 维护规则

- Wiki 只保存当前长期事实，不保存 work item 过程流水账。
- 新事实必须能追溯到 approved artifact、codebase-intelligence 或代码路径。
- close 阶段如 \`wiki-update-plan\` 返回 \`can_write_na=false\`，不得写 N/A。
`;
}

function buildOverview(plan, artifacts, summary) {
  const productLines = linesFromText(
    `${artifacts.brief.text}\n${artifacts.prd.text}\n${artifacts.requirements.text}`,
    [/目标|用户|成功|范围|能力|REQ-|AC-|问题|价值|边界/i],
    10,
  );
  const scale = summary?.normalized_context?.scale ?? summary?.bootstrap?.scale ?? "unknown";
  const languages = summary?.summary?.languages ?? [];

  return `${frontmatter("项目概览", "project", sourceWork(plan, "steering"))}# 项目概览

## 项目定位

${productLines.length ? list(productLines) : "- 当前项目已接入 SpecForge；项目定位以后续 approved PRD / requirements 为准。"}

## 当前代码画像

- 代码规模：${scale}
- 主要语言：${languages.length ? languages.join(", ") : "见 codebase-intelligence / codebase-map 输出"}
- 长期事实来源：${plan.work_item?.id ? `${plan.work_item.id} 产物` : "steering / codebase-intelligence"}

## 后续任务入口

- 需求和产品规则：\`01-spec/requirements.md\`、\`.specforge/wiki/02-product-rules.md\`
- 架构和模块边界：\`.specforge/wiki/03-architecture.md\`
- 运行和验证：\`.specforge/wiki/05-operations.md\`
`;
}

function buildArchitecture(plan, artifacts, summary) {
  const context = summary?.normalized_context ?? {};
  const modules = firstItems(context.modules ?? [], 12);
  const entries = firstItems(context.entries ?? [], 12);
  const api = firstItems(context.api_candidates ?? [], 12);
  const graphFacts = firstItems((context.graph_facts ?? summary?.graph_facts ?? []).filter((fact) => fact.used_for_wiki), 16);
  const techLines = linesFromText(
    `${artifacts.technical_design.text}\n${artifacts.implementation_report.text}`,
    [/Boundary|Architecture|Implementation Handoff|owner|module|service|interface|入口|边界|模块|链路|契约/i],
    10,
  );

  return `${frontmatter("架构概览", "architecture", sourceWork(plan, "steering"))}# 架构概览

## 架构摘要

${techLines.length ? list(techLines) : "- 架构事实来自 codebase-intelligence 的模块、入口和候选路径；具体业务语义需在后续 work item 中继续补证。"}

## 模块 / 服务候选

${list(modules, (item) => `\`${itemPath(item)}\`${item.source_count ? ` - ${item.source_count} 个源文件` : ""}`)}

## 入口与 API 候选

### 入口

${list(entries, (item) => `\`${itemPath(item)}\``)}

### API / 接口

${list(api, (item) => `\`${itemPath(item)}\``)}

## 已用于 Wiki 的图谱事实

${list(graphFacts, (fact) => `${fact.id}: ${fact.subject || "未知"} ${fact.relation || "关联"} ${fact.object || "未知"}；来源：${(fact.source_paths ?? []).map((path) => `\`${path}\``).join(", ") || "无"}`)}

## 代码导航

- 入口检索：\`rg "route|controller|handler|command|main|createApp|app.listen"\`
- 模块检索：\`rg "export|class|function|service|repository"\`
- 影响面检索：优先使用 code intelligence provider；没有 provider 时按 changed files 和模块目录分批读取。
`;
}

function buildDataModel(plan, artifacts, summary) {
  const context = summary?.normalized_context ?? {};
  const groups = dataGroups(summary);
  const currentAuthorities = [
    ...groups.schema_authorities.map((path) => ({ path, role: "schema 权威来源" })),
    ...groups.active_models.map((path) => ({ path, role: "运行时模型" })),
    ...groups.repositories.map((path) => ({ path, role: "数据访问层" })),
  ];
  const migrationArtifacts = [...groups.migration_artifacts, ...groups.seed_or_init];
  const untrustedSql = [...groups.legacy_sql_candidates, ...groups.untrusted_sql];
  const dataLines = linesFromText(
    `${artifacts.technical_design.text}\n${artifacts.implementation_report.text}`,
    [/schema|model|migration|database|table|entity|repository|数据|表|模型|迁移|索引/i],
    10,
  );

  return `${frontmatter("数据模型", "data", sourceWork(plan, "steering"))}# 数据模型

## 1. 当前数据权威

| 权威来源 | 路径 / 工具 | 角色 | 证据 | 置信度 |
|---|---|---|---|---|
${currentAuthorities.length ? currentAuthorities.slice(0, 16).map((item) => `| ${item.role} | \`${item.path}\` | 当前事实候选 | codebase-intelligence data_candidate_groups | 可能 |`).join("\n") : "| 未确认 | 未确认 | 当前 schema 来源 | 未确认 | 未确认 |"}

## 2. 存储概览

| 存储 | 类型 | 用途 | 配置来源 | 运行证据 | 置信度 |
|---|---|---|---|---|---|
| 未确认 | unknown | ${dataLines.length ? dataLines[0].replaceAll("|", "/") : "未确认"} | 未确认 | 未确认 | 未确认 |

## 3. 当前实体 / 表

| 实体 / 表 | 用途 | 关键字段 | 状态字段 | 读取路径 | 写入路径 | 测试 | 证据 | 置信度 |
|---|---|---|---|---|---|---|---|---|
${currentAuthorities.length ? currentAuthorities.slice(0, 16).map((item) => `| 未确认 | ${item.role} 候选 | 未确认 | 未确认 | \`${item.path}\` | \`${item.path}\` | 未确认 | codebase-intelligence | 可能 |`).join("\n") : "| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |"}

## 4. 关系与约束

| 来源 | 关系 | 目标 | 约束 / 索引 | 证据 | 置信度 |
|---|---|---|---|---|---|
| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |

## 5. 迁移与初始化

| 产物 | 角色 | 被谁引用 | 当前状态 | 证据 |
|---|---|---|---|---|
${migrationArtifacts.length ? migrationArtifacts.slice(0, 16).map((path) => `| \`${path}\` | migration / seed / init 候选 | 未确认 | 候选 | codebase-intelligence |`).join("\n") : "| 未确认 | migration / seed / init / legacy / unknown | 未确认 | 未确认 | 未确认 |"}

## 6. 历史 / 未受信 SQL 产物

| 文件 | 不作为当前事实的原因 | 已扫描证据 | 下一步验证 |
|---|---|---|---|
${untrustedSql.length ? untrustedSql.slice(0, 16).map((path) => `| \`${path}\` | SQL / DDL / dump 文件默认不是当前事实，未证明被 runtime / migration / tests 引用 | codebase-intelligence data_candidate_groups | 检查 migration、runtime、CI、tests 或询问 owner |`).join("\n") : "| 未确认 | SQL / DDL / dump 文件默认不是当前事实 | 未确认 | 检查 migration、runtime、CI、tests 或询问 owner |"}

## 7. 数据生命周期

| 实体 | 创建 | 更新 | 删除 / 归档 | 审计 | 证据 |
|---|---|---|---|---|---|
| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |

## 8. 数据风险 / 未确认项

| 缺口 | 影响 | 已查证据 | 负责人 | 下一步 |
|---|---|---|---|---|
${untrustedSql.length ? `| 存在未受信 SQL 候选 | 防止历史 SQL 被误写成当前 schema | ${untrustedSql.map((path) => `\`${path}\``).join("<br>")} | TBD | 验证是否被 migration/runtime/tests 引用 |` : "| 未确认 | 未确认 | 未确认 | TBD | 未确认 |"}

## 代码导航

- 模型 / schema：\`rg "schema|model|entity|table|migration|repository|prisma|typeorm|sequelize|sql"\`
- 测试 / fixture：\`rg "fixture|factory|seed|migration|rollback"\`
`;
}

function buildExternalInterfaces(plan, artifacts, summary) {
  const context = summary?.normalized_context ?? {};
  const api = firstItems(context.api_candidates ?? [], 20);
  const lines = linesFromText(
    `${artifacts.technical_design.text}\n${artifacts.implementation_report.text}\n${artifacts.requirements.text}`,
    [/API|route|controller|endpoint|webhook|SDK|GraphQL|gRPC|RPC|CLI|import|export|接口|集成|导入|导出/i],
    16,
  );

  return `${frontmatter("对外接口总览", "integration", sourceWork(plan, "steering"))}# 对外接口总览

## 1. 接口范围说明

| 类型 | 是否存在 | 主要位置 | 证据 | 备注 |
|---|---|---|---|---|
| 入站 HTTP API | ${api.length ? "可能" : "未确认"} | ${api.slice(0, 5).map((item) => `\`${itemPath(item)}\``).join("<br>")} | codebase-intelligence / artifacts | 需要继续确认 method、auth、handler |
| Webhook 接收端 | 未确认 | | | |
| GraphQL / RPC / gRPC | 未确认 | | | |
| CLI / 命令 | 未确认 | | | |
| SDK / 公共导出 | 未确认 | | | |
| 文件导入 / 导出 | 未确认 | | | |
| 出站第三方 API | 未确认 | | | |
| 事件 / 队列 / 消息 | 未确认 | | | |
| 公开前端路由 | 未确认 | | | |

## 2. 入站 API 索引

| 方法 | 路径 | 领域 | 鉴权 | 处理入口 | 服务 | 请求 / 响应 | 错误 | 测试 | 证据 | 置信度 |
|---|---|---|---|---|---|---|---|---|---|---|
${api.length ? api.slice(0, 20).map((item) => `| 未确认 | \`${itemPath(item)}\` | 未确认 | 未确认 | \`${itemPath(item)}\` | 未确认 | 未确认 | 未确认 | 未确认 | codebase-intelligence | 可能 |`).join("\n") : "| | | | | | | | | | | 未确认 |"}

## 3. 出站集成索引

| 系统 | 用途 | 客户端 / 适配器 | 鉴权 / 配置 | 重试 / 超时 | 失败行为 | 测试 | 证据 | 置信度 |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

## 4. 文件导入 / 导出契约

| 流程 | 方向 | 格式 | 生产者 | 消费者 | 校验 | 错误处理 | 证据 |
|---|---|---|---|---|---|---|---|
| | 导入 / 导出 | csv / xlsx / json / pdf / other | | | | | |

## 5. 事件 / 队列 / 消息契约

| 事件 / Topic / 队列 | 方向 | 生产者 | 消费者 | 载荷 | 重试 / 死信队列 | 证据 |
|---|---|---|---|---|---|---|
| | 入站 / 出站 | | | | | |

## 6. 未确认接口缺口

| 缺口 | 为什么重要 | 已查证据 | 下一证据来源 | 负责人 |
|---|---|---|---|---|
${lines.length ? lines.slice(0, 8).map((line) => `| ${line.replaceAll("|", "/")} | 接口事实需要 method/auth/schema/test 才能稳定复用 | work artifacts | route / handler / tests | TBD |`).join("\n") : "| 未确认 | 接口事实尚未补证 | 未确认 | route / handler / tests | TBD |"}
`;
}

function buildConfigEnv(plan, artifacts) {
  const lines = linesFromText(
    `${artifacts.technical_design.text}\n${artifacts.implementation_report.text}\n${artifacts.verification_report.text}`,
    [/env|secret|config|feature flag|配置|环境变量|密钥|开关/i],
    16,
  );

  return `${frontmatter("配置与环境", "operations", sourceWork(plan, "work-artifacts"))}# 配置与环境

## 1. 运行时配置来源

| 来源 | 路径 / 系统 | 范围 | 证据 | 置信度 |
|---|---|---|---|---|
${lines.length ? lines.slice(0, 12).map((line) => `| 未确认 | ${line.replaceAll("|", "/")} | env / file / secret / feature flag | work artifacts | 可能 |`).join("\n") : "| 未确认 | 未确认 | env / file / secret / feature flag | 未确认 | 未确认 |"}

## 2. 环境变量

| 名称 | 用途 | 是否必填 | 默认值 / 示例 | 负责人 | 证据 | 风险 |
|---|---|---|---|---|---|---|
| 未确认 | 未确认 | 未确认 | 未确认 | TBD | 未确认 | 未确认 |

## 3. 功能开关

| 开关 | 用途 | 默认值 | 灰度 / 熔断 | 证据 |
|---|---|---|---|---|
| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |

## 4. 配置风险 / 未确认项

| 缺口 | 影响 | 已查证据 | 下一证据来源 |
|---|---|---|---|
| 未确认配置项 | 配置缺失可能影响运行、部署或安全 | work artifacts | env schema、config module、CI、deployment |
`;
}

function buildSecurityAuth(plan, artifacts) {
  const lines = linesFromText(
    `${artifacts.requirements.text}\n${artifacts.technical_design.text}\n${artifacts.implementation_report.text}`,
    [/auth|permission|role|policy|security|token|session|PII|敏感|认证|授权|权限|安全/i],
    16,
  );

  return `${frontmatter("安全与权限", "runbook", sourceWork(plan, "work-artifacts"))}# 安全与权限

## 1. 认证

| 机制 | 入口 / 中间件 | Token / Session | 证据 | 置信度 |
|---|---|---|---|---|
| 未确认 | 未确认 | 未确认 | ${lines[0]?.replaceAll("|", "/") ?? "未确认"} | ${lines.length ? "可能" : "未确认"} |

## 2. 授权

| 资源 / 操作 | 角色 / 策略 | 执行路径 | 失败行为 | 证据 |
|---|---|---|---|---|
| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |

## 3. 敏感数据边界

| 数据 | 分类 | 存储 / 传输 | 脱敏 / 遮蔽 | 证据 |
|---|---|---|---|---|
| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |

## 4. 安全风险 / 未确认项

| 缺口 | 影响 | 已查证据 | 下一证据来源 |
|---|---|---|---|
| 未确认安全边界 | 可能影响权限、数据暴露和审计 | work artifacts | auth middleware、policy、tests |
`;
}

function buildJobsEvents(plan, artifacts) {
  const lines = linesFromText(
    `${artifacts.technical_design.text}\n${artifacts.implementation_report.text}`,
    [/job|queue|event|cron|scheduler|worker|message|topic|DLQ|retry|任务|队列|事件|定时/i],
    16,
  );

  return `${frontmatter("任务与事件", "operations", sourceWork(plan, "work-artifacts"))}# 任务与事件

## 1. 后台任务

| 任务 | 触发 | 处理入口 | 调度 / 队列 | 重试 / 超时 | 测试 | 证据 |
|---|---|---|---|---|---|---|
${lines.length ? lines.slice(0, 12).map((line) => `| 未确认 | 未确认 | ${line.replaceAll("|", "/")} | 未确认 | 未确认 | 未确认 | work artifacts |`).join("\n") : "| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |"}

## 2. 事件 / 队列 / 消息契约

| 事件 / Topic / 队列 | 方向 | 生产者 | 消费者 | 载荷 | 重试 / 死信队列 | 证据 |
|---|---|---|---|---|---|---|
| 未确认 | 入站 / 出站 | 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |

## 3. 定时调度

| 调度 | 用途 | 入口 | 失败行为 | 证据 |
|---|---|---|---|---|
| 未确认 | 未确认 | 未确认 | 未确认 | 未确认 |

## 4. 任务 / 事件风险

| 缺口 | 影响 | 已查证据 | 下一证据来源 |
|---|---|---|---|
| 未确认任务 / 事件契约 | 可能影响重试、幂等、发布验证 | work artifacts | worker、queue config、tests |
`;
}

function buildOperations(plan, artifacts, summary) {
  const context = summary?.normalized_context ?? {};
  const operations = firstItems(context.operations_candidates ?? [], 16);
  const scripts = readPackageScripts();
  const opsLines = linesFromText(
    `${artifacts.technical_design.text}\n${artifacts.implementation_report.text}\n${artifacts.verification_report.text}`,
    [/npm |pnpm |yarn |test|build|deploy|rollback|env|config|CI|验证|启动|构建|发布|回滚|监控/i],
    12,
  );

  return `${frontmatter("运行与运维", "operations", sourceWork(plan, "steering"))}# 运行与运维

## 运行 / 验证事实

${opsLines.length ? list(opsLines) : "- 当前长期运行事实以 package scripts、CI 配置和 verification report 为准。"}

## Package 脚本

${list(scripts, (script) => `\`npm run ${script}\``)}

## 运维候选路径

${list(operations, (item) => `\`${itemPath(item)}\``)}

## 代码导航

- 命令入口：\`cat package.json\`
- CI / 发布：\`rg "workflow|deploy|release|rollback|docker|compose|env|secret"\`
- 验证入口：\`rg "test|spec|e2e|playwright|vitest|jest"\`
`;
}

function buildProductRules(plan, artifacts) {
  const lines = linesFromText(
    `${artifacts.prd.text}\n${artifacts.requirements.text}`,
    [/REQ-|AC-|MUST|SHALL|角色|权限|状态|审批|规则|边界|不在范围|Out of Scope/i],
    16,
  );

  return `${frontmatter("产品规则", "product-rules", sourceWork(plan, "work-artifacts"))}# 产品规则

## 稳定产品规则

${lines.length ? list(lines) : "- 本次 work item 未沉淀可复用产品规则。"}

## 追溯

- 主要来源：\`${artifacts.requirements.path || artifacts.prd.path || "N/A"}\`
- 规则进入 requirements 前必须区分用户确认、授权默认、Agent 推荐和未决问题。
`;
}

function buildDesignSystem(plan, artifacts) {
  const lines = linesFromText(
    artifacts.ui_design.text,
    [/Design Contract|design_mode|palette|token|component|motion|visual|state|UI|视觉|交互|组件|动效/i],
    20,
  );

  return `${frontmatter("设计系统", "design-system", sourceWork(plan, "ui-design"))}# 设计系统

## 可复用 UI 事实

${lines.length ? list(lines) : "- 本次 UI 产物没有稳定设计系统事实。"}

## 追溯

- 主要来源：\`${artifacts.ui_design.path || "N/A"}\`
- 后续实现必须优先读取 Design Contract JSON、组件契约和 visual QA detectors。
`;
}

function buildRisks(plan, artifacts) {
  const lines = linesFromText(
    `${artifacts.technical_design.text}\n${artifacts.code_review.text}\n${artifacts.verification_report.text}`,
    [/risk|debt|follow-up|pending|unknown|REQUEST_CHANGES|风险|技术债|未决|未知|后续|缺口/i],
    16,
  );

  return `${frontmatter("风险与技术债", "risks", sourceWork(plan, "work-artifacts"))}# 风险与技术债

## 当前风险 / 缺口

${lines.length ? list(lines) : "- 暂无来自当前 work item 的长期风险条目。"}

## Wiki 回填说明

- 如果后续 \`wiki-quality --mode close\` 仍报告 placeholder-heavy 或 navigation-evidence-missing，优先补代码路径、运行命令、测试入口和来源 work item。
`;
}

function targetBuilders(plan, artifacts, summary) {
  return {
    "00-index.md": () => buildIndex([
      "01-project-overview.md",
      "02-product-rules.md",
      "03-architecture.md",
      "04-data-model.md",
      "05-operations.md",
      "external-interfaces.md",
      "config-env.md",
      "security-auth.md",
      "jobs-events.md",
      "design-system.md",
      "08-risks.md",
    ].filter((file) => file !== "design-system.md" || artifacts.ui_design.text), plan),
    "01-project-overview.md": () => buildOverview(plan, artifacts, summary),
    "02-product-rules.md": () => buildProductRules(plan, artifacts),
    "03-architecture.md": () => buildArchitecture(plan, artifacts, summary),
    "04-data-model.md": () => buildDataModel(plan, artifacts, summary),
    "05-operations.md": () => buildOperations(plan, artifacts, summary),
    "external-interfaces.md": () => buildExternalInterfaces(plan, artifacts, summary),
    "config-env.md": () => buildConfigEnv(plan, artifacts),
    "security-auth.md": () => buildSecurityAuth(plan, artifacts),
    "jobs-events.md": () => buildJobsEvents(plan, artifacts),
    "design-system.md": () => buildDesignSystem(plan, artifacts),
    "08-risks.md": () => buildRisks(plan, artifacts),
  };
}

function resolveArtifacts(plan) {
  const base = plan.work_item?.path;
  return {
    brief: artifact(base, "00-intake/brief.md"),
    prd: artifact(base, "00-intake/prd.md"),
    requirements: artifact(base, "01-spec/requirements.md"),
    ui_design: artifact(base, "01-spec/ui-design.md"),
    technical_design: artifact(base, "01-spec/technical-design.md"),
    implementation_report: artifact(base, "03-implementation/report.md"),
    changed_files: artifact(base, "03-implementation/changed-files.md"),
    code_review: artifact(base, "04-code-review/code-review-v1.md"),
    verification_report: artifact(base, "05-verification/report.md"),
  };
}

function hydrate() {
  const mode = option("--mode", "close");
  const from = option("--from");
  const wikiRoot = option("--wiki-root") ?? `${layout.workspace}/wiki`;
  const plan = wikiUpdatePlan({
    workItem: option("--work-item"),
    wikiRoot,
  });
  const artifacts = resolveArtifacts(plan);
  const summary = from ? codebaseIntelligenceSummary(from) : null;
  const builders = targetBuilders(plan, artifacts, summary);
  const targetFiles = new Set(["00-index.md"]);

  if (mode === "steering" || from) {
    for (const file of ["01-project-overview.md", "03-architecture.md", "04-data-model.md", "05-operations.md", "08-risks.md"]) {
      targetFiles.add(file);
    }
  }

  for (const target of plan.required_targets) {
    if (builders[target.file]) targetFiles.add(target.file);
  }

  if (artifacts.ui_design.text) targetFiles.add("design-system.md");
  if (artifacts.requirements.text || artifacts.prd.text) targetFiles.add("02-product-rules.md");

  const writes = [...targetFiles]
    .filter((file) => builders[file])
    .map((file) => ({
      file,
      path: `${wikiRoot}/${file}`,
      content: builders[file](),
    }));

  if (shouldWrite) {
    for (const item of writes) writeText(item.path, item.content);
  }

  return {
    mode,
    dry_run: !shouldWrite,
    from: from ?? null,
    wiki_root: wikiRoot,
    work_item: plan.work_item,
    writes: writes.map((item) => ({ file: item.file, path: item.path })),
    plan,
  };
}

function markdown(result) {
  return `# SpecForge Wiki 回填

- 模式：${result.mode}
- 预览模式：${result.dry_run ? "是" : "否"}
- 来源：${result.from ?? "N/A"}
- Wiki 根目录：${result.wiki_root}
- 工作项：${result.work_item?.id ?? "N/A"}

## 写入计划

${list(result.writes, (item) => `\`${item.path}\``)}

## 回写计划

- Wiki 状态：${result.plan.wiki_state.status}
- 必须更新的目标：${result.plan.required_targets.map((item) => item.file).join(", ") || "无"}
- 是否允许不回写：${result.plan.can_write_na ? "是" : "否"}
`;
}

try {
  const result = hydrate();
  if (asJson) console.log(JSON.stringify({ wiki_hydrate: result }, null, 2));
  else console.log(markdown(result));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
