# Backend Engineering Design — 后端工程子模块

本子模块是 `sf-tech-design` 的内部参考，**只在本次 work item 涉及后端服务、业务模块、任务执行或服务端集成时读取**。它关注模块边界、服务职责、并发、幂等、任务和运行时行为；具体 API 契约由 `api-design.md` 处理，具体数据结构由 `data-design.md` 处理。

## 何时读取

- 新增或修改后端模块、服务层、用例层、命令处理器、Controller / Handler。
- 新增后台任务、队列消费、调度任务、批处理、文件处理或 AI 调用链路。
- 引入服务端缓存、外部服务适配器、通知、Webhook 调用或第三方 SDK。
- 变更并发控制、幂等、重试、事务边界或错误处理策略。
- 新建后端项目或新模块，需要脚手架、目录结构和测试策略。

## 必读输入

- `01-spec/requirements.md`
- `01-spec/technical-design.md` 已有内容（更新时）
- `.specforge/core/profiles/README.md`
- 已选或候选后端 profile，例如：
  - `.specforge/core/profiles/backend/python-fastapi.md`
  - `.specforge/core/profiles/backend/spring-boot-java.md`
  - `.specforge/core/profiles/backend/golang-standard.md`
  - `.specforge/core/profiles/backend/next-api-routes.md`
- 横向能力 profile（按需）：
  - `.specforge/core/profiles/capabilities/processing-ai-jobs.md`
  - `.specforge/core/profiles/capabilities/architecture-patterns.md`
  - `.specforge/core/profiles/capabilities/security.md`
  - `.specforge/core/profiles/capabilities/observability.md`
  - `.specforge/core/profiles/capabilities/testing.md`

## 设计要求

### 模块与服务边界

- 列出新增 / 修改模块，说明每个模块的职责、输入、输出和依赖。
- 区分业务逻辑、基础设施适配、框架胶水和外部服务调用。
- 服务间调用必须说明同步 / 异步、失败传播和降级方式。
- 每个模块必须说明 owner、扩展点、废弃路径和与现有模块的边界；不要只写“新增 service”。
- 对跨模块改动，写清哪些旧路径保持兼容，哪些路径会迁移，哪些代码明确不触碰。

### 业务规则与事务边界

- 明确服务端不变量、状态机、权限检查点和事务边界。
- 跨模块写入要说明一致性策略：单事务、最终一致性、补偿或人工处理。
- 写操作需要说明幂等键、重复请求处理和并发冲突处理。

### 后台任务与批处理

- 说明任务触发方式：用户触发、定时、队列、webhook 或系统事件。
- 说明任务状态、重试、超时、并发限制、暂停 / 继续 / 取消和失败恢复。
- AI 调用、文件处理、导入导出等高成本任务要写限流、预算、审计和结果落盘策略。

### 错误处理与运行

- 错误分类：用户可恢复、系统可重试、不可恢复、权限拒绝、外部依赖失败。
- 统一错误码和日志字段由 API / NFR 子模块补充。
- 新服务或新模块必须说明启动、配置、健康检查和 smoke test。
- 关键链路必须说明 logs / metrics / traces 中至少一种观察点，以及失败后如何定位 owner。
- 新增后台能力必须说明 runbook 入口、人工补偿入口或明确 N/A。

## 必含产出（写入 technical-design.md）

- 后端 profile 选择或 N/A 理由。
- 模块 / 服务边界图或清单。
- 核心业务流程、事务边界、幂等和并发控制。
- 后台任务 / 队列 / 调度 / AI 调用链路（如涉及）。
- 错误处理、运行验证和需要 `sf-verify` 覆盖的后端证据。
- Implementation Handoff：修改模块、调用顺序、测试接缝、回滚接缝和禁止触碰范围。
- Maintenance & Evolution：owner、extension point、deprecation path、wiki target 和 revisit trigger。

## 停止条件

- 业务状态机或权限边界未确认，无法确定服务职责。
- 任务并发、执行时间、结果保存或失败恢复要求缺失，会影响架构。
- 外部服务或 SDK 行为不确定且会影响契约、重试、限流或安全策略。
- 新模块没有 owner、运行观察点或回滚 / 人工补偿路径。
