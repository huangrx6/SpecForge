# Locator Contract

稳定 locator 体现产品可测试性和可访问性。

优先级：

1. role + accessible name
2. label
3. text（稳定业务文案）
4. testid
5. CSS selector（只作最后 fallback）

如果只能用脆弱 selector，写入 test engineering finding：

- 缺少可访问名称或 testid。
- 影响 Playwright 稳定性。
- 建议补充位置和命名。
