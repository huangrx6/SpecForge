# specforge.doctor

检查 SpecForge 仓库是否处于可继续工作的健康状态。

## 本地命令

```bash
node .specforge/tools/doctor.mjs
```

## 聚合检查

- `selftest`：轻量自测。
- `validate`：结构、schema、registry、gate evidence。
- `status`：active/archive change 状态。
- `graph:status`：当前 active 或最新 archive 的 artifact graph。

## 使用时机

- Agent 刚进入仓库。
- 用户问“现在到哪一步了”。
- 一键推进前。
- 归档前。

## 停止条件

任一检查失败时，先修复健康问题，不继续执行 implementation。
