# Architecture Contract

本文件是 `sf-tech-design` 的技术架构契约层。它把 requirements、UI design、profiles、wiki 和代码事实转成后续 tasking、implementation、verification、wiki 能共同使用的工程约束。

技术设计不是“把实现想法写长一点”。它要回答：系统边界在哪里、责任如何分配、决策为什么成立、实现如何拆、运行后如何观察、未来如何维护。

## Research notes

| # | Source | Takeaway | SpecForge action |
| --- | --- | --- | --- |
| 1 | arc42 | 架构文档需要正确、当前、可理解、相关、可维护。 | technical design 只保留本次要实现/维护的事实，长期事实进 wiki。 |
| 2 | arc42 | 架构文档要覆盖目标、约束、上下文、方案策略、构建块、运行态、风险。 | 模板增加 Architecture Contract、Implementation Handoff、Operability / Maintenance。 |
| 3 | C4 Model | 用 Context、Container、Component、Code 分层描述系统，面向不同受众。 | technical design 用“本次需要的最小视图”，不要默认全量画图。 |
| 4 | C4 Container | Container view 展示责任分布、主要技术选择和通信方式，开发与运维都能用。 | 所有跨模块设计必须写 responsibility、interface、runtime dependency。 |
| 5 | ADR | ADR 记录重要架构决策、上下文和后果。 | 架构决策记录必须包含 options、decision、confidence、consequence、revisit trigger。 |
| 6 | Microsoft ADR guidance | ADR 应写问题上下文、选项、结果、权衡和信心等级。 | technical design 中新增 confidence / revisit 条目。 |
| 7 | AWS ADR process | ADR 有生命周期；决策会演进，不是写完就结束。 | 决策要写 supersede / revisit 条件，wiki_sync 决定是否长期沉淀。 |
| 8 | GOV.UK ADR | 架构决策影响系统结构、质量属性或行为。 | 只有影响 structure / quality / behavior 的决策才进 ADR，避免噪音。 |
| 9 | Well-Architected practice | 运行、可靠性、安全、成本、可观测性是架构的一部分。 | technical design 必须覆盖 operability 和 maintenance，不只写代码结构。 |
| 10 | Spec-driven development | 设计约束应前置进入 plan，implementation 不应临时补架构。 | technical design 输出 Implementation Handoff 和 Verification Hooks。 |
| 11 | Team maintainability | 可维护性来自边界、命名、测试、演进路径和低认知负担。 | 每个设计写 owner、change surface、test seam、migration path。 |
| 12 | Production readiness | 发布和回滚不是 close 阶段才想；技术设计要预留开关、降级和观察点。 | technical design 增加 rollout、rollback、feature flag、observability hooks。 |

## Architecture design loop

1. **Bound the problem**：从 requirements / PRD / brief 判断 architecturally significant requirements；不是每个需求都需要重设计架构。
2. **Map current state**：读取 wiki 和 bounded code context，确认现有模块、接口、数据、配置、运行命令和测试入口。
3. **Classify change type**：bugfix、small feature、new module、integration、data migration、platform change、high-risk NFR。
4. **Choose minimum architecture view**：只产出本次需要的 Context / Container / Component / Runtime / Data / Deployment 视图。
5. **Decide and record**：对会影响 structure、quality attribute 或 behavior 的取舍写 ADR 摘要。
6. **Design for implementation**：写清文件边界、模块职责、接口、测试缝、迁移顺序和 rollback seam。
7. **Design for operation**：写清日志、指标、告警、配置、开关、降级、容量和故障恢复。
8. **Design for maintenance**：写清谁拥有、如何扩展、什么不能改、如何废弃、何时重看决策。
9. **Verify before tasking**：所有关键风险都能映射到 test case、manual confirmation、runtime observation 或 release guardrail。

## Required architecture views

按需选择，不全量输出。

| View | Use when | Must answer |
| --- | --- | --- |
| Context | 新系统、跨系统集成、角色 / 外部依赖变化 | 系统和外部 actor / provider 如何交互 |
| Container | 前后端、服务、任务、存储、队列、AI provider 等边界变化 | 责任分布、通信方式、主要技术选择 |
| Component | 单个服务 / 前端模块内部结构变化 | 模块职责、输入输出、依赖方向 |
| Runtime sequence | 用户流程、异步任务、回调、重试、并发 | 成功路径、失败路径、超时和补偿 |
| Data flow | 数据新增、同步、缓存、迁移、隐私 | source of truth、读写路径、一致性和生命周期 |
| Deployment / Ops | 配置、环境、发布、回滚、观测变化 | 如何发布、如何观察、如何降级 |

## Design dimensions

每个 `yes` 影响面至少回答相关维度。

| Dimension | Questions |
| --- | --- |
| Boundary | 哪些模块/文件/服务可改，哪些不改；所有权在哪里 |
| Responsibility | 每个模块负责什么，不负责什么 |
| Interface | API、事件、函数、组件、配置、数据契约如何变化 |
| State | 状态机、缓存、并发、幂等、冲突和重试如何处理 |
| Data | source of truth、迁移、索引、生命周期、隐私和审计 |
| Security | 认证、授权、输入校验、敏感信息、供应链风险 |
| Operability | 日志、指标、trace、告警、health check、runbook |
| Delivery | feature flag、灰度、部署顺序、回滚、数据兼容窗口 |
| Testability | 单元、集成、契约、E2E、迁移验证、人工补证 |
| Maintainability | 命名、目录、抽象、扩展点、废弃策略、认知负担 |
| Cost | 运行成本、第三方成本、复杂度成本、团队维护成本 |

## Architecture Decision Record summary

只对架构重要决策填写。小字段、小样式、小文案不需要 ADR。

```md
ADR:
- Decision:
- Context:
- Options considered:
- Outcome:
- Consequences:
- Confidence:
- Revisit trigger:
- Supersedes / superseded by:
```

## Implementation Handoff

technical design 必须能直接支撑 tasks，不让实现阶段重新发现边界。

```md
Implementation Handoff:
- Change slices:
- Files / modules:
- Sequence:
- Test seams:
- Feature flags / rollout:
- Rollback seam:
- Do-not-touch:
- Open assumptions:
```

## Maintenance and evolution

```md
Maintenance:
- Owner / owning module:
- Expected change frequency:
- Extension point:
- Deprecation path:
- Documentation / wiki target:
- Known technical debt:
- Revisit trigger:
```

## Stop conditions

- 无法从 wiki / code context 判断现有边界，却要修改既有系统。
- 方案需要新增架构组件、外部依赖、存储、队列、任务或运行配置，但没有选型确认。
- 设计只描述 happy path，没有失败模式、回滚、观察点或验证路径。
- API / data / auth / integration 变更没有兼容性策略。
- 方案无法拆成任务，或实现者仍需重新定位“该改哪里”。
- 维护责任、扩展方式或废弃路径不清楚，且该设计会成为长期结构。

## Source index

| Source | URL | Used for |
| --- | --- | --- |
| arc42 overview | https://arc42.org/overview | architecture documentation scope |
| arc42 principles | https://arc42.org/principles-of-technical-documentation | correct / current / understandable / relevant / maintainable documentation |
| C4 model | https://c4model.com/ | hierarchical architecture views |
| C4 container diagram | https://c4model.com/diagrams/container | responsibilities, technology choices, communication |
| ADR GitHub | https://github.com/architecture-decision-record/architecture-decision-record | ADR definition and terminology |
| Microsoft ADR guidance | https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record | context, options, tradeoffs, confidence |
| AWS ADR process | https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html | ADR lifecycle |
| GOV.UK ADR framework | https://www.gov.uk/government/publications/architectural-decision-record-framework/architectural-decision-record-framework | decisions affect structure, quality attributes, behavior |
