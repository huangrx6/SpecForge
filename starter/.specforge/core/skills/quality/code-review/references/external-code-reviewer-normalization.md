# External Code Reviewer Normalization

外部 `quality/code-reviewer` 是规则参考，不是 SpecForge gate 入口。

## 何时读取

| 风险信号 | 可读取 |
| --- | --- |
| SQL、ORM raw query、搜索、筛选 | `rules/security-sql-injection.md` |
| HTML / Markdown / 富文本 / 用户输入展示 | `rules/security-xss-prevention.md` |
| 列表页、批量查询、循环内 DB / API | `rules/performance-n-plus-one.md` |
| try/catch、错误响应、重试、后台任务 | `rules/correctness-error-handling.md` |
| 命名导致误解 | `rules/maintainability-naming.md` |
| 公共类型边界模糊 | `rules/maintainability-type-hints.md` |

## 归一化规则

- 不复制外部模板标题。
- 不调用任何外部 code-reviewer agent。
- 只把规则转成具体 finding。
- Finding 必须绑定文件 / 行号或 artifact section。
- 若外部规则和 approved spec 冲突，以 approved spec 和项目标准为准。
