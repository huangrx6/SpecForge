# Product UI Patterns

后台、管理端、工作台、Dashboard 和高频业务 UI 的 Product UI 总入口。目标不是把后台做成品牌页，而是避免 sidebar + topbar + KPI cards + empty panel 的默认模板。

Product UI 的高级感来自真实工作表面、对象驱动布局、状态覆盖、可信数据和可恢复动作。视觉 signature 必须服务任务、对象、证据和状态。

## 1. Decision Gate

任何 Product UI 页面开画前先回答六个问题；答不上来时，不允许先选 sidebar、卡片或 KPI。

Answer：Primary user、Primary object、Primary job、Decision evidence、Update frequency、Failure path。具体问法是：谁每天用，处理什么对象，第一屏要完成什么动作，行动前要看什么证据，数据窗口和新鲜度是什么，哪类异常最可能推翻页面设计。

写入 `product_ui_quality.primary_user / primary_object / primary_job`，并把证据来源写进 layout audit 或 scan manifest。

Anti-template rule：不要从“后台常见页面”开始，而要从“用户正在处理的对象和下一步动作”开始。每次至少生成两个首屏候选：一个 conservative candidate，一个 signature work-surface candidate。若 conservative candidate 只是 sidebar + topbar + KPI strip + table/card，必须说明为什么被拒绝或如何转成真实工作表面。

## 2. First Viewport Contract

第一屏必须展示真实工作表面。指标和快捷入口只能辅助主任务，不能替代主任务。

First viewport regions：Top control 说明时间范围、业务范围、刷新状态和当前视图；Primary work surface 承载队列、表格、异常列表、时间线、诊断链路、命令面板或实时区域；Metrics 解释工作负载、风险、趋势或阈值；Context rail 承载 SLA、负责人、最近活动、风险说明和上下文操作；Secondary analysis 承载趋势、分布、排名、历史记录、审计或导出。

Forbidden：只有面包屑、搜索框和头像；KPI 卡片后接大空白卡片；只展示大数字和绿色涨幅；4 个通用 icon 快捷入口；为了填满画面继续加卡片。

Primary work surface 只能是 queue、table、inspector、timeline、command surface、anomaly board、workflow map 或 live ops canvas。欢迎语、快捷入口和 KPI strip 都不是 primary work surface。

## 3. Pattern Picker

先选 Product UI pattern。Pattern 同时决定 layout archetype、primary work surface、组件族和 motion boundary；recipe 只补充页型流程，不推翻 pattern。

Pattern map：Command Cockpit -> command surface / command drives page；Object Inspector / Resource Operations -> table + persistent inspector / selected object operations；Anomaly Board / Ops Dashboard -> anomaly + trend + owner / action-oriented prioritization；Evidence Timeline / Dense Review Desk -> timeline or queue + SLA rail / evidence before decision；Workflow Map -> workflow map / process and recovery；Live Ops Canvas -> spatial live operations；Executive Overview -> decision summary / risk and next step。避免把抽象 AI 光效、CRUD 卡片堆叠、KPI wallpaper、无证据待办、无限 loading、无关 3D 背景或假操作工作台当 signature。

Component family defaults：command surfaces 读 Command / AI + Data work；object、review、dashboard、live ops 读 Data work + App shell，按恢复和确认追加 Feedback；workflow / form path 读 Form flow + Data work + Feedback。

用户抱怨“后台太模板 / 太老套 / 想跳出固定页面搭配”时，至少提出一个非传统候选：Command Cockpit、Anomaly Board、Object Inspector、Evidence Timeline 或 Live Ops Canvas。

Selection defaults：工作台 / 控制台 / 后台首页且需要处理对象 -> Dense Review Desk / Resource Operations / Anomaly Board / Command Cockpit；对象管理 -> Object Inspector / Resource Operations；审批 / 审核 / 工单 / 告警 -> Evidence Timeline / Dense Review Desk / Workflow Map；监控和异常响应 -> Anomaly Board / Ops Dashboard / Live Ops Canvas；AI / 运维命令 -> Command Cockpit。

## 4. Recipe Tags

Recipe 只补充流程状态和页面对象，不替代 pattern。

Use recipe tags only to ensure states：AI Assistant -> context-loading / streaming / tool-running / failed；Async Job -> queued / running / partial-success / failed / expired；Form Flow -> draft / validating / submitting / partially-saved；List Detail -> loading / empty / selected / stale / permission；Live Room -> joining / live / paused / ended / low-bandwidth；Login / Member / Permission / Settings -> token, role, conflict, dirty, saved and permission states。

Mobile collapse：非对称布局在 375px 宽度下回到单列；重叠、旋转和 Z 轴层叠触控端默认取消；底部主操作和输入栏考虑安全区与软键盘。

## 5. KPI, Queue, And Blank Budget

KPI 至少满足以下 2 项，否则降级为紧凑统计、表格列、过滤器摘要或状态 tabs：口径、时间窗口、阈值、解释、drilldown 入口、可执行动作。

队列至少写 Object、Status、Priority / SLA、Owner、Time、Next action；重复处理或列表超过 20 条时写 Batch action。只写“待审核订单 12 条”不是队列，只是摘要。

快捷入口必须来自角色任务频率或上下文状态。通用“新增、导出、设置、日志”不能占据 2x2 icon grid；入口必须有当前状态、最近使用、快捷键或角色差异。

第一屏不能把大面积空白包在卡片里。除 loading / empty / error / permission 且有恢复动作外，以下为 high severity：首屏超过 40% 空白 framed area、大卡片只有标题和几行文本、右侧栏被拉满但没有真实密度、卡片存在只是为了“完整”。

## 6. State, Content, And Data

Dashboard / Workbench 至少覆盖 loading、empty、partial、stale、error、permission。必须说明状态 owner：页面、wrapper、数据源、权限系统还是异步任务。

Microcopy：按钮使用动词 + 对象；危险操作写清对象和后果；流程主按钮命名一致；错误说明发生了什么、能做什么、是否可重试；空态区分无数据、筛选无结果和无权限。

Data visualization：趋势用线图，结构占比用条形或堆叠，排名用水平条，实时状态用状态列表 / 时间线 / 轻量趋势，对账 / 审批 / 审计用表格 + 差异标记 + 证据 drawer。图表必须有口径、单位、时间范围、图例和空值解释；图表色来自 chart tokens，不直接复用按钮主色。

## 7. Output Contract

Markdown 输出 Product UI Layout Audit 短表即可；JSON 字段结构由 `contracts/design-contract.schema.json` 和 `references/output-contract.md` 管。

```md
Product UI Layout Audit:
| Item | Decision |
| --- | --- |
| Primary user / object / job | |
| Candidates / Pattern / Layout | conservative + signature candidate, chosen pattern, archetype |
| Primary work surface | queue / table / inspector / timeline / command surface / anomaly board / workflow map / live ops canvas |
| Quality gates | KPI actionability, first viewport budget, context rail purpose, rejected filler |
```

Sync to JSON: `layout`、`state_matrix`、`product_ui_quality`。本文件只定义判断依据和输出含义，不维护第二份字段清单。

## 8. Stop Conditions

- 主要使用者、主要业务对象或主要任务未定义。
- 首屏只有 KPI / 卡片 / 快捷入口，没有真实工作表面。
- 工作台主区域是大空白 framed card。
- 待办列表缺少对象标识、SLA / 优先级、时间或下一步动作。
- 右侧栏被通用快捷入口占满，但没有上下文价值。
- 动效只让卡片动，没有说明状态、对象迁移、证据高亮或进度。
- high severity visual QA issue 没有修正或明确接受理由。

## 9. PC Business System Anchor

PC 业务系统规范的权威数值仍以 `.specforge/core/standards/pc-ui-design-spec.md` 为准。design-system 只引用本次需要的 token 和偏离项，不把完整 token 表复制进每个 artifact。

读取场景：运营后台、管理系统、审批台、配置台、数据管理系统；用户明确要求 PC 端业务系统 UI 规范；页面主体包含筛选、表格、弹窗、抽屉、图表和批量操作。
