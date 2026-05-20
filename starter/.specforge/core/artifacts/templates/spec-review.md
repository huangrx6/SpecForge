# Spec Review

Status: PENDING

## 1. Review Scope

| Item | Value |
|---|---|
| Review mode | Artifact Review / Gate Review |
| Work item | |
| Workflow | |
| Components summary | |
| Reviewed artifacts | brief / PRD / requirements / ui_design / technical_design / tasks / gap_report / research |
| Ready artifact confirmed by instructions.mjs | yes / no / N/A |
| Gate update required | yes / no |
| Reviewer | |
| Date | |

## 2. Artifact Availability Matrix

> Artifact Review 只审查本次 scope 中已有文件；Gate Review 必须根据 `work.yaml`、workflow schema 和 components flags 判断 required，不要只凭文件存在。

| Artifact | Required for gate? | Reviewed now? | Evidence path | Status | Notes |
|---|---|---|---|---|---|
| brief | yes / no / N/A | yes / no | `00-intake/brief.md` | pass / fail / N/A | |
| PRD | yes / no / N/A | yes / no | `00-intake/prd.md` | pass / fail / N/A | |
| requirements | yes / no / N/A | yes / no | `01-spec/requirements.md` | pass / fail / N/A | |
| ui_design | yes / no / N/A | yes / no | `01-spec/ui-design.md` | pass / fail / N/A | |
| technical_design | yes / no / N/A | yes / no | `01-spec/technical-design.md` | pass / fail / N/A | |
| tasks | yes / no / N/A | yes / no | `01-spec/tasks.md` | pass / fail / N/A | |

## 3. Traceability Matrix

| Source requirement / decision | PRD / requirements coverage | UI design coverage | Technical design coverage | Tasks / verification coverage | Gap |
|---|---|---|---|---|---|
| | | | | | |

## 4. Artifact Quality Review

| Area | Result | Evidence / Notes |
|---|---|---|
| PRD answers why / who / MVP / success metrics | pass / fail / N/A | |
| Requirements are observable, testable and unambiguous | pass / fail / N/A | |
| PRD and requirements boundaries are not mixed | pass / fail / N/A | |
| UI design uses Pencil as formal evidence | pass / fail / N/A | |
| UI has style brief, page map, flows, state matrix and screenshots | pass / fail / N/A | |
| UI has visual quality review and one fix pass | pass / fail / N/A | |
| Technical design impact/read plan is complete and aligned | pass / fail / N/A | |
| Key technical selections and new direct dependencies are confirmed, delegated, scaffold-confirmed, or existing-stack | pass / fail / N/A | |
| No blocking technical `unknown` remains | pass / fail / N/A | |
| Tasks are granular, bounded, ordered and verifiable | pass / fail / N/A | |
| Tasks include `_Trace:_`, `_Impact:_`, `_Files:_`, `_Boundary:_`, `_Depends:_`, `_Verification:_`, `_Rollback:_` | pass / fail / N/A | |
| Browser-facing flows include Playwright case, execution and evidence tasks | pass / fail / N/A | |
| No hidden scope expansion or unresolved blockers remain | pass / fail | |

## 5. Technical Design Impact Review

> 仅在 `technical_design` 被审查时填写；否则写 N/A。

| Impact area | Component / requirement signal | tech-design status | Read module / profile | Section evidence | Review result |
|---|---|---|---|---|---|
| Frontend engineering | | yes / no / unknown / N/A | | `01-spec/technical-design.md#8` / N/A | pass / fail / N/A |
| Backend engineering | | yes / no / unknown / N/A | | `01-spec/technical-design.md#9` / N/A | pass / fail / N/A |
| Domain model / state machine | | yes / no / unknown / N/A | | `01-spec/technical-design.md#10` / N/A | pass / fail / N/A |
| API / SDK / Events | | yes / no / unknown / N/A | | `01-spec/technical-design.md#11` / N/A | pass / fail / N/A |
| Data / DB / Migration | | yes / no / unknown / N/A | | `01-spec/technical-design.md#12` / N/A | pass / fail / N/A |
| Auth / Permission / Security | | yes / no / unknown / N/A | | `01-spec/technical-design.md#13` / `#14` / N/A | pass / fail / N/A |
| Config / Env / Delivery | | yes / no / unknown / N/A | | `01-spec/technical-design.md#13` / `#15` / N/A | pass / fail / N/A |
| Jobs / Queue / Scheduler | | yes / no / unknown / N/A | | `01-spec/technical-design.md#13` / N/A | pass / fail / N/A |
| Observability / Reliability | | yes / no / unknown / N/A | | `01-spec/technical-design.md#14` / `#15` / `#16` / N/A | pass / fail / N/A |

## 6. Findings

| Severity | Finding | Evidence | Required fix | Return to |
|---|---|---|---|---|
| P0 / P1 / P2 / P3 | | | | sf-brainstorm / sf-prd / sf-requirements / sf-ui-design / sf-tech-design / sf-tasking |

## 7. Residual Risks

-

## 8. Required Follow-up

-

## 9. Decision

可选值：APPROVED, REQUEST_CHANGES, REJECTED.

Artifact Review 中：

- `APPROVED` 表示本 artifact 可进入下一阶段或仅有非阻断建议。
- 不更新 gate。

Gate Review 中：

- `APPROVED` 表示可以进入 implementation。
- `REQUEST_CHANGES` / `REJECTED` 必须写清 return path。

## 10. Gate Update

Artifact Review：

```text
N/A - artifact review does not update gate.
```

Gate Review APPROVED 时执行：

```bash
node .specforge/core/scripts/gate.mjs spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md
```

Gate Review REQUEST_CHANGES 或 REJECTED 时执行其一：

```bash
node .specforge/core/scripts/gate.mjs spec_review REQUEST_CHANGES
node .specforge/core/scripts/gate.mjs spec_review REJECTED
```
