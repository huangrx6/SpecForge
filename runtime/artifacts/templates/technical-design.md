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

> 写入前读取 `.specforge/policy/tech-profiles/README.md` 和本次涉及的具体 profile；不适用的维度也要说明跳过理由。

| 维度 | 选型 | Profile 路径 | 适用性 / 跳过理由 | 选用理由 | 验证方式 |
|---|---|---|---|---|---|
| Frontend | | | | | |
| Backend | | | | | |
| Database | | | | | |
| Component / UI | | | | | |
| Content / Editor | | | | | |
| Testing | | | | | |
| Runtime / Infrastructure | | | | | |
| Security / Observability | | | | | |

## 4. Profile Deviations

| 维度 / Profile | 偏离内容 | 偏离原因 | 风险 | 防护 / 验证 |
|---|---|---|---|---|
| | | | | |

## 5. 架构与边界承诺

- 目标架构：
- 责任边界：
- 核心数据流：

| 允许修改 | 禁止修改 | 原因 |
|---|---|---|
| | | |

## 6. Frontend Technical Design

> 只写前端工程结构、状态、数据流、路由、组件边界；视觉和交互细节链接 `ui-design.md`。

- 路由与布局：
- 组件边界：
- 状态管理：
- API client / error handling：
- 构建与脚手架：

## 7. Backend Technical Design

- 模块 / 分层：
- 服务边界：
- 领域模型 / 状态机：
- 并发、幂等、重试：
- 后台任务 / 调度：

## 8. API / Contracts

| 调用方 | 提供方 | 接口 / 事件名称 | 协议 | 认证 / 权限 | 兼容性策略 |
|---|---|---|---|---|---|
| | | | | | |

## 9. Data, Storage & Migration

- 关键表结构 / Schema：
- 索引策略：
- 数据生命周期：
- 迁移 / 回填方案：
- 备份与恢复影响：

## 10. Permission, Config & Integration Impact

| 影响面 | 变化内容 | 风险 | 验证方式 |
|---|---|---|---|
| Permission / Auth | | | |
| Config / Env | | | |
| Queue / Job | | | |
| Cache | | | |
| External Integration | | | |

## 11. NFRs

- 安全与鉴权：
- 性能与并发：
- 可观测性：
- 可靠性与降级：
- 发布、回滚与运行影响：

## 12. 失败模式与回滚策略

| 失败模式 | 触发条件 | 检测方式 | 缓解 / 降级 | 回滚方式 |
|---|---|---|---|---|
| | | | | |

## 13. 技术验证策略

| 验证层级 | 命令 / 证据 | 覆盖目标 | 通过标准 |
|---|---|---|---|
| Unit | | | |
| Integration | | | |
| Contract | | | |
| E2E / Manual | | | |
| Regression | | | |
