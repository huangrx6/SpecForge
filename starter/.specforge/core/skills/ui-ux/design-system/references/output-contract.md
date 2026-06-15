# Output Contract

`sf-ui-design` 调用 design-system 后，至少把以下内容归一化写入 `ui-design.md`。

## Compact

用于小 UI 改动或局部组件：

```md
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

Component contract:
- Component:
- States:
- shadcn-vue primitive:

Taste review:
- Verdict:
- Change:
```

## Standard

用于新页面、H5、后台资源页、AI 助手：

```md
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

Component contract:
- Project component:
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
```

## Full

用于品牌页、大屏、复杂多角色系统：

- 在 Standard 之上补充 typography scale table、color role table、motion choreography、responsive artboards、Pencil sample board、visual QA evidence。
- 如果后续进入 technical design / implementation，还要补充 registry boundary、component contract matrix、state ownership、token delivery 和 visual verification plan。
