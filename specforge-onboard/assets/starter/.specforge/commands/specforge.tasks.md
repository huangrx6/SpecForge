# specforge.tasks

根据已批准 requirements 和 design 生成或细化实现任务。

## 读取

- `01-spec/requirements.md`
- `01-spec/design.md`
- `.specforge/rules/boundaries.md`
- `.specforge/rules/testing.md`

## 写入

- `01-spec/tasks.md`

## 规则

- 一个任务应有一个清晰边界。
- 并行任务不能共享写入 owner。
- 测试或验证工作必须显式写出。
