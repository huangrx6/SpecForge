# 审查规则入口

审查的目标不是“挑刺”，而是阻止错误阶段推进，并把风险转成清晰可修的修改项。

## 什么时候启用

- `spec_review`
- `code_review`
- 需要判断风险等级、阻断级别、输出结论格式

## 按需加载参考

| 场景 | 继续读取 |
|---|---|
| 规格审查 | `references/spec-review.md` |
| 代码审查 | `references/code-review.md` |
| findings、严重级别、评论风格 | `references/findings-format.md` |

## 基本姿态

- 先看 correctness、边界、安全、测试和回滚，再看风格。
- 所有发现必须指向具体文件、产物、需求、任务或证据。
- 不用个人偏好阻断 work item，除非偏好已经是项目规则。
- 对可接受风险写明为什么可接受。
- 对阻断项写明修改后如何重新审查。

Google Engineering Practices 强调 code review 的标准是改善整体代码健康，而不是追求个人完美主义；技术事实应优先于个人偏好。
