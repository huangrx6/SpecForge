# sf-tasking 参考手册

本文件保存 tasking 阶段的输入选择、字段规则、任务类型、并行波次和停止条件。`SKILL.md` 只保留入口和硬门禁。

## 任务的目标

任务不是普通待办，而是 implementation、code review、verification 共用的对账单。

每个任务至少回答：

| 问题 | 字段 |
|---|---|
| 为什么做？ | `_Trace:_` |
| 改哪里？ | `_Files:_` |
| 怎么证明？ | `_Verification:_` |
| 出问题怎么退？ | `_Rollback:_` |
| 风险是什么？ | `_Risk:_` |

## 输入选择

按 workflow 和 components 读取，不只凭文件存在判断。

| 输入 | 使用条件 | 主要提取 |
|---|---|---|
| `brief.md` / `prd.md` | feature / standard / lite | 目标、MVP、非目标、用户和成功标准 |
| `requirements.md` | feature / standard / lite | 可观察行为、验收标准、边界 |
| `gap-report.md` | bugfix / issue | 复现、根因、修复策略、回归测试 |
| `research.md` | needs_research 或存在 research | 已确认约束、风险、候选结论 |
| `ui-design.md` | UI 适用 | 页面、组件、状态矩阵、Pencil 证据、视觉验证 |
| `technical-design.md` | 技术影响适用 | 影响面、架构、API、数据、安全、配置、NFR |

`components: auto` 是保守值，相关通道默认保留；只有明确 `false` 且上游证据证明不涉及，才跳过。

## 任务字段规则

核心字段：

| 字段 | 要求 |
|---|---|
| `_Trace:_` | 指向具体来源条目或章节，不能只写“见需求” |
| `_Files:_` | 预计写入文件、目录或模块类别，不能写“相关文件” |
| `_Verification:_` | 可执行命令、测试类型、Playwright、人工检查或后续 verification 证据 |
| `_Rollback:_` | 撤回、feature flag、迁移补偿、配置回退，或 N/A + 理由 |
| `_Risk:_` | 风险和防护；低风险写 `N/A - <理由>` |

条件字段：

| 字段 | 何时必填 |
|---|---|
| `_Impact:_` | 涉及 technical design 影响面，或需要证明影响面覆盖 |
| `_Boundary:_` | 并行任务、跨模块、共享契约、迁移、配置、易冲突任务 |
| `_Depends:_` | 有依赖顺序 |
| `_TestCase:_` | 需要 `05-verification/test-cases.md`、Playwright、权限、边界或回归矩阵 |

字段不适用时可省略；如果省略会让实现者猜边界，就写 N/A 理由。

## 任务类型

| 类型 | 必须出现的场景 |
|---|---|
| 脚手架 / 启动基线 | 新项目、新前端 / 后端、构建链变化 |
| 契约 / 失败优先 | API、schema、类型、配置、prompt、SDK、事件、bugfix 回归 |
| 核心实现 | 每个 approved behavior |
| UI 状态 | 有用户可见页面、角色视图、状态矩阵或视觉规范 |
| PC 业务系统规范 | `ui-design.md` 声明采用 PC 端业务系统规范 |
| 数据 / 迁移 | DB、索引、导入导出、文件存储、生命周期 |
| 安全 / 权限 | 登录、角色、审批、上传、外部集成、AI 调用、敏感数据 |
| 后台 / 可靠性 | job、queue、scheduler、并发、幂等、重试、恢复 |
| 自动化验证 | 所有非 discovery workflow |
| Playwright | 浏览器流程、上传、提交、审批、下载、权限、路由、错误提示 |
| 运行 / 回滚 | 配置、启动、迁移、回滚、观测、发布检查 |
| Wiki 提示 | 长期产品、架构、数据、运行、术语、风险变化 |

## UI / PC 规范任务

UI 适用时至少考虑：

- 页面 / 路由 / 组件实现。
- default、loading、empty、error、permission、disabled、success、boundary、responsive、a11y。
- Pencil 导出截图对应的布局、密度和状态反馈。
- Playwright 或 screenshot 视觉验证。

若采用 PC 端业务系统规范，额外列任务或验证点：

- App shell：顶栏 `64px`、侧栏 `208px / 68px`、模块间距 `16px`。
- 控件：button / input / select `32px`，圆角 `8px`。
- 表格：行高 `46px`，表头、hover、固定列、分页。
- Modal / Drawer：尺寸、遮罩、固定头尾、滚动。
- 字体、颜色 token、SVG 图标、aria-label。
- 低分辨率 viewport 不溢出。

## Playwright 任务拆法

有浏览器流程时至少拆成：

1. `05-verification/test-cases.md` 用例矩阵任务。
2. Playwright 脚本或临时脚本编写任务。
3. Playwright 执行与证据登记任务。

用例要覆盖成功路径和至少一个关键失败路径。上传、提交、审批、下载、权限和错误提示不能只用单元测试替代。

## 并行波次

建议结构：

| 波次 | 内容 | 并行规则 |
|---|---|---|
| W0 | 契约、脚手架、测试基线、启动基线 | 共享契约先完成 |
| W1 | 核心实现、UI、数据 / 权限 / 运行支持 | 不共享主要写入文件 |
| W2 | 自动化验证、Playwright、启动 / 回滚 / wiki 提示 | 依赖 W1 |

并行任务必须明确文件 / 模块边界。多个 agent 可能同时工作时，`_Boundary:_` 必填。

## 停止判断

不要生成“看起来完整但其实在猜”的任务。以下情况退回：

- requirements 不可测试或验收标准缺失。
- UI 方向、页面范围、状态矩阵或 Pencil 证据缺失。
- PC 端规范被声明采用，但 ui design 没有核心 token 和偏离项。
- technical design 有关键 `unknown` 或未确认依赖 / 工具链 / 核心决策。
- bugfix 没有根因或回归测试方向。
- refactor 没有行为不变边界。
- 数据迁移、安全权限、发布回滚风险未设计。

## 完成前自检

- 每个来源项都有实现任务和验证任务。
- 每个 task 都能被一个实现者直接执行。
- 每个 task 都能被 code review 对账。
- verification 可以从 tasks 直接生成测试用例矩阵。
- rollback 和 risk 没有空白。
- 没有把 close 的 wiki 内容提前写成报告，只留下回写提示。
