# Diff to Impact

## 输入

- `git diff --name-only`
- `03-implementation/changed-files.md`
- CodeGraph `affected` / `impact`
- fallback `rg` 查询结果

## 输出

```json
{
  "changed_files": [],
  "affected_modules": [],
  "affected_symbols": [],
  "affected_tests": [],
  "graph_facts": [],
  "fallback_used": false,
  "confidence": "high | medium | low"
}
```

## 规则

- provider ready 时优先使用 CodeGraph affected / impact。
- provider 不可用时，按 changed files 同目录、测试命名约定和 `rg` 引用做低置信 fallback。
- 只把 impact 写为候选；真实 gate 仍依赖测试、review 和 verification 证据。

