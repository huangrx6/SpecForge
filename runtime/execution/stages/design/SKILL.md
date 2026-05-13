---
name: design
description: SpecForge 内部设计技能。用于根据 requirements 生成可实现的设计，明确边界、需求追踪、影响模块、数据/API 变化、风险和验证策略。
---

# Design Skill

本技能把已收敛需求转成可实现、可审查、可验证的技术设计。设计要解释方案边界，而不是只列文件清单。

## 读取

- `01-spec/requirements.md`
- `00-intake/brief.md`
- `.specforge/policy/rules/analysis-workflow/README.md`
- `.specforge/policy/rules/engineering/README.md`
- `.specforge/policy/rules/boundaries/README.md`
- `.specforge/policy/rules/security/README.md`
- 有用户可见页面时读取 `.specforge/policy/rules/experience-design/README.md`
- 有用户可见页面时按 `.specforge/policy/rules/experience-design/references/ui-mockup-protocol.md` 选择 UI 设计产出通道：
  - 已有团队 Figma 设计稿或设计系统：读取 Figma Frame 并把链接、Token、组件约束写入 `design.md`。
  - 需要本地、低成本、Agent 可直接产出的原型：使用 Pencil MCP 生成或更新 `01-spec/ui-wireframe.pen`，复杂页面先形成 PENCIL_PLAN，再导出截图作为评审证据。
  - 无设计工具或需要可直接浏览验证：产出 `01-spec/ui-mockup.html` 静态原型。
- 需要技术选型时先读取 `.specforge/policy/tech-profiles/README.md`，再按受影响维度读取相关 profile
- 涉及接口时读取 `.specforge/policy/rules/api-design/README.md`
- 涉及发布或配置时读取 `.specforge/policy/rules/delivery/README.md`
- 按本次 change 的实际影响读取内部设计子模块：
  - 领域模型、实体或边界上下文：`.specforge/execution/stages/design/domain-design.md`
  - API、SDK、事件或跨系统契约：`.specforge/execution/stages/design/api-design.md`
  - DB、Schema、索引、迁移或数据流：`.specforge/execution/stages/design/data-design.md`
  - 安全、可观测性、部署或可靠性：`.specforge/execution/stages/design/nfr-design.md`

## 写入

- `01-spec/design.md`

## 设计流程

1. 建立需求追踪表，确保每个关键需求有设计回应。
2. 建立分析上下文包，显式引用 intake 的探索、研究、澄清和默认假设。
3. 对用户可见页面建立页面地图、用户流程、线稿 / 原型、视觉方向和交互状态矩阵；选择 Figma、Pencil 或 HTML mockup 作为可验收 UI 产物，并在 `design.md` 链接证据；若选择 Pencil，记录 `.pen` 路径、截图路径、PENCIL_PLAN 摘要和采用的设计系统 skill；无 UI 变更时显式写 N/A 和理由。
4. 描述目标架构、责任边界和核心数据流。
5. 选择技术栈 profile，说明前端、后端、数据库、组件库、编辑器、Markdown / 富文本、图表、测试和运行方案；不适用的维度也要说明跳过理由。
6. 按影响面展开内部设计子模块；只读取并输出本次 change 有实质影响的维度，不为了凑完整而全量铺开。
7. 识别 API、数据模型、权限、配置、迁移、任务队列、缓存和外部集成影响。
8. 明确写入范围、非目标和不得触碰区域。
9. 给出失败模式、验证策略和回滚/降级思路。
10. 对高风险方案写备选方案和取舍理由。

## 必含章节

- 设计摘要。
- 技术栈决策和 profile 引用，包含 `Tech Profile Selection` 表和必要的 `Profile Deviations`。
- 需求追踪。
- 页面地图、用户流程、线稿 / 原型、视觉方向和交互状态；无 UI 变更时说明不适用。
- 边界承诺。
- 影响模块。
- API / 数据 / 权限 / 配置影响。
- 非功能关切：本次 change 涉及到的安全、可观测性、部署或可靠性要求。
- 失败模式和回滚。
- 验证策略。

## 停止条件

- requirements 仍有阻断歧义。
- 设计无法追溯到 intake 分析证据或用户澄清。
- 产品 / UI 关键选择尚未确认。
- 用户可见页面缺少页面地图、视觉方向、交互状态或可验收 UI 产物（Figma Frame、Pencil 原型截图或 `ui-mockup.html`）。
- 设计需要超出已批准边界。
- 外部版本、框架或 SDK 行为不确定且未查询当前资料。
- 技术选型没有引用 `.specforge/policy/tech-profiles/README.md` 和相关 profile，也没有写明偏离理由。
- 数据迁移、权限或生产风险缺少验证路径。

## 完成标准

- 实现者可以按 design 和 tasks 开工。
- reviewer 能判断实现是否偏离设计。
- 关键风险都有处理或明确延后理由。
