---
name: technical-design
description: SpecForge 内部技术设计技能。用于根据 requirements 和可选 UI design 生成前端架构、后端架构、API、数据、权限、配置、NFR 和验证策略。
---

# Technical Design Skill

本技能只处理工程实现设计。UI 页面结构、线稿、视觉风格和交互状态由 `ui-design` 负责；本技能可以引用 `01-spec/ui-design.md`，但不要复制整套 UI 设计。

## 读取

- `00-intake/brief.md`
- `01-spec/requirements.md`
- `01-spec/ui-design.md`（存在时）
- `.specforge/core/standards/product.md`
- `.specforge/core/standards/workflow.md`
- `.specforge/core/standards/engineering.md`
- `.specforge/core/profiles/README.md`
- 按影响面读取内部设计子模块；不要默认全量读取：
  - 前端工程、路由、组件、状态、API client 或构建：`.specforge/core/workflows/stages/technical-design/frontend-design.md`
  - 后端模块、服务边界、后台任务、并发或幂等：`.specforge/core/workflows/stages/technical-design/backend-design.md`
  - 领域模型、实体或边界上下文：`.specforge/core/workflows/stages/technical-design/domain-design.md`
  - API、SDK、事件或跨系统契约：`.specforge/core/workflows/stages/technical-design/api-design.md`
  - DB、Schema、索引、迁移或数据流：`.specforge/core/workflows/stages/technical-design/data-design.md`
  - 安全、可观测性、部署或可靠性：`.specforge/core/workflows/stages/technical-design/nfr-design.md`

## 写入

- `01-spec/technical-design.md`

## 设计流程

1. 建立技术影响面矩阵：frontend、backend、domain、API、data、auth/security、config/delivery、jobs、observability、reliability。
2. 把每个影响面标成 `yes / no / unknown`：
   - `no` 必须写跳过理由。
   - `unknown` 如果会改变架构、数据、安全、成本或上线风险，停止并向用户澄清。
   - 低风险未知可以写入 assumptions，但必须说明后续验证点。
3. 生成读取计划：只列本次实际读取的子模块、profiles 和官方基准入口。
4. 无技术影响时，写 N/A 结论：例如纯文案、纯 UI 视觉调整、无工程改动的配置说明，并说明验证方式。
5. 建立需求追踪表，确保关键需求能落到技术方案或明确不适用。
6. 选择 Tech Profiles，说明采用、部分采用或偏离理由；项目已有技术栈以 wiki 和代码事实优先。
7. 对齐规则主基准：按影响面使用对应规则入口内的唯一主基准，并写清采用点、偏离理由和验证证据；无相关影响面时写 N/A。
8. 按影响面展开工程设计，只展开 `yes` 的章节；`no` 的章节保留一行 N/A，不写空表：
   - 前端工程结构、路由、组件边界、状态管理、API client。
   - 后端模块、服务边界、后台任务、并发和幂等。
   - 领域模型、实体、状态机和边界上下文。
   - API / SDK / 事件契约、鉴权和兼容性。
   - 数据库、索引、迁移、缓存和生命周期。
   - 配置、部署、可观测性、可靠性和回滚。
9. 明确写入范围、禁止范围、失败模式和验证策略。
10. 对高风险方案写备选方案和取舍理由。

## 停止条件

- requirements 仍有阻断歧义。
- 技术选型没有 profile、备选方案或偏离理由。
- 涉及 API、安全、运行可靠性或可观测性，但没有说明规则主基准采用点。
- API、数据迁移、权限或生产风险缺少验证路径。
- `technical-design.md#0. 影响面与读取计划` 仍有会改变架构或上线风险的 `unknown`。
- 设计需要超出已批准边界。
- 外部版本、框架或 SDK 行为不确定且未查询当前资料。

## 完成标准

- `technical-design.md` 能让实现者按边界开工。
- reviewer 能判断实现是否偏离架构、接口、数据或安全要求。
- tasks 可以从本文件和可选 `ui-design.md` 拆出可验证工作单元。
- UI 细节只引用 `ui-design.md`，不在本文件重复维护。
