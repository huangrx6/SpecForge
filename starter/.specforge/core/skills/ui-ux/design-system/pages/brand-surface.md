# Brand Surface Page

适用于官网、landing、活动页、介绍页、作品集。

## 1. 核心规则

- 首屏必须明确对象或 offer，不把价值主张藏在小字。
- 使用真实产品、场景或高质量生成图，不用抽象装饰替代内容。
- 支持 copy、资产、CTA、社会证明和下一区块露出。
- 动效可以更强，但要服务叙事。
- Brand Surface 不是 Product UI 的放大版；不能出现后台 sidebar / dashboard / KPI card shell。
- 高级感必须来自 subject、排版、材质、交互或动效 signature，不能只靠 palette。

## 2. Brand Surface Composition

| 层 | 必须决策 | 失败信号 |
| --- | --- | --- |
| Subject | 页面第一眼看到的品牌 / 人 / 产品 / offer 是什么 | 首屏只有抽象口号 |
| Audience | 谁会看，为什么会相信 | 文案像通用 SaaS |
| Signature | 记忆点由排版、材质、媒体、交互、动效哪一层承担 | 每一层都想抢戏 |
| Palette | 是否是定制 palette 或经过 de-template 的 palette | 青紫霓虹、玻璃、渐变按钮 |
| Typography | display / body / mono 的角色与中文 fallback | 默认字体 + 大字号 |
| Spatial rhythm | 首屏、下一屏露出、section 间距 | 整屏居中卡片，无下一区块暗示 |
| Advanced interaction | GSAP / Three.js 是否绑定内容或滚动 | 只是发光背景 |
| Reduced motion | 去掉 travel 后内容是否仍完整 | 关闭动效后首屏空洞 |

## 3. Web3 / AI / 科技品牌页

用户说“Web3、AI、协议、炫酷、未来感”时，不要自动选择默认 cyberpunk。先做这三步：

1. 从 `aesthetic-palettes.csv` 比较 `obsidian-phosphor`、`black-white-cool`、`cyberpunk`、`data-command`，说明取舍。
2. 如果选择 `cyberpunk`，必须说明为什么不是通用 AI neon，并记录 `anti_reference`。
3. 如果用户反馈“AI 味 / 模板感”，必须执行 `references/visual-calibration.md` 的 Palette De-template。

推荐的 Web3 协议感组合：

| 层 | 推荐 | 避免 |
| --- | --- | --- |
| Palette | `obsidian-phosphor`：黑曜石、磷光绿、暖铜、石墨、信号橙 | cyan + violet + rose 默认霓虹 |
| Surface | 深色不透明 surface、细边框、低 bloom | 全站玻璃拟态 |
| Button | 单色主行动或材质边界 | 多色科技渐变按钮 |
| Three.js | 协议场、节点拓扑、轨道、链路、密钥、数据流 | 与内容无关的抽象粒子背景 |
| GSAP | scroll scene、section state、数字 / topology reveal | 每屏元素飞入 |
| Copy | 具体协议能力、身份、风险、工具、证明 | “next generation AI powered platform” 这类空话 |

## 4. Advanced Interaction Requirement

Brand Surface 使用 Three.js / GSAP 时，必须写 Advanced Interaction Contract：

| 项 | 必填 |
| --- | --- |
| Signature object | 3D / shader / timeline 代表什么业务或品牌对象 |
| Trigger | 首屏、scroll、pointer、section state、CTA 中哪一个驱动 |
| Content binding | 哪些文字、数据、section 会影响动效或场景 |
| Performance budget | 粒子数量、bloom 强度、移动端降级 |
| Reduced motion | 停止 travel、视差和循环后如何保留最终状态 |
| Fallback | WebGL 失败或截图环境下看到什么 |

如果用户要求“非常炫酷”，至少要有一个可见高级交互 signature；不能只用 CSS 背景和静态渐变。

## 5. Visual Calibration

Brand Surface 必须允许实现后反复校准。用户审美反馈不是“主观意见可忽略”，而是 Design Contract 的一部分。

```md
Visual Calibration:
| 问题 | 证据 | 影响层 | 修正动作 | 状态 |
| --- | --- | --- | --- | --- |
| 默认 AI neon | 青紫玫红 + glow | color / surface | 换 obsidian-phosphor，按钮改单色，降低 bloom | fixed |
```

## 6. 与 Product UI 的边界

Brand Surface 可以宽松、叙事、视觉记忆强；Product UI 要稳定、密集、可重复操作。Hybrid 项目必须分开写。Brand Surface 的 signature 只能作为局部品牌线索进入 Product UI，不能污染表格、表单、审批、权限和运营工作面。
