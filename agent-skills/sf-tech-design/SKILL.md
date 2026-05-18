---
name: sf-tech-design
description: 生成或更新 SpecForge work item 的 technical_design；用于 ready artifact 为 technical_design，或需求涉及前端工程、后端架构、API、数据、权限、配置、任务或 NFR 时。
---

# sf-tech-design

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

把 requirements 和可选 UI design 转成可实现、可审查、可验证的工程设计。它不负责画页面线稿或决定视觉风格。

## 启动

运行：

```bash
node .specforge/core/scripts/instructions.mjs
```

确认 ready artifact 包含 `technical_design`，再：

```bash
node .specforge/core/scripts/create-artifact.mjs technical_design
```

## 内部技能母本

写 technical design 前，读取：

```text
.specforge/core/workflows/stages/technical-design/SKILL.md
```

按需读取内部设计子模块：

| 设计维度 | 子模块 |
|---|---|
| 领域模型、实体与边界上下文 | `.specforge/core/workflows/stages/technical-design/domain-design.md` |
| API 契约、SDK、事件、跨系统接口 | `.specforge/core/workflows/stages/technical-design/api-design.md` |
| DB / Schema / 索引 / 迁移 | `.specforge/core/workflows/stages/technical-design/data-design.md` |
| 安全、可观测性、部署、可靠性 | `.specforge/core/workflows/stages/technical-design/nfr-design.md` |

## 关联标准

- `.specforge/core/standards/product.md`：技术设计必须追溯到已确认需求。
- `.specforge/core/standards/workflow.md`：写入边界、非目标、scope 和 gate 边界。
- `.specforge/core/standards/engineering.md`：工程、API、数据、安全、交付、测试、审查和规则基准。
- `.specforge/core/profiles/README.md`：技术选型维度、数据库选择矩阵和 profile selection 写法。

## 规则基准对齐

技术设计不是只写“怎么实现”，还要说明“按哪套规则基准实现”。写 `technical-design.md` 时必须完成：

1. 根据影响面读取对应规则入口，每个入口已经内嵌唯一主基准。
2. 在 `.specforge/core/standards/engineering.md#主基准` 找官方入口；需要具体条款、字段命名、版本行为或用户要求来源时，打开官方入口查当前原文。
3. 采用点必须具体到本次设计，例如资源建模、错误响应、对象级授权、可观测性字段、回滚策略。
4. 如果项目已有模式和规则主基准不同，优先项目事实，并在 `规则基准与偏离` 中写偏离理由。
5. 不要另起并行规范章节或堆多个候选规范。

## 完成标准

- `01-spec/technical-design.md` 存在。
- 有技术影响时，前端 / 后端 / API / 数据 / 权限 / 配置 / NFR 的适用性判断清楚。
- 无技术影响时，明确写出 N/A、理由和验证方式。
- 技术栈选择引用 profile 或说明偏离理由。
- 规则基准采用点已写入采用点、偏离理由和验证证据。
- 下一步路由到 `sf-tasking`，以 `instructions.mjs` 为准。

## 不做

- 不写业务代码。
- 不重复维护 UI 原型、视觉风格和页面交互细节；这些只引用 `ui-design.md`。
