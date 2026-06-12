# Form

## 结构

- 字段分组要按用户任务，不按数据库表。
- 必填、格式、示例和错误说明放在字段附近。
- 提交后要有 loading、成功、失败和可恢复策略。
- 长表单用分步或锚点，不用一个巨长卡片。

## shadcn-vue 映射

- Form / Input / Select / Checkbox / Radio / Switch / DatePicker 可用 shadcn-vue primitive。
- 项目级封装要统一 label、help text、error、required、permission disabled。
