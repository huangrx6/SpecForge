# Layout Archetypes

布局不是装饰；布局要表达内容关系。选择 archetype 时必须说明为什么适合当前页面。

## Product UI

| Archetype | Best for | Notes |
|---|---|---|
| Command Surface | AI 工具、快捷操作、全局搜索 | 输入、推荐、历史、工具状态要同屏可见 |
| Resource Table | 数据管理、用户列表、工单 | 筛选、批量操作、列设置、空错权加载 |
| Split Inspector | 列表 + 详情、消息 + 上下文 | 左侧扫描，右侧决策；移动端变 drawer |
| Workflow Timeline | 诊断、审批、导入、排障 | 步骤、当前状态、失败恢复清楚 |
| Ops Dashboard | 监控、指标、告警 | 摘要、趋势、异常、责任入口 |
| Review Desk | 审批、审核、风控、工单处理 | 状态 tabs、待处理队列、SLA、详情 drawer 和批量动作 |
| Resource Operations | 用户、订单、资源、合同管理 | 工具栏、主表格、右侧 inspector、列设置和批量处理 |

## Product UI selection rules

| 输入信号 | 首选 archetype | 不要选 |
|---|---|---|
| 工作台 / 控制台 / 后台首页，且用户需要处理对象 | Review Desk / Resource Operations / Ops Dashboard | Generic SaaS shell |
| 页面核心是用户、订单、合同、资源等对象管理 | Resource Operations / Split Inspector | KPI-only Dashboard |
| 页面核心是审批、审核、工单、告警处理 | Review Desk / Workflow Timeline | Quick action grid |
| 页面核心是监控和异常响应 | Ops Dashboard | 静态指标墙 |
| 页面核心是 AI / 运维命令 | Command Surface | 表单卡片堆叠 |

Product UI 第一屏必须有 `primary work surface`：queue、table、inspector、timeline、command surface 或 anomaly board。KPI、快捷入口和欢迎语都不是 primary work surface。

## Brand Surface

| Archetype | Best for | Notes |
|---|---|---|
| Thesis Hero | 有强对象或强价值表达 | 首屏必须显示真实产品/对象/场景 |
| Editorial Split | 内容和视觉资产并重 | 移动端先读主信息，再看资产 |
| Asymmetric Bento | 多能力展示 | 每个格子的大小要代表重要性 |
| Cinematic Scroll | 活动页、品牌页、大屏 | 动效要有叙事，不隐藏关键信息 |

## Mobile collapse

- 非对称布局在 375px 宽度下必须回到单列。
- 重叠、旋转和 Z 轴层叠在触控端默认取消。
- 底部主操作和输入栏要考虑安全区与软键盘。
- 不使用固定整屏高度承载长内容；内容必须可滚动或拆分。

## Anti-patterns

- 所有 section 都是同宽卡片。
- 先画装饰背景，再往上放内容。
- 移动端只是桌面缩小版。
- 表格页硬做 bento，导致扫描效率下降。
- 工作台首屏只有 KPI strip、大空白卡片和快捷入口。
- 右侧栏用通用 icon grid 填充，而不是承载 SLA、最近活动、上下文操作或异常解释。
