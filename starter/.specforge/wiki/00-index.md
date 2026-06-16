---
title: 知识库索引
kind: index
owner: TBD
last_updated: YYYY-MM-DD
source_work: bootstrap
status: current
---

# 知识库索引

## 当前项目摘要

- 项目定位：暂无。
- 当前状态：暂无。
- 主要技术栈：暂无。
- 主要入口：暂无。
- 最重要模块：暂无。
- 最近更新：暂无。
- 当前风险：暂无。

## 任务入口导航

| 场景 | 先读 | 再查 | 常用命令 / 线索 |
|---|---|---|---|
| 新需求 / 功能变更 | `01-project-overview.md`、`02-product-rules.md` | `module-<name>.md`、`api-<domain>.md` | 业务域、页面、API、数据 |
| bugfix / issue | `03-architecture.md`、`08-risks.md` | 相关 module / API / data | 报错路径、调用链、回归测试 |
| API / 集成改动 | `external-interfaces.md` | `api-<domain>.md`、`integration-<system>.md` | route、handler、client、tests |
| 数据改动 | `04-data-model.md` | model、migration、repository、fixture | schema、migration、DB init |
| 配置 / 权限 / 安全 | `config-env.md`、`security-auth.md` | env、auth middleware、policy | secret、feature flag、permission |
| 后台任务 / 事件 | `jobs-events.md` | worker、queue、cron、event handler | topic、job、DLQ、retry |
| 验证 / 发布 | `05-operations.md`、`08-risks.md` | verification report、CI | 启动、测试、回滚、已知风险 |

## 当前知识项

- [项目概览](01-project-overview.md)
- [产品规则](02-product-rules.md)
- [架构概览](03-architecture.md)
- [数据模型](04-data-model.md)
- [运行与运维](05-operations.md)
- [决策记录](06-decisions.md)
- [术语表](07-glossary.md)
- [风险与技术债](08-risks.md)
- [对外接口总览](external-interfaces.md)
- [配置与环境](config-env.md)
- [安全与权限](security-auth.md)
- [任务与事件](jobs-events.md)

## 按需知识项

暂无。新增 `module-<name>.md`、`api-<domain>.md`、`integration-<system>.md` 或 `design-system.md` 后同步到这里。

## 最后同步

暂无。
