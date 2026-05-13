---
name: sf-close
description: 完成 SpecForge 关闭阶段；用于 verification 已通过，需要 SSoT sync、release、rollback 和 archive 时。
---

# sf-close

关闭 change：同步长期知识、写发布和回滚记录、归档。它是防止文档过期的最后一道门。

## 内部技能母本

- SSoT 同步前读取 `.specforge/execution/stages/ssot-sync/SKILL.md`。
- 涉及长期方向、项目约束或维护者规则时读取 `.specforge/execution/stages/steering/SKILL.md`。
- closure 的长期知识判断和完成标准以内置母本为准。

## 关联规则

- `.specforge/policy/rules/gates/README.md`：SSoT sync 和 archive 前置。
- `.specforge/policy/rules/engineering/README.md`：长期项目知识必须回流。
- `.specforge/policy/rules/boundaries/README.md`：契约变化和下游重新验证。
- `.specforge/policy/rules/delivery/README.md`：release、rollback 和上线准备。
- `.specforge/policy/rules/localization.md`：关闭记录优先中文。

## 动作

1. 生成 SSoT sync：

```bash
node .specforge/execution/tools/create-artifact.mjs ssot_sync
```

2. 判断是否影响 `.specforge/workspace/knowledge/`：
   - 功能状态。
   - API / 数据模型。
   - 架构现状。
   - 安全模型。
   - 部署方式。
   - ADR / 长期决策。
3. 回写受影响的 knowledge 长期事实，或明确说明不更新原因。
4. 批准 SSoT gate：

```bash
node .specforge/execution/tools/gate.mjs ssot_sync APPROVED --evidence 06-closure/ssot-sync.md
```

5. 生成 closure：

```bash
node .specforge/execution/tools/create-artifact.mjs closure
```

6. 写 `release.md` 和 `rollback.md`。
7. 如果当前仓库是 SpecForge 本体，且本次 change 修改了 `runtime/execution/stages/**` 或 `skills/sf*/SKILL.md`，归档前同步已安装技能副本并把结果写入 closure evidence：

```bash
node cli/specforge.mjs skill add --target all --apply --prune-legacy
```

8. 归档前检查：

```bash
node .specforge/execution/tools/doctor.mjs
```

9. 归档：

```bash
node .specforge/execution/tools/archive-change.mjs
```

## 完成标准

- `ssot-sync.md`、`release.md`、`rollback.md` 都存在。
- ssot_sync gate 为 `APPROVED`。
- archive 成功。
- `node .specforge/execution/tools/validate-structure.mjs` 通过。

## 不做

- 不在 SSoT 未同步时 archive。
- 不把动态 change 内容复制进规则目录。
