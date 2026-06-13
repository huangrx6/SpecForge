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
