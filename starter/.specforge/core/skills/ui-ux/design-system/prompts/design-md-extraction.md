# DESIGN.md Extraction Prompt

用于把参考网站、截图或品牌材料转成 SpecForge 可用的设计语言。

```md
请从参考材料中提取 DESIGN.md 风格的设计规范，禁止直接照抄品牌身份。

输入：
- Source:
- Target product:
- Target design mode:
- Screenshots / notes:

输出：
1. Visual Theme & Atmosphere
2. Color Palette & Roles
3. Typography Rules
4. Component Styling
5. Layout Principles
6. Depth & Elevation
7. Motion & Interaction
8. Do / Don't
9. Adopt / Adapt / Avoid
10. Agent Prompt Guide

要求：
- 每条规则都要能落到 token、组件、页面或动效。
- 明确哪些规则不适合当前宿主项目。
- 最后给出 3 条 Pencil handoff 输入建议。
```
