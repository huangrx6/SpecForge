# 体验设计标准

本标准回答：有 UI 变化时，怎样确认风格、页面、流程、状态和原型证据；无 UI 变化时如何写 N/A。

## UI 影响判断

有以下任一情况，必须产出 `ui-design.md`：

- 新增或修改页面、弹窗、表单、列表、后台操作台、导航。
- 用户流程、角色视图、权限展示、错误反馈发生变化。
- 视觉风格、布局密度、组件库或响应式行为需要确认。

纯后端、配置、日志、任务调度、数据迁移且没有用户可见变化时，`ui-design.md` 可写 N/A，并说明验证方式。

## 风格确认

设计前必须确认视觉方向，方式任选其一：

- 沿用现有设计系统或组件库。
- 用户选择风格方向或参考产品。
- Agent 给出 3-5 个候选风格并说明适用场景，由用户选择。
- 低风险内部工具可使用默认假设，但必须写入 style brief。

Style brief 至少包含：产品气质、布局密度、主色或 token、组件库、禁用风格、参考来源。

## 原型工具选择

| 工具 | 使用场景 | 交付要求 |
|---|---|---|
| Pencil | 本地、低成本、需要 AI 可读写原型 | `.pen` 源文件 + 导出 PNG |
| Figma | 已有设计系统、需要设计师协作或高保真标注 | Frame 链接 + 截图备份 |
| HTML mockup | 需要浏览器直接预览、快速可点击原型 | `ui-mockup.html`，不依赖业务构建 |
| ASCII | 1-2 个简单页面或临时布局说明 | 内嵌 `ui-design.md`，复杂 UI 不可单独使用 |

工具补充规则：

- 选择 Pencil 时，可参考 `core/skills/pencil` 的 MCP 操作流程；Pencil 产物必须包含 `.pen` 源文件和可离线查看的 PNG。
- 选择 Figma 时，优先使用 Figma 官方 MCP / OpenAI curated Figma skills：`figma` 负责读上下文和截图，`figma-use` 负责画布写入，`figma-generate-design` 负责生成 screen，`figma-create-design-system-rules` 负责长期规则沉淀。不要把 `figma-extract` 作为默认 Figma 路径。
- 选择 HTML mockup 时，设计阶段只负责原型文件；verification 阶段再用 Playwright 或 DevTools 记录实际浏览器证据。
- 外部 skill 只提供能力或检查清单，不能替代本标准里的页面地图、状态矩阵和 requirements 追踪。

## UI Design 必须包含

- 影响范围：新增、修改、不在范围。
- 页面地图：入口、跳转、返回路径。
- 用户流程：正常路径和异常出口。
- 原型证据：Pencil / Figma / HTML / ASCII 至少一种。
- 交互状态矩阵：默认、空、加载、成功、错误、禁用、边界值、移动端、无障碍。
- 与 requirements 的追踪关系。

## 状态覆盖底线

实现阶段最常漏的是状态。`ui-design.md` 必须明确：

- 表单校验错误显示在哪。
- 网络失败是否可重试。
- 权限不足时按钮隐藏还是禁用。
- 列表为空时展示什么。
- 长文本、超多数据、上传失败、重复提交如何处理。

如果某状态沿用组件库默认，也要写“沿用默认”，不能留空。

## 阻断项

- 有 UI 变化但没有风格确认。
- 有复杂流程但没有页面地图和状态矩阵。
- 原型只覆盖 happy path。
- 设计功能超出 requirements。
- UI 证据无法被 reviewer 查看。
