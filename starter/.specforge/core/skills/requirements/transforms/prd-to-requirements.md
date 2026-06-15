# PRD To Requirements

PRD 回答为什么做、给谁做、第一版做什么；requirements 回答系统必须表现出哪些可测试行为。

## 转译流程

1. 读取 PRD control / decision status，确认可进入 requirements。
2. 抽取目标用户、MVP、非目标、成功指标、验收种子和风险。
3. 把每个已确认 MVP 能力拆成系统行为。
4. 把验收种子改写为 AC，不保留 PRD 原句。
5. 把指标转成 NFR 或验证线索。
6. 把产品备注、路线图、后续版本写入非目标或 deferred。

## 失败信号

- PRD 只有价值叙述，没有 MVP 行为。
- PRD 的 MVP 未确认。
- PRD 中的验收种子无法转成 Given / When / Then。
- PRD 把技术方案写成产品要求，且没有用户确认。

遇到失败信号时，requirements 不应补造结论；写 pending 并退回 `sf-prd` 或 `sf-brainstorm`。
