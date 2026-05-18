# Wiki 同步记录

状态：待判断

## 1. 影响结论

| 项目 | 值 |
|---|---|
| 工作项 | |
| 是否影响长期知识 | 是 / 否 |
| 判断依据 | |
| 来源证据 | requirements / gap_report / ui_design / technical_design / implementation report / verification report |

## 2. 更新文件

| Wiki 文件 | 更新类型 | 写入事实 | 来源 artifact | 状态 |
|---|---|---|---|---|
| `.specforge/wiki/...md` | 新增 / 更新 / 不变 | | | current |

## 3. 回写矩阵

| 来源变化 | 是否长期有效 | 目标 wiki 文件 | 处理方式 | 证据 |
|---|---|---|---|---|
| PRD / requirements 产品规则 | 是 / 否 | `product-rules.md` / N/A | 更新 / 不更新 | |
| UI 设计系统 / 风格规则 | 是 / 否 | `design-system.md` / N/A | 更新 / 不更新 | |
| 技术架构 / 模块边界 | 是 / 否 | `architecture.md` / `module-<name>.md` / N/A | 更新 / 不更新 | |
| API / 事件 / SDK 契约 | 是 / 否 | `api-<domain>.md` / N/A | 更新 / 不更新 | |
| 数据模型 / 迁移注意事项 | 是 / 否 | `data-model.md` / N/A | 更新 / 不更新 | |
| 配置 / 启动 / 发布 / 回滚 / 观测 | 是 / 否 | `operations.md` / N/A | 更新 / 不更新 | |
| 决策 / 风险 / 技术债 / 术语 | 是 / 否 | `decisions.md` / `risks.md` / `glossary.md` / N/A | 更新 / 不更新 | |

## 4. 不更新原因

> 如果本次不影响 wiki，必须写具体理由，不允许空过。

| 未更新项 | 原因 | 风险 |
|---|---|---|
| | | |

## 5. 契约变化

| 契约 | 变化 | 下游影响 | 是否需要重新验证 |
|---|---|---|---|
| API / 数据 / 权限 / 配置 / UI / 运行 | | | 是 / 否 |

## 6. Current 文件对账

| 检查项 | 结果 | 备注 |
|---|---|---|
| 同一知识项只有一个 current 文件 | 是 / 否 | |
| 未创建日期版 / v2 版 / work item 版 wiki | 是 / 否 | |
| 旧事实已更新为当前事实或保留必要决策背景 | 是 / 否 / N/A | |
| 新增按需文件命名见名知意 | 是 / 否 / N/A | |

## 7. Index 对账

| 检查项 | 结果 | 备注 |
|---|---|---|
| `.specforge/wiki/index.md` 已更新摘要 | 是 / 否 / N/A | |
| 新增 wiki 文件已加入索引 | 是 / 否 / N/A | |
| 同一知识项只有一个 current 文件 | 是 / 否 | |
| 所有更新文件 frontmatter 完整 | 是 / 否 | |

## 8. Gate 更新

APPROVED 时执行：

```bash
node .specforge/core/scripts/gate.mjs wiki_sync APPROVED --evidence 06-close/wiki-sync.md
```

REQUEST_CHANGES 时执行：

```bash
node .specforge/core/scripts/gate.mjs wiki_sync REQUEST_CHANGES
```
