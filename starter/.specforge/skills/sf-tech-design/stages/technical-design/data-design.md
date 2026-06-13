# Data Design — 数据设计子模块

本子模块是 `sf-tech-design` 的内部参考，**只在本次 work item 涉及数据库 Schema、索引、迁移或数据流变更时读取**。

## 何时读取

- 新增或修改数据库表 / Collection / 文档结构。
- 变更索引策略（新增、删除、复合索引）。
- 需要数据迁移（结构变更、字段重命名、数据转换）。
- 引入新的存储介质（缓存、对象存储、搜索引擎）。
- 变更数据访问模式（读写比例、查询模式、分页策略）。

## 必读 Profile

涉及持久化时，先读取 `.specforge/core/profiles/README.md` 的数据库选择矩阵，再按实际候选读取：

- `.specforge/core/profiles/database/rdbms-postgresql.md`
- `.specforge/core/profiles/database/rdbms-mysql.md`
- `.specforge/core/profiles/database/embedded-sqlite.md`

如果使用 MongoDB、Redis、对象存储、搜索引擎或其他存储，但当前没有对应 profile，technical design 必须写入 `Profile Deviations`：为什么不适用现有 profile、风险是什么、如何验证。

## 数据设计要求

### Schema 设计

- 字段命名统一风格（`snake_case` 或 `camelCase`，项目内一致）。
- 每个字段必须定义：数据类型、是否可空、默认值、约束（唯一、外键、检查约束）。
- 软删除（`deleted_at`）vs 硬删除：全局策略必须一致。
- 时间戳字段规范：`created_at`、`updated_at`，时区统一（建议 UTC）。
- 每张表 / Collection 必须说明 source of truth、数据 owner、生命周期、保留期和隐私等级。
- 派生数据必须说明来源、刷新策略、过期语义和与源数据不一致时的处理。

### 索引策略

- 为高频查询条件（WHERE、JOIN、ORDER BY）建索引。
- 避免过度索引：每增加一个索引，写入性能下降，需权衡。
- 复合索引字段顺序遵循最左前缀原则。
- 唯一索引 vs 唯一约束：二者区别和选择理由。

### 数据迁移

- 迁移必须**向前兼容**：新列先允许 NULL 或有默认值，再回填，再加约束。
- 迁移脚本必须有对应的**回滚脚本**（down migration）。
- 大表迁移（如加列、加索引）需评估锁表风险，考虑在线迁移工具（`gh-ost`、`pg_repack`）。
- 估算受影响行数和迁移时间窗口。
- 写清迁移顺序：schema expand、代码兼容、数据回填、约束收紧、旧字段清理。
- 写清迁移观察点：迁移耗时、错误数、锁等待、回填进度、回滚触发条件。

### 多存储介质

- **缓存**（Redis / Memcached）：缓存什么、TTL、失效策略、穿透 / 雪崩 / 击穿防护。
- **对象存储**（S3 / OSS）：文件命名规范、访问控制、生命周期策略。
- **搜索引擎**（Elasticsearch / Meilisearch）：索引结构、同步策略（同步 / 异步 / CDC）。

### 数据一致性

- 明确强一致性 vs 最终一致性边界。
- 跨表 / 跨服务事务：分布式事务 vs 补偿事务（Saga）vs 最终一致性。

## 必含产出（写入 technical-design.md 对应章节）

- 新增 / 修改表的字段清单（字段名、类型、约束、说明）。
- 新增 / 修改索引列表（索引名、字段、类型、目的）。
- 选定数据库 profile，以及未选择 PostgreSQL / MySQL / SQLite 的理由（按相关性说明）。
- 数据迁移方案和回滚脚本描述（有迁移时）。
- 多存储介质方案（如涉及）。
- 数据 owner、source of truth、retention / privacy、migration sequence、observability 和 rollback trigger。

## 停止条件

- 领域模型（domain-design）尚未确定，无法决定 Schema 结构。
- 大表迁移的锁表风险未评估且无法在维护窗口内完成。
- 数据量级不明，无法评估索引和查询性能。
- 数据 owner、源数据、保留期或回滚触发条件不清，且会影响生产数据安全。
