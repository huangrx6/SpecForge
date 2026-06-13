# Upload

上传不是一个按钮，它是一条包含选择、校验、传输、失败恢复和结果反馈的流程。

## Purpose

用于附件、图片、批量导入、模板文件、视频和现场材料上传。

## Anatomy

drop zone / file list / progress / validation message / retry / remove / template download / result summary.

## Variants

- single file：头像、附件。
- multi file：材料、图片。
- import file：Excel/CSV 导入。
- media upload：图片/视频预览。

## Contract

- 写清文件类型、大小、数量、失败重试和删除规则。
- 批量导入要有模板下载、校验结果和错误明细。
- 上传进度必须可见；失败项可单独重试。
- 拖拽区不要占据过大页面空间，除非上传是主任务。

## States

idle / dragging / uploading / partial-success / success / failed / validation-error / disabled.

## shadcn-vue

- Primitive: Button, Progress, Alert, Table, Dialog.
- Project wrapper: FileUploader, ImportPanel, UploadResultTable.

## Anti-patterns

- 失败后只能重新开始。
- 上传格式要求藏在错误后。
- 进度条没有文件级状态。
- 导入成功但不展示新增/失败数量。
