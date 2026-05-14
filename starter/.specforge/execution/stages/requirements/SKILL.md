---
name: requirements
description: SpecForge 内部需求技能。用于为 work item 生成清晰、可测试的功能需求、非功能需求、范围边界、不在范围内和验收标准。
---

# Requirements Skill

本技能把 intake 转成可测试需求。需求只描述用户、操作者、系统外部可观察行为，不提前写实现方案。

## 读取

- `00-intake/original-request.md`
- `00-intake/brief.md`
- `00-intake/prd.md`（存在时，作为产品意图输入，不是可测试需求的替代品）
- `.specforge/policy/rules/analysis-workflow/README.md`
- `.specforge/policy/rules/spec-quality/README.md`
- `.specforge/policy/rules/boundaries/README.md`
- 产品、页面、全栈应用或复杂功能必须读取 `.specforge/policy/rules/product-discovery/README.md`
- 相关 `.specforge/workspace/knowledge/` 文件

## 写入

- `01-spec/requirements.md`

## 写作流程

1. 提炼用户目标和业务结果。
2. 整理 intake 证据包：需求理解、代码库探索、外部研究 / 跳过理由、用户澄清和分析综合。
3. 若存在 PRD，先提取产品目标、用户画像、核心场景和成功指标，再转译成系统可观察行为；不要原样复制 PRD。
4. 从 brief 的候选功能池中整理用户已确认的 MVP、明确延后项和 Agent 默认假设。
5. 如果候选功能没有经过用户确认，先列出选择问题，不要把默认 MVP 伪装成已确认需求。
6. 拆成功能需求、非功能需求、约束和非目标。
7. 为每条需求补可验证验收标准。
8. 标出依赖、重新验证触发条件和已知歧义。
9. 避免写文件名、类名、数据库字段等实现细节，除非用户请求本身就是契约变更。

## 质量标准

- 每条需求能被测试、审查或人工验收。
- 非目标和边界足以防止实现阶段扩大范围。
- 验收标准描述输入、动作、期望结果。
- 风险需求明确触发后续 design、security、testing 或 delivery 规则。

## 停止条件

- 目标用户、成功标准或范围无法判断。
- intake 证据包不足以支撑需求；复杂需求缺少探索、研究或澄清记录。
- 产品功能组合、目标用户或版本边界没有确认。
- 需求互相冲突。
- 验收标准无法定义。
- 需要产品或业务决策才能继续。

## 完成标准

- `requirements.md` 可以独立支撑 design。
- 所有未决问题都显式标记。
- 没有把设计方案伪装成需求。
