# Authoring Module

职责：创建 work item、创建 artifact、同步 wiki 事实。

稳定入口：`create-work.mjs`、`create-artifact.mjs`、`sync-wiki.mjs`。

不要在这里做 gate 决策；gate 只由 `gates` 模块负责。
