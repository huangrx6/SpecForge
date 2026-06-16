---
name: pencil
description: SpecForge Pencil 原型操作 skill；当 UI design 已确认且需要创建、读取、修改或验证 `.pen` 文件、同步 Pencil variables、复用 reusable components、导出截图、执行 snapshot_layout 或记录原型证据时必须使用。本 skill 只负责 Pencil 工具工作流和产物约束，不负责审美、token、间距、断点、Tailwind/shadcn 映射或 Product UI 设计决策。
---

# SpecForge Pencil Skill

本 skill 是 SpecForge 的 Pencil 执行层。它把已确认的 `ui-design.md`、Design Contract JSON、组件契约和视觉 QA 要求落成 `.pen` 文件、变量、组件实例、截图和验证证据。

设计判断归 `core/skills/ui-ux/design-system`；Pencil 只处理文件、画布、变量、组件复用、截图、布局快照、导出和保存验证。

## 边界

| Pencil 负责 | 不负责 |
| --- | --- |
| 打开、创建、修改、保存 `.pen` 文件 | 重新选择审美方向、色彩、字体、间距、圆角或动效体系 |
| 调用 Pencil MCP / CLI 工具 | 规定 Tailwind、shadcn-vue、React 或前端工程映射 |
| 读取 / 设置 Pencil variables | 发明 Design Contract 之外的新 token |
| 查找并复用 `reusable: true` 组件、`ref` 实例、`descendants` 和 `slot` | 从零重画已有按钮、输入框、表格、导航等组件 |
| 复制已有图片、logo、图标和品牌资产 | 生成重复 logo 或复制外部商业素材 |
| 使用 `snapshot_layout`、`get_screenshot`、`export_nodes` 提供证据 | 只凭节点树判断视觉质量 |
| 输出 Pencil 原型证据和阻塞原因 | 绕过 `sf-tech-design` 或 `sf-implement` 直接决定代码实现 |

如果没有确认的 `ui-design.md`、Design Contract JSON 或用户授权默认，停止并回到 `sf-ui-design`。

## 读取顺序

1. 读 `01-spec/ui-design.md#Design Contract Summary` 和 Design Contract JSON。
2. 读 `01-spec/ui-design.md#Wireframe / Prototype Evidence`，确认本轮 Pencil 产物目标。
3. 如涉及复用组件，读 `01-spec/design/components/*.contract.md`。
4. 按任务选择本 skill 参考文件：

| 场景 | 必读文件 |
| --- | --- |
| 接收 Design Contract | `references/specforge-design-contract-handoff.md` |
| 同步 Pencil variables | `references/pencil-token-system.md` |
| 复用组件 / slots / descendants | `references/design-system-components.md` |
| 复用 logo / 图片 / 图标 | `references/asset-reuse.md` |
| 防止溢出 / 重叠 / 截断 | `references/layout-and-text-overflow.md` |
| 截图、快照、导出证据 | `references/visual-verification.md` |
| 最终质量门禁 | `references/pencil-quality-gate.md` |
| 从 Pencil 交接到实现 | `references/design-to-code-workflow.md` |

不要读取已删除的 Tailwind / shadcn 映射、断点或 token scale 文件；这些内容属于 design-system、technical design 或 implementation。

## 官方工具名

优先使用 Pencil 官方 MCP / CLI 名称。不同宿主可能加前缀，但文档和记录里写 canonical tool name：

| 用途 | 工具 |
| --- | --- |
| 创建、更新、替换、移动、复制、删除节点 | `batch_design` |
| 搜索、读取节点和组件层级 | `batch_get` |
| 读取变量 | `get_variables` |
| 设置变量 | `set_variables` |
| 读取文件、选择和画布上下文 | `get_editor_state` |
| 获取带计算 bounds 的布局结构 | `snapshot_layout` |
| 渲染截图 | `get_screenshot` |
| 导出节点或画板 | `export_nodes` |
| 获取 Pencil 内置指南 | `get_guidelines` |

不要写未确认的全局属性搜索 / 替换工具名。如果宿主只暴露带前缀的工具名，先用 `/mcp` 或 MCP schema 确认，再在证据中注明实际调用名。

## 工作流

1. **Contract intake**：确认 Pencil 只消费已确认 Design Contract；缺字段时记录阻塞，不在 Pencil 内补设计规则。
2. **Editor state**：用 `get_editor_state` / `batch_get` 确认目标 `.pen`、画板、选择、现有 reusable components 和资产。
3. **Variable sync**：用 `get_variables` / `set_variables` 把 Design Contract 的可执行值同步为 Pencil variables，并使用 `$variable` 绑定到节点属性。
4. **Component reuse**：优先使用 `reusable: true` 组件，通过 `type: "ref"` 创建实例；用 `descendants`、子路径或 `slot` 替换内容。
5. **Canvas build**：用 `batch_design` 分区修改，不一次性糊完整屏；每一批操作都保持节点命名清楚。
6. **Layout snapshot**：用 `snapshot_layout` 检查 bounds、溢出、重叠、越界和文本截断。
7. **Screenshot evidence**：用 `get_screenshot` 对目标画板、关键 section 或修改区域截图。
8. **Persistence check**：保存后重读 `.pen`，确认文件非空、目标画板存在、变量和节点修改存在。
9. **Export / handoff**：按需要用 `export_nodes` 导出截图，并写回 Pencil evidence。

## 产物

| 内容 | 写入位置 |
| --- | --- |
| Pencil 原型 | `01-spec/ui-mockup.pen` |
| 导出截图 | `01-spec/ui-mockup-export/` |
| Pencil 工具调用和证据 | `01-spec/ui-design.md#Wireframe / Prototype Evidence` |
| Pencil 不可执行原因 | `01-spec/ui-design.md#UI Artifact Decision` |
| 布局 / 截图 / 保存验证 | `01-spec/ui-design.md#Wireframe / Prototype Evidence` |
| 实现交接备注 | `02-implementation/implementation-plan.md#Frontend Notes` 或 technical design |

## 阻断条件

- Design Contract JSON 不可解析，且没有用户授权默认。
- `.pen` 保存后无法重读，或目标画板不存在。
- 需要复用组件但没有先检查 reusable components。
- 需要 logo / 品牌资产但没有先检查现有资产。
- `snapshot_layout` 有未处理的重叠、越界、文本截断或空白画板问题。
- 只输出 `.pen`，没有截图、layout snapshot 或保存证据。
- 在 Pencil 中重写样式、断点、Tailwind/shadcn 映射或 Product UI 设计规则。

## 完成标准

- `.pen` 已保存并重读成功。
- Pencil variables 与 Design Contract 来源对应，不能解释的新增变量已记录为阻塞或待确认。
- 复用了现有 reusable components / assets；新增组件时写明原因并设置复用语义。
- 每个目标画板至少有一张截图证据。
- `snapshot_layout` 没有未处理的溢出、重叠、越界或文本截断。
- `Wireframe / Prototype Evidence` 能让后续阶段看到工具调用、截图路径、layout 结果、保存结果和剩余风险。
