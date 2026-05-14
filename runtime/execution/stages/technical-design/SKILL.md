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
- `.specforge/policy/rules/analysis-workflow/README.md`
- `.specforge/policy/rules/engineering/README.md`
- `.specforge/policy/rules/boundaries/README.md`
- `.specforge/policy/rules/security/README.md`
- `.specforge/policy/rules/api-design/README.md`
- `.specforge/policy/rules/delivery/README.md`
- `.specforge/policy/rules/testing/README.md`
- `.specforge/policy/tech-profiles/README.md`
- 按影响面读取内部设计子模块：
  - 领域模型、实体或边界上下文：`.specforge/execution/stages/technical-design/domain-design.md`
  - API、SDK、事件或跨系统契约：`.specforge/execution/stages/technical-design/api-design.md`
  - DB、Schema、索引、迁移或数据流：`.specforge/execution/stages/technical-design/data-design.md`
  - 安全、可观测性、部署或可靠性：`.specforge/execution/stages/technical-design/nfr-design.md`

## 写入

- `01-spec/technical-design.md`

## 设计流程

1. 建立技术影响面矩阵：frontend、backend、API、data、auth、config、jobs、observability。
2. 无技术影响时，写 N/A 结论：例如纯文案或纯 UI 视觉调整，并说明验证方式。
3. 建立需求追踪表，确保关键需求能落到技术方案或明确不适用。
4. 选择 Tech Profiles，说明采用、部分采用或偏离理由。
5. 按影响面展开工程设计：
   - 前端工程结构、路由、组件边界、状态管理、API client。
   - 后端模块、服务边界、领域模型、后台任务、并发和幂等。
   - API / SDK / 事件契约、鉴权和兼容性。
   - 数据库、索引、迁移、缓存和生命周期。
   - 配置、部署、可观测性、可靠性和回滚。
6. 明确写入范围、禁止范围、失败模式和验证策略。
7. 对高风险方案写备选方案和取舍理由。

## 停止条件

- requirements 仍有阻断歧义。
- 技术选型没有 profile、备选方案或偏离理由。
- API、数据迁移、权限或生产风险缺少验证路径。
- 设计需要超出已批准边界。
- 外部版本、框架或 SDK 行为不确定且未查询当前资料。

## 完成标准

- `technical-design.md` 能让实现者按边界开工。
- reviewer 能判断实现是否偏离架构、接口、数据或安全要求。
- tasks 可以从本文件和可选 `ui-design.md` 拆出可验证工作单元。
- UI 细节只引用 `ui-design.md`，不在本文件重复维护。
