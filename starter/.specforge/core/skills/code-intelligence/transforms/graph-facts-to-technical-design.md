# Graph Facts 到技术设计

## 写入位置

| Graph fact | 技术设计位置 |
|---|---|
| entry / module | 影响面与读取计划、Architecture Contract |
| call / dependency | Impact Analysis、Affected Modules |
| api / data / operation | 对应 API / data / runtime 设计章节 |
| test | Affected Tests、验证策略 |
| risk | ADR、风险与回滚 |

## 规则

- Technical design 只能引用已归一化事实，不粘贴 provider 原文。
- 每个关键影响面必须写来源：Wiki、`GF-*`、source path 或测试。
- graph facts 与 requirements 冲突时，暂停并回到用户确认或 requirements 修订。
- affected tests 进入 implementation handoff 和 task verification。
