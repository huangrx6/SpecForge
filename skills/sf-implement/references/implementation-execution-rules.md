# Implementation Execution Rules

本文件保存 implementation 阶段的细则。`SKILL.md` 只保留入口、执行序列和硬门禁。

## 实现的核心定义

实现完成不是“代码写完”。必须同时满足：

| 维度 | 要求 |
|---|---|
| Code | 真实文件改动在批准边界内 |
| Task | tasks 状态已更新，且状态语义准确 |
| Evidence | 快速验证、失败优先验证或可信 N/A 已记录 |
| Diff | `changed-files.md` 覆盖真实 git diff |
| Report | implementation report 能解释策略、偏离、风险和 code review 重点 |

## 失败优先验证

行为变更默认先写或定位一个会失败的验证，再写生产代码使其通过。

适用：

- 业务规则、权限、API、数据处理、状态机、表单校验、UI 流程、bugfix 回归。
- 用户可见流程：优先准备 Playwright 用例或可重复手工步骤。

允许先做结构性准备的场景：

- 官方脚手架 / 模板初始化。
- 安装依赖、生成 lockfile、创建测试框架配置。
- 纯文档、纯配置登记、删除无引用死文件。
- 为测试可运行而做的最小 harness。

这些场景仍必须记录验证方式：安装、构建、typecheck、启动、diff 对账、截图或人工检查。不能把“暂时不用测”写成完成。

## Task 状态语义

| 状态 | 使用条件 |
|---|---|
| `DONE` | 代码、验证、changed-files 和 task 勾选四者一致 |
| `DONE_WITH_CONCERNS` | 已实现，但有 code review / verification 必须特别看的风险 |
| `BLOCKED` | 环境、权限、依赖、外部服务或工具阻塞 |
| `NEEDS_SPEC` | 发现规格缺口、边界不足或需要扩大范围 |

不要用 `DONE` 掩盖未验证、未登记 diff、未解决风险或待用户确认。

## 边界检查

每次编辑前问：

- 文件是否在 task `_Files:_` 内？
- 是否被 `_Boundary:_`、requirements、gap report、ui design 或 technical design 批准？
- 是否改变了 technical design 里被标记为 `no` 的影响面？
- 是否把 `unknown` 当成实现决策？
- 是否引入新直接依赖、工具链、框架、云服务、AI provider 或安全敏感配置？

任一答案不清楚，先停。无法从 artifact 证明，就不是已批准边界。

## UI 实现规则

读取顺序：

0. `ui-design.md#Design Contract Summary`
1. `ui-design.md#4 Visual Style Brief`
2. `ui-design.md#5 信息架构`
3. `ui-design.md#6 影响范围`
4. `ui-design.md#9 Pencil 原型证据`
5. `ui-design.md#10 Interaction State Matrix`
6. `ui-design.md#15 UI 验证策略`

实现要求：

- 以 Pencil 导出截图作为布局、密度、状态反馈和交互参照。
- 不在实现阶段重新选择主色、字体、圆角、组件形态或信息密度。
- 使用 Design Contract Summary 声明的 token source、component strategy、project wrapper、motion source 和 anti-slop rules。
- 不直接在页面堆 shadcn-vue primitive；权限、加载、错误、空态、远程数据、审计或批量操作必须进入 project wrapper 或 domain component。
- 不硬编码 hex / rgb / arbitrary spacing 来绕过 token；确需新增 token，回到 technical design 或 tasks 说明。
- Vue 动效实现优先使用 CSS transition 或已确认的 Motion Vue / Vue Bits / GSAP 方案；未经确认不得新增动效依赖。
- 保留可访问选择器：优先 role、label、可见文本；必要时补 `data-testid`。
- 若 `ui-design.md` 声明采用 PC 端业务系统规范，读取 `pc-ui-design-spec.md` 并使用其 token。

PC 规范实现自检：

| 项 | 通过标准 |
|---|---|
| App shell | 顶栏 `64px`、侧栏 `208px / 68px`、模块间距 `16px` |
| 控件 | button / input / select `32px`，圆角 `8px` |
| 表格 | 行高 `46px`，表头 `#F5F7FA`，hover `#F5F7FA` |
| 字体 | 中文阿里巴巴普惠体，英文/数字 D-DIN EXP |
| 主色 | `#277DEA`、hover `#4998FC`、active `#1D6BD0` |
| HTML/CSS | 使用规范 token，不接受 UI 库默认主题 |

Design-system 实现自检：

| 项 | 通过标准 |
|---|---|
| Token | 使用 semantic token / CSS variables / Tailwind theme，不散落硬编码值 |
| Wrapper | 页面级复杂交互通过 project wrapper 或 domain component 承接 |
| State | default / loading / empty / error / permission / success 中适用项有实现路径 |
| Motion | 符合 motion boundary，支持 reduced motion，动效服务状态或空间关系 |
| Anti-slop | 无嵌套卡片、通用渐变、无意义 icon tile、灰字压彩底、文本溢出 |
| Evidence | 截图、DOM、a11y、responsive 或 visual verification hooks 已记录 |

## 技术实现规则

从 `technical-design.md#0. 影响面与读取计划` 建立实现表：

| Approved status | 实现规则 |
|---|---|
| `yes` | 必须落到代码 / 配置 / 文档变更、关联任务和快速验证 |
| `no` | 不得出现未经批准 diff；发现必须改时退回 spec |
| `unknown` | 不得直接实现；先退回澄清 |
| N/A | 写明不适用理由 |

新增依赖、环境变量、迁移、外部调用、权限路径、安全配置、后台任务、可观测性变化，都必须有 technical design 或 task 依据。

## Diff 对账

收尾时三方一致：

| 来源 | 用途 |
|---|---|
| `01-spec/tasks.md` | 预期范围、文件、验证、回滚 |
| `03-implementation/report.md` + `changed-files.md` | 实施者声明 |
| `git status` / `git diff` | 仓库事实 |

常见阻断：

- 真实 diff 未登记。
- 未追踪文件未说明。
- 登记文件没有真实 diff。
- task 标记完成但没有验证或 N/A。
- diff 超出批准边界但 report 没有偏离说明。

## 报告写法

`03-implementation/report.md` 至少说明：

- 本次实现策略和主要取舍。
- 每个 task 的状态、文件、验证。
- 失败优先验证证据，或无法失败优先的原因和替代证据。
- technical design 影响面对账。
- UI / PC 规范实现备注和待 verification 视觉证据。
- 偏离、补偿、已知缺口和 code review 重点。

`03-implementation/changed-files.md` 每行都要能回答：为什么改、哪个 task、哪个批准边界、怎么验证、风险是什么。
