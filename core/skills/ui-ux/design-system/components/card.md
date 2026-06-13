# Card

## Purpose

卡片用于承载一个可独立理解的信息单元或任务入口。它不是页面分区的默认外框；后台系统不能把每个 section 都做成漂浮卡片。

## Structure

- container：边界、背景、radius、shadow 或 hairline 只选一种主表达
- header：标题、说明、状态、主操作，避免塞满工具
- body：核心信息、指标、表单片段或摘要
- footer：次级操作、时间、来源、分页提示
- media / icon：只有能帮助识别业务对象时才出现
- meta：owner、status、time、count、risk 等必须有固定位置

## Variants

- entity：客户、工单、任务、工具入口等可点击对象
- metric：指标卡，突出数值、趋势、口径和更新时间
- setting：配置项卡，包含开关、说明、风险和保存反馈
- summary：详情页摘要，不承担完整编辑
- alert-card：异常、风险、待处理事项，配恢复动作
- selection-card：可选择项目，有 selected / disabled / unavailable 状态

## States

- default、hover、focus-visible、selected、pressed
- loading：使用骨架屏，不让布局跳动
- empty：展示缺失字段，不隐藏结构
- error：局部失败时保留已知数据和重试入口
- permission：可看不可操作、不可看两种要区分
- stale：数据过期时显示更新时间和刷新动作

## Density

- compact：8-12px padding，适合列表卡和移动 H5
- default：16px padding，适合后台内容块
- rich：20-24px padding，适合详情摘要和指标
- grid gap：同组卡片 12-16px，不同区块 24px 以上
- 高度：同一行卡片高度一致，内容过长使用 clamp 或展开

## shadcn-vue mapping

- Primitive：Card、CardHeader、CardTitle、CardDescription、CardContent、CardFooter
- Companions：Badge、Button、DropdownMenu、Skeleton、AspectRatio
- Project wrappers：EntityCard、MetricCard、ToolCard、SettingCard、AlertCard、SelectableCard
- Props：variant、density、selected、loading、status、actions、href
- Slots：headerAction、media、meta、footerAction、empty

## Content

- 标题必须是对象名或任务名，不写“功能”“模块”
- 说明只写帮助决策的信息，避免营销口号
- 指标卡必须带单位、口径或更新时间
- 操作文案放在 footer/action，不藏在正文末尾
- 卡片内图标应和业务对象一致，不统一贴彩色方块

## Anti-patterns

- 用卡片包卡片，形成廉价层层阴影
- 每张卡都有大图标、粉色底、圆角背景，像模板宫格
- 卡片可点击但没有 hover/focus/pressed 反馈
- 卡片承担太多编辑能力，变成小页面
- 不同卡片边距和标题层级不一致
- 用阴影代替信息层级
