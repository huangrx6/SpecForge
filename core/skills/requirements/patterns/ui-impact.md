# UI Impact Requirements Pattern

用于页面、表单、状态、空态、错误、权限态、文案和可访问性会影响用户可见行为的需求。requirements 不写视觉方案，但要写清 UI design 必须处理哪些行为。

## 什么时候使用

- 需求新增或改变页面、表单、列表、详情、弹窗、导航、移动端或空态。
- 用户可见状态会影响验收：default / loading / empty / error / permission / success。
- 需求涉及微文案、错误提示、恢复路径、响应式、可访问性或多语言。
- UI 方向、组件策略或 Pencil 原型需要根据 requirements 触发。

## 必须问清

- 哪些页面或入口受影响？
- 用户在每个页面的主要动作是什么？
- 默认、加载、空、错误、权限、成功状态如何被用户感知？
- 表单校验错误如何展示，用户如何恢复？
- 是否有响应式、键盘、读屏、焦点或触控目标要求？
- 哪些是 requirements 行为，哪些交给 UI design 决定？

## REQ 模板

| 场景 | REQ 写法 |
|---|---|
| 页面行为 | `WHEN a user opens <page>, THE SYSTEM SHALL expose <primary information/actions> needed for <task>.` |
| 空态 | `IF no records match <condition>, THE SYSTEM SHALL show an empty state with the reason and available recovery action.` |
| 错误态 | `IF <operation> fails, THE SYSTEM SHALL expose the failure reason and a retry or recovery path when available.` |
| 权限态 | `WHILE a user lacks permission for <view/action>, THE SYSTEM SHALL expose a permission-limited state without leaking restricted data.` |
| 表单校验 | `WHEN a user submits invalid input, THE SYSTEM SHALL identify the invalid field and describe the correction needed.` |
| 可访问性 | `THE SYSTEM SHALL keep <critical action/status> available through keyboard and screen-reader accessible labels.` |

## AC 模板

| Given | When | Then | 验证方式 |
|---|---|---|---|
| 页面存在数据 | 用户打开页面 | 系统展示主信息、主操作和当前状态 | E2E / manual |
| 数据为空 | 用户打开页面 | 系统展示空态原因和可执行恢复路径 | E2E |
| 操作失败 | 用户执行操作 | 系统展示错误原因并保留用户输入或状态 | E2E |
| 用户无权限 | 打开受限区域 | 系统不泄露受限数据并展示权限说明 | E2E |

## Downstream Handoff

把以下内容交给 `ui_design`，不要在 requirements 中提前定方案：

- 组件库、布局、颜色、字体、图标、动画。
- Pencil 画布和具体视觉风格。
- 表格列宽、卡片样式、badge 颜色等表现细节。

## 常见漏项

- 只写成功页面，不写 loading / empty / error / permission。
- 把“用弹窗 / 红色 badge / shadcn Table”写成需求。
- 新字段只写编辑表单，不写列表、详情和只读视图。
- 错误态没有恢复路径，权限态泄露受限数据。
- 不写可访问性和响应式触发条件。
