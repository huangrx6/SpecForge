# Playwright Journey

Playwright flow 不允许只写“点击登录、提交表单”。

必须写：

- baseURL
- 页面入口
- 登录方式
- 使用角色
- 前置数据
- 关键步骤
- 每一步 locator 策略
- 每一步断言
- 截图点
- trace 策略
- console / network 检查
- cleanup
- 失败时如何判断是产品问题还是测试问题

命令：

```bash
npx playwright test tests/e2e/<flow>.spec.ts --headed
npx playwright test --ui
npx playwright test --trace retain-on-failure
npx playwright show-report
npx playwright show-trace path/to/trace.zip
```
