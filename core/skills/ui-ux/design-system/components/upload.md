# Upload

上传组件用于附件、图片、批量导入和模板文件。

## Contract

- 写清文件类型、大小、数量、失败重试和删除规则。
- 批量导入要有模板下载、校验结果和错误明细。
- 上传进度必须可见；失败项可单独重试。
- 拖拽区不要占据过大页面空间，除非上传是主任务。

## States

idle / dragging / uploading / partial-success / success / failed / validation-error / disabled.

## shadcn-vue mapping

- Primitive: Button, Progress, Alert, Table, Dialog.
- Project components: FileUploader, ImportPanel, UploadResultTable.
