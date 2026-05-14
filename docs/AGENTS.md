# SpecForge Agent 导航

SpecForge 当前源码结构以五个顶层目录为主：

```text
skills/      可安装 Agent skills，入口名为 sf-router / sf-*
runtime/     源码母本，包含 policy / artifacts / execution / workspace
starter/     业务项目 `.specforge/` 的生成快照
docs/        维护者文档、适配器说明、历史资料
cli/         `specforge` CLI 入口
```

## 开发 SpecForge 本仓库时

- `skills/sf-router` 是根路由技能，只负责扫描项目状态并路由到生命周期技能。
- `skills/sf-*` 是生命周期技能，每个技能只处理一个阶段。
- `runtime/execution/stages/` 是阶段行为母本。
- `runtime/policy/rules/` 和 `runtime/policy/tech-profiles/` 是稳定规则与技术栈卡片。
- `runtime/artifacts/schemas/` 和 `runtime/artifacts/templates/` 定义 artifact graph 与产物模板。
- `runtime/execution/tools/` 是本地命令层。
- `runtime/workspace/work-items/` 保存 SpecForge 本仓库自举 work item 证据。
- `starter/` 是生成产物，不是源码母本；修改 runtime 后运行 `npm run sync:starter`。

框架改动后建议运行：

```bash
npm run selftest
npm run validate:skills
npm run validate
npm run doctor
node cli/specforge.mjs skill add --target all --apply --prune-legacy
```

## 在业务项目中使用时

业务仓库接入 SpecForge 后仍只新增一个项目内目录：

```text
.specforge/
├── AGENTS.md
├── attention.md
├── manifest.yaml
├── registry.yaml
├── policy/
├── artifacts/
├── execution/
└── workspace/
```

业务项目内的 `.specforge/AGENTS.md` 是本地运行时权威入口。

## 工作流

```text
standard:  intake -> [research if needs_research] -> requirements -> [ui_design if has_ui] -> [technical_design if technical components] -> tasks -> spec_review -> implementation -> code_review -> verification -> ssot_sync -> closure
feature:   intake -> [research if needs_research] -> requirements -> [ui_design if has_ui] -> [technical_design if technical components] -> tasks -> spec_review -> implementation -> code_review -> verification -> ssot_sync -> closure
lite:      intake -> requirements -> tasks -> implementation -> code_review -> verification -> ssot_sync -> closure
bugfix:    intake -> gap_report -> tasks -> implementation -> code_review -> verification -> ssot_sync -> closure
refactor:  intake -> technical_design -> tasks -> spec_review -> implementation -> code_review -> verification -> ssot_sync -> closure
discovery: intake -> research -> ssot_sync -> closure
```

必需 gate 必须有 evidence 文件，不能只靠聊天口头认可。
