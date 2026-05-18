# Content Editing Capability

用于 Markdown、富文本、预览、上传和安全渲染相关能力选型。

## 适用

- 需要正文编辑、评论编辑、富文本公告、Markdown 文档、预览或导入导出。
- 需要选择 textarea、Markdown preview、富文本编辑器或结构化 block editor。

## 选择矩阵

| 场景 | 推荐 |
|---|---|
| 简单备注、提示词、少量 Markdown | Markdown textarea |
| 需要实时预览、代码块、表格、图片 | Markdown preview editor |
| 需要非技术用户编辑、复杂排版、粘贴图片 | Rich text editor |
| 需要结构化内容块、协同编辑、复杂权限 | 单独立项评估，不默认引入 |

## Design 必填

- 输入格式、输出格式、保存格式。
- 图片 / 附件是否支持，大小和类型限制。
- XSS、HTML 清洗、链接安全策略。
- 空状态、加载、保存失败、冲突覆盖。

## 验证

- 输入边界、非法 HTML、超长内容、图片上传失败。
- 预览和保存结果一致。
- 权限不足不可编辑或不可保存。
