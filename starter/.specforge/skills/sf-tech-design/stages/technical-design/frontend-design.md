# Frontend Engineering Design — 前端工程子模块

本子模块是 `sf-tech-design` 的内部参考，**只在本次 work item 涉及前端工程实现时读取**。UI 页面地图、视觉风格、线稿和交互状态由 `ui-design.md` 负责；这里只处理工程落地方式。

## 何时读取

- 新增或修改前端路由、页面入口、布局容器、导航结构。
- 新增或调整组件边界、组件复用策略、表单状态、表格/列表交互。
- 新增 API client、前端数据缓存、请求错误处理、loading / retry 工程策略。
- 引入或变更前端构建、脚手架、包管理、类型、lint、测试或环境配置。
- UI 设计已经存在，但实现方式、组件库或状态管理仍需决策。

## 必读输入

- `01-spec/requirements.md`
- `01-spec/ui-design.md`（存在时，读取页面地图、状态矩阵、原型证据和 Design Contract Summary）
- `.specforge/core/skills/ui-ux/design-system/references/cross-stage-handoff.md`
- `.specforge/core/skills/ui-ux/design-system/references/component-system.md`
- `.specforge/core/skills/ui-ux/design-system/references/shadcn-vue.md`（Vue / shadcn-vue 场景）
- `.specforge/core/profiles/README.md`
- 已选或候选前端 profile，例如：
  - `.specforge/core/profiles/frontend/react-vite-tailwind-ts.md`
  - `.specforge/core/profiles/frontend/next-app-router-tailwind-ts.md`
  - `.specforge/core/profiles/frontend/vue-vite-tailwind-ts.md`

如果项目已有前端栈，以 `.specforge/wiki/03-architecture.md` 和现有代码为准；profile 只用于确认沿用、偏离或补齐约束。

## 设计要求

### 路由与页面边界

- 列出新增 / 修改路由、入口文件、布局层级和受影响页面。
- 明确页面之间的数据传递方式：URL params、query、全局状态或后端状态。
- 不在 technical design 重画 UI；只引用 `ui-design.md` 中的页面和状态编号。
- 承接 `ui-design.md#Design Contract Summary` 的导航决策：说明 fixed / sticky / scroll 区域、移动端折叠和实现组件归属。

### 组件边界

- 区分页面容器、业务组件、通用 UI 组件和框架组件。
- 说明哪些复用现有组件，哪些新增业务组件，哪些不新增抽象。
- 对复杂表单、列表、批量操作、上传/下载、审批流等写清组件职责。
- 承接 `ui-design.md#Design Contract Summary`：明确 primitive、companion、project wrapper、pattern component 和 domain component 的层级。
- 使用 shadcn-vue 时，说明 primitive 只承担可访问基础交互；权限、加载、错误、空态、远程数据、审计和批量操作进入 project wrapper。
- 需要跨项目复用时，评估是否建立 shadcn-vue custom registry；registry 只分发稳定 wrapper / hooks / pages，不分发一次性页面拼装。
- 每个新增 project wrapper 必须说明 owner、props/events、状态职责、测试接缝和未来扩展点。

### 状态与数据流

- 明确本地状态、服务端状态、缓存状态和 URL 状态的归属。
- 说明 loading、empty、error、retry、disabled 状态由哪个组件或 hook 管理。
- API client 必须有统一错误处理、鉴权处理和超时 / 取消策略。
- UI 状态必须覆盖 design-system 的 default、loading、empty、filtered-empty、error、permission、success、stale、partial 中适用项。
- 列出 state ownership：页面容器、project wrapper、domain hook、API client 或后端状态分别负责什么。

### Token、动效与 registry

- Token delivery：CSS variables、Tailwind theme、现有项目 token 或组件局部变量。
- Motion source：CSS transition、Motion Vue、Vue Bits、GSAP 或现有动画工具；Product UI 默认不引入装饰型动效依赖。
- React Bits 灵感在 Vue 项目中只作为概念参考，优先找 Vue Bits / Motion Vue 对应实现，并确认依赖、bundle、reduced motion 和可维护性。
- Visual verification hooks：截图页面、关键状态、响应式断点、a11y 路径和动效 reduced-motion。

### 构建与测试

- 新项目或新模块优先使用 profile 推荐的官方脚手架。
- 前端验证至少说明 typecheck、lint、unit/component test、E2E/manual 中适用项。
- 有 UI 影响时，verification 阶段应追溯到 `ui-design.md` 的页面 x 操作 x 角色 x 状态矩阵。

## 必含产出（写入 technical-design.md）

- 前端 profile 选择或 N/A 理由。
- 路由 / 页面入口变更清单。
- 组件边界和状态管理方案。
- Design Contract Summary 的工程承接：token delivery、component source、registry boundary、motion source、state ownership。
- Navigation / Layout handoff：导航模式、固定区、滚动区、移动端收敛和可验证截图点。
- API client / 错误处理 / 加载重试策略。
- 前端验证策略和需要 `sf-verify` 覆盖的页面状态。

## 停止条件

- `ui-design.md` 标记有 UI 影响但尚未完成，无法判断页面 / 状态范围。
- `ui-design.md` 有 Design Contract Summary 但 technical design 未承接 token / wrapper / motion / verification。
- 项目已有组件库或设计系统未知，且本次会引入新组件范式。
- 前端技术栈、包管理器或构建方式不确定，且会影响脚手架或依赖选择。
