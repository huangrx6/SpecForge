# UI Mockup Protocol

本文件回答“本次 UI design 应该选哪种交付工具”。视觉风格如何确认，见 `visual-style.md`；具体工具操作分别见 `pencil.md`、`figma.md`、`html-mockup.md`、`ascii-mockup.md`。

## 快速选择

```text
有 UI 变化吗？
|
+-- 否 -> ui-design.md 写 N/A，不需要原型
|
+-- 是 -> 先确认视觉风格：
          |
          +-- 已有设计系统 / 品牌规范 -> 沿用并引用
          |
          +-- 没有 -> 给用户 2-4 个风格方向并记录选择
          |
          +-- 再选工具：
              |
              +-- 想在 IDE / 本地由 AI 直接生成和修改设计 -> Pencil
              |
              +-- 已有 Figma 文件、设计系统或设计师协作 -> Figma
              |
              +-- 需要浏览器可点击预览或 Playwright 验证 -> HTML mockup
              |
              +-- 1-2 个简单页面，快速表达布局意图 -> ASCII
```

## 工具对比

| 维度 | Pencil | Figma | HTML mockup | ASCII |
|---|---|---|---|---|
| 文件形态 | `.pen` 本地文件，可入库 | 云端文件 / Frame 链接 | `.html` 静态文件，可入库 | `ui-design.md` 内嵌 |
| MCP 支持 | 本地 MCP，AI 可读写 | Remote / Desktop MCP，AI 可读取设计上下文 | 不依赖 MCP | 不依赖 MCP |
| AI 直接生成设计 | 强 | 取决于 Figma 写入能力和权限 | 强，使用 HTML/CSS 生成 | 弱，文字线稿 |
| 与代码实现衔接 | 通过截图、变量、组件结构衔接 | 可配合 Code Connect | 可用浏览器和 Playwright 验证 | 只表达结构 |
| 离线 / 本地 | 强 | 弱 | 强 | 强 |
| 适合复杂交互 | 中 | 高 | 中 | 低 |
| 适合高保真标注 | 中 | 高 | 中 | 低 |

## 推荐默认

- 默认优先选 **Pencil**：没有团队 Figma 资产时，它更适合作为本地、可入库、Agent 可修改的中保真原型。
- 已有设计团队或 Figma 资产时选 **Figma**：不要重复造设计系统。
- 需要用户马上在浏览器里打开确认时选 **HTML mockup**。
- 需求很小、只需要布局解释时选 **ASCII**。

## 通用证据要求

无论使用哪个工具，最终提交到 work item 的 `01-spec/ui-design.md` 必须满足：

1. 可评审：没有对应设计软件的人也能看懂，Pencil / Figma 需要导出 PNG，HTML 可直接打开，ASCII 直接内嵌。
2. 可追溯：每个页面、流程和状态能追溯到 requirements 或用户澄清。
3. 可验证：关键状态有独立截图、Frame、页面区域或明确文字线稿，不能一张图覆盖所有状态。
4. 文件名语义化：截图使用 `{序号}-{页面名}-{状态}.png`，例如 `03-job-form-error.png`。
5. 用户确认：记录用户选择的风格方向、工具路径和未决问题；若采用默认假设，写明原因。

## 标准目录

```text
01-spec/
├── ui-design.md
├── ui-mockup.html              # HTML 路径时
├── ui-mockup.pen               # Pencil 路径时
└── ui-mockup-export/           # Pencil / Figma 导出截图
    ├── 01-flow-overview.png
    ├── 02-dashboard-default.png
    ├── 03-job-form-error.png
    └── 04-admin-approval-empty.png
```

## SpecForge 流程位置

| 阶段 | UI 行动 |
|---|---|
| `sf-intake` / `sf-discovery` | 记录是否有 UI 影响、已有设计资产、参考产品和用户风格偏好 |
| `sf-ui-design` | 确认视觉风格，选择工具，产出页面地图、流程、状态矩阵和证据 |
| `sf-spec-review` | 审查风格确认、工具证据、状态覆盖和需求追溯，不合格不得批准 |
| `sf-implement` | 以已批准的 UI 证据实现，不在实现阶段重新发明风格 |
| `sf-verify` | 用页面 × 角色 × 状态矩阵做截图、交互和异常态验证 |
