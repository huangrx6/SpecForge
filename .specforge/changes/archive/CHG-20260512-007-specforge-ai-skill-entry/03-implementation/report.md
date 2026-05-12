# 实现报告

## 摘要

已完成 SpecForge AI 使用入口层第一版：

- 新增 `specforge` 根技能，采用类似 `cs` 的“扫描 + 路由”模式。
- 新增 9 个 `specforge-*` 子技能，覆盖初始化、intake、spec、实现、审查、验证、关闭、健康检查和一键推进。
- 新增 `doctor` 命令，聚合 selftest、validate、status、artifact graph。
- 新增 AI 使用说明，明确严格分阶段模式和一键推进模式。
- 将新增技能、命令、ADR、文档纳入 `validate` required paths。

## 变更内容

- AI 进入项目后可以先运行 `node .specforge/tools/doctor.mjs`，再由根技能判断下一步。
- 根技能不写产物，避免成为巨型 prompt。
- 子技能只处理单一阶段，内部调用 runtime 命令。
- `specforge-work` 支持自动推进，但必须保留 gate、verification、SSoT sync 和 archive。

## 审查提示

- 重点审查根技能是否保持“只路由，不做事”。
- 重点审查一键模式是否明确不能绕过 gate。
- 重点审查 validate 是否覆盖新增关键文件。
