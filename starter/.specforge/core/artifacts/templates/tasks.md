# Tasks

## 1. 规划输入

| 项目 | 值 |
|---|---|
| Work item | |
| Workflow | |
| Components 摘要 | |
| 来源产物 | brief / prd / requirements / gap_report / research / ui_design / technical_design |
| instructions.mjs 已确认 ready artifact | yes / no |

## 2. 覆盖矩阵

| 来源需求 / 决策 / 风险 | 来源产物 | 实现任务 | 验证任务 | 备注 |
|---|---|---|---|---|
| | | | | |

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

## 5. 任务列表

> 每个任务必须保留 `_Trace:_`、`_Impact:_`、`_Boundary:_`、`_Depends:_`、`_Verification:_`。`_Risk:_` 适用于安全、数据、发布、并发、AI、外部集成等风险任务。

### W0 - 契约、脚手架、基线

- [ ] T001 [W0][契约] 定义本次变更的契约和预期失败验证。
  _Trace:_ REQ / GAP / TD / UI section
  _Impact:_ API / SDK / Events / Data / Permission / N/A
  _Boundary:_ `path/or/module`
  _Depends:_ none
  _Verification:_ 契约测试、类型检查或预期失败用例能证明当前缺口存在。
  _Risk:_ 

- [ ] T002 [W0][启动] 建立或验证项目脚手架与本地启动基线。
  _Trace:_ TD / engineering startup requirement / N/A
  _Impact:_ Frontend engineering / Backend engineering / Config / Env / Delivery / N/A
  _Boundary:_ `package.json`, build config, app entry, dev server config
  _Depends:_ none
  _Verification:_ 本地安装、构建或 dev server 冒烟命令可运行；若不适用写 N/A 理由。
  _Risk:_ 

### W1 - 核心实现

- [ ] T003 [W1][实现] 实现满足契约的最小行为。
  _Trace:_ REQ / GAP / TD section
  _Impact:_ Frontend engineering / Backend engineering / Domain model / API / N/A
  _Boundary:_ `path/or/module`
  _Depends:_ T001
  _Verification:_ T001 中定义的验证从失败变为通过。
  _Risk:_ 

- [ ] T004 [W1][UI] 实现 UI 页面、组件和状态覆盖。
  _Trace:_ UI section / REQ section / N/A
  _Impact:_ Frontend engineering / N/A
  _Boundary:_ `frontend/path/or/components`
  _Depends:_ T001, T003
  _Verification:_ 页面、操作、角色、空 / 加载 / 错误 / 禁用 / 边界状态可检查；无 UI 时写 N/A。
  _Risk:_ 

- [ ] T005 [W1][数据-安全-运行] 实现数据、权限、安全、配置或运行支持。
  _Trace:_ TD data/security/NFR section / N/A
  _Impact:_ Data / DB / Migration / Auth / Permission / Security / Jobs / Observability / N/A
  _Boundary:_ migrations, auth modules, config, jobs, observability
  _Depends:_ T001
  _Verification:_ 迁移、权限、安全、配置、后台任务或可观测性验证通过；不适用项写 N/A。
  _Risk:_ 

### W2 - 验证与关闭提示

- [ ] T006 [W2][测试] 补齐自动化与回归验证。
  _Trace:_ acceptance criteria / gap regression / TD verification
  _Impact:_ all applicable yes impacts
  _Boundary:_ tests, fixtures, mocks, e2e specs
  _Depends:_ T003, T004, T005
  _Verification:_ 单元、集成、契约、E2E 或等价证据覆盖正常、异常、边界和权限路径。
  _Risk:_ 

- [ ] T007 [W2][运行] 执行启动验证、回滚检查和观察点确认。
  _Trace:_ TD NFR / engineering startup and rollback requirements / N/A
  _Impact:_ Config / Env / Delivery / Observability / Reliability / N/A
  _Boundary:_ commands, config docs, observability notes
  _Depends:_ T006
  _Verification:_ dev server / service 启动、配置、迁移、回滚或观察命令有记录；不适用项写 N/A。
  _Risk:_ 

- [ ] T008 [W2][Wiki提示] 标记 close 阶段需要回写的长期事实。
  _Trace:_ architecture / product / data / operations change / N/A
  _Impact:_ long-term wiki facts / N/A
  _Boundary:_ 仅在 `03-implementation/report.md` 记录提示；实际 wiki 写入留给 `sf-wiki`
  _Depends:_ T006
  _Verification:_ implementation report 列出需要回写或明确 N/A；不提前写 closure artifact。
  _Risk:_ 

## 6. 验证计划

| 验证区域 | 命令 / 方法 | 覆盖任务 | 证据负责人 |
|---|---|---|---|
| 单元 / 组件 | | | |
| 集成 / 契约 | | | |
| E2E / UI 矩阵 | | | |
| 启动 / 配置 | | | |
| 安全 / 权限 | | | |
| 迁移 / 回滚 | | | |
| 可观测性 / 后台任务 | | | |

## 7. 不在范围

- 

## 8. 未决问题

> 这里的任何阻断问题都应在 spec_review 前退回 requirements、ui_design、technical_design 或 gap_report。

-
