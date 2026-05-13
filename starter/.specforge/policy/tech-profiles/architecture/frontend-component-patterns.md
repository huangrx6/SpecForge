# 前端视图与组件流转模式 (Frontend Component Patterns)

## 1. 适用场景 (Applicability)
- 指导中大型前端项目（尤其是包含繁杂基础组件库与深层表单的 B 端系统）如何合理地分发状态和解耦渲染树，彻底规避因 Props Drilling（属性地狱钻取）导致的维护灾难。

## 2. 现代组件抽象模式 (Component Composition)
- **复合组件模式 (Compound Components)**：
  - **理念**：将一个极复杂的全能组件打散为多个隐式共享状态的子组件（如经典的 `<Select>`, `<Select.Option>`, `<Select.Trigger>`）。
  - **实现**：依托 React 的 Context API 或 Vue 的 Provide/Inject，让使用者能够绝对自由地组合和布局子组件元素，而无需开放几十个布尔值 Prop。
- **控制反转与 Render Props / Slot**：
  - **理念**：父组件负责管理极度复杂的行为状态（比如拖拽状态、异步长列表加载状态），但将“呈现样貌”的主导权通过函数回调或插槽 (Slots) 全权交还给调用者。
  - **实现**：React 中通过 `renderItem={(item) => <UI />}`，Vue 通过具名插槽 `<template #item="props">` 落地。
- **受控与非受控双轨模式 (Controlled / Uncontrolled)**：
  - 对于可复用的原子级输入组件，应当支持通过提供内部 `defaultValue` 运行在隔离的“非受控”高性能状态下；同时也必须支持传入 `value` + `onChange` 被外部劫持为“受控”组件，以融合复杂的外部表单流。

## 3. 状态与逻辑剥离模式 (Logic Extraction)
- **自定义 Hooks (Hooks Pattern)**：
  - **铁律**：视图组件（UI Component）内不应有超过 10 行的深层业务加工逻辑。
  - 所有涉及异步请求编排、本地数据计算、浏览器副作用 (LocalStorage / IntersectionObserver) 的行为，必须抽离为完全去 UI 化的纯净自定义 Hook。
- **容器与展示组件隔离 (Container & Presentational Components)**：
  - 尽管 Hooks 弱化了传统的 HOC (高阶组件)，但宏观的隔离思想依然坚固：
  - **展示组件 (Dumb Component)**：绝对纯净，只依赖传入的 Props 执行渲染，无外部副作用，非常易于配置 Storybook 与单测。
  - **容器组件 (Smart Component)**：不包含任何布局 DOM，专职向服务端获取数据、拦截异常、编排状态下发给子展示组件。

## 4. Design 必填问题

- 哪些组件是业务容器，哪些是可复用展示组件？
- 是否存在可复用组件族，需要 compound component 或 slot 设计？
- 复杂状态机是否应抽成 hook / composable？
- 组件 API 是受控、非受控还是双模式？
- 需要哪些 Storybook / Histoire 示例状态？

## 5. Spec Review 检查项

- 基础组件不直接请求业务 API。
- 复杂组件没有用几十个布尔 prop 堆状态。
- 可复用组件的 empty、error、loading、disabled 状态可独立演示。
- hook / composable 不依赖具体 UI，便于单测。
