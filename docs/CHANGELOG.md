# 变更日志

SpecForge 在 1.0 之前按 semver 思路管理版本：小版本仍可能调整项目内 `.specforge/` 结构，但破坏性迁移要求必须记录在这里。

## 0.3.0

- 顶层目录重构为 `agent-skills/` + `core/` + `starter/` + `docs/` + `cli/`。
- 项目侧 `.specforge/` 重构为 `core/`、`hooks/`、`wiki/`、`work/` 四块。
- work item 命名改为 `YYYYMMDD-kind-NNN-short-title`，支持 `feat`、`bugfix`、`issue`、`refactor` 等类型。
- 新增 `issue` workflow，用于尚未完全定性的异常、告警或问题排查。
- 新增 `sf-wiki`，把长期项目事实按 wiki 单文件条目维护。
- 新增 `sf-steering`，用于存量项目接入后先建立项目画像和上下文基线。
- `codebase-map.mjs` 降级为 bootstrap / fallback scanner；新增 `codebase-index.mjs` 和 `code-intelligence.md`，用于检测 code intelligence provider 并约束 large codebase 的处理边界。
- `codebase-index.mjs` 支持 `--write-report` 生成 `codebase-intelligence.md` 中间证据，并输出 `normalized_context`、provider plan 与可选 provider execution 结果。
- Agent skill 安装器新增 `trae-cn` 目标，并支持 `--scope user|project`，可安装到 Trae CN 的 `~/.trae-cn/skills` 或项目 `.trae/skills`。
- Pencil UI 原型规则新增空画布反循环保护：空 `.pen` 只读一次，之后必须 `batch_design` 创建第一屏或降级 HTML mockup。
- 技术设计新增技术选型与依赖确认门禁：新项目、关键技术变更或新增直接依赖必须先让用户确认；`[NEEDS TECH DECISION]` / `[NEEDS DEPENDENCY DECISION]` 会阻断 tasking / review / implementation。
- `sf-intake` 明确 completed / archived work item 不再复开；围绕已完成初始需求继续讨论遗漏、缺陷、UI 或测试问题时，必须创建带 `relations.parent` / `relations.relation` 的 follow-up work item。
- UI 设计新增视觉质量门禁：用户提供示例、截图、规范或参考产品时，必须提取设计语言，产出可视证据，完成截图级 review 和至少一轮修正，默认控件堆叠不可通过 spec review。
- 浏览器流程验证升级为 Playwright E2E 必需项：上传、提交、审批、下载、权限和错误提示等路径必须先写用例，再执行真实浏览器自动操作并保存证据；单元测试、手工验证或 DevTools 检查不能替代。

## 0.2.0

- 新增 `specforge` 根路由技能和生命周期子技能。
- 通过 `.specforge/core/artifacts/schemas/standard.json` 引入 artifact graph 驱动的流程推进。
- 新增 `create-artifact.mjs`，支持渐进式 artifact 创建。
- 新增 `instructions.mjs`，为 Agent 生成下一步指令。
- 新增 `gate.mjs`，支持 gate evidence 写回。
- 新增 `archive-work.mjs`，支持归档前检查。
- 新增 `doctor.mjs`、`validate-skills.mjs`、registry 自测和 Agent skill 安装工具。
- 新增中文优先规则、模板和长期项目事实指引。

## 0.1.0

- 引入根级 skill bundle 布局。
- 引入初始 `.specforge/` 项目目录和 starter assets。
- 引入基础生命周期：onboard、intake、spec、implement、review、verify、close。
- 新增初始 validation 和 status 脚本。

## 升级提示

- `0.1.x -> 0.2.x`：框架从目录模板推进到 artifact graph 驱动，并统一使用 work item 语义。
- 升级已有项目内 `.specforge/` 前，先运行 `node .specforge/core/scripts/doctor.mjs` 并检查 validation 失败项。
- 不要在升级时自动改写 archived work items。历史证据需要规范化时，应通过显式 migration work item 完成。
