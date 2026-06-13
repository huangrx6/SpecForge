# Motion And GSAP Reference

动效分三层：CSS 状态反馈、组件级 transition、GSAP timeline。默认从轻到重选择。

## Use CSS transition

- hover、focus、active、disabled。
- drawer / popover / toast 的进入退出。
- skeleton、progress、简单折叠。

## Use GSAP

- 多元素 timeline，需要精确编排。
- 大屏、直播间、品牌页中的数据或场景动效。
- AI 工具调用、步骤推进、复杂状态切换需要连续反馈。
- 需要统一控制 play / pause / reverse / timeScale。

## Rules

- 优先动画 transform、opacity，不动画 layout 属性。
- 每个动效都要说明目的：反馈、空间关系、进度、品牌记忆。
- 支持 reduced motion；关掉动效后功能仍完整。
- 不用滚动驱动动效隐藏关键内容。
- Product UI 中单个状态反馈通常 120-220ms；复杂 timeline 通常 300-600ms。

## Output

```md
Motion layer: CSS transition
GSAP: N/A
Reduced motion: keep state changes, remove travel distance
Reason: 高频后台表格，动效只需确认操作反馈。
```
