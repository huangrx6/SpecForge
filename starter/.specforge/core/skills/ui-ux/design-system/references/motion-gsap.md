# Motion And GSAP Reference

动效分三层：CSS 状态反馈、组件级 transition、GSAP timeline。默认从轻到重选择。

## Layer Decision

| Layer | Use for | Default token | Dependency |
|---|---|---|---|
| CSS transition | hover、focus、active、drawer、popover、toast、skeleton | `--duration-fast` 到 `--duration-moderate` | 无 |
| Motion Vue / Motion React / CSS animation | 组件进入退出、列表错峰、presence、轻量页面切换 | `--duration-base` 到 `--duration-slow` | technical design 确认 |
| GSAP timeline | 多步骤流程、AI 工具调用、品牌页、大屏、复杂 timeline | 每步 220-260ms，整体 300-600ms | technical design 确认 |

## Use CSS transition

- hover、focus、active、disabled。
- drawer / popover / toast 的进入退出。
- skeleton、progress、简单折叠。

## Use GSAP

- 多元素 timeline，需要精确编排。
- 大屏、直播间、品牌页中的数据或场景动效。
- AI 工具调用、步骤推进、复杂状态切换需要连续反馈。
- 需要统一控制 play / pause / reverse / timeScale。

## Vue Implementation Snippets

### Layer 1: CSS Transition

用于 Button、MenuItem、Badge、Toast、Drawer 等高频 UI。只动 `opacity`、`transform`、颜色和边框，不动 layout 属性。

```vue
<template>
  <button
    class="transition-[opacity,transform,background-color,border-color]
           duration-[var(--duration-fast)]
           ease-[var(--ease-standard)]
           hover:opacity-90
           active:scale-[0.97]
           disabled:pointer-events-none
           disabled:opacity-50"
    type="button"
  >
    保存变更
  </button>
</template>
```

```vue
<template>
  <Transition
    enter-active-class="motion-panel"
    enter-from-class="opacity-0 translate-y-1"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="motion-panel"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-1"
  >
    <section v-if="open" class="rounded-lg border bg-background p-4">
      <slot />
    </section>
  </Transition>
</template>
```

### Layer 2: Motion Vue

用于需要 presence、stagger、layout-aware transition 的组件。新增 Motion Vue 前必须在 technical design 写明依赖和边界。

```vue
<script setup lang="ts">
import { Motion } from "motion-v";
</script>

<template>
  <Motion
    :initial="{ opacity: 0, y: 6 }"
    :animate="{ opacity: 1, y: 0 }"
    :exit="{ opacity: 0, y: 4 }"
    :transition="{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }"
  >
    <slot />
  </Motion>
</template>
```

```vue
<script setup lang="ts">
import { Motion } from "motion-v";

defineProps<{ index: number }>();

function secondsFromToken(name: string, fallbackMs: number) {
  if (typeof window === "undefined") return fallbackMs / 1000;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (raw.endsWith("ms")) return Number.parseFloat(raw) / 1000;
  if (raw.endsWith("s")) return Number.parseFloat(raw);
  return fallbackMs / 1000;
}

const baseDuration = secondsFromToken("--duration-base", 180);
const staggerOffset = Math.min(baseDuration * 0.2, 0.04);
</script>

<template>
  <Motion
    as="li"
    :initial="{ opacity: 0, y: 8 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{
      duration: baseDuration,
      delay: Math.min(index * staggerOffset, baseDuration),
      ease: [0, 0, 0.2, 1],
    }"
  >
    <slot />
  </Motion>
</template>
```

`staggerOffset` 是列表错峰间隔，不是组件 duration token。它应从 `--duration-base` 派生，或在 Motion Contract 中显式说明为 stagger offset，避免实现阶段再造一套硬编码时长。

### Layer 2: Motion React

React 项目使用 Motion for React，默认从 `motion/react` 导入 `motion`。新增 Motion React 前必须在 technical design 写明依赖和边界。

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

function secondsFromToken(name: string, fallbackMs: number) {
  if (typeof window === "undefined") return fallbackMs / 1000;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (raw.endsWith("ms")) return Number.parseFloat(raw) / 1000;
  if (raw.endsWith("s")) return Number.parseFloat(raw);
  return fallbackMs / 1000;
}

export function MotionEnter({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const duration = secondsFromToken("--duration-base", 180);

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

function secondsFromToken(name: string, fallbackMs: number) {
  if (typeof window === "undefined") return fallbackMs / 1000;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (raw.endsWith("ms")) return Number.parseFloat(raw) / 1000;
  if (raw.endsWith("s")) return Number.parseFloat(raw);
  return fallbackMs / 1000;
}

export function MotionListItem({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  const reduce = useReducedMotion();
  const duration = secondsFromToken("--duration-base", 180);
  const staggerOffset = Math.min(duration * 0.2, 0.04);

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0 : duration,
        delay: reduce ? 0 : Math.min(index * staggerOffset, duration),
        ease: [0, 0, 0.2, 1],
      }}
    >
      {children}
    </motion.li>
  );
}
```

`staggerOffset` 同样是错峰间隔，不是独立 duration。React / Vue 示例都应优先读取 CSS token，无法读取时再回落到 design-system 默认值。

### Layer 3: GSAP Timeline

只用于多步骤 timeline、AI 工具调用、品牌型动效或大屏状态编排。普通表单、hover、drawer、toast 不使用 GSAP。

```js
import gsap from "gsap";

// 只用于多步骤 timeline，非普通表单。
const tl = gsap.timeline({
  defaults: {
    duration: 0.22,
    ease: "power2.out",
  },
});

tl.to(".step-1", { opacity: 1, x: 0 })
  .to(".step-2", { opacity: 1, x: 0 }, "+=0.08")
  .to(".step-3", { opacity: 1, x: 0 }, "+=0.08");
```

```js
import gsap from "gsap";
import { onBeforeUnmount, onMounted } from "vue";

let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo(
      ".tool-step",
      { opacity: 0, x: -8 },
      {
        opacity: 1,
        x: 0,
        duration: 0.22,
        ease: "power2.out",
        stagger: 0.08,
      },
    );
  });
});

onBeforeUnmount(() => {
  ctx?.revert();
});
```

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

## Motion Contract Example

```md
| 场景 | 实现层 | Token | Easing | 触发条件 | Reduced motion |
|---|---|---|---|---|---|
| Drawer 进入 | CSS transition | `--duration-moderate` | `--ease-decelerate` | `v-if` mounted | 保留 opacity，移除 translate |
| Toast 进入 | Motion Vue | `--duration-base` | `--ease-decelerate` | mounted | 直接显示 |
| 按钮 active | CSS transition | `--duration-instant` | `--ease-standard` | `:active` | 保留颜色变化，移除 scale |
| 步骤推进 | GSAP timeline | 260ms per step | `power2.out` | `emit("next")` | 跳到最终状态 |
```
