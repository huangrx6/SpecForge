# 内置第三方 Skills

本目录保存经过审查的第三方 skill 快照。它们不是 SpecForge 工作流阶段，只是少量可复用方法卡；只有被归一化为 SpecForge artifact 后，才能影响具体 work item。

调用第三方 skill 前，先阅读 `ORCHESTRATION.md`；升级或新增第三方 skill 前，先阅读 `VETTING.md`。

## 文件职责

| 文件 | 用途 |
|---|---|
| `ORCHESTRATION.md` | 运行时编排规则：什么时候调用哪个 skill、输出写回哪里 |
| `registry.json` | 唯一机器可读清单：来源、风险、触发、归一化目标和更新输入 |
| `VETTING.md` | 安全审查和更新纪律 |
| `<skill>/references/` / `<skill>/rules/` | 按需读取的细分材料；只有能降低主 `SKILL.md` 负担时保留 |

## 保留 Skill

| Skill | 在 SpecForge 中的作用 | 归一化输出 |
|---|---|---|
| `opportunity-solution-tree` | Intake / PRD 前的机会树、功能候选、假设、实验和优先级参考 | `00-intake/brainstorm.md`、`00-intake/brief.md`、`00-intake/prd.md` |
| `create-prd` | 上下文充分时合成 PRD | `00-intake/prd.md` |
| `user-stories` | 用户故事、3C / INVEST 和验收标准参考 | `01-spec/requirements.md` |
| `pencil` | Pencil MCP 原型读写、组件复用、tokens、布局检查、截图导出和设计转代码参考 | `01-spec/ui-design.md`、`.pen` 源文件、导出截图、前端实现备注 |
| `playwright-skill` | 浏览器 E2E、真实操作、截图和响应式验证 | `05-verification/test-cases.md`、`05-verification/report.md`、`05-verification/evidence/` |
| `code-reviewer` | 安全、性能、正确性和可维护性的 code review 参考清单 | `04-code-review/code-review-v1.md`、`05-verification/report.md` |
| `ux-designer` | 用户研究、信息架构、交互、可访问性和视觉层级参考 | `01-spec/research.md`、`01-spec/ui-design.md` |
| `deep-research` | 多来源研究综合、引用和共识/争议拆解参考 | `01-spec/research.md` |

## 触发纪律

- 不在每个阶段默认加载第三方 skill。
- PRD 只在需要机会树 / 功能候选 / 合成时参考 `opportunity-solution-tree` / `create-prd`。
- Requirements 只在故事、验收或边界不足时参考 `user-stories`。
- UI 正式原型固定为 Pencil；其他工具只能作为用户显式提供的外部输入。
- UX 参考只补充研究、流程和可访问性证据，不替代 Pencil 原型或 SpecForge UI artifact。
- 深度研究参考必须绑定真实来源；遇到当前事实、法规、价格、版本或新闻时另行联网核验。
- Code review 参考只补充检查维度，不替代 `sf-code-review` gate。
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
