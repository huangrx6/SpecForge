---
name: specforge-close
description: 完成 SpecForge 关闭阶段；用于 verification 已通过，需要 SSoT sync、release、rollback 和 archive 时。
---

# specforge-close

关闭 change：同步长期知识、写发布和回滚记录、归档。它是防止文档过期的最后一道门。

## 关联规则

- `.specforge/rules/gates/README.md`：SSoT sync 和 archive 前置。
- `.specforge/rules/engineering/README.md`：长期项目知识必须回流。
- `.specforge/rules/boundaries/README.md`：契约变化和下游重新验证。
- `.specforge/rules/delivery/README.md`：release、rollback 和上线准备。
- `.specforge/rules/localization.md`：关闭记录优先中文。

## 动作

1. 生成 SSoT sync：

```bash
node .specforge/tools/create-artifact.mjs ssot_sync
```

2. 判断是否影响 `.specforge/knowledge/`：
   - 功能状态。
   - API / 数据模型。
   - 架构现状。
   - 安全模型。
   - 部署方式。
   - ADR / 长期决策。
3. 回写受影响的 knowledge 长期事实，或明确说明不更新原因。
4. 批准 SSoT gate：

```bash
node .specforge/tools/gate.mjs ssot_sync APPROVED --evidence 06-closure/ssot-sync.md
```

5. 生成 closure：

```bash
node .specforge/tools/create-artifact.mjs closure
```

6. 写 `release.md` 和 `rollback.md`。
7. 归档前检查：

```bash
node .specforge/tools/doctor.mjs
```

8. 归档：

```bash
node .specforge/tools/archive-change.mjs
```

## 完成标准

- `ssot-sync.md`、`release.md`、`rollback.md` 都存在。
- ssot_sync gate 为 `APPROVED`。
- archive 成功。
- `node .specforge/tools/validate-structure.mjs` 通过。

## 不做

- 不在 SSoT 未同步时 archive。
- 不把动态 change 内容复制进规则目录。
