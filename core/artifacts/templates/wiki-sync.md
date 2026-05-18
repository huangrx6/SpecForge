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

## 3. 不更新原因

> 如果本次不影响 wiki，必须写具体理由，不允许空过。

| 未更新项 | 原因 | 风险 |
|---|---|---|
| | | |

## 4. 契约变化

| 契约 | 变化 | 下游影响 | 是否需要重新验证 |
|---|---|---|---|
| API / 数据 / 权限 / 配置 / UI / 运行 | | | 是 / 否 |

## 5. Index 对账

| 检查项 | 结果 | 备注 |
|---|---|---|
| `.specforge/wiki/index.md` 已更新摘要 | 是 / 否 / N/A | |
| 新增 wiki 文件已加入索引 | 是 / 否 / N/A | |
| 同一知识项只有一个 current 文件 | 是 / 否 | |
| 所有更新文件 frontmatter 完整 | 是 / 否 | |

## 6. Gate 更新

APPROVED 时执行：

```bash
node .specforge/core/scripts/gate.mjs wiki_sync APPROVED --evidence 06-close/wiki-sync.md
```

REQUEST_CHANGES 时执行：

```bash
node .specforge/core/scripts/gate.mjs wiki_sync REQUEST_CHANGES
```
