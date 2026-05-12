# 变更文件

| File | Reason |
|---|---|
| `.specforge/schemas/standard.json` | 新增 closure artifact，并把 archive 依赖扩展到 closure |
| `.specforge/tools/lib/specforge.mjs` | 新增共享运行时工具库 |
| `.specforge/tools/instructions.mjs` | 新增 Agent 下一步指令生成命令 |
| `.specforge/tools/gate.mjs` | 新增 gate 状态更新命令 |
| `.specforge/tools/archive-change.mjs` | 新增 active change 归档命令 |
| `.specforge/tools/validate-structure.mjs` | 增强 schema、模板、registry、change 生命周期校验 |
| `package.json` | 注册 `instructions`、`gate`、`archive` npm scripts |
| `.specforge/changes/active/CHG-20260512-005-*` | 自举实践记录 |
