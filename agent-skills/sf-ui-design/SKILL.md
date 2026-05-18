---
name: sf-ui-design
description: 生成或更新 SpecForge work item 的 UI design；用于 ready artifact 为 ui_design，或需求涉及页面、交互、视觉风格、Figma/Pencil/HTML/ASCII 原型证据时。
---

# sf-ui-design

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

把 requirements 中的用户可见体验转成可审查的 UI 设计证据。它不写技术架构、不写 API、不写数据库设计。

## 启动

运行：

```bash
node .specforge/core/scripts/instructions.mjs
```

确认 ready artifact 包含 `ui_design`，再：

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
- `.specforge/core/standards/design.md`：视觉风格、页面地图、用户流程、状态矩阵和 Pencil / Figma / HTML / ASCII 证据。
- `.specforge/core/skills/ORCHESTRATION.md`：第三方 UI skill、Figma / Pencil / HTML / ASCII 的编排顺序和写回规则。
- `.specforge/core/skills/README.md`：第三方 UI skill 的触发、用途和归一化要求。
- `.specforge/core/skills/registry.json`：已安装第三方 UI skill 的来源和更新信息。
- `.specforge/core/standards/workflow.md`：UI 范围、非目标和 gate 边界。
- `.specforge/core/standards/engineering.md`：UI 验证矩阵和 evidence 要求。

## 执行要点

1. 先判断是否有 UI 影响；没有时写 N/A 和验证方式。
2. 有 UI 影响时，先确认视觉风格，再选择原型工具。没有现成设计系统时，向用户给出 **5 个**候选方向或让用户提供参考产品。
3. 写页面地图、角色流程、状态矩阵和原型证据。
4. 复杂 UI 优先 Pencil 或 Figma；需要浏览器确认时用 HTML mockup；简单页面可用 ASCII。
5. 第三方 skill 先按 `.specforge/core/skills/ORCHESTRATION.md` 选择和归一化，只作为输入能力，不直接成为 SpecForge 产物：
   - `frontend-design` / `getdesign`：只用于风格候选和 style brief。
   - `pencil`：只在本次选择 Pencil 原型通道时读取，用于 MCP 操作、`.pen` 读写、布局检查和截图导出。
   - `design-md`：只用于 DESIGN.md / wiki 设计系统 fallback，不替代页面流程和状态矩阵。
   - `web-design-guidelines`：只用于 UI review / verification，不用于初始风格生成。
6. Figma 通道优先 Figma 官方 MCP / OpenAI curated Figma skills，不要默认使用 `nexu-io/open-design` 的 `figma-extract`：
   - `figma`：读取 design context、screenshot、变量、资产。
   - `figma-use`：写入或修改 Figma 画布，必须先读后写、小步执行、返回节点 ID。
   - `figma-generate-design`：从描述、现有页面或代码结构生成 Figma screen。
   - `figma-create-design-system-rules`：把稳定设计系统规则沉淀到 wiki / AGENTS / CLAUDE。

## UI 工具选择规则

| 情况 | 首选通道 | 辅助 skill / 能力 | 归一化要求 |
|---|---|---|---|
| 本地、低成本、需要 Agent 直接维护原型 | Pencil | `core/skills/pencil` | `.pen` + 导出 PNG + `ui-design.md` 证据 |
| 已有团队 Figma、设计系统或需要高保真协作 | Figma | `figma` / `figma-use` / `figma-generate-design` | Frame 链接 + 截图备份 + 权限验证 |
| 无设计工具但需要浏览器可预览 | HTML mockup | 浏览器 / Playwright 验证 | `ui-mockup.html` + 截图或预览结果 |
| 1-2 个简单页面快速对齐布局 | ASCII | 无 | 内嵌 `ui-design.md`，复杂 UI 不可单独使用 |

## 完成标准

- `01-spec/ui-design.md` 存在。
- 有 UI 影响时，包含 5 个候选方向、style brief、用户确认或默认假设。
- 有 UI 影响时，至少提供 Figma Frame + 截图、Pencil `.pen` + 截图、`ui-mockup.html` 或 ASCII 线稿中的一种可验收证据；复杂 UI 不能只用 ASCII。
- 无 UI 影响时，明确写出 N/A、理由和验证方式。
- 下一步路由到 `sf-tech-design` 或 `sf-tasking`，以 `instructions.mjs` 为准。

## 不做

- 不写业务代码。
- 不把前后端架构、API、数据迁移写进 UI design。
- 不在 implementation 阶段重新发明视觉风格。
