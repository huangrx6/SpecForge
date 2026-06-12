# Wiki 同步记录

状态：待判断

## 1. 影响结论

| 项目 | 值 |
|---|---|
| 工作项 | |
| 是否影响长期知识 | 是 / 否 |
| 判断依据 | |
| 可复用事实结论 | 至少 1 项 / N/A - 无长期事实 |
| 来源证据 | requirements / gap_report / ui_design / technical_design / implementation report / verification report |

## 2. 更新文件

| Wiki 文件 | 更新类型 | 写入事实 | 来源 artifact | 状态 |
|---|---|---|---|---|
| `.specforge/wiki/...md` | 新增 / 更新 / 不变 | | | current |

## 3. 回写矩阵

| 来源变化 | 是否长期有效 | 目标 wiki 文件 | 处理方式 | 证据 |
|---|---|---|---|---|
| PRD / requirements 产品规则 | 是 / 否 | `02-product-rules.md` / N/A | 更新 / 不更新 | |
| UI 设计系统 / 风格规则 | 是 / 否 | `design-system.md` / N/A | 更新 / 不更新 | |
| PC 端业务系统 UI 规范 | 是 / 否 | `design-system.md` / N/A | 更新 / 不更新 | |
| 技术架构 / 模块边界 | 是 / 否 | `03-architecture.md` / `module-<name>.md` / N/A | 更新 / 不更新 | |
| API / 事件 / SDK 契约 | 是 / 否 | `api-<domain>.md` / N/A | 更新 / 不更新 | |
| 数据模型 / 迁移注意事项 | 是 / 否 | `04-data-model.md` / N/A | 更新 / 不更新 | |
| 配置 / 启动 / 发布 / 回滚 / 观测 | 是 / 否 | `05-operations.md` / N/A | 更新 / 不更新 | |
| 决策 / 风险 / 技术债 / 术语 | 是 / 否 | `06-decisions.md` / `08-risks.md` / `07-glossary.md` / N/A | 更新 / 不更新 | |

## 4. 不更新原因

> 如果本次不影响 wiki，必须写具体理由，不允许空过。

| 未更新项 | 原因 | 风险 |
|---|---|---|
| | | |

## 5. 契约变化

| 契约 | 变化 | 下游影响 | 是否需要重新验证 |
|---|---|---|---|
| API / 数据 / 权限 / 配置 / UI / 运行 | | | 是 / 否 |

## 6. Wiki 完整度检查

| Wiki 文件 | 最低完整度是否满足 | 缺失项 | 已补扫范围 | 后续补证方式 |
|---|---|---|---|---|
| `03-architecture.md` | 是 / 否 / N/A | 模块边界 / 入口 / 链路 / 集成 / 风险 | | |
| `api-<domain>.md` | 是 / 否 / N/A | 端点 / 请求响应 / 错误 / 鉴权 / 测试 | | |
| `04-data-model.md` | 是 / 否 / N/A | 表字段 / 关系 / 索引 / 状态机 / 迁移 | | |
| `05-operations.md` | 是 / 否 / N/A | env / 启动 / 构建 / 测试 / 部署 / 观测 | | |
| `module-<name>.md` | 是 / 否 / N/A | 职责 / 入口 / 上下游 / 数据 / 测试 | | |

## 7. 后续任务导航检查

| Wiki 文件 | 是否提供入口路径 / 关键符号 | 是否提供上游 / 下游 | 是否提供测试 / 运行入口 | 推荐检索词 | 缺口 |
|---|---|---|---|---|---|
| `.specforge/wiki/...md` | 是 / 否 / N/A | 是 / 否 / N/A | 是 / 否 / N/A | | |

## 8. Current 文件对账

| 检查项 | 结果 | 备注 |
|---|---|---|
| 同一知识项只有一个 current 文件 | 是 / 否 | |
| 未创建日期版 / v2 版 / work item 版 wiki | 是 / 否 | |
| 旧事实已更新为当前事实或保留必要决策背景 | 是 / 否 / N/A | |
| 新增按需文件命名见名知意 | 是 / 否 / N/A | |

## 9. Index 对账

| 检查项 | 结果 | 备注 |
|---|---|---|
| `.specforge/wiki/00-index.md` 已更新摘要 | 是 / 否 / N/A | |
| 新增 wiki 文件已加入索引 | 是 / 否 / N/A | |
| 同一知识项只有一个 current 文件 | 是 / 否 | |
| 所有更新文件 frontmatter 完整 | 是 / 否 | |

## 10. 派生报告索引

| 产物 | 路径 / 链接 | 来源 artifact | 是否回写 wiki | 理由 |
|---|---|---|---|---|
| HTML / chart / dashboard / screenshot report | | | yes / no | |

## 11. Gate 更新

APPROVED 时执行：

```bash
node .specforge/core/scripts/gate.mjs wiki_sync APPROVED --evidence 06-close/wiki-sync.md
```

REQUEST_CHANGES 时执行：

```bash
node .specforge/core/scripts/gate.mjs wiki_sync REQUEST_CHANGES
```
