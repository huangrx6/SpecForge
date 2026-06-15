# Tests / Evidence Checklist

| 检查项 | Fail signal |
| --- | --- |
| 来源覆盖 | REQ / AC / GAP / task / review finding 没有对应测试或跳过理由 |
| 失败路径 | 只测 happy path |
| 自动化 | 高风险路径没有 unit / integration / contract / E2E 证据 |
| 启动验证 | 无 build、typecheck、server start、health check 或等价证据 |
| UI 证据 | 有浏览器流程但无 Playwright、截图、trace 或人工验证 |
| Deferred | 延后验证没有 owner、影响和重新验证触发条件 |
| 证据强度 | 高风险结论只有 claimed，没有 observed / proven |
