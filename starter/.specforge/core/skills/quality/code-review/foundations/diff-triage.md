# Diff Triage

Diff triage 的目标是确认“仓库真实发生了什么”，而不是只相信实现报告。

## 必查命令

```bash
git status --short --untracked-files=all
git diff --name-only
git diff --stat
```

必要时读取关键文件 diff。若 review 范围是某个 commit 或 PR，对应记录 commit range。

## 三向对账

| 来源 | 检查点 |
| --- | --- |
| `03-implementation/changed-files.md` | 是否列出所有真实变更和新增文件 |
| `03-implementation/report.md` | 是否说明实现内容、偏离、验证和风险 |
| `git diff / status` | 是否存在未登记、无来源、越界或未追踪变更 |

## 常见 finding

- changed-files 漏掉真实 diff 文件。
- changed-files 登记了文件，但 git diff 没有对应变化。
- untracked 文件未登记。
- 实现报告声称完成任务，但 diff 没有支撑。
- diff 超出 task `_Boundary:_`，且没有 approved spec 或偏离说明。
- 生成文件、锁文件、配置文件改变但未解释影响。
