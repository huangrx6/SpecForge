# 交付规则入口

交付规则适用于配置、构建、发布、回滚、环境、日志、监控和上线准备。只要 change 影响运行时行为，就必须考虑本规则。

## 什么时候启用

- design 涉及部署、环境、配置或运行时影响。
- closure 需要 release / rollback / 上线证据。
- 验证需要覆盖发布路径或生产观察方式。

## 按需加载参考

| 场景 | 继续读取 |
|---|---|
| 配置、构建、发布记录 | `references/release-config.md` |
| 回滚、降级、不可回滚项 | `references/rollback-resilience.md` |
| 日志、监控、SLO、上线观察 | `references/observability-launch.md` |

## 核心原则

- 构建、发布、运行应尽量分离。
- 环境差异通过配置表达，不通过改代码表达。
- 发布必须可重复，回滚必须可说明。
- 新能力上线后应能被观察、定位和关闭。
- 生产配置和密钥不进入仓库。

Twelve-Factor、Google SRE Release Engineering 和 SLO 实践，分别对应 SpecForge 交付规则里的配置隔离、可重复发布与用户可感知指标。
