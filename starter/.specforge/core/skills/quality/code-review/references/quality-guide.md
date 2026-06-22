# Code Review Quality Guide

本文件保存 code review 常见失败和修正顺序。写完 review 后读取本文件，先修 gate 判断，再修表达。

## Anti-Patterns

| 反模式 | 表现 | 修正 |
| --- | --- | --- |
| Style-first review | 先写命名、格式、抽象层次，忽略 spec 偏离 | 先做 spec compliance 和 diff reconciliation |
| Trusting the report | 只读 implementation report，不看 git diff / status | 必须三向对账 |
| Generic advice | “建议补测试 / 注意安全”但无位置和影响 | 每条 finding 绑定 location、impact、required fix |
| External reviewer as gate | 外部 review 模板或第三方 agent 输出直接决定 gate | 删除外部 reviewer 依赖，只按本地 checklist 形成具体 finding |
| Evidence laundering | 把未运行测试写成通过 | 标为 missing / deferred，并写 owner 和触发条件 |
| Hidden scope creep | diff 超出 tasks 但写成顺手优化 | 标 P1，要求退回或补 approved spec |
| P2 buried | 残余风险只放总结，不进入 verification notes | P2 必须进入 residual risks 和 verification notes |

## 修正顺序

1. 先修 gate 前置、真实 diff 范围和三向对账。
2. 再修 spec compliance 和 P0 / P1 finding。
3. 再修 risk review、P2 residual risks 和 verification notes。
4. 最后删除风格化、泛泛建议或没有 location / impact / required fix 的 finding。
