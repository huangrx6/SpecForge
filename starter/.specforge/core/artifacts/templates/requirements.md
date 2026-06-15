# Requirements

## 一页摘要
| 项 | 内容 |
| --- | --- |
| 目标 | |
| 行为边界 | |
| 最高风险 | |
| 验收方式 | |

## 0. Requirements Control
| 项 | 内容 |
| --- | --- |
| Source artifacts | |
| Confirmation policy | `user-confirmed` / `delegated-default` / existing contract only for MUST |
| Requirement language | RFC 2119 + EARS where useful |
| Output profile | compact / standard / full |
| Package references used | |

## 0.1 Spec Quality Gate
| 检查项 | 结论 | 证据 |
| --- | --- | --- |
| 来源清晰 | | |
| 确认边界正确 | | |
| 行为可测试 | | |
| REQ / AC 追踪完整 | | |
| 边界明确 | | |
| 风险可验证 | | |

## 上游确认输入
| 来源 | 决策 / 事实 | 确认类型 | 可进入需求 | 处理 |
| --- | --- | --- | --- | --- |
| | | user-confirmed / delegated-default / agent-recommendation / pending / existing-stack / not-required | allowed / blocked | |

## Source -> Requirement 转译
| Source item | 类型 | 确认状态 | 转译结果 | 状态 |
| --- | --- | --- | --- | --- |
| | feature / constraint / evidence / risk / non-goal | | REQ / AC / NFR / Out of Scope / Pending / Deferred | |

## 边界
### In Scope
-

### Out of Scope
-

### 明确延后 / 不做
| 项 | 类型 | 原因 | 后续触发条件 |
| --- | --- | --- | --- |
| | defer / out-of-scope / rejected | | |

## 影响面确认
| Flag | Value | 依据 |
| --- | --- | --- |
| has_ui | true / false / auto | |
| has_api | true / false / auto | |
| has_db | true / false / auto | |
| has_domain | true / false / auto | |
| has_ai | true / false / auto | |
| has_integration | true / false / auto | |
| needs_research | true / false / auto | |

## 功能需求
| ID | Level | EARS / SHALL 需求 | 来源 | 确认类型 | 对应 AC |
| --- | --- | --- | --- | --- | --- |
| REQ- | MUST / SHOULD / COULD | | | user-confirmed / delegated-default / existing-stack | AC- |

## 行为覆盖矩阵
| REQ | 正常路径 | 失败 / 空状态 | 边界值 | 权限差异 | 对应 AC |
| --- | --- | --- | --- | --- | --- |
| REQ- | | | | | AC- |

## 验收标准
| ID | Given | When | Then | 验证方式 |
| --- | --- | --- | --- | --- |
| AC- | | | | |

## NFR / 约束
| ID | 类型 | 约束 | 来源 | 验证方式 | 触发下游 |
| --- | --- | --- | --- | --- | --- |
| NFR- | performance / security / reliability / compatibility / observability / accessibility / data-quality | | | | |

## REQ / AC Trace
| Source | REQ | AC | Downstream | 状态 |
| --- | --- | --- | --- | --- |
| | REQ- | AC- | ui-design / technical-design / tasking / verification | covered / pending / deferred |

## Downstream Handoff
| 下游 | 输入 | 阻断条件 |
| --- | --- | --- |
| ui-design | | |
| technical-design | | |
| tasking | | |
| verification | | |

## 需求一致性检查
| 检查项 | 结论 | 证据 |
| --- | --- | --- |
| 目标一致 | | |
| 边界一致 | | |
| 验收一致 | | |

## 未决问题
| 问题 | 影响 | Owner | 截止点 |
| --- | --- | --- | --- |
| | | | |
