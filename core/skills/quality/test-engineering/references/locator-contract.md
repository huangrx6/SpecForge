# Locator Contract

稳定 locator 体现产品可测试性和可访问性。

优先级：

1. role + accessible name
2. label
3. text（稳定业务文案）
4. testid
5. CSS selector（只作最后 fallback）

Playwright flow 中每个关键操作后必须有可见断言。不要用固定 timeout 伪等待；优先使用 web-first assertion。

如果只能用脆弱 selector，写入 test engineering finding：

- 缺少可访问名称或 testid。
- 影响 Playwright 稳定性。
- 建议补充位置和命名。

建议命名：

- 业务按钮优先有可访问名称，如 `getByRole("button", { name: "提交审批" })`。
- 表单字段优先 label，如 `getByLabel("客户名称")`。
- 动态列表行可结合稳定文本和 role。
- 只有当业务文案不稳定或不可见时使用 `data-testid`。

禁止把 deep CSS、随机 class、nth-child 当主 locator。确实无法避免时，必须降低证据信心或记录 implementation 修复建议。
