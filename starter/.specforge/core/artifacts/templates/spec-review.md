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

## 4. Gate Checklist

| Area | Result | Evidence / Notes |
|---|---|---|
| Workflow and components match scope | pass / fail | |
| Analysis depth and research evidence fit complexity | pass / fail / N/A | |
| Requirements are testable and unambiguous | pass / fail | |
| Product choices, MVP, non-goals and open questions are resolved | pass / fail | |
| UI design covers style, page map, flows, prototype evidence and states | pass / fail / N/A | |
| Technical design covers architecture, API, data, permissions, config, NFR and verification | pass / fail / N/A | |
| Rule baselines and profile selections are adopted or deviations explained | pass / fail / N/A | |
| Tasks are ordered, bounded and verifiable | pass / fail | |
| Testing, startup validation, rollback / observability tasks are present when applicable | pass / fail / N/A | |
| No hidden scope expansion or unresolved blockers remain | pass / fail | |

## Findings

| Severity | Finding | Evidence | Required fix | Return to |
|---|---|---|---|---|
| P0 / P1 / P2 | | | | sf-requirements / sf-ui-design / sf-tech-design / sf-tasking |

## Residual Risks

-

## Required Follow-up

-

## Decision

可选值：APPROVED, REQUEST_CHANGES, REJECTED.

## Gate Update

APPROVED 时执行：

```bash
node .specforge/core/scripts/gate.mjs spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md
```

REQUEST_CHANGES 或 REJECTED 时执行其一：

```bash
node .specforge/core/scripts/gate.mjs spec_review REQUEST_CHANGES
node .specforge/core/scripts/gate.mjs spec_review REJECTED
```
