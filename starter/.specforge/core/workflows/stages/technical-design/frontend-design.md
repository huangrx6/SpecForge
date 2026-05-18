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
- `01-spec/ui-design.md`（存在时，只引用页面地图、状态矩阵、原型证据）
- `.specforge/core/profiles/README.md`
- 已选或候选前端 profile，例如：
  - `.specforge/core/profiles/frontend/react-vite-tailwind-ts.md`
  - `.specforge/core/profiles/frontend/next-app-router-tailwind-ts.md`
  - `.specforge/core/profiles/frontend/vue-vite-tailwind-ts.md`

如果项目已有前端栈，以 `.specforge/wiki/architecture.md` 和现有代码为准；profile 只用于确认沿用、偏离或补齐约束。

## 设计要求

### 路由与页面边界

- 列出新增 / 修改路由、入口文件、布局层级和受影响页面。
- 明确页面之间的数据传递方式：URL params、query、全局状态或后端状态。
- 不在 technical design 重画 UI；只引用 `ui-design.md` 中的页面和状态编号。

### 组件边界

- 区分页面容器、业务组件、通用 UI 组件和框架组件。
- 说明哪些复用现有组件，哪些新增业务组件，哪些不新增抽象。
- 对复杂表单、列表、批量操作、上传/下载、审批流等写清组件职责。

### 状态与数据流

- 明确本地状态、服务端状态、缓存状态和 URL 状态的归属。
- 说明 loading、empty、error、retry、disabled 状态由哪个组件或 hook 管理。
- API client 必须有统一错误处理、鉴权处理和超时 / 取消策略。

### 构建与测试

- 新项目或新模块优先使用 profile 推荐的官方脚手架。
- 前端验证至少说明 typecheck、lint、unit/component test、E2E/manual 中适用项。
- 有 UI 影响时，verification 阶段应追溯到 `ui-design.md` 的页面 x 操作 x 角色 x 状态矩阵。

## 必含产出（写入 technical-design.md）

- 前端 profile 选择或 N/A 理由。
- 路由 / 页面入口变更清单。
- 组件边界和状态管理方案。
- API client / 错误处理 / 加载重试策略。
- 前端验证策略和需要 `sf-verify` 覆盖的页面状态。

## 停止条件

- `ui-design.md` 标记有 UI 影响但尚未完成，无法判断页面 / 状态范围。
- 项目已有组件库或设计系统未知，且本次会引入新组件范式。
- 前端技术栈、包管理器或构建方式不确定，且会影响脚手架或依赖选择。
