# Output Contract

`sf-ui-design` 调用 design-system 后，至少把以下内容归一化写入 `ui-design.md`。

所有 profile 都必须同时输出两种 Design Contract：

- Markdown 版 `Design Contract Summary`：给人类 reviewer 快速阅读。
- `Design Contract JSON`：给 `sf-tech-design`、`sf-tasking`、`sf-implement` 和 `sf-verify` 稳定读取。字段必须符合 `contracts/design-contract.schema.json`。

`design_mode` 只允许写 `Product UI`、`Brand Surface`、`Hybrid`、`Avatar-IP`、`Empty State`。不要写组合值；头像/IP 与空态同时适用时，在 JSON 中增加 `scope: "both"`。

如果用户有外部参考诉求，或 Agent 主动使用外部设计来源，必须额外输出 `Reference Selection`、`Reference Source Routing`、`Reference Scan Manifest`、`Reuse Boundary`、`Extracted Reference Patterns` 和 `Design Contract JSON.reference_selection`。外部来源只提供 pattern、anatomy、state coverage、visual completion、motion boundary、UX / IA 方法、source basis 和 anti-reference，不提供可复制资产。

Reference 输出规则：

- 如果用户未提供外部参考，写 `Reference Selection: N/A`。
- 如果用户提供了外部参考，或说“多看一些好网站 / 模板 / 案例”，必须输出 `Reference Selection`。
- 外部来源不可访问时，不允许省略，必须写入 `Reference Scan Manifest` 的 fallback。
- React shadcn 来源必须写明是否需要 Vue translation。
- 国内设计社区来源必须写明具体参考类型：作品 / 文章 / 素材 / 设计团队 / 课程 / 行业案例 / UI 页面；不能写“站酷气质”。

## Compact

用于小 UI 改动或局部组件：

````md
Design intelligence:
- Subject:
- Audience:
- Single job:
- Signature:

Aesthetic direction:
- Selected direction:
- Why selected:
- Rejected directions:

Foundations delta:
- Tokens:
- Density:
- Motion:

Reference Selection:
- UI type:
- Stack:
- Selected needs:
- Borrow strength:
- Admin modules:
- Visual direction:
- Source routing:
- Reuse boundary:
- Offline behavior:
- Human confirmation:

Reference Scan Manifest:
| Source | Type | Access | Used for | Status | Fallback / reason |
|---|---|---|---|---|---|
| | | online / offline / catalog | | scanned / fallback / skipped | |

Extracted Reference Patterns:
| Source | Pattern | Adopt | Adapt | Avoid |
|---|---|---|---|---|
| | | | | |

Design Scan Manifest:
| 项 | 内容 |
| --- | --- |
| Profile | local-component / product-page / brand-surface / visual-calibration / full-system |

| 文件 | 用途 | 状态 | 结论 / 跳过理由 |
| --- | --- | --- | --- |
| references/design-system-orchestration.md | 设计流程编排 | scanned | |
| references/design-mode-routing.md | 模式路由 | scanned | |
| references/font-source-index.md | 字体来源 | scanned | |
| references/design-composition.md | 组合配方 | scanned | |

Design Contract Summary:
- Design mode:
- Color system:
- Foundation system:
  - Source basis:
  - Typography:
  - Spacing:
  - Radius / shadow:
  - Motion recipe:
- Scope (Avatar-IP / Empty State only):
- Token source:
- Component strategy:
- Navigation decision:
- Scroll regions:
- Product UI layout audit (Product UI only):
  - Primary user / object / job:
  - Layout archetype:
  - Primary work surface:
  - KPI actionability:
  - Content budget:
  - Right rail purpose:
  - Rejected filler:
- Motion source:
  - Layer 1 (CSS):
  - Layer 2 (Motion Vue / CSS animation):
  - Layer 3 (GSAP):
  - Reduced motion:
  - Handoff artifact:
- Verification hooks:

Design Contract JSON:
```json
{
  "reference_selection": {
    "ui_type": [],
    "stack": [],
    "selected_needs": [],
    "borrow_strength": "moderate",
    "admin_modules": [],
    "visual_direction": [],
    "source_routing": [],
    "reuse_boundary": [],
    "offline_behavior": "",
    "human_confirmation": {
      "status": "defaulted",
      "reason": ""
    },
    "forbidden": []
  },
  "scan_manifest": {
    "profile": "product-page",
    "workflow": ["reference", "mode", "source", "font", "color", "composition", "advanced_interaction", "component", "qa", "calibration", "output"],
    "scanned_files": [
      {
        "path": "references/design-system-orchestration.md",
        "purpose": "设计流程编排",
        "status": "scanned",
        "finding": ""
      },
      {
        "path": "references/design-mode-routing.md",
        "purpose": "模式路由",
        "status": "scanned",
        "finding": ""
      },
      {
        "path": "references/font-source-index.md",
        "purpose": "字体来源",
        "status": "scanned",
        "finding": ""
      },
      {
        "path": "references/design-composition.md",
        "purpose": "组合配方",
        "status": "scanned",
        "finding": ""
      }
    ],
    "selected_data": {
      "palette_id": "",
      "font_source_id": "",
      "font_pairing_id": "",
      "type_scale_id": "",
      "spacing_density_id": "",
      "radius_shadow_recipe_id": "",
      "motion_recipe_id": "",
      "advanced_interaction_recipe_id": "none-product-ui"
    },
    "selection_rationale": {
      "palette": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "font_source": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely",
        "license": ""
      },
      "font_pairing": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "type_scale": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "spacing_density": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "radius_shadow": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "motion": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "advanced_interaction": {
        "id": "none-product-ui",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      }
    },
    "skipped_with_reason": []
  },
  "design_mode": "Product UI",
  "aesthetic_direction": "",
  "human_confirmation": {
    "required": true,
    "reason": "Aesthetic direction changes information architecture or first viewport task hierarchy",
    "options_presented": [
      "minimal editorial",
      "dense command center",
      "warm operational"
    ],
    "selected": "dense command center",
    "status": "confirmed",
    "default_reversibility": "Safe to change palette and spacing without schema, permission or data migration"
  },
  "signature": {
    "type": "structural",
    "description": ""
  },
  "color_system": {
    "palette_id": "",
    "aesthetic_direction": "",
    "design_mode": "Product UI",
    "tokens": {
      "background": "",
      "surface": "",
      "surface_muted": "",
      "text": "",
      "text_muted": "",
      "primary": "",
      "secondary": "",
      "accent": "",
      "border": "",
      "success": "",
      "warning": "",
      "danger": "",
      "chart": []
    },
    "usage_rules": {
      "primary_usage": "",
      "accent_usage": "",
      "background_usage": "",
      "avoid": []
    },
    "accessibility": {
      "requires_contrast_check": true,
      "dark_mode_ready": false,
      "contrast_checks": [
        {
          "pair": "text_on_surface",
          "ratio": "",
          "status": "not-checked"
        }
      ]
    },
    "source": "",
    "source_url": "",
    "license_note": ""
  },
  "foundation_system": {
    "source_basis": [
      {
        "source": "",
        "adopt": "",
        "adapt": "",
        "avoid": ""
      }
    ],
    "typography": {
      "font_family": "",
      "scale": "",
      "line_height": "",
      "numeric": "",
      "usage_rules": []
    },
    "spacing": {
      "density": "compact",
      "grid": "4px / 8px",
      "page_padding": "",
      "section_gap": "",
      "component_gap": "",
      "usage_rules": []
    },
    "radius_shadow": {
      "radius_scale": "",
      "surface_treatment": "",
      "overlay_shadow": "",
      "usage_rules": []
    },
    "motion": {
      "motion_personality": "",
      "css_tokens": [],
      "gsap_signature": "",
      "reduced_motion": ""
    }
  },
  "token_source": "existing",
  "token_delivery_hint": {
    "css_variables": [
      "--sf-bg",
      "--sf-surface",
      "--sf-text",
      "--sf-primary",
      "--sf-radius-card",
      "--sf-motion-fast"
    ],
    "tailwind_mapping": {
      "colors.background": "var(--sf-bg)",
      "colors.primary": "var(--sf-primary)",
      "borderRadius.card": "var(--sf-radius-card)"
    },
    "pencil_variables": [
      "color.background",
      "color.surface",
      "type.body",
      "space.3"
    ],
    "notes": "Implementation hint only; final token delivery is decided by sf-tech-design."
  },
  "component_strategy": "primitive + wrapper",
  "shadcn_vue": {
    "primitive_layer": [],
    "project_wrapper_layer": []
  },
  "layout": {
    "navigation_decision": "",
    "layout_archetype": "",
    "primary_work_surface": "",
    "scroll_regions": [],
    "responsive_strategy": ""
  },
  "state_matrix": {
    "required_states": [],
    "owner": ""
  },
  "product_ui_quality": {
    "primary_user": "",
    "primary_object": "",
    "primary_job": "",
    "kpi_actionability": "pass",
    "content_budget": "pass",
    "right_rail_purpose": "",
    "rejected_filler": []
  },
  "motion": {
    "layer_1_css": [],
    "layer_2_motion_vue": [],
    "layer_3_gsap": [],
    "reduced_motion": ""
  },
  "visual_qa": [
    {
      "detector": "Empty dashboard skeleton",
      "result": "ok",
      "severity": "high",
      "evidence": {
        "artifact": "01-spec/ui-mockup-export/dashboard.png",
        "viewport": "1440x900",
        "region": "first viewport"
      },
      "fix": "N/A - primary work surface is present",
      "status": "not-applicable",
      "owner": "sf-ui-design"
    }
  ],
  "visual_calibration": {
    "feedback_source": "",
    "diagnosis": [],
    "palette_delta": [],
    "anti_reference": [],
    "next_review": ""
  },
  "verification_hooks": [],
  "anti_slop_rules": []
}
```

`motion.layer_3_gsap` 不使用时写空数组；一旦使用，数组项必须写成 `{ "effect": "", "fallback": "", "verification": "" }`，说明 GSAP 效果、降级策略和验证方式。

Component contract:
- Component:
- Contract file:
- States:
- shadcn-vue primitive:

Taste review:
- Verdict:
- Change:

Visual Calibration:
| 问题 | 证据 | 影响层 | 修正动作 | 状态 |
| --- | --- | --- | --- | --- |
| | | color / typography / spacing / surface / layout / motion / advanced_interaction / content / signature | | pending / fixed / accepted / blocked |
````

## Standard

用于新页面、H5、后台资源页、AI 助手：

````md
Design intelligence:
- Subject:
- Audience:
- Single job:
- World material:
- Signature:
- Rejected defaults:

Aesthetic direction:
- Direction options:
- Selected direction:
- Component language:
- Risk:
- Human confirmation:

UI Direction Options:
- Direction A:
- Direction B:
- Recommended:
- Human confirmation:

Reference Selection:
- UI type:
- Stack:
- Selected needs:
- Borrow strength:
- Admin modules:
- Visual direction:
- Source routing:
- Reuse boundary:
- Offline behavior:
- Human confirmation:

Reference Source Routing:
| 选择需求 | 路由来源 | 为什么 | 抽取内容 | 不使用内容 | 置信度 |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

Reference Scan Manifest:
| Source | Type | Access | Used for | Status | Fallback / reason |
|---|---|---|---|---|---|
| | | online / offline / catalog | | scanned / fallback / skipped | |

Reuse Boundary:
| 可借鉴 | 必须转换 | 禁止复制 |
| --- | --- | --- |
| layout anatomy, state coverage | React shadcn -> shadcn-vue contract | code, images, screenshots, paid template assets |

Extracted Reference Patterns:
| Source | Pattern | Adopt | Adapt | Avoid |
|---|---|---|---|---|
| | | | | |

Foundations pack:
- Color system:
- Palette:
- Typography:
- Density:
- Spacing:
- Radius / shadow:
- Motion:
- Accessibility:

Composition Recipe:
| 层 | 选择 | 理由 | 禁止 |
| --- | --- | --- | --- |
| Font Source | | | |
| Font Pairing | | | |
| Typography | | | |
| Spacing | | | |
| Radius / Shadow | | | |
| Motion | | | |
| Advanced Interaction | | | |
| Signature | | | |

Composition Source Notes:
| 来源 | 采用 | 本地化改造 | 禁止复制 |
| --- | --- | --- | --- |
| | | | |

Advanced Interaction Contract:
| 项 | 内容 |
| --- | --- |
| recipe_id | none-product-ui |
| source | |
| purpose | |
| trigger | |
| duration budget | |
| reduced motion | |
| fallback | |
| dependency decision | |
| verification | |

Visual Calibration:
| 问题 | 证据 | 影响层 | 修正动作 | 状态 |
| --- | --- | --- | --- | --- |
| | | | | |

Palette Delta (when calibrated):
| 字段 | 原值 | 新值 | 原因 |
| --- | --- | --- | --- |
| | | | |

Design Contract Summary:
- Reference selection:
  - UI type:
  - Selected needs:
  - Borrow strength:
  - Routed sources:
  - Reuse boundary:
- Design mode:
- Aesthetic direction:
- Signature:
- Color system:
- Foundation system:
  - Typography:
  - Spacing:
  - Radius / shadow:
  - Motion recipe:
- Scope (Avatar-IP / Empty State only):
- Token source:
- Component strategy:
- Navigation decision:
- Navigation alternatives:
- Scroll regions:
- Product UI layout audit (Product UI only):
  - Primary user:
  - Primary object:
  - Primary job:
  - Layout archetype:
  - Primary work surface:
  - KPI actionability:
  - First viewport content budget:
  - Right rail purpose:
  - Rejected filler:
- shadcn-vue primitive layer:
- Project wrapper layer:
- Motion source:
  - Layer 1 (CSS):
  - Layer 2 (Motion Vue / CSS animation):
  - Layer 3 (GSAP):
  - Reduced motion:
  - Handoff artifact:
- Anti-slop rules:
- Visual calibration:
  - Feedback source:
  - Palette delta:
  - Anti-reference:
  - Next review:
- Verification hooks:

Design Contract JSON:
```json
{
  "reference_selection": {
    "ui_type": [],
    "stack": [],
    "selected_needs": [],
    "borrow_strength": "moderate",
    "admin_modules": [],
    "visual_direction": [],
    "source_routing": [],
    "reuse_boundary": [],
    "offline_behavior": "",
    "human_confirmation": {
      "status": "defaulted",
      "reason": ""
    },
    "forbidden": []
  },
  "scan_manifest": {
    "profile": "product-page",
    "workflow": ["reference", "mode", "source", "font", "color", "composition", "advanced_interaction", "component", "qa", "calibration", "output"],
    "scanned_files": [
      {
        "path": "references/design-system-orchestration.md",
        "purpose": "设计流程编排",
        "status": "scanned",
        "finding": ""
      },
      {
        "path": "references/design-mode-routing.md",
        "purpose": "模式路由",
        "status": "scanned",
        "finding": ""
      },
      {
        "path": "references/font-source-index.md",
        "purpose": "字体来源",
        "status": "scanned",
        "finding": ""
      },
      {
        "path": "references/design-composition.md",
        "purpose": "组合配方",
        "status": "scanned",
        "finding": ""
      }
    ],
    "selected_data": {
      "palette_id": "",
      "font_source_id": "",
      "font_pairing_id": "",
      "type_scale_id": "",
      "spacing_density_id": "",
      "radius_shadow_recipe_id": "",
      "motion_recipe_id": "",
      "advanced_interaction_recipe_id": "none-product-ui"
    },
    "selection_rationale": {
      "palette": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "font_source": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely",
        "license": ""
      },
      "font_pairing": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "type_scale": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "spacing_density": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "radius_shadow": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "motion": {
        "id": "",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      },
      "advanced_interaction": {
        "id": "none-product-ui",
        "why": "",
        "rejected": [""],
        "risk": "",
        "confidence": "likely"
      }
    },
    "skipped_with_reason": []
  },
  "design_mode": "Product UI",
  "aesthetic_direction": "",
  "human_confirmation": {
    "required": true,
    "reason": "Aesthetic direction changes information architecture or first viewport task hierarchy",
    "options_presented": [
      "minimal editorial",
      "dense command center",
      "warm operational"
    ],
    "selected": "dense command center",
    "status": "confirmed",
    "default_reversibility": "Safe to change palette and spacing without schema, permission or data migration"
  },
  "signature": {
    "type": "structural",
    "description": ""
  },
  "color_system": {
    "palette_id": "",
    "aesthetic_direction": "",
    "design_mode": "Product UI",
    "tokens": {
      "background": "",
      "surface": "",
      "surface_muted": "",
      "text": "",
      "text_muted": "",
      "primary": "",
      "secondary": "",
      "accent": "",
      "border": "",
      "success": "",
      "warning": "",
      "danger": "",
      "chart": []
    },
    "usage_rules": {
      "primary_usage": "",
      "accent_usage": "",
      "background_usage": "",
      "avoid": []
    },
    "accessibility": {
      "requires_contrast_check": true,
      "dark_mode_ready": false,
      "contrast_checks": [
        {
          "pair": "text_on_surface",
          "ratio": "",
          "status": "not-checked"
        }
      ]
    },
    "source": "",
    "source_url": "",
    "license_note": ""
  },
  "foundation_system": {
    "source_basis": [
      {
        "source": "",
        "adopt": "",
        "adapt": "",
        "avoid": ""
      }
    ],
    "typography": {
      "font_family": "",
      "scale": "",
      "line_height": "",
      "numeric": "",
      "usage_rules": []
    },
    "spacing": {
      "density": "compact",
      "grid": "4px / 8px",
      "page_padding": "",
      "section_gap": "",
      "component_gap": "",
      "usage_rules": []
    },
    "radius_shadow": {
      "radius_scale": "",
      "surface_treatment": "",
      "overlay_shadow": "",
      "usage_rules": []
    },
    "motion": {
      "motion_personality": "",
      "css_tokens": [],
      "gsap_signature": "",
      "reduced_motion": ""
    }
  },
  "token_source": "existing",
  "token_delivery_hint": {
    "css_variables": [
      "--sf-bg",
      "--sf-surface",
      "--sf-text",
      "--sf-primary",
      "--sf-radius-card",
      "--sf-motion-fast"
    ],
    "tailwind_mapping": {
      "colors.background": "var(--sf-bg)",
      "colors.primary": "var(--sf-primary)",
      "borderRadius.card": "var(--sf-radius-card)"
    },
    "pencil_variables": [
      "color.background",
      "color.surface",
      "type.body",
      "space.3"
    ],
    "notes": "Implementation hint only; final token delivery is decided by sf-tech-design."
  },
  "component_strategy": "primitive + wrapper",
  "shadcn_vue": {
    "primitive_layer": [],
    "project_wrapper_layer": []
  },
  "layout": {
    "navigation_decision": "",
    "layout_archetype": "",
    "primary_work_surface": "",
    "scroll_regions": [],
    "responsive_strategy": ""
  },
  "state_matrix": {
    "required_states": [],
    "owner": ""
  },
  "product_ui_quality": {
    "primary_user": "",
    "primary_object": "",
    "primary_job": "",
    "kpi_actionability": "pass",
    "content_budget": "pass",
    "right_rail_purpose": "",
    "rejected_filler": []
  },
  "motion": {
    "layer_1_css": [],
    "layer_2_motion_vue": [],
    "layer_3_gsap": [],
    "reduced_motion": ""
  },
  "visual_qa": [
    {
      "detector": "Empty dashboard skeleton",
      "result": "ok",
      "severity": "high",
      "evidence": {
        "artifact": "01-spec/ui-mockup-export/dashboard.png",
        "viewport": "1440x900",
        "region": "first viewport"
      },
      "fix": "N/A - primary work surface is present",
      "status": "not-applicable",
      "owner": "sf-ui-design"
    }
  ],
  "visual_calibration": {
    "feedback_source": "",
    "diagnosis": [
      {
        "issue": "",
        "evidence": "",
        "affected_layers": [],
        "fix": "",
        "status": "pending"
      }
    ],
    "palette_delta": [],
    "anti_reference": [],
    "next_review": ""
  },
  "verification_hooks": [],
  "anti_slop_rules": []
}
```

`motion.layer_3_gsap` 不使用时写空数组；一旦使用，数组项必须写成 `{ "effect": "", "fallback": "", "verification": "" }`，说明 GSAP 效果、降级策略和验证方式。

Component contract:
- Project component:
- Contract file:
- Primitive:
- Anatomy:
- Variants:
- Props:
- Events:
- Slots:
- States:
- A11y:
- Content rules:
- Anti-patterns:

Page pattern:
- Layout archetype:
- Navigation mode:
- Fixed / sticky regions:
- Product UI Layout Audit:
  - Primary user / object / job:
  - Primary work surface:
  - KPI actionability:
  - Content budget:
  - Right rail purpose:
  - Rejected filler:
- State matrix:
- Responsive:
- Microcopy:

Taste review:
- Verdict:
- Required fixes:
````

## Full

用于品牌页、大屏、复杂多角色系统：

- 在 Standard 之上补充 typography scale table、color role table、motion choreography、responsive artboards、Pencil sample board、visual QA evidence。
- 如果后续进入 technical design / implementation，还要补充 registry boundary、component contract matrix、state ownership、token delivery 和 visual verification plan。
- 复杂或复用组件必须输出 `01-spec/design/components/<component-name>.contract.md`，使用 `contracts/component-contract.template.md`。

````md
Reference Selection:
- UI type:
- Stack:
- Selected needs:
- Borrow strength:
- Admin modules:
- Visual direction:
- Source routing:
- Reuse boundary:
- Offline behavior:
- Human confirmation:

Reference Scan Manifest:
| Source | Type | Access | Used for | Status | Fallback / reason |
|---|---|---|---|---|---|
| | | online / offline / catalog | | scanned / fallback / skipped | |

Extracted Reference Patterns:
| Source | Pattern | Adopt | Adapt | Avoid |
|---|---|---|---|---|
| | | | | |
````
