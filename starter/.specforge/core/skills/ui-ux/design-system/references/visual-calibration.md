# Visual Calibration Loop

本文件用于把真实实现、截图或用户审美反馈反灌回 Design Contract。它解决的问题是：设计系统规则看起来完整，但实际产物仍然像模板、像 AI 官网、像默认 cyberpunk、或者只是在“颜色没错”的层面过关。

## 1. 什么时候必须触发

以下情况必须执行 Visual Calibration Loop，不能只口头解释：

| 触发信号 | 典型反馈 | 必须动作 |
| --- | --- | --- |
| 用户说“不好看 / 很垃圾 / 没质感” | 方向明显不成立 | 退回 visual diagnosis，至少改 palette、type、layout、motion 或 signature 中两项 |
| 用户说“AI 味 / 模板感 / 赛博朋克味太重” | 青紫霓虹、玻璃、抽象光效、通用 AI SaaS | 执行 palette de-template，换成 custom token delta 或非默认 palette |
| 用户说“不像某类产品” | Web3 不像 Web3，后台不像后台 | 重新做 subject + world material grounding |
| 实现后和 Design Contract 不一致 | token、动效、字体、间距未落地 | 更新实现或更新 contract，不能两者分离 |
| 高级交互没有成为主角 | Three.js / GSAP 只是背景装饰 | 重写 Advanced Interaction Contract，明确可见 signature 和触发关系 |

## 2. Visual Diagnosis 表

每轮截图、实现或用户反馈后，必须输出诊断表。

```md
Visual Calibration:
| 问题 | 证据 | 影响层 | 修正动作 | 状态 |
| --- | --- | --- | --- | --- |
| 青紫 AI 科技模板 | primary cyan + violet accent + glow CTA | color / material | 换 obsidian-phosphor；降低 bloom；去掉按钮渐变 | fixed |
```

影响层只能写这些稳定值：

- `color`
- `typography`
- `spacing`
- `surface`
- `layout`
- `motion`
- `advanced_interaction`
- `content`
- `signature`

## 3. Palette De-template

Brand Surface 和 Hybrid 最容易被默认 palette 带偏。选择 palette 后必须问：

1. 这个 palette 是否像任何 AI 工具官网都会用？
2. 是否出现 “cyan + violet + rose + glow + glass” 的默认科技组合？
3. 是否只有颜色在表达行业，字体、材质、动效没有行业证据？
4. 主按钮是否用了多色渐变来假装高级？
5. Three.js / GSAP 是否只是发光背景，而不是产品或个人品牌 signature？

如果 2 项以上为 yes，必须执行 de-template：

| 原因 | 修正方式 |
| --- | --- |
| 默认 cyber / AI neon | 换低频主色，例如磷光绿、铜、石墨、墨黑、骨白、酸橙、深酒红；只保留一个高 chroma 信号色 |
| 玻璃 + 紫蓝渐变 | 改为不透明 surface、细边框、材质阴影或真实 3D / motion signature |
| 按钮依赖渐变 | 主按钮改为单色或材质色；hover 用边框 / transform / 光强微调 |
| 品牌页和竞品撞脸 | 记录 `anti_reference`，并至少替换 palette、字体气质或 signature carrier |

## 4. Custom Palette Delta

当现有 `palette_id` 只能表达大方向，但实际效果仍像模板时，允许生成 custom palette delta。delta 不是随便挑 hex，必须写清从哪里偏移、为什么偏移。

```md
Custom Palette Delta:
| 字段 | 原值 | 新值 | 原因 |
| --- | --- | --- | --- |
| primary | cyan | phosphor green | Web3 协议终端更像硬件信号，不像 AI SaaS |
| secondary | violet | warm copper | 增加成熟材质感，减少默认 neon |
| accent | rose | signal orange | 只做风险和关键信号，不做装饰 |
```

JSON 中写入：

```json
"visual_calibration": {
  "feedback_source": "user screenshot review",
  "diagnosis": [
    {
      "issue": "default AI neon palette",
      "evidence": "cyan/violet/rose glow made the site feel generic",
      "affected_layers": ["color", "surface", "advanced_interaction"],
      "fix": "custom obsidian-phosphor token delta and lower bloom",
      "status": "fixed"
    }
  ],
  "palette_delta": [
    {
      "field": "primary",
      "from": "cyan",
      "to": "phosphor green",
      "reason": "protocol terminal signal instead of AI SaaS glow"
    }
  ],
  "anti_reference": ["generic AI SaaS neon", "default cyberpunk landing"],
  "next_review": "browser screenshot or user confirmation"
}
```

## 5. Advanced Interaction Reality Check

使用 GSAP / Three.js / R3F / TresJS 后，必须检查它是否真的改变体验。

| 问题 | 失败信号 | 修正 |
| --- | --- | --- |
| 高级交互只是背景 | 用户觉得“和 GSAP / Three.js 没关系” | 让 scroll、pointer、section state 或内容结构驱动 3D / timeline |
| 动效抢正文 | 粒子、bloom、视差盖过文本 | 降低 opacity / bloom / speed，给正文不透明 surface |
| 只有开场动画 | 首屏过后没有交互记忆 | 加 scroll scene、state transition 或内容绑定 |
| 没有降级 | reduced motion 后内容消失或状态错乱 | 保留最终可读状态，停止 travel 和循环 |

## 6. Completion Gate

Visual Calibration 完成前，不允许宣称设计已通过。通过条件：

- 已记录用户反馈或截图证据。
- 至少指出影响层：color / typography / spacing / surface / layout / motion / advanced_interaction / content / signature。
- high severity 视觉问题已修复或有接受理由。
- Design Contract JSON 的 `visual_calibration` 已更新。
- 如果涉及 Brand Surface / Hybrid，已检查 `Palette De-template` 和 `Advanced Interaction Reality Check`。

