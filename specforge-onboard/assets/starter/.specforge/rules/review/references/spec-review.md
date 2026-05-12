# 规格审查

## 输入

- `00-intake/brief.md`
- `01-spec/requirements.md`
- `01-spec/design.md`
- `01-spec/tasks.md`
- 相关 `.specforge/knowledge/` 长期事实

## 必查项

- 目标、范围、非目标是否清楚。
- 验收标准是否可验证。
- design 是否覆盖关键需求。
- tasks 是否能执行并追溯到 design。
- API、数据、权限、配置、部署影响是否写清。
- 风险和未知项是否被标记。
- 是否需要拆分 change。

## 批准条件

- Agent 可以仅凭 spec 和必要代码上下文开始实现。
- 关键风险已设计处理或明确延后。
- 没有阻断性歧义。

## 典型阻断项

- 需求写成愿望，不可测试。
- design 只是文件列表。
- tasks 没有依赖、边界和证据。
- 规格里混入未决策的方案争议。

## 参考

Kiro 的 specs 也把 requirements、design、tasks 视为推进实现前必须收敛的三层产物。
