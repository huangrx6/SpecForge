---
name: ui-design
description: SpecForge 内部 UI 设计技能。用于根据 requirements 生成或确认视觉风格、页面地图、用户流程、交互状态和 Pencil / Figma / HTML / ASCII 原型证据。
---

# UI Design Skill

本技能只处理用户可见体验，不处理后端架构、API、数据库或部署方案。若本 work item 不涉及 UI，写一个明确的 N/A 结论，说明为什么跳过以及后续如何验证“无 UI 影响”。

## 读取

- `00-intake/brief.md`
- `01-spec/requirements.md`
- `.specforge/policy/rules/product-discovery/README.md`
- `.specforge/policy/rules/experience-design/README.md`
- `.specforge/policy/rules/experience-design/references/visual-style.md`
- `.specforge/policy/rules/experience-design/references/ui-mockup-protocol.md`
- `.specforge/policy/rules/experience-design/references/pencil.md`
- `.specforge/policy/rules/experience-design/references/figma.md`
- `.specforge/policy/rules/experience-design/references/html-mockup.md`
- `.specforge/policy/rules/experience-design/references/ascii-mockup.md`
- `.specforge/policy/rules/boundaries/README.md`
- `.specforge/policy/rules/testing/README.md`
- 现有页面、设计系统、Figma / Pencil / 截图 / 参考产品（如 brief 或用户提供）

## 写入

- `01-spec/ui-design.md`
- 可选 UI 证据：
  - `01-spec/ui-mockup.pen`
  - `01-spec/ui-mockup-export/*.png`
  - `01-spec/ui-mockup.html`

## 设计流程

1. **判断 UI 影响。** 检查页面、组件、路由、视觉状态、角色视图、响应式、可访问性和用户操作流。
2. **无 UI 影响时写 N/A。** 说明影响面、跳过理由、验证方式；不要继续生成风格或原型。
3. **确认视觉风格。**
   - 若项目已有设计系统、品牌手册、Figma 文件或组件库规范，引用它并写明沿用范围。
   - 若没有现成约束，必须先向用户提出 2-4 个风格方向，或让用户提供参考产品 / 截图 / getdesign.md 风格对象。
   - 若用户暂不确认，且 UI 风险低，可以写默认假设，但必须记录可逆性和待确认点。
4. **建立页面地图、用户流程和页面 × 状态矩阵。** 角色视图分开写，不能只写 happy path。
5. **选择 UI 产物通道。**
   - Pencil：本地、可入库、Agent 可直接生成或修改中保真原型。
   - Figma：已有团队设计稿、设计系统、设计师协作或需要高保真还原。
   - HTML mockup：需要浏览器直接预览、Playwright 验证或无设计工具可用。
   - ASCII：1-2 个简单页面的轻量线稿；复杂 UI 不能只用 ASCII 作为最终证据。
6. **产出并链接证据。**
   - Pencil 使用 `01-spec/ui-mockup.pen` 和 `01-spec/ui-mockup-export/*.png`。
   - Figma 使用文件 / Frame URL，并导出关键截图到 `01-spec/ui-mockup-export/`。
   - HTML 使用 `01-spec/ui-mockup.html`。
   - ASCII 直接嵌入 `ui-design.md`。
7. **写 UI 验证策略。** 覆盖截图、页面流程、角色权限、响应式、异常态和无障碍。

## 风格澄清最低标准

有 UI 影响且没有现成设计系统时，`ui-design.md` 必须记录：

- 用户选择或默认采用的风格方向。
- 参考来源（产品、截图、Figma、Pencil、getdesign.md 风格对象等）。
- 信息密度、色彩气质、组件形态、排版倾向、动效范围。
- 不采用的方向，尤其是会干扰业务效率的视觉套路。

## 停止条件

- 用户可见体验的关键风格、页面范围或角色流程尚未确认，且默认假设风险高。
- 有 UI 变更但没有任何可验收 UI 产物或明确降级理由。
- 原型与 requirements 的角色、流程、审批、权限或异常态不一致。
- 需要 Figma / Pencil 工具但当前不可用，且没有 HTML / ASCII 降级方案。

## 完成标准

- `ui-design.md` 能让 reviewer 判断 UI 是否满足需求。
- 有 UI 变更时，存在 style brief、工具选择记录和至少一种可验收 UI 证据。
- 状态矩阵覆盖 loading、empty、error、permission、success、disabled、边界值和响应式适用性。
- 实现者能据此实现页面结构和交互状态。
- `technical-design.md` 可只引用本文件的 UI 结论，不重复写视觉和交互细节。
