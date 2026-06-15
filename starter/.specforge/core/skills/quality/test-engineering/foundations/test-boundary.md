# Test Boundary

Test engineering 是能力包，不是 gate。它为 `sf-verify` 提供可执行测试材料和证据计划。

## 可以做

- 生成测试计划、测试用例、测试代码、Playwright flows、运行 runbook 和证据清单。
- 执行可安全执行的测试命令，并把输出归档。
- 对失败进行归因，指出应回实现、测试数据、环境还是外部依赖。

## 不可以做

- 不批准 verification gate。
- 不伪造测试通过、CI 通过或真实环境通过。
- 不把 mock 当真实端到端。
- 不提交登录态、token、cookies 或本地 storage。
- 不在生产环境执行破坏性操作。
