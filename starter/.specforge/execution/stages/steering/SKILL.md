---
name: steering
description: SpecForge 内部 steering 技能。用于大型或 brownfield 变更前刷新 .specforge/workspace/knowledge 下的长期项目上下文和架构现实。
---

# Steering Skill

本技能用于大型变更、brownfield 项目接入或长期知识过期时，刷新 `.specforge/workspace/knowledge/`。它描述当前现实，不写未来愿望。

## 读取

- 当前代码库入口、目录结构、配置和核心模块。
- 现有 `.specforge/workspace/knowledge/`。
- 必要时读取相关 active / archived changes。
- `.specforge/policy/rules/context/README.md`
- `.specforge/policy/rules/boundaries/README.md`

## 写入

- `.specforge/workspace/knowledge/product.md`
- `.specforge/workspace/knowledge/architecture.md`
- `.specforge/workspace/knowledge/glossary.md`
- `.specforge/workspace/knowledge/risks.md`
- 必要时新增 `.specforge/workspace/knowledge/decisions/<id>.md`

## 工作流程

1. 先从 manifest、registry 和 knowledge 判断已有事实。
2. 用 `rg` 定位代码入口、路由、配置、数据模型、测试和部署文件。
3. 只记录经过代码或用户确认的事实。
4. 把猜测、计划和未确认建议留在当前 change，不写入 knowledge。
5. 如果发现 knowledge 与代码冲突，记录冲突和采用依据。

## 适用场景

- 新业务项目接入 SpecForge。
- 大型功能前需要恢复架构上下文。
- 项目已长期演进，knowledge 明显过期。
- closure 时发现长期知识缺失。

## 停止条件

- 代码事实不足以支持结论。
- 需要用户确认业务含义。
- 发现历史记录和当前实现冲突但无法判断。

## 完成标准

- knowledge 只记录长期有效事实。
- 架构边界清楚到可以被 specs 引用。
- 未确认内容没有混进 knowledge。
