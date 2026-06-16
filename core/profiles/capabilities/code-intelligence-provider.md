# Code Intelligence Provider Capability

用于选择和验证 CodeGraph / MCP / SCIP / Repomix / bootstrap map 等代码理解能力。

## 适用

- 存量项目 onboarding、`sf-steering`、`sf-intake`、`sf-requirements`、`sf-tech-design`、`sf-tasking`、`sf-implement`、`sf-code-review`、`sf-verify`、`sf-wiki` / `sf-close` 中需要代码智能的场景。
- 需要分析模块入口、符号关系、调用链、影响面、affected tests 或 provider freshness。
- 需要把图谱事实沉淀到 wiki，而不是靠人工摘要反复重读全仓。

## Provider 选择

| 场景 | 推荐 |
|---|---|
| small | bootstrap map + `rg` |
| medium | bootstrap map + `rg`；局部上下文可用 Repomix |
| large / legacy | CodeGraph / MCP / SCIP graph provider |
| focused bug / change | 先限定模块；必要时用 graph provider 做 trace / impact |

## Design 必填

- 本次是否需要代码智能 provider？为什么不是只读 wiki / `rg`？
- 选择哪个 provider：CodeGraph、MCP、SCIP、Repomix、bootstrap map？
- provider health 是否 ready？索引是否 initialized / clean / fresh？
- CodeGraph 是否只是 CLI installed，还是已经 mcp-configured / initialized / ready？
- 需要哪些查询：context、trace、impact、affected tests、explore？
- graph facts 如何归一：`graph_facts[]` 的 type、subject、relation、object、source_paths、confidence、indexed_at、used_for_wiki。
- 哪些 graph facts 会进入 wiki？哪些只作为本次 work item 证据？

## 验证

- `node .specforge/core/scripts/codebase-index.mjs --json` 输出 provider health。
- `node .specforge/core/scripts/graph-freshness.mjs --json` 输出 freshness。
- `node .specforge/core/scripts/graph-impact.mjs --from-git --json` 输出 changed files -> impact / affected tests 候选。
- 使用 `--provider-facts <json>` 导入 CodeGraph / MCP / SCIP 查询结果时，report 必须显示 Graph Facts summary。
- 写入 wiki 的模块、API、数据或运行事实必须有 source path 或 graph fact id。
- provider 未 ready 时不能把图谱输出作为当前事实；只能写风险或待补证。
