# Source To Requirements

本文件定义如何把上游输入转成 requirements。转译不是复制；每条输出都要改变成可测试行为、边界、约束或未决项。

## 输入优先级

| 输入 | 用途 |
|---|---|
| `brainstorm.md#用户确认记录` | 判断哪些选择已确认或授权默认 |
| `brainstorm.md#明确延后 / 不做` | 生成非目标 |
| `prd.md` | 产品目标、MVP、用户、验收种子 |
| `research.md` | 已确认事实、风险、限制 |
| `gap-report.md` | bugfix 场景的缺口、复现和根因 |
| `.specforge/wiki/` | 长期业务规则、模块边界、既有约束 |

## 转译表

```md
## 2. Source -> Requirement 转译

| Source item | 类型 | 确认状态 | 转译结果 | 状态 |
|---|---|---|---|---|
| | MVP / non-goal / acceptance seed / constraint / risk / open question | user-confirmed / delegated-default / agent-recommendation / pending | REQ / AC / NFR / out-of-scope / pending | ready / blocked |
```

## 转译规则

- MVP 能力 -> 至少一个 REQ。
- Acceptance seed -> AC draft，再补 Given / When / Then。
- 产品指标 -> NFR 或 verification cue；无法验证则保留为产品指标。
- UI note -> UI impact / state / copy hint；不写组件方案。
- Technical note -> technical handoff；不写架构结论。
- Research fact -> constraint / risk / NFR。
- Deferred / rejected -> Out of Scope。
- Pending / recommendation -> 未决问题，不进 REQ。
