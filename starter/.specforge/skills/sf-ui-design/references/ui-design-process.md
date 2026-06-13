# UI 设计流程与原型证据

本文件只保存 UI 访谈、第三方 skill/reference 编排、Pencil 保存门禁、视觉 review 和质量标准。Design Mode 路由见 `design-mode-routing.md`；管理端组件契约见 `admin-product-ui-contracts.md`；PC 业务系统规范见 `pc-business-system-spec.md`。

## UI 设计访谈

UI design 不是一上来画图。先判断哪些问题会改变页面结构、信息密度、角色路径、视觉气质、状态矩阵或可访问性。

流程：

1. 列出 `已确认事实 / 高影响未知 / 可安全默认`。
2. 高影响未知优先问；低风险默认写入假设，不阻塞。
3. 没有现成设计系统或确认方向时，给 2-3 个互斥体验方向，每个方向写适合点、风险、推荐理由和放弃代价。
4. 用户确认体验方向后，立即写 `[UI DECISION CONFIRMED]` 或 `UI Direction Status: confirmed`，并记录确认来源。
5. 每轮只问会改变 UI 的关键问题或一小组强相关问题；问题数量不设硬上限，但要分轮收敛，并解释为什么这些问题会改变 UI design。

常用镜头：

| 镜头 | 触发信号 | 会改变什么 |
|---|---|---|
| User / Role | 多角色、管理员、审批、运营后台 | 页面入口、权限视图、空态和错误态 |
| Workflow | 长流程、导入导出、审批、异步任务 | 步骤拆分、进度反馈、异常恢复 |
| Density | 内部工具、数据表、监控、配置台 | 信息密度、表格、筛选、导航 |
| Tone | 品牌、客户展示、公众页面 | 色彩、字体、空间、动效 |
| Data Display | 报表、统计、对比、状态看板 | 图表、表格、摘要卡、筛选器 |
| Accessibility | 高风险业务、政企、公众服务 | 对比度、键盘路径、焦点、文案 |
| Responsive | 移动端、现场使用、宽屏大屏 | 断点、导航折叠、触控目标 |

## 第三方 Skill 和 Reference 编排

第三方 skill 是提问镜头和候选方案，不是 SpecForge 的事实来源，也不是正式交付格式。先读 `.specforge/core/skills/ORCHESTRATION.md` 和 `registry.json`，再按需读取具体 skill。

| 参考输入 | 什么时候用 | 归一化到 |
|---|---|---|
| `ux-designer` | 用户画像、信息架构、交互流程、微文案、可访问性或视觉层级证据不足 | Personas、IA、流程风险、a11y 约束、体验方向候选 |
| `design-system` | 需要提炼设计语言、foundations、组件契约、页面模式、shadcn-vue 映射、动效边界或去廉价感审查 | Visual Style Brief、token、Admin Component Contract、Pencil variables、实现约束、视觉 review |
| `pencil` | 需要创建、更新、读取、截图或检查 `.pen` | Pencil 原型证据、截图、保存后重读校验 |
| `design-taste-frontend` | landing、portfolio、品牌页、redesign 或公开展示页需要更强视觉判断 | Brand Surface 的气质、版式、动效边界、反模板化检查 |
| `design-mode-routing.md` | 产品同时可能是后台、官网、展示页或混合场景，需要先判断设计方向 | Design Mode、读取顺序、风格和组件边界 |
| shadcn 官方 skill / shadcn registry reference | 管理端实现层采用 shadcn/ui，或需要查组件、registry、theme、update 规则 | `admin-product-ui-contracts.md` 中的 primitive 选择、registry 候选、组件审查点、实现约束 |
| `pc-business-system-spec.md` / `pc-ui-design-spec.md` | PC 端业务系统、运营后台、管理系统、数据表格系统，或用户明确提供该规范 | Visual Style Brief、设计系统来源、组件 token、Pencil 变量、HTML/CSS 实现约束 |
| 用户提供的截图 / Figma / 参考产品 | 已有视觉倾向、品牌或竞品约束 | Visual Style Brief、采用 / 不采用、落地方式 |

融合规则：

- 只读取当前问题需要的 reference，不全量搬运外部 skill。
- 第三方 persona、流程或模板只是候选，必须经过用户确认后才能写成 `[UI DECISION CONFIRMED]`。`design-system` 可以提供推荐方向，但不能替代人工视觉方向确认。
- 外部 skill 的内容要提取成 `体验方向候选 / 用户旅程风险 / 信息架构问题 / 可访问性约束 / 视觉 review 项`，不要原样复制模板标题。
- 会影响方向的内容放入 `高影响未知`；只是后续 UI 设计细节的内容放入 `可安全默认` 或 `sf-ui-design` 输入。
- 用户已经明确确认 PC 端业务系统规范时，不再让 Agent 自行选择视觉风格；必须把该规范作为 design-system reference，并让具体数值覆盖通用 `design.md` 的默认 UI 基准。
- 如果只是把已确认 UI 方向落成页面地图、状态矩阵和 Pencil 原型，不要再在 brainstorm 中写完整 UI design。
- 涉及当前产品、竞品、法规、版本或安全事实时，第三方 skill 不能背书，必须另行查证或标为假设。

## Pencil 保存与重读门禁

Pencil 原型不是“调用过工具”就算完成，必须确认目标 `.pen` 已持久化且可重读。这个门禁解决 `.pen` 文件仍为空、后续读取不到设计的问题。

硬规则：

1. 目标文件固定为 `01-spec/ui-mockup.pen`，除非用户明确指定其他路径。
2. 每次完成 `pencil_batch_design` 后，必须执行 Pencil 的保存 / 持久化动作；如果 MCP 没有单独 `save` 工具，则以带 `filePath` 的写入结果为基础，但仍必须立刻重读验证。
3. 保存后先重读，再导出截图。不要先截图再假设文件已保存。
4. 重读验证优先使用 `pencil_open_document(filePath: "01-spec/ui-mockup.pen")`，再用 `pencil_get_editor_state` 或 `pencil_batch_get(filePath: "01-spec/ui-mockup.pen", readDepth: 1/2, searchDepth: 2)` 检查根节点和第一屏。
5. 验证标准：至少存在一个 screen / frame / artboard 或第一屏节点；节点不是空画布；关键页面名称或主容器可检索。
6. 重读通过后，才调用 `pencil_get_screenshot` 和 `pencil_snapshot_layout(problemsOnly: true)`。
7. 重读失败、文件仍为空、第一屏不存在或截图无法生成时，视为未保存，必须再尝试一次写入并重读。
8. 连续 2 次仍失败时停止，写入阻断原因、尝试过的动作和下一步需要的人工处理。

在 `ui-design.md#9. Pencil 原型证据` 记录：

- `.pen` 文件路径。
- Pencil 保存状态：`saved / blocked / N/A`。
- 保存后重读校验：`pass / fail / N/A`。
- 重读证据：节点 id、页面名称、`batch_get` 摘要或截图路径。
- 空画布处理：`N/A / 已创建第一屏 / 阻断`。

## Pencil 创建要点

- 空 `.pen` / 空画布最多读取一次，确认空后立即创建第一屏。
- 创建前读取 `pencil_get_variables` 和可复用组件；已有组件或变量时优先复用。
- 分 section 创建和验证，避免整屏生成后才发现溢出。
- 每个关键页面至少覆盖 default、loading、empty、error、permission / disabled、success、responsive、a11y 中适用状态。
- 导出截图放入 `01-spec/ui-mockup-export/`，截图文件名应能看出页面和状态。
- Pencil 只是正式原型通道，不替代 `ui-design.md` 的设计决策记录。

## 视觉质量 Review

有截图后必须 review 并至少修一轮。检查项：

- 信息层级：用户第一眼能看到主任务和关键状态。
- 间距与对齐：导航、表格、表单、卡片、按钮有稳定网格。
- 信息密度：内部工具避免营销页式大区块；公众页面避免信息堆叠。
- 色彩与 token：状态色一致，对比度满足基础要求。
- 组件一致性：同类操作同样样式，危险操作有区别。
- 状态反馈：加载、空态、错误、成功、禁用、权限不足可见。
- 响应式：移动端不横向溢出，触控目标足够。
- 可访问性：焦点、键盘路径、语义、对比度和文案基础通过。

发现问题先修 Pencil，再把 review 发现和修正结果写入 `ui-design.md#12`。不要把“实现时优化 UI”当通过条件。

## 质量标准

- UI 方向必须可追溯到用户确认、现有设计系统或明确低风险默认。
- 每个页面 / 组件都能追溯到 requirements、PRD 或明确非目标。
- Visual Style Brief 要具体到密度、色彩、排版、组件形态、动效和不采用项。
- 状态矩阵必须覆盖异常、权限、空态、加载和响应式中的适用项。
- Pencil `.pen` 必须保存后可重读；截图必须来自保存后的目标文件。
- 第三方参考必须被转译，不把外部模板原样当 SpecForge artifact。
