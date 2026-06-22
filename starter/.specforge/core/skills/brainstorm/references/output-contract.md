# Brainstorm Output Contract

本文件定义 `brainstorm.md` 的输出合同。它不是自由讨论记录，而是后续 PRD、requirements、UI design、technical design 和 research 的输入包。

## Always Output

所有 profile 都必须输出：

- `一页摘要`
- `执行配置`
- `问题重构`
- `问题地图`
- `用户确认记录`
- `未决问题`
- `下一步行动`
- `下一步路由`

`light` profile 可以把案例、类比、场景模拟写为 `N/A + 具体理由`，但不能删除 section。

## Conditional Output

| 条件 | 必须输出 |
|---|---|
| 有外部事实、版本、价格、法规、AI provider、依赖、竞品声明 | `当前事实与研究证据` |
| 用户给案例 / 截图 / 网址，或体验方向影响推荐 | `优秀案例与机制拆解` |
| 需要多个方案 | `发散方向池`、`方案评估矩阵`、`方案选项` |
| 候选同质化或用户要求更高级 | `类比迁移`、`反模板化提醒` |
| 方案会进入实现 / 工作流 / UI | `场景模拟`、`批判质疑` |
| 需要下游交接 | `下一步行动` 写 owner、输入、输出、阻断条件 |

## Brainstorm Scan Manifest

在 `执行配置` 中记录：

| 项 | 内容 |
|---|---|
| Brainstorm profile | clarify-light / product-discovery / experience-exploration / technical-decision / research-heavy |
| Case study depth | none / quick / standard / deep |
| Discussion depth | single-decision / guided-options / workshop |
| Package skills used | 实际读取的 brainstorm 子 skill |
| External references used | 外部 skill / URL / 截图 / source family |
| Sections marked N/A | section + 具体理由 |

## Cross-stage Handoff

| 下游阶段 | 消费内容 |
|---|---|
| `sf-prd` | 问题地图、MVP 选择、产品机会、明确不做、成功标准 |
| `sf-requirements` | 用户确认记录、验收问题、边界、未决问题 |
| `sf-ui-design` | 优秀案例与机制拆解、体验路线、UI 方向确认、反模板化提醒 |
| `sf-tech-design` | 技术路线确认、依赖 / 工具链状态、版本事实、风险和回退点 |
| `sf-discovery` research | 未查证项、冲突来源、需要 PoC / benchmark 的问题 |

## Stop Conditions

- 缺 profile 或 profile 与执行内容不一致。
- 有案例诉求但缺案例池或机制路线。
- 有事实诉求但缺 URL / 来源 / 日期 / 置信度。
- 方案选项不能互斥，或没有放弃代价。
- 用户确认、授权默认、Agent 推荐、pending 混在一起。
- 未决问题仍阻断下一阶段，却输出下一步可继续。

## Summary Standard

一页摘要不超过 8 行，必须回答：

- 这次 brainstorm 要解决什么。
- 当前最优方向是什么。
- 为什么不是其他方向。
- 用户已经确认什么。
- 还卡在哪里。
- 下一步交给哪个阶段。
