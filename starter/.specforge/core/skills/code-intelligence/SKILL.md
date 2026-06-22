---
name: code-intelligence
description: SpecForge 跨阶段代码智能能力包。用于任何阶段需要 Wiki-first 定位现有代码范围、选择 CodeGraph / MCP / SCIP / Repomix / rg、检查 provider freshness、归一 graph_facts、分析影响面 / affected tests 或生成 Wiki 回写候选时必读；不要只在 sf-steering 中使用。
---

# 代码智能

本 skill 是 SpecForge 的跨阶段代码智能能力包。它不负责“把仓库全读一遍”，而是把已有 Wiki、bounded context、provider 健康、图谱查询、`rg` fallback、影响面和 Wiki 回写候选统一成可追溯证据。

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
7. **Script aligned**：`codebase-index.mjs`、`graph-freshness.mjs`、`graph-impact.mjs`、`wiki-refresh-plan.mjs` 是机器入口；skill 文档必须解释这些输出怎么进入 artifact。

## 读取路由

| 场景 | 必读 |
|---|---|
| 判断是否需要代码智能、如何从 Wiki 建 bounded context、如何选扫描模式 | `references/workflow-playbook.md` |
| provider 生命周期、CodeGraph MCP / CLI、freshness、sync 和安装 / 初始化边界 | `references/provider-and-freshness.md` |
| provider / bootstrap / rg 事实如何归一成 `graph_facts[]`，以及置信度边界 | `references/graph-facts-contract.md` |
| 根据 changed files / symbol 找影响面、受影响测试、fallback 和回归范围 | `references/impact-and-affected-tests.md` |
| 各阶段读取什么、写到哪里、哪些结论只能低置信 | `references/stage-integration.md` |
| diff 后如何生成 Wiki 回写候选，如何把 facts 写进 Wiki / technical design | `references/wiki-and-output-contract.md` |
| 常见误用、质量检查和修复顺序 | `references/quality-guide.md` |
| 需要生成查询计划或 impact 表时的输出模板 | `references/query-prompts.md` |

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
