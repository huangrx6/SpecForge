# Data / File Pattern

用于上传、导入、导出、解析、数据口径、去重、结果地址和字段变更。

## 覆盖项

- 输入格式、大小、编码、必填字段。
- 解析成功、部分成功、失败。
- 数据校验、重复、空值、非法值。
- 结果展示、下载、导出、审计。
- 新增字段影响哪些页面：表单、列表、详情、只读、导出、API。

## 输出

```md
| REQ-DATA-001 | MUST | WHEN a user uploads a file with invalid rows, THE SYSTEM SHALL report row-level validation errors without importing invalid rows. | source | AC-DATA-001 |
```
