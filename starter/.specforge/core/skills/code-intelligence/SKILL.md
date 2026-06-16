---
name: code-intelligence
description: SpecForge 代码智能能力包。用于任何阶段需要使用 Wiki-first、CodeGraph、MCP / SCIP provider、Repomix、bootstrap map 或 rg 来定位现有系统范围、调用链、影响面、受影响测试、图谱事实和 Wiki 回写候选时必读；不要只在 sf-steering 中使用。
---

# 代码智能

本 skill 是 SpecForge 的代码智能能力包。它封装 CodeGraph、codebase-memory-mcp、CodeGraphContext、Repomix、bootstrap map 和 `rg` 的使用规则。

它不属于某一个阶段。它服务于：

- `sf-steering`：建立或刷新项目画像。
- `sf-intake`：把用户请求绑定到已有系统范围。
- `sf-requirements`：验证现有行为、边界和当前事实。
- `sf-tech-design`：分析调用链、影响面、架构边界和受影响测试。
- `sf-tasking`：按依赖、风险和影响面拆任务。
- `sf-implement`：修改前定位入口，修改后检查索引新鲜度。
- `sf-code-review`：对真实 diff 做 impact / affected tests 分析。
- `sf-verify`：选择回归测试、浏览器验证和 runtime smoke 范围。
- `sf-wiki` / `sf-close`：把稳定代码事实更新为长期知识。

## 核心原则

1. **Wiki first**：已有 `.specforge/wiki/` 时先读 Wiki，再用 provider 验证局部事实。
2. **Provider second**：CodeGraph 等 provider 用于定位、调用链、影响面、受影响测试，不替代人工判断。
3. **No raw dump**：不把 provider 原始输出直接写入 Wiki、产品需求文档、需求规格或技术设计。
4. **Freshness required**：使用图谱结果前必须确认 provider ready、index clean，或处理 pending sync / stale 提示。
5. **Graph facts normalized**：所有 provider 事实先归一为 `graph_facts[]`。
6. **Stage bounded**：普通阶段不得重新全仓扫描；只围绕当前 work item 的模块、符号、API 或 changed files 查询。

## 读取路由

| 场景 | 必读 |
|---|---|
| 判断 provider 是否可用、CodeGraph 是否接入 Agent、项目是否初始化 | `foundations/provider-lifecycle.md` |
| 进入技术设计、实现、审查、验证前检查索引新鲜度 | `foundations/freshness-policy.md` |
| 需要把 provider 输出写入 report、technical design、review 或 Wiki | `foundations/graph-facts-contract.md`、`transforms/codegraph-to-graph-facts.md` |
| 日常 work item 只想定位现有模块 / API / 数据范围 | `foundations/wiki-first-context.md`、`references/provider-selection.md` |
| 使用 CodeGraph MCP / CLI | `references/codegraph-usage.md` |
| 根据 changed files 找影响面或受影响测试 | `references/affected-tests.md`、`transforms/diff-to-impact.md` |
| 判断各阶段如何接入 | `references/stage-integration.md` |
| 准备 Wiki 回写 | `transforms/graph-facts-to-wiki.md` |
| 准备技术设计影响面 | `transforms/graph-facts-to-technical-design.md` |
| 审查代码智能使用是否跑偏 | `references/anti-patterns.md` |

## 机器入口

```bash
node .specforge/core/scripts/codebase-index.mjs --json
node .specforge/core/scripts/graph-freshness.mjs --json
node .specforge/core/scripts/graph-impact.mjs --from-git --json
node .specforge/core/scripts/wiki-refresh-plan.mjs --from-diff --json
```

脚本只提供状态、候选和计划；不会把图谱原始输出直接写入长期 Wiki。

## 停止条件

- provider 未安装、未接入 Agent、未初始化、正在 indexing、pending sync 或 stale，且当前结论需要图谱事实作为高置信证据。
- 大型仓库没有 ready graph provider，且用户也没有给出目标模块、业务域、页面、接口、报错路径或复现线索。
- provider 输出没有 `source_paths`，却被尝试写成 high confidence 当前事实。
- CodeGraph / Repomix 原始上下文被直接复制进 Wiki、requirements 或 technical design。
- graph fact 与当前文件读取、测试、CI 或用户确认冲突。
