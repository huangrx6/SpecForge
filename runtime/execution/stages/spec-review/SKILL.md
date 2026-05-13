---
name: spec-review
description: SpecForge 内部规格审查技能。用于 01-spec 完成后审查 requirements、design、tasks 是否足以进入 implementation。
---

# Spec Review Skill

本技能审查 requirements、design 和 tasks 是否足以进入 implementation。审查不是润色文档，而是判断实现是否已经有安全边界和可验证计划。

## 读取

- `00-intake/brief.md`
- `01-spec/requirements.md`
- `01-spec/design.md`
- `01-spec/tasks.md`
- `.specforge/policy/rules/analysis-workflow/README.md`
- `.specforge/policy/rules/review/README.md`
- `.specforge/policy/rules/spec-quality/README.md`
- `.specforge/policy/tech-profiles/README.md`
- 产品 / 页面 / 全栈应用读取 `.specforge/policy/rules/product-discovery/README.md` 和 `.specforge/policy/rules/experience-design/README.md`
- `.specforge/policy/rules/gates/README.md`

## 写入

- `02-spec-review/spec-review-v1.md`
- 通过 `node .specforge/execution/tools/gate.mjs spec_review <status> --evidence 02-spec-review/spec-review-v1.md` 更新门禁

## 审查重点

- requirements 是否可测试。
- 分析深度是否匹配复杂度；代码库探索、外部研究 / 跳过理由、澄清记录和分析综合是否足够。
- 产品 / 功能候选是否已展开，MVP 组合是否有用户确认或明确默认假设。
- design 是否覆盖需求、边界、风险和验证策略。
- 用户可见页面是否有页面地图、用户流程、线稿 / 原型、视觉方向和交互状态。
- 技术栈、组件库、编辑器、数据层和测试方案是否引用 profile 或写清偏离理由；涉及持久化时是否选择了数据库 profile。
- tasks 是否可执行、可排序、可验证。
- API、数据、权限、配置、发布影响是否写清。
- 是否存在范围膨胀、未决方案或隐藏风险。

## 状态规则

| 状态 | 使用条件 |
|---|---|
| `APPROVED` | 可以仅凭当前 spec 进入实现 |
| `REQUEST_CHANGES` | 有可修复缺口，修完可重审 |
| `REJECTED` | 方向或范围错误，需要回到 intake / requirements |

## 阻断规则

以下情况不得批准：

- 产品 / 页面 / 全栈应用没有功能候选池和用户选择记录。
- `standard` / `deep` 没有代码库探索证据；`deep` 没有外部研究证据或合理跳过理由。
- 计划、设计或任务不能追溯到用户澄清、代码探索或外部研究结论。
- 用户可见页面没有体验设计证据。
- 管理后台、HTML 渲染、外部发布、数据迁移或权限相关风险只被默认处理，没有确认和验证策略。
- 关键技术栈或组件选择没有 profile、备选方案或取舍理由。
- 设计包含数据库、缓存、搜索或文件存储，但没有数据库 / 存储 profile 选择、偏离说明或迁移验证计划。

## 输出要求

- findings 按严重程度排序。
- 每条 finding 指向具体文件或章节。
- 阻断项必须说明为什么阻断实现。
- 批准时也要写清残余风险。

## 完成标准

- gate 证据文件存在。
- gate 状态和证据路径一致。
- 未批准时明确下一步应回哪个 artifact。
