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
node .specforge/execution/tools/instructions.mjs
```

确认 ready artifact 包含 `technical_design`，再：

```bash
node .specforge/execution/tools/create-artifact.mjs technical_design
```

## 内部技能母本

写 technical design 前，读取：

```text
.specforge/execution/stages/technical-design/SKILL.md
```

按需读取内部设计子模块：

| 设计维度 | 子模块 |
|---|---|
| 领域模型、实体与边界上下文 | `.specforge/execution/stages/technical-design/domain-design.md` |
| API 契约、SDK、事件、跨系统接口 | `.specforge/execution/stages/technical-design/api-design.md` |
| DB / Schema / 索引 / 迁移 | `.specforge/execution/stages/technical-design/data-design.md` |
| 安全、可观测性、部署、可靠性 | `.specforge/execution/stages/technical-design/nfr-design.md` |

## 关联规则

- `.specforge/policy/rules/analysis-workflow/README.md`：设计必须追溯到 intake 分析证据。
- `.specforge/policy/rules/engineering/README.md`：沿用项目模式，不发明无依据抽象。
- `.specforge/policy/rules/boundaries/README.md`：明确写入范围和禁止范围。
- `.specforge/policy/rules/api-design/README.md`：API、SDK、事件和跨系统契约。
- `.specforge/policy/rules/security/README.md`：鉴权、权限和安全敏感检查。
- `.specforge/policy/rules/delivery/README.md`：配置、发布、回滚和运行影响。
- `.specforge/policy/rules/testing/README.md`：验证策略。
- `.specforge/policy/tech-profiles/README.md`：技术选型维度、数据库选择矩阵和 profile selection 写法。

## 完成标准

- `01-spec/technical-design.md` 存在。
- 有技术影响时，前端 / 后端 / API / 数据 / 权限 / 配置 / NFR 的适用性判断清楚。
- 无技术影响时，明确写出 N/A、理由和验证方式。
- 技术栈选择引用 profile 或说明偏离理由。
- 下一步路由到 `sf-tasking`，以 `instructions.mjs` 为准。

## 不做

- 不写业务代码。
- 不重复维护 UI 原型、视觉风格和页面交互细节；这些只引用 `ui-design.md`。
