# Automation Matrix

Deprecated compatibility note: new work should use `core/skills/quality/test-engineering/SKILL.md` plus the test-engineering patterns and output contract. This matrix remains as a legacy quick reference.

测试设计完成后，用本矩阵选择最小充分的自动化层级。

| 风险 / 对象 | 首选验证 | 补充验证 | 不足说明 |
|---|---|---|---|
| 纯函数、formatter、policy | unit | property / snapshot | 不能证明集成和权限 |
| API 输入输出 | contract / integration | unit schema | 不能证明真实 UI 流程 |
| 数据库、迁移、事务 | integration / migration dry-run | unit repository | mock 不能证明真实约束 |
| 权限、角色、数据范围 | integration + Playwright | unit policy | 只测前端按钮隐藏不够 |
| 页面表单、上传、提交、审批、下载 | Playwright | component test | 手工点击不能替代回归证据 |
| 错误提示、路由、响应式 | Playwright screenshot / trace | visual review | 单元测试不能证明真实 DOM |
| 外部系统、消息、Webhook | contract / sandbox / mocked + manual-confirmed | logs | 需要说明无法 proven 的边界 |
| 启动、配置、发布、回滚 | startup / smoke / runbook | static check | 只通过编译不证明运行可用 |

## 命令记录

每个自动化用例至少登记：

- command：真实运行命令。
- environment：本地 / CI / sandbox / test env。
- evidence：stdout、截图、trace、日志或报告路径。
- related cases：TC / PW ID。
- strength：proven / mocked / manual-confirmed / deferred / missing。
