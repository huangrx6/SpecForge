# Avatar

头像用于人、组织、机器人或系统身份。头像不是装饰点缀，必须帮助用户区分身份。

## Anatomy

image / initials / fallback color / status / tooltip / role badge.

## Variants

- user avatar：真人。
- agent avatar：AI / 机器人。
- org avatar：组织。
- system avatar：系统任务。

## States

default / loading / image-failed / online / offline / busy / disabled / permission-hidden.

## Rules

- 无图片时使用姓名首字或稳定色块，不随机变化。
- 机器人 / AI / 系统账号要与真人身份可区分。
- 在线状态、权限状态和告警状态不要全部叠在头像上。

## shadcn-vue

- Primitive: Avatar, Tooltip, Badge.
- Project wrapper: UserAvatar, AgentAvatar, OrgAvatar.

## Anti-patterns

- 用随机渐变头像。
- 头像无 alt / tooltip。
- 小尺寸头像承载过多角标。
