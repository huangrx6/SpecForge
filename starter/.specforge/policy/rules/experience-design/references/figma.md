# Figma UI Design Guide

Figma 适合已有设计系统、设计师协作、高保真标注或需要 Code Connect 的项目。SpecForge 不在 onboard 阶段强制安装 Figma；只有当前 work item 需要 Figma 时，才在 `ui_design` 阶段接入。

## 适用场景

- 已有 Figma 文件、组件库、变量或设计系统。
- 需要设计师评审、批注或跨团队协作。
- 需要高保真还原、精确间距、字体、Token 和 Auto Layout。
- 需要 Code Connect，让设计组件映射到代码组件。

## MCP 配置

推荐使用 Figma Remote MCP：

```bash
claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp
```

认证后在 Claude Code 中输入 `/mcp`，确认 `figma` connected。也可以使用 Figma Desktop MCP，具体以 Figma 官方文档和团队环境为准。

## 文件组织

为每个 work item 建独立 Section：

```text
Figma 文件
└── Project Design
    ├── Design System
    ├── WI-20260514-001-intent-recognition
    │   ├── _Flow Overview
    │   ├── Job List / Default
    │   ├── Job Form / Default
    │   ├── Job Form / Validation Error
    │   ├── Admin Approval / Pending
    │   └── Admin Approval / Approved
    └── WI-...
```

Frame 命名规则：`{页面或组件} / {状态描述}`。

## 交付证据

即使使用 Figma，也要导出关键截图，避免 review 时依赖账号或网络。

```text
01-spec/
├── ui-design.md
└── ui-mockup-export/
    ├── 01-flow-overview.png
    ├── 02-job-list-default.png
    └── 03-admin-approval-pending.png
```

`ui-design.md` 中必须包含：

- Figma 文件链接。
- Work item Section 名。
- 关键 Frame 链接。
- 导出截图相对路径。
- 链接权限验证结果。

## Code Connect

如果项目已有组件库，优先配置 Code Connect，让 Agent 生成代码时复用真实组件，而不是手写外观相似的 HTML。

```bash
npm install --save-dev @figma/code-connect
npx figma connect init
```

## 提交检查

- [ ] Figma 链接权限可被 reviewer 查看。
- [ ] Section 命名包含 work item id。
- [ ] 关键 Frame 命名符合 `{页面} / {状态}`。
- [ ] `ui-design.md` 包含文件链接、Frame 链接和截图备份。
- [ ] 若使用 Code Connect，记录组件映射状态。
