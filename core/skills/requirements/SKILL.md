---
name: requirements
description: SpecForge requirements 混合型能力包。用于把已确认的产品意图、brainstorm 决策、PRD、research、gap report 和 wiki 事实转成可测试、可追踪、可交给 UI / technical design / tasking / verification 的行为契约。
---

# Requirements System Skill

本 skill 负责 requirements 的“行为契约层”。它不是 PRD、不是技术设计、不是 backlog 工具；它把上游已确认的产品意图、范围边界、研究事实和风险，转成可测试、可追踪、可审查、可交接的系统行为规格。

核心定位：产品输入进来，工程可执行输出出去。

## 什么时候使用

- `sf-requirements` 需要把 brief / brainstorm / PRD / research / gap report 转成 `01-spec/requirements.md`。
- 上游包含 `user-confirmed`、`delegated-default`、`agent-recommendation`、`pending` 等不同确认状态，需要判断哪些能进入 MUST / SHALL。
- 需要把用户故事、验收种子、业务规则、NFR、异常路径、权限边界、数据边界或 AI 质量要求转成 REQ / AC。
- requirements 需要支撑 UI design、technical design、tasks 或 verification，不希望下游重新猜行为。
- spec review 发现 requirements 不可测试、来源不清、边界不清、验收标准弱或把方案写成需求。

## 读取顺序

1. 先读 `references/output-contract.md`，确认 compact / standard / full 输出 profile 和 `requirements.md` 的固定结构。
2. 读取 `foundations/behavior-contract.md`，一次性建立 confirmation boundary、requirement language、testability 和 traceability。
3. 读取 `transforms/source-to-requirements.md`，把 brief / brainstorm / PRD / research / gap 输入转成 REQ / AC / NFR / non-goal / pending，并参考 before / after 样例。
4. 需要验收标准时读 `prompts/acceptance-criteria.md`，把验收种子转成 Given / When / Then / verification method。
5. 需要按场景补覆盖时，按触发读取 `patterns/*.md`；优先读取与需求风险匹配的 1-3 个 pattern，不要全量加载。
6. 写入前读 `references/cross-stage-handoff.md`，建立 Source -> REQ -> AC -> downstream trace。
7. NFR 边界不清时读 `foundations/nfr-taxonomy.md`，避免把产品指标、技术方案或不可验证目标写成 NFR。
8. 写完后读 `references/quality-rubric.md` 和 `references/anti-patterns.md`，做需求质量审查。

## 能力地图

| 能力 | 作用 | 产出 |
|---|---|---|
| Behavior contract | 判断哪些上游输入可进入需求，并规范 MUST / SHOULD / MAY、EARS、AC 和 trace | `上游确认输入`、`REQ-*`、`AC-*`、trace |
| Source transform | PRD / brainstorm / research / gap 转译 | `Source -> Requirement 转译` |
| Acceptance design | 验收种子转 Given / When / Then | `AC-*` |
| Scenario patterns | 权限、状态、数据、AI、UI、集成、运维覆盖 | 行为覆盖矩阵 / NFR |
| Quality review | 用 anti-pattern fixer 检查歧义、不可测试、范围蔓延、实现细节 | Spec Quality Gate |
| Handoff | 给 UI / technical / tasks / verification 交接 | Downstream Handoff |

## 输出到 SpecForge

| 内容 | 写入位置 |
|---|---|
| Requirements Control、来源、确认策略、输出 profile | `01-spec/requirements.md#0. Requirements Control` |
| 上游确认输入、Agent recommendation 边界 | `01-spec/requirements.md#1. 上游确认输入` |
| Source -> Requirement 转译 | `01-spec/requirements.md#2. Source -> Requirement 转译` |
| REQ / AC / NFR / non-goal / pending | `01-spec/requirements.md` 对应章节 |
| 影响面 flags、UI / technical design 触发 | `01-spec/requirements.md#影响面确认`、`brief.md` / `work.yaml` |
| 下游交接 | `01-spec/requirements.md#Downstream Handoff` |

## 工作原则

- 只把 `user-confirmed` 和 `delegated-default` 转成 MUST / SHALL；`agent-recommendation` 只能进候选、推荐或 pending。
- requirement 写外部可观察行为，不写 API、DB、类名、文件路径、组件选型或任务拆分。
- 每条 MUST 级 REQ 必须能追到至少一个 AC；每条关键 AC 必须有 Given / When / Then 或等价验证方法。
- 用户故事是输入，不是 requirements 终态；不要把 story、Sprint、Assignee、故事点原样写入。
- NFR 也必须可验证；无法验证的指标留在产品指标或 pending，不伪装成 AC。
- 非目标和明确延后是防止实现膨胀的契约，不是附注。

## 完成标准

- `requirements.md` 能证明每条需求来自已确认输入、授权默认或当前事实。
- 每条 MUST / SHALL 需求可测试、可追踪、无未处理冲突。
- 验收标准描述初始状态、触发动作、可观察结果和验证方式。
- 影响面 flags 能决定是否进入 UI design、technical design、tasks 和 verification。
- Downstream Handoff 足以让后续阶段不用重新发明行为。
