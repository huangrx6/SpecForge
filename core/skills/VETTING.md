# 内置参考 Skill 审查规则

`core/skills/` 只托管少量能直接补足 SpecForge 主流程的参考 skill，包括 SpecForge 本地维护 skill 和经过审查的第三方 skill 快照。新增、升级或恢复已删除 skill 前，必须先完成本文件的审查。

## 当前托管清单

| Skill | 来源 | 支撑文件 | 主要风险 | 结论 |
|---|---:|---:|---|---|
| `create-prd` | `phuryn/pm-skills` | 0 | 可能保存到外部建议文件名或把 Technology 扩成技术方案 | 只作为 PRD 结构参考，归一化到 SpecForge PRD |
| `user-stories` | `phuryn/pm-skills` | 0 | 可能带入 Sprint / backlog 表达 | 只保留 3C、INVEST 和验收标准方法 |
| `opportunity-solution-tree` | `phuryn/pm-skills` | 5 | 可能把缺少证据的分数写成事实 | 只作为机会树、功能候选、实验和优先级方法，结论必须等用户确认 |
| `design-system` | SpecForge local-authored | 56 | 可能把设计规则当成已确认 UI 方向 | 只作为设计语言、组件契约、动效、页面模式和去廉价感参考，必须归一化到 UI artifact 或组件契约 |
| `brainstorm-search` | SpecForge local-authored | 3 | 可能把来源索引当成事实，或在无联网证据时补结论 | 只作为 brainstorm 当前事实查证流程、来源选择、版本关系和证据表契约，事实必须来自实际 URL / 本地证据 |
| `test-design` | SpecForge local-authored | 3 | 可能把测试设计替代真实验证 | 只作为测试空间、TC / PW 矩阵和证据目标参考，必须落到 verification artifact 并执行验证 |
| `deep-research` | `Shubhamsaboo/awesome-llm-apps` | 0 | 可能把旧资料当事实 | 只提供研究组织方法，事实另行核验 |
| `code-reviewer` | `Shubhamsaboo/awesome-llm-apps` | 6 | 可能输出模板化 finding | 只作为风险检查清单 |
| `pencil` | `chiroro-jr/skills` | 8 | 依赖 Pencil MCP，且 upstream 引用未托管的 `frontend-design` | 本地裁剪为读取已确认 UI 方向和 SpecForge 设计标准，只用于 Pencil 原型、截图证据和设计转代码参考 |
| `playwright-skill` | `lackeyjb/playwright-skill` | 4 | 浏览器自动化可能接触敏感数据 | 只在受控测试环境做 E2E 证据 |

## 最新审查记录：phuryn/pm-skills

| 项 | 结论 |
|---|---|
| 来源 | GitHub `phuryn/pm-skills` |
| 仓库状态 | 11632 stars、1377 forks、MIT、默认分支 `main`、最近 pushed `2026-05-20` |
| 审查文件 | `create-prd`、`user-stories`、`opportunity-solution-tree` 以及 opportunity references：`brainstorm-ideas-new`、`brainstorm-ideas-existing`、`analyze-feature-requests`、`prioritize-features`、`prioritization-frameworks` |
| 红旗 | 未发现凭据读取、系统文件修改、base64、eval/exec、sudo、未知 curl/wget、cookie 导出 |
| 风险等级 | 低 |
| 采用方式 | 替换旧的 `product-brainstorming`、`to-prd`、`user-story-writing`；删除 `web-design-guidelines` |
| 使用边界 | 只作为 PM 方法卡，所有输出必须归一化到 SpecForge artifact，不能执行其“save as markdown”或外部投递动作 |

## 审查步骤

1. 确认来源仓库、路径、许可证和维护状态。
2. 读取 `SKILL.md` 和声明的 support files，只保留确实会被 SpecForge 阶段读取的文件；重复目录索引、完整汇总版文档和运行期不会读取的样例应删除。
3. 检查是否要求执行外部发布、读取凭据、上传数据、修改第三方系统或绕过用户确认；本地维护 skill 也必须检查是否会绕过 SpecForge gate。
4. 在 `registry.json` 写清 `trigger`、`normalizeTo`、`doNotUseFor` 和保留的 support files；不要再为每个 skill 生成单独 `SOURCE.json`。
5. 更新 `ORCHESTRATION.md`，说明它在哪个阶段、以什么边界使用。
6. 如果删除了上游 support file，要在 `update-skills.mjs` 中保留对应的本地裁剪规则，避免下次更新恢复坏链接。
7. 同步 starter，并运行：

```bash
node core/scripts/validate-external-skills.mjs
node core/scripts/sync-starter.mjs --check
```

## 禁止项

- 不新增“看起来可能有用”但没有明确阶段用途的 skill。
- 不把外部 skill 输出原样落进 work item 或 wiki。
- 不恢复多路 UI 生成 / Figma / getdesign / design-md / 独立竞品研究等能力，除非用户明确要求重新纳入默认流程。
- 不保存、输出、转发 Cookie、token、密码、localStorage 或 sessionStorage 敏感信息。
- 不让参考 skill 替代用户确认、SpecForge artifact 模板或 gate evidence。

## 已吸收并删除

| Skill | 原来源 | 处理方式 |
|---|---|---|
| `ux-designer` | `Shubhamsaboo/awesome-llm-apps` | 已吸收为 `design-system/references/ux-research-ia.md`，不再托管独立第三方 skill，避免泛 UX 教程和 SpecForge UI 流程并行。 |
