# Wiki 同步

## 0. Wiki 同步控制
| 项 | 内容 |
| --- | --- |
| `wiki-update-plan` 命令 | |
| Wiki 状态 | missing / bootstrap / partial / current |
| 是否允许不回写 | yes / no |
| Wiki 同步结论 | updated / N/A / blocked |
| 阻断原因 | |

> 若 `wiki-update-plan` 输出 `can_write_na=false`，本文件不得写成 “N/A - 无长期事实”。

## 1. 长期事实候选矩阵
| 候选事实 | 类型 | 来源 | 目标 Wiki | 置信度 | 处理 |
| --- | --- | --- | --- | --- | --- |
| | product / architecture / api / data / operations / design / risk / glossary | | | 已确认 / 可能 / 不清楚 | 写入 / 延后 / 拒绝 |

## 2. 必须更新的 Wiki 目标
| 目标文件 | 必填原因 | 来源证据 | 状态 |
| --- | --- | --- | --- |
| | | | 已更新 / 阻断 |

## 3. 已更新文件
| 文件 | 更新内容 | 来源证据 | 后续复用价值 |
| --- | --- | --- | --- |
| | | | |

## 4. 不回写决策
| 候选项 | 不回写理由 | 未来触发条件 |
| --- | --- | --- |
| | | |

## 5. 未确认项 / 风险
| 缺口 | 影响 | 已查证据 | 后续补证路径 |
| --- | --- | --- | --- |
| | | | |

## 6. 历史 / 未受信产物
| 产物 | 不作为当前事实的原因 | 记录位置 |
| --- | --- | --- |
| | 未被 runtime / migration / tests / CI / 用户确认引用 | `04-data-model.md#历史--未受信-sql-产物` / `08-risks.md` |

## 7. 索引同步
| 项 | 内容 |
| --- | --- |
| `00-index.md` 是否更新 | yes / no |
| 新增 current 文件 | |
| 重命名 / 合并文件 | |
| 未同步原因 | |

## 8. 质量检查结果
| 命令 | 结果 | 必须处理的 FAIL / WARN |
| --- | --- | --- |
| `node .specforge/core/scripts/wiki-quality.mjs --mode close` | | |

## 派生报告索引
| 类型 | 路径 / 链接 | 用途 |
| --- | --- | --- |
| | | |

## 9. Gate 更新
- Gate：
- 证据：
- 后续维护人：
