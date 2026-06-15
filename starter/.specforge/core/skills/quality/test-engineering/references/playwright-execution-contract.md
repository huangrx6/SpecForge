# Playwright Execution Contract

## Locator 规则

- 优先 `getByRole`、`getByLabel`、`getByText`、`getByTestId`。
- 不优先使用深层 CSS selector。
- 没有稳定 locator 时，记录需要 implementation 添加 testid 或可访问名称。
- 不用固定 timeout 伪等待；使用 web-first assertion。
- 每个关键操作后必须有可见断言。

## Evidence

- stdout / command
- screenshot
- trace
- video（按需）
- console summary
- network summary
- HTML report（如可用）

敏感数据必须脱敏。
