# 自动推进和门禁策略

本参考约束 `specforge-work` 与自动化推进。

## 自动推进前

- 先运行 doctor / status。
- 明确当前 active work item。
- 明确当前 ready artifact。

## 自动推进中

- 每个 gate 独立生成 evidence。
- 遇到高风险项必须停止。
- 遇到测试、外部命令、环境依赖不可用，必须记录阻断原因和替代证据。
- 不得因为用户说“继续”而跳过 required gate。

## 高风险暂停条件

- 权限与认证。
- 数据迁移。
- 生产配置。
- 依赖升级。
- 公共契约破坏兼容。
- 关键测试失败。

## 自动化和 Artifact Graph

自动推进应该遵循：

1. artifact graph 判断 ready。
2. instructions 生成当前行动上下文。
3. artifact 完成后重新算图。
4. gate 通过后再解锁下游。

这与 OpenSpec 的 artifact-guided 方式一致，但 SpecForge 额外保留显式 gate，以降低长链自动化的误放行风险。
