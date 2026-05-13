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
- 需要技术选型时读取相关 `.specforge/policy/tech-profiles/`
- 涉及接口时读取 `.specforge/policy/rules/api-design/README.md`
- 涉及发布或配置时读取 `.specforge/policy/rules/delivery/README.md`

## 写入

- `01-spec/design.md`

## 设计流程

1. 建立需求追踪表，确保每个关键需求有设计回应。
2. 建立分析上下文包，显式引用 intake 的探索、研究、澄清和默认假设。
3. 对用户可见页面建立页面地图、用户流程、线稿 / 原型、视觉方向和交互状态矩阵。
4. 描述目标架构、责任边界和数据流。
5. 选择技术栈 profile，说明组件库、编辑器、Markdown / 富文本、图表、测试和数据层方案。
6. 识别 API、数据模型、权限、配置、迁移、任务队列、缓存和外部集成影响。
7. 明确写入范围、非目标和不得触碰区域。
8. 给出验证策略和回滚/降级思路。
9. 对高风险方案写备选方案和取舍理由。

## 必含章节

- 设计摘要。
- 技术栈决策和 profile 引用。
- 需求追踪。
- 页面地图、用户流程、线稿 / 原型、视觉方向和交互状态；无 UI 变更时说明不适用。
- 边界承诺。
- 影响模块。
- API / 数据 / 权限 / 配置影响。
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
