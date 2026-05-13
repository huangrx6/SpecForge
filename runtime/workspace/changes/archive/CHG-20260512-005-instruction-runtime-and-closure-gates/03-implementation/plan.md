# 实现计划

## 范围

本阶段实现并验证 SpecForge v0.1 的运行时闭环：

- schema 增加 closure artifact。
- 运行时共享库提供 change/schema/artifact/gate 状态计算。
- 新增 instructions/gate/archive 命令。
- validate 补强 schema 和 registry 约束。
- 用当前 CHG-005 跑完整生命周期。

## 步骤

- [x] 更新 `.specforge/schemas/standard.json`。
- [x] 新增 `.specforge/tools/lib/specforge.mjs`。
- [x] 新增 `.specforge/tools/instructions.mjs`。
- [x] 新增 `.specforge/tools/gate.mjs`。
- [x] 新增 `.specforge/tools/archive-change.mjs`。
- [x] 更新 `package.json` npm scripts。
- [x] 增强 `.specforge/tools/validate-structure.mjs`。
- [ ] 回写项目文档和 ADR。
- [ ] 跑完 CHG-005 的 closure 和 archive。

## 预计变更文件

| Path | Reason |
|---|---|
| `.specforge/schemas/standard.json` | 新增 closure artifact |
| `.specforge/tools/lib/specforge.mjs` | 共享运行时工具库 |
| `.specforge/tools/instructions.mjs` | 生成 Agent 下一步指令 |
| `.specforge/tools/gate.mjs` | 更新 gate 状态 |
| `.specforge/tools/archive-change.mjs` | 归档 active change |
| `.specforge/tools/validate-structure.mjs` | 增强结构校验 |
| `package.json` | 注册新命令 |
