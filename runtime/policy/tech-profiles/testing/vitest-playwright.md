# Vitest + Playwright

## 适用

- TypeScript 前端、全栈或 Node 项目。
- 需要覆盖纯逻辑、API 行为和关键用户路径。

## 默认组合

- Vitest：单元测试和轻量集成测试。
- Playwright：浏览器 E2E、响应式和关键交互。
- 测试数据应可重复创建和清理。

## 设计注意

- 单元测试不替代用户路径验证。
- E2E 应覆盖主成功路径、空状态、错误状态和 destructive 操作。
- 本地数据库或文件状态要隔离，避免测试相互污染。

## 验证

- `npx vitest run`。
- `npx playwright test`。
- 失败时记录失败摘要和剩余风险，不批准 verification。
