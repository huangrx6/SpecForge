# 校验模型

SpecForge 校验分为人类可审查门禁和机器可执行检查。v0.1 当前已经覆盖基础结构、artifact graph、gate evidence、registry 路径和归档前完整性。

## 人类可审查门禁

| Gate | 作用 |
|---|---|
| `spec_review` | 确认 requirements、design、tasks、边界和验收标准足以进入实现 |
| `code_review` | 确认实现没有偏离已批准的规格、边界和工程规则 |
| `verification` | 通过测试、CI、日志、手工验证或其他证据确认行为 |
| `ssot_sync` | 确认长期项目事实已更新，或明确说明不受影响 |

## 机器检查

`node .specforge/tools/validate-structure.mjs` 当前检查：

- 必要目录和文件。
- workflow schema 可解析，artifact 依赖必须存在。
- workflow schema 不能存在循环依赖。
- artifact output 必须存在模板映射。
- registry 中记录的 path 必须真实存在。
- registry 中 active / archive entry 必须指向对应生命周期目录。
- active change 可以处于未完成状态，但不能有半写入 artifact。
- archived change 必须具备完整 artifact 和 approved gate evidence。

`node .specforge/tools/artifact-graph-status.mjs` 当前检查：

- 读取 `.specforge/schemas/standard.json`。
- 读取 active change 的 `change.yaml`。
- 根据 artifact 依赖和 gate 状态展示 `done` / `ready` / `blocked` / `missing`。

`node .specforge/tools/instructions.mjs` 当前检查：

- 根据当前 active change 自动选择下一个 ready artifact。
- 输出 artifact 的依赖、输出文件、gate、建议规则和模板。
- `apply` 模式检查 `schema.apply.requires`，并解析 tasks 进度。

`node .specforge/tools/gate.mjs` 当前检查：

- gate 必须存在于当前 workflow schema。
- `APPROVED` 必须提供 evidence。
- evidence 必须存在于当前 change 目录下。

`node .specforge/tools/archive-change.mjs` 当前检查：

- `schema.archive.requires` 中的 artifact 必须为 `done`。
- workflow 中所有 artifact 必须完成。
- 归档后更新 `.specforge/registry.yaml`。

`node .specforge/tools/self-test.mjs` 当前检查：

- registry 单 active entry 删除后会归一化为 `active: []`。
- 删除一个 active entry 时不会误删其他 active entry。
- archive entry 追加后可以被 registry parser 正确读取。

`node .specforge/tools/doctor.mjs` 当前检查：

- 顺序运行 selftest、validate、status、artifact graph；如果当前仓库带 `.specforge/skills`，额外运行 validate-skills。
- 任一检查失败则整体失败。
- 用于 Agent 进入仓库、自动推进前和归档前的健康检查。

`node .specforge/tools/validate-skills.mjs` 当前检查：

- 每个 `.specforge/skills/*/SKILL.md` 必须有 frontmatter。
- frontmatter `name` 必须与目录名一致。
- 必须存在 `description`。
- skill 中不允许依赖业务项目 `npm run`；应直接引用 `.specforge/tools` 命令。

`node .specforge/tools/sync-codex-skills.mjs` 当前检查：

- 默认 dry-run，不写入全局目录。
- 默认只选择 `specforge` 和 `specforge-*`。
- `--apply` 时写入完整 `~/.codex/skills/<skill-name>/` 目录，包括 assets。

## 后续增强

| 能力 | 说明 |
|---|---|
| Schema 校验 | 继续补充 JSON Schema 和字段类型校验 |
| Registry 一致性 | 检查 registry entry 和目录双向一致，而不仅是 path 存在 |
| 内容结构校验 | requirements / design / tasks 必须满足最小结构 |
| Gate evidence 校验 | `APPROVED` 不能只看路径存在，还要检查证据内容 |
| Archive 校验 | 归档前自动生成归档摘要和变更索引 |
| 自测扩展 | 将更多纯函数和失败案例纳入 `node .specforge/tools/self-test.mjs` |
| Skill 校验 | 检查根技能和生命周期子技能的必备字段、触发边界和命令映射 |
