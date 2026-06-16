# Motion Design Prompt

```text
请为以下页面设计克制、可实现的动效策略：

页面：
用户任务：
关键状态变化：
技术栈：
是否允许 GSAP：
是否需要 reduced motion：
已有 motion token：
已选 motion recipe：
Composition Recipe：
组件族：

输出：
## Motion Intent

- 反馈：
- 空间关系：
- 进度：
- 品牌 signature：
- GSAP signature：
- 不做的动效：

## Motion Recipe

- motion_id:
- 为什么适合当前 design mode:
- CSS transition 负责:
- Motion Vue / React 负责:
- GSAP 只负责:
- 为什么不扩大使用:

## Motion Contract

| 场景 | 实现层 | Token | Easing | 触发条件 | Reduced motion |
|---|---|---|---|---|---|
| Drawer 进入 | CSS transition | --duration-moderate | --ease-decelerate | v-show / v-if | remove travel / keep opacity |
| Toast 进入 | Motion Vue | --duration-base | --ease-decelerate | mounted | direct show |
| 按钮 active | CSS transition | --duration-instant | --ease-standard | :active | remove scale / keep color |
| 步骤推进 | GSAP timeline | 260ms per step | power2.out | emit("next") | jump to final state |

## Implementation Snippets

```css
/* 直接可复制的 CSS transition 工具类 */
.motion-enter {
  transition:
    opacity var(--duration-base) var(--ease-decelerate),
    transform var(--duration-base) var(--ease-decelerate);
}

.motion-feedback {
  transition:
    opacity var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard);
}
```

```vue
<Transition
  enter-active-class="motion-enter"
  enter-from-class="opacity-0 translate-y-1"
  enter-to-class="opacity-100 translate-y-0"
  leave-active-class="motion-enter"
  leave-from-class="opacity-100 translate-y-0"
  leave-to-class="opacity-0 translate-y-1"
>
  <slot />
</Transition>
```

## Dependency Decision

- CSS transition:
- Motion Vue / CSS animation:
- GSAP:
- GSAP 使用条件是否满足至少 2 项:
- 新增依赖：

## Verification Hooks

- duration token 覆盖：
- easing token 覆盖：
- reduced motion 覆盖：
- 无 layout 属性动效：
- 手测 / 截图 / 录屏证据：
```
