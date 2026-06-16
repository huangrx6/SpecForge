# Graph Facts 契约

`graph_facts[]` 是 CodeGraph / MCP / SCIP / Repomix / bootstrap map / `rg` 事实进入 SpecForge artifact 的统一结构。

## 字段

```json
{
  "id": "GF-001",
  "type": "module | entry | symbol | call | dependency | api | data | test | operation | risk",
  "subject": "",
  "relation": "",
  "object": "",
  "source_paths": [],
  "provider": "codegraph | codebase-memory-mcp | codegraphcontext | repomix | bootstrap-map | rg",
  "query": "",
  "confidence": "high | medium | low | unknown",
  "indexed_at": "",
  "freshness": "ready | pending-sync | manual-verified | stale | unknown",
  "used_for": ["wiki", "requirements", "technical-design", "tasking", "code-review", "verification"],
  "used_for_wiki": false,
  "notes": ""
}
```

## 置信度边界

| 置信度 | 条件 |
|---|---|
| `high` | provider ready，query 明确，`source_paths` 指向当前仓库，且关键文件已读取或验证 |
| `medium` | provider ready，但只验证了部分路径或语义仍需人工判断 |
| `low` | 仅 bootstrap / `rg` / 文件名候选，或 provider freshness 不 clean |
| `unknown` | 证据不足，只能作为待补证项 |

## 禁止

- 没有 `source_paths` 时写 `high`。
- `freshness=pending-sync` 或 `stale` 时写当前事实。
- 把 `graph_facts[]` 原样当 requirements 的 MUST / SHALL。
- 把 provider 原始大段输出直接粘贴进 Wiki。
