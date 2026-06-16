# Design System Orchestration

本文件负责把 design-system 里的来源、颜色、字体、空间、材质、动效、组件、Pencil 和验证串成一条稳定链路。Agent 不允许只读其中一两个文件就开始画 UI；必须先完成扫描清单，再输出 Design Contract。

## 1. 强制扫描顺序

每次进入 UI 设计，按下面顺序推进。某一步不适用时也要写跳过理由。

| 顺序 | 阶段 | 必读 / 按需文件 | 产物 | 不能跳过的原因 |
| --- | --- | --- | --- | --- |
| 1 | 模式路由 | `references/design-mode-routing.md` | `design_mode`、输出深度、禁止项 | 模式判断错了，后面所有审美都会误套 |
| 2 | 设计意图 | `references/design-intelligence.md`、`references/ux-research-ia.md` | subject、audience、single job、signature | 避免像任何同类模板 |
| 3 | 来源扫描 | `references/composition-source-index.md`、`references/font-source-index.md` | source basis、font source | 确保字体、空间、动效不是凭感觉 |
| 4 | 色彩系统 | `references/color-system.md`、`references/palette-source-index.md`、`data/aesthetic-palettes.csv` | palette_id、semantic tokens、contrast checks | 色彩必须映射 token 和许可来源 |
| 5 | 组合配方 | `references/design-composition.md`、4 张 foundation 数据表、`data/font-pairing-recipes.csv` | Composition Recipe、foundation_system | 让字体、间距、圆角、阴影、动效同气质 |
| 6 | 高级交互 | `references/advanced-interaction-source-index.md`、`data/advanced-interaction-recipes.csv`、`references/motion-gsap.md` | advanced interaction decision | GSAP / Three.js 只能在合适场景出现 |
| 7 | 页面与组件 | `references/product-ui-layout-quality.md`、`references/layout-archetypes.md`、`references/component-system.md`、组件契约 | layout、component strategy、state matrix | 避免卡片汤、空壳 Dashboard、primitive pile |
| 8 | 视觉审查 | `references/visual-qa-detectors.md`、`references/design-review-rubric.md` | fail signal、fix / accepted reason | 把“垃圾设计”变成可修复检查 |
| 9 | 视觉校准 | `references/visual-calibration.md` | 用户反馈 / 截图诊断、palette delta、修正状态 | 防止实现后仍像 AI 模板或默认审美 |
| 10 | 输出交接 | `references/output-contract.md`、`references/cross-stage-handoff.md`、`contracts/design-contract.schema.json` | Markdown Summary、Design Contract JSON、Pencil handoff | 后续阶段不再凭自然语言猜 |

## 2. Design Mode 扫描矩阵

| Design mode | 必扫来源 | 必选数据 | 高级交互默认 | 不允许 |
| --- | --- | --- | --- | --- |
| Product UI | mode、intelligence、font source、color、composition、product layout、component、visual QA | palette、font source、type scale、spacing density、radius / shadow、motion recipe | `N/A` 或 Product UI 级微交互 | Hero 动效、Three.js 背景、全站 GSAP |
| Brand Surface | mode、intelligence、font source、color、composition、advanced interaction、visual QA | palette、display/body 字体搭配、brand spacing、signature material、motion recipe | 可选一个 GSAP / Three.js signature | 每屏都有复杂动效、正文不可读 |
| Hybrid | mode、intelligence、font source、color、composition、advanced interaction、product layout、component | 展示面和工作面各自的 foundation | 展示面可用高级交互，工作面回到 Product UI | 把展示面装饰带进表格 / 表单 |
| Avatar-IP | mode、font source、color、composition、advanced interaction | 局部字体 / 插图 / motion recipe | 只用于头像、空态、引导 | 污染主系统 token |
| Empty State | mode、font source、color、composition、component、visual QA | 空态文案、恢复动作、轻动效 | 通常不用 Three.js | 只有插图没有下一步 |

## 3. 数据选择顺序

先选择 mode，再选择数据。不要先选动效或字体。

```text
design_mode
  -> palette_id
  -> palette_de_template_check
  -> font_source_id
  -> font_pairing_id
  -> type_scale_id
  -> spacing_density_id
  -> radius_shadow_recipe_id
  -> motion_recipe_id
  -> advanced_interaction_recipe_id / N/A
  -> component_contracts
  -> visual_qa_detectors
  -> visual_calibration / N/A
```

## 3.1 Brand Surface De-template Gate

Brand Surface / Hybrid 不能因为用户说“Web3 / AI / 科技 / 炫酷”就默认使用青紫霓虹。选择 palette 后必须执行一次 de-template gate：

| 检查项 | 如果为 yes |
| --- | --- |
| 是否是常见 cyan + violet + rose + glow 组合 | 选择非默认 palette，或写 custom palette delta |
| 主按钮是否靠多色渐变显得“高级” | 改成单色、材质色或边框 / 光强变化 |
| Three.js / GSAP 是否只是抽象背景 | 让滚动、内容状态或品牌对象驱动高级交互 |
| 字体、间距、材质是否仍像通用 SaaS 模板 | 至少替换 type scale、surface treatment 或 signature carrier |

如果用户或截图反馈“AI 味 / 模板感 / 不像目标行业”，必须读 `references/visual-calibration.md` 并把修正写入 `visual_calibration`。

## 4. 字体决策规则

| 情况 | 决策 |
| --- | --- |
| Product UI / 后台 / 审批 / 表格 | 默认使用内置系统字体栈；除非用户明确要求品牌字体 |
| 用户要求中文品牌感 | 从 `font-source-index.md` 选择国内可访问官方来源，并记录 license note |
| 字体许可不清楚 | 不下载、不内置、不写进实现；改用 system stack 或开源字体 |
| 字体下载源不是官方 | 可以作为发现入口，不能作为 license source |
| 需要离线 / 内网部署 | 优先 system stack；如需内置，必须把字体文件来源、许可和文件体积写入 technical design |

## 5. 高级交互决策规则

| 情况 | 允许 | 默认 |
| --- | --- | --- |
| 普通表格、表单、后台菜单 | CSS transition | 禁止 GSAP / Three.js |
| 多步骤导入、审批流、AI 工具调用 | CSS + Motion + 少量 GSAP timeline | GSAP 只表达进度和状态 |
| 品牌首页、活动页、作品集 | GSAP ScrollTrigger / timeline 或 Three.js signature | 只能有一个主 signature |
| 3D 产品展示、空间关系、数据网络 | Three.js / React Three Fiber / TresJS | 必须有静态 fallback |
| 用户开启 reduced motion | 停止 travel、循环、视差和 3D 镜头运动 | 保留最终状态和可读内容 |

## 6. Design Scan Manifest

`ui-design.md` 必须输出扫描记录。没有扫描记录，后续阶段无法知道 design-system 是否真的被调用。

```md
Design Scan Manifest:
| 文件 | 用途 | 状态 | 结论 / 跳过理由 |
| --- | --- | --- | --- |
| references/design-mode-routing.md | 模式路由 | scanned | Product UI |
| references/font-source-index.md | 字体来源 | scanned | system-ui + PingFang SC |
| references/advanced-interaction-source-index.md | 高级交互 | skipped | Product UI 高频后台不使用 |
```

JSON 中同步写入：

```json
{
  "scan_manifest": {
    "workflow": ["mode", "source", "color", "composition", "advanced_interaction", "component", "qa", "calibration"],
    "scanned_files": [
      {
        "path": "references/design-mode-routing.md",
        "purpose": "模式路由",
        "status": "scanned",
        "finding": "Product UI"
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
      "advanced_interaction_recipe_id": "N/A"
    },
    "skipped_with_reason": [
      {
        "path": "references/advanced-interaction-source-index.md",
        "reason": "Product UI 高频后台不需要 GSAP / Three.js signature"
      }
    ]
  }
}
```

## 7. 阻断条件

以下情况必须退回补设计，不允许进入 Pencil / implement：

- 没有 `Design Scan Manifest`。
- `selected_data` 只有 palette，没有字体、间距、圆角阴影、动效配方。
- Product UI 使用 Brand Surface 的大标题、滚动叙事、Three.js 背景或全站动效。
- Brand Surface 使用高级交互但没有 fallback、reduced motion 和性能预算。
- Brand Surface / Hybrid 被指出 AI 味、模板感或默认 cyber 风，但没有 Visual Calibration 和 palette delta。
- 字体来源没有官方 URL 或 license note。
- GSAP / Three.js 方案没有说明触发场景、禁用场景和验证方式。
