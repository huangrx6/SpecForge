# Select Combobox

## Purpose

选择器用于从有限选项中选择；Combobox 用于可搜索、远程或大数量选择。不要用自由输入代替受控选项。

## Structure

- trigger：当前值、placeholder、clear、loading
- popover：search、option list、empty、create option
- option：label、description、meta、disabled reason、selected check
- multi-value：chips、折叠数量、清空
- async：加载、错误、重试、分页或无限滚动
- footer：新建、管理选项、最近使用

## Variants

- single-select、multi-select、remote-search、creatable
- cascader-like：层级关系，可用 Command 分组
- native-select：移动端或简单枚举
- tags-input：自由标签但需校验和去重
- entity-picker：选择用户、组织、客户、工具

## States

- empty、open、focused、selected、disabled
- loading-options、option-error、no-results
- partial-selected：多选或树形选择
- max-selected：达到上限
- stale-options：选项过期或对象被删除
- permission-limited：某些选项不可选

## Density

- compact trigger：32px，筛选栏
- default trigger：36-40px，表单
- mobile：44px，popover 全宽或 bottom sheet
- option height：32-40px，带描述 48-56px
- 多选 chips 超过 2 行折叠为 +N

## shadcn-vue mapping

- Primitive：Select、Combobox、Command、Popover、TagsInput、NativeSelect、Checkbox
- Companions：Avatar、Badge、Skeleton、Button
- Project wrappers：EntitySelect、RemoteCombobox、MultiSelect、UserPicker、TagPicker
- Props：mode、options、value、remote、searchable、clearable、max、disabledReason
- Events：search、select、clear、create、load-more

## Content

- placeholder 写“选择预审批人”，不写“请选择”即可完事
- 选项 label 用人能识别的名称，meta 放手机号/部门/编码
- 无结果写“没有匹配的人员”，并保留搜索词
- 不可选选项写原因：“已停用”“无权限”
- 远程搜索提示输入门槛：“输入至少 2 个字搜索”

## Anti-patterns

- 选项很多但没有搜索
- 远程加载失败时 popover 空白
- 多选值撑爆输入框
- 用接口枚举值当展示文案
- 清空和删除单项交互混乱
- 移动端小弹层被键盘遮挡
