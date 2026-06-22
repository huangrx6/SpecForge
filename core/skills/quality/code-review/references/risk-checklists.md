# Code Review Risk Checklists

本文件集中维护 code review 的风险检查清单。只读取与真实 diff 风险相关的 section；不要为了填表全量套用。

## Security / Auth / Data

| 检查项 | Fail signal |
| --- | --- |
| 授权边界 | 对象级授权缺失、只靠前端隐藏按钮、角色条件未覆盖 |
| 身份与会话 | token / cookie 处理不安全，登录态被写入仓库或日志 |
| 输入校验 | 用户输入直接进入 SQL、HTML、命令、文件路径或外部请求 |
| 敏感信息 | secret、账号、token、个人敏感数据进入代码、日志、截图或测试夹具 |
| 数据隔离 | 多租户、部门、角色、用户数据可交叉访问 |
| 审计 | 高风险操作缺少必要审计记录或 actor 信息 |
| 外部调用 | 未授权外部服务、未知 endpoint、缺少超时 / 重试 / 限流 |

P0 / P1 优先于所有风格建议。

## Correctness / Error Handling

| 检查项 | Fail signal |
| --- | --- |
| 正常路径 | 关键用户路径未实现或返回错误结果 |
| 失败路径 | catch 后吞错、错误文案误导、状态没有恢复 |
| 边界值 | 空、null、undefined、0、超长、重复、非法枚举未处理 |
| 回退策略 | 外部依赖失败时没有 fallback、重试或用户可见反馈 |
| 事务一致性 | 部分写入后无补偿或回滚 |
| 幂等 | 重复提交、重试、刷新导致重复创建或重复扣减 |
| 可观测性 | 关键失败没有日志、trace id 或可诊断上下文 |

## Concurrency / Idempotency

| 检查项 | Fail signal |
| --- | --- |
| 重复提交 | 刷新、重试、双击导致重复任务或重复写入 |
| 并发写 | 缺少锁、唯一约束、乐观并发或事务保护 |
| 后台任务 | 重试不幂等、失败恢复不清楚、死信无处理 |
| 事件处理 | 乱序、重复、延迟消息会破坏状态 |
| 状态机 | 非法状态跳转未阻止 |
| 外部回调 | webhook 重放或重复投递未处理 |

## API Contract

| 检查项 | Fail signal |
| --- | --- |
| 请求契约 | 参数名、类型、必填项、默认值与 spec 不一致 |
| 响应契约 | 缺少字段、状态码错误、错误结构不稳定 |
| 兼容性 | 破坏现有调用方且无迁移说明 |
| 认证授权 | API 未按角色 / 权限 / tenant 校验 |
| 超时重试 | 外部 API 缺少 timeout、retry、rate limit 或 fallback |
| 版本化 | 公开 API 变更未说明版本、兼容期或弃用路径 |
| 测试 | 缺少 contract / integration 覆盖 |

## Data / Migration

| 检查项 | Fail signal |
| --- | --- |
| schema 变更 | migration 缺失、字段类型不兼容、默认值危险 |
| 回填 | 历史数据没有处理策略 |
| 索引 | 新查询缺索引或索引影响未说明 |
| 回滚 | migration 不可回滚且风险未记录 |
| 数据保留 | 删除 / 覆盖数据缺少确认和审计 |
| 兼容部署 | 代码和数据库变更不能安全滚动发布 |
| 验证 | 缺少 migration dry-run、集成测试或数据检查 |

## Dependency / Env / Config

| 检查项 | Fail signal |
| --- | --- |
| 新依赖 | 未在 spec / tasks / implementation report 中确认用途、风险和许可证 |
| 锁文件 | lockfile 变更无说明或和 package 变更不一致 |
| 环境变量 | 新 env 缺少示例、默认值、验证和部署说明 |
| 配置默认值 | 默认值可能破坏生产、安全或成本 |
| feature flag | 开关缺少 rollout、rollback 或默认策略 |
| secrets | secret 写入代码、测试、日志、截图或仓库 |
| 构建运行 | 缺少启动、构建、健康检查或失败排查说明 |

## UI State / A11y

| 检查项 | Fail signal |
| --- | --- |
| 状态覆盖 | 只有 default，没有 loading / empty / error / permission / disabled / success |
| 角色差异 | 管理员和普通用户视图未区分 |
| 错误反馈 | 后端失败后页面无提示、按钮状态不恢复 |
| 表单 | 校验、提交中、防重复提交、清空、重试缺失 |
| 可访问性 | 交互控件无可访问名称、键盘不可达、焦点丢失 |
| 响应式 | 关键内容移动端或低分辨率遮挡 / 溢出 |
| 证据 | UI 变更缺截图、Playwright 或人工验证记录 |

## Tests / Evidence

| 检查项 | Fail signal |
| --- | --- |
| 来源覆盖 | REQ / AC / GAP / task / review finding 没有对应测试或跳过理由 |
| 失败路径 | 只测 happy path |
| 自动化 | 高风险路径没有 unit / integration / contract / E2E 证据 |
| 启动验证 | 无 build、typecheck、server start、health check 或等价证据 |
| UI 证据 | 有浏览器流程但无 Playwright、截图、trace 或人工验证 |
| Deferred | 延后验证没有 owner、影响和重新验证触发条件 |
| 证据强度 | 高风险结论只有 claimed，没有 observed / proven |
