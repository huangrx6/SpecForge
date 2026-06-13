# Card

卡片用于承载一组可独立扫描的信息或重复对象。页面 section 不默认做卡片；如果只是为了加背景，优先使用 unframed section 或分隔线。

## Anatomy

| Part | Rule |
|---|---|
| Header | 标题、状态、次要说明；不要塞满操作 |
| Body | 主信息，按扫描顺序排布 |
| Meta | 时间、来源、口径、归属，弱化但可读 |
| Actions | 最多 2 个显性操作，更多进 menu |
| Feedback | loading、empty、error 要在卡片内部闭环 |

## Variants

- entity card：成员、工具、工单、知识条目。
- metric card：指标、趋势、口径和时间范围。
- context card：错误文本、来源、短 ID、引用依据。
- action card：推荐工具或快捷入口，必须有点击反馈。
- media card：图片/视频/直播内容，媒体是主角。

## States

default / hover / selected / focused / loading / empty / error / permission / stale.

## Layout

- Product UI 卡片圆角 6-8px 优先；表达型页面可更大，但必须有理由。
- 指标卡数字、单位、同比/环比要分层。
- 列表卡片宽度稳定，不因内容长短改变高度过大。
- 移动端卡片间距大于内部间距，避免粘连。

## shadcn-vue

- Primitive: Card, Badge, Button, DropdownMenu, Skeleton.
- Project wrapper: EntityCard, MetricCard, ContextCard, ToolCard.

## Anti-patterns

- 卡片套卡片。
- 每张卡都有彩色图标底。
- 大阴影 + 大圆角 + 渐变同时出现。
- 指标无单位、无时间范围、无口径。
- 操作按钮比主信息更抢眼。
