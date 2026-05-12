# ADR-0006: 运行时指令、Gate 更新和归档命令

## 状态

Accepted

## 背景

SpecForge 早期 v0.1 已经具备目录结构、规则、模板和 artifact graph，但它仍然偏静态。Agent 需要自己阅读多个文件后判断下一步，gate 状态也容易被手工编辑出不一致。

对标 OpenSpec、cc-sdd 等实现后，SpecForge 需要至少具备一个轻量运行时：能根据当前 change 生成下一步指令，能安全更新 gate，能在归档前检查完整性。

## 决策

新增三类命令：

- `node .specforge/tools/instructions.mjs`：读取 workflow schema、change.yaml 和 artifact 文件状态，输出下一步 artifact 指令。
- `node .specforge/tools/gate.mjs`：更新 gate 状态，`APPROVED` 时强制校验证据文件存在。
- `node .specforge/tools/archive-change.mjs`：检查 archive 依赖和完整 artifact 后，将 active change 移入 archive，并更新 registry。

同时将 `closure` 作为 `standard` workflow 的显式 artifact，输出 `release.md` 和 `rollback.md`。归档不再只依赖验证和 SSoT，同样要求关闭记录存在。

## 后果

- Agent 不再只能靠人工读目录判断下一步，可以调用 `instructions` 获取当前执行上下文。
- Gate 状态更新从手工编辑变成命令化操作。
- 归档前会被 workflow 状态阻挡，减少未收口变更进入 archive 的风险。
- v0.1 继续保持零第三方依赖，因此 YAML 解析仍是轻量文本解析；后续如果状态结构变复杂，需要引入更严格的 parser。
