# Test Engineering Output Contract

```markdown
# Test Engineering Plan

## 1. Test Control
- Source artifacts:
- Test profile: compact / standard / full
- Automation target:
- Risk level:
- Auth strategy:

## 2. Test Object Tree
| Area | Source | Risk | Test layer |
| --- | --- | --- | --- |

### Test Design Tree Rules

测试对象树是测试工程事实源，可以派生为 XMind / 白板，但 Markdown / JSON 才能进入 SpecForge artifact。

推荐覆盖：

- Business behavior：REQ / AC / GAP、核心断言。
- Roles and permissions：允许角色、拒绝角色、数据范围。
- API / data contract：请求校验、成功响应、错误响应、持久化 / 迁移。
- UI flows：happy path、loading / empty / error、边界、响应式。
- Failure modes：network / timeout、第三方失败、retry / idempotency。
- Operations：startup / config、observability、rollback。

节点规则：

- 每个叶子节点必须能生成 `TC-*` 或 `PW-*`。
- 每个节点都要标来源：`REQ-*`、`AC-*`、`GAP-*`、`Txxx`、`UI-*`、`TD-*`、`REVIEW-*`。
- 叶子节点写断言，不写“验证一下”“看一下”这类泛动作。
- XMind 中的颜色、图标、优先级只能作为阅读辅助；不能替代 risk / evidence 字段。

Markdown / JSON 导出路径：

- `05-verification/test-engineering/test-design-tree.md`
- `05-verification/test-engineering/test-design-tree.json`

## 3. Test Cases
| ID | Source | Scenario | Preconditions | Steps | Assertions | Automation | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |

## 4. Unit Test Plan
| Target | Why | Test cases | File | Command |
| --- | --- | --- | --- | --- |

## 5. Integration / Contract Test Plan
| Contract | Setup | Assertions | Command |
| --- | --- | --- | --- |

## 6. Playwright Browser Flow Plan
| PW ID | Role | Auth | Route | Steps | Assertions | Evidence |
| --- | --- | --- | --- | --- | --- | --- |

## 7. Runtime Runbook
- Install:
- Env:
- Start:
- Health check:
- Logs:
- Stop / cleanup:

## 8. Evidence Plan
| Evidence | Path | Required for |
| --- | --- | --- |

## 8.1 Automation Matrix

| 风险 / 对象 | 首选验证 | 补充验证 | 不足说明 |
| --- | --- | --- | --- |
| 纯函数、formatter、policy | unit | property / snapshot | 不能证明集成和权限 |
| API 输入输出 | contract / integration | unit schema | 不能证明真实 UI 流程 |
| 数据库、迁移、事务 | integration / migration dry-run | unit repository | mock 不能证明真实约束 |
| 权限、角色、数据范围 | integration + Playwright | unit policy | 只测前端按钮隐藏不够 |
| 页面表单、上传、提交、审批、下载 | Playwright | component test | 手工点击不能替代回归证据 |
| 错误提示、路由、响应式 | Playwright screenshot / trace | visual review | 单元测试不能证明真实 DOM |
| 外部系统、消息、Webhook | contract / sandbox / mocked + manual-confirmed | logs | 需要说明无法 proven 的边界 |
| 启动、配置、发布、回滚 | startup / smoke / runbook | static check | 只通过编译不证明运行可用 |

每个自动化用例至少登记 command、environment、evidence、related cases 和 strength。

## 8.2 XMind / 白板导出规则

XMind、白板和脑图只能作为测试空间草图，不能成为唯一事实源。使用时必须导出 Markdown 或 JSON 到 `05-verification/test-engineering/`，并在 `05-verification/test-cases.md#1.1 Test Design Artifacts` 登记。

登记格式：

| Artifact | Format | Path | Derived Cases | Export Path | Status |
| --- | --- | --- | --- | --- | --- |
| 测试设计脑图 | xmind | `05-verification/test-engineering/test-design.xmind` | TC-001, PW-001 | `05-verification/test-engineering/test-design-tree.md` | exported |

禁止：

- 只保存 `.xmind` 文件，不导出 Markdown / JSON。
- 只保存脑图截图，不回填 TC / PW。
- 用脑图颜色表示风险但不填写 test-cases 的 Risk 字段。
- 用“待测”“验证一下”这类不可执行节点作为叶子。

## 9. Deferred / Manual Items
| Item | Reason | Owner | Revalidation trigger |
| --- | --- | --- | --- |
```

## `05-verification/test-cases.md` 必填结构

`test-case-quality.mjs` 依赖固定标题和表格列解析。不要改标题编号。

### 1.1 Test Design Artifacts

| Artifact | Format | Path | Derived Cases | Export Path | Status |
| --- | --- | --- | --- | --- | --- |
| 测试设计树 | markdown/json/xmind/whiteboard | `05-verification/test-engineering/test-design-tree.md` | TC-001, PW-001 | `05-verification/test-engineering/test-design-tree.json` | ready / exported / planned / N/A |

### 1.2 Test Engineering Artifacts

| Artifact | Path | Purpose | Status |
| --- | --- | --- | --- |
| Runtime runbook | `05-verification/test-engineering/runtime-runbook.md` | 启动、健康检查、日志和清理 | ready / planned / N/A |
| Auth plan | `05-verification/test-engineering/auth-plan.md` | 登录态、账号来源和敏感数据处理 | ready / planned / N/A |
| Automation plan | `05-verification/test-engineering/automation-plan.md` | 单元 / 集成 / contract / Playwright 命令 | ready / planned / N/A |
| Playwright flows | `05-verification/test-engineering/playwright-flows.md` | 浏览器流程、locator、截图和 trace | ready / planned / N/A |

### 2. Test Case Matrix

| ID | Type | Source | Preconditions | Steps | Assertions | Evidence Required | Evidence Strength Target | Automation | Risk |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-001 | e2e | REQ-001 | seeded user exists | open dashboard, submit form | success toast and new row visible | screenshot, trace | proven | Playwright `tests/e2e/...` | high |

`Evidence Strength Target` 只能使用：`claimed` / `observed` / `proven` / `mocked` / `manual-confirmed` / `deferred` / `missing`。

### 3. Playwright Cases

| ID | Flow | Role | Data | Steps | Assertions | States | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PW-001 | 创建并提交审批 | admin | seeded record | goto, fill, submit | toast, row state, network success | success/error/permission | `05-verification/evidence/run-001/trace.zip` |

### 3.1 Auth And Runtime

| Item | Strategy | Source | Sensitive Data Handling | Cleanup |
| --- | --- | --- | --- | --- |
| auth | storage-state | test account from env | storage file gitignored, no token in logs | delete `.auth` after run |
| runtime | local dev server | package scripts | env from `.env.example`, secrets redacted | stop dev server |

### 3.2 Evidence Manifest

| Run ID | Command | Related | Evidence Path | Strength |
| --- | --- | --- | --- | --- |
| run-001 | `npx playwright test tests/e2e/create.spec.ts --trace retain-on-failure` | TC-001, PW-001 | `05-verification/evidence/run-001/` | proven |

## Verification Report 对账

`05-verification/report.md` 应包含：

- `## 3.1 测试用例索引`：列出全部 `TC-*`。
- `### Playwright E2E 用例与执行`：列出全部 `PW-*`、命令、结果、证据路径。
- warning / deferred / manual-confirmed 的 owner、impact、revalidation trigger。

如果 report 缺少 TC/PW 索引，质量脚本会给出追踪 warning。
