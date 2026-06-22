# Test Engineering Workflow Playbook

本文件定义测试工程从 source artifact 到可验证输出的主路径。优先解决“验证什么、用什么层级证明、证据落在哪里”，再生成测试代码或浏览器脚本。

## 1. Source 到测试对象树

| Source | 转成 | 最低要求 |
| --- | --- | --- |
| Requirements / AC | `TC-*` 正常路径、失败路径、边界路径 | Steps 可执行，Assertions 可观察 |
| Gap report root cause | 回归 `TC-*` | 覆盖 bug 复现条件和修复后断言 |
| Tasks `_Verification:_` | 命令、用例或 evidence 要求 | 每条 task verification 有结果 |
| UI design 页面 / flow / state matrix | `PW-*`、截图点、状态断言 | 页面 × 操作 × 角色 × 状态不能只测 happy path |
| Technical design API / data / permission / runtime / NFR | integration、contract、migration、smoke、observability check | 高风险设计承诺必须有强证据或可信 deferred |
| Code review findings / residual risks | regression `TC-*` 或 verification note | P0/P1 修复后必须有回归证据 |
| Wiki 运行 / API / 风险事实 | runtime runbook、contract check、affected tests | 不能忽略已知运行约束 |

测试对象树建议放到：

- `05-verification/test-engineering/test-design-tree.md`
- `05-verification/test-engineering/test-design-tree.json`

每个叶子节点必须能派生 `TC-*` 或 `PW-*`，并标明 source id、risk、test layer、evidence target。

## 2. 测试层级选择

| 对象 | 首选验证 | 补充验证 | 不足说明 |
| --- | --- | --- | --- |
| 纯函数、formatter、validator、policy | unit | property / regression sample | 不能证明集成链路 |
| API 输入输出 | contract / integration | unit schema | 不能证明 UI 真实操作 |
| 数据库、迁移、事务 | integration / migration dry-run | repository unit | mock 不能证明真实约束 |
| 权限、角色、数据范围 | integration + Playwright | unit policy | 只隐藏按钮不等于后端安全 |
| 页面表单、上传、提交、审批、下载 | Playwright | component test | 手工点击不能替代回归证据 |
| 错误提示、路由、响应式 | Playwright screenshot / trace | visual review | 单元测试不能证明真实 DOM |
| 外部系统、消息、Webhook | contract / sandbox / mocked + manual-confirmed | logs | 必须说明真实环境待补证边界 |
| 启动、配置、发布、回滚 | startup smoke / runtime runbook | static check | 只通过编译不证明运行可用 |
| AI workflow / agent | parser unit + tool contract + eval samples | manual review | 单次模型输出不能证明稳定质量 |

## 3. 风险和证据强度

可用 evidence strength：

- `claimed`：只在计划阶段可用，不能支撑批准。
- `observed`：人工观察、截图、headed browser、启动日志。
- `proven`：自动化命令通过，有 stdout、trace、report 或等价可复现证据。
- `mocked`：mock / fake provider 证明局部协议，不证明真实端到端。
- `manual-confirmed`：用户或负责人明确接受外部待补证。
- `deferred`：已知缺口延后，必须有 owner、impact、revalidation trigger。
- `missing`：无证据，不能支撑 gate。

规则：

- `critical` / `high` 风险目标证据应为 `proven`；无法 proven 时必须降级说明和人工确认。
- UI 关键流程至少需要 `observed + screenshot`；浏览器自动化通过并有 trace/report 时才是 `proven`。
- mock 结果不能包装成真实端到端通过。
- 外部真实环境不可访问时，写清本地覆盖了什么、缺什么、谁补证、何时触发。

## 4. 执行顺序

1. 写测试对象树和 `05-verification/test-cases.md`。
2. 写 runtime/auth/automation/playwright 计划中适用文件。
3. 运行 `node .specforge/core/scripts/test-case-quality.mjs`，先修 FAIL。
4. 执行低成本高信号验证：lint、typecheck、unit。
5. 执行 integration / contract / migration / runtime smoke。
6. 执行 Playwright headless；关键 UI 可追加 headed / UI mode demo。
7. 归档 evidence manifest、截图、trace、日志摘要、命令摘要。
8. 将 WARN / deferred / manual-confirmed 写入 verification report。

## 5. 失败归因

| 类型 | 信号 | 下一步 |
| --- | --- | --- |
| product bug | 用户可见行为不满足 spec | 回 implementation 修复 |
| test data issue | 前置数据不存在、污染或无法清理 | 修 seed / fixture / cleanup |
| env issue | 服务、端口、env、依赖不可用 | 修 runtime runbook 或环境 |
| selector issue | 元素存在但 locator 不稳定 | 补 accessible name / testid |
| auth issue | 登录失败、session 过期、权限不符 | 修 auth-plan |
| external dependency | 第三方不可达或沙箱缺失 | mock / contract / deferred real check |

失败不得直接改成跳过。只有明确 owner、impact 和 revalidation trigger 的低风险项才能 deferred。
