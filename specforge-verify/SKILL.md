---
name: specforge-verify
description: 执行 SpecForge verification 阶段；用于 code_review 已通过，需要运行测试、记录证据并批准 verification gate 时。
---

# specforge-verify

执行验证并留下证据。没有证据，不批准 verification。

## 启动

```bash
node .specforge/tools/create-artifact.mjs verification
```

## 关联规则

- `.specforge/rules/testing.md`：验证深度匹配风险。
- `.specforge/rules/gates.md`：verification evidence。
- `.specforge/rules/boundaries.md`：验证下游影响。
- `.specforge/rules/security.md`：安全敏感变更需要额外检查。

## 动作

1. 从 design 和 tasks 里提取验证策略。
2. 选择测试、构建、lint、手工验证或日志证据。
3. 运行命令并记录结果。
4. 写入：
   - `05-verification/report.md`
   - `05-verification/ci-result.md`
5. 验证通过后：

```bash
node .specforge/tools/gate.mjs verification APPROVED --evidence 05-verification/report.md
```

## 报告必须包含

- 验证范围。
- 具体命令。
- 输出摘要。
- 通过 / 失败结论。
- 已知缺口。
- 重新验证触发条件。

## 完成标准

- 验证命令、结果、证据和缺口清楚。
- verification gate 为 `APPROVED`。
- 下一步路由到 `specforge-close`。

## 不做

- 不用“未运行测试”批准 verification。
- 失败时不归档；回到 implementation 或 review。
