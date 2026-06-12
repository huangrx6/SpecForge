# Test Cases

> 本文件在 verification 执行前创建，用于把 requirements / gap_report / tasks / UI / technical design / code review notes 转成可执行测试用例。执行结果写回 `05-verification/report.md`。

## 1. Coverage Sources

| Source | Item | Risk | Test cases |
|---|---|---|---|
| REQ / GAP / TASK / UI / TD / REVIEW | | high / medium / low | |

## 1.1 Test Design Artifacts

> XMind / 白板 / 表格可以用来发散测试设计，但不能作为最终事实源。必须导出为 Markdown / JSON，并把可执行用例回填到下方矩阵。

| Artifact | Format | Path | Derived Cases | Export Path | Status |
|---|---|---|---|---|---|
| | xmind / markdown / json / table | | TC-001, TC-002 | 05-verification/test-design/<name>.md / .json | draft / exported / superseded |

## 2. Test Case Matrix

| ID | Type | Source | Preconditions | Steps | Assertions | Evidence Required | Evidence Strength Target | Automation | Risk |
|---|---|---|---|---|---|---|---|---|---|
| TC-001 | unit / integration / contract / playwright / startup / manual | | | | | command output / screenshot / trace / log / report | proven / mocked / manual-confirmed / deferred | command / Playwright / manual | high / medium / low |

## 3. Playwright Cases

> 有浏览器页面流程、上传、提交、审批、下载、权限、路由跳转或错误提示时必填。

| ID | Page / Flow | Role | Data | Automated Steps | Assertions | States Covered | Evidence |
|---|---|---|---|---|---|---|---|
| PW-001 | | | | click / fill / upload / submit / approve / download | UI text / URL / network / state | success / error / permission / boundary / responsive | |

## 3.1 Evidence Package

> 浏览器自动化或复杂验证建议把脚本、stdout、截图、trace、network/console 摘要放到同一个 run 目录，避免证据散落。

| Run ID | Directory | Command | Contains | Related Cases |
|---|---|---|---|---|
| run-YYYYMMDD-HHMM | 05-verification/evidence/run-YYYYMMDD-HHMM | | stdout / screenshot / trace / video / console / network | TC-001, PW-001 |

## 4. Boundary And Negative Cases

| ID | Boundary / Failure | Expected Result | Evidence |
|---|---|---|---|
| | | | |

## 5. Skipped Or Deferred

| ID | Reason | Existing Evidence | Impact | Owner | Manual Confirmation Required | Revalidation Trigger |
|---|---|---|---|---|---|---|
| | | proven / mocked / none | | | yes / no | |
