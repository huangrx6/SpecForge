# 架构

SpecForge v0.1 是一个 repository-native 协议。当前架构分为四层：

| 层 | 目录 | 职责 |
|---|---|---|
| 静态工作流引擎 | `.specforge/` | Agent 入口、workflow、artifact schema、rules、skills、templates、commands |
| 动态规格资产 | `.specforge/` | 项目长期知识、registry、active changes、archive |
| 本地执行脚本 | `.specforge/tools/` | validate、status、doctor、new change、artifact graph status |
| 未来代码区 | `src/`, `tests/` | 预留给后续 CLI / library 和测试 |

## 当前模型

当前实现仍是文件原生模型：

- Agent 指令以 Markdown 保存。
- Workflow 和 registry 以 YAML 保存。
- Artifact graph 以 `.specforge/schemas/standard.json` 声明。
- Change 运行态以 `change.yaml` 记录。
- Node 脚本提供结构校验、状态展示和变更创建。
- `new:change` 只生成控制面和 intake，后续产物由 `new:artifact` 按 artifact graph 渐进生成。
- AI 技能入口由 `.specforge/skills/specforge/SKILL.md` 负责路由，阶段技能只处理各自生命周期。
- `doctor` 命令聚合自测、结构校验、状态和 artifact graph，用于 Agent 进入仓库后的健康检查。

## 已确认的架构方向

v0.2 应从“固定目录流程”升级为“artifact graph 驱动流程”：

1. `.specforge/schemas/<workflow>.json` 定义产物、依赖、gate、apply、archive 条件。
2. `change.yaml` 记录单个变更的 gate 状态和证据。
3. CLI / scripts 根据 schema 计算下一步，而不是写死阶段顺序。
4. 归档必须包含 SSoT 回流或明确的无影响说明。
5. AI 使用层应保持“根入口路由、子技能执行、runtime 命令托底”。

参考：`docs/architecture/v0.2-reference-architecture.md`。
