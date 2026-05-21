---
name: ui-design
description: SpecForge 内部 UI 设计技能。用于根据 requirements 生成或确认视觉风格、页面地图、用户流程、交互状态和固定 Pencil 原型证据。
---

# UI Design Skill

本技能只处理用户可见体验，不处理后端架构、API、数据库或部署方案。SpecForge 的默认且唯一 UI 原型通道是 **Pencil**：有 UI 影响时，必须产出 `01-spec/ui-mockup.pen` 和导出截图；Figma、HTML、ASCII、设计类第三方 skill 只能作为参考输入，不能作为本阶段的正式交付通道。

若本 work item 不涉及 UI，写一个明确的 N/A 结论，说明为什么跳过以及后续如何验证“无 UI 影响”。

## 读取

- `00-intake/brief.md`
- `00-intake/prd.md`（存在时）
- `01-spec/requirements.md`
- `.specforge/core/standards/product.md`
- `.specforge/core/standards/design.md`
- `.specforge/core/standards/workflow.md`
- 现有页面、组件库、设计系统、Pencil 文件、截图、参考产品或用户提供的设计资料
- 需要操作 Pencil 时读取 `core/skills/pencil/SKILL.md`
- 做视觉质量审查时读取项目设计系统或 `core/skills/web-design-guidelines`（如果存在）

## 写入

- `01-spec/ui-design.md`
- `01-spec/ui-mockup.pen`
- `01-spec/ui-mockup-export/*.png`

## 设计原则

- **先讨论，再画图。** 没有视觉方向、页面范围和关键流程确认时，不创建随意原型。
- **用户确认优先于 Agent 品味。** Agent 可以推荐方向，但在用户确认、现有设计系统或明确低风险默认之前，不能把推荐当成批准方案。
- **Pencil 是唯一正式原型证据。** 参考 Figma、截图、HTML 或竞品时，必须把设计语言转译到 `ui-design.md` 和 Pencil 原型。
- **不要给用户丢 5 种工具。** 工具不让用户选，体验方向让用户选。
- **设计要像真实产品。** 后台和工具类界面优先信息密度、扫描效率、稳定布局和状态反馈；不要用营销页式大卡片、空泛 hero、默认控件堆叠来糊弄 UI 设计。
- **实现阶段不得重新发明视觉风格。** `ui-design.md` 和 Pencil 截图是后续实现与验证的依据。

## 设计流程

1. **判断 UI 影响。**
   - 检查页面、组件、路由、视觉状态、角色视图、响应式、可访问性和用户操作流。
   - 无 UI 影响时写 N/A、跳过理由和验证方式；不要继续生成风格或原型。
2. **做 UI 设计访谈。**
   - 先列 `已确认 / 高影响未知 / 可安全默认`。
   - 没有现成设计系统时，给用户 2-3 个互斥体验方向，写清适合点、风险和推荐项；复杂项目可以扩展到 5 个方向，但不要机械凑数。
   - 一轮只问会改变 UI 的关键问题，例如信息密度、主流程、角色差异、表单复杂度、错误反馈、数据展示方式。
   - 用户未确认前，不调用 Pencil，不创建完整页面方案，不写“我将使用某某风格”作为既定事实。
   - 用户确认后，在上游 artifact 留下可检索标记：`[UI DECISION CONFIRMED]` 或 `UI Direction Status: confirmed`，并记录用户选择、放弃项和影响。
   - 用户暂不确认且 UI 风险低时，可以只写默认假设和待确认点；默认假设必须可逆，不能推进到 Pencil 原型。
3. **提取参考设计语言。**
   - 若有现有设计系统、品牌手册、页面、Pencil、Figma、截图或参考产品，提取可执行规则：布局、导航、密度、色彩、字体、表格、表单、反馈、空态和错误态。
   - 不要只贴链接；每个参考都要写“采用什么、不采用什么、如何落地”。
4. **建立体验规格。**
   - 页面地图、入口出口、角色流程、主路径、异常路径。
   - 页面 × 状态矩阵：default、loading、empty、error、permission、disabled、success、boundary、responsive、a11y。
   - 明确不做项，防止实现阶段扩大 UI 范围。
5. **创建或更新 Pencil 原型。**
   - 读取 `core/skills/pencil/SKILL.md`。
   - 输出 `01-spec/ui-mockup.pen`。
   - 导出关键页面截图到 `01-spec/ui-mockup-export/`。
   - 空 `.pen` / 空画布最多读取一次。确认为空后必须立即创建第一屏，不能陷入空读循环。
   - Pencil 创建连续失败 2 次时，停止并写阻断原因；不要降级成 HTML / ASCII 作为正式 UI 证据。
6. **执行视觉质量自检并修一轮。**
   - 必须基于截图检查信息层级、间距、对齐、密度、颜色、组件一致性、状态反馈、响应式和可访问性基础。
   - 发现问题先修 Pencil，再把 review 发现和修正结果写入 `ui-design.md`。
   - “实现时再优化 UI”不是通过条件。
7. **写 UI 验证策略。**
   - 明确 Playwright 后续要覆盖的页面、操作、角色、状态、截图和失败路径。

## 停止条件

- `instructions.mjs` 返回 `ui-direction-unconfirmed`，或上游没有用户确认的 UI / 视觉 / 体验方向。
- 用户可见体验的关键风格、页面范围或角色流程尚未确认，且默认假设风险高。
- 有 UI 变更但没有 Pencil `.pen`、导出截图或明确 Pencil 阻断原因。
- Pencil 原型只是默认控件堆叠，没有参考设计语言、状态矩阵或视觉质量自检。
- 原型与 requirements 的角色、流程、审批、权限或异常态不一致。
- 设计需要改变产品范围或技术能力，但没有回到 PRD / requirements / technical design。

## 完成标准

- `ui-design.md` 能让 reviewer 判断 UI 是否满足需求。
- 有 UI 变更时，存在 Visual Style Brief、页面地图、流程、状态矩阵、Pencil `.pen`、导出截图和视觉质量修正记录。
- 无 UI 影响时，N/A 理由和验证方式清楚。
- 实现者能据此实现页面结构和交互状态。
- `technical-design.md` 只引用本文件的 UI 结论，不重复维护视觉和交互细节。
