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
- `.specforge/core/standards/product.md`
- `.specforge/core/standards/workflow.md`
- `.specforge/core/standards/ai-toolkit.md`
- 需要用户故事、3C、INVEST、Given/When/Then 或验收标准检查时读取 `.specforge/core/skills/requirements/user-stories/SKILL.md`
- 相关 `.specforge/wiki/` 文件

## 写入

- `01-spec/requirements.md`

## 写作流程

1. 提炼用户目标和业务结果。
2. 整理 intake 证据包：需求理解、代码库探索、外部研究 / 跳过理由、用户澄清和分析综合。
3. 检查 `brief.md#PRD 决策`：如果需要 PRD 但 `prd.md` 不存在或 `Decision Status` 不是 `approved-for-requirements`，停止并回到 `sf-prd`。
4. 若存在 PRD，先提取产品目标、用户画像、核心场景、MVP 决策、验收种子和成功指标，再转译成系统可观察行为；不要原样复制 PRD。
5. 从 brief 的候选功能池中整理用户已确认的 MVP、明确延后项和 Agent 默认假设。
6. 如果候选功能没有经过用户确认，先列出选择问题，不要把默认 MVP 伪装成已确认需求。
7. 按需求风险选择访谈镜头：角色 / 权限、状态流转、数据文件、AI 质量、UI 影响、运行时约束。不要机械套固定问卷。
8. 拆成功能需求、非功能需求、约束和非目标。
9. 为每条需求补可验证验收标准；适合时使用 Given/When/Then 或 EARS。每条 `MUST` 需求至少覆盖正常路径，并按适用性补失败、空状态、边界值和权限差异。
10. 标出依赖、重新验证触发条件和已知歧义。
11. 对中高复杂度需求执行一致性检查：用户目标、MVP、角色权限、数据口径、验收标准、非目标和影响面不得互相冲突；冲突必须请求人工确认。
12. 如果需求可能需要新增 / 替换直接依赖、SDK、插件、组件库、ORM、驱动、测试库、浏览器自动化库或外部 provider，在依赖小节写 `[DEPENDENCY DECISION REQUIRED]` 或 `[NEEDS DEPENDENCY DECISION]`；不要在 requirements 中替用户选依赖。
13. 如果需求会迫使技术设计选择包管理器、UI 组件库、样式方案、Python 依赖管理 / 虚拟环境、构建工具、测试 runner、任务运行器或 monorepo 工具，写 `[TOOLING DECISION REQUIRED]` 或 `[NEEDS TOOLING DECISION]`；不要在 requirements 中替用户选工程偏好。
14. 校准 `work.yaml` 的 components flags：`has_ui`、`has_api`、`has_db`、`has_domain`、`has_ai`、`has_integration`、`needs_research`。
15. 避免写文件名、类名、数据库字段等实现细节，除非用户请求本身就是契约变更。

## 第三方 Skill 归一化

第三方 skill 只提供检查视角，不改变 SpecForge artifact 格式：

- `user-stories` 的用户故事 -> 写入 `目标用户与场景` 或功能需求来源说明。
- Given/When/Then -> 写入 `验收标准`，并补充验证方式。
- INVEST / Story splitting -> 用于判断需求是否过大；过大时建议拆 work item 或标记后续版本。
- Definition of Done、故事点、Sprint、Assignee -> 不写入 requirements，最多转成验证或项目管理备注。

## 质量标准

- 每条需求能被测试、审查或人工验收。
- `Spec Quality Gate` 已说明输出预算、冲突扫描、可测试性和下一阶段可开工性。
- PRD 的 MVP 能力和验收种子已经转成 REQ / AC / NFR / 非目标 / 待澄清项之一。
- 非目标和边界足以防止实现阶段扩大范围。
- 验收标准描述输入、动作、期望结果。
- 风险需求明确触发后续 design、security、testing 或 delivery 规则。
- requirements 能解释为什么需要或不需要 `ui_design` / `technical_design`。

## 停止条件

- 目标用户、成功标准或范围无法判断。
- intake 证据包不足以支撑需求；复杂需求缺少探索、研究或澄清记录。
- 产品功能组合、目标用户或版本边界没有确认。
- 需求互相冲突。
- 验收标准无法定义。
- 需要产品或业务决策才能继续。

## 完成标准

- `requirements.md` 可以独立支撑 design。
- `work.yaml` 的 components flags 与 requirements 一致。
- 所有未决问题都显式标记。
- 没有把设计方案伪装成需求。
