---
name: discovery
description: SpecForge 内部 discovery 路由技能。用于将原始请求判断为无需 spec、单 change、多 change、扩展已有 change 或混合路线。
---

# Discovery Skill

Discovery 是新工作的分诊入口，只负责判断路线和创建可恢复的 intake 证据，不直接写完整规格或实现代码。

## 读取

- 用户原始请求和当前对话约束。
- `.specforge/manifest.yaml`、`.specforge/registry.yaml`。
- `.specforge/rules/context/README.md`、`.specforge/rules/boundaries/README.md`、`.specforge/rules/spec-quality/README.md`。
- 与请求直接相关的 `.specforge/knowledge/` 文件。

## 动作

1. 判断是否已有 active change。
2. 判断请求类型：功能、缺陷、重构、研究、运维、文档或混合任务。
3. 判断风险等级：安全、数据迁移、生产发布、权限、外部依赖、跨模块契约。
4. 选择 workflow：`lite`、`standard` 或 `bugfix`。
5. 没有 active change 时，运行 `node .specforge/tools/create-change.mjs "变更标题"`。
6. 写入 `00-intake/original-request.md` 和 `00-intake/brief.md`。

## 路由结果

| 结果 | 含义 | 下一步 |
|---|---|---|
| `NO_SPEC_NEEDED` | 小改动，风险低，边界明确 | 直接实现并记录验证 |
| `SINGLE_CHANGE` | 一个独立 change 可交付 | 进入 requirements |
| `MULTI_CHANGE` | 需要拆多个 change | 先写 roadmap 或拆分计划 |
| `EXTEND_EXISTING` | 属于已有 active change | 更新该 change intake |
| `MIXED` | 同时包含多个性质 | 先拆范围，不急着实现 |

## brief 必含内容

- 背景和目标。
- 本次负责和不负责。
- 受影响区域。
- 候选 workflow 和理由。
- 风险、依赖和澄清项。
- 下一步建议。

## 停止条件

- 多个 active change，用户未指定目标。
- 请求边界无法判断。
- 涉及生产、安全、权限或数据风险但缺少关键事实。
- 用户的目标和现有 `knowledge` 明显冲突。

## 完成标准

- change 已创建或已有 change 已被明确选中。
- intake 产物足以支撑 requirements。
- 所有歧义都用 `[NEEDS CLARIFICATION: question]` 标记。
