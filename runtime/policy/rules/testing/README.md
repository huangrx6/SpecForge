# 测试规则入口

测试规则用于让 verification gate 有证据，而不是只写“已自测”。

## 什么时候启用

- `ui_design` 和 `technical_design` 阶段制定对应验证策略。
- implementation 阶段补测试。
- verification 阶段产出 evidence。
- code review 判断验证是否足够。

## 按需加载参考

| 场景 | 继续读取 |
|---|---|
| 测试分层、风险匹配、测试策略 | `references/test-strategy.md` |
| verification report、CI、手工证据、无法运行测试 | `references/evidence-reporting.md` |

## 核心原则

- 验证深度要匹配变更风险。
- 测试应证明验收标准，而不是只证明代码执行过。
- 自动化优先；无法自动化时，必须留下可复现手工步骤和证据。
- 没有 evidence 时，不标记 verification complete。

Practical Test Pyramid 强调测试层次取舍；Google Review 也要求生产代码变更应有相关测试；Kiro 的 specs 则把测试和任务推进深度绑定。
