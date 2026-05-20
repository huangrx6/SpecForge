# SpecForge

SpecForge 是仓库原生的规范驱动开发协议，以 Agent Skills + 项目内 `.specforge/` 项目目录的形式工作。

## 目录结构

```text
agent-skills/  外部可安装 Agent skills：sf-router / sf-*
core/          SpecForge 内核母本：rules、profiles、workflows、artifacts、scripts、hooks
starter/       业务项目初始化时写入 `.specforge/` 的唯一快照
docs/          维护者文档和适配器说明
cli/           npm / GitHub CLI 入口
```

源码仓库里的母本叫 `core/`，业务项目里生成的可用项目目录仍叫 `.specforge/`。`starter/` 是由 `core/starter.manifest.json` 生成的快照，不手工维护。

## 常用命令

```bash
npm run doctor
npm run validate
npm run validate:external-skills
npm run sync:starter
npm run codebase:index -- --json
node cli/specforge.mjs skill add --target all --scope user --apply
node cli/specforge.mjs skill add --target trae-cn --scope project --project-dir /path/to/project --apply
node cli/specforge.mjs init --dir /path/to/project
```

## 技能分类导航

新入口统一使用 `sf` 前缀，并根据其在工作生命周期中的地位分为三大类：

### 1. 核心技能 (每个工作项的生命周期必经之路)

| Skill | 用途 |
|---|---|
| `sf-intake` | 接单并初始化工作项 (生成 `work.yaml` 与 brief) |
| `sf-requirements` | 生成需求规格书 (requirements) |
| `sf-implement` | 按已批准的 tasks 拆分逐步编写代码实现 |
| `sf-verify` | 通过单元测试/集成测试或 E2E 收集验证证据 |
| `sf-close` | 进行 release/rollback，归档工作项并清理分支 |

### 2. 辅助技能 (按阶段或业务特性按需触发)

| Skill | 用途 |
|---|---|
| `sf-prd` | 当 brief 决策需要时，进行 Socratic 访谈并生成 PRD |
| `sf-discovery` | 需求前置调研，解决未知不确定性 |
| `sf-ui-design` | 设计 UI 交互原型、页面流，并生成 ui-design 证据 |
| `sf-tech-design` | 生成 technical-design，进行架构、数据模型、API 等详细技术设计 |
| `sf-tasking` | 将复杂的设计或需求拆解为具体的 tasks 任务清单 |
| `sf-spec-review` | 在实现前对设计规格做严格把关 (执行 spec_review gate) |
| `sf-code-review` | 在实现后对代码成果做严格审查 (执行 code_review gate) |
| `sf-wiki` | 手动或关闭前自动将重要事实回写沉淀至项目 wiki 库 |

### 3. 系统维护技能 (维护与诊断)

| Skill | 用途 |
|---|---|
| `sf-router` | 根路由，自动判断当前状态和指引下一步行为 |
| `sf-work` | 工作项自动管理与生命周期推进工具 |
| `sf-doctor` | 对项目 `.specforge` 配置与状态进行全面健康诊断 |
| `sf-onboard` | 针对新项目或已有项目初始化接入配置 |
| `sf-steering` | 用于对未知的大型/存量代码库进行首次基线画像扫描 |

更多维护者说明在本目录及 `docs/adapters/`、`docs/agents/` 中维护。
