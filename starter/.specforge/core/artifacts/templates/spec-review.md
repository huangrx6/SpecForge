# Spec Review

Status: PENDING

## 1. Review Scope

| Item | Value |
|---|---|
| Work item | |
| Workflow | |
| Components summary | |
| Ready artifact confirmed by instructions.mjs | yes / no |
| Reviewer | |
| Date | |

## 2. Required Artifact Matrix

> 根据 `work.yaml`、workflow schema 和 components flags 判断，不要只凭文件存在。

| Artifact | Required? | Evidence path | Status | Notes |
|---|---|---|---|---|
| brief | yes | `00-intake/brief.md` | pass / fail | |
| PRD | yes / no / N/A | `00-intake/prd.md` | pass / fail / N/A | |
| requirements | yes / no | `01-spec/requirements.md` | pass / fail / N/A | |
| ui_design | yes / no | `01-spec/ui-design.md` | pass / fail / N/A | |
| technical_design | yes / no | `01-spec/technical-design.md` | pass / fail / N/A | |
| tasks | yes | `01-spec/tasks.md` | pass / fail | |

## 3. Traceability Matrix

| Source requirement / decision | Requirements coverage | UI design coverage | Technical design coverage | Tasks / verification coverage | Gap |
|---|---|---|---|---|---|
| | | | | | |

## 4. Technical Design Impact Review

> 仅在 `technical_design` 为 required 时填写；否则写 N/A 和跳过依据。审查目标是确认 `technical-design.md#0. 影响面与读取计划` 与 requirements、components flags、profiles 和任务验证计划一致。

| Impact area | Component / requirement signal | tech-design status | Read module / profile | Section evidence | Review result |
|---|---|---|---|---|---|
| Frontend engineering | | yes / no / unknown / N/A | | `01-spec/technical-design.md#7` / N/A | pass / fail / N/A |
| Backend engineering | | yes / no / unknown / N/A | | `01-spec/technical-design.md#8` / N/A | pass / fail / N/A |
| Domain model / state machine | | yes / no / unknown / N/A | | `01-spec/technical-design.md#9` / N/A | pass / fail / N/A |
| API / SDK / Events | | yes / no / unknown / N/A | | `01-spec/technical-design.md#10` / N/A | pass / fail / N/A |
| Data / DB / Migration | | yes / no / unknown / N/A | | `01-spec/technical-design.md#11` / N/A | pass / fail / N/A |
| Auth / Permission / Security | | yes / no / unknown / N/A | | `01-spec/technical-design.md#12` / `#13` / N/A | pass / fail / N/A |
| Config / Env / Delivery | | yes / no / unknown / N/A | | `01-spec/technical-design.md#12` / `#14` / N/A | pass / fail / N/A |
| Jobs / Queue / Scheduler | | yes / no / unknown / N/A | | `01-spec/technical-design.md#12` / N/A | pass / fail / N/A |
| Observability / Reliability | | yes / no / unknown / N/A | | `01-spec/technical-design.md#13` / `#14` / `#15` / N/A | pass / fail / N/A |

### Unknown Review

| Unknown item | Risk type | Blocking? | Decision / return path |
|---|---|---|---|
| | architecture / data / security / cost / external_contract / delivery / reliability / other | yes / no | |

## 5. Gate Checklist

| Area | Result | Evidence / Notes |
|---|---|---|
| Workflow and components match scope | pass / fail | |
| Analysis depth and research evidence fit complexity | pass / fail / N/A | |
| Requirements are testable and unambiguous | pass / fail | |
| Product choices, MVP, non-goals and open questions are resolved | pass / fail | |
| UI design covers style, page map, flows, prototype evidence and states | pass / fail / N/A | |
| Technical design impact/read plan is complete and aligned | pass / fail / N/A | |
| No blocking technical `unknown` remains | pass / fail / N/A | |
| `yes` technical impacts have matching design section, profile and verification | pass / fail / N/A | |
| `no` technical impacts have credible N/A reasons | pass / fail / N/A | |
| Tasks include `_Impact:_` and align with technical impact matrix | pass / fail / N/A | |
| Rule baselines and profile selections are adopted or deviations explained | pass / fail / N/A | |
| Tasks are ordered, bounded and verifiable | pass / fail | |
| Testing, startup validation, rollback / observability tasks are present when applicable | pass / fail / N/A | |
| No hidden scope expansion or unresolved blockers remain | pass / fail | |

## 6. Findings

| Severity | Finding | Evidence | Required fix | Return to |
|---|---|---|---|---|
| P0 / P1 / P2 | | | | sf-requirements / sf-ui-design / sf-tech-design / sf-tasking |

## 7. Residual Risks

-

## 8. Required Follow-up

-

## 9. Decision

可选值：APPROVED, REQUEST_CHANGES, REJECTED.

## 10. Gate Update

APPROVED 时执行：

```bash
node .specforge/core/scripts/gate.mjs spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md
```

REQUEST_CHANGES 或 REJECTED 时执行其一：

```bash
node .specforge/core/scripts/gate.mjs spec_review REQUEST_CHANGES
node .specforge/core/scripts/gate.mjs spec_review REJECTED
```
