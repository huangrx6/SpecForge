# 验证报告

## 范围

验证本次新增运行时命令、schema 变更、gate 更新和结构校验是否可用，并确认既有归档记录未被破坏。

## 命令

- `node .specforge/tools/validate-structure.mjs`
- `node .specforge/tools/artifact-graph-status.mjs`
- `node .specforge/tools/instructions.mjs`
- `node .specforge/tools/instructions.mjs -- verification --json`
- `node .specforge/tools/gate.mjs spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md`
- `node .specforge/tools/gate.mjs code_review APPROVED --evidence 04-code-review/code-review-v1.md`
- `node .specforge/tools/instructions.mjs -- apply`

## 结果

- `node .specforge/tools/validate-structure.mjs` 通过，检查 95 个 required paths、workflow schema、registry paths 和 change evidence。
- `node .specforge/tools/artifact-graph-status.mjs` 能展示 CHG-005 的 artifact 图，当前 verification 处于 ready 状态。
- `node .specforge/tools/instructions.mjs` 能基于 active change 找到下一步 artifact。
- `node .specforge/tools/instructions.mjs -- apply` 能读取 tasks 并输出 7/11 完成。
- spec_review 和 code_review gate 均已通过 `gate` 命令批准。

## 边界检查

- 未引入第三方依赖。
- 未移动旧 archive change。
- 未手工修改已归档历史内容。
- Gate evidence 均指向当前 change 内真实存在文件。

## 重新验证触发条件

- 修改 `.specforge/schemas/standard.json`。
- 修改 `.specforge/tools/lib/specforge.mjs` 的 artifact 状态计算逻辑。
- 修改 gate 或 archive 命令。
- 修改 registry 结构。

## Evidence

- `05-verification/ci-result.md`
- `02-spec-review/spec-review-v1.md`
- `04-code-review/code-review-v1.md`

## 已知缺口

- 目前还没有单元测试框架，验证依赖脚本级集成命令。
- YAML 解析仍然是轻量文本解析，复杂 YAML 特性不在 v0.1 范围内。
