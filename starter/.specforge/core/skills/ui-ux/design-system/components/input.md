# Input

输入框用于用户输入文本或查询条件。搜索型、表单型、只读复制型和敏感型输入需要不同封装。

## Anatomy

| Part | Rule |
|---|---|
| Label | 与字段关联，placeholder 不替代 label |
| Control | 输入区域，compact 32px / comfortable 36-40px / mobile 44px |
| Prefix/Suffix | 搜索、单位、清除、复制、显示隐藏 |
| Helper | 格式、范围、来源、隐私说明 |
| Error | 告诉用户如何修复 |

## Variants

- text input：普通文本。
- search input：带搜索图标、清除按钮、loading。
- mobile input：触控目标 44px，键盘类型匹配。
- copyable input：只读 + copy action + copied feedback。
- secret input：显示/隐藏、复制和安全提示。
- token input：标签/关键词输入。

## States

default / hover / focus / filled / disabled / readonly / error / warning / loading / success.

## Content

- label 命名业务对象，不命名数据库字段。
- placeholder 给例子，不给说明。
- helper text 说明格式、范围、隐私或来源。
- 错误文案告诉用户如何修复。

## shadcn-vue

- Primitive: Input, Label, FormControl, FormMessage.
- Project wrapper: SearchInput, MobileInput, CopyableInput, SecretInput, TokenInput.

## Anti-patterns

- 大面积浅蓝底输入框伪装 focus。
- 所有输入都无边框，用户无法判断可编辑区域。
- focus 改变高度或推开布局。
- 手机号/数字字段没有合适 keyboard。
