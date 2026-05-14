# HTML Mockup Guide

HTML mockup 是浏览器可验证的 UI 设计兜底路径，也适合需要快速给用户打开确认的中保真原型。它不是业务代码，必须放在 work item 的 `01-spec/` 目录中。

## 适用场景

- 没有 Pencil / Figma 可用。
- 需要用户直接在浏览器打开查看。
- 需要用 Playwright 截图和点击验证基础交互。
- 需要展示响应式、表单状态、弹窗、表格或多页面导航。

## 文件位置

```text
01-spec/ui-mockup.html
```

不要放进 `frontend/src`、`public` 或业务项目代码目录。

## 编写要求

- 使用单文件 HTML，尽量不依赖本地 `node_modules`。
- 可以使用 Tailwind CDN 或内联 CSS。
- 包含真实文案和接近真实的数据，不使用 Lorem ipsum。
- 所有主要页面 / 状态都要能通过页面内导航、Tabs、按钮或锚点查看。
- 对不可交互的状态写明说明，不伪装成已实现功能。
- 若有响应式要求，至少覆盖桌面和移动宽度。

## 证据要求

`ui-design.md` 中记录：

- HTML 文件路径。
- 可查看的页面 / 状态列表。
- 用户确认记录。
- Playwright 或手工预览结果。

## 提交检查

- [ ] `01-spec/ui-mockup.html` 可直接打开。
- [ ] 页面内包含所有主要页面和状态。
- [ ] 文案、表格、错误、空状态接近真实业务。
- [ ] `ui-design.md` 引用该文件，并说明它不是业务实现。
- [ ] 若使用 Playwright 预览，记录截图路径或验证结论。
