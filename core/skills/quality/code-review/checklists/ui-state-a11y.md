# UI State / A11y Checklist

| 检查项 | Fail signal |
| --- | --- |
| 状态覆盖 | 只有 default，没有 loading / empty / error / permission / disabled / success |
| 角色差异 | 管理员和普通用户视图未区分 |
| 错误反馈 | 后端失败后页面无提示、按钮状态不恢复 |
| 表单 | 校验、提交中、防重复提交、清空、重试缺失 |
| 可访问性 | 交互控件无可访问名称、键盘不可达、焦点丢失 |
| 响应式 | 关键内容移动端或低分辨率遮挡 / 溢出 |
| 证据 | UI 变更缺截图、Playwright 或人工验证记录 |
