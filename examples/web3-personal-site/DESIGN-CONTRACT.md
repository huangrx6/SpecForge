# Web3 Personal Site Design Contract

## Design Scan Manifest

| 项 | 选择 | 证据 |
| --- | --- | --- |
| Design mode | Brand Surface | 个人官网、Web3 品牌表达、沉浸式首屏 |
| Design routing | Brand Surface full | 允许强表达，但正文、按钮、导航、状态仍需可读 |
| Palette | obsidian-phosphor | 自定义 Web3 品牌色，避开常见青紫科技模板 |
| Font source | system-cn-ui | 中国大陆可直接访问，无外部字体依赖 |
| Font pairing | mi-brand-system 风格 | 品牌大标题 + 系统正文 + mono 数据标签 |
| Type scale | brand-expressive | 首屏强品牌识别，内容区收敛 |
| Spacing density | brand-narrative | 大段滚动叙事，不做后台密集布局 |
| Radius / shadow | brand-signature-material | 实现中所有按钮、面板、浮层圆角控制在 8px 内 |
| Motion | brand-expressive-motion | GSAP 入场、滚动、stagger、计数器 |
| Advanced interaction | shader-brand-signature | Three.js 粒子协议场 + bloom + scroll camera |

## Composition Recipe

| 层 | 决策 | 实现 |
| --- | --- | --- |
| 颜色 | 黑蓝底、青色主行动、紫色辅助、玫红强调 | CSS semantic tokens，不直接散落使用 palette |
| 字体 | 系统中文字体 + system mono | 避免外链字体阻断；标题用高权重，正文控制行高 |
| 字号 | 固定断点字号 | 禁用 viewport font scaling，避免移动端溢出 |
| 间距 | 大首屏 + 大滚动段落 + 小控件间距 | `--page-x`、section min-height、固定 gap |
| 圆角 | 工具型克制圆角 | 卡片、按钮、导航、readout 均 <= 8px |
| 阴影 | 深色玻璃材质阴影 | 只用于 header、readout、系统卡、contact 面板 |
| 动效 | 状态反馈 + 空间重构 | GSAP 首屏、滚动场景、stagger、计数器 |
| GSAP signature | ScrollTrigger 驱动协议场转场 | 滚动时相机、bloom、rotation 变化 |
| Three.js signature | 协议核心、粒子、轨道、连线 | WebGLRenderer + ShaderMaterial + EffectComposer |

## Machine-Readable Contract

```json
{
  "design_mode": "Brand Surface",
  "scope": "personal_site",
  "aesthetic_direction": "obsidian phosphor web3 protocol surface",
  "signature": {
    "type": "interaction",
    "description": "Three.js protocol field responds to scroll and pointer, while GSAP choreographs content reveal and system state."
  },
  "color_system": {
    "palette_id": "obsidian-phosphor",
    "token_source": "custom semantic token override",
    "contrast_checks": [
      {
        "pair": "text_on_dark_background",
        "ratio": "not-measured",
        "status": "not_checked"
      }
    ]
  },
  "composition": {
    "font_source_id": "system-cn-ui",
    "font_pairing_id": "mi-brand-system",
    "type_scale_id": "brand-expressive",
    "spacing_density_id": "brand-narrative",
    "radius_shadow_recipe_id": "brand-signature-material",
    "motion_recipe_id": "brand-expressive-motion",
    "advanced_interaction_recipe_id": "shader-brand-signature"
  },
  "motion": {
    "layer_1_css": ["button hover", "active feedback", "nav hover"],
    "layer_2_motion_vue": [],
    "layer_3_gsap": ["intro timeline", "scroll scene transitions", "stack stagger", "counter readout"],
    "threejs": ["particle shader field", "protocol rings", "bloom postprocessing", "scroll camera"],
    "reduced_motion": "reduce travel, keep content visible, slow scene motion"
  },
  "verification_hooks": [
    "npm run build",
    "npm audit --audit-level=high",
    "node --check src/main.js",
    "visual browser smoke test"
  ],
  "anti_slop_rules": [
    "No dashboard card shell for personal brand site",
    "No fake decorative gradient blobs",
    "No font-size viewport scaling",
    "No panel radius over 8px",
    "No static-only hero for Web3 cool brief"
  ]
}
```

## Visual QA Notes

| Detector | Status | 处理 |
| --- | --- | --- |
| Generic SaaS shell | Pass | 页面没有后台侧栏、顶部栏、统计卡片结构 |
| Card soup | Pass | 系统卡只用于 selected systems，首屏和叙事区不靠卡片堆叠 |
| Fake premium gradient | Pass | 主视觉由 Three.js 场景承担，不用渐变球假装高级 |
| Motion noise | Watch | 粒子和滚动动效存在，但 reduced motion 已降级 |
| State missing | N/A | 个人官网静态内容，无业务表单状态 |
