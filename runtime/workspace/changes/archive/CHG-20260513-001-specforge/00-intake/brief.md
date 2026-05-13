# Brief

## 摘要

重组 SpecForge 仓库目录，把 Agent 入口、运行时母本、starter 快照、维护者文档和 CLI 工具分层。目标是消除当前 `specforge-*` 平铺、`.specforge/` 母本与业务副本同名、`skills` 语义重叠、starter 嵌套过深等理解和维护成本，并为 hooks / commands 提供清晰归属。

## 变更类型

架构重构（Refactor / Architecture）

## 建议 Workflow

`standard`。这是跨安装入口、运行时路径、starter 生成、CLI、校验脚本和文档的结构性变更，需要完整 requirements / design / tasks / review / verification。

## 分析深度

- 档位：deep
- 理由：涉及目录迁移、安装技能命名、CLI 路径、starter 生成、业务项目初始化兼容、全局安装副本、文档迁移和 hooks 扩展点。错误迁移会直接破坏 `specforge-onboard`、`skill add`、`doctor`、`validate-structure` 和现有用户使用方式。

## 需求理解

- 目标：把仓库整理成职责不重叠的少数顶层目录，并把 `sf-*` 作为新的 Agent skill 调用前缀。
- 角色：SpecForge 维护者、使用 Claude Code / Codex 的业务项目用户、已安装旧版 `specforge-*` 技能的用户。
- 业务结果：维护者一眼能分清母本、快照、入口技能和状态；业务项目 onboarding 仍然稳定；已安装技能迁移有兼容策略。
- 关键实体 / 概念：Agent skills、runtime mother source、starter snapshot、业务项目 `.specforge/`、stages、policy、artifacts、execution、workspace、tools、hooks、commands、CLI、package 发布清单。

## 代码库探索

- 相关规范：根级 `AGENTS.md` 要求修改 SpecForge 本体时同时看作产品本体和自举实践项目；`.specforge/AGENTS.md` 定义项目内加载顺序；`CLAUDE.md` 补充 Claude Code 专用行为。
- 相关模块：根级 `specforge/` 与 `specforge-*`；`.specforge/skills/`；`.specforge/tools/`；`.specforge/templates/`；`.specforge/schemas/standard.json`；`.specforge/starter.manifest.json`；`specforge-onboard/assets/starter/.specforge/`；`bin/specforge.mjs`；`package.json`；README / AGENTS / CLAUDE。
- 现有模式：`sync-starter-assets.mjs` 以 `.specforge/` 为 sourceRoot 生成 starter；`install-agent-skills.mjs` 扫描根级 `specforge` 和 `specforge-*`；`validate-skills.mjs` 维护 root skill 与内部 skill 映射；CLI 硬编码 `.specforge/tools/...` 和业务项目 `.specforge` 目标。
- 可复用部分：artifact graph、templates、tools 共享库、starter manifest、skill validation 映射、install target aliases。
- 跳过原因（如适用）：不跳过；本变更必须做代码库探索。

## 外部资源研究

- 是否触发：否
- 触发原因：本次是仓库内部目录架构和 CLI/starter/skill 安装逻辑重构，不依赖新增第三方框架或外部 API。
- 来源：不适用
- 关键结论：不适用
- 跳过原因（如适用）：当前资料足以来自仓库源码和用户明确设计输入；如后续涉及 npm packaging 规范细节，可在 design 中补查官方 npm package `files` 行为。

## 澄清记录

| 问题 | 选项 / 推荐 | 用户答案 | 影响 |
|---|---|---|---|
| 新入口技能是否保留前缀 | `sf-*`（推荐）/ 无前缀 / 保留 `specforge-*` | 选择 `sf-*` | 后续 skill 目录和 frontmatter name 以 `sf` 命名；可保留旧名兼容包装 |
| `commands/` 定位 | 文档 / runtime UI 快捷入口（推荐）/ tools | commands 是 slash command 快捷入口卡片 | 放入 `runtime/execution/commands/`，不是 docs |
| hooks 定位 | 写死 tools / execution 默认 noop + workspace 覆盖（推荐） | 默认 noop，业务项目可覆盖 | 设计 hook loader 和默认 hook 文件，避免业务集成改 core tools |
| `.specforge/` 母本是否改名 | `runtime/`（推荐）/ 保留 `.specforge/` | 选择 `runtime/` | 迁移源码母本，业务项目仍输出 `.specforge/` |
| 内部阶段母本命名 | `stages/`（推荐）/ `skills/` | 选择 `stages/` | 消除 Agent skills 与阶段行为母本重名 |

## 初始范围

- 顶层目录目标设计：`skills/`、`runtime/`、`starter/`、`docs/`、`cli/`。
- 根级技能迁移：`specforge` / `specforge-*` → `skills/sf*`。
- 内部阶段迁移：`.specforge/skills/*` → `runtime/execution/stages/*`。
- runtime 重组：policy、artifacts、execution、workspace。
- starter 扁平化：`starter/` 作为业务项目 `.specforge/` 的快照源。
- CLI、package scripts、install skill、starter sync、validate、doctor、onboard 路径适配。
- docs 迁移和 adapters 归位。
- hooks 契约和默认 noop 设计。
- commands 定位和路径迁移。
- 兼容策略：旧 `specforge-*` 技能和旧路径的过渡方案。

## 功能候选池

| 功能 | 建议阶段 | 用户价值 | 复杂度 | 风险 / 依赖 | 默认建议 |
|---|---|---|---|---|---|
| `skills/sf-*` 新入口 | MVP | 调用名短，技能聚合清楚 | M | installer/frontmatter 兼容 | include |
| 旧 `specforge-*` 兼容包装 | MVP | 避免已有安装和文档马上断裂 | M | 双入口维护成本 | include for transition |
| `runtime/` 母本重命名 | MVP | 消除母本和业务 `.specforge` 副本歧义 | L | 大量硬编码路径 | include |
| `runtime/execution/stages/` | MVP | 消除 skills 重名 | L | validate-skills 映射重写 | include |
| `runtime/policy` / `artifacts` / `execution` / `workspace` | MVP | 按信息流动分层 | M | tools 需要路径抽象 | include |
| `starter/` 扁平化 | MVP | onboard 产物一眼可见 | M | onboard assets 路径和 manifest 改写 | include |
| `docs/` 文档归位 | MVP | 根目录干净，维护者文档集中 | S | GitHub/npm README 兼容 | include with root README shim |
| `cli/` CLI 归位 | MVP | 工具链归属清楚 | M | package bin 路径变化 | include |
| hooks loader | MVP | 支持业务项目自定义集成 | M | hook 失败策略需定义 | include |
| slash commands 路径迁移 | MVP | UI 快捷入口归 execution | S | 适配器文档需更新 | include |
| 删除所有旧路径 | 后续 | 彻底清理历史包袱 | H | 破坏兼容 | defer |

## 用户选择

- 已确认纳入 MVP：`sf-*` 前缀、`runtime/`、`stages/`、`starter/` 扁平化、commands 属于 runtime execution、hooks 默认 noop 且业务可覆盖。
- 明确延后：彻底删除旧 `specforge-*` 兼容入口；建议先保留兼容期。
- 用户补充：希望继续优化 `runtime/` 内部结构，并明确 hooks / commands 的设计。
- Agent 默认假设：业务项目初始化后的目录仍叫 `.specforge/`；本仓库源码母本叫 `runtime/`；`starter/` 内容是“将复制到业务项目 `.specforge/` 的快照”，自身不再嵌套 `.specforge/`。

## 不在范围内

- 不迁移历史 archive change 内容中的旧路径引用，除非为了回归测试需要。
- 不改变 standard workflow 的 artifact 顺序。
- 不把业务项目输出目录从 `.specforge/` 改名。
- 不实现 Slack / Jira / CI 具体集成，只提供 hook 契约和 noop 默认实现。
- 不立即删除旧技能调用名，除非 spec review 决定不需要兼容期。
- 不发布 npm 包。

## 边界候选

- 写入边界：仓库结构、CLI、package scripts/files、runtime tools、starter sync、validate tools、root skills、docs、onboard assets。
- 禁止边界：不改 archived change 事实证据；不改用户全局技能目录，除非 closure 前同步已安装副本；不移动 `.git` / `.claude`。
- 决策边界：`sf-*`、`runtime/`、`stages/`、`starter/` 已确认；旧入口兼容期仍需在 design 中明确。

## 上游 / 下游

- 上游：现有 SpecForge v0.2.0 仓库结构、已安装全局技能、副本 starter。
- 下游：Claude Code / Codex / cc-switch 技能安装；`npx specforge init`; 业务项目 `.specforge/`；维护者文档；package 发布清单。

## 约束

- 业务项目中仍只生成 `.specforge/`。
- `starter/` 必须是可复制到业务项目 `.specforge/` 的快照，不包含本仓库动态 registry/archive。
- `runtime/workspace/` 属于本仓库自举状态；starter 只能生成空 registry、空 changes 和轻量 knowledge。
- hooks 默认 noop；项目自定义 hooks 不应被 runtime 升级覆盖。
- 迁移期间必须保证 `doctor`、`validate-skills`、`validate-structure`、`sync-starter-assets --check` 可用。
- 由于当前工作区已有未提交的需求分析增强改动，目录迁移 implementation 前应先决定是否将这些改动作为前置依赖合并或纳入同一批验证。

## 分析综合

- 范围推导：这是一次仓库架构重构，不只是文档整理；必须同时更新路径常量、工具脚本、starter 生成、技能安装和 docs。
- 风险推导：最大风险是路径硬编码导致 onboard/init/doctor/skill add 断裂；第二风险是旧技能名突然不可用；第三风险是 starter 快照与 runtime 母本漂移。
- Workflow 推导：走 standard 流程，先 requirements/design/tasks/spec_review，再按迁移波次实现。
- 下一步：生成 requirements、design、tasks；spec review 必须确认兼容策略和迁移顺序后才能 implementation。

## 待澄清项

无阻断澄清项。兼容期长度、旧入口删除时间点可在 design 中作为后续决策记录。
