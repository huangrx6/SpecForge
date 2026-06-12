# SpecForge Scripts

`core/scripts/` 的根目录保留稳定命令入口，业务项目和 README 可以继续使用已有路径。脚本实现按下面模块理解；后续重构时，根目录脚本应逐步变成薄 wrapper，具体实现放入模块目录或 `lib/`。

## 模块地图

| 模块 | 入口脚本 | 职责 |
|---|---|---|
| `routing` | `status.mjs`, `instructions.mjs`, `workflow-audit.mjs`, `workflow-health.mjs`, `stage-contract.mjs`, `artifact-graph-status.mjs` | 判断当前状态、下一步、健康度、阶段契约和全流程导航 |
| `authoring` | `create-work.mjs`, `create-artifact.mjs`, `sync-wiki.mjs` | 创建 work item / artifact，回写长期 wiki |
| `quality` | `quality-suite.mjs`, `artifact-quality.mjs`, `decision-quality.mjs`, `source-quality.mjs`, `implementation-quality.mjs`, `test-case-quality.mjs`, `evidence-summary.mjs`, `wiki-quality.mjs`, `closure-quality.mjs`, `gate-preflight.mjs` | 阶段感知质量检查、测试用例质量、gate 前只读预检和证据分级 |
| `gates` | `gate.mjs` | 更新 gate 状态并触发 hook |
| `reporting` | `render-work-report.mjs`, `workflow-package.mjs`, `handoff-summary.mjs`, `traceability-summary.mjs` | 生成 HTML / review package / handoff / traceability 摘要 |
| `code-intelligence` | `codebase-map.mjs`, `codebase-index.mjs` | 存量项目代码画像、provider 检测、CodeGraph / Repomix 编排计划 |
| `maintenance` | `doctor.mjs`, `self-test.mjs`, `sync-starter.mjs`, `update-skills.mjs`, `validate-structure.mjs`, `validate-skills.mjs`, `validate-external-skills.mjs` | 仓库健康、starter 同步、skill 更新和结构校验 |
| `archive` | `archive-work.mjs` | work item 归档和 registry 更新 |

## 下一批模块化目标

| 目标 | 建议内部模块 | 说明 |
|---|---|---|
| CodeGraph health | `scripts/code-intelligence/providers/codegraph.mjs` | 区分 installed / version / initialized / indexed / pending sync，不再把 CLI 存在当作图谱可用 |
| Provider 事实归一 | `scripts/code-intelligence/provider-facts.mjs` | 统一记录 fact、source path、confidence、provider、query、timestamp、used_for_wiki |
| 测试用例质量 | `scripts/quality/test-case-quality.mjs` | 已有根入口；后续可抽到内部模块并扩展覆盖率 / 追溯规则 |
| Playwright 证据归档 | `scripts/quality/playwright-evidence.mjs` | 把临时脚本、stdout、截图、trace manifest 归档到 `05-verification/evidence/<run-id>/` |
| XMind 测试设计 | `scripts/quality/xmind-export-check.mjs` | XMind 只做测试设计草图，必须导出 Markdown / JSON 并回到 test cases |

## 重构规则

- 不直接删除或移动根目录命令入口；先在内部抽取实现，再让根入口调用新模块。
- 任何新脚本必须归入上表模块之一。若归不进去，先更新本文件说明新模块职责。
- `lib/` 只放可复用纯逻辑，不放会直接修改 work item 的命令流程。
- 脚本输出优先一页可读：状态、下一步、失败原因、推荐命令、JSON 模式。
- 每次变更后运行：

```bash
npm run validate
npm run check:starter
npm run selftest
npm run doctor
```
