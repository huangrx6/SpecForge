---
name: sf-ui-design
description: 生成或更新 SpecForge work item 的 UI design；用于 ready artifact 为 ui_design，或需求涉及页面、交互、视觉风格、状态矩阵和 Pencil 原型证据时。
---

# sf-ui-design

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，必须先定位宿主项目根：项目根是“包含 `.specforge/` 目录的业务项目目录”，不是 `.specforge/` 目录本身。若当前目录是 `.specforge/` 或其任意子目录，先 `cd ..` 回到宿主项目根；若当前目录是 `frontend/`、`backend/` 等子目录，也先向上回到包含 `.specforge/` 的项目根。禁止从 `.specforge/` 内执行 `node .specforge/core/scripts/...`，否则会形成 `.specforge/.specforge/...` 的错误路径。

## 运行模式检测

1. 当前目录向上存在 `.specforge/` 且有 active work item：**Embedded 模式**，按 artifact graph 写入 `01-spec/ui-design.md`，并产出 Pencil 证据。
2. 存在 `.specforge/` 但无 active work item：**Lightweight 模式**，可先做 UI 方向访谈、页面地图和状态矩阵草稿；需要落档时输出 `specforge-import-ready.md` 格式内容，或先路由 `sf-intake` 创建 work item。
3. 不存在 `.specforge/`：**Standalone 模式**，不要运行 `.specforge/...` 命令或调用 `.specforge` 下的 Pencil 脚本；输出可导入的 `specforge-import-ready.md`。Standalone 草稿不等同于正式 Pencil 证据。

`sf-ui-design` 把 requirements 中的用户可见体验转成可审查的 UI 设计证据。它不写技术架构、API、数据库设计或实现任务。

SpecForge 固定使用 **Pencil** 做正式 UI 原型。Figma、HTML、ASCII、截图、竞品和第三方设计 skill 只能作为参考输入；最终必须归一为 `01-spec/ui-design.md`、`01-spec/ui-mockup.pen` 和 `01-spec/ui-mockup-export/*.png`。

## 入口读取

本文件只负责运行入口和路由。真正的 UI 设计执行细则由 `.specforge/skills/sf-ui-design/stages/ui-design/SKILL.md` 维护；访谈、第三方参考编排、Pencil 保存重读门禁和视觉 review 由 `references/ui-design-process.md` 维护。

按顺序读取：

1. `references/ui-design-process.md`
2. `.specforge/skills/sf-ui-design/stages/ui-design/SKILL.md`
3. `.specforge/core/artifacts/templates/ui-design.md`
4. `.specforge/core/standards/product.md`、`design.md`、`workflow.md`、`ai-toolkit.md`
5. `.specforge/core/standards/pc-ui-design-spec.md`，仅当 PC 端业务系统规范适用
6. `.specforge/core/skills/ui-ux/design-system/SKILL.md`，仅当需要设计语言、Design Contract、组件契约、页面模式、动效、外部参考或 Visual QA
7. `.specforge/core/skills/ui-ux/pencil/SKILL.md`，仅当需要创建、保存、重读或导出 `.pen`

进入 design-system 后，模式判断只读 `.specforge/core/skills/ui-ux/design-system/references/read-profiles.md#Design Mode Routing`；不要在 `sf-ui-design` 里维护第二份 Product UI / Brand Surface / Hybrid 规则。

## 启动命令

Embedded 模式先运行：

```bash
node .specforge/core/scripts/instructions.mjs
```

如果输出 `Instructions blocked`，按 `Route` 处理阻断；尤其是 `ui-direction-unconfirmed` 时，先输出体验方向确认卡，不创建 Pencil 原型。

确认 ready artifact 包含 `ui_design` 且没有阻断后运行：

```bash
node .specforge/core/scripts/create-artifact.mjs ui_design
```

Standalone 模式不运行 `.specforge/...` 命令，只输出 `specforge-import-ready.md` 草稿；草稿不能冒充正式 Pencil 证据。

## 交付边界

- 有 UI 影响时，输出 `01-spec/ui-design.md`、`01-spec/ui-mockup.pen` 和 `01-spec/ui-mockup-export/*.png`；若 Pencil 受阻，写清阻断原因和后续验证方式。
- 无 UI 影响时，在 `ui-design.md` 写 N/A、跳过理由和验证方式，然后停止。
- Design Contract Summary 必须包含 Markdown 表和符合 `design-contract.schema.json` 的 JSON block；需要设计系统时必须包含 `color_system` 和 `foundation_system`。
- Product UI / 管理端 / shadcn 场景必须写 Admin Component Contract；复杂或复用组件必须写 `01-spec/design/components/<component-name>.contract.md` 或 N/A 理由。
- Pencil 只消费已确认 Design Contract；保存后必须重读并确认 `.pen` 非空，截图必须来自保存后的目标文件。
- 完成后再次运行 `node .specforge/core/scripts/instructions.mjs`，把下一步 route 展示给用户。

## 停止条件

- UI / 视觉 / 体验方向尚未确认，且默认假设风险高。
- 用户可见页面、角色流程、权限、异常态或范围仍不清楚。
- 第三方设计输出没有归一化到 SpecForge artifact。
- Pencil `.pen` 未保存、保存后无法重读、重读后仍为空画布，或截图不是来自保存后的目标文件。
- 原型只同步颜色，没有同步字体、字号、间距、圆角、阴影和动效变量。

## 不做

- 不写业务代码、前后端架构、API、数据迁移或部署设计。
- 不让用户选择 Figma / HTML / ASCII / Pencil 等工具通道；正式原型通道固定为 Pencil。
- 不在 implementation 阶段重新发明视觉风格。
- 不在用户尚未确认 UI / 视觉 / 体验方向时创建 Pencil 原型或填充完整 UI design。
