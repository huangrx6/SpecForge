# Design Review Rubric

| 维度 | 通过标准 | 失败信号 |
|---|---|---|
| 宿主适配 | 气质、密度、组件和业务场景一致 | 像无关模板 |
| 信息层级 | 主任务、状态、下一步明确 | 用户不知道先看哪里 |
| 组件系统 | 组件规则可复用 | 页面一次性拼装 |
| 状态覆盖 | loading / empty / error / permission 明确 | 只有 happy path |
| 可访问性 | focus、对比度、语义、错误提示可用 | 只靠颜色或图标 |
| 动效 | 服务反馈和空间关系 | 装饰化、抢注意力 |
| 实现友好 | 可映射到 shadcn-vue / 项目组件 | 视觉稿无法落地 |

结论使用：`pass / needs revision / blocked`。
