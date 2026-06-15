# PRD Output Contract

## Profile Selection

| Profile | 适用 | 输出原则 |
|---|---|---|
| `prd-lite` | 小工具、低风险单流程、用户已明确 MVP、不涉及复杂角色/数据/安全/AI 质量 | 短文档，但必须有 Decision Status 和 Handoff |
| `prd-standard` | 常规产品功能、后台能力、AI 工具、全栈应用、跨 UI / API / 数据但风险中等 | 完整 PRD 结构 |
| `prd-deep` | 多角色、多流程、审批/计费/合规、AI 质量/人工复核、高风险上线、数据安全或生产影响较大 | standard + 决策日志、风险 owner、rollout / rollback |

## prd-lite 必填

- PRD Control
- Product Decision Summary
- Target Users
- Scope & MVP
- Non-goals
- Acceptance Seeds
- Handoff To Requirements
- Open Questions

## prd-standard 必填

- PRD Control
- Product Decision Summary
- Background & Outcome
- Users / Roles / Scenarios
- Candidate Feature Pool
- Scope & MVP Decision
- User Stories & Acceptance Seeds
- Product Flow
- Metrics & Evaluation
- Risks / Dependencies
- Roadmap
- Handoff To Requirements

## prd-deep 追加

- Decision Log
- Product Interview Evidence
- Data & Compliance Snapshot
- AI Evaluation Plan
- Risk Owner
- Rollout / Rollback Strategy
- Open Decision Register

## Canonical Artifact Structure

```md
# PRD: <name>

## 0. PRD Control
- PRD Depth:
- Source Work Item:
- Decision Status:
- Source Artifacts:
- Assumptions:
- External Skill Inputs:
- Product Discovery Inputs:

## 1. Product Decision Summary
- Problem:
- Target Users:
- MVP:
- Non-goals:
- Success Criteria:
- Can enter requirements: yes / no

## 2. Background & Outcome
- Why now:
- Current pain:
- Desired outcome:
- Business / user value:
- Failure cost if not solved:

## 3. Users, Roles & Scenarios
| Role | Department / Context | Goal | Pain | Scenario | Frequency / Device | Permission / Responsibility |
|---|---|---|---|---|---|---|

## 4. Candidate Feature Pool
| Feature | User value | Complexity | Risk | Recommendation | Confirmation |
|---|---|---|---|---|---|

## 5. Scope & MVP Decision
| Item | Phase | Decision | Rationale | Source |
|---|---|---|---|---|
| | MVP / optional / later / out-of-scope | user-confirmed / delegated-default / pending | | |

## 6. User Stories & Acceptance Seeds
| ID | User Story | Acceptance Seed | Priority | Source |
|---|---|---|---|---|

## 7. Product Flow
- Normal path:
- Exception path:
- Manual fallback:
- State changes:

## 8. Metrics & Evaluation
- User value metric:
- Business KPI:
- Quality metric:
- Operational metric:
- Tracking / evidence:

## 9. AI / Data / Compliance Snapshot
- AI task:
- AI evaluation:
- Data source:
- Refresh cadence:
- Sensitive fields:
- Permission / audit:
- Cost / latency boundary:

## 10. Risks, Assumptions & Dependencies
| Item | Type | Impact | Owner | Handling |
|---|---|---|---|---|

## 11. Roadmap / Release Slicing
- MVP:
- v1.1:
- Later:
- Rollback / disable strategy:

## 12. Open Questions & Decisions
| Question | Impact | Owner | Needed by | Status |
|---|---|---|---|---|

## 13. Product Decision Gate
| Check | Status | Evidence |
|---|---|---|
| MVP confirmed | pass / warn / fail | |
| Target users clear | pass / warn / fail | |
| Success metric exists | pass / warn / fail | |
| Non-goals clear | pass / warn / fail | |
| Handoff ready | pass / warn / fail | |

## 14. Handoff To Requirements
- Requirements seeds:
- Recommended components flags:
- Notes for ui_design:
- Notes for technical_design:
- Notes for data / security:
- Blockers:
```
