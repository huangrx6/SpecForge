---
name: test-engineering
description: SpecForge 测试工程主能力包。用于 sf-verify 在验证前生成测试策略、测试用例、单元 / 集成 / contract / Playwright 测试、项目启动 runbook、登录态方案和可归档证据。
---

# Test Engineering

本能力包不是单纯测试用例设计，而是完整测试工程能力：识别要验证什么、选择测试层级、生成测试用例和测试代码、启动项目、执行自动化测试、归档证据，并对失败进行归因。

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

## 参考文件路由

| 需要判断 | 读取 |
| --- | --- |
| 阶段边界、证据强度、数据隔离、稳定性 | `foundations/*.md` |
| 从 spec / UI / tech / code review 转测试计划 | `transforms/*.md` |
| 单测、契约、权限、浏览器流程、启动等场景 | `patterns/*.md` |
| Playwright、启动、locator、证据和反模式 | `references/*.md` |
| 输出结构 | `references/output-contract.md` |

## 执行流程

1. 建测试对象树：功能行为、角色 / 权限、数据 / 文件、API / 集成、UI 页面 / 状态、AI 质量、错误 / 边界、启动 / 配置 / 运行、回归风险。
2. 选择测试层级：unit、integration、contract、Playwright、smoke、manual。
3. 生成 `TC-*` 测试用例：Source、Preconditions、Test data、Steps、Assertions、Evidence、Automation、Cleanup、Risk、Owner。
4. 有浏览器流程时生成 `PW-*`：baseURL、auth strategy、role、route、locator、assertion、screenshot、trace、cleanup。
5. 生成自动化计划：测试文件、命令、fixtures、auth setup、test data builders。
6. 生成 runtime runbook：install、env、start、health check、logs、stop / cleanup。
7. 执行顺序建议：lint / typecheck -> unit -> integration / contract -> startup smoke -> Playwright headless -> headed / UI mode demo -> evidence collection。
8. 输出失败归因和下一步：bug、test issue、environment issue、selector issue、auth issue、external dependency。

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
- `node .specforge/core/scripts/test-case-quality.mjs` 无 FAIL；warning 已写入 report 风险。
