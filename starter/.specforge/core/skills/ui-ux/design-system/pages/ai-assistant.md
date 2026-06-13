# AI Assistant Page

适用于聊天助手、问答、知识库诊断、工具调用和自动发送问题场景。

## Layout

- 主区域优先消息流和输入框；工具、上下文、历史记录放次级区域。
- 自动发送问题时先展示来源和问题摘要，再进入回答流。
- 长错误信息要折叠展示，保留复制、展开和重新提问。
- 输入框固定在底部或主交互区，移动端避免被键盘遮挡。

## States

default / context-loading / auto-send-pending / streaming / tool-running / answer-ready / failed / no-permission / expired-context.

## Components

ChatInput, MessageBubble, SourceContextCard, ToolCallStatus, SuggestedActions, ErrorContextPreview.

## Anti-cheapness

- 不用大面积渐变背景掩盖消息层级。
- 不把推荐工具做成四个同质大卡片，必须有图标、标题、说明和触发效果。
