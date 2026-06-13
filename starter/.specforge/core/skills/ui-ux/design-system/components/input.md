# Input

用于单行文本、搜索、手机号、账号、短 ID 等输入。

## Contract

| 项 | 规则 |
|---|---|
| Height | compact 32px, comfortable 36-40px, mobile 44px |
| States | default / hover / focus / disabled / error / loading / readonly |
| Help | placeholder 不替代表单说明；复杂字段用 helper text |
| A11y | label 必须可关联；错误提示必须可读 |

## shadcn-vue mapping

- Primitive: Input, Label, FormControl, FormMessage.
- Project components: SearchInput, MobileInput, CopyableInput, SecretInput.

## Anti-cheapness

- 不用大面积浅蓝底输入框伪装 focus。
- 不把所有输入都做成无边框；后台表单需要明确可编辑边界。
