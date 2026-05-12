# SpecForge Agent 入口

这是本仓库的权威 AI Agent 入口。SpecForge 的项目级资产全部收敛在 `.specforge/` 下。

## 加载顺序

1. 读取 `.specforge/attention.md`，获取项目级常驻注意事项。
2. 读取 `.specforge/manifest.yaml`，确认路径、workflow 和 gate 策略。
3. 读取 `.specforge/registry.yaml`，判断是否存在 active change。
4. 如果有 active change，先读它的 `change.yaml`。
5. 读取 `.specforge/rules/index.md`，只加载当前任务需要的规则。
6. 只加载当前任务需要的 workflow、command card、template 和 reference。

## 推荐 AI 入口

当用户没有明确指定阶段时，优先使用全局 `specforge` 技能作为根入口。根入口只负责扫描和路由，实际执行交给 `specforge-*` 子技能。

常用运行时命令：

```bash
node .specforge/tools/doctor.mjs
node .specforge/tools/instructions.mjs
node .specforge/tools/create-change.mjs "Change title"
node .specforge/tools/create-artifact.mjs <artifact-id>
node .specforge/tools/gate.mjs <gate> APPROVED --evidence <path>
node .specforge/tools/archive-change.mjs
```

## 硬性规则

- 不跳过 required gate。
- 除非用户明确要求修正历史，否则不编辑 archived change。
- 不把 SpecForge 项目资产散落到根目录、`specs/` 或其他目录。
- 业务代码仍放在项目自己的源码目录，不放进 `.specforge/`。
- 不把每个请求都套成重规格流程；先用 discovery 按规模和风险路由。
- 边界不清楚时不要实现，必须用 `[NEEDS CLARIFICATION: question]` 标记。
- 关闭 change 前必须完成 `06-closure/ssot-sync.md`。

## 目录边界

| 目录 | 用途 |
|---|---|
| `.specforge/rules` | 稳定规则 |
| `.specforge/templates` | 阶段产物模板 |
| `.specforge/tools` | 初始化后可直接运行的本地命令 |
| `.specforge/project` | 长期项目 SSoT |
| `.specforge/changes` | inbox、active、archive change |
| `.specforge/reference` | 使用说明和参考资料 |

## Artifact Graph

标准流程由 `.specforge/schemas/standard.json` 声明。查看当前产物状态：

```bash
node .specforge/tools/artifact-graph-status.mjs
```

查看下一步指令：

```bash
node .specforge/tools/instructions.mjs
```
