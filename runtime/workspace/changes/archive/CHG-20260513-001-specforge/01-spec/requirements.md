# Requirements

## 摘要

将 SpecForge 仓库重组为职责清晰的顶层结构：`skills/` 作为 Agent 入口技能集合，`runtime/` 作为运行时母本，`starter/` 作为业务项目 `.specforge/` 快照，`docs/` 归档维护者文档，`cli/` 承载命令行工具。业务项目初始化后的目录仍为 `.specforge/`。本变更必须保持现有 onboarding、doctor、validate、skill install 和 workflow 状态机可用。

## 分析依据

- 来自 intake 的需求理解：用户希望消除根级 `specforge-*` 平铺、`.specforge/` 母本/副本同名、`skills` 语义重叠和 starter 深层嵌套，并引入 hooks / commands 清晰归属。
- 来自代码库探索：当前 CLI、package scripts、starter sync、skill install、validate-skills、validate-structure、root skills 和 docs 大量硬编码 `.specforge` 与 `specforge-*`。
- 来自外部研究：未触发；本次主要依赖仓库内部路径和用户设计决策。
- 来自用户澄清：新 skill 前缀使用 `sf-*`；源码母本用 `runtime/`；内部阶段母本用 `stages/`；starter 扁平化；commands 是 Agent 快捷入口；hooks 默认 noop 且业务可覆盖。

## 目标用户与场景

| 角色 | 目标 | 关键场景 |
|---|---|---|
| SpecForge 维护者 | 一眼理解源码母本、安装技能、starter 快照和运行状态 | 修改规则、模板、工具、技能时能定位正确目录 |
| Claude Code / Codex 用户 | 使用短调用名触发 SpecForge | 输入 `sf` 或 `sf-*` 查看和调用技能 |
| 业务项目维护者 | 在项目中获得稳定 `.specforge/` 工作区 | `sf-onboard` 或 CLI init 后 `.specforge/` 可运行 doctor |
| 已安装旧技能用户 | 迁移期不被突然打断 | 旧 `specforge-*` 入口仍能指向新 `sf-*` 或提示迁移 |

## 功能决策

| 功能 | 决策 | 理由 | 后续版本 |
|---|---|---|---|
| 根级技能迁移到 `skills/sf-*` | 纳入 MVP | 解决平铺和调用前缀冗长 | 后续移除旧 wrapper |
| 旧 `specforge-*` 兼容入口 | 纳入 MVP | 降低破坏性，保护已有安装 | 下个破坏性版本删除 |
| `.specforge/` 母本改为 `runtime/` | 纳入 MVP | 区分源码母本和业务项目副本 | 无 |
| `runtime/skills` 改为 `runtime/execution/stages` | 纳入 MVP | 消除 skills 命名冲突 | 无 |
| `runtime/policy`、`artifacts`、`execution`、`workspace` | 纳入 MVP | 按信息流动方向组织 | 可继续细化 execution |
| `starter/` 扁平化 | 纳入 MVP | onboard 产物成为一等目录 | 无 |
| hooks 契约 | 纳入 MVP | 为业务集成留扩展点 | 后续补具体 Slack/Jira/CI 示例 |
| docs / cli 归位 | 纳入 MVP | 根目录减噪，职责清楚 | 无 |

## 边界

### 本变更负责

- 新目录结构和迁移后的路径事实源。
- `sf-*` 技能目录、frontmatter name、安装脚本和 root/internal stage 映射。
- 旧 `specforge-*` 入口兼容策略。
- `runtime/` 下 policy / artifacts / execution / workspace 分层。
- `starter/` 生成逻辑和 CLI init/onboard 复制逻辑。
- `runtime/execution/hooks/` 默认 noop hook 与 hook loader 契约。
- `runtime/workspace/hooks/` 项目覆盖约定。
- `commands/` 作为 Agent 快捷命令卡片的路径归属。
- README / AGENTS / CLAUDE / adapters 文档迁移和引用更新。
- validation / doctor / self-test / starter check / install skill 的验证链路。

### 本变更不负责

- 不改变业务项目 `.specforge/` 作为项目工作区的名称。
- 不迁移历史 archive change 内部旧路径引用。
- 不实现 Slack、Jira、CI 等具体 hook 集成。
- 不发布 npm 包。
- 不改变 standard workflow 的 artifact graph 语义。
- 不要求用户立即停止使用旧 `specforge-*` 调用名。

### 依赖

- 当前仓库已有需求分析增强改动仍未提交；目录迁移 implementation 前需要确认它们作为前置状态存在，并纳入验证。
- `package.json` `files`、bin 路径和 scripts 必须与新目录一致。
- `sync-starter-assets.mjs`、`install-agent-skills.mjs`、`validate-skills.mjs`、`validate-structure.mjs` 必须先拥有路径抽象或迁移补丁。

### 重新验证触发条件

- 新增或删除顶层目录。
- 改变业务项目 `.specforge/` 输出结构。
- 改变 skill frontmatter name 或安装目标。
- 改变 hook loader 接口。
- 改变 package `files`、bin 或 CLI init 逻辑。

## 待澄清项

无阻断澄清项。旧入口兼容期长度和最终删除版本在 design 中作为默认策略说明。

## 用户流程

| 流程 | 触发 | 成功结果 | 失败 / 空状态 |
|---|---|---|---|
| 维护者修改规则 / 模板 | 编辑 `runtime/policy` 或 `runtime/artifacts` | starter 同步、validate 通过 | starter drift 明确提示 |
| 用户安装技能 | 运行 `node cli/specforge.mjs skill add --target all --apply` | `sf-*` 安装到目标 skills 目录 | 目标未知时报错列出可选 target |
| 业务项目初始化 | 运行 `sf-onboard` 或 `specforge init --dir .` | 业务项目出现 `.specforge/`，doctor 通过 | 已存在 `.specforge/` 时阻断或要求 `--force` |
| hooks 执行 | gate / close 等工具触发生命周期事件 | 项目 hook 覆盖或默认 noop 成功 | pre hook 失败阻断；post hook 失败按策略警告或阻断 |
| 旧入口调用 | 用户调用 `specforge` / `specforge-*` | 兼容 wrapper 指向新 `sf-*` 或提示迁移 | 未安装新技能时给出安装说明 |

## 功能需求

- WHEN 维护者查看仓库根目录, THE SYSTEM SHALL expose only clear top-level product areas: `skills/`, `runtime/`, `starter/`, `docs/`, `cli/` plus repository metadata.
- WHEN Agent skills are installed, THE SYSTEM SHALL install `sf` and `sf-*` skill directories with matching frontmatter names.
- WHEN old `specforge` or `specforge-*` entrypoints are present during the transition, THE SYSTEM SHALL either delegate to corresponding `sf-*` instructions or clearly tell the user to use/install `sf-*`.
- WHEN runtime source assets are edited, THE SYSTEM SHALL treat `runtime/` as the mother source and `starter/` as the generated business-project `.specforge/` snapshot.
- WHEN a business project is onboarded, THE SYSTEM SHALL still create or update `<project>/.specforge/`, not `<project>/runtime/`.
- WHEN starter sync runs, THE SYSTEM SHALL generate `starter/` from `runtime/` without copying runtime workspace dynamic registry/archive state.
- WHEN internal stage behavior is changed, THE SYSTEM SHALL locate it under `runtime/execution/stages/`, not under Agent entry `skills/`.
- WHEN commands are defined, THE SYSTEM SHALL store command cards under `runtime/execution/commands/`.
- WHEN tools support lifecycle customization, THE SYSTEM SHALL load project overrides from `runtime/workspace/hooks/` before falling back to `runtime/execution/hooks/` default noop hooks.
- IF a pre hook fails, THE SYSTEM SHALL stop the core tool action and report the hook failure.
- IF a post hook fails, THE SYSTEM SHALL report the failure and follow the configured strictness policy.
- WHEN validation runs, THE SYSTEM SHALL verify the new required paths, skill mappings, starter sync, package paths and hook defaults.

## 非功能需求

- **NFR-1**: Migration must be staged so `doctor`, `validate-skills`, `validate-structure`, `sync-starter-assets --check` and `self-test` can pass after implementation.
- **NFR-2**: The migration must avoid destructive rewrites of archived changes.
- **NFR-3**: The transition must preserve a usable path for existing users of `specforge-*`.
- **NFR-4**: New path constants should be centralized enough to avoid repeated hard-coded `.specforge` / `specforge-*` strings in tools.
- **NFR-5**: Documentation must distinguish source runtime from business project `.specforge/`.

## 不在范围内

- Full deletion of old `specforge-*` compatibility wrappers.
- External hook integrations beyond noop contract and loader.
- npm release publishing.
- Migrating archived evidence to new paths.

## 验收标准

| 标准 | 验证方式 |
|---|---|
| 新顶层结构存在且职责符合 design | `find` / review |
| `sf-*` skills 可被安装到 Codex / Claude Code / cc-switch | `node cli/specforge.mjs skill add --target all --apply` 或等价命令 |
| 旧 `specforge-*` 兼容策略可用或文档清楚 | inspect installed skills / review |
| `runtime/` 到 `starter/` 同步无 drift | starter check |
| 新业务项目 init 后 `.specforge/tools/doctor.mjs` 通过 | 临时目录 init + doctor |
| `validate-skills` 覆盖 `skills/sf-*` 与 `runtime/execution/stages/*` 映射 | validation |
| `validate-structure` 覆盖 `runtime`, `starter`, `skills`, `docs`, `cli` required paths | validation |
| hook default noop 存在且 loader fallback 可测试 | unit/self-test 或 smoke command |
| `doctor` 通过 | `node runtime/execution/tools/doctor.mjs` 或迁移后等价命令 |
| README / AGENTS / CLAUDE / adapters 不再把源码母本说成业务 `.specforge/` | review |
