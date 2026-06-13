# Framework Evolution

本文件记录 SpecForge 后续如何继续进化。它不是普通需求池，而是框架级改造的事实源：每一项都必须能落到标准、workflow schema、skill、script、template、report 或审计规则。

## 设计基准

| 外部方法 | 吸收原则 | SpecForge 落点 |
|---|---|---|
| Spec-driven development | spec / plan / tasks 先于实现，规格是人和 Agent 共同事实源 | workflow schema、stage contract、traceability、gate evidence |
| Human-in-the-loop | 高影响未知交给人确认，低风险默认要可追责 | decision checkpoint、decision brief、manual-confirmed、delegated default |
| Progressive disclosure | 先给行动摘要，再给证据和长表 | workflow audit、HTML report、handoff、one-page summary |
| Agent evaluation | 不能只看是否生成代码，要看是否可验证、可回放、可审计 | quality suite、framework audit、self-test、verification evidence |
| Documentation as product | 文档要面向读者任务，而不是堆满过程噪音 | standards map、artifact quality、wiki quality、report package |

## 当前已固化

| 能力 | 已有落点 | 保持规则 |
|---|---|---|
| 阶段分流 | workflow definitions、stage contracts、standards index | 小需求走轻量路径，复杂需求才展开完整链路 |
| 人工确认 | decision checkpoints、decision brief、decision quality、gate preflight | open decision 不得被口头忽略；风险接受必须有 owner、影响和触发条件 |
| 产物降噪 | artifact quality、workflow package、HTML report、handoff summary | Markdown 是事实源，HTML 是阅读层 |
| 证据分级 | evidence summary、test cases、verification report | proven / mocked / manual-confirmed / deferred / missing 必须区分 |
| 阶段回归样例 | `core/workflows/stages/eval-fixtures.json`、self-test、framework audit | 每个 stage 都有最小通过样例和阻断样例，workflow 改动必须保持覆盖 |
| 代码理解 | codebase index、provider facts、code intelligence profile、wiki quality graph fact check | provider 输出只能作为事实候选，必须带来源、置信度、用途和 wiki 引用 |
| 外部入口治理 | `skills/catalog.json`、skills README、framework audit | 对外 skill 是稳定 API，目录、分层、阶段映射和文档必须可审计 |
| 框架自审 | framework audit、starter sync、skill validation、self-test | 框架改动必须同步 starter 并跑审计 |

## 下一批演进

| 优先级 | 方向 | 用户价值 | 建议落点 | 验收标准 |
|---|---|---|---|---|
| P0 | 命令唯一事实源 | 减少标准文档重复和过期命令 | `framework-audit.mjs` 检查 standards 中脚本清单长度和失效命令 | 非命令目录型标准不再维护大段脚本清单 |
| P0 | Wiki 回写辅助生成 | 存量项目事实可从 graph facts 半自动形成候选补丁 | `sync-wiki.mjs` 增加 dry-run candidate plan | 候选补丁只引用 `used_for_wiki=true` 且有 source path 的事实，并等待人工确认 |
| P1 | HTML 报告组件化 | 让非研发也能读懂复杂规格和验证矩阵 | report renderer 增加 action board、decision board、trace matrix 组件边界 | 首屏只显示当前状态、下一步、最高风险和可复制命令 |
| P1 | Prompt / skill drift audit | 防止 public skills、core stage skills 和 standards 说法不一致 | `framework-audit.mjs` 增加关键术语和 gate 规则一致性检查 | 同一 gate、artifact、证据术语只有一个规范表达 |
| P2 | Interactive decision package | 人工确认更像审批包，而不是聊天追问 | `decision-brief.mjs` 输出可复制 A/B/accept-risk 回复和影响摘要 | 用户一句回复能被写回 artifact 或 gate evidence |
| P2 | Visual workflow map | 长流程先看图，再看文档 | `stage-contract.mjs --overview` 输出 Mermaid / JSON graph | 每个 artifact 显示状态、owner、blocker、下一步命令 |

## 设计约束

- 新增能力必须先回答：它减少了哪类认知负担、降低了哪类流程风险、会不会增加新的模板负担。
- 优先把规则放进脚本审计或 schema，而不是只写进长文档。
- 一个概念只能有一个事实源；其他文件引用它，不复制大段内容。
- 每次新增文档型能力，都要同步考虑一页摘要、HTML 阅读层和 gate / quality 入口。
- 每次新增自动化能力，都要定义人能覆盖的暂停点、风险接受格式和回退路径。
- 任何外部工具输出都必须标注来源、时间、置信度和是否可写入长期 wiki。
