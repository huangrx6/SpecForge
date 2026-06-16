# CodeGraph to Graph Facts

## 转换规则

| CodeGraph 输出 | Graph fact type | 说明 |
|---|---|---|
| symbol / node | `symbol` | subject 写 symbol 名，source_paths 写定义文件 |
| callers | `call` | subject 写 caller，relation 写 `calls`，object 写目标 symbol |
| callees | `call` | subject 写当前 symbol，relation 写 `calls`，object 写 callee |
| impact | `dependency` / `risk` / `test` | 影响面明确时拆成多个事实 |
| route / handler | `api` | 记录 path、handler、source_paths |
| affected tests | `test` | relation 写 `should_verify` |

## 必填

- `provider: "codegraph"`
- `query`
- `source_paths`
- `indexed_at`
- `freshness`

没有 `source_paths` 时只能 low confidence。

