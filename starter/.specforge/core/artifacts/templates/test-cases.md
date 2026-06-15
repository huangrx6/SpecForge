# Test Cases

## 一页摘要
| 项 | 内容 |
| --- | --- |
| 测试目标 | |
| 覆盖风险 | |
| 自动化策略 | |
| Auth strategy | none / ui-login / api-login / storage-state / manual |
| Runtime strategy | |
| 不能覆盖 | |

## 1.1 Test Design Artifacts
| Artifact | Format | Path | Derived Cases | Export Path | Status |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## 1.2 Test Engineering Artifacts
| Artifact | Path | Purpose | Status |
| --- | --- | --- | --- |
| Test plan | 05-verification/test-plan.md | 测试策略和测试对象树 | planned / ready / N/A |
| Runtime runbook | 05-verification/test-engineering/runtime-runbook.md | 启动、健康检查、日志和清理 | planned / ready / N/A |
| Auth plan | 05-verification/test-engineering/auth-plan.md | 登录态、账号来源和敏感数据处理 | planned / ready / N/A |
| Automation plan | 05-verification/test-engineering/automation-plan.md | 单元 / 集成 / contract / Playwright 命令 | planned / ready / N/A |
| Playwright flows | 05-verification/test-engineering/playwright-flows.md | 浏览器流程、locator、截图和 trace | planned / ready / N/A |

## 2. Test Case Matrix
| ID | Type | Source | Preconditions | Steps | Assertions | Evidence Required | Evidence Strength Target | Automation | Risk |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | |

## 3. Playwright Cases
| ID | Flow | Role | Data | Steps | Assertions | States | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

## 3.1 Auth And Runtime
| Item | Strategy | Source | Sensitive data handling | Cleanup |
| --- | --- | --- | --- | --- |
| Auth | none / ui-login / api-login / storage-state / manual | | | |
| Runtime | local / docker / remote / manual | | | |

## 3.2 Evidence Manifest
| Run ID | Command | Related TC / PW | Evidence path | Strength |
| --- | --- | --- | --- | --- |
| | | | 05-verification/evidence/<run-id>/ | claimed / observed / proven / mocked / manual-confirmed / deferred / missing |

## 4. Manual / External Confirmation
| 项 | 原因 | 确认人 | 后续触发 |
| --- | --- | --- | --- |
| | | | |
