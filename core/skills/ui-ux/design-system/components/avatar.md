# Avatar

## Purpose

Avatar 表示人、组织、系统或智能体身份。它辅助识别，不应成为装饰头像墙。

## Structure

- image：真实头像或组织标识
- fallback：姓名首字、缩写、系统图标
- presence/status：在线、忙碌、离线、异常
- label：需要时展示姓名和角色
- tooltip/popover：完整身份、部门、联系方式或权限
- group：多头像时展示溢出数量

## Variants

- person、team、organization、bot/agent、system
- with-label：列表/详情展示
- avatar-group：协作成员
- selectable：选择成员
- presence：在线状态
- fallback-only：无头像但稳定颜色

## States

- loading、loaded、fallback、broken-image
- online、offline、busy、away
- selected、disabled、permission-hidden
- overflow +N、tooltip-open
- anonymous / deleted-user

## Density

- xs 20px：表格紧凑列
- sm 24-28px：卡片 meta
- md 32-36px：常规列表
- lg 40-48px：详情头部
- group overlap 6-8px，最多显示 4-5 个

## shadcn-vue mapping

- Primitive：Avatar、AvatarImage、AvatarFallback、Tooltip、Popover
- Companions：Badge、HoverCard
- Project wrappers：UserAvatar、OrgAvatar、AgentAvatar、AvatarGroup
- Props：src、name、type、status、size、label、tooltip
- Events：click、profile-open

## Content

- fallback 使用稳定规则，不同页面同一用户颜色一致
- 多人头像 tooltip 展示姓名列表
- 系统/AI 身份和真人身份视觉区分
- 删除用户显示“已删除用户”，不空白
- 不要展示敏感手机号，除非业务需要

## Anti-patterns

- 随机头像或无意义插画降低可信度
- fallback 颜色每次刷新变化
- 头像过大抢走任务内容
- 只展示头像不展示姓名，无法识别
- 头像组无限堆叠
- 在线状态只靠颜色，没有说明
