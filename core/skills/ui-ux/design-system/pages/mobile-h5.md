# Mobile H5 Page

适用于嵌入 App 的 H5、现场办公、单点登录后的轻量页面和移动助手。

## Layout

- 首屏只放主任务、上下文和关键操作；弱化复杂导航。
- 底部输入或按钮需要考虑安全区、软键盘和滚动锚定。
- 工具入口要有触发反馈，尤其 concat / append 类操作需要聚焦输入框或显示已追加状态。

## States

login-redirect / token-loading / default / keyboard-open / network-error / expired / no-permission.

## Components

MobileShell, StickyInputBar, QuickToolGrid, ContextToast, SafeAreaFooter.
