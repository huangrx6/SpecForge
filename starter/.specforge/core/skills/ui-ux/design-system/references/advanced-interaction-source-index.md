# Advanced Interaction Source Index

本文件定义 GSAP、Three.js、React Three Fiber、Drei、TresJS 等高级前端能力如何进入 design-system。高级交互不是“更高级的装饰”，而是用于表达空间、进度、品牌 signature、3D 对象或复杂状态。

## 1. 来源索引

| source_id | 来源 | 官方入口 | 适合借鉴 | SpecForge 转译 |
| --- | --- | --- | --- | --- |
| gsap-core | GSAP Core | https://gsap.com/docs/v3/GSAP/ | timeline、stagger、sequencing、cleanup | 只用于复杂状态编排或品牌 signature |
| gsap-scrolltrigger | GSAP ScrollTrigger | https://gsap.com/docs/v3/Plugins/ScrollTrigger/ | 滚动叙事、section reveal、pinning | Brand Surface 可用；Product UI 默认禁用 |
| gsap-flip | GSAP Flip | https://gsap.com/docs/v3/Plugins/Flip/ | 布局状态转换、列表重排、卡片到详情过渡 | 只在空间关系清晰时用 |
| gsap-matchmedia | GSAP matchMedia | https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/ | responsive timeline、reduced motion、cleanup | GSAP signature 必须写 matchMedia / revert |
| three-examples | Three.js examples | https://threejs.org/examples/ | WebGL / WebGPU / shader / controls / particle / model examples | 只借鉴场景类型，不复制视觉 |
| three-docs | Three.js docs | https://threejs.org/docs/ | camera、renderer、geometry、material、loader、controls | technical design 必须确认性能和 fallback |
| r3f-examples | React Three Fiber | https://r3f.docs.pmnd.rs/getting-started/examples | React 场景下声明式 Three.js | React 项目可选；Vue 项目不直接使用 |
| drei | Drei helpers | https://drei.docs.pmnd.rs/ | camera、controls、environment、text、loader helpers | React 项目可减少 Three.js 样板代码 |
| tresjs | TresJS | https://docs.tresjs.org/ | Vue 生态使用 Three.js | Vue 项目优先看 TresJS，而不是 R3F |

## 2. 使用边界

| 场景 | 推荐 | 禁止 |
| --- | --- | --- |
| Product UI 后台 / 表格 / 表单 | CSS transition、必要时 Motion presence | Three.js 背景、ScrollTrigger、全局视差、每个元素 GSAP |
| AI 工具调用 / 诊断链路 | GSAP timeline 展示步骤、等待、阻塞和结果 | 抽象发光粒子盖过真实步骤 |
| 导入导出 / 批处理 | GSAP 或 CSS 进度编排，强调可恢复状态 | 循环 loading 动画替代真实进度 |
| Brand Surface hero | GSAP hero timeline、Three.js 轻量场景、shader signature | 多个 signature 抢戏 |
| 3D 产品 / 物体展示 | Three.js / R3F / TresJS，带 OrbitControls 或静态预览 | 没有 fallback、没有 loading、没有移动端性能预算 |
| 数据空间 / 知识图谱 | Three.js 仅在空间关系真实有用时使用 | 只为了科技感做 3D 点线背景 |

## 3. 高级交互契约

选择高级交互时必须写：

```md
Advanced Interaction Contract:
| 项 | 内容 |
| --- | --- |
| recipe_id | ai-tool-trace-gsap |
| source | GSAP Core + matchMedia |
| purpose | 展示 AI 工具调用步骤和等待状态 |
| trigger | submit / step change |
| duration budget | 单轮不超过 900ms，步骤 offset 不超过 180ms |
| reduced motion | 保留步骤文本，移除 travel 和 stagger |
| fallback | CSS opacity / final state |
| dependency decision | technical design confirm |
| verification | screenshot + reduced motion + performance |
```

并同步到 `Design Contract JSON.scan_manifest.selected_data.advanced_interaction_recipe_id`。

## 4. GSAP 高级规则

- GSAP 只用于 timeline、ScrollTrigger、Flip、数字 morph、AI / 诊断 / 大屏编排，不用于普通 hover、focus、toast。
- `stagger` 的 offset 是编排节奏，不是 duration token；必须写上限，例如 `Math.min(index * 0.035, 0.18)` 代表 offset 上限，不跟 `--duration-base` 混为一谈。
- 需要 responsive 或 reduced motion 时，必须用 `gsap.matchMedia()` 或同等封装，并在组件卸载时 cleanup / revert。
- Product UI 页面级切换默认 quick fade；除非空间关系明确，不做大幅移动。
- Brand Surface 只允许一个 GSAP signature moment；其余动效回到 CSS / Motion。

## 5. Three.js 高级规则

- Three.js 必须服务真实对象、空间关系、数据结构、品牌记忆或沉浸场景；不能只作为“科技感背景”。
- 必须写 renderer / camera / control / asset / loading / fallback / performance budget。
- 移动端必须有降级：静态图片、低粒子数、关闭后处理或不加载 WebGL。
- Product UI 默认不使用 Three.js；只有产品 3D 预览、空间数据或明确低频展示面才允许。
- Vue 项目优先评估 TresJS；React 项目可评估 React Three Fiber / Drei；原生实现优先 Three.js docs / examples。

## 6. 验证要求

| 类型 | 必须验证 |
| --- | --- |
| GSAP timeline | 默认、reduced motion、组件卸载 cleanup、快速重复触发 |
| ScrollTrigger | 首屏、移动端、低高度屏、滚动位置恢复 |
| Flip | 初始状态、目标状态、无动画 fallback |
| Three.js | canvas 非空、资源加载失败、移动端性能、缩放裁切、fallback |
| Shader / particles | 对比度、可读性、低性能设备、reduced motion |

## 7. 阻断条件

- 没有业务目的，只写“高级动效 / 酷炫 3D / 科技感”。
- 没有 reduced motion 和 fallback。
- 没有 dependency decision，直接要求实现引入 GSAP / Three.js。
- Product UI 高频页面使用 3D 背景或 ScrollTrigger。
- 设计阶段没有写验证方式，导致 implement / verify 无法证明效果。
