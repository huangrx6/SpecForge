# SpecForge Scripts

`core/scripts/` 的根目录只保留稳定兼容入口。真实实现必须放在 `modules/<module>/`，可复用纯逻辑放在 `lib/`。业务项目和 README 可以继续使用 `node .specforge/core/scripts/<command>.mjs`，但该入口必须只是薄 wrapper。

本文件是脚本模块和命令入口的事实源。标准文档可以引用少量阶段节奏命令，但不要复制完整命令目录；需要完整脚本语义时，优先引用本文件和 `core/standards/ai-toolkit.md`。

## 模块地图

| 模块 | 实现脚本 | 职责 |
|---|---|---|
| `routing` | `status.mjs`, `instructions.mjs`, `workflow-audit.mjs`, `workflow-health.mjs`, `stage-contract.mjs`, `artifact-graph-status.mjs` | 判断当前状态、下一步、健康度、阶段契约和全流程导航 |
| `authoring` | `create-work.mjs`, `create-artifact.mjs`, `sync-wiki.mjs` | 创建 work item / artifact，回写长期 wiki |
| `quality` | `quality-suite.mjs`, `artifact-quality.mjs`, `decision-quality.mjs`, `source-quality.mjs`, `implementation-quality.mjs`, `test-case-quality.mjs`, `evidence-summary.mjs`, `wiki-quality.mjs`, `closure-quality.mjs`, `gate-preflight.mjs` | 阶段感知质量检查、测试用例质量、gate 前只读预检和证据分级 |
| `gates` | `gate.mjs` | 更新 gate 状态并触发 hook |
| `reporting` | `render-work-report.mjs`, `workflow-package.mjs`, `handoff-summary.mjs`, `traceability-summary.mjs` | 生成 HTML / review package / handoff / traceability 摘要 |
| `code-intelligence` | `codebase-map.mjs`, `codebase-index.mjs` | 存量项目代码画像、provider 检测、CodeGraph / Repomix 编排计划 |
| `maintenance` | `doctor.mjs`, `self-test.mjs`, `framework-audit.mjs`, `sync-starter.mjs`, `upgrade-runtime.mjs`, `update-skills.mjs`, `validate-structure.mjs`, `validate-skills.mjs`, `validate-external-skills.mjs` | 仓库健康、框架自审计、starter 同步、项目运行时升级、skill 更新和结构校验 |
| `archive` | `archive-work.mjs` | work item 归档和 registry 更新 |

## 根入口规则

- 根目录 `.mjs` 只能包含 shebang 和一条 `import "./modules/<module>/<command>.mjs";`。
- 新脚本必须先放进 `modules/<module>/`，再按需增加根 wrapper。
- `core/scripts/modules/README.md` 是模块归属事实源；`framework-audit.mjs` 会检查根 wrapper、模块实现和清单一致。

## 下一批模块化目标

| 目标 | 建议内部模块 | 说明 |
|---|---|---|
| CodeGraph health provider 抽取 | `scripts/modules/code-intelligence/providers/codegraph.mjs` | 当前 health 已在根入口实现；后续可抽成 provider 模块 |
| Provider 事实归一 | `scripts/modules/code-intelligence/provider-facts.mjs` | 统一记录 fact、source path、confidence、provider、query、timestamp、used_for_wiki |
| 测试用例质量扩展 | `scripts/modules/quality/test-case-quality.mjs` | 当前已有模块实现；后续扩展覆盖率 / 追溯规则 |
| Playwright 证据归档 | `scripts/modules/quality/playwright-evidence.mjs` | 把临时脚本、stdout、截图、trace manifest 归档到 `05-verification/evidence/<run-id>/` |
| XMind 测试设计 | `scripts/modules/quality/xmind-export-check.mjs` | XMind 只做测试设计草图，必须导出 Markdown / JSON 并回到 test cases |

## 重构规则

- 不把业务逻辑写在根目录命令入口；根入口只做兼容跳转。
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
