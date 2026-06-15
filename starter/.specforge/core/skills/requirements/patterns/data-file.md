# Data / File Requirements Pattern

用于上传、导入、导出、解析、字段变更、数据口径、去重、结果地址、文件下载和数据展示。

## 什么时候使用

- 需求涉及文件上传、批量导入、报表导出、模板下载或数据解析。
- 需求新增、修改或删除字段。
- 需要定义数据口径、筛选条件、排序、分页、去重、校验或空值处理。
- 数据会同时出现在表单、列表、详情、只读视图、导出、API 或通知里。

## 必须问清

- 输入格式、大小、编码、模板版本和必填字段是什么？
- 非法值、重复值、空值、未知字段、部分成功如何处理？
- 导入结果如何展示：成功数、失败数、行级错误、下载错误文件？
- 新增字段影响哪些读取或展示页面：新增/编辑表单、列表、详情、只读、导出、API、通知？
- 数据口径如何定义，是否需要时间窗口、权限范围或去重规则？
- 失败后是否可以重试、回滚或人工修正？

## REQ 模板

| 场景 | REQ 写法 |
|---|---|
| 文件校验 | `WHEN a user uploads <file type>, THE SYSTEM SHALL validate format, size, required fields, and row-level values before import completion.` |
| 部分成功 | `IF an import contains valid and invalid rows, THE SYSTEM SHALL import valid rows and report row-level validation errors for invalid rows.` |
| 导出 | `WHEN a user exports <data>, THE SYSTEM SHALL include only records visible to the user and expose the export result or failure state.` |
| 字段影响面 | `WHEN <field> is added or changed, THE SYSTEM SHALL expose the field consistently in <form/list/detail/export/API> where applicable.` |
| 数据口径 | `THE SYSTEM SHALL calculate <metric> using <filters/window/deduplication rule> as the source of truth.` |

## AC 模板

| Given | When | Then | 验证方式 |
|---|---|---|---|
| 上传文件满足格式和字段要求 | 用户提交导入 | 系统完成导入并展示成功数和结果入口 | E2E |
| 文件包含非法行 | 用户提交导入 | 系统阻止或跳过非法行并展示行号、字段和错误原因 | E2E / automated |
| 用户只拥有部分数据权限 | 执行导出 | 导出文件只包含用户可见数据 | automated / inspection |
| 新字段已确认进入范围 | 打开列表、详情、导出和只读视图 | 字段在所有适用读取面一致展示或写明 N/A 理由 | manual / E2E |

## 常见漏项

- 只写上传成功，不写非法格式、部分成功、重复数据和空文件。
- 新增字段只写表单，不枚举列表、详情、只读、导出和 API。
- 只写“导出数据”，不写权限范围、字段范围、结果状态和失败处理。
- 把解析库、存储路径或数据库字段写进 requirements。
- 忘记大文件、超时、取消、重试和审计。
