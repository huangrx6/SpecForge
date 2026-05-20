# Test Cases

> 本文件在 verification 执行前创建，用于把 requirements / gap_report / tasks / UI / technical design / code review notes 转成可执行测试用例。执行结果写回 `05-verification/report.md`。

## 1. Coverage Sources

| Source | Item | Risk | Test cases |
|---|---|---|---|
| REQ / GAP / TASK / UI / TD / REVIEW | | high / medium / low | |

## 2. Test Case Matrix

| ID | Type | Source | Preconditions | Steps | Assertions | Evidence Required | Automation | Risk |
|---|---|---|---|---|---|---|---|---|
| TC-001 | unit / integration / contract / playwright / startup / manual | | | | | command output / screenshot / trace / log / report | command / Playwright / manual | high / medium / low |

## 3. Playwright Cases

> 有浏览器页面流程、上传、提交、审批、下载、权限、路由跳转或错误提示时必填。

| ID | Page / Flow | Role | Data | Automated Steps | Assertions | States Covered | Evidence |
|---|---|---|---|---|---|---|---|
| PW-001 | | | | click / fill / upload / submit / approve / download | UI text / URL / network / state | success / error / permission / boundary / responsive | |

## 4. Boundary And Negative Cases

| ID | Boundary / Failure | Expected Result | Evidence |
|---|---|---|---|
| | | | |

## 5. Skipped Or Deferred

| ID | Reason | Impact | Owner | Revalidation Trigger |
|---|---|---|---|---|
| | | | | |
