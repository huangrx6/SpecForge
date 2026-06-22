# Coverage Patterns

按需求风险选择 1-3 个 pattern，不要全量展开。命中的 pattern 必须写入 `Applied Requirement Patterns`，并把常见漏项转成 AC、NFR、Out of Scope 或 Pending。

## Pattern Index

| Pattern | 使用场景 |
| --- | --- |
| `role-permission` | 多角色、管理员、审批、可见性、导出、敏感数据、跨组织访问 |
| `workflow-state` | 状态机、审批、异步任务、撤回、重试、失败恢复、发布上线 |
| `data-file` | 文件上传、导入导出、字段变更、数据口径、模板、下载 |
| `ai-quality` | LLM、分类、推荐、抽取、生成、工具调用、RAG、人工复核 |
| `ui-impact` | 页面、表单、状态、空态、错误、权限态、文案、可访问性 |
| `integration-api` | 第三方服务、Webhook、SDK、API 契约、跨系统同步和回调 |
| `runtime-ops` | 调度、批处理、后台任务、告警、观测、重试、并发、成本 |

## role-permission

### 什么时候使用

- 需求提到管理员、普通用户、审核员、客户经理、租户、组织、团队或外部用户。
- 同一功能对不同角色可见性、操作权限、导出范围或数据范围不同。
- 权限不足时需要隐藏、禁用、提示、申请权限或记录审计。
- 涉及敏感数据、跨组织访问、审批、回滚、删除或批量操作。

### 必须问清

- 哪些角色参与？
- 每个角色能看什么，不能看什么？
- 谁能创建、修改、删除、审批、导出或回滚？
- 无权限时系统是隐藏入口、禁用操作，还是展示 permission state？
- 是否需要记录审计：谁、何时、对什么对象、做了什么、结果是什么？
- 部分权限场景如何处理，例如能看列表但不能看详情，能编辑但不能导出。

### REQ 模板

| 场景 | REQ 写法 |
| --- | --- |
| 可见性 | `WHILE a user has <role/scope>, THE SYSTEM SHALL display only <objects> visible to that role/scope.` |
| 操作权限 | `WHILE a user lacks permission for <action>, THE SYSTEM SHALL prevent <action> and expose a permission-limited state.` |
| 部分权限 | `IF a user can view <object> but cannot <action>, THE SYSTEM SHALL keep the object readable while preventing the restricted action.` |
| 审计 | `WHEN a privileged action is completed or denied, THE SYSTEM SHALL record actor, target, action, result, and timestamp for audit review.` |
| 跨组织边界 | `THE SYSTEM SHALL NOT expose <data> across organization boundaries unless the source requirement explicitly authorizes sharing.` |

### AC 模板

| Given | When | Then | 验证方式 |
| --- | --- | --- | --- |
| 用户拥有授权角色和可见数据 | 打开目标页面或执行操作 | 系统展示允许的数据并允许授权动作 | E2E / manual |
| 用户缺少目标操作权限 | 尝试执行受限动作 | 系统阻止动作并展示权限受限原因或恢复路径 | E2E |
| 用户拥有部分权限 | 打开对象详情 | 系统允许查看已授权内容并隐藏或禁用未授权操作 | E2E |
| 执行敏感动作 | 动作成功或失败 | 审计记录包含 actor、target、action、result、timestamp | inspection / automated |

### 常见漏项

- 只写管理员，不写普通用户。
- 只写有权限路径，不写无权限、部分权限和跨组织边界。
- 只写按钮禁用，不写原因、恢复路径或审计。
- 把权限实现写成角色表、数据库字段或前端路由，而不是系统行为。
- 忘记导出、批量操作、删除和回滚这些高风险动作。

## workflow-state

### 什么时候使用

- 对象会经历 draft / pending / running / failed / completed / cancelled 等状态。
- 用户可以提交、撤回、取消、重试、审批、驳回、归档或恢复。
- 外部事件、后台任务或定时任务会改变状态。
- 状态错误会导致重复执行、越权、脏数据或用户不知道下一步。

### 必须问清

- 有哪些状态？初始状态和终态是什么？
- 每个状态允许哪些操作，禁止哪些操作？
- 谁或什么事件触发状态变化？
- 无效跳转时系统如何响应？
- 失败后是否能重试、撤回、人工处理或放弃？
- 用户如何看到当前状态、进度、失败原因和下一步？

### REQ 模板

| 场景 | REQ 写法 |
| --- | --- |
| 状态进入 | `WHEN <event> occurs for <object>, THE SYSTEM SHALL transition <object> from <state A> to <state B>.` |
| 状态限制 | `WHILE <object> is in <state>, THE SYSTEM SHALL allow <actions> and prevent <invalid actions>.` |
| 无效跳转 | `IF a user attempts <invalid transition>, THE SYSTEM SHALL reject the transition and expose the current valid state.` |
| 失败恢复 | `WHEN <process> fails, THE SYSTEM SHALL expose failure reason and available recovery actions.` |
| 幂等/重复提交 | `IF the same transition request is repeated, THE SYSTEM SHALL avoid creating duplicate effects and expose the current state.` |

### AC 模板

| Given | When | Then | 验证方式 |
| --- | --- | --- | --- |
| 对象处于允许变更状态 | 用户触发合法操作 | 系统进入目标状态并展示状态反馈 | E2E |
| 对象处于禁止变更状态 | 用户触发无效操作 | 系统拒绝操作并保持原状态 | automated / E2E |
| 后台任务失败 | 用户查看任务详情 | 系统展示失败原因、重试/放弃/人工处理入口 | manual / E2E |
| 重复提交同一操作 | 第二次请求到达 | 系统不产生重复副作用并返回当前状态 | automated |

### 常见漏项

- 只写成功状态，不写失败、取消、超时和重试。
- 只写“状态改变”，不写触发者、允许操作和禁止操作。
- 忘记重复提交、并发操作和外部回调乱序。
- 把状态机实现写成数据库枚举，而不是外部可观察行为。

## data-file

### 什么时候使用

- 需求涉及文件上传、批量导入、报表导出、模板下载或数据解析。
- 需求新增、修改或删除字段。
- 需要定义数据口径、筛选条件、排序、分页、去重、校验或空值处理。
- 数据会同时出现在表单、列表、详情、只读视图、导出、API 或通知里。

### 必须问清

- 输入格式、大小、编码、模板版本和必填字段是什么？
- 非法值、重复值、空值、未知字段、部分成功如何处理？
- 导入结果如何展示：成功数、失败数、行级错误、下载错误文件？
- 新增字段影响哪些读取或展示页面：新增/编辑表单、列表、详情、只读、导出、API、通知？
- 数据口径如何定义，是否需要时间窗口、权限范围或去重规则？
- 失败后是否可以重试、回滚或人工修正？

### REQ 模板

| 场景 | REQ 写法 |
| --- | --- |
| 文件校验 | `WHEN a user uploads <file type>, THE SYSTEM SHALL validate format, size, required fields, and row-level values before import completion.` |
| 部分成功 | `IF an import contains valid and invalid rows, THE SYSTEM SHALL import valid rows and report row-level validation errors for invalid rows.` |
| 导出 | `WHEN a user exports <data>, THE SYSTEM SHALL include only records visible to the user and expose the export result or failure state.` |
| 字段影响面 | `WHEN <field> is added or changed, THE SYSTEM SHALL expose the field consistently in <form/list/detail/export/API> where applicable.` |
| 数据口径 | `THE SYSTEM SHALL calculate <metric> using <filters/window/deduplication rule> as the source of truth.` |

### AC 模板

| Given | When | Then | 验证方式 |
| --- | --- | --- | --- |
| 上传文件满足格式和字段要求 | 用户提交导入 | 系统完成导入并展示成功数和结果入口 | E2E |
| 文件包含非法行 | 用户提交导入 | 系统阻止或跳过非法行并展示行号、字段和错误原因 | E2E / automated |
| 用户只拥有部分数据权限 | 执行导出 | 导出文件只包含用户可见数据 | automated / inspection |
| 新字段已确认进入范围 | 打开列表、详情、导出和只读视图 | 字段在所有适用读取面一致展示或写明 N/A 理由 | manual / E2E |

### 常见漏项

- 只写上传成功，不写非法格式、部分成功、重复数据和空文件。
- 新增字段只写表单，不枚举列表、详情、只读、导出和 API。
- 只写“导出数据”，不写权限范围、字段范围、结果状态和失败处理。
- 把解析库、存储路径或数据库字段写进 requirements。
- 忘记大文件、超时、取消、重试和审计。

## ai-quality

### 什么时候使用

- 系统会自动生成、总结、分类、抽取、推荐或调用工具。
- AI 输出会影响用户决策、业务状态、数据写入或自动执行。
- 需要定义低置信度、拒答、敏感内容、幻觉、超时、成本、日志和人工复核。
- 需求涉及 prompt、模型、provider 或上下文边界，但 requirements 不应提前选实现方案。

### 必须问清

- AI 输入边界：能接收什么数据，不能接收什么？
- AI 输出是否自动生效，还是必须人工确认？
- 质量目标是什么：正确率、人工接受率、抽检规则、解释要求、来源引用？
- 低置信度、超时、拒答、敏感内容、工具失败如何处理？
- 是否需要人工 fallback，谁复核，如何覆盖 AI 结果？
- 数据是否可记录、脱敏、保留、用于训练或发送给外部 provider？
- AI 成本、限流或配额是否影响需求边界？

### REQ 模板

| 场景 | REQ 写法 |
| --- | --- |
| 输入边界 | `THE SYSTEM SHALL accept <allowed inputs> for AI processing and reject or redact <disallowed inputs>.` |
| 低置信度 | `IF the AI confidence is below <threshold/rule>, THE SYSTEM SHALL route the result to human review instead of auto-applying it.` |
| 来源证据 | `WHEN the AI produces <answer>, THE SYSTEM SHALL expose the source evidence or mark the answer as unsupported.` |
| 人工复核 | `WHEN a reviewer overrides an AI result, THE SYSTEM SHALL preserve the reviewer decision as the applied result.` |
| 失败降级 | `IF the AI provider times out or refuses the request, THE SYSTEM SHALL expose a recoverable failure state and avoid applying incomplete output.` |
| 隐私 | `THE SYSTEM SHALL NOT send <sensitive data> to external AI providers unless explicitly approved by the requirement source.` |

### AC 模板

| Given | When | Then | 验证方式 |
| --- | --- | --- | --- |
| 输入符合允许范围 | 用户触发 AI 处理 | 系统返回结果并展示适用证据或解释 | E2E / manual |
| AI 结果低置信度 | 处理完成 | 系统进入人工复核而不是自动写入 | automated / E2E |
| provider 超时或拒答 | 用户等待结果 | 系统展示可恢复失败状态并保留原数据 | E2E |
| 用户覆盖 AI 结果 | 复核人提交人工结果 | 系统使用人工结果并保留覆盖记录 | E2E / inspection |

### 常见漏项

- 只写“使用 AI 生成”，不写输入、输出、质量、失败和人工复核。
- 把模型名、prompt、SDK 或 provider 选择写成已批准需求。
- AI 输出直接自动生效，没有低置信度和人工确认边界。
- 不写隐私、日志、保留、外部传输和成本限制。
- 不写来源证据，导致幻觉结果无法被验证。

## ui-impact

### 什么时候使用

- 需求新增或改变页面、表单、列表、详情、弹窗、导航、移动端或空态。
- 用户可见状态会影响验收：default / loading / empty / error / permission / success。
- 需求涉及微文案、错误提示、恢复路径、响应式、可访问性或多语言。
- UI 方向、组件策略或 Pencil 原型需要根据 requirements 触发。

### 必须问清

- 哪些页面或入口受影响？
- 用户在每个页面的主要动作是什么？
- 默认、加载、空、错误、权限、成功状态如何被用户感知？
- 表单校验错误如何展示，用户如何恢复？
- 是否有响应式、键盘、读屏、焦点或触控目标要求？
- 哪些是 requirements 行为，哪些交给 UI design 决定？

### REQ 模板

| 场景 | REQ 写法 |
| --- | --- |
| 页面行为 | `WHEN a user opens <page>, THE SYSTEM SHALL expose <primary information/actions> needed for <task>.` |
| 空态 | `IF no records match <condition>, THE SYSTEM SHALL show an empty state with the reason and available recovery action.` |
| 错误态 | `IF <operation> fails, THE SYSTEM SHALL expose the failure reason and a retry or recovery path when available.` |
| 权限态 | `WHILE a user lacks permission for <view/action>, THE SYSTEM SHALL expose a permission-limited state without leaking restricted data.` |
| 表单校验 | `WHEN a user submits invalid input, THE SYSTEM SHALL identify the invalid field and describe the correction needed.` |
| 可访问性 | `THE SYSTEM SHALL keep <critical action/status> available through keyboard and screen-reader accessible labels.` |

### AC 模板

| Given | When | Then | 验证方式 |
| --- | --- | --- | --- |
| 页面存在数据 | 用户打开页面 | 系统展示主信息、主操作和当前状态 | E2E / manual |
| 数据为空 | 用户打开页面 | 系统展示空态原因和可执行恢复路径 | E2E |
| 操作失败 | 用户执行操作 | 系统展示错误原因并保留用户输入或状态 | E2E |
| 用户无权限 | 打开受限区域 | 系统不泄露受限数据并展示权限说明 | E2E |

### 常见漏项

- 只写成功页面，不写 loading / empty / error / permission。
- 把“用弹窗 / 红色 badge / shadcn Table”写成需求。
- 新字段只写编辑表单，不写列表、详情和只读视图。
- 错误态没有恢复路径，权限态泄露受限数据。
- 不写可访问性和响应式触发条件。

## integration-api

### 什么时候使用

- 需求涉及第三方系统、外部 provider、Webhook、OAuth、SDK、支付、短信、邮件、地图、AI provider 或内部服务间同步。
- 外部系统不可用、超时、限流、重复回调或数据不一致会影响用户。
- 需要 technical design 决定 API route、schema、client、SDK 版本或 provider。

### 必须问清

- 集成对象是谁，业务上交换什么数据或事件？
- 哪些输入和输出语义是需求级契约？
- 超时、失败、限流、重试、幂等和重复回调如何处理？
- provider 不可用时是降级、排队、人工处理还是阻断？
- 用户是否能看到同步状态、失败原因和恢复路径？
- provider / SDK / API 版本是否已由用户或 research 确认？

### REQ 模板

| 场景 | REQ 写法 |
| --- | --- |
| 外部请求 | `WHEN <business event> requires external delivery, THE SYSTEM SHALL submit <business payload> to the confirmed integration boundary.` |
| 失败处理 | `IF the integration request fails or times out, THE SYSTEM SHALL expose delivery status and available recovery action.` |
| 幂等 | `IF the same external event is received more than once, THE SYSTEM SHALL avoid applying duplicate business effects.` |
| 限流 | `THE SYSTEM SHALL respect confirmed provider limits and expose queued or delayed status when processing is deferred.` |
| 回调 | `WHEN an external callback changes <business state>, THE SYSTEM SHALL update the visible state or mark the callback as rejected with reason.` |
| 决策标记 | `IF provider choice is not confirmed, THE REQUIREMENTS SHALL mark [NEEDS DEPENDENCY DECISION] instead of selecting a provider.` |

### AC 模板

| Given | When | Then | 验证方式 |
| --- | --- | --- | --- |
| provider 可用 | 触发集成事件 | 系统展示提交成功或处理中状态 | contract / E2E |
| provider 超时 | 触发集成事件 | 系统展示失败或排队状态并允许恢复 | contract / E2E |
| 重复 webhook 到达 | 系统处理第二个事件 | 系统不产生重复业务副作用 | automated / contract |
| provider 未确认 | 编写 requirements | 文档包含 decision marker，未写 provider 方案 | inspection |

### 常见漏项

- 只写“接入第三方”，不写失败、超时、限流、重试、幂等。
- 把 provider 选择写成需求，实际没有用户确认。
- 不写用户可见同步状态和人工恢复路径。
- 忘记重复回调、乱序回调和部分成功。

## runtime-ops

### 什么时候使用

- 需求包含后台任务、定时任务、导入导出任务、异步处理、长耗时作业或大批量数据。
- 失败、超时、重试、取消、并发或成本会影响业务结果。
- 需要运维、客服、管理员或用户查看任务状态和失败原因。
- 需要对日志、指标、审计、告警或人工处理有需求级约束。

### 必须问清

- 任务由谁或什么事件触发？是否可以取消？
- 时限、并发、重试次数、失败终态和人工介入是什么？
- 用户或 operator 能看到哪些状态、原因、进度和结果？
- 哪些事件需要日志、指标、审计或告警？
- 大任务、外部调用或 AI 调用是否有成本边界？
- 失败后是否能安全重跑，是否需要防重复副作用？

### REQ / NFR 模板

| 场景 | 写法 |
| --- | --- |
| 任务触发 | `WHEN <trigger> occurs, THE SYSTEM SHALL create a runtime job and expose its current processing state.` |
| 失败状态 | `WHEN a runtime job fails, THE SYSTEM SHALL expose job id, failure reason, retry state, and available recovery action.` |
| 取消 | `WHILE a job is cancellable, THE SYSTEM SHALL allow authorized users to cancel it and expose the final cancellation state.` |
| 可观测性 | `THE SYSTEM SHALL emit an observable failure event with job id, reason, and retry state for each failed job.` |
| 成本边界 | `THE SYSTEM SHALL expose or enforce <cost/quota/volume> limits before running work that exceeds the confirmed boundary.` |
| 并发 | `THE SYSTEM SHALL prevent duplicate concurrent execution for the same <business key> when duplicate execution would create conflicting results.` |

### AC 模板

| Given | When | Then | 验证方式 |
| --- | --- | --- | --- |
| 任务被触发 | 用户或系统启动任务 | 系统展示 job id 和 processing state | E2E / inspection |
| 任务失败 | 用户查看任务状态 | 系统展示失败原因、retry state 和恢复动作 | E2E |
| 用户取消可取消任务 | 任务处于 cancellable 状态 | 系统停止后续处理并展示 cancelled state | automated / E2E |
| 同一业务键重复触发 | 第二个任务启动 | 系统阻止重复副作用或展示已有任务状态 | automated |

### 常见漏项

- 只写“后台执行”，不写用户或 operator 如何知道状态。
- 不写失败原因、重试、取消、超时、并发和人工处理。
- NFR 写“稳定可靠”，没有指标、事件或检查方法。
- 成本、限流、批量规模和执行时间没有边界。
