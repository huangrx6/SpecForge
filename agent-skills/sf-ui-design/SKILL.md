---
name: sf-ui-design
description: 生成或更新 SpecForge work item 的 UI design；用于 ready artifact 为 ui_design，或需求涉及页面、交互、视觉风格、状态矩阵和 Pencil 原型证据时。
---

# sf-ui-design

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

把 requirements 中的用户可见体验转成可审查的 UI 设计证据。它不写技术架构、不写 API、不写数据库设计。

SpecForge 固定使用 **Pencil** 做正式 UI 原型。Figma、HTML、ASCII、截图、竞品和第三方设计 skill 只能作为参考输入；最终必须归一为 `01-spec/ui-design.md`、`01-spec/ui-mockup.pen` 和 `01-spec/ui-mockup-export/*.png`。

## 启动

运行：

```bash
node .specforge/core/scripts/instructions.mjs
```

如果输出是 `Instructions blocked`，必须按 `Route` 处理阻断。尤其当 blocker 为 `ui-direction-unconfirmed` 时，停止 UI design，路由到 `sf-brainstorm`，只向用户确认体验方向；不要运行 `create-artifact.mjs ui_design`，不要调用 Pencil。

确认 ready artifact 包含 `ui_design` 且没有阻断后，再：

```bash
node .specforge/core/scripts/create-artifact.mjs ui_design
```

## 内部技能母本

写 UI design 前，读取：

```text
.specforge/core/workflows/stages/ui-design/SKILL.md
```

## 关联标准

- `.specforge/core/standards/product.md`：页面和流程必须追溯到已确认需求。
- `.specforge/core/standards/design.md`：视觉风格、页面地图、用户流程、状态矩阵和 Pencil 证据。
- `.specforge/core/standards/workflow.md`：UI 范围、非目标和 gate 边界。
- `.specforge/core/standards/engineering.md`：UI 验证矩阵和 evidence 要求。
- `core/skills/pencil/SKILL.md`：Pencil 文件创建、修改、导出和截图自检。

## 执行要点

1. 先判断是否有 UI 影响；没有时写 N/A、理由和验证方式。
2. 有 UI 影响时，先做 UI 设计访谈，再画原型；这一步是硬门槛，不是开场白：
   - 列出 `已确认 / 高影响未知 / 可安全默认`。
   - 没有现成设计系统时，给 2-3 个互斥体验方向，写推荐项和取舍；如果会影响信息架构、核心流程或视觉方向，先路由到 `sf-brainstorm` 等用户确认后再画 Pencil。
   - 每轮只问会改变 UI 的关键问题，避免把用户拖进工具选择。
   - 用户未确认体验方向前，不得自行宣布“我将使用某某风格”并开始设计。推荐项必须标为 Agent recommendation，不能写成用户选择。
   - 用户确认后，在 `00-intake/brainstorm.md`、`00-intake/brief.md`、`00-intake/prd.md` 或 `01-spec/requirements.md` 中留下 `[UI DECISION CONFIRMED]` 或 `UI Direction Status: confirmed`。
3. 用户提供示例设计、截图、规范、Figma 或参考产品时，必须先提取设计语言并写入 Visual Style Brief，再做页面方案。
4. 写页面地图、角色流程、状态矩阵、明确不做项和 UI 验证策略。
5. 使用 Pencil 创建或更新原型：
   - 输出 `01-spec/ui-mockup.pen`。
   - 导出关键截图到 `01-spec/ui-mockup-export/`。
   - 空 `.pen` / 空画布最多读取一次；确认空后立即创建第一屏，禁止空读循环。
   - Pencil 连续创建失败 2 次时停止并记录阻断原因，不把 HTML / ASCII 当正式替代。
6. 有 Pencil 截图后必须做视觉质量 review 并修一轮：
   - 检查信息层级、间距、对齐、密度、色彩、组件一致性、状态反馈、响应式和可访问性。
   - 记录发现、修改动作和最终结论。

## 完成标准

- `01-spec/ui-design.md` 存在。
- 有 UI 影响时，包含 Visual Style Brief、体验方向确认或默认假设、页面地图、流程、状态矩阵。
- UI 方向确认必须可追溯到用户答案、现有设计系统或明确低风险默认；不能只写 Agent 自己的设计偏好。
- 如果体验方向曾经进入 brainstorm，`ui-design.md` 必须引用 `00-intake/brainstorm.md` 的用户确认。
- 有 UI 影响时，存在 `01-spec/ui-mockup.pen` 和 `01-spec/ui-mockup-export/*.png`，或明确 Pencil 阻断原因。
- 有可视原型时，包含视觉质量 review、截图级证据和至少一轮修正记录。
- 无 UI 影响时，明确写出 N/A、理由和验证方式。
- 下一步路由到 `sf-tech-design` 或 `sf-tasking`，以 `instructions.mjs` 为准。

## 不做

- 不写业务代码。
- 不把前后端架构、API、数据迁移写进 UI design。
- 不让用户选择 Figma / HTML / ASCII / Pencil 等工具通道；工具固定为 Pencil。
- 不在 implementation 阶段重新发明视觉风格。
- 不在用户尚未确认 UI / 视觉 / 体验方向时创建 Pencil 原型或填充完整 UI design。
