# MySQL Relational Database

## 适用 / 不适用

适用：

- 团队和生产体系已经围绕 MySQL 建设。
- 典型 OLTP、事务、唯一约束、列表查询、报表轻聚合。
- 需要成熟主从、备份、运维和云托管生态。

不适用：

- 单机嵌入式应用，优先看 `database/embedded-sqlite`。
- 需要 PostgreSQL 特有能力，如 JSONB 高级索引、复杂扩展或地理空间生态时，优先看 PostgreSQL。

## 默认规则

| 能力 | 默认建议 | 说明 |
|---|---|---|
| 引擎 | InnoDB | 不使用 MyISAM |
| 字符集 | utf8mb4 | collation 跟随项目基线 |
| 主键 | BIGINT auto increment 或分布式 ID | 高并发写入要评估热点 |
| 时间 | datetime / timestamp + 明确时区策略 | 禁止混用无说明 |
| 迁移 | Flyway / Liquibase / Alembic / ORM migration | 必须版本化 |
| 删除 | 软删除或硬删除策略明确 | 唯一约束需考虑软删除 |

## 设计必填

- 表关系、主键、唯一约束、索引和删除策略是什么？
- 高频查询、分页、排序、模糊搜索如何支持？
- 是否有大表 DDL、回填、在线索引或锁表风险？
- 事务边界是否包含外部调用？
- 备份恢复、慢查询、连接池和权限如何验证？

## 验证

- migration dry-run / rollback 或补偿方案。
- 高频查询 explain、唯一约束、权限和负向写入。
- 大表变更需说明在线迁移或低峰窗口。
