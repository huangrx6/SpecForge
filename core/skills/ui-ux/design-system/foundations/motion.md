# Motion

动效 foundation 必须能被实现阶段直接复制为 token。原则只说明边界，token 才能让 `sf-implement` 避免硬编码 duration、easing 和一次性 Tailwind arbitrary value。

## 动效目的

| 类型 | 目的 | 建议 |
|---|---|---|
| Feedback | 点击、提交、成功、错误 | 100-180ms，直接明确 |
| Transition | 页面 / 面板切换 | 180-280ms，保持方向一致 |
| Emphasis | 关键变化提示 | 只对一个目标使用 |
| Loading | 异步等待 | 骨架、进度、可取消状态优先 |

## CSS Motion Tokens

以下 token 是 design-system 默认值。项目已有 motion token 时可覆盖，但必须在 `Design Contract Summary` 说明 token source 和差异。

| Token | Value | 用途 |
|---|---|---|
| `--duration-instant` | `80ms` | 按钮 active 态、press feedback |
| `--duration-fast` | `120ms` | hover、focus、badge 状态变化 |
| `--duration-base` | `180ms` | toast、dropdown、popover 进入退出 |
| `--duration-moderate` | `260ms` | drawer、dialog、侧栏、局部页面切换 |
| `--duration-slow` | `380ms` | 页面切换、复杂状态切换、品牌表面轻叙事 |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | 大多数 UI 动效 |
| `--ease-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | 元素进入、展开、成功反馈 |
| `--ease-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | 元素退出、收起、dismiss |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 选中、确认等正向反馈；Product UI 慎用 |

```css
:root {
  --duration-instant: 80ms;
  --duration-fast: 120ms;
  --duration-base: 180ms;
  --duration-moderate: 260ms;
  --duration-slow: 380ms;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## Base Utility Classes

这些类可直接进入全局 CSS 或 Tailwind `@layer utilities`。实现阶段可按技术栈改写为组合函数，但语义和 token 不应改变。

```css
.motion-feedback {
  transition:
    opacity var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard);
}

.motion-enter {
  transition:
    opacity var(--duration-base) var(--ease-decelerate),
    transform var(--duration-base) var(--ease-decelerate);
}

.motion-panel {
  transition:
    opacity var(--duration-moderate) var(--ease-decelerate),
    transform var(--duration-moderate) var(--ease-decelerate);
}
```

## Reduced Motion Baseline

所有超过 hover/focus 的动效都必须有降级策略。默认策略是保留状态变化，移除位移和长时间编排。

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Implementation Rules

- 默认只动画 `opacity` 和 `transform`；颜色、边框、背景可用于 hover/focus 状态反馈。
- 禁止动画 `top`、`left`、`width`、`height`、`margin`、`padding`、`grid-template-*` 等 layout 属性。
- 每个动效必须落到 token，不允许散落 `duration-200`、`ease-out` 或裸 `0.2s`。
- Product UI 默认使用 `--duration-fast` 到 `--duration-moderate`；`--duration-slow` 需要页面级理由。
- `--ease-spring` 只用于少量正向反馈，不用于后台表格、表单、权限、错误等严肃状态。

## 技术建议

- 实现层可用 CSS transition；复杂编排再考虑 GSAP。
- GSAP 适合品牌页、复杂时间轴、数字翻牌、场景化动效；不适合普通表单每个控件都动画化。
- 尊重 `prefers-reduced-motion`。

## 禁止

- 首屏所有元素同时飞入。
- hover 动效改变布局尺寸。
- 加载动画替代真实进度或错误反馈。
- 后台工具中使用夸张弹跳、旋转和大幅位移。
