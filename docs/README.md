# SpecForge

SpecForge 是仓库原生的规范驱动开发协议，以 Agent Skills + 项目内 `.specforge/` 项目目录的形式工作。

## 目录结构

```text
agent-skills/  外部可安装 Agent skills：sf-router / sf-*
core/          SpecForge 内核母本：rules、profiles、workflows、artifacts、scripts、hooks
starter/       业务项目初始化时写入 `.specforge/` 的唯一快照
docs/          维护者文档和适配器说明
cli/           npm / GitHub CLI 入口
```

源码仓库里的母本叫 `core/`，业务项目里生成的可用项目目录仍叫 `.specforge/`。`starter/` 是由 `core/starter.manifest.json` 生成的快照，不手工维护。

## 常用命令

```bash
npm run doctor
npm run validate
npm run validate:external-skills
npm run sync:starter
node cli/specforge.mjs skill add --target all --apply
node cli/specforge.mjs init --dir /path/to/project
```

## 技能

新入口统一使用 `sf` 前缀：

| Skill | 用途 |
|---|---|
| `sf-router` | 根路由，判断当前状态和下一步；输入 `sf` 前缀时用于发现所有技能 |
| `sf-onboard` | 初始化业务项目 `.specforge/` |
| `sf-intake` | 创建或整理 work item，并按 feature / bugfix / issue / refactor / discovery / lite / standard 分流 |
| `sf-requirements` | 生成 requirements |
| `sf-ui-design` | 生成 UI design、页面流程、原型证据 |
| `sf-tech-design` | 生成 technical design、前后端架构、API、数据和 NFR |
| `sf-tasking` | 生成 tasks |
| `sf-spec-review` | 执行 spec_review gate |
| `sf-implement` | 按已批准 tasks 实现 |
| `sf-code-review` | 执行 code_review gate |
| `sf-verify` | 收集验证证据 |
| `sf-wiki` | 手动或关闭前回写 `.specforge/wiki/*.md` |
| `sf-close` | release、rollback、archive |
| `sf-doctor` | 健康检查 |
| `sf-work` | 自动推进但不跳过 gate |

更多维护者说明见 [docs/README.md](/Users/huangrx6/workspace/specforge/docs/README.md)。
