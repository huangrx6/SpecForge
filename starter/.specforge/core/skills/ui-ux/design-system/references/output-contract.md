# Output Contract

`sf-ui-design` 调用 design-system 后，至少把以下内容归一化写入 `ui-design.md`。

所有 profile 都必须同时输出两种 Design Contract：

- Markdown 版 `Design Contract Summary`：给人类 reviewer 快速阅读。
- `Design Contract JSON`：给 `sf-tech-design`、`sf-tasking`、`sf-implement` 和 `sf-verify` 稳定读取。字段必须符合 `contracts/design-contract.schema.json`。

`design_mode` 只允许写 `Product UI`、`Brand Surface`、`Hybrid`、`Avatar-IP`、`Empty State`。不要写组合值；头像/IP 与空态同时适用时，在 JSON 中增加 `scope: "both"`。

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

Design Contract Summary:
- Design mode:
- Color system:
- Scope (Avatar-IP / Empty State only):
- Token source:
- Component strategy:
- Navigation decision:
- Scroll regions:
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
  "design_mode": "Product UI",
  "aesthetic_direction": "",
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

Component contract:
- Component:
- Contract file:
- States:
- shadcn-vue primitive:

Taste review:
- Verdict:
- Change:
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

Design Reference Extraction:
- Source:
- Adopt:
- Adapt:
- Avoid:

Foundations pack:
- Color system:
- Palette:
- Typography:
- Density:
- Spacing:
- Radius / shadow:
- Motion:
- Accessibility:

Design Contract Summary:
- Design mode:
- Aesthetic direction:
- Signature:
- Color system:
- Scope (Avatar-IP / Empty State only):
- Token source:
- Component strategy:
- Navigation decision:
- Navigation alternatives:
- Scroll regions:
- shadcn-vue primitive layer:
- Project wrapper layer:
- Motion source:
  - Layer 1 (CSS):
  - Layer 2 (Motion Vue / CSS animation):
  - Layer 3 (GSAP):
  - Reduced motion:
  - Handoff artifact:
- Anti-slop rules:
- Verification hooks:

Design Contract JSON:
```json
{
  "design_mode": "Product UI",
  "aesthetic_direction": "",
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
