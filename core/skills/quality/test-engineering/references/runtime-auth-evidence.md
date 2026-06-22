# Runtime, Auth, And Evidence

本文件把启动、登录态、测试数据和证据归档合在一起管理。它们在真实验证中经常互相影响：项目无法启动、账号来源不清或证据路径不可追溯，都会让测试结论失效。

## Runtime Runbook

当 source artifact 出现启动、运行、健康检查、环境变量、配置、migration、docker、server、port、build、deploy、rollback、observability 等信号时，写：

`05-verification/test-engineering/runtime-runbook.md`

必须包含：

| 字段 | 要求 |
| --- | --- |
| Install | 包管理器、安装命令、是否已安装 |
| Env | 必需 env、来源、敏感项处理、缺失时行为 |
| Start | cwd、命令、端口、预期 stdout |
| Health check | URL / CLI / log signal、超时、失败判定 |
| Logs | 文件、stdout、browser console、server log 获取方式 |
| Reset / cleanup | stop 命令、测试数据清理、临时文件清理 |
| Failure triage | env issue / implementation bug / external dependency / test setup issue |

优先来源：

1. `technical-design.md` 的 runbook / Operability & Maintenance。
2. `implementation report`。
3. `package.json` scripts。
4. README / docker compose / env example。
5. 框架默认启动方式。

## Auth Strategy

auth strategy 可选值必须与质量脚本一致：

| 策略 | 使用场景 | 约束 |
| --- | --- | --- |
| `none` | 公开页面或无需登录 | 说明为什么无需登录 |
| `ui-login` | 需要验证登录路径或用户希望看到登录过程 | 账号密码来自用户、安全 env 或测试账号说明，不写死 |
| `api-login` | 后端支持测试登录 API | 适合非登录流程，仍需记录 token 处理 |
| `storage-state` | Playwright auth setup 保存登录态 | `.auth` / storage 文件必须 gitignored，不能提交 |
| `manual` | 验证码、MFA、企业 SSO | 记录手动步骤、继续点和过期处理 |

strategy 不是 `none` 时，登记：

`05-verification/test-engineering/auth-plan.md`

必须包含 Role、Account source、Auth method、Sensitive data handling、Expiration handling、Parallel execution risk、Cleanup。

禁止：

- 在测试文件中硬编码密码、token 或 cookie。
- 保存 cookies、token、localStorage、sessionStorage 到仓库。
- 用“用户会自己登录”替代 auth plan。

## Test Data And Isolation

| 风险 | 规则 |
| --- | --- |
| 数据污染 | 使用 seed / fixture / factory，写 cleanup |
| 共享账号 | 标记 parallel execution risk |
| 外部服务 | 优先 mock / contract，真实调用需用户确认 |
| 时间依赖 | 控制 clock 或写容忍范围 |
| 文件上传下载 | 使用临时目录，校验 cleanup |
| 数据库 | 使用事务、测试 schema、临时库或明确 N/A |

Preconditions 必须可执行。不要写“准备一些数据”；要写数据来源、创建方式、唯一前缀和清理方式。

## Evidence Manifest

证据优先归档到：

`05-verification/evidence/<run-id>/`

建议包含：

- `evidence-manifest.json`
- command / stdout 摘要
- screenshot / trace / video（适用时）
- console / network 摘要（适用时）
- HTML report 或 trace viewer 路径（适用时）
- 相关 `TC-*` / `PW-*`
- sensitive data handling

`05-verification/test-cases.md#3.2 Evidence Manifest` 至少登记 run id、command、related cases、evidence path、strength。

证据路径必须能从 verification report 追溯。截图、trace、视频和日志不能含 secret、token、cookie 或个人敏感信息。
