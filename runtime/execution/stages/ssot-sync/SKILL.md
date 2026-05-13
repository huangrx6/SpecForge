---
name: ssot-sync
description: SpecForge 内部 SSoT 同步技能。用于 closure 前判断 change 是否影响 .specforge/workspace/knowledge 长期项目知识，并更新或说明不更新原因。
---

# SSoT Sync Skill

本技能在 closure 前判断 change 是否影响长期项目知识，并更新 `.specforge/workspace/knowledge/` 或说明不需要更新。它是防止“代码已变、知识库过期”的收口步骤。

## 读取

- `01-spec/requirements.md`
- `01-spec/design.md`
- `03-implementation/report.md`
- `05-verification/report.md`
- `.specforge/workspace/knowledge/`
- `.specforge/policy/rules/delivery/README.md`
- `.specforge/policy/rules/gates/README.md`

## 写入

- `06-closure/ssot-sync.md`
- 必要时更新 `.specforge/workspace/knowledge/product.md`
- 必要时更新 `.specforge/workspace/knowledge/architecture.md`
- 必要时更新 `.specforge/workspace/knowledge/glossary.md`
- 必要时更新 `.specforge/workspace/knowledge/risks.md`
- 必要时新增 `.specforge/workspace/knowledge/decisions/<id>.md`

## 判断维度

- 产品能力、状态或限制是否变化。
- 架构、模块边界、接口、数据模型是否变化。
- 权限、安全、配置、部署、运行方式是否变化。
- 是否产生长期决策或新技术债。
- 是否改变下游验证、发布或回滚方式。

## 输出要求

- 明确“影响”或“不影响”。
- 列出更新文件。
- 说明没有更新的理由。
- 写明契约变化和下游重新验证要求。

## 停止条件

- verification 未批准。
- 无法判断长期影响。
- 需要更新 knowledge 但缺少事实证据。

## 完成标准

- `ssot-sync.md` 存在。
- knowledge 更新与 change 证据一致。
- `ssot_sync` gate 可以被批准或有明确阻断原因。
