# 测试与质量保障 (Vitest + Playwright)

## 适用 / 不适用

适用：

- React、Vue、Vite、Next.js 等 TypeScript 前端或全栈项目。
- 需要覆盖组件交互、业务纯逻辑、API 边界和真实浏览器 P0 用户流。

不适用：

- 纯后端 Java / Go / Python 项目的单元测试主框架；这些项目应使用各自生态测试工具，但仍可保留 Playwright 做端到端浏览器验收。

## 测试分层矩阵

| 层级 | 工具 | 覆盖对象 | 不覆盖 |
|---|---|---|---|
| 静态检查 | TypeScript / ESLint / framework checker | 类型、未使用变量、危险模式 | 运行时业务正确性 |
| 单元测试 | Vitest | 纯函数、schema、formatter、状态机、hooks/composables | 真实网络、真实数据库 |
| 组件测试 | Vitest + Testing Library / Vue Test Utils | 可见文本、按钮、表单错误、交互状态 | 内部 state 私有实现 |
| 集成测试 | Vitest + MSW / test doubles | API client、缓存失效、错误映射 | 第三方真实服务 |
| E2E | Playwright | P0 用户路径、路由跳转、登录态、跨页面流程 | 所有边角排列组合 |

## Vitest 规范

- 用例遵循 Arrange / Act / Assert。
- 测试名描述行为：`should show validation error when title is empty`。
- 单测禁止真实网络、真实数据库、真实外部服务。
- 时间、随机数、浏览器 API 要可控：`vi.useFakeTimers()`、mock storage、mock location。
- React 组件只断言用户可见结果，不读私有 state；Vue 组件优先断言渲染和事件，不断言实现细节。

## Playwright 规范

- 每个测试使用隔离上下文，不依赖前一个测试留下的数据。
- 定位器优先级：`getByRole`、`getByLabel`、`getByText`、`getByTestId`。禁止用脆弱 XPath 和样式类名当主定位器。
- 使用 web-first assertions，例如 `await expect(locator).toBeVisible()`；禁止 `waitForTimeout` 作为稳定性手段。
- E2E 数据必须有 fixture / factory / seed 策略，避免手工依赖线上脏数据。
- CI 失败必须保留 trace；复杂 UI 或新关键路径建议开启 screenshot / video 产物。

## P0 E2E 选择标准

必须覆盖：

- 新用户首次完成主目标。
- 核心创建 / 编辑 / 删除 / 发布流程。
- 登录或权限保护流程。
- 不可逆操作的二次确认。
- 一个主要错误或空状态。

可以延后：

- 纯展示性样式微调。
- 低频设置项组合。
- 已由单元测试充分覆盖的纯计算分支。

## CI 门禁

最低门禁：

```text
typecheck -> lint -> unit/component -> build -> selected e2e
```

发布前门禁：

- 所有 P0 E2E 通过。
- Playwright trace 可下载。
- 构建产物通过 smoke preview。
- 新增测试失败时能定位到明确 artifact。

## Design 必填问题

- 本次 work item 的 P0 用户路径是什么？
- 哪些逻辑用单测覆盖，哪些交互用组件测试覆盖，哪些流程用 E2E 覆盖？
- 测试数据怎么创建和清理？
- 是否需要登录态、权限、上传、第三方回调或时间控制？

## Spec Review 检查项

- 没有只写“跑测试”而没有测试层级。
- P0 路径有至少一个 Playwright 验证计划。
- 不依赖真实外部服务完成单元测试。
- 没有 `waitForTimeout` 稳定性方案。
- CI 失败证据可归档到 verification。
