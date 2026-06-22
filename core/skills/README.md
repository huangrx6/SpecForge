# 内置参考 Skills

本目录保存少量能直接补足 SpecForge 主流程的能力包和参考 skill，包括 SpecForge 本地维护能力包和经过审查的第三方 skill 快照。它们不是 SpecForge 工作流阶段；只有被归一化为 SpecForge artifact 后，才能影响具体 work item。

调用参考 skill 前，先阅读 `ORCHESTRATION.md`；升级或新增参考 skill 前，先阅读 `VETTING.md`。

## 文件职责

| 文件 | 用途 |
|---|---|
| `ORCHESTRATION.md` | 运行时编排规则：什么时候调用哪个 skill、输出写回哪里 |
| `registry.json` | 唯一机器可读清单：来源、风险、触发、归一化目标和更新输入 |
| `VETTING.md` | 安全审查和更新纪律 |
| `<category>/<skill>/references/` / `<category>/<skill>/rules/` | 按需读取的细分材料；只有能降低主 `SKILL.md` 负担时保留 |

## 分类

| 目录 | 归属 | Skill |
|---|---|---|
| `product/` | 产品发现、机会树、方案取舍 | `product`, `opportunity-solution-tree` |
| `prd/` | 产品需求文档决策、最小可行版本、非目标和需求阶段交接 | `prd`, `create-prd` |
| `requirements/` | 行为契约、确认边界、转译、用户故事、验收标准和可测试性 | `requirements`, `user-stories` |
| `ui-ux/` | UX 研究、设计语言、Pencil 原型、设计转代码参考 | `design-system`, `pencil` |
| `brainstorm/` | 问题重构、事实查证、案例侦察、发散、类比、场景模拟、批判、评估、输出和行动计划 | `brainstorm` |
| `code-intelligence/` | Wiki-first 代码定位、CodeGraph / MCP / SCIP / Repomix / rg、影响面和图谱事实归一化 | `code-intelligence` |
| `quality/` | Code review、测试工程与浏览器验证参考 | `code-review`, `test-engineering`, `playwright-skill` |

## 保留 Skill

| Skill | 本地路径 | 在 SpecForge 中的作用 | 归一化输出 |
|---|---|---|
| `product` | `product` | 产品发现、机会建模、功能取舍、实验设计和最小可行版本推荐主能力包 | `00-intake/brainstorm.md`、`00-intake/brief.md`、`00-intake/prd.md` |
| `opportunity-solution-tree` | `product/opportunity-solution-tree` | 外部 OST 参考；只补机会树、功能候选、假设、实验和优先级视角 | `00-intake/brainstorm.md`、`00-intake/brief.md`、`00-intake/prd.md` |
| `prd` | `prd` | 产品需求文档决策主能力包，连接简报、头脑风暴、产品发现和预研到需求阶段 | `00-intake/prd.md` |
| `create-prd` | `prd/create-prd` | 外部产品需求文档参考；只借鉴背景、目标、范围、假设和版本结构 | `00-intake/prd.md` |
| `requirements` | `requirements` | Requirements 行为契约、确认边界、来源转译、REQ / AC 追踪、NFR 和下游 handoff 主能力包 | `01-spec/requirements.md` |
| `user-stories` | `requirements/user-stories` | 用户故事、3C / INVEST 和验收标准补充参考 | `01-spec/requirements.md` |
| `pencil` | `ui-ux/pencil` | Pencil MCP 原型读写、组件复用、tokens、布局检查、截图导出和设计转代码参考 | `01-spec/ui-design.md`、`.pen` 源文件、导出截图、前端实现备注 |
| `design-system` | `ui-ux/design-system` | 用户研究、信息架构、设计模式路由、设计语言、Composition Recipe、专业色阶、foundation_system、机器可读 Design Contract、组件规范、页面模式、shadcn-vue 映射、动效 / GSAP 边界和视觉 QA 审查 | `00-intake/brainstorm.md`、`01-spec/ui-design.md`、`01-spec/design/components/*.contract.md`、Pencil 输入、前端组件契约 |
| `pencil` | `ui-ux/pencil` | SpecForge 本地 Pencil 原型能力；把已确认 Design Contract JSON、foundation_system、组件契约和视觉 QA 规则落到 `.pen`、Pencil variables、截图和布局证据 | `01-spec/ui-mockup.pen`、`01-spec/ui-mockup-export/`、`01-spec/ui-design.md#Wireframe / Prototype Evidence` |
| `brainstorm` | `brainstorm` | Brainstorm 根入口，内部通过 playbook、methods、research-source、output contract 和 case catalog 完成问题重构、案例侦察、事实查证、发散、类比、场景、批判、矩阵、输出和行动交接 | `00-intake/brainstorm.md`、`00-intake/brief.md` |
| `code-intelligence` | `code-intelligence` | Wiki-first 代码智能主能力包，封装 CodeGraph、MCP / SCIP provider、Repomix、bootstrap map、`rg`、freshness、impact、affected tests 和 graph facts 归一化 | `00-intake/brief.md`、`01-spec/requirements.md`、`01-spec/technical-design.md`、`01-spec/tasks.md`、`03-implementation/report.md`、`04-code-review/code-review-v1.md`、`05-verification/report.md`、`.specforge/wiki/*.md` |
| `code-review` | `quality/code-review` | SpecForge 本地代码审查主能力包，负责 diff、spec、tasks、implementation report 和证据对账 | `04-code-review/code-review-v1.md` |
| `test-engineering` | `quality/test-engineering` | 测试用例、测试代码、项目启动、Playwright 浏览器验证、登录态和证据归档能力包 | `05-verification/test-plan.md`、`05-verification/test-cases.md`、`05-verification/test-engineering/`、`05-verification/report.md`、`05-verification/evidence/` |
| `playwright-skill` | `quality/playwright-skill` | 外部浏览器 E2E、真实操作、截图和响应式验证参考 | `05-verification/test-cases.md`、`05-verification/report.md`、`05-verification/evidence/` |

## 触发纪律

Brainstorm 控制层：

- `brainstorm/SKILL.md`：Brainstorm 能力包根入口。所有内部 reference 都从这里路由。
- `brainstorm/references/brainstorm-playbook.md`：执行总纲，统一维护 profile、case study depth、discussion depth、案例协议、多轮讨论和读取路径。
- `brainstorm/references/methods.md`：内部方法库，统一维护问题重构、发散、类比、场景模拟、批判质疑、方案矩阵、输出塑形和行动规划。
- `brainstorm/references/research-source.md`：事实查证协议、来源索引、证据契约、时效规则、版本关系图和升级规则。
- `brainstorm/references/output-contract.md`：brainstorm.md 输出合同、条件 section、handoff 和停止条件。
- `brainstorm/data/case-source-catalog.csv`：案例来源目录、适用场景、复用策略和 avoid 规则。

- 不在每个阶段默认加载参考 skill。
- 写产品需求文档时每次先读本地 `prd` 主能力包；问题空间、机会或最小可行版本取舍不清时读本地 `product`。`opportunity-solution-tree` / `create-prd` 只作为外部参考。
- Requirements 默认先读 `requirements` 主能力包；只有故事、验收或 INVEST 视角不足时再参考 `user-stories`。
- UI 正式原型固定为 Pencil；其他工具只能作为用户显式提供的外部输入。
- UI 方向确认后，先用 `design-system` 判断 Product UI / Brand Surface / Hybrid 模式，再收敛 Composition Recipe、palette 色阶、foundation_system、组件契约、Design Contract JSON 和页面模式，再进入本地 `pencil` 原型。
- UX 参考只补充研究、流程和可访问性证据，不替代 Pencil 原型或 SpecForge UI artifact。
- Brainstorm 不只查资料：先用 `methods.md#Problem Framing` 重构问题，再按需要使用 `research-source.md`、`methods.md#Divergent Thinking`、`#Analogy Thinking`、`#Scenario Simulation`、`#Critic Review`、`#Decision Matrix`、`#Output Shaping` 和 `#Execution Planning`。
- Brainstorm 包内 methods 按 `skip` / `light` / `deep` / `research-heavy` profile 组成内部链路，不计入“最多 1 个外部辅助”的限制。
- 当前事实、法规、价格、版本、竞品、AI provider 或新闻会影响 brainstorm 取舍时，先参考 `brainstorm/references/research-source.md` 建立证据表；需要长篇研究或实验时路由 `sf-discovery` research。
- 日常 work item 需要现有代码范围、调用链、影响面、受影响测试或 Wiki 回写候选时，先参考 `code-intelligence`；它是跨阶段能力包，不属于 `sf-steering` 独占。
- Code review gate 前只读 `code-review` 主能力包；不再托管或读取外部 review skill。
- Verification 前如需测试用例、测试代码、项目启动、登录态、Playwright 流程或证据归档，先参考 `test-engineering`，再用 `test-case-quality.mjs` 检查。
- Verification 有浏览器流程时必须有 Playwright 用例和真实自动化操作证据。
- 参考 skill 输出只当作参考笔记，不替代用户确认、SpecForge 模板或 gate evidence。

## 更新命令

```bash
# 更新全部可自动同步的第三方 skill 快照
node core/scripts/update-skills.mjs --all

# 更新指定 skill
node core/scripts/update-skills.mjs --skill user-stories
node core/scripts/update-skills.mjs --skill opportunity-solution-tree
node core/scripts/update-skills.mjs --skill playwright-skill
node core/scripts/update-skills.mjs --skill pencil

# 只检查漂移，不写文件
node core/scripts/update-skills.mjs --check --all

# 校验 registry、support files 和 starter 镜像
node core/scripts/validate-external-skills.mjs

# 列出当前托管的参考 skill
node core/scripts/update-skills.mjs --list
```
