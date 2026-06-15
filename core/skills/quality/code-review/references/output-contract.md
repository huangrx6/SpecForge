# Code Review Output Contract

`04-code-review/code-review-v1.md` 必须包含以下结构。

```markdown
# Code Review

## 1. Review Control
- Workflow:
- Ready artifact:
- Reviewed commit / diff:
- Input artifacts:
- External rule references:

## 2. Evidence Matrix
| Evidence | Status | Notes |
| --- | --- | --- |
| requirements / gap-report | found / missing / N/A | |
| ui-design | found / missing / N/A | |
| technical-design | found / missing / N/A | |
| tasks | found / missing | |
| implementation report | found / missing | |
| changed-files | found / missing | |
| git diff | collected / missing | |
| tests / startup / screenshots | found / missing / deferred | |

## 3. Diff Reconciliation
| File | In changed-files | In git diff | Task / Spec source | Status |
| --- | --- | --- | --- | --- |

## 4. Spec Compliance
| Source | Expected | Evidence | Result |
| --- | --- | --- | --- |

## 5. Risk Review
| Domain | Result | Notes |
| --- | --- | --- |
| Security / permissions | pass / warn / fail | |
| Data / migration | pass / warn / fail | |
| API / external calls | pass / warn / fail | |
| UI / state / a11y | pass / warn / fail | |
| Config / env / dependency | pass / warn / fail | |
| Tests / evidence | pass / warn / fail | |

## 6. Findings
| Severity | Location | Problem | Impact | Required fix | Evidence needed |
| --- | --- | --- | --- | --- | --- |

## 7. Residual Risks
-

## 8. Verification Notes
-

## 9. Decision
APPROVED / REQUEST_CHANGES / REJECTED
```
