---
name: sf-tech-design
description: 生成或更新 SpecForge work item 的 technical_design；用于 ready artifact 为 technical_design，或需求涉及前端工程、后端架构、API、数据、权限、配置、任务或 NFR 时。
---

# sf-tech-design

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

把 requirements 和可选 UI design 转成可实现、可审查、可验证的工程设计。它不负责画页面线稿或决定视觉风格。

## 启动

运行：

```bash
node .specforge/core/scripts/instructions.mjs
```

确认 ready artifact 包含 `technical_design`，再：

```bash
node .specforge/core/scripts/create-artifact.mjs technical_design
```

## 内部技能母本

写 technical design 前，读取：

```text
.specforge/core/workflows/stages/technical-design/SKILL.md
```

先做影响面判断，再按需读取内部设计子模块。不要为了“完整”一次性读取所有子模块。

| 设计维度 | 子模块 |
|---|---|
| 前端工程、路由、组件边界、状态、API client、构建 | `.specforge/core/workflows/stages/technical-design/frontend-design.md` |
| 后端模块、服务边界、后台任务、并发、幂等 | `.specforge/core/workflows/stages/technical-design/backend-design.md` |
| 领域模型、实体与边界上下文 | `.specforge/core/workflows/stages/technical-design/domain-design.md` |
| API 契约、SDK、事件、跨系统接口 | `.specforge/core/workflows/stages/technical-design/api-design.md` |
| DB / Schema / 索引 / 迁移 | `.specforge/core/workflows/stages/technical-design/data-design.md` |
| 安全、可观测性、部署、可靠性 | `.specforge/core/workflows/stages/technical-design/nfr-design.md` |

## 关联标准

- `.specforge/core/standards/product.md`：技术设计必须追溯到已确认需求。
- `.specforge/core/standards/workflow.md`：写入边界、非目标、scope 和 gate 边界。
- `.specforge/core/standards/engineering.md`：工程、API、数据、安全、交付、测试、审查和规则基准。
- `.specforge/core/profiles/README.md`：技术选型维度、数据库选择矩阵和 profile selection 写法。

## 规则基准对齐

技术设计不是只写“怎么实现”，还要说明“按哪套规则基准实现”。写 `technical-design.md` 时必须完成：

1. 根据影响面读取对应规则入口，每个入口已经内嵌唯一主基准。
2. 在 `.specforge/core/standards/engineering.md#主基准` 找官方入口；需要具体条款、字段命名、版本行为或用户要求来源时，打开官方入口查当前原文。
3. 采用点必须具体到本次设计，例如资源建模、错误响应、对象级授权、可观测性字段、回滚策略。
4. 如果项目已有模式和规则主基准不同，优先项目事实，并在 `规则基准与偏离` 中写偏离理由。
5. 不要另起并行规范章节或堆多个候选规范。

## 技术选型与依赖确认门禁

技术选型和新增依赖不能由 Agent 静默拍板。写入或改动框架、数据库、队列 / 调度、AI provider / 模型、组件库、运行时、部署方式、测试栈，或计划引入新的直接依赖、SDK、插件、组件库、ORM、驱动、测试库、浏览器自动化库前，先判断是否需要用户确认：

| 场景 | 处理 |
|---|---|
| 存量项目且本次沿用 wiki / 代码中已存在的技术栈 | 可直接记录“沿用现有栈”，不需要额外询问 |
| 用户在 brief / PRD / requirements 中已经明确指定技术栈 | 记录为“用户已确认”，不再重复询问 |
| 用户明确说“按推荐方案默认做 / 不用再问” | 记录为“用户授权默认”，仍需写推荐理由和风险 |
| 新项目、空仓库、技术栈缺失，或本次要新增 / 替换关键技术 | 必须给出候选方案和推荐项，等待用户确认后才能定稿和继续设计 |
| 本次需要新增直接依赖或外部 SDK | 必须列出依赖名称、用途、替代方案、风险和推荐理由，等待用户确认 |
| 用户已确认某个官方脚手架 / 框架组合 | 脚手架自带的直接依赖不逐个询问，但要按“依赖组”记录；额外新增依赖仍需确认 |
| 多个方案都合理，且会影响成本、交付、招聘维护、上线或数据安全 | 必须停止并让用户选择 |

需要确认时，先输出“技术选型与依赖确认卡”，本轮停在确认卡；不要继续展开架构、API、数据、NFR 等详细 technical design，也不要进入 tasking / implementation：

```markdown
## 技术选型与依赖确认

我建议采用：<推荐组合>

| 维度 | 方案 A | 方案 B | 方案 C | 推荐 | 取舍 |
|---|---|---|---|---|---|
| Frontend | | | | | |
| Backend | | | | | |
| Database | | | | | |
| Jobs / Scheduler | | | | | |
| AI / LLM Provider | | | | | |
| Deploy / Runtime | | | | | |

### 新增依赖确认

| 依赖 / 依赖组 | 类型 | 用途 | 替代方案 | 推荐理由 | 风险 / 许可证 / 安全影响 |
|---|---|---|---|---|---|
| | runtime / dev / SDK / plugin / scaffold-bundled | | | | |

请确认采用哪一组；也可以指定你自己的技术栈。
```

未经确认的关键技术选择写成 `[NEEDS TECH DECISION]`；未经确认的新增依赖写成 `[NEEDS DEPENDENCY DECISION]`。二者都不得进入 `sf-tasking`、`sf-spec-review` approval 或 `sf-implement`。

## 当前版本事实检查

技术设计不能只靠记忆。以下情况必须查询当前官方资料或读取项目锁文件 / manifest：

- 新增或替换框架、SDK、云服务、数据库、部署平台、AI provider、模型、测试工具或安全相关依赖。
- 用户要求“最新版本”“当前推荐”“现在怎么做”。
- 技术选择会影响成本、上线、兼容性、安全或长期维护。

写入 `technical-design.md#1` 或 `#5`：

| 项 | 版本 / 事实 | 来源 | 日期 | 对设计的影响 |
|---|---|---|---|---|
| | | 官方文档 / lockfile / package manifest / wiki | | |

如果沿用现有项目版本，可以用 lockfile、package manifest、代码入口或 wiki 作为证据；如果无法确认，必须写风险并暂停关键决策。

## 执行顺序

1. 读取 requirements、可选 `ui-design.md`、wiki 和现有代码结构，判断本次是否真的有技术影响。
2. 填写 `technical-design.md#0. 影响面与读取计划`：
   - 每个影响面用 `yes / no / unknown`。
   - `unknown` 如果会改变架构、数据、安全或上线风险，必须暂停澄清。
   - 只列本次读取的子模块和 profile。
3. 按影响面读取子模块和 profile：
   - 只有 `has_ui` 不等于需要前端工程设计；纯视觉或纯文案 UI 可以 N/A。
   - 有 API 不等于必须有新后端模块；可能只是前端调用现有接口。
   - 有数据展示不等于必须有 DB 设计；只有持久化、索引、迁移、生命周期变化才读 data-design。
4. 完成技术选型与依赖确认门禁：沿用现有栈、用户已指定、用户授权默认，或用户确认候选方案 / 新增依赖；把来源写入 `technical-design.md#1. 技术选型与依赖确认`。未确认时停止，不继续展开详细设计。
5. 写技术设计时，每个不涉及的章节保留一行 N/A 理由，不写空表。
6. 输出必须能直接支持 `sf-tasking`：每个技术决策都要能拆成任务、验证或明确 N/A。

## 完成标准

- `01-spec/technical-design.md` 存在。
- 有技术影响时，前端 / 后端 / API / 数据 / 权限 / 配置 / NFR 的适用性判断清楚。
- 无技术影响时，明确写出 N/A、理由和验证方式。
- 技术栈选择引用 profile 或说明偏离理由。
- 新项目、新增 / 替换关键技术或新增直接依赖时，必须有用户确认、用户授权默认或明确的现有栈 / 已确认脚手架依据。
- 规则基准采用点已写入采用点、偏离理由和验证证据。
- 下一步路由到 `sf-tasking`，以 `instructions.mjs` 为准。

## 不做

- 不写业务代码。
- 不重复维护 UI 原型、视觉风格和页面交互细节；这些只引用 `ui-design.md`。
