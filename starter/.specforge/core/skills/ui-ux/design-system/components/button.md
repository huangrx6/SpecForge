# Button

## Purpose

按钮表示用户主动触发的命令。它只用于立即可执行的动作，不承担状态展示、导航标签或装饰职责；每个区域只能有一个真正主动作。

## Structure

- root：固定高度、圆角、focus ring、禁用和 loading 不改变尺寸
- label：动词 + 对象，必要时带范围，例如“导出当前筛选”
- icon：左侧表达动作类型，右侧只用于下拉、跳转或展开
- affordance：loading spinner、success tick、danger confirm、permission reason
- group：ButtonGroup 用于同级工具，主次关系必须通过 variant 和顺序表达

## Variants

- primary：当前区域最重要的提交/创建动作，区域内唯一
- secondary / outline：次级动作、筛选、导出、取消
- ghost：工具栏、表格行内、低强调命令
- destructive：删除、停用、覆盖、撤回，必须配确认或可撤销反馈
- link：真实跳转或查看详情，不用于提交
- icon / split / button-group：高频工具、密集表格、更多动作集合

## States

- default、hover、active、focus-visible、disabled
- loading：保留宽度，禁止重复提交，文案改为“保存中”而不是只转圈
- success：短暂反馈或提交后进入结果页，不让按钮长期变绿
- permission-disabled：可见但不可点时必须说明角色、状态或前置条件
- danger-pending：危险动作进入确认弹层或二次点击倒计时
- network-retry：失败后保留输入并提供“重试”

## Density

- compact：28-32px，高频表格/工具栏，label 2-4 字或 icon-only
- default：36-40px，后台表单和页面操作
- large：44-48px，移动端底部操作、关键 CTA
- icon：宽高一致，sm/default/lg 分别对应行高，不随 hover 变形
- group：按钮间距 0 或 4px，分组之间 8-12px

## shadcn-vue mapping

- Primitive：Button、ButtonGroup、DropdownMenu、Tooltip、AlertDialog、Spinner
- Companions：lucide-vue-next icons、Kbd、Separator
- Project wrappers：AppButton、IconButton、ConfirmButton、PermissionButton、SplitButton、AsyncButton
- Props：variant、size、loading、disabledReason、icon、confirm、permission、asChild
- Events：click、confirm、cancel、retry；loading 时吞掉重复 click

## Content

- 优先写“保存配置”“创建问题单”“导出报表”，避免“提交”“确定”“操作”
- 危险按钮写清后果，例如“删除成员”优于“删除”
- 批量按钮带数量，例如“禁用 12 个账号”
- 权限不可用文案说明原因：“仅管理员可操作”
- loading 文案和最终 toast 用同一动作词

## Anti-patterns

- 一屏多个 primary 并列，用户无法判断主任务
- 用按钮当 tab、badge、链接或卡片装饰
- icon-only 没有 aria-label / tooltip
- disabled 后不解释原因，造成死按钮
- 危险操作只换红色，没有确认、撤销或后果文案
- 按钮高度、圆角、图标尺寸在页面里临时写死
