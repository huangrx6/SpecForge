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
node .specforge/execution/tools/instructions.mjs
```

确认 ready artifact 包含 `ui_design`，再：

```bash
node .specforge/execution/tools/create-artifact.mjs ui_design
```

## 内部技能母本

写 UI design 前，读取：

```text
.specforge/execution/stages/ui-design/SKILL.md
```

## 关联规则

- `.specforge/policy/rules/product-discovery/README.md`：页面和产品流程必须追溯到已确认需求。
- `.specforge/policy/rules/experience-design/README.md`：页面地图、视觉风格、线稿 / 原型和交互状态。
- `.specforge/policy/rules/experience-design/references/visual-style.md`：如何询问用户想要什么风格、如何把参考产品转成 style brief。
- `.specforge/policy/rules/experience-design/references/ui-mockup-protocol.md`：Pencil / Figma / HTML / ASCII 产物选择。
- `.specforge/policy/rules/experience-design/references/pencil.md`：Pencil `.pen` 和截图交付规范。
- `.specforge/policy/rules/experience-design/references/figma.md`：Figma MCP、Frame、截图和 Code Connect 规范。
- `.specforge/policy/rules/experience-design/references/html-mockup.md`：浏览器可预览静态原型规范。
- `.specforge/policy/rules/experience-design/references/ascii-mockup.md`：轻量 ASCII 线稿规范。
- `.specforge/policy/rules/boundaries/README.md`：UI 范围和非目标。
- `.specforge/policy/rules/testing/README.md`：UI 验证矩阵。

## 执行要点

1. 先判断是否有 UI 影响；没有时写 N/A 和验证方式。
2. 有 UI 影响时，先确认视觉风格，再选择原型工具。没有现成设计系统时，向用户给出 2-4 个风格方向或让用户提供参考产品。
3. 写页面地图、角色流程、状态矩阵和原型证据。
4. 复杂 UI 优先 Pencil 或 Figma；需要浏览器确认时用 HTML mockup；简单页面可用 ASCII。

## 完成标准

- `01-spec/ui-design.md` 存在。
- 有 UI 影响时，包含 style brief、用户确认或默认假设。
- 有 UI 影响时，至少提供 Figma Frame + 截图、Pencil `.pen` + 截图、`ui-mockup.html` 或 ASCII 线稿中的一种可验收证据；复杂 UI 不能只用 ASCII。
- 无 UI 影响时，明确写出 N/A、理由和验证方式。
- 下一步路由到 `sf-tech-design` 或 `sf-tasking`，以 `instructions.mjs` 为准。

## 不做

- 不写业务代码。
- 不把前后端架构、API、数据迁移写进 UI design。
- 不在 implementation 阶段重新发明视觉风格。
