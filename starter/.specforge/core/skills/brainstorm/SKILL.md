---
name: brainstorm
description: SpecForge Brainstorm 能力包根入口。用于模糊产品、UI、AI、技术、管理端、网站、工作流或范围取舍需要系统化发散、优秀案例侦察、事实查证、多轮讨论、方案矩阵和下游交接时。使用本能力包时必须先读此入口，再按 profile 读取 references 和 data。
---

# Brainstorm Capability Pack

本文件是 `core/skills/brainstorm/` 的唯一根入口。Brainstorm 不是一组同级方法卡；所有内部方法都收束在 `references/`，由本入口和 playbook 按 profile 选择最短读取链路。

## 目录职责

```text
brainstorm/
├── SKILL.md                       # 根入口：路由、读取顺序、停止条件
├── references/
│   ├── brainstorm-playbook.md     # 执行总纲：profile、案例侦察、讨论协议、完整编排
│   ├── methods.md                 # 内部方法：问题重构、发散、类比、场景、批判、矩阵、输出和行动
│   ├── research-source.md         # 事实查证、来源、证据、版本关系和升级规则
│   └── output-contract.md         # brainstorm.md 输出合同
├── data/
│   └── case-source-catalog.csv    # 案例来源目录
```

## 读取顺序

1. 先读本文件。
2. 读 `references/brainstorm-playbook.md`，选择 `Brainstorm profile`、`Case study depth`、`Discussion depth`，并确定多轮探讨节奏。
3. 按 profile 读取 `references/methods.md` 中对应章节：
   - 问题不清：`Problem Framing`
   - 需要案例：`Case Study Protocol` 在 playbook 中，案例来源见 `data/case-source-catalog.csv`
   - 需要发散：`Divergent Thinking`
   - 需要跨域机制：`Analogy Thinking`
   - 需要压测：`Scenario Simulation`
   - 需要反驳：`Critic Review`
   - 需要收敛：`Decision Matrix`
   - 需要输出塑形或行动规划：`Output Shaping`、`Execution Planning`
4. 需要当前事实、版本、价格、法规、依赖或竞品证据时，读 `references/research-source.md`。
5. 输出前读 `references/output-contract.md`。

## Profile 路由

| Profile | 何时使用 | 必读 |
|---|---|---|
| `clarify-light` | 只需快速确认 1-2 个低风险取舍 | playbook、methods: Problem Framing / Decision Matrix、output contract |
| `product-discovery` | MVP、用户、功能池、产品方向不清 | playbook、methods: Problem Framing / Divergent Thinking / Critic Review / Decision Matrix |
| `experience-exploration` | 管理端、Dashboard、官网、品牌页、AI 工具或用户要求高级案例 | playbook Case Study Protocol、case catalog、methods: Divergent / Analogy / Scenario / Decision Matrix |
| `technical-decision` | 技术栈、依赖、AI provider、部署、成本、安全取舍 | playbook、research-source、methods: Critic Review / Decision Matrix |
| `research-heavy` | 竞品、价格、法规、AI 能力或来源冲突影响方向 | research-source、playbook Case Study Protocol、methods: Critic Review / Decision Matrix |

Profile、案例深度、讨论深度和完整编排的权威细节在 `references/brainstorm-playbook.md`；本表只做入口导航。

## 输出合同

`brainstorm.md` 不是聊天纪要。它必须能交给下游阶段使用：

- `sf-prd` 消费问题地图、MVP、产品机会、成功标准。
- `sf-requirements` 消费用户确认、边界、验收问题和 pending。
- `sf-ui-design` 消费优秀案例与机制拆解、体验路线和反模板化提醒。
- `sf-tech-design` 消费技术路线、依赖 / 工具链状态、版本事实和风险。
- `sf-discovery` research 消费未查证项、冲突来源和需要 spike 的问题。

输出字段、条件 section 和停止条件以 `references/output-contract.md` 为准。

## 停止条件

- 未选择 profile。
- 有案例诉求但未读取 `brainstorm-playbook.md#Case Study Protocol` / `case-source-catalog.csv`。
- 有事实诉求但未读取 `references/research-source.md`。
- 没有讨论轨迹，或用户确认 / 授权默认 / Agent 推荐 / pending 混在一起。
- 方案不是互斥路线，只有一个“综合最优”大方案。
- 仍有 `[NEEDS ... DECISION]`，却路由到下游实现或设计。

## 禁止

- 不在根目录重建单文件方法子目录；内部方法统一进入 `references/methods.md`。
- 不把案例灵感当事实证据。
- 不把参考 skill 输出原样复制进 artifact。
- 不替用户确认高影响范围、体验、技术、依赖、工具链或验收取舍。
