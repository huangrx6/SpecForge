---
name: specforge-implement
description: 根据已批准的 SpecForge tasks 执行实现；用于 spec_review 已通过且 active change 进入 implementation 阶段时。
---

# specforge-implement

按照已批准 tasks 实现代码，并留下 implementation evidence。本技能不批准自己的 code_review gate。

## 启动

运行：

```bash
node .specforge/tools/instructions.mjs -- apply
```

如果 implementation 不是 ready，回到 `specforge-spec` 或 `specforge-review`。

生成实现产物：

```bash
node .specforge/tools/create-artifact.mjs implementation
```

## 关联规则

- `.specforge/rules/engineering.md`：沿用项目模式，不发明无依据抽象。
- `.specforge/rules/boundaries.md`：只改批准范围内文件。
- `.specforge/rules/security.md`：敏感内容、凭据、权限相关检查。
- `.specforge/rules/testing.md`：实现时同步考虑验证。
- `.specforge/rules/context.md`：不要加载无关历史。

## 动作

1. 读取 `01-spec/tasks.md`，按任务顺序执行。
2. 每次编辑前确认文件在 design 的允许范围内。
3. 修改代码后更新：
   - `03-implementation/plan.md`
   - `03-implementation/report.md`
   - `03-implementation/changed-files.md`
4. 勾选已完成 tasks；未完成项必须写原因。

## 实现报告必须包含

- 实际变更摘要。
- 变更文件和原因。
- 与 requirements/design/tasks 的对应关系。
- 本阶段已运行的快速验证。
- 已知缺口和需要 code review 重点看的地方。

## 完成标准

- tasks 中实现项完成或明确剩余项。
- changed-files 记录真实变更范围。
- 下一步路由到 `specforge-review` 做 code review。

## 不做

- 不批准 code_review gate。
- 不扩大到未写入 design 的范围。
- 不修顺手看到的无关问题；需要时新开 change。
