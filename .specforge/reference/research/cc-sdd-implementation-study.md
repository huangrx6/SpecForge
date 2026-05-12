# cc-sdd 实现研究

研究对象：[gotalab/cc-sdd](https://github.com/gotalab/cc-sdd)

## 结论摘要

cc-sdd 的核心不是一个规格运行时，而是一个面向多 AI 工具的 SDD 安装器和技能包。它把 Kiro 风格的 spec workflow 转换成 Claude Code、Codex、Cursor、Copilot、Windsurf、OpenCode、Gemini CLI 等工具可加载的 commands / skills / agents。

对 SpecForge 最有价值的启发是：

| 机制 | cc-sdd 做法 | SpecForge 应吸收的点 |
|---|---|---|
| 安装器 | manifest 声明模板来源、目标路径、agent 条件 | 后续需要 adapter/installer，不能只适配 Codex |
| Agent registry | 每个 agent 有默认目录、命令形式、推荐模型、迁移提示 | SpecForge 应显式建工具适配层 |
| Shared rules | skill 声明共享规则，安装时注入到技能目录 | 规则应可复用，不要在每个 skill 里复制 |
| Discovery | 先轻扫描，再路由到 existing / direct / single / multi / mixed | SpecForge 的 discovery 应成为强入口 |
| Review gates | requirements/design/tasks 写入前先审查，最多修复两轮 | Gate 不是文档签名，而是写入前质量门禁 |
| Implementation | 自治实现循环：任务队列、实现子代理、审查子代理、调试子代理 | v0.2+ 可引入受控的 task-level agent loop |
| Validation | feature-level 集成验证，包含测试、密钥扫描、liveness、边界审计 | 验证不能只看测试是否通过 |

## 工具结构

cc-sdd 的 npm 包在 `tools/cc-sdd`。

| 区域 | 职责 |
|---|---|
| `src/index.ts` | CLI 参数解析、agent 选择、manifest 解析、执行安装计划 |
| `src/agents/registry.ts` | 多 AI 工具注册表 |
| `src/manifest/` | manifest 加载、条件过滤、占位符替换 |
| `src/plan/` | 文件操作计划、路径安全、冲突策略、执行写入 |
| `templates/agents/` | 各 AI 工具对应 commands / skills / docs |
| `templates/shared/settings/` | 共享规则和规格模板 |

## Manifest 安装模型

cc-sdd 的 manifest 用于描述“要把哪些模板安装到哪里”。

artifact 类型包括：

| 类型 | 含义 |
|---|---|
| `staticDir` | 原样复制目录 |
| `templateFile` | 渲染单文件模板 |
| `templateDir` | 渲染目录模板 |

每个 artifact 可以带 `when.agent` 和 `when.os` 条件。安装时会替换：

- `{{AGENT}}`
- `{{LANG_CODE}}`
- `{{KIRO_DIR}}`
- `{{AGENT_DIR}}`
- `{{AGENT_DOC}}`
- `{{AGENT_COMMANDS_DIR}}`

SpecForge 当前没有安装器，也没有 adapter 层。短期可以先写清楚目标结构，后续再做 CLI。

## 路径安全与冲突策略

cc-sdd 的文件写入不是直接覆盖：

- 所有目标路径必须在项目根目录内。
- 禁止目标路径穿越根目录。
- 写入前检查 symlink。
- 支持 backup。
- 冲突策略支持 overwrite / skip / append。
- JSON 模板不允许 append。

这对 SpecForge 后续 CLI 很重要。任何 `specforge init` 或 `specforge install-adapter` 都必须先有路径安全策略。

## Discovery 技能

`kiro-discovery` 是 cc-sdd 最值得借鉴的部分之一。

它的流程是：

1. 轻量扫描：只看 specs inventory、steering 是否存在、roadmap、项目顶层结构。
2. 路由：
   - Path A：已有 spec 覆盖。
   - Path B：不需要 spec，直接实现。
   - Path C：新单 scope feature。
   - Path D：多 scope 拆解。
   - Path E：混合拆解。
3. 对 C/D/E 才做深度上下文加载。
4. 通过连续问题澄清边界，而不是一次性问一堆。
5. 给 2-3 个方案和取舍。
6. 确认方向后写入 `brief.md` 或 `roadmap.md`。
7. 写文件后再建议下一命令。

关键点：discovery 的结果必须落盘，因为对话文本不能作为长期上下文。

SpecForge 目前已有 discovery 概念，但技能内容还不够强。应补齐：

- 路由判定表。
- 轻扫描 / 深扫描分界。
- brief / roadmap 的写入规则。
- “写文件后停止”的约束。

## Requirements / Design / Tasks Gate

cc-sdd 的技能不会直接写最终文档，而是先生成 draft，再跑 review gate。

### Requirements gate

检查内容：

- 范围覆盖。
- EARS 格式。
- 可测试性。
- 是否混入设计细节。
- requirement heading 是否为数字 ID。
- 模糊范围是否需要回问用户。

### Design gate

检查内容：

- 所有需求 ID 是否映射到设计元素。
- Boundary Commitments / Out of Boundary / Allowed Dependencies / Revalidation Triggers 是否填实。
- File Structure Plan 是否有具体文件路径。
- 组件是否都有落点。
- 是否能直接生成任务。

### Tasks gate

检查内容：

- 每个需求是否映射到任务。
- 每个任务是否 1-3 小时可执行。
- 是否有可观察完成状态。
- `_Boundary:_`、`_Depends:_`、`(P)` 是否和设计一致。
- 是否存在隐藏前置条件。

SpecForge 的模板已经有边界意识，但还缺少“写入前审查循环”和“最多两轮修复”的明确协议。

## 实现循环

`kiro-impl` 的设计很完整：

- 读取 spec、requirements、design、tasks。
- 校验 approvals。
- 自动发现测试/构建/冒烟命令。
- 建立 git baseline。
- 从 tasks.md 解析任务队列。
- 跳过 `_Blocked:_`。
- 识别 `_Depends:_` 和 `_Boundary:_`。
- 每轮只处理一个任务。
- fresh implementer subagent 实现。
- independent reviewer subagent 审查。
- 不通过时 bounded review rounds。
- 需要时启用 debugger subagent。
- 只 selective staging，不 `git add -A`。
- 写 implementation notes。

SpecForge v0.1 不需要马上实现自治循环，但 v0.2 的 task model 必须为它准备数据：

- 任务 ID 稳定。
- 任务边界明确。
- 依赖可解析。
- 完成状态可更新。
- review 结论可结构化。

## Batch Spec

`kiro-spec-batch` 支持根据 roadmap 并行生成多个 spec：

1. 读取 roadmap。
2. 解析 dependency order。
3. 生成 dependency waves。
4. 同一 wave 的 spec 可并行处理。
5. 最后做 cross-spec review。

cross-spec review 会检查：

- 数据模型一致性。
- 接口是否对齐。
- 是否有重复功能。
- 依赖是否完整。
- 命名是否一致。
- 任务边界是否连续。
- 架构边界是否被破坏。

这正好对应 SpecForge 的 initiatives / multi-change 编排。当前 SpecForge 还没有把 initiatives 落地，后续应借鉴 wave 和 cross-spec review。

## 可直接借鉴的设计

| 优先级 | 可借鉴内容 | SpecForge 落地方式 |
|---|---|---|
| P0 | 轻扫描 discovery router | 强化 `.specforge/skills/discovery/SKILL.md` |
| P0 | 写入前 review gate | requirements/design/tasks skill 增加 draft-review-write 流程 |
| P0 | 任务边界和依赖标注 | 强制 `_Boundary:_`、必要时 `_Depends:_` |
| P1 | 多工具 adapter registry | `.specforge/adapters/` 和 installer manifest |
| P1 | 路径安全写入策略 | 后续 CLI init/update 必须内置 |
| P1 | feature-level validation | 验证报告加入集成、密钥、liveness、边界审计 |
| P2 | autonomous implementation loop | 在任务模型稳定后引入 |

## 不应照搬的地方

- cc-sdd 是 Kiro 风格安装器，SpecForge 的核心应仍是 repository-native protocol。
- cc-sdd 的语言资料以英文和日文为主，SpecForge 应中文优先。
- cc-sdd 的技能很强，但文件结构和命名与 SpecForge 的 `.specforge/` / `.specforge/` 分层不同，不能直接搬目录。

