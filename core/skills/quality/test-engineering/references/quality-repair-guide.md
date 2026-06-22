# Quality Repair Guide

本文件对齐 `node .specforge/core/scripts/test-case-quality.mjs` 的实际解析规则。优先修 FAIL，再处理 WARN；不要为了绕过脚本删除真实风险信号。

## 固定标题

`05-verification/test-cases.md` 必须保留这些可解析 section：

- `## 1.1 Test Design Artifacts`
- `## 1.2 Test Engineering Artifacts`
- `## 2. Test Case Matrix`
- `## 3. Playwright Cases`
- `## 3.1 Auth And Runtime`
- `## 3.2 Evidence Manifest`

verification report 中这些 section 会被用于追踪：

- `## 3.1 测试用例索引`
- `### Playwright E2E 用例与执行`

## FAIL 修复

| Issue code | 原因 | 修复 |
| --- | --- | --- |
| `missing-test-cases` / `no-test-cases` | 缺少文件或 `TC-*` 表格不可解析 | 创建 `05-verification/test-cases.md` 并填真实 TC rows |
| `browser-flow-without-playwright` | 存在 UI / 浏览器流程信号但没有 `PW-*` | 补 `## 3. Playwright Cases`，并规划/执行 Playwright |
| `invalid-test-id` | TC ID 不是 `TC-001` 这类格式 | 改为 `TC-###` |
| `incomplete-test-case` | Source、Steps、Assertions、Evidence 或 Automation 为空、TBD、占位或斜杠选项 | 填真实来源、步骤、断言、证据和自动化方式 |
| `invalid-evidence-strength` | evidence target 不在枚举中 | 使用 `claimed` / `observed` / `proven` / `mocked` / `manual-confirmed` / `deferred` / `missing` |
| `invalid-playwright-id` | PW ID 不是 `PW-001` 这类格式 | 改为 `PW-###` |
| `incomplete-playwright-case` | PW steps 或 assertions 为空 / 占位 | 写真实自动化操作和可见断言 |
| `playwright-evidence-not-declared` | PW 没声明截图 / trace / 日志证据路径 | 补 `05-verification/evidence/<run-id>/...` 或计划路径 |
| `xmind-without-export` | XMind 没有 Markdown / JSON 导出 | 导出到 `05-verification/test-engineering/` 并回填 TC/PW |

## WARN 处理

| Issue code | 处理 |
| --- | --- |
| `missing-playwright-flow-plan` | 写 `05-verification/test-engineering/playwright-flows.md`，或在 artifact 表标 `planned / N/A` 并说明 |
| `missing-runtime-runbook` | 写 `runtime-runbook.md`，或说明为什么 runtime check 不适用 |
| `case-not-in-report` | 把 TC ID 写入 verification report 的测试用例索引 |
| `playwright-case-not-in-report` | 把 PW ID 写入 report 的 Playwright E2E 表 |
| `missing-playwright-evidence-path` | 补证据文件，或把路径改成真实存在的 evidence |
| `missing-test-design-export` | 补导出文件，或把状态改成 planned / N/A |
| `deprecated-test-design-path` | 改用 `05-verification/test-engineering/` |
| `incomplete-test-engineering-artifact` | artifact path 和 status 填真实值 |
| `missing-test-engineering-artifact` | 生成文件，或 status 改成 planned / N/A |
| `invalid-auth-strategy` | 使用 `none` / `ui-login` / `api-login` / `storage-state` / `manual` |
| `missing-auth-plan` | 写 `auth-plan.md` 并登记到 Test Engineering Artifacts |
| `incomplete-evidence-manifest` | 填 run id、command、related TC/PW |
| `invalid-evidence-manifest-strength` | 使用 evidence strength 枚举 |
| `missing-evidence-manifest-path` | 补文件或修正路径 |

WARN 不能静默忽略。若不修文件，必须写入 verification report 的风险、owner、impact、revalidation trigger。

## 反模式

| 反模式 | 表现 | 修正 |
| --- | --- | --- |
| Happy path only | 只测正常提交 | 补错误、空态、权限、边界 |
| Login guessed | 测试里猜账号密码或硬编码 | 写 auth-plan，使用 env / manual / storage-state |
| Browser without assertions | 打开页面但没有断言 | 每步补可见结果 |
| CSS selector fragile | 依赖深层 CSS 路径 | 改用 role / label / text / testid |
| Test data unknown | 不知道数据是否存在 | 写 seed / fixture / precondition |
| External dependency real call | 直接依赖外部服务 | mock / contract / deferred real check |
| Screenshot as only proof | 只有截图 | 补 trace / assertion / command output |
| Unit test overmocking | mock 掉核心逻辑 | 测真实纯函数或真实 adapter contract |
| Environment drift | 本地能跑但缺 env 说明 | 写 runtime-runbook |
| Hidden deferred | 失败项写“后续处理” | 写 owner / impact / trigger |
