# Input

## Purpose

输入框用于短文本、数字、搜索和命令触发。它不是长说明、选择器或复杂对象编辑的替代品。

## Structure

- label / external label：永远保留字段语义
- control：输入区域、prefix、suffix、clear、visibility toggle
- helper：格式、示例、限制、来源
- message：错误、警告、成功、异步校验状态
- counter：长度、额度、剩余次数等必要约束
- addon：单位、域名、协议、货币符号等

## Variants

- text、password、search、number、currency、phone、url
- textarea：多行描述，带最小/最大高度
- input-group：带前后缀、按钮或复制动作
- otp / pin：短验证码或安全码
- command-input：触发搜索、过滤、AI 提问
- readonly-display：可复制但不可编辑的信息

## States

- empty、filled、focused、disabled、readonly、invalid
- validating：手机号、账号、唯一性等异步校验
- suggesting：显示自动补全或历史项
- truncated：只读长文本用 tooltip 或复制
- composition：中文输入法期间不要提前提交
- clearable：清空后恢复 helper 和空态

## Density

- compact：28-32px，表格筛选和工具栏
- default：36-40px，表单字段
- large：44-48px，移动端输入和 AI 输入栏
- textarea：最小 96px，长内容可 resize 或自动增高
- addon 宽度固定，避免输入时布局抖动

## shadcn-vue mapping

- Primitive：Input、Textarea、InputGroup、Label、Field、Button、Tooltip
- Companions：NumberField、PinInput、TagsInput、Command、Popover
- Project wrappers：SmartInput、SearchInput、MoneyInput、PhoneInput、CopyInput、AiPromptInput
- Props：type、modelValue、state、clearable、prefix、suffix、maxLength、validateStatus
- Events：input、change、clear、enter、composition-start/end、copy

## Content

- placeholder 写示例：“请输入 11 位手机号”，不写 label 重复项
- helper 写规则和影响：“用于接收审批通知”
- 错误要可执行：“手机号格式不正确”
- 单位放 suffix，不混入输入值
- 搜索框可写对象范围：“搜索客户、手机号或工单号”

## Anti-patterns

- 只靠 placeholder 表达字段含义
- 把多个语义塞进一个输入框，例如姓名+手机号
- 错误态只改红边，没有文字
- prefix/suffix 和文字拥挤，移动端被遮挡
- 数字输入没有单位、精度、最小最大值
- AI 输入栏没有发送/处理中/失败重试状态
