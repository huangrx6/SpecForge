---
name: specforge-work
description: SpecForge 一键推进模式；用于用户明确要求“继续做完”“自动推进”“不要停”，但仍必须保留 gate、evidence、verification 和 archive 纪律。
---

# specforge-work

一键推进模式。它不是跳过流程，而是自动循环调用正确的 `specforge-*` 子技能。

## 启动

```bash
node .specforge/tools/doctor.mjs
```

## 关联规则

- `.specforge/rules/artifact-graph.md`：判断 ready artifact。
- `.specforge/rules/gates.md`：不跳过 required gate。
- `.specforge/rules/testing.md`：verification 必须有证据。
- `.specforge/rules/boundaries.md`：不扩大 scope。
- `.specforge/rules/security.md`：高风险变更必须暂停。

## 循环

1. 运行 `node .specforge/tools/instructions.mjs`。
2. 对 ready artifact 调用对应子技能：
   - spec 阶段：`specforge-spec`
   - implementation：`specforge-implement`
   - review：`specforge-review`
   - verification：`specforge-verify`
   - closure：`specforge-close`
3. 每完成一个 gate 或阶段后再次运行 doctor。
4. 所有 artifact done 后归档。

## 必须暂停

- 出现 `[NEEDS CLARIFICATION]`。
- gate 需要用户判断。
- doctor、validate、selftest 失败。
- 变更触及生产发布、安全、权限、数据迁移或高风险外部影响。
- 需要安装依赖、访问网络、执行破坏性命令但未获确认。

## 完成标准

- change 归档。
- `node .specforge/tools/validate-structure.mjs` 通过。
- 最终说明完成了哪些 artifact、哪些 gate、验证结果。

## 不做

- 不为了“自动推进”跳过审查。
- 不隐瞒测试失败或未验证状态。
