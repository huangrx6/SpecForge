# Impact And Affected Tests

影响面分析用于 code review、tasking 和 verification 的范围选择，不替代真实测试执行。

## 输入

- `git diff --name-only`
- `03-implementation/changed-files.md`
- `graph_facts[]` 中的 call / dependency / test 关系
- CodeGraph `affected` 或 `impact` 结果
- fallback `rg` 查询结果

## 机器入口

```bash
node .specforge/core/scripts/graph-impact.mjs --from-git --json
node .specforge/core/scripts/graph-impact.mjs --changed-files "src/a.ts,src/b.ts" --json
```

输出形状：

```json
{
  "changed_files": [],
  "affected_modules": [],
  "affected_symbols": [],
  "affected_tests": [],
  "graph_facts": [],
  "fallback_used": false,
  "confidence": "high | medium | low | unknown"
}
```

## 规则

- provider ready 时优先使用 CodeGraph affected / impact。
- provider 不可用时，按 changed files 同目录、测试命名约定和 `rg` 引用做低置信 fallback。
- fallback 结果只能作为候选；gate 仍依赖测试、review 和 verification 证据。
- 每个中高风险 changed file 至少要有 affected module、风险说明或明确 N/A。
- affected tests 不是“已经运行的测试”；它只是优先运行列表。

## 阶段使用

| 阶段 | 使用方式 |
| --- | --- |
| `sf-tasking` | 把 affected modules 拆进任务边界，把 affected tests 写入 `_Verification:_` |
| `sf-code-review` | 检查 affected tests 是否已运行；未运行则写 finding 或 verification note |
| `sf-verify` | 优先运行 affected tests；UI route 受影响时补 Playwright |
| `sf-wiki` / `sf-close` | 判断 diff 是否改变长期 Wiki 事实 |

## Fallback 质量

低置信 fallback 可以用：

- changed file 同目录测试。
- `*.test.*`、`*.spec.*`、`e2e`、`__tests__` 命名约定。
- `rg` 查 changed symbol / route / API path。
- package / module 边界。

低置信 fallback 必须在 artifact 中写明 `fallback_used=true` 或等价说明，不能写成 provider 已确认。
