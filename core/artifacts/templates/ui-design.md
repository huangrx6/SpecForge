# UI Design

## 一页摘要
| 项 | 内容 |
| --- | --- |
| 页面 / 流程 | |
| 用户目标 | |
| 视觉方向 | |
| 交互风险 | |
| Pencil 结论 | |

## 0. 适用性判断
- 是否需要 UI 设计：
- 需要用户确认的感官标准：
- 可复用的现有页面 / 组件：

## 1. 输入依据
| 来源 | 关键约束 | 对 UI 的影响 |
| --- | --- | --- |
| | | |

## 2. UX / IA
- 用户路径：
- 信息优先级：
- 页面密度：
- 失败 / 空状态：

## 3. 方向选择
| 方向 | 适用理由 | 不适用风险 | 结论 |
| --- | --- | --- | --- |
| | | | |

## 4. Visual Style Brief
- 美学方向：
- 色彩策略：
- 字体与层级：
- 动效语气：
- 避免的廉价感：

## Design Contract Summary
| 项 | 内容 |
| --- | --- |
| Design mode | |
| Aesthetic direction | |
| Signature | |
| Token source | |
| Component strategy | |
| shadcn-vue primitive layer | |
| Project wrapper layer | |
| Motion source | Layer 1 (CSS): ; Layer 2 (Motion Vue / CSS animation): ; Layer 3 (GSAP): ; Reduced motion: ; Handoff artifact: |
| Anti-slop rules | |
| Verification hooks | |

```json
{
  "design_mode": "Product UI",
  "aesthetic_direction": "",
  "signature": {
    "type": "structural",
    "description": ""
  },
  "token_source": "existing",
  "component_strategy": "primitive + wrapper",
  "shadcn_vue": {
    "primitive_layer": [],
    "project_wrapper_layer": []
  },
  "motion": {
    "layer_1_css": [],
    "layer_2_motion_vue": [],
    "layer_3_gsap": [],
    "reduced_motion": ""
  },
  "verification_hooks": [],
  "anti_slop_rules": []
}
```

## 5. 信息架构
| 区域 | 内容 | 优先级 | 备注 |
| --- | --- | --- | --- |
| | | | |

## 6. 影响范围
| 页面 / 组件 | 变化 | 风险 | 验证 |
| --- | --- | --- | --- |
| | | | |

## 7. 用户流程
1.
2.
3.

## 8. 微文案
| 位置 | 文案 | 状态 |
| --- | --- | --- |
| | | |

## 9. Pencil 原型证据
| 证据 | 路径 / 链接 | 结论 |
| --- | --- | --- |
| | | |

## 10. Interaction State Matrix
| 对象 | 默认 | 加载 | 成功 | 失败 | 禁用 |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## 11. 组件契约
| 组件 | Contract file | shadcn-vue 映射 | 变体 | 状态 | Motion | 反模式 |
| --- | --- | --- | --- | --- | --- | --- |
| | `01-spec/design/components/<component-name>.contract.md` | | | | | |

## 12. 视觉质量 Review
- 对齐：
- 密度：
- 对比：
- 响应式：
- 细节质感：

## 13. Visual QA Detectors
| Detector | Result | Evidence | Fix / Accepted reason |
| --- | --- | --- | --- |
| Generic SaaS shell | ok / issue | | |
| Card soup | ok / issue | | |
| Fake premium gradient | ok / issue | | |
| Motion noise | ok / issue | | |
| State missing | ok / issue | | |

## 15. UI 验证策略
| 验证项 | 方法 | 证据 |
| --- | --- | --- |
| | | |
