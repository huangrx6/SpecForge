# Project Hooks

项目自定义 hook 放在 `hooks/local/`。默认事件实现位于 `core/hooks/events/`。

当前支持 `pre-gate`、`post-gate`、`pre-close`、`on-close`。用于阻断 gate、发送通知、同步内部系统或执行归档前后检查；不要在 hook 中改写 SpecForge artifact。
