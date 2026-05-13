---
name: sf-design
description: 生成或更新 SpecForge change 的系统设计文档；用于 active change 处于 01-spec 阶段且 ready artifact 为 design 时。覆盖领域建模、API 契约、数据设计、核心流程，以及安全、可观测性、部署和可靠性等非功能关切。
---

# sf-design

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

把已收敛需求转成可实现、可审查、可验证的技术设计。设计是一个整体：领域、数据、API 和流程必须在同一上下文中对齐，非功能关切以约束形式注入而不是单独生成。

## 启动

运行：

```bash
node .specforge/execution/tools/instructions.mjs
```

确认 ready artifact 包含 `design`，再：

```bash
node .specforge/execution/tools/create-artifact.mjs design
```

## 内部技能母本

写 design 前，读取 `.specforge/execution/stages/design/SKILL.md`（主母本）。按需读取各维度子模块：

| 设计维度 | 子模块 |
|---|---|
| 领域建模、实体与边界上下文 | `.specforge/execution/stages/design/domain-design.md` |
| API 契约、SDK、事件、跨系统接口 | `.specforge/execution/stages/design/api-design.md` |
| DB / Schema / 索引 / 迁移 | `.specforge/execution/stages/design/data-design.md` |
| 安全、可观测性、部署、可靠性 | `.specforge/execution/stages/design/nfr-design.md` |

**只在该维度对本次 change 有实质影响时才读取对应子模块**，不要每次都全量加载。

## 关联规则

- `.specforge/policy/rules/analysis-workflow/README.md`：设计必须追溯到 intake 分析证据。
- `.specforge/policy/rules/engineering/README.md`：沿用项目模式，不发明无依据抽象。
- `.specforge/policy/rules/boundaries/README.md`：明确写入范围和禁止范围。
- `.specforge/policy/rules/api-design/README.md`：API、SDK、事件和跨系统契约；按需读取 `references/`。
- `.specforge/policy/rules/security/README.md`：鉴权、权限和安全敏感检查。
- `.specforge/policy/rules/delivery/README.md`：配置、发布、回滚和运行影响。
- `.specforge/policy/rules/experience-design/README.md`：有用户可见页面时读取。
- `.specforge/policy/rules/testing/README.md`：验证策略。
- `.specforge/policy/tech-profiles/README.md`：技术选型维度、数据库选择矩阵和 profile selection 写法；按需读取具体 profile。
- `.specforge/policy/rules/localization.md`：中文优先。

## 设计流程

1. 建立需求追踪表，确保每个关键需求有设计回应。
2. 建立分析上下文包，显式引用 intake 的探索、研究、澄清和默认假设。
3. 有用户可见页面时建立页面地图、用户流程、线稿 / 原型、视觉方向和交互状态矩阵。
4. 描述目标架构、责任边界和数据流。
5. 选择技术栈 profile；说明前端、后端、数据库、组件库、编辑器、Markdown / 富文本、图表、测试和运行方案。
6. 按需展开各设计维度（见子模块表）：领域建模 → API 契约 → 数据设计 → 非功能关切。
7. 明确写入范围、非目标和不得触碰区域。
8. 给出验证策略和回滚 / 降级思路。
9. 对高风险方案写备选方案和取舍理由。

## 必含章节

- 设计摘要。
- 技术栈决策和 profile 引用，包含 `Tech Profile Selection` 和必要的 `Profile Deviations`。
- 需求追踪。
- 页面地图、用户流程、线稿 / 原型、视觉方向和交互状态；无 UI 变更时说明不适用。
- 边界承诺（允许 / 禁止）。
- 影响模块。
- API / 数据 / 权限 / 配置影响。
- 非功能关切：本次 change 涉及到的安全、可观测性、部署或可靠性要求。
- 失败模式和回滚。
- 验证策略。

## 停止条件

- requirements 仍有阻断歧义。
- 设计无法追溯到 intake 分析证据或用户澄清。
- 产品 / UI 关键选择尚未确认。
- 用户可见页面缺少页面地图、视觉方向或交互状态。
- 设计需要超出已批准边界。
- 外部版本、框架或 SDK 行为不确定且未查询当前资料。
- 数据迁移、权限或生产风险缺少验证路径。

## 完成标准

- 实现者可以按 design 和 tasks 开工。
- reviewer 能判断实现是否偏离设计。
- 关键风险都有处理或明确延后理由。
- 下一步路由到 `sf-tasking`。

## 不做

- 不在 design 阶段写业务代码。
- 不把 8 个设计维度全量生成；只展开本次 change 有实质影响的维度。
