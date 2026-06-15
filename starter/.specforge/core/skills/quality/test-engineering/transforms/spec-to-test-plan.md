# Spec To Test Plan

把 approved spec 转成测试计划时，先建对象树，再选测试层级。

| Source | 转成 |
| --- | --- |
| REQ / AC | TC，正常路径 + 失败路径 |
| GAP root cause | 回归 TC |
| UI state matrix | PW / screenshot / accessibility checks |
| Technical design risk | integration / contract / smoke |
| Task `_Verification:_` | 命令或证据要求 |
| Code review P1 / P2 | regression TC 或 verification note |

每个高风险 source 至少有一个可执行 TC 或明确 deferred reason。
