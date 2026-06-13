# DESIGN.md Extraction

用于从真实网站、截图、品牌页面或参考产品中提取 AI 可读设计语言。它借鉴 DESIGN.md 的思路，但输出必须归一化到 SpecForge。

## Extraction sections

| Section | Capture |
|---|---|
| Visual Theme & Atmosphere | 气质、密度、设计哲学、第一印象 |
| Color Palette & Roles | 语义色名、hex、功能角色、占比 |
| Typography Rules | 字体家族、层级、字重、行高、字距、数字规则 |
| Component Styling | buttons、cards、inputs、nav、dialogs、tables 的状态 |
| Layout Principles | 栅格、留白、section 节奏、信息结构 |
| Depth & Elevation | surface、border、shadow、overlay、modal 层级 |
| Motion & Interaction | hover、transition、loading、scroll、reduced motion |
| Do / Don't | 必须保留和必须避免的规则 |
| Agent Prompt Guide | 给 `sf-ui-design` / Pencil / implementation 的短提示 |

## Extraction method

1. 先列“观察到的事实”，不要先评价。
2. 把视觉事实映射到 token：颜色、字号、间距、圆角、阴影、组件状态。
3. 提炼设计哲学：这个参考为什么成立，它靠什么形成识别度。
4. 写 `adopt / adapt / avoid`：
   - `adopt`：可以直接继承的设计规则。
   - `adapt`：需要改造后适配宿主项目的规则。
   - `avoid`：不适合宿主项目的东西。
5. 如果参考来自品牌页，转 Product UI 时要降低表现性，提高信息密度和状态覆盖。

## Output template

```md
Design Reference Extraction
- Source:
- Mode: Product UI / Brand Surface / Hybrid
- Atmosphere:
- Palette:
- Typography:
- Components:
- Layout:
- Motion:
- Adopt:
- Adapt:
- Avoid:
- Risk:
- Prompt guide:
```

## Guardrails

- 不复制品牌身份、logo、专有视觉资产。
- 不把外部 DESIGN.md 当最终答案；它只是输入。
- 参考网站的“高级感”必须转译成当前产品的任务效率、内容层级和组件契约。
