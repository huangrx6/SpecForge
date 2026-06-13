# 内置第三方 Skills

本目录保存经过审查的第三方 skill 快照。它们不是 SpecForge 工作流阶段，只是少量可复用方法卡；只有被归一化为 SpecForge artifact 后，才能影响具体 work item。

调用第三方 skill 前，先阅读 `ORCHESTRATION.md`；升级或新增第三方 skill 前，先阅读 `VETTING.md`。

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
| `product/` | 产品发现、机会树、方案取舍 | `opportunity-solution-tree` |
| `prd/` | PRD 合成与产品范围整理 | `create-prd` |
| `requirements/` | 用户故事、验收标准和可测试性 | `user-stories` |
| `ui-ux/` | UX 研究、设计语言、Pencil 原型、设计转代码参考 | `design-system`, `pencil` |
| `research/` | 多来源研究综合 | `deep-research` |
| `quality/` | Code review、测试设计与浏览器验证参考 | `code-reviewer`, `test-design`, `playwright-skill` |

## 保留 Skill

| Skill | 本地路径 | 在 SpecForge 中的作用 | 归一化输出 |
|---|---|---|
| `opportunity-solution-tree` | `product/opportunity-solution-tree` | Intake / PRD 前的机会树、功能候选、假设、实验和优先级参考 | `00-intake/brainstorm.md`、`00-intake/brief.md`、`00-intake/prd.md` |
| `create-prd` | `prd/create-prd` | 上下文充分时合成 PRD | `00-intake/prd.md` |
| `user-stories` | `requirements/user-stories` | 用户故事、3C / INVEST 和验收标准参考 | `01-spec/requirements.md` |
| `pencil` | `ui-ux/pencil` | Pencil MCP 原型读写、组件复用、tokens、布局检查、截图导出和设计转代码参考 | `01-spec/ui-design.md`、`.pen` 源文件、导出截图、前端实现备注 |
| `design-system` | `ui-ux/design-system` | 用户研究、信息架构、设计语言、foundations、组件规范、页面模式、shadcn-vue 映射、动效边界和去廉价感审查 | `00-intake/brainstorm.md`、`01-spec/ui-design.md`、Pencil 输入、前端组件契约 |
| `playwright-skill` | `quality/playwright-skill` | 浏览器 E2E、真实操作、截图和响应式验证 | `05-verification/test-cases.md`、`05-verification/report.md`、`05-verification/evidence/` |
| `test-design` | `quality/test-design` | 测试设计树、XMind / 白板导出、TC / PW 用例矩阵和自动化分层策略 | `05-verification/test-design/`、`05-verification/test-cases.md`、`05-verification/report.md` |
| `code-reviewer` | `quality/code-reviewer` | 安全、性能、正确性和可维护性的 code review 参考清单 | `04-code-review/code-review-v1.md`、`05-verification/report.md` |
| `deep-research` | `research/deep-research` | 多来源研究综合、引用和共识/争议拆解参考 | `01-spec/research.md` |

## 触发纪律

- 不在每个阶段默认加载第三方 skill。
- PRD 只在需要机会树 / 功能候选 / 合成时参考 `opportunity-solution-tree` / `create-prd`。
- Requirements 只在故事、验收或边界不足时参考 `user-stories`。
- UI 正式原型固定为 Pencil；其他工具只能作为用户显式提供的外部输入。
- UI 方向确认后，先用 `design-system` 收敛设计语言、token、组件契约和页面模式，再进入 Pencil 原型。
- UX 参考只补充研究、流程和可访问性证据，不替代 Pencil 原型或 SpecForge UI artifact。
- 深度研究参考必须绑定真实来源；遇到当前事实、法规、价格、版本或新闻时另行联网核验。
- Code review 参考只补充检查维度，不替代 `sf-code-review` gate。
- Verification 前如需系统化测试设计、XMind / 白板导出、TC / PW 矩阵或自动化分层，先参考 `test-design`，再用 `test-case-quality.mjs` 检查。
- Verification 有浏览器流程时必须有 Playwright 用例和真实自动化操作证据。
- 第三方输出只当作参考笔记，不替代用户确认、SpecForge 模板或 gate evidence。

## 更新命令

```bash
# 更新全部第三方 skill 快照
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

# 列出当前托管的第三方 skill
node core/scripts/update-skills.mjs --list
```
