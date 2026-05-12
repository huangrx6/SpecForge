# ADR-0007: AI 根技能入口和子技能拆分

## 状态

Accepted

## 背景

SpecForge 已具备 artifact graph、runtime instructions、gate 更新、归档和自测命令。但如果只提供目录和命令，用户仍然需要记住很多细节，AI Agent 也容易一次性读取过多规则。

参考 CodeStable `cs`、GitHub Spec Kit 的 skills / slash commands、oh-my-opencode 的 ultrawork 后，SpecForge 需要一个面向 AI 的入口层。

## 决策

采用三层结构：

- 根技能 `specforge`：只扫描和路由。
- 子技能 `specforge-*`：执行具体生命周期阶段。
- runtime 命令：承担确定性文件操作和状态检查。

根技能每次只推荐一个子技能，不直接写完整产物。一键模式由 `specforge-work` 承担，但必须保留 gate、verification、SSoT sync 和 archive。

## 后果

- 用户可以只说“specforge”或“继续”，由根技能判断下一步。
- 子技能保持短小，避免一个巨型 prompt。
- 命令和技能有清晰映射，后续可适配 Codex Skills、Claude slash commands 和 OpenCode commands。
- 后续需要补充 skill 校验，避免技能文档和 runtime 命令漂移。
