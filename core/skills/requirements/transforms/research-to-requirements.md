# Research To Requirements

research 事实不能直接变成产品范围；它只能约束行为、风险、兼容性、NFR 或下游验证。

## 转译规则

| Research 结论 | requirements 处理 |
|---|---|
| confirmed limitation | constraint / NFR / non-goal |
| confirmed capability | 可支撑 REQ，但仍需要产品确认 |
| likely | risk / verification cue |
| unclear | pending / research blocker |
| conflict | stop and request decision |

## 输出示例

```md
| NFR-002 | Compatibility | THE SYSTEM SHALL support CSV files encoded as UTF-8. | research.md#source-2 | AC-004 |
```
