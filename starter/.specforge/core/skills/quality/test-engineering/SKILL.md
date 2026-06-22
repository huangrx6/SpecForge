---
name: test-engineering
description: SpecForge 测试工程主能力包。用于 sf-verify 在验证前把 requirements、tasks、UI、technical design 和 code review 风险转成可解析 TC/PW 用例、runtime runbook、auth strategy、自动化计划和可归档 evidence。
---

# Test Engineering

本能力包不是“写几个测试用例”。它负责把 SpecForge 已批准事实转成验证阶段能执行、能解析、能归档、能阻断 gate 的测试工程材料。

核心约束：所有输出必须能被 `sf-verify` 和 `node .specforge/core/scripts/test-case-quality.mjs` 消费。没有落到 `05-verification/test-cases.md`、`05-verification/test-engineering/`、`05-verification/report.md` 或 `05-verification/evidence/` 的测试想法，只能算草稿。

## 负责

1. 识别 requirements、gap report、tasks、implementation report、code review notes 中要验证的对象。
2. 生成测试对象树、测试用例、自动化计划和证据计划。
3. 选择 unit、integration、contract、e2e、smoke、manual 等测试层级。
4. 生成或更新单元测试、集成测试、contract 测试、Playwright E2E 测试。
5. 规划项目启动、健康检查、日志、环境变量和 cleanup。
6. 规划登录态、测试账号、测试数据和隔离策略。
7. 必要时以 headed / UI mode 展示浏览器执行过程。
8. 收集 trace、screenshot、video、console、network、HTML report 和命令输出。
9. 生成 verification evidence。
10. 对失败归因：产品 bug / 测试数据问题 / 环境问题 / 选择器不稳定 / 登录状态问题 / 外部依赖不可达。
11. 将 warning / deferred / manual-confirmed 项写成 owner、impact、revalidation trigger，而不是口头说明。

## 不负责

- 不替代 `sf-verify` gate。
- 不编造账号、密码、token。
- 不把 mock 结果包装成真实端到端通过。
- 不把 happy path 当完整验证。
- 不把浏览器截图当唯一证据。
- 不保存 cookies、token、localStorage、sessionStorage 到仓库。

## 读取顺序

1. `01-spec/requirements.md` 或 `01-spec/gap-report.md`
2. `01-spec/ui-design.md`
3. `01-spec/technical-design.md`
4. `01-spec/tasks.md`
5. `03-implementation/report.md`
6. `03-implementation/changed-files.md`
7. `04-code-review/code-review-v1.md`
8. `.specforge/wiki/` 运行、权限、API、数据、风险事实
9. `package.json`、lockfile、docker compose、README、env example

## 参考文件

| 需要判断 | 读取 |
| --- | --- |
| 从 source artifact 到测试计划的完整路径 | `references/workflow-playbook.md` |
| `test-cases.md`、test-engineering 目录和 report 的固定输出 | `references/output-contract.md` |
| runtime runbook、auth strategy、evidence manifest、敏感数据边界 | `references/runtime-auth-evidence.md` |
| 单测、API、权限、Playwright、上传下载、后台表格、AI、runtime 的场景模式 | `references/verification-patterns.md` |
| locator 稳定性、可访问名称、testid 和 selector 修复建议 | `references/locator-contract.md` |
| `test-case-quality.mjs` 常见 FAIL/WARN 的修复顺序 | `references/quality-repair-guide.md` |
| 需要生成测试用例、单测、Playwright flow 或失败归因时的提示模板 | `references/authoring-prompts.md` |

## 执行流程

1. 建测试对象树：功能行为、角色 / 权限、数据 / 文件、API / 集成、UI 页面 / 状态、AI 质量、错误 / 边界、启动 / 配置 / 运行、回归风险。
2. 选择测试层级：unit、integration、contract、Playwright、smoke、manual。高风险 source 不能只落 manual。
3. 先写 `05-verification/test-cases.md` 的固定表格。`TC-*` 必须包含真实 Source、Preconditions、Steps、Assertions、Evidence、Automation、Risk。
4. 有浏览器流程信号时生成 `PW-*`，并登记 `05-verification/test-engineering/playwright-flows.md`。PW 必须写 role、auth strategy、route、locator、assertion、screenshot/trace、cleanup。
5. 有启动、配置、server、health check、migration、deploy、rollback 信号时写 `runtime-runbook.md`。
6. auth strategy 不是 `none` 时写 `auth-plan.md`，说明账号来源、敏感数据处理、过期处理和并发风险。
7. 生成自动化计划：测试文件、命令、fixtures、auth setup、test data builders、cleanup。
8. 执行顺序建议：lint / typecheck -> unit -> integration / contract -> startup smoke -> Playwright headless -> headed / UI mode demo -> evidence collection。
9. 运行 `node .specforge/core/scripts/test-case-quality.mjs`。FAIL 先修；WARN 写入 verification report 的 owner、impact、revalidation trigger。
10. 输出失败归因和下一步：product bug、test data issue、env issue、selector issue、auth issue、external dependency。

## 主要产物

- `05-verification/test-plan.md`
- `05-verification/test-cases.md`
- `05-verification/test-engineering/test-design-tree.md`
- `05-verification/test-engineering/test-design-tree.json`
- `05-verification/test-engineering/automation-plan.md`
- `05-verification/test-engineering/playwright-flows.md`
- `05-verification/test-engineering/runtime-runbook.md`
- `05-verification/test-engineering/auth-plan.md`
- `05-verification/evidence/<run-id>/`

## 完成标准

- 高风险用例目标证据为 `proven`，UI 关键流程至少 `observed + screenshot`。
- 每个 `TC-*` 可追溯到 source artifact。
- 每个 `PW-*` 关联 `TC-*`，且包含 auth、locator、assertion、evidence、cleanup。
- Runtime runbook 足以让验证阶段启动项目并收集日志。
- Deferred / manual 项有 reason、owner、impact、revalidation trigger。
- `node .specforge/core/scripts/test-case-quality.mjs` 无 FAIL；warning 已写入 report 风险、owner 和重新验证条件。
