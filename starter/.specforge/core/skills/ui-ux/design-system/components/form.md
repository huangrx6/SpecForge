# Form

表单用于采集、编辑和确认用户输入。表单结构按用户任务组织，不按数据库字段顺序堆叠。

## Anatomy

| Part | Rule |
|---|---|
| Section | 一组用户能理解的任务，例如“基础信息”“通知规则” |
| Field | label、control、helper、error、required、permission |
| Validation | 即时校验 + 提交校验；错误靠近字段 |
| Save area | sticky save bar 或清晰底部按钮 |
| Summary | 高风险提交前展示变更摘要 |

## Variants

- simple form：少于 6 个字段。
- grouped form：多分组配置。
- wizard form：三步以上或强依赖流程。
- inline edit：表格/详情内轻编辑。
- review form：提交前确认和差异摘要。

## States

pristine / dirty / validating / invalid / saving / saved / failed / conflict / permission-disabled.

## Layout

- PC 表单默认 label 左/上都可，但同页面保持一致。
- 长字段使用 helper text，不让 placeholder 承担说明。
- 长表单使用 stepper、锚点或分组，不用一个巨长卡片。
- 移动端字段高度不小于 44px，错误文案不遮挡下一个字段。

## shadcn-vue

- Primitive: Form, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Calendar, Alert.
- Project wrapper: FormField, FormSection, SaveBar, DirtyGuard, ChangeSummary.

## Anti-patterns

- placeholder 当 label。
- 错误只在 toast 里出现。
- 保存失败后用户输入丢失。
- disabled 字段没有解释是权限、状态还是系统限制。
- 必填星号一堆但缺少示例和格式说明。
