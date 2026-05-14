# Pencil UI Design Guide

Pencil 适合没有团队 Figma 资产、但希望 Agent 在本地生成和修改中保真原型的场景。`.pen` 文件作为源文件入库，导出截图作为 reviewer 不安装 Pencil 时也能查看的证据。

## 适用场景

- 需要本地、可入库、低成本的 UI 原型。
- 需要 AI 在 IDE / Agent 流程中直接创建或修改设计。
- 页面状态较多，需要一页页沉淀默认态、错误态、加载态和权限态。
- 没有 Figma 账号、团队设计系统或高保真标注要求。

## 文件组织

```text
01-spec/
├── ui-design.md
├── ui-mockup.pen
└── ui-mockup-export/
    ├── 01-flow-overview.png
    ├── 02-page-default.png
    ├── 03-page-loading.png
    └── 04-page-error.png
```

`.pen` 文件不要用普通文本工具读写；通过 Pencil MCP 工具读取和修改。

## 工作流

1. 在 `ui-design.md` 中确认 style brief、页面地图和状态矩阵。
2. 创建或打开 `01-spec/ui-mockup.pen`。
3. 使用 Pencil MCP 读取当前文档状态，避免覆盖用户已有画布。
4. 复杂页面先写 PENCIL_PLAN：页面、组件、变量、Frame、导出步骤。
5. 分批生成页面和状态；每批控制在可 review 的小范围。
6. 导出每个关键页面 / 状态为 PNG，保存到 `01-spec/ui-mockup-export/`。
7. 在 `ui-design.md` 中引用 `.pen` 源文件和截图。

## Page 命名

```text
Page 1: Flow Overview
Page 2: Job List / Default
Page 3: Job List / Empty
Page 4: Job Form / Validation Error
Page 5: Admin Approval / Pending
```

命名规则：`{页面或组件} / {状态描述}`。

## Prompt 结构

```text
在 01-spec/ui-mockup.pen 中创建本 work item 的 UI 原型。

依据：
- requirements: 01-spec/requirements.md
- ui design draft: 01-spec/ui-design.md
- style brief: 企业后台 / 数据密集，紧凑表格，低装饰

需要页面：
1. Job List / Default
2. Job List / Empty
3. Job Form / Default
4. Job Form / Validation Error
5. Admin Approval / Pending
6. Admin Approval / Approved

导出每个 Page 到 01-spec/ui-mockup-export/，文件名使用 {序号}-{页面}-{状态}.png。
```

## 提交检查

- [ ] `01-spec/ui-mockup.pen` 已存在并作为源文件保存。
- [ ] `01-spec/ui-mockup-export/` 包含关键页面和状态截图。
- [ ] 截图文件名语义化，能看出页面和状态。
- [ ] `ui-design.md` 引用了源文件和截图。
- [ ] 已记录 Pencil MCP 是否可用、PENCIL_PLAN 摘要和自检结论。
