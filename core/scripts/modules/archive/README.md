# Archive Module

职责：work item 归档、registry 更新和关闭后的只读留存。

稳定入口：`archive-work.mjs`。

归档前必须由 `sf-close` 完成 release、rollback、wiki sync 和 archive dry-run。
