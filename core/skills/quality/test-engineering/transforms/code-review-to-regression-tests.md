# Code Review To Regression Tests

| Finding | 测试处理 |
| --- | --- |
| P0 / P1 | 修复后必须有 regression TC |
| P2 weak evidence | verification note + stronger evidence target |
| Security / permission | negative test |
| Data / migration | integration or migration test |
| UI state | Playwright flow or screenshot evidence |
| Flaky selector | locator contract update |

Code review finding 不能只进入文字风险；可验证的 finding 必须转成 TC / PW 或明确 deferred。
