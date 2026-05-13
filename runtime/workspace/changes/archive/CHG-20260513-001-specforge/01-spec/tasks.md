# Tasks

## 并行波次

| Wave | 目标 | Tasks |
|---|---|---|
| P0 | 迁移契约、路径抽象和兼容策略 | T001-T005 |
| P1 | 新入口技能与 runtime 分层落地 | T006-T011 |
| P2 | starter、onboard、CLI 和 docs 迁移 | T012-T016 |
| P3 | hooks、commands、验证和安装收口 | T017-T021 |

## 任务列表

- [x] T001 [P0] 建立新旧目录映射清单，并把迁移范围固定到 spec 中。
  _Boundary:_ `.specforge/changes/active/CHG-20260513-001-specforge/01-spec/`, root docs only.
  _Depends:_ none
  _Verification:_ requirements / design / tasks 中同时列出旧路径、新路径、保留兼容路径和禁止迁移项；没有把业务项目 `.specforge/` 改名为 `runtime/`。

- [x] T002 [P0] 为工具层引入路径解析契约，支持从源码仓库 `runtime/` 与业务项目 `.specforge/` 两种上下文取路径。
  _Boundary:_ `.specforge/tools/lib/specforge.mjs`, `.specforge/tools/*.mjs`
  _Depends:_ T001
  _Verification:_ 现有 `.specforge/tools/self-test.mjs` 在旧布局下仍通过；路径解析单元覆盖 package source、business project、starter snapshot 三类场景。

- [x] T003 [P0] 更新结构校验策略，让校验器能识别迁移期的新旧双布局并输出清晰错误。
  _Boundary:_ `.specforge/tools/validate-structure.mjs`, `.specforge/tools/self-test.mjs`
  _Depends:_ T002
  _Verification:_ 旧布局校验仍通过；人为缺少 `runtime/policy/rules` 或 `starter/tools` 时能给出具体缺失路径。

- [x] T004 [P0] 定义技能安装兼容策略：新技能名为 `sf` / `sf-*`，旧 `specforge` / `specforge-*` 保持可用或明确作为兼容 wrapper。
  _Boundary:_ `specforge*/SKILL.md`, future `skills/sf*/SKILL.md`, `.specforge/tools/install-agent-skills.mjs`, `bin/specforge.mjs`
  _Depends:_ T001
  _Verification:_ validate-skills 能检查新技能；安装目标中输入 `sf` 可发现新技能，输入旧 `specforge` 仍不会直接失效。

- [x] T005 [P0] 冻结 starter 生成规则，明确哪些 runtime 资产会进入业务项目 `.specforge/`，哪些 workspace 动态状态永远不复制。
  _Boundary:_ `.specforge/starter.manifest.json`, `.specforge/tools/sync-starter-assets.mjs`, `specforge-onboard/assets/GENERATED.md`
  _Depends:_ T001
  _Verification:_ manifest 中不包含当前 active/archive change；生成的 starter 只含空 `changes/`、空 registry、轻量 knowledge 占位和静态运行时资产。

- [x] T006 [P1] 创建顶层 `skills/`，把根入口技能迁移为 `skills/sf` 和 `skills/sf-*`。
  _Boundary:_ `skills/sf*/SKILL.md`, legacy `specforge*/SKILL.md`
  _Depends:_ T004
  _Verification:_ 每个新技能 frontmatter `name` 与目录一致；旧技能要么是兼容 wrapper，要么文档明确废弃节奏；`node .specforge/tools/validate-skills.mjs` 通过。

- [x] T007 [P1] 将内部阶段行为母本从 `.specforge/skills/` 迁移到 `runtime/execution/stages/`。
  _Boundary:_ `.specforge/skills/**`, `runtime/execution/stages/**`, `skills/sf*/SKILL.md`, legacy `specforge*/SKILL.md`
  _Depends:_ T002, T006
  _Verification:_ 根级技能和新 `sf-*` 技能读取 `runtime/execution/stages/<stage>/SKILL.md`；不存在 `skills/` 与 `runtime/execution/stages/` 同名歧义。

- [x] T008 [P1] 将规则与技术栈 profile 迁移到 `runtime/policy/`。
  _Boundary:_ `.specforge/rules/**`, `.specforge/tech-profiles/**`, `runtime/policy/rules/**`, `runtime/policy/tech-profiles/**`, skill references
  _Depends:_ T002
  _Verification:_ `analysis-workflow`、`product-discovery`、`experience-design`、`spec-quality`、`tech-profiles` 的引用全部更新；`rg ".specforge/rules|.specforge/tech-profiles"` 只剩业务项目上下文或兼容说明。

- [x] T009 [P1] 将 artifact graph 和模板迁移到 `runtime/artifacts/`。
  _Boundary:_ `.specforge/schemas/**`, `.specforge/templates/**`, `runtime/artifacts/schemas/**`, `runtime/artifacts/templates/**`, `.specforge/tools/create-artifact.mjs`, `.specforge/tools/instructions.mjs`
  _Depends:_ T002
  _Verification:_ `create-artifact.mjs requirements/design/tasks/spec_review` 仍能在业务项目 `.specforge/changes/active/...` 下写入正确模板；artifact graph 状态命令通过。

- [x] T010 [P1] 将运行命令层迁移到 `runtime/execution/tools/`，并保持业务项目安装后仍使用 `.specforge/tools/*.mjs`。
  _Boundary:_ `.specforge/tools/**`, `runtime/execution/tools/**`, path resolver, starter sync
  _Depends:_ T002, T003
  _Verification:_ 源码仓库内可从 `runtime/execution/tools` 运行；业务项目 starter 内仍 materialize 为 `.specforge/tools`；`doctor/self-test/status/instructions/gate` 均通过。

- [x] T011 [P1] 将 workspace 母本迁移到 `runtime/workspace/`，只保留空模板与长期知识结构，不复制 SpecForge 当前 change 事实。
  _Boundary:_ `.specforge/knowledge/**`, `.specforge/changes/**`, `.specforge/registry.yaml`, `runtime/workspace/**`, starter sync
  _Depends:_ T005
  _Verification:_ 源码仓库当前 active change 不被误复制到 starter；新 starter 的 `workspace/changes` 或输出 `.specforge/changes` 是空 inbox/active/archive。

- [x] T012 [P2] 建立扁平 `starter/` 快照目录，并让它从 `runtime/` 生成。
  _Boundary:_ `starter/**`, `runtime/**`, `.specforge/tools/sync-starter-assets.mjs`, `.specforge/starter.manifest.json`, `specforge-onboard/assets/**`
  _Depends:_ T008, T009, T010, T011
  _Verification:_ `node runtime/execution/tools/sync-starter-assets.mjs --check` 或兼容命令通过；`starter/AGENTS.md`、`starter/rules`、`starter/templates`、`starter/tools`、`starter/changes` 均存在。

- [x] T013 [P2] 更新 onboard 技能，让业务项目初始化仍只创建 `.specforge/`，但素材来源改为 `starter/` 或技能内嵌快照。
  _Boundary:_ `skills/sf-onboard/SKILL.md`, legacy `specforge-onboard/SKILL.md`, `specforge-onboard/assets/**`, CLI init path
  _Depends:_ T012
  _Verification:_ 在 `/private/tmp` 新建空仓库后，通过 onboard 流程得到 `.specforge/attention.md`、`.specforge/registry.yaml`、`.specforge/tools/doctor.mjs`；doctor 通过。

- [x] T014 [P2] 将 CLI 从 `bin/` 迁移到 `cli/`，并更新 package scripts、bin 入口和文档命令。
  _Boundary:_ `bin/specforge.mjs`, `cli/specforge.mjs`, `package.json`, `README.md`, `CLAUDE.md`, `AGENTS.md`
  _Depends:_ T010, T012
  _Verification:_ `npm run doctor`、`npm run validate`、`node cli/specforge.mjs init --help` 或等价命令可运行；package `bin.specforge` 指向新 CLI。

- [x] T015 [P2] 将维护者文档与 adapters 归入 `docs/`，根目录只保留必要入口或兼容说明。
  _Boundary:_ `README.md`, `AGENTS.md`, `CLAUDE.md`, `.specforge/adapters/**`, `docs/**`
  _Depends:_ T014
  _Verification:_ 根目录可一眼看到 `skills/ runtime/ starter/ docs/ cli/`；迁移后的文档引用不指向已删除旧路径。

- [x] T016 [P2] 批量更新所有硬编码旧路径引用，并保留必要兼容注释。
  _Boundary:_ `skills/**`, `runtime/**`, `starter/**`, `docs/**`, `cli/**`, legacy wrappers
  _Depends:_ T006-T015
  _Verification:_ `rg "specforge-|\\.specforge/skills|\\.specforge/rules|\\.specforge/templates|bin/specforge|specforge-onboard/assets/starter" -S` 输出只包含业务项目路径、历史说明或兼容 wrapper。

- [x] T017 [P3] 设计并实现 hooks 默认 noop 与项目覆盖加载器。
  _Boundary:_ `runtime/execution/hooks/**`, `runtime/workspace/hooks/**`, `runtime/execution/tools/lib/**`, `starter/hooks/**`
  _Depends:_ T010, T012
  _Verification:_ `pre-gate` 能阻断 gate 并返回清晰错误；`post-gate` 默认失败不阻断，strict 模式失败阻断；无自定义 hook 时行为与现有 gate 一致。

- [x] T018 [P3] 添加 commands 目录与最小命令卡片，明确 slash command 是用户入口层，不参与 core runtime 逻辑。
  _Boundary:_ `runtime/execution/commands/**`, `starter/commands/**`, docs
  _Depends:_ T012
  _Verification:_ 至少包含 `sf-status`、`sf-next`、`sf-review` 命令卡片；文档说明命令如何映射到 tools / skills，且不会被误当成可执行脚本。

- [x] T019 [P3] 扩展 validation/self-test 覆盖新目录、hooks、commands、starter 和技能安装映射。
  _Boundary:_ `runtime/execution/tools/validate-structure.mjs`, `runtime/execution/tools/validate-skills.mjs`, `runtime/execution/tools/self-test.mjs`, package scripts
  _Depends:_ T006-T018
  _Verification:_ self-test、validate-skills、validate-structure、doctor 全部通过；缺失 hooks/commands 时有可读错误。

- [x] T020 [P3] 做一次真实业务项目 smoke test，模拟安装到 Claude Code 后新建空项目并完成 onboard + doctor。
  _Boundary:_ `/private/tmp/specforge-smoke-*`, installed skill copies, `05-verification/report.md`
  _Depends:_ T013, T019
  _Verification:_ 新项目只出现 `.specforge/` 一个 SpecForge 工作区；`node .specforge/tools/doctor.mjs` PASS；`sf` 能路由到下一步。

- [x] T021 [P3] 安装更新后的技能到所有目标，并记录验证证据。
  _Boundary:_ installed skills for Claude Code / Codex / cc-switch, `05-verification/report.md`, `06-closure/ssot-sync.md`
  _Depends:_ T019, T020
  _Verification:_ `node cli/specforge.mjs skill add --target all --apply` 或兼容命令成功；安装副本中的 `sf-*` 与仓库一致；旧 `specforge-*` 兼容入口验证通过。
