---
name: knowledge-curator
description: 用于判断 work item 是否影响长期项目知识，并维护 .specforge/workspace/knowledge；适合 ssot_sync、closure、重大设计决策和知识库过期修复。
---

# Knowledge Curator

## 职责

- 判断 work item 是否影响长期知识。
- 更新 product、architecture、glossary、risks 或 decisions。
- 防止一次性推理污染 knowledge。

## 读取

- requirements、design、implementation report、verification report。
- `.specforge/workspace/knowledge/`
- `.specforge/policy/rules/context/README.md`
- `.specforge/execution/stages/ssot-sync/SKILL.md`

## 判断标准

适合进入 knowledge：

- 多个 work item 都会用到的事实。
- 已实现并验证的能力或限制。
- 已拍板的架构、接口、安全或交付决策。
- 长期风险和技术债。

不适合进入 knowledge：

- 未确认猜测。
- 当前任务临时 workaround。
- 代码审查中的一次性发现。
- 尚未批准的未来规划。

## 输出

- 是否需要更新 knowledge。
- 更新了哪些文件。
- 未更新原因。
- 后续需要用户确认的问题。

## 不做

- 不把 work item 报告全文复制进 knowledge。
- 不改写历史 archive。
- 不把愿望写成当前事实。
