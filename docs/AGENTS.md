# SpecForge Agent 导航

SpecForge 当前源码结构以五个顶层目录为主：

```text
agent-skills/  可安装 Agent skills，入口名为 sf-router / sf-*
core/          源码母本，包含 standards / profiles / workflows / artifacts / scripts / hooks
starter/       业务项目 `.specforge/` 的生成快照
docs/          维护者文档和适配器说明
cli/           `specforge` CLI 入口
```

## 开发 SpecForge 本仓库时

- `agent-skills/sf-router` 是根路由技能，只负责扫描项目状态并路由到生命周期技能。
- `agent-skills/sf-*` 是生命周期技能，每个技能只处理一个阶段。
- `core/workflows/stages/` 是阶段行为母本。
- `core/standards/` 和 `core/profiles/` 是稳定标准与技术选择卡。
- `core/artifacts/schemas/` 和 `core/artifacts/templates/` 定义 artifact graph 与产物模板。
- `core/scripts/` 是本地命令层。
- `starter/.specforge/work/` 保存 SpecForge 本仓库自举 work item 证据。
- `starter/` 是生成产物，不是源码母本；修改 core 后运行 `npm run sync:starter`。

框架改动后建议运行：

```bash
npm run selftest
npm run validate:skills
npm run validate:external-skills
npm run validate
npm run doctor
node cli/specforge.mjs skill add --target all --apply
```

## 在业务项目中使用时

业务仓库接入 SpecForge 后仍只新增一个项目内目录：

```text
.specforge/
├── AGENTS.md
├── manifest.yaml
├── registry.yaml
├── core/
├── hooks/
├── wiki/
└── work/
```

业务项目内的 `.specforge/AGENTS.md` 是本地运行时权威入口。

## 工作流

```text
standard:  intake -> [research if needs_research] -> requirements -> [ui_design if has_ui] -> [technical_design if technical components] -> tasks -> spec_review -> implementation -> code_review -> verification -> wiki_sync -> closure
feature:   intake -> [research if needs_research] -> requirements -> [ui_design if has_ui] -> [technical_design if technical components] -> tasks -> spec_review -> implementation -> code_review -> verification -> wiki_sync -> closure
lite:      intake -> requirements -> tasks -> implementation -> code_review -> verification -> wiki_sync -> closure
bugfix:    intake -> gap_report -> tasks -> implementation -> code_review -> verification -> wiki_sync -> closure
issue:     intake -> gap_report -> tasks -> implementation -> code_review -> verification -> wiki_sync -> closure
refactor:  intake -> technical_design -> tasks -> spec_review -> implementation -> code_review -> verification -> wiki_sync -> closure
discovery: intake -> research -> wiki_sync -> closure
```

必需 gate 必须有 evidence 文件，不能只靠聊天口头认可。
