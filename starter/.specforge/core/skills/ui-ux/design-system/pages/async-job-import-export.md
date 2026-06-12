# Async Job Import Export Page

适用于导入、导出、批处理、同步任务和 AI 处理任务。

## 页面结构

- 创建任务：上传 / 参数 / 预检查。
- 任务列表：状态、进度、耗时、创建人、失败原因。
- 任务详情：输入、输出、日志、重试、下载。

## 状态

queued / running / success / partial-success / failed / canceled / expired。

## 规则

- 长任务必须有进度、刷新、失败恢复和审计记录。
- 下载链接过期要说明。
- 失败要区分参数错误、系统错误、权限错误和部分失败。
