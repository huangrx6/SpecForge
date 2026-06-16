# Affected Tests

受影响测试用于 code review 和 verification 的验证范围选择，不替代真实测试执行。

## 输入

- `git diff --name-only`
- `03-implementation/changed-files.md`
- `graph_facts[]` 中的 call / dependency / test 关系
- CodeGraph `affected` 或 `impact` 结果

## 输出

| 字段 | 含义 |
|---|---|
| `changed_files` | 真实变更文件 |
| `affected_symbols` | 受影响 symbol |
| `affected_modules` | 受影响模块 |
| `affected_tests` | 建议优先运行的测试 |
| `confidence` | high / medium / low |
| `fallback_used` | provider 不可用时是否用文件名约定 / `rg` 推断 |

## 使用规则

- `sf-code-review`：检查 affected tests 是否已运行，未运行则写 finding 或 verification 提示。
- `sf-verify`：优先运行 affected tests；UI route 受影响时补 Playwright。
- `sf-tasking`：把 affected tests 写入每个任务的 `_Verification:_`。
- provider 不可用时，用 `rg`、测试文件命名约定和 changed files 目录关系做低置信 fallback。

