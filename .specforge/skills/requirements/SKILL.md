---
name: requirements
description: SpecForge 内部需求技能。用于为 change 生成清晰、可测试的功能需求、非功能需求、范围边界、不在范围内和验收标准。
---

# Requirements Skill

本技能把 intake 转成可测试需求。需求只描述用户、操作者、系统外部可观察行为，不提前写实现方案。

## 读取

- `00-intake/original-request.md`
- `00-intake/brief.md`
- `.specforge/rules/spec-quality/README.md`
- `.specforge/rules/boundaries/README.md`
- 相关 `.specforge/knowledge/` 文件

## 写入

- `01-spec/requirements.md`

## 写作流程

1. 提炼用户目标和业务结果。
2. 拆成功能需求、非功能需求、约束和非目标。
3. 为每条需求补可验证验收标准。
4. 标出依赖、重新验证触发条件和已知歧义。
5. 避免写文件名、类名、数据库字段等实现细节，除非用户请求本身就是契约变更。

## 质量标准

- 每条需求能被测试、审查或人工验收。
- 非目标和边界足以防止实现阶段扩大范围。
- 验收标准描述输入、动作、期望结果。
- 风险需求明确触发后续 design、security、testing 或 delivery 规则。

## 停止条件

- 目标用户、成功标准或范围无法判断。
- 需求互相冲突。
- 验收标准无法定义。
- 需要产品或业务决策才能继续。

## 完成标准

- `requirements.md` 可以独立支撑 design。
- 所有未决问题都显式标记。
- 没有把设计方案伪装成需求。
