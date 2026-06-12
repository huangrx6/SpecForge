# Tasks

## 0. 一页摘要

- 执行结论：
- 已确认决策：
- 最大风险：
- 下一步：
- 需要用户确认的唯一问题：

## 1. 规划输入

| 项目 | 值 |
|---|---|
| Work item | |
| Workflow | |
| Components 摘要 | |
| 来源产物 | brief / prd / requirements / gap_report / research / ui_design / technical_design |
| Wiki 入口 | `.specforge/wiki/...md` / N/A |
| instructions.mjs 已确认 ready artifact | yes / no |

## 2. 来源审计与覆盖矩阵

| Source | 来源需求 / 决策 / 风险 | 来源产物 | 实现任务 | 验证任务 | 备注 |
|---|---|---|---|---|---|
| GOAL / PRD / REQ / UI / TECH / RESEARCH / CONTEXT | | | | | |

## 2.1 Wiki 上下文与代码入口

| Wiki 文件 | 关联事实 | 代码入口 / 关键符号 | 上游 / 下游 | 测试 / 运行入口 | 是否足够指导任务 |
|---|---|---|---|---|---|
| `.specforge/wiki/...md` | | | | | yes / no / N/A |

## 3. Technical Design 影响面任务覆盖

> 仅在 `technical-design.md` 适用时填写；否则写 N/A。来源为 `technical-design.md#0. 影响面与读取计划`。关键 `unknown` 不得进入 implementation。

| 影响面 | Approved status | 实现任务 | 验证任务 | N/A / 退回理由 |
|---|---|---|---|---|
| Frontend engineering | yes / no / unknown / N/A | | | |
| Backend engineering | yes / no / unknown / N/A | | | |
| Domain model / state machine | yes / no / unknown / N/A | | | |
| API / SDK / Events | yes / no / unknown / N/A | | | |
| Data / DB / Migration | yes / no / unknown / N/A | | | |
| Auth / Permission / Security | yes / no / unknown / N/A | | | |
| Config / Env / Delivery | yes / no / unknown / N/A | | | |
| Jobs / Queue / Scheduler | yes / no / unknown / N/A | | | |
| Observability / Reliability | yes / no / unknown / N/A | | | |

## 4. 并行波次

| 波次 | 目标 | 可并行条件 | 任务 |
|---|---|---|---|
| W0 | 契约、脚手架、启动基线、失败优先验证 | 不共享主要写入文件；共享契约先完成 | |
| W1 | 核心实现 | 依赖 W0 契约和测试基线 | |
| W2 | 集成、验证、运行收口 | 依赖 W1 核心行为 | |

## 4.1 任务图与执行策略

| 任务 | Depends on | 可并行 | 主要写入边界 | 交付物 | Review 焦点 |
|---|---|---|---|---|---|
| T001 | none | no / yes | | | |

| Agent / Worker | 可认领任务 | 禁止同时修改 | 交接证据 |
|---|---|---|---|
| Codex / Trae / SOLO / 人工 | | | implementation report / changed files / test output |

## 5. 任务列表

> 每个任务必须保留核心字段：`_Trace:_`、`_Files:_`、`_Verification:_`、`_Rollback:_`、`_Risk:_`。条件字段按任务性质添加：涉及 technical_design 影响面时加 `_Impact:_`；任务写入边界可能冲突、跨模块或并行执行时加 `_Boundary:_`；任务依赖其他任务时加 `_Depends:_`；已有或需要测试用例矩阵时加 `_TestCase:_`。条件字段不适用时可以省略，或写 N/A 理由。

### W0 - 契约、脚手架、基线

- [ ] T001 [W0][契约] 定义本次变更的契约和预期失败验证。
  _Trace:_ REQ / GAP / TD / UI section
  _Files:_ expected files, directories, or module categories
  _Verification:_ 契约测试、类型检查或预期失败用例能证明当前缺口存在。
  _Rollback:_ remove contract / restore previous schema / N/A reason
  _Risk:_ contract drift / data compatibility / N/A
  _Impact:_ API / SDK / Events / Data / Permission / N/A
  _Boundary:_ `path/or/module`
  _Depends:_ none
  _TestCase:_ TC-xxx / N/A

- [ ] T002 [W0][启动] 建立或验证项目脚手架与本地启动基线。
  _Trace:_ TD / engineering startup requirement / N/A
  _Files:_ `package.json`, build config, app entry, dev server config, or N/A
  _Verification:_ 本地安装、构建或 dev server 冒烟命令可运行；若不适用写 N/A 理由。
  _Rollback:_ revert scaffold/config changes or N/A reason
  _Risk:_ tooling drift / startup regression / N/A
  _Impact:_ Frontend engineering / Backend engineering / Config / Env / Delivery / N/A
  _Boundary:_ `package.json`, build config, app entry, dev server config
  _Depends:_ none
  _TestCase:_ TC-xxx / N/A

### W1 - 核心实现

- [ ] T003 [W1][实现] 实现满足契约的最小行为。
  _Trace:_ REQ / GAP / TD section
  _Files:_ expected implementation files, directories, or module categories
  _Verification:_ T001 中定义的验证从失败变为通过。
  _Rollback:_ revert behavior change / feature flag off / N/A reason
  _Risk:_ behavior regression / compatibility / N/A
  _Impact:_ Frontend engineering / Backend engineering / Domain model / API / N/A
  _Boundary:_ `path/or/module`
  _Depends:_ T001
  _TestCase:_ TC-xxx / N/A

- [ ] T004 [W1][UI] 实现 UI 页面、组件和状态覆盖。
  _Trace:_ UI section / REQ section / N/A
  _Files:_ page, component, style, route, fixture, or N/A
  _Verification:_ 页面、操作、角色、空 / 加载 / 错误 / 禁用 / 边界状态可检查；无 UI 时写 N/A。
  _Rollback:_ remove route/component or feature flag off; N/A reason when no UI
  _Risk:_ visual regression / accessibility / responsive state gaps / N/A
  _Impact:_ Frontend engineering / N/A
  _Boundary:_ `frontend/path/or/components`
  _Depends:_ T001, T003
  _TestCase:_ TC-xxx / N/A

- [ ] T005 [W1][数据-安全-运行] 实现数据、权限、安全、配置或运行支持。
  _Trace:_ TD data/security/NFR section / N/A
  _Files:_ migrations, auth modules, config, jobs, observability files, or N/A
  _Verification:_ 迁移、权限、安全、配置、后台任务或可观测性验证通过；不适用项写 N/A。
  _Rollback:_ down migration / permission rollback / config revert / N/A reason
  _Risk:_ data loss / privilege escalation / delivery failure / N/A
  _Impact:_ Data / DB / Migration / Auth / Permission / Security / Jobs / Observability / N/A
  _Boundary:_ migrations, auth modules, config, jobs, observability
  _Depends:_ T001
  _TestCase:_ TC-xxx / N/A

### W2 - 验证与关闭提示

- [ ] T006 [W2][测试] 补齐自动化与回归验证。
  _Trace:_ acceptance criteria / gap regression / TD verification
  _Files:_ unit, integration, contract, or e2e test files
  _Verification:_ 单元、集成、契约、E2E 或等价证据覆盖正常、异常、边界和权限路径；有浏览器流程时必须包含 Playwright 自动操作用例。
  _Rollback:_ remove or update tests with implementation rollback / N/A reason
  _Risk:_ false confidence / untested regression / N/A
  _Impact:_ all applicable yes impacts
  _Boundary:_ tests, fixtures, mocks, e2e specs
  _Depends:_ T003, T004, T005
  _TestCase:_ TC-xxx

- [ ] T007 [W2][测试用例] 输出 verification 测试用例矩阵。
  _Trace:_ acceptance criteria / UI state matrix / TD verification / code review expected notes
  _Files:_ `05-verification/test-cases.md`
  _Verification:_ `05-verification/test-cases.md` 覆盖单元、集成、契约、Playwright、启动、权限、边界和回归中适用项；用例有 ID、前置条件、步骤、断言和证据要求。
  _Rollback:_ update/remove test cases if scope changes
  _Risk:_ missing verification coverage / N/A
  _Impact:_ all applicable yes impacts
  _Boundary:_ `05-verification/test-cases.md`
  _Depends:_ T006
  _TestCase:_ N/A - creates test cases

- [ ] T008 [W2][Playwright] 编写并执行浏览器 E2E 用例。
  _Trace:_ UI state matrix / acceptance criteria / approval-upload-download flows / N/A
  _Files:_ e2e specs, temporary Playwright scripts, fixtures, evidence paths, or N/A
  _Verification:_ Playwright 自动点击、填写、上传、提交、审批 / 下载中适用流程，并断言成功和关键失败态；无浏览器流程时写 N/A。
  _Rollback:_ remove/update e2e script and evidence notes with scope change / N/A reason
  _Risk:_ flaky e2e / browser-only regression / N/A
  _Impact:_ Frontend engineering / API / Permission / N/A
  _Boundary:_ e2e specs or `/tmp/playwright-test-*.js`, fixtures, test evidence
  _Depends:_ T004, T005, T007
  _TestCase:_ PW-xxx / N/A

- [ ] T009 [W2][运行] 执行启动验证、回滚检查和观察点确认。
  _Trace:_ TD NFR / engineering startup and rollback requirements / N/A
  _Files:_ config docs, env examples, scripts, observability notes, or N/A
  _Verification:_ dev server / service 启动、配置、迁移、回滚或观察命令有记录；不适用项写 N/A。
  _Rollback:_ documented command/config rollback or N/A reason
  _Risk:_ runtime config drift / rollback failure / N/A
  _Impact:_ Config / Env / Delivery / Observability / Reliability / N/A
  _Boundary:_ commands, config docs, observability notes
  _Depends:_ T006, T007
  _TestCase:_ TC-xxx / N/A

- [ ] T010 [W2][Wiki提示] 标记 close 阶段需要回写的长期事实。
  _Trace:_ architecture / product / data / operations change / N/A
  _Files:_ `03-implementation/report.md`
  _Verification:_ implementation report 列出需要回写或明确 N/A；不提前写 closure artifact。
  _Rollback:_ remove wiki hint if implementation is reverted / N/A reason
  _Risk:_ stale wiki / duplicated long-term facts / N/A
  _Impact:_ long-term wiki facts / N/A
  _Boundary:_ 仅在 `03-implementation/report.md` 记录提示；实际 wiki 写入留给 `sf-wiki`
  _Depends:_ T006
  _TestCase:_ N/A

## 6. 验证计划

| 验证区域 | 命令 / 方法 | 覆盖任务 | 证据负责人 |
|---|---|---|---|
| 单元 / 组件 | | | |
| 集成 / 契约 | | | |
| E2E / UI 矩阵 | | | |
| PC 端业务系统规范 | | | |
| 启动 / 配置 | | | |
| 安全 / 权限 | | | |
| 迁移 / 回滚 | | | |
| 可观测性 / 后台任务 | | | |

## 7. 不在范围

-

## 8. 未决问题

> 这里的任何阻断问题都应在 spec_review 前退回 requirements、ui_design、technical_design 或 gap_report。

-
