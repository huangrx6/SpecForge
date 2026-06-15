# Evidence Strength

| 等级 | 含义 | 适用 |
| --- | --- | --- |
| claimed | 文档声明、未执行、仅 planning | 只能用于计划 |
| observed | 人工观察、截图、headed browser、启动日志 | demo / smoke / 手工补证 |
| proven | 自动化测试通过，有命令输出、trace、report，可复现 | 高风险结论 |

补充状态：

- `mocked`：mock / fake provider 证明局部协议或状态，不能证明真实端到端。
- `manual-confirmed`：用户或负责人明确接受外部待补证。
- `deferred`：已知缺口延后，必须有 owner、影响和触发条件。
- `missing`：无证据，不支持 gate。

## 规则

- 高风险用例目标必须是 `proven`。
- UI 关键流程至少 `observed + screenshot`。
- Playwright E2E 通过且有 trace / report 才是 `proven`。
- mock 只能证明局部结论。
- 手动登录流程可以 `observed`，但必须说明不能全自动的原因。
