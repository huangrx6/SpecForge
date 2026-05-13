# 技术设计 (Technical Design)

## 0. 设计摘要 (Design Summary)
- **设计结论**：
- **本次 change 范围**：
- **关键风险**：
- **明确不做**：

## 1. 需求追踪与分析上下文 (Requirements Trace & Context)

### Requirements Trace
| 需求/约束 | 来源 (brief / requirements / clarification / research) | 设计响应 | 验证钩子 |
|---|---|---|---|
| | | | |

### Analysis Context Package
- **已确认的用户澄清**：
- **引用的探索/研究证据**：
- **默认假设**：
- **仍未解决但不阻塞的开放问题**：

## 2. Tech Profile Selection
> 写入前读取 `.specforge/policy/tech-profiles/README.md` 和本次涉及的具体 profile；不适用的维度也要说明跳过理由。

| 维度 | 选型 | Profile 路径 | 适用性/跳过理由 | 选用理由 | 验证方式 |
|---|---|---|---|---|---|
| Frontend | | | | | |
| Backend | | | | | |
| Database | | | | | |
| Component / UI | | | | | |
| Content / Editor | | | | | |
| Markdown / Rich Text | | | | | |
| Charts / Visualization | | | | | |
| Testing | | | | | |
| Runtime / Infrastructure | | | | | |
| Security / Observability | | | | | |

## 3. Profile Deviations
| 维度/Profile | 偏离内容 | 偏离原因 | 风险 | 防护/验证 |
|---|---|---|---|---|
| | | | | |

## 4. 体验设计 (Experience Design)
> 有用户可见页面时必须填写；无 UI 变更时写明 N/A 和理由。涉及页面时读取 `.specforge/policy/rules/experience-design/README.md`。

### Page Map
| 页面/路由 | 使用者 | 核心任务 | 入口 | 出口/下一步 |
|---|---|---|---|---|
| | | | | |

### User Flow
```text
入口 -> 关键操作 -> 系统反馈 -> 成功/失败出口
```

### Wireframe / Prototype
- **线稿或原型链接**：
- **低保真结构说明**：

### Visual Direction
- **主题与品牌语气**：
- **颜色/密度/信息层级**：
- **组件库或设计系统约束**：

### Interaction State Matrix
| 界面/组件 | Loading | Empty | Error | Permission | Success | Notes |
|---|---|---|---|---|---|---|
| | | | | | | |

## 5. 目标架构与边界承诺 (Architecture & Boundary Commitment)
- **目标架构**：
- **责任边界**：
- **核心数据流**：

| 允许修改 | 禁止修改 | 原因 |
|---|---|---|
| | | |

## 6. 领域模型与业务边界 (Domain Design)
> 涉及领域建模时读取 `.specforge/execution/stages/design/domain-design.md`。

- **核心实体与聚合根**：
- **状态机与流转**：
- **限界上下文交互**：
- **业务不变量**：

## 7. 接口与契约 (API & Contracts)
> 涉及 API、SDK、事件或跨系统契约时读取 `.specforge/execution/stages/design/api-design.md` 和 `.specforge/policy/rules/api-design/README.md`。

| 调用方 | 提供方 | 接口/事件名称 | 协议 | 认证/权限 | 兼容性策略 |
|---|---|---|---|---|---|
| | | | | | |

## 8. 数据存储与迁移 (Data, Storage & Migration)
> 涉及 DB / Schema / 索引 / 迁移时读取 `.specforge/execution/stages/design/data-design.md`。

- **关键表结构/Schema**：
- **索引策略**：
- **缓存与一致性设计**：
- **迁移/回填方案**：
- **备份与恢复影响**：

## 9. 权限、配置与外部集成影响 (Permission, Config & Integration Impact)
| 影响面 | 变化内容 | 风险 | 验证方式 |
|---|---|---|---|
| Permission / Auth | | | |
| Config / Env | | | |
| Queue / Job | | | |
| Cache | | | |
| External Integration | | | |

## 10. 非功能性约束 (NFRs)
> 涉及安全、可观测性、部署或可靠性时读取 `.specforge/execution/stages/design/nfr-design.md`。

- **安全与鉴权 (Security)**：
- **性能与并发 (Performance)**：
- **可观测性 (Observability)**：
- **可靠性与降级 (Reliability / Degradation)**：
- **发布、回滚与运行影响 (Delivery / Rollback)**：

## 11. 影响模块与代码结构规划 (Impacted Modules & File Structure)
| 模块/路径 | 职责定位 | 变更类型 | 注意事项 |
|---|---|---|---|
| | | | |

## 12. 失败模式与回滚策略 (Failure Modes & Rollback)
| 失败模式 | 触发条件 | 检测方式 | 缓解/降级 | 回滚方式 |
|---|---|---|---|---|
| | | | | |

## 13. 验证策略 (Validation Strategy)
| 验证层级 | 命令/证据 | 覆盖目标 | 通过标准 |
|---|---|---|---|
| Unit | | | |
| Integration | | | |
| E2E / Manual | | | |
| Regression | | | |
