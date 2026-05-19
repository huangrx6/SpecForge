---
name: ui-design
description: SpecForge 内部 UI 设计技能。用于根据 requirements 生成或确认视觉风格、页面地图、用户流程、交互状态和 Pencil / Figma / HTML / ASCII 原型证据。
---

# UI Design Skill

本技能只处理用户可见体验，不处理后端架构、API、数据库或部署方案。若本 work item 不涉及 UI，写一个明确的 N/A 结论，说明为什么跳过以及后续如何验证“无 UI 影响”。

## 读取

- `00-intake/brief.md`
- `01-spec/requirements.md`
- `.specforge/core/standards/product.md`
- `.specforge/core/standards/design.md`
- `.specforge/core/skills/README.md`
- `.specforge/core/skills/registry.json`
- `.specforge/core/standards/workflow.md`
- `.specforge/core/standards/engineering.md`
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
   - 若没有现成约束，必须先向用户提出 **5 个**风格方向，或让用户提供参考产品 / 截图 / getdesign.md 风格对象。
   - 若需要灵感，可以参考 `core/skills/frontend-design` 或 `core/skills/getdesign`，但必须把结果转译成 SpecForge 的 `Visual Style Brief`，不能直接粘贴第三方 skill 输出。
   - 若用户暂不确认，且 UI 风险低，可以写默认假设，但必须记录可逆性和待确认点。
4. **建立页面地图、用户流程和页面 × 状态矩阵。** 角色视图分开写，不能只写 happy path。
5. **选择 UI 产物通道。**
   - Pencil：本地、可入库、Agent 可直接生成或修改中保真原型。
   - Figma：已有团队设计稿、设计系统、设计师协作或需要高保真还原。
   - HTML mockup：需要浏览器直接预览、Playwright 验证或无设计工具可用。
   - ASCII：1-2 个简单页面的轻量线稿；复杂 UI 不能只用 ASCII 作为最终证据。
   - Design.md fallback：当 Figma / Pencil 不可用、但项目需要稳定视觉语言时，可用 `core/skills/design-md` 的结构生成 DESIGN.md 或 wiki 设计系统；它不替代原型证据。
6. **按通道加载外部 skill。**
   - Pencil：读取 `core/skills/pencil/SKILL.md`，只把 MCP 操作计划、布局检查和截图结果归一到 `ui-design.md`；不要用普通文件读取 `.pen`。
     - 空 `.pen` / 空画布最多读取一次。确认为空后必须立即 `batch_design` 创建第一屏，不能继续 `batch_get` 或 `find_empty_space_on_canvas`。
     - 若 Pencil 创建连续失败 2 次，降级为 `ui-mockup.html`，并在 `ui-design.md` 写明降级原因和剩余风险。
   - Figma：优先 Figma 官方 MCP / OpenAI curated Figma skills；不要默认接入 `nexu-io/open-design` 的 `figma-extract`。
     - 读设计上下文 / 截图 / 变量：`core/skills/figma`
     - 写 Figma 画布：先读 `core/skills/figma-use`
     - 生成完整 screen：配合 `core/skills/figma-generate-design`
     - 设计系统规则沉淀：`core/skills/figma-create-design-system-rules`
   - HTML：需要浏览器预览时，后续 verification 可使用 `playwright-skill` 或 DevTools，但 UI design 阶段只记录预览路径和预期状态。
7. **产出并链接证据。**
   - Pencil 使用 `01-spec/ui-mockup.pen` 和 `01-spec/ui-mockup-export/*.png`，并在 `ui-design.md` 写明使用的 MCP 操作摘要、空画布处理结果和截图自检。
   - Figma 使用文件 / Frame URL，并导出关键截图到 `01-spec/ui-mockup-export/`。
   - HTML 使用 `01-spec/ui-mockup.html`。
   - ASCII 直接嵌入 `ui-design.md`。
8. **写 UI 验证策略。** 覆盖截图、页面流程、角色权限、响应式、异常态和无障碍。

## 风格澄清最低标准

有 UI 影响且没有现成设计系统时，`ui-design.md` 必须记录：

- 给用户的 5 个候选方向，以及用户选择或默认采用的风格方向。
- 参考来源（产品、截图、Figma、Pencil、getdesign.md 风格对象等）。
- 信息密度、色彩气质、组件形态、排版倾向、动效范围。
- 不采用的方向，尤其是会干扰业务效率的视觉套路。

## 停止条件

- 用户可见体验的关键风格、页面范围或角色流程尚未确认，且默认假设风险高。
- 有 UI 变更但没有任何可验收 UI 产物或明确降级理由。
- 原型与 requirements 的角色、流程、审批、权限或异常态不一致。
- 需要 Figma / Pencil 工具但当前不可用，且没有 HTML / ASCII 降级方案。
- Pencil MCP 出现重复读取空画布、没有进入 `batch_design` 创建步骤；此时必须中断 Pencil 通道并改用 HTML mockup 或重新开始一次明确的 Pencil 创建任务。

## 完成标准

- `ui-design.md` 能让 reviewer 判断 UI 是否满足需求。
- 有 UI 变更时，存在 style brief、工具选择记录和至少一种可验收 UI 证据。
- 状态矩阵覆盖 loading、empty、error、permission、success、disabled、边界值和响应式适用性。
- 如果执行 UI review 或 verification，优先参考 `core/skills/web-design-guidelines`，并把发现归一为 SpecForge review / verification 记录。
- 实现者能据此实现页面结构和交互状态。
- `technical-design.md` 可只引用本文件的 UI 结论，不重复写视觉和交互细节。
