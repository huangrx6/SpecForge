# UI Design Demo: 城市生命线异常处置协同台

## 一页摘要
| 项 | 内容 |
| --- | --- |
| 页面 / 流程 | 态势总览、事件研判、资源调度、复盘中心 |
| 用户目标 | 让值班长在 30 秒内判断风险、选择处置路径并追踪进展 |
| 视觉方向 | 现代高级感 + 极简科技风，加入“地图纸雕层次”作为 signature |
| 交互风险 | 信息过密、告警噪音、动效喧宾夺主、shadcn primitive 直接堆页面 |
| Pencil 结论 | 本测试用 HTML sample board 替代视觉预览；正式 work item 仍需 Pencil |

## 4. Visual Style Brief
- 美学方向：现代高级感 / 极简科技风 / 纸雕层次。
- 色彩策略：雾白、墨青、静蓝、青绿、风险琥珀；风险色只用于状态和关键路径。
- 字体与层级：业务系统紧凑层级，标题克制，数字和状态强调。
- 动效语气：轻微位移、状态脉冲、timeline 推进；不使用背景粒子和大面积霓虹。
- 避免的廉价感：深蓝全屏大屏、过度发光、图标宫格、所有信息都装卡片。

## Design Contract Summary
| 项 | 内容 |
| --- | --- |
| Design mode | Product UI |
| Aesthetic direction | 现代高级感 + 极简科技风 + 纸雕地图层次 |
| Signature | 中央“城市生命线态势板”：等高线式浅层地图 + 风险流向线 |
| Token source | CSS variables: surface, panel, text, accent, risk, success, warning |
| Component strategy | shadcn-vue primitive + project wrapper + domain component |
| shadcn-vue primitive layer | Button, Tabs, Table, Dialog, Drawer, Tooltip, Badge, Card primitive |
| Project wrapper layer | RiskPanel, EvidenceTimeline, DispatchBoard, ResourceMatchTable |
| Motion source | CSS transition first；复杂 timeline 可选 Motion Vue；Vue Bits 仅作灵感 |
| Anti-slop rules | no nested cards, no purple-blue hero gradient, no decorative icon tiles, no gray text on colored bg |
| Verification hooks | desktop screenshot, mobile screenshot, default/loading/error/permission state, reduced motion |

## 5. 信息架构
| 区域 | 内容 | 优先级 | 备注 |
| --- | --- | --- | --- |
| App Shell | 模块导航、值班状态、全局搜索 | P0 | 左侧导航保持稳定 |
| Situation Board | 风险地图、事件流、核心指标 | P0 | 第一屏主任务 |
| Decision Rail | AI 摘要、建议动作、证据可信度 | P0 | 固定右栏 |
| Work Surface | 表格、时间线、调度方案 | P1 | 随页面切换 |

## 10. Interaction State Matrix
| 对象 | 默认 | 加载 | 成功 | 失败 | 禁用 |
| --- | --- | --- | --- | --- | --- |
| RiskPanel | 显示风险等级和证据数 | skeleton + shimmer | 风险降级提示 | 显示数据源失败和重试 | 无权限隐藏操作 |
| DispatchBoard | 队伍匹配列表 | 行级 skeleton | 派发成功 toast + timeline 节点 | 派发失败显示原因 | 超出权限按钮禁用并解释 |
| EvidenceTimeline | 证据链时间线 | 逐段加载 | 新证据高亮 | 证据缺失占位 | 归档后只读 |

## 11. 组件契约
| 组件 | shadcn-vue 映射 | 变体 | 状态 | 反模式 |
| --- | --- | --- | --- | --- |
| RiskPanel | Card + Badge + Tooltip | city / district / asset | default, warning, critical, stale | 大面积红色背景 |
| EvidenceTimeline | ScrollArea + Badge + Collapsible | compact / detailed | loading, verified, conflict | 只用 toast 表示证据冲突 |
| DispatchBoard | Table + DropdownMenu + Dialog | team / material | empty, filtered-empty, permission | 页面内直接拼 primitive |
| ReviewLedger | Tabs + Table + Drawer | event / decision / action | readonly, exporting | 复盘只做静态文本 |

## 15. UI 验证策略
| 验证项 | 方法 | 证据 |
| --- | --- | --- |
| 视觉方向 | HTML sample board 截图 | `preview.png` |
| 状态覆盖 | 检查默认、风险、空态、权限提示 | DOM + screenshot |
| 实现承接 | Design Contract Summary 能映射到 tech design / implementation | 本 demo 文档 |
