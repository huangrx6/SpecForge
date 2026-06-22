# Graph Facts Contract

`graph_facts[]` 是 CodeGraph / MCP / SCIP / Repomix / bootstrap map / `rg` 事实进入 SpecForge artifact 的统一结构。所有 provider 输出先归一，再进入 report、technical design、review、verification 或 Wiki。

## Schema

```json
{
  "id": "GF-001",
  "type": "module | entry | symbol | call | dependency | api | data | test | operation | risk",
  "subject": "",
  "relation": "",
  "object": "",
  "source_paths": [],
  "provider": "codegraph | codebase-memory-mcp | codegraphcontext | repomix | bootstrap-map | rg | manual",
  "query": "",
  "confidence": "high | medium | low | unknown",
  "indexed_at": "",
  "freshness": "ready | pending-sync | manual-verified | stale | unknown",
  "used_for": ["wiki", "requirements", "technical-design", "tasking", "code-review", "verification"],
  "used_for_wiki": false,
  "notes": ""
}
```

## 类型转换

| Provider 输出 | Graph fact type | 说明 |
| --- | --- | --- |
| symbol / node | `symbol` | subject 写 symbol 名，source_paths 写定义文件 |
| module / package / directory | `module` | relation 写 `contains` / `owns` / `depends_on` |
| callers | `call` | subject 写 caller，relation 写 `calls`，object 写目标 symbol |
| callees | `call` | subject 写当前 symbol，relation 写 `calls`，object 写 callee |
| impact | `dependency` / `risk` / `test` | 影响面明确时拆成多个事实 |
| route / handler | `api` | 记录 path、handler、source_paths |
| data model / repository / migration | `data` | 记录读写对象、schema、migration |
| runtime / config / job | `operation` | 记录运行、配置、队列、计划任务 |
| affected tests | `test` | relation 写 `should_verify` |

## 置信度

| 置信度 | 条件 |
| --- | --- |
| `high` | provider ready，query 明确，`source_paths` 指向当前仓库，且关键文件已读取或验证 |
| `medium` | provider ready，但只验证了部分路径或语义仍需人工判断 |
| `low` | 仅 bootstrap / `rg` / 文件名候选，或 provider freshness 不 clean |
| `unknown` | 证据不足，只能作为待补证项 |

## 写入边界

- Requirements：只能写 existing behavior / current fact / pending evidence，不能直接变成 MUST / SHALL。
- Technical design：写入 Impact Analysis、Architecture Contract、Affected Modules、Affected Tests、Implementation Handoff。
- Tasking：把 GF id 写进 `_Impact:_`，把 affected tests 写进 `_Verification:_`。
- Code review：用于检查 diff 是否超出设计边界、受影响测试是否运行。
- Verification：用于选择回归范围、Playwright 和 runtime smoke。
- Wiki：只写 verified long-lived facts，不写 provider 原文。

禁止：

- 没有 `source_paths` 时写 `high`。
- `freshness=pending-sync` 或 `stale` 时写当前事实。
- 把 `graph_facts[]` 原样当 requirements 的 MUST / SHALL。
- 把 provider 原始大段输出直接粘贴进 Wiki。
