# SDD 参考资料综合

本文记录用于完善 SpecForge v0.1 / v0.2 的外部参考。更深入的实现级研究见：

- `docs/research/openspec-implementation-study.md`
- `docs/research/cc-sdd-implementation-study.md`
- `docs/research/specforge-gap-analysis.md`

## 来源

| 来源 | 相关启发 |
|---|---|
| Kiro | 自然语言转结构化 requirements、EARS、design、task plan、steering files |
| GitHub Spec Kit | spec 作为主产物，`/specify` -> `/plan` -> `/tasks`，constitution gate |
| OpenSpec | artifact graph、instructions、delta spec、apply/archive、schema-driven workflow |
| cc-sdd | discovery router、boundary-first specs、review gates、task boundaries、multi-agent installer |
| oh-my-openagent | harness、intent gate、分层 AGENTS、skill 工具化、AST/LSP、hash anchored edit |
| Jimmy Song SDD overview | 从自由式 AI 编码转向结构化、可验证协作协议 |
| ClaudeCode Reddit 讨论 | SDD 对中大型工作有效，小任务需要轻量路径 |

## 已进入 SpecForge v0.1

| 机制 | SpecForge 表达 |
|---|---|
| Discovery 作为路由 | `discovery` skill 和 `specforge.discovery` command card |
| EARS 风格 requirements | 扩展后的 `requirements.md` 模板 |
| 边界优先 | `boundaries.md`、design boundary commitments、task `_Boundary:_` |
| 轻重流程分流 | lite、standard、bugfix workflow |
| 人类可审查 gate | `gates.md`、spec/code review 模板、gate evidence 检查 |
| 持久化 brief | `00-intake/brief.md` |
| 机器基础校验 | `node .specforge/tools/validate-structure.mjs`、验证模板、CI result 模板 |
| Artifact graph 初版 | `.specforge/schemas/standard.json` 和 `node .specforge/tools/artifact-graph-status.mjs` |
| SSoT sync | closure 模板和 gate evidence |
| 中文优先 | `localization.md` |

## 暂缓实现

| 暂缓项 | 原因 |
|---|---|
| 完整 multi-agent team mode | 需要先稳定 artifact、任务模型和 gate |
| Hash anchored edit tool | 重要，但不是 repository protocol MVP |
| 完整 schema validation | 需要模板和 graph 稳定后再做 |
| 多工具 adapters | 先验证 Codex 路径，再扩展 |
| 自动分支创建 | 有价值，但 v0.1 先把文件协议跑通 |

## 产品判断

- SpecForge 不应强迫每个变更都进入重流程。
- 关键差异是静态工作流引擎和动态项目事实分离。
- 边界清晰比文档数量更重要。
- 校验必须同时包含人类 gate 和机器检查。
- Agent 加载要渐进式，避免一上来吞掉全部上下文。
- 中文应成为默认协作语言，英文只保留在命令、路径、状态和必要术语中。

## 参考链接

- https://kiro.dev/
- https://github.com/Fission-AI/OpenSpec
- https://github.com/github/spec-kit/blob/main/spec-driven.md
- https://github.com/gotalab/cc-sdd
- https://github.com/code-yeongyu/oh-my-openagent
- https://jimmysong.io/zh/book/ai-handbook/sdd/overview/
- https://www.reddit.com/r/ClaudeCode/comments/1pyfjug/how_is_your_experience_with_sdd/
