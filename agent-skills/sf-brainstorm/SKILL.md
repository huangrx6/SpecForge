---
name: sf-brainstorm
description: 对模糊产品想法、UI/AI/技术方向或范围取舍做用户参与式头脑风暴；用于进入 PRD、requirements 或 technical_design 前先形成可确认的候选方案、研究证据和决策记录。
---

# sf-brainstorm

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

## 运行模式检测

1. 当前目录向上存在 `.specforge/` 且有 active work item：**Embedded 模式**，按 active work item 读取 brief / PRD / requirements 并写入 `00-intake/brainstorm.md`。
2. 存在 `.specforge/` 但无 active work item：**Lightweight 模式**，只做本阶段对话式 brainstorm；需要落档时输出 `specforge-import-ready.md` 格式内容，或先路由 `sf-intake` 创建 work item。
3. 不存在 `.specforge/`：**Standalone 模式**，不要运行 `.specforge/...` 命令；产出可后续导入的 `specforge-import-ready.md` 格式内容，必须保留用户确认、未决问题和推荐项边界。

`sf-brainstorm` 是用户参与式发散和收敛阶段。它把模糊诉求、产品方向、体验方向、AI 能力边界或技术路线问题整理成可选择的方案，并明确哪些选择已被用户确认。它不替用户拍板，不写最终 requirements，不实现代码。

## 启动

1. 读取 `.specforge/AGENTS.md`。
2. 读取 `.specforge/registry.yaml`，确认是否已有 active work item。
3. 有 active work item 时，读取 `00-intake/original-request.md`、`00-intake/brief.md`、可选 `00-intake/prd.md` 和已有 `00-intake/brainstorm.md`。
4. 无 active work item 时，只做对话式 brainstorm；若用户要落档，先路由到 `sf-intake` 创建 work item。
5. 读取 `.specforge/core/workflows/stages/brainstorm/SKILL.md`。

## 关联标准

- `.specforge/core/standards/workflow.md`：scope、artifact 边界和 gate 纪律。
- `.specforge/core/standards/product.md`：候选池、MVP、PRD 和 requirements 边界。
- 有 UI 方向时读取 `.specforge/core/standards/design.md`。
- 有技术选型或依赖版本问题时读取 `.specforge/core/standards/engineering.md`。

## 何时使用

- 用户说“先 brainstorm / 头脑风暴 / 我还没想清楚 / 你帮我想想”。
- intake 发现产品、页面、全栈应用、AI 能力、多角色流程、审批、权限、数据生命周期等方向尚未确认。
- PRD、requirements、UI design 或 technical_design 中出现会改变方向的 `[NEEDS ... DECISION]`。
- `instructions.mjs` 返回 `ui-direction-unconfirmed`，表示 UI / 视觉 / 体验方向还没有用户确认，必须先让用户取舍。
- `instructions.mjs` 返回 `tech-direction-unconfirmed`，表示新项目 / 空仓库路径的技术栈、数据库、调度器、AI provider、部署或依赖方向还没有用户确认，必须先让用户取舍。
- `instructions.mjs` 返回 `dependency-decision-unconfirmed`，表示本次可能新增 / 替换直接依赖、SDK、插件、组件库、ORM、驱动、测试库或外部 provider，但还没有用户确认。
- `instructions.mjs` 返回 `tooling-decision-unconfirmed`，表示本次可能选择 / 替换包管理器、UI 组件库、样式方案、Python 依赖管理 / 虚拟环境、构建工具、测试 runner、任务运行器或 monorepo 工具，但还没有用户确认。
- 技术选型不是显而易见的项目既有约束，需要和用户确认框架、版本、部署、成本、长期维护取舍。

## 边界

| 阶段 | 负责 | 不负责 |
|---|---|---|
| `sf-intake` | 创建/选择 work item、分类 workflow、写 brief 初稿 | 深入展开方案 |
| `sf-brainstorm` | 发散候选、查证当前事实、让用户做关键取舍 | 写最终规格或自动拍板 |
| `sf-prd` | 把已确认产品方向整理成 PRD | 重新发散所有可能 |
| `sf-requirements` | 把 PRD/brief 转成可测试行为和 AC | 做产品路线选择 |
| `sf-tech-design` | 把已确认技术方向细化为架构设计 | 在未确认情况下自动选型 |

## 动作

1. 列出 `已明确 / 高影响未知 / 可安全默认`。
2. 根据问题类型生成 2-3 个互斥方案或 MVP 组合；每个方案写价值、成本、风险、适用条件和不推荐原因。
3. 需要竞品、政策、模型、框架、SDK、浏览器能力、安全或版本事实时，先查当前可靠来源；技术类优先官方资料，并记录日期。
4. 每轮只问会改变方向的问题；优先用选项和取舍帮助用户确认，不用长问卷。
5. 用户确认后，写入或更新 `00-intake/brainstorm.md`。
   - 如果确认的是 UI / 视觉 / 体验方向，必须写入 `[UI DECISION CONFIRMED]` 或 `UI Direction Status: confirmed`，并记录用户选择、放弃项和影响。
   - 如果确认的是技术栈 / 架构 / 数据库 / 调度器 / AI provider / 部署 / 依赖方向，必须写入 `[TECH DECISION CONFIRMED]` 或 `Tech Direction Status: confirmed`；用户授权默认写 `Tech Direction Status: delegated_default`。
   - 如果确认的是新增 / 替换依赖，必须写入 `[DEPENDENCY DECISION CONFIRMED]` 或 `Dependency Decision Status: confirmed`；用户授权默认写 `Dependency Decision Status: delegated_default`。
   - 如果确认的是工程工具链，必须写入 `[TOOLING DECISION CONFIRMED]` 或 `Tooling Decision Status: confirmed`；用户授权默认写 `Tooling Decision Status: delegated_default`；沿用现有栈写 `Tooling Decision Status: existing_stack`。
6. 同步更新 `00-intake/brief.md` 中的澄清记录、功能候选池、用户选择、外部研究摘要和 PRD 决策。
7. 输出下一步路由：`sf-prd`、`sf-requirements`、`sf-ui-design`、`sf-tech-design`、`sf-discovery` 或暂停等待用户确认。

## 停止条件

- 没有 active work item，且用户要求落档但尚未创建 work item。
- 用户尚未确认 MVP、核心方案、关键技术路线或不能安全默认的边界。
- 需要当前事实支撑的判断尚未完成研究。
- 方案之间成本、风险或用户价值差异未说明清楚。

## 完成标准

- `00-intake/brainstorm.md` 记录了问题框架、候选方案、研究证据、用户确认和未决问题。
- `brief.md` 已同步更新，不会让后续阶段误把 Agent 建议当成用户确认。
- 下一步路由明确，且所有阻断问题都用 `[NEEDS ... DECISION]` 标记。

## 不做

- 不直接写最终 requirements。
- 不直接实现代码。
- 不在用户未确认时把推荐方案写成已批准。
