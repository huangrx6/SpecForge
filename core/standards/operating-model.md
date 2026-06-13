# SpecForge Operating Model

本文件定义 SpecForge 如何作为一个可审计、可裁剪、可持续进化的 AI 研发工作流运行。它不替代 `workflow.md`，而是约束跨阶段的协作方式：何时轻量、何时深入、何时问人、何时用机器验证、何时把经验沉淀成长期资产。

## 1. 不以文档数量衡量完成

| 层级 | 作用 | 失败信号 |
|---|---|---|
| Intent | 用户目标、业务原因、约束和非目标 | 只复述原话，没有裁剪和取舍 |
| Spec | 可验收行为、边界、状态、契约 | 需求看似完整，但无法测试 |
| Design | UI / 技术 / 数据 / 权限 / NFR 的实现选择 | 堆技术，没有确认来源 |
| Tasks | 可执行、可回滚、可验证的工作单元 | 只是松散待办，不知道改哪些文件 |
| Evidence | 命令、测试、截图、trace、日志、人工确认 | 只有“应该可以”或“我看过” |
| Memory | Wiki、profile、skill、quality rule 的长期沉淀 | 下次还要重新解释同一件事 |

每个阶段都要问：这个产物是否让下一步更清楚？如果没有，就删减、合并或改成确认卡。

## 2. 四档推进深度

| 深度 | 适用 | 输出形态 | 停止条件 |
|---|---|---|---|
| Patch | 单字段、文案、小配置、小 bug | brief + tasks + verification 摘要 | 影响面扩大 |
| Focused | 明确页面 / 接口 / 模块 | requirements + bounded design + tasks | 入口不清或跨模块风险 |
| Standard | 常规 feature / issue | PRD 可选，完整 spec/design/tasks/gates | 关键取舍未确认 |
| Deep | 大型存量项目、跨系统、架构变化 | steering + PRD + design + review + verification + wiki | 缺 provider、缺用户确认或风险不可证明 |

默认不要选 Deep。只有影响面、风险或长期复用价值证明有必要，才扩大流程。

## 3. 人机确认协议

人工确认必须进入 artifact，不能只留在聊天里。

| 类型 | 写法 | 适用 |
|---|---|---|
| `confirmed` | 用户明确选择 A / B / 范围 / 风格 / 技术 | 产品范围、UI 方向、技术栈、依赖 |
| `delegated_default` | 用户授权 Agent 默认，Agent 写默认理由和回退条件 | 低风险工程默认、工具链小选择 |
| `manual-confirmed` | 用户确认外部事实或真实环境补证 | 第三方系统、生产环境、账号不可用 |
| `risk_accepted` | 用户接受残余风险，写 owner、影响、重验触发条件 | 非阻断缺口、延期验证 |

P0 / P1、安全、权限、数据破坏和核心验收缺失不能包装成 `delegated_default`。

## 4. 上下文预算

- 先读 wiki 和索引，再读代码；wiki 过期时回 `sf-steering`，不要在下游临时全仓探索。
- 先用 `codebase-index.mjs` 判断 provider health 和扫描模式，再决定 CodeGraph / Repomix / bootstrap。
- 每个阶段只读取本阶段需要的标准、profile、skill 和 artifact。
- 长报告必须有一页摘要和 Current Focus；HTML / 可视化只能作为阅读层，不替代 Markdown 事实源。

## 5. 证据金字塔

| 证据等级 | 说明 | Gate 含义 |
|---|---|---|
| `proven` | 真实命令、测试、CI、截图、trace、日志或代码证据 | 可支撑批准 |
| `mocked` | mock / fake / sandbox 覆盖代码路径 | 可支撑局部结论，需说明不能证明什么 |
| `manual-confirmed` | 用户或负责人确认外部事实 | 只用于外部待补证或低风险残余 |
| `deferred` | 延期验证，有 owner 和触发条件 | 不能覆盖关键验收 |
| `missing` | 无证据 | 不能批准 |

验证阶段必须让每个关键风险落到证据等级；不是跑过命令就算完成。

## 6. 工具链组合

| 场景 | 推荐工具链 |
|---|---|
| 模糊需求 | `sf-brainstorm` + trade-off 方法卡 + 人工确认 |
| 产品需求 | `sf-prd` + `sf-requirements` + traceability |
| UI / 体验 | `sf-ui-design` + design-system + Pencil + visual review + implementation handoff |
| 存量代码理解 | `codebase-index` + CodeGraph health + scoped wiki + bounded file reads |
| 技术设计 | profiles + capability cards + version facts + core decision review |
| 实现 | tasks impact map + changed-files ledger + implementation report |
| 验证 | test-cases + Playwright / contract / unit + evidence package + evidence summary |
| 沉淀 | wiki sync + release / rollback + archive + reusable rule extraction |

工具输出只能进入 artifact 的归一化结构，不能原样粘贴成结论。

## 7. 自我进化回路

| 发现 | 沉淀位置 |
|---|---|
| 可复用业务事实 | `.specforge/wiki/*.md` |
| 重复技术选择 | `core/profiles/` |
| 重复验证规则 | `core/scripts/*quality*.mjs` 或 `core/standards/playwright.md` |
| 重复 UI 规则 | `core/skills/ui-ux/design-system/` |
| 重复协作模式 | `core/standards/operating-model.md` 或 `stage-playbook.md` |
| 低质量 / 重复产物 | 模板删减、合并或增加 quality check |

优先沉淀成能被下一次流程自动使用的规则、脚本、profile 或 skill，而不是再写一篇长文档。

## 8. Framework 自审计

框架级改动完成前运行：

```bash
node .specforge/core/scripts/framework-audit.mjs
```

它检查悬空引用、profile 引用、standards 索引、design-system 契约和 starter manifest 覆盖。失败时不能声称框架优化完成。
