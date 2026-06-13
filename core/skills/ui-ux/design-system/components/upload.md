# Upload

## Purpose

Upload 用于选择、校验、上传和管理文件。它必须说明格式、大小、数量、进度、失败恢复和安全限制。

## Structure

- dropzone / trigger：点击、拖拽、粘贴
- file list：名称、大小、类型、状态、操作
- validation：格式、大小、数量、病毒/敏感校验
- progress：单文件和总进度
- preview：图片、文档、表格摘要
- actions：删除、重试、替换、下载
- server result：解析成功、部分失败、导入报告

## Variants

- single-file、multi-file、image-upload、avatar-upload
- document-upload：PDF/Word/Excel
- import-upload：上传后解析并入库
- attachment-upload：表单附件
- chunked-upload：大文件分片
- paste-upload：截图或剪贴板

## States

- idle、drag-over、selected、validating
- uploading、uploaded、failed、retrying
- partial-success、virus-risk、file-too-large
- duplicate、unsupported-type、exceed-limit
- preview-loading、parse-failed

## Density

- compact：按钮 + 文件名，适合表单附件
- dropzone：高度 120-180px，适合首用上传
- file row：40-56px，带进度 56-64px
- mobile：使用系统选择器，操作按钮足够大
- 多文件超过 5 个分组或折叠

## shadcn-vue mapping

- Primitive：Button、Progress、Alert、Card、Input、Toast/Sonner
- Companions：Dropzone implementation、Table for import result、Dialog for preview
- Project wrappers：FileUpload、ImageUpload、ImportUpload、AttachmentList
- Props：accept、maxSize、maxCount、multiple、value、uploadState
- Events：select、remove、upload、retry、preview、download

## Content

- 格式说明具体：“支持 .xlsx，单个文件不超过 20MB”
- 失败原因写到文件行，不只 toast
- 上传成功说明后续处理：“已上传，正在解析”
- 导入结果显示成功/失败数量和下载失败明细
- 删除附件要说明是否同时删除服务器文件

## Anti-patterns

- 隐藏格式和大小限制，失败后才告知
- 上传进度只显示全局，用户不知道哪个文件失败
- 失败后必须重新选择所有文件
- 文件名过长撑破布局
- 预览和下载权限不清晰
- 上传成功但后台解析失败没有反馈
