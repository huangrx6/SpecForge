# Architecture Patterns Capability

用于选择架构组织方式，不替代 `core/standards/engineering.md`。

## 适用

- work item 涉及模块拆分、服务边界、领域模型、依赖方向或技术债重构。
- refactor workflow 需要说明保持行为不变但改变结构。

## 选择矩阵

| 场景 | 推荐 |
|---|---|
| 业务规则复杂、状态流转多、领域语言重要 | Domain-driven design |
| 需要隔离框架、数据库、外部服务依赖 | Clean architecture |
| 前端组件复杂、复用和状态边界重要 | Frontend component patterns |
| 跨服务、云资源、稳定性模式明显 | GoF / cloud patterns 按需引用 |

## Design 必填

- 模块边界和依赖方向。
- 哪些行为保持不变。
- 哪些接口、数据和配置不允许顺手改。
- 迁移步骤和回滚方式。

## 阻断项

- 只写“使用 DDD / Clean Architecture”，没有实体、边界和依赖方向。
- 把重构和新功能混在一起。
- 没有回归验证策略。
