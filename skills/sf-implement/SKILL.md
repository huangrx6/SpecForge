---
name: sf-implement
description: 根据已批准的 SpecForge tasks 执行实现；用于 spec_review 已通过且 active work item 进入 implementation 阶段时。
---

# sf-implement

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

按照已批准 tasks 实现代码，并留下 implementation evidence。实现 UI 前读 `ui-design.md`，实现技术变更前读 `technical-design.md`。本技能不批准自己的 code_review gate。

## 启动

运行：

```bash
node .specforge/execution/tools/instructions.mjs -- apply
```

如果 implementation 不是 ready，按 `instructions.mjs` 的 ready artifact 回到对应的 `sf-*` 子技能。

生成实现产物：

```bash
node .specforge/execution/tools/create-artifact.mjs implementation
```

## 内部技能母本

开始实现前，读取 `.specforge/execution/stages/implementation/SKILL.md`。实现阶段的输入、写入、停止条件和完成标准以内置母本为准。

## 关联规则

- `.specforge/policy/rules/engineering/README.md`：沿用项目模式，不发明无依据抽象。
- `.specforge/policy/rules/boundaries/README.md`：只改批准范围内文件。
- `.specforge/policy/rules/api-design/README.md`：保持 API、SDK、事件契约一致；按需读取 `references/`。
- `.specforge/policy/rules/security/README.md`：敏感内容、凭据、权限相关检查。
- `.specforge/policy/rules/testing/README.md`：实现时同步考虑验证。
- `.specforge/policy/rules/delivery/README.md`：配置、运行和回滚影响。
- `.specforge/policy/rules/context/README.md`：不要加载无关历史。

## 动作

1. 读取 `01-spec/tasks.md`，按任务顺序执行。
2. 每次编辑前确认文件在 `ui-design.md` 或 `technical-design.md` 的允许范围内。
3. 修改代码后更新：
   - `03-implementation/plan.md`
   - `03-implementation/report.md`
   - `03-implementation/changed-files.md`
4. 勾选已完成 tasks；未完成项必须写原因。

## 实现报告必须包含

- 实际变更摘要。
- 变更文件和原因。
- 与 requirements、适用的 ui_design / technical_design、tasks 的对应关系。
- 本阶段已运行的快速验证。
- 已知缺口和需要 code review 重点看的地方。

## 完成标准

- tasks 中实现项完成或明确剩余项。
- changed-files 记录真实变更范围。
- 下一步路由到 `sf-code-review` 做 code review。

## 不做

- 不批准 code_review gate。
- 不扩大到未写入 `ui-design.md` 或 `technical-design.md` 的范围。
- 不修顺手看到的无关问题；需要时新开 work item。
