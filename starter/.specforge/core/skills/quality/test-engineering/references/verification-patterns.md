# Verification Patterns

按风险选择模式。不要为了“覆盖面看起来完整”生成空泛用例；每个模式都要落到可执行步骤、断言、命令和证据。

## Unit Test Authoring

适合单测：

- pure function
- formatter / validator / mapper
- policy / permission function
- reducer / state transition
- composable / hook
- service adapter with mock
- data transformer
- prompt parser / output parser
- AI post-processing logic

每组单测覆盖 normal path、invalid input、boundary value、empty/null/undefined、permission/role variants、error path、regression case。

禁止 mock 掉被测对象本身、用大量 snapshot 代替行为断言、让单测依赖真实网络 / 数据库 / 浏览器。

## API / Contract Test

| 对象 | 断言 |
| --- | --- |
| 请求参数 | 必填、类型、边界、非法输入 |
| 响应 | 状态码、字段、错误结构 |
| 权限 | 授权角色通过，无权限角色失败 |
| 外部调用 | mock contract、超时、失败兜底 |
| 兼容性 | 旧客户端或旧字段不破坏 |

输出必须包含 setup、command、assertions、cleanup 和 evidence path。

## Data / Permission Test

覆盖：

- 同角色不同数据范围。
- 不同角色访问同一对象。
- tenant / department / owner 隔离。
- 空数据、过期数据、被删除数据。
- 审计记录和 actor。

负向权限测试必须断言状态码、页面反馈、数据未泄露和日志不含敏感信息。

## Playwright Browser Flow

触发条件：页面、按钮、表单、上传、提交、审批、下载、权限、路由、错误提示、登录、弹窗、抽屉、响应式等 UI / 浏览器流程信号。

每个 `PW-*` 必须包含：

- source `TC-*`
- baseURL
- auth strategy
- role
- route
- preconditions / test data
- steps with locator strategy
- visible assertions
- screenshot points
- trace strategy
- console / network check（需要时）
- cleanup
- failure triage

常用命令：

```bash
npx playwright test tests/e2e/<flow>.spec.ts --headed
npx playwright test --ui
npx playwright test --trace retain-on-failure
npx playwright show-report
npx playwright show-trace path/to/trace.zip
```

如果项目没有 Playwright 配置，优先使用 SpecForge 托管的 `quality/playwright-skill` 或临时 Playwright 脚本执行真实浏览器操作；不能因为“项目没配 E2E”直接跳过高风险 UI。

## Dashboard / Table Flow

覆盖 loading、empty、error、permission、filter、search、sort、pagination、row action、batch action、drawer/modal、指标口径、日期范围、空值。

表格测试要断言具体行、列、状态和操作结果，不只断言页面存在。

## Upload / Download Flow

| 阶段 | 检查 |
| --- | --- |
| 上传前 | 文件类型、大小、空文件、重复文件 |
| 上传中 | loading、防重复提交、进度或提示 |
| 上传后 | 解析结果、错误行、权限、审计 |
| 下载 | 文件名、类型、内容、权限、404 / 403 |
| cleanup | 删除测试文件或标记测试数据 |

## AI Agent Flow

AI 功能测试必须区分确定性工程行为和模型质量：

| 对象 | 测试方式 |
| --- | --- |
| 输入校验 | unit / integration |
| tool call / workflow | mocked contract / integration |
| output parser | unit + regression samples |
| model quality | eval set + manual review |
| safety / privacy | negative tests + redaction checks |
| cost / timeout | runtime smoke + logs |

不要把一次模型输出截图当稳定通过证据。

## Runtime Smoke

Runtime smoke 证明项目能启动、健康检查能通过、关键日志可读。它不替代业务验证，但能发现 env、port、dependency 和配置问题。

最小检查：

- install command 可执行或依赖已存在。
- start command 在正确 cwd 运行。
- health check 返回预期状态或日志信号。
- stop / cleanup 清楚。
- 失败能归因到 env、implementation、external dependency 或 test setup。
