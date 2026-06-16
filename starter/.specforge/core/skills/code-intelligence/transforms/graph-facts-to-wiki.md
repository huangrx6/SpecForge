# Graph Facts 到 Wiki

## 目标选择

| 事实类型 | Wiki 目标 |
|---|---|
| `module` / `entry` / `symbol` / `dependency` | `03-architecture.md` 或 `module-<name>.md` |
| `api` | `external-interfaces.md` 或 `api-<domain>.md` |
| `data` | `04-data-model.md` |
| `operation` | `05-operations.md`、`config-env.md` 或 `jobs-events.md` |
| `risk` | `08-risks.md` |
| `test` | `05-operations.md` 或 verification artifact，不一定进 Wiki |

## 写入规则

- 只写当前长期事实，不写 provider 原始输出。
- 每条写入事实保留 `GF-*` id、source path 或 query 摘要。
- `used_for_wiki=true` 的 fact 必须能在 Wiki 中被引用，或在 `08-risks.md` 写未采纳原因。
- freshness 不是 `ready` 或 `manual-verified` 时，只能写未确认缺口。
