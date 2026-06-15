# Product Discovery Output Contract

Product discovery 输出不是 PRD，也不是 requirements。它只形成机会、候选方案、MVP 推荐、实验和下游 handoff。

## Profile Selection

| Profile | 适用 | 输出原则 |
|---|---|---|
| `compact` | 单个功能想法、已有明确目标、低风险 | 保留 outcome、opportunity、candidate features、MVP recommendation、handoff |
| `standard` | 常规产品功能、多个候选功能、需要进入 PRD | 输出 opportunity map、feature pool、prioritization、experiment plan 和 PRD handoff |
| `full` | 多角色、高风险、AI / 数据 / 合规、多方案取舍 | 输出完整 OST、evidence map、实验组合、risk register 和 roadmap slicing |

## compact

适用：

- 单个功能想法。
- 已有明确目标。
- 低风险。

输出：

- Desired outcome。
- Opportunity。
- Candidate features。
- MVP recommendation。
- Open question。
- Handoff。

## standard

适用：

- 常规产品功能。
- 多个候选功能。
- 需要 PRD。

输出：

- Desired outcome。
- Opportunity map。
- Feature pool。
- Prioritization matrix。
- MVP recommendation。
- Experiment plan。
- Open questions。
- Handoff to PRD。

## full

适用：

- 多角色。
- 高风险。
- AI / 数据 / 合规。
- 多方案取舍。

输出：

- Desired outcome。
- Opportunity solution tree。
- Evidence map。
- Feature pool。
- Prioritization matrix。
- Experiment portfolio。
- MVP / roadmap slicing。
- Risk register。
- Handoff to brainstorm / PRD / research。

## Canonical Packet Structure

```md
# Product Discovery Packet: <name>

## 0. Discovery Control
- Profile:
- Source Work Item:
- Decision Status:
- Source Artifacts:
- Evidence coverage:
- Can enter PRD: yes / no

## 1. Desired Outcome
- Outcome:
- Target user / buyer:
- Business result:
- User result:
- Metric candidate:

## 2. Opportunity Map
| Opportunity | User pain / need | Evidence | Confidence | Notes |
|---|---|---|---|---|
| | | confirmed / likely / unclear | high / medium / low | |

## 3. Candidate Feature Pool
| Feature | Linked opportunity | User value | Business value | Effort | Risk | Confidence |
|---|---|---|---|---|---|---|
| | | | | | | |

## 4. Prioritization Matrix
| Feature | User value | Business value | Effort | Risk | Confidence | Recommendation | Rationale |
|---|---|---|---|---|---|---|---|
| | | | | | | adopt for MVP / test first / defer / reject / split | |

## 5. MVP Recommendation
| Item | Recommendation | Confirmation status | Why | Abandonment cost |
|---|---|---|---|---|
| | mvp-recommended / optional / later / out-of-scope | user-confirmed / delegated-default / pending | | |

## 6. Experiment / Validation Plan
| Solution | Assumption | Risk type | Experiment | Success signal | Cost | Time |
|---|---|---|---|---|---|---|
| | | value / usability / feasibility / viability / compliance / AI quality | | | | |

## 7. Risk Register
| Risk | Type | Impact | Mitigation | Handoff |
|---|---|---|---|---|
| | product / evidence / data / AI / compliance / delivery | | | brainstorm / PRD / research |

## 8. Open Questions
| Question | Why it matters | Owner | Needed by | Status |
|---|---|---|---|---|
| | | | | |

## 9. Handoff
- To brainstorm:
- To PRD:
- To research:
- Do not carry forward:
```

## Guardrails

- `MVP Recommendation` is not user approval unless confirmation status is `user-confirmed`.
- Do not invent reach, RICE, opportunity score, baseline, target, user count, market size, price, or adoption data.
- High-risk AI / data / compliance items must have an experiment or research handoff.
- Solution candidates cannot be copied into PRD as confirmed scope without decision status.
