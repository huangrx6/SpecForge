# UI 设计产出协议 (UI Design Artifact Protocol)

## 一、选择发生在 Design 阶段

Onboard 只负责建立 `.specforge/` 骨架，不决定设计工具。凡是涉及用户可见页面的 change，必须在 design 阶段选择一种可验收 UI 产物，并把证据链接写入 `design.md`：

| 产出通道 | 优先使用场景 | 必交证据 |
|---|---|---|
| Figma MCP | 已有团队设计稿、设计系统、组件库映射或需要高保真还原 | 具体 Frame URL、关键 Token / 组件约束 |
| Pencil MCP | 本地免费、Agent 可直接生成线框或低/中保真原型 | `01-spec/ui-wireframe.pen` 和导出截图 |
| HTML mockup | 无设计工具，或需要浏览器 / Playwright 直接验证 | `01-spec/ui-mockup.html` |

Spec Review Gate 只关心是否有可评审、可追踪、可验证的 UI 产物，不强制某一种工具。

---

## 二、Figma MCP（已有设计资产时优先）

Figma 提供官方 MCP Server + Skills 体系，Agent 可以读取设计文件中的组件结构、约束、Token 变量和 Auto Layout，并转化为生产级代码。它适合有设计师、设计系统或组件映射的项目。

### 接入前提
- Figma 桌面客户端已安装并保持运行。
- 具备 Dev Mode 权限（Professional / Organization / Enterprise 计划，或 Dev Seat）。
- Claude Code 已安装：`npm install -g @anthropic-ai/claude-code`。

### 接入步骤（需要使用 Figma 时执行）
```bash
# 1. 安装 Figma 官方插件（含 MCP 配置和 Skills）
claude plugin install figma@claude-plugins-official

# 2. 重启 Claude Code，输入 /plugin 进入已安装列表，
#    选择 Figma，按提示在浏览器完成鉴权。

# 3. 打开 Figma 桌面 App → 打开设计文件 → 开启 Dev Mode → 在右侧栏启动 MCP Server
#    本地地址通常是 http://127.0.0.1:3845/mcp
```

### 核心 Skill 用法

| Skill | 作用 | 典型调用 |
|---|---|---|
| `figma-implement-design` | 将选中的 Frame 转为生产代码 | "Implement this design: [Figma Frame URL]，使用项目现有组件库" |
| `figma-create-design-system-rules` | 提取设计系统规则 | design 阶段或已有设计系统时执行，固化项目设计规范 |
| `figma-use` | 在 Figma 画布上创建或修改内容 | "根据 requirements.md 在 Figma 中创建登录页线框图" |

### 最佳实践
1. **先设计，再实现**：Spec Review Gate 批准前，确保 Figma 中对应的设计稿已存在且打通了 Code Connect。
2. **Link 到具体 Frame**：传给 Agent 时，复制单个 Frame 或 Component 的链接（不要传整个文件链接），避免上下文过载。
3. **Design Token 驱动**：在 Figma 中维护好颜色/间距/字体的 Variables（Token），Agent 会将其映射到 Tailwind 变量或 CSS Custom Properties。
4. **Code Connect 前置**：将设计组件和代码组件在 Figma Dev Mode 中映射好，Agent 生成代码时会优先复用项目已有组件，不会重新发明。

---

## 三、Pencil MCP（本地免费原型与交互设计）

Pencil 适合没有 Figma 授权、但仍希望 Agent 生成可视化线框、中保真原型或设计系统草案的场景。它不是简单画布工具：可配合 Pencil MCP、PENCIL_PLAN、设计系统初始化和截图校验，形成完整的本地设计闭环。`.pen` 文件内容只能通过 Pencil MCP 读取和修改，不要用普通文本工具读写。

### 产物约定

- 原型源文件：`01-spec/ui-wireframe.pen`
- 评审截图：`01-spec/ui-wireframe.png` 或 `01-spec/ui-screens/*.png`
- `design.md` 必须链接 `.pen` 文件和截图，并说明页面范围、交互状态和用户已确认的视觉方向。
- 若使用第三方 Pencil skill 包，必须在 `design.md` 记录 skill 名称、来源和执行摘要；不要把第三方 skill 安装写成 SpecForge onboard 的默认步骤。

### 能力层次

| 层次 | 用途 | 适用方式 |
|---|---|---|
| Pencil MCP 原子工具 | 直接创建 / 读取 / 更新 `.pen` 节点，设置变量，导出截图 | 已有 Pencil MCP 工具时直接执行 |
| PENCIL_PLAN | 把需求转成 `open_document`、`set_variables`、`batch_design`、`get_screenshot` 等有序步骤 | 复杂设计前先生成动作级计划 |
| Design System Skills | 初始化 Ant Design、Bootstrap、Element Plus、Vant、uView、ECharts 等设计系统组件和变量 | 项目明确选择某个 UI / 图表库时使用 |
| Interactive Design Orchestrator | 自动发现项目设计系统、结合 issue / requirements 上下文、生成高保真 `.pen` mockup | UI 复杂、需要多轮交互或高保真原型时使用 |

### 使用原则

1. 先根据 requirements 生成页面地图、关键用户流程和状态矩阵。
2. 选择 Pencil 执行方式：简单页面可直接用 MCP；复杂页面先输出 PENCIL_PLAN；已有 UI 库时先初始化对应设计系统。
3. 写入前先读取当前编辑器状态和设计变量，避免覆盖用户已有画布。
4. 批量设计操作保持小步提交；单次 `batch_design` 控制在约 25 个操作以内。
5. 每完成一个主要页面或状态，都导出截图自检，重点检查布局、溢出、对齐、状态和可读性。
6. 导出截图作为 spec review 证据，避免 reviewer 必须打开编辑器才能判断。
7. 实现阶段以截图、页面矩阵和 `design.md` 为准；不要把 `.pen` 当作代码生成的唯一来源。

---

## 四、HTML Mockup（浏览器可验证兜底）

当项目没有 Figma / Pencil 可用，或需要一个可被浏览器和 Playwright 直接验证的 UI 参照时，采用 HTML mockup。

Agent 在 `spec_review` 前必须在 `01-spec/ui-mockup.html` 输出一个可在浏览器中直接打开的静态原型，使用 Tailwind CDN 并包含真实 HTML 结构，让用户在视觉上确认方向。

在 `design.md` 中必须包含：
- Mermaid 页面流程图（枚举所有路由的跳转逻辑）
- 组件交互状态矩阵（loading/empty/error/success/权限不足）

---

## 五、在 SpecForge 流程中的位置

| 阶段 | UI 设计行动 |
|---|---|
| `sf-discovery` / `sf-intake` | 记录用户是否已有 Figma / Pencil / 截图 / 参考产品；不要强制安装工具 |
| `sf-design` (design 阶段) | 选择 Figma、Pencil 或 HTML mockup，产出可评审证据并写入 `design.md` |
| `spec_review` Gate | 必须有至少一种 UI 产物和用户确认记录，否则 Gate 不可通过 |
| `sf-implement` (implementation 阶段) | 根据已批准 UI 产物实现；Figma 可用时调用 `figma-implement-design` |
| `sf-verify` (verification 阶段) | Playwright 按页面矩阵逐页截图和交互验证，检查实现与 UI 产物一致 |
