# sf-brainstorm 外部 Skill 参考

本文件回答：`sf-brainstorm` 什么时候参考哪个第三方 skill、读到什么深度、如何归一化为 SpecForge artifact。第三方 skill 是方法卡，不是事实来源，也不是用户确认。

## 读取原则

1. 先读 `sf-brainstorm/SKILL.md` 和 `.specforge/skills/sf-brainstorm/constraints/stages/brainstorm/SKILL.md`，再决定是否读取第三方 skill。
2. 默认最多选择 1 个主辅助 skill；确实跨产品取舍 + UX + 外部研究时，最多 2 个，并在 `brainstorm.md#第三方 Skill 使用记录` 写明原因。
3. 先读目标 skill 的 `SKILL.md`；只有问题落到具体子领域时，才读 `references/` 或 `rules/` 下的相关文件。
4. 第三方输出先转成 `问题地图 / 方案对比 / 用户确认记录 / 后续阶段输入`，不能原样复制模板标题、persona 或结论。
5. 涉及当前事实、版本、法规、价格、竞品、安全或漏洞时，必须另行查可靠来源；第三方 skill 不提供事实背书。

## 选择表

| 触发问题 | 优先参考 | 按需读取的 reference | 提取为 | 归一化到 |
|---|---|---|---|---|
| 产品目标、MVP、功能候选、机会树、假设压力测试或优先级不清楚 | `opportunity-solution-tree` | `SKILL.md`；按需读 `references/brainstorm-ideas-new.md`、`references/brainstorm-ideas-existing.md`、`references/analyze-feature-requests.md`、`references/prioritize-features.md`、`references/prioritization-frameworks.md` | 用户机会、候选方向、关键假设、实验、取舍问题、优先级线索 | `brainstorm.md#问题地图`、`#方案对比`、`brief.md#功能候选池` |
| 体验方向、目标用户、用户旅程、信息架构、交互风格、可访问性不清楚 | `ux-designer` | 先读 `SKILL.md`；再按需读 `rules/research.md`、`rules/information-architecture.md`、`rules/interaction-design.md`、`rules/accessibility.md`、`rules/visual-design.md` | 体验方向候选、用户旅程风险、信息架构问题、可访问性约束 | `brainstorm.md#问题地图`、`#方案对比`、`#第三方 Skill 使用记录`、后续 `ui-design.md` 输入 |
| 官网、landing、portfolio、品牌页或 redesign 的视觉方向容易模板化 | `design-taste-frontend` | `SKILL.md`；只在需要时读取其 references | Brand Surface 的视觉气质、版式候选、动效边界、反模板化风险 | `brainstorm.md#UI / 体验方向确认`、后续 `ui-design.md#Visual Style Brief` |
| 管理端采用 shadcn/ui，但需要判断组件封装、registry 候选或避免基础组件拼装 | shadcn 官方 skill / shadcn registry reference | 官方 shadcn skill、`npx shadcn@latest docs/search/view` 输出；按需参考 `shadcn-component-discovery` / `shadcn-component-review` | primitive 选择、registry 候选、Admin Component Contract、组件审查点 | `brainstorm.md#技术路线确认`、`#UI / 体验方向确认`、后续 `ui-design.md` 和 `technical_design.md` 输入 |
| 需要多来源研究、共识/争议拆解、研究空白 | `deep-research` | `SKILL.md` | 研究问题、来源类型、共识、争议、待验证事实 | `research.md` 或 `brainstorm.md#当前事实与研究证据` |
| 用户故事、验收口径、边界条件会影响方案取舍 | `user-stories` | `SKILL.md` | 用户故事候选、验收问题、边界/异常问题 | `brainstorm.md#问题地图`、后续 `requirements.md` 输入 |
| PRD 信息已经足够，需要判断是否进入 PRD 合成 | `create-prd` | `SKILL.md` | PRD handoff 检查、非目标、目标用户、价值主张、release 分期覆盖缺口 | `prd.md` 输入，不直接写 brainstorm 结论 |
| 验证路径、浏览器流程、角色操作是否可证明 | `playwright-skill` | `SKILL.md`；需要脚本细节时读 `API_REFERENCE.md` | E2E 验证问题、用户路径、证据要求 | 后续 `test-cases.md` / `verification-report.md` 输入 |

## 记录格式

在 `brainstorm.md#第三方 Skill 使用记录` 中记录：

| Skill | 读取内容 | 提取结果 | 归一化到 | 不能替代的确认 |
|---|---|---|---|---|
| opportunity-solution-tree / ux-designer / deep-research / user-stories / create-prd / playwright-skill | `SKILL.md` / specific reference path | 简短列出 2-5 条 | 问题地图 / 方案对比 / research / UI design 输入 / requirements 输入 / verification 输入 | 用户确认 MVP / UI 方向 / 技术路线 / 依赖 / 工具链 / 验收口径 |

## 禁止事项

- 不因为读了第三方 skill 就跳过 Socratic 单问。
- 不把第三方 persona、PRD、故事、审查清单或测试建议写成用户已确认。
- 不在 brainstorm 中写完整 PRD、requirements、UI design、technical design 或 verification report。
- 不把第三方 skill 的外部投递动作带入 SpecForge，例如创建 issue、发布页面、上传外部系统。
