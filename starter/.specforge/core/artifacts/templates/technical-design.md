# Technical Design

> 本 artifact 只处理工程实现设计：前端架构、后端架构、API、数据、权限、配置、任务、部署、NFR、失败模式和验证策略。UI 页面结构和视觉原型属于 `ui-design.md`。

## 0. 适用性判断

| 影响面 | 是否涉及 | 说明 / 跳过理由 |
|---|---|---|
| Frontend architecture | yes / no | |
| Backend architecture | yes / no | |
| API / SDK / Events | yes / no | |
| Data / DB / Migration | yes / no | |
| Auth / Permission / Security | yes / no | |
| Config / Env / Delivery | yes / no | |
| Jobs / Queue / Scheduler | yes / no | |
| Observability / Reliability | yes / no | |

## 1. 设计摘要

- 设计结论：
- 本次 work item 范围：
- 关键风险：
- 明确不做：

## 2. Requirements Trace

| 需求 / 约束 | 来源 | 技术设计响应 | 验证钩子 |
|---|---|---|---|
| | | | |

## 3. Tech Profile Selection

> 写入前读取 `.specforge/core/profiles/README.md` 和本次涉及的具体 profile；不适用的维度也要说明跳过理由。

| 维度 | 选型 | Profile 路径 | 适用性 / 跳过理由 | 选用理由 | 验证方式 |
|---|---|---|---|---|---|
| Frontend | | | | | |
| Backend | | | | | |
| Database | | | | | |
| Capability: Content / File / AI / Jobs | | | | | |
| Capability: Architecture / Security / Observability / Testing | | | | | |

## 4. 规则基准与偏离

> 只记录本次影响面实际采用的规则入口。每个规则入口已经内嵌唯一主基准，官方来源见 `.specforge/core/standards/engineering.md#主基准`。没有相关影响面时写 N/A。采用点必须落到设计、任务和验证证据。

| 影响面 | 规则入口 | 主基准 | 官方来源是否已查 | 采用点 | 偏离 / 不适用理由 | 验证证据 |
|---|---|---|---|---|---|---|
| API / SDK / Events | `.specforge/core/standards/engineering.md` / N/A | Microsoft REST API Guidelines | yes / no / N/A | | | |
| Auth / Permission / Security | `.specforge/core/standards/engineering.md` / N/A | OWASP ASVS | yes / no / N/A | | | |
| Delivery / Reliability | `.specforge/core/standards/engineering.md` / N/A | AWS Well-Architected Framework | yes / no / N/A | | | |
| Observability | `.specforge/core/standards/engineering.md` / N/A | OpenTelemetry Semantic Conventions | yes / no / N/A | | | |
| Code Review / Maintainability | `.specforge/core/standards/engineering.md` / N/A | Google Engineering Practices | yes / no / N/A | | | |

## 5. Profile Deviations

| 维度 / Profile | 偏离内容 | 偏离原因 | 风险 | 防护 / 验证 |
|---|---|---|---|---|
| | | | | |

## 6. 架构与边界承诺

- 目标架构：
- 责任边界：
- 核心数据流：

| 允许修改 | 禁止修改 | 原因 |
|---|---|---|
| | | |

## 7. Frontend Technical Design

> 只写前端工程结构、状态、数据流、路由、组件边界；视觉和交互细节链接 `ui-design.md`。

- 路由与布局：
- 组件边界：
- 状态管理：
- API client / error handling：
- 构建与脚手架：

## 8. Backend Technical Design

- 模块 / 分层：
- 服务边界：
- 领域模型 / 状态机：
- 并发、幂等、重试：
- 后台任务 / 调度：

## 9. API / Contracts

| 调用方 | 提供方 | 接口 / 事件名称 | 协议 | 认证 / 权限 | 兼容性策略 |
|---|---|---|---|---|---|
| | | | | | |

## 10. Data, Storage & Migration

- 关键表结构 / Schema：
- 索引策略：
- 数据生命周期：
- 迁移 / 回填方案：
- 备份与恢复影响：

## 11. Permission, Config & Integration Impact

| 影响面 | 变化内容 | 风险 | 验证方式 |
|---|---|---|---|
| Permission / Auth | | | |
| Config / Env | | | |
| Queue / Job | | | |
| Cache | | | |
| External Integration | | | |

## 12. NFRs

- 安全与鉴权：
- 性能与并发：
- 可观测性：
- 可靠性与降级：
- 发布、回滚与运行影响：

## 13. 失败模式与回滚策略

| 失败模式 | 触发条件 | 检测方式 | 缓解 / 降级 | 回滚方式 |
|---|---|---|---|---|
| | | | | |

## 14. 技术验证策略

| 验证层级 | 命令 / 证据 | 覆盖目标 | 通过标准 |
|---|---|---|---|
| Unit | | | |
| Integration | | | |
| Contract | | | |
| E2E / Manual | | | |
| Regression | | | |
