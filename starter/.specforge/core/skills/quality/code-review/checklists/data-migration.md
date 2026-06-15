# Data / Migration Checklist

| 检查项 | Fail signal |
| --- | --- |
| schema 变更 | migration 缺失、字段类型不兼容、默认值危险 |
| 回填 | 历史数据没有处理策略 |
| 索引 | 新查询缺索引或索引影响未说明 |
| 回滚 | migration 不可回滚且风险未记录 |
| 数据保留 | 删除 / 覆盖数据缺少确认和审计 |
| 兼容部署 | 代码和数据库变更不能安全滚动发布 |
| 验证 | 缺少 migration dry-run、集成测试或数据检查 |
