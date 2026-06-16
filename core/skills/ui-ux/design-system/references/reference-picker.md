# Reference Picker

本文件用于把用户模糊的外部参考诉求转成选择题。用户不需要知道 shadcnblocks、站酷、Awwwards、21st.dev、UXUE、MasterGo、Pixso 等网站各自有什么；用户只需要选择想参考的内容类型，design-system 再自动路由到合适来源。

## 1. 何时使用

当用户出现以下表达时使用本文件：

- “多参考一些好的网站”
- “参考 shadcn 模板”
- “参考 shadcnblocks / shadcn.io / 21st.dev”
- “参考站酷 / UXUE / UI 中国 / 优设 / MasterGo / Pixso”
- “参考 Awwwards / Crafted / 炫网站”
- “我不知道怎么描述，你给我做成选择题”
- “想要后台更好看 / 不像默认模板 / 更像成熟产品”
- “想看看好的 dashboard / admin / table / settings / login / 空态 / 组件封装”

## 2. 核心原则

- 不要求用户说“参考某网站风格”。网站不是风格名，而是资源池。
- 用户选择参考目标，Agent 负责来源路由。
- 外部来源只能抽取 pattern、layout anatomy、component anatomy、state coverage、visual completion、motion boundary、UX / IA 方法和 anti-reference。
- 不复制外部代码、图片、截图、插画、文案、付费模板或商业资产。
- React shadcn 资源只能转译为 shadcn-vue component contract / project wrapper。
- Product UI 后台默认不引入品牌页式动效；动效必须服务状态反馈、空间关系、进度或低频品牌入口。

## 3. 用户选择题

### 3.1 UI 类型

请先让用户选择本次要设计的界面类型，可多选：

````md
这次要设计哪类界面？可多选。

A. 后台 / 管理端 / 工作台
B. 数据表格 / 列表详情 / CRUD
C. Dashboard / 数据看板
D. 设置页 / 账号 / 权限 / 团队管理
E. 登录 / 注册 / 邀请 / Onboarding
F. AI 助手 / 命令面板 / Chat UI
G. 官网 / landing / 品牌展示页
H. 移动 H5 / 小程序风格页面
I. 空态 / 引导 / 错误页
````

路由提示：

- A / B / C / D 默认 Product UI。
- G 默认 Brand Surface。
- A + G、F + A、E + 产品内欢迎页默认 Hybrid。
- I 可以是 Empty State，也可以是 Product UI 的局部状态。

### 3.2 参考目标

````md
你希望参考什么？可多选。

A. 组件封装：按钮、表格、表单、弹窗、上传、空态、图表等怎么封装
B. 页面结构：dashboard、sidebar、settings、list-detail、login 等整页结构
C. 区块组合：chart group、data table、application shell、stats card、toolbar
D. 视觉完成度：减少默认感、模板感、廉价感
E. 动效：进入退出、状态反馈、滚动、数据变化、品牌动效
F. 国内设计案例：中文产品、国内审美、B 端 / C 端案例
G. 行业案例：金融、电商、教育、AI、SaaS、内容、文旅、医疗等
H. UX / 信息架构：导航、流程、表单、状态、错误恢复、微文案
````

### 3.3 借鉴强度

````md
参考强度选一个：

A. 保守：只参考结构和组件，不改变整体视觉
B. 中等：参考结构 + 部分视觉细节，如间距、层级、圆角、动效
C. 明显：允许形成更强的视觉 signature，但仍不复制外部素材
D. 只做审查：不用新风格，只检查现在是否像模板、是否廉价
````

默认建议：

- Product UI 默认 B。
- Brand Surface 默认 B 或 C。
- 局部组件默认 A。
- 视觉审查默认 D。
- 用户没有明确选择时，采用可逆默认，并在 Design Contract 写 `human_confirmation.status: "defaulted"`。

### 3.4 后台模块

如果用户选择后台 / 管理端 / 工作台，继续问：

````md
如果是后台 / 管理端，请选择需要重点参考的模块：

A. Sidebar / 顶部导航 / 应用壳
B. Dashboard 首页 / 工作台
C. Data Table / 筛选 / 批量操作
D. 图表 / 指标 / 趋势分析
E. 表单 / 多步骤流程
F. 用户管理 / 权限 / 团队
G. 设置页 / 个人资料 / 集成
H. 登录 / 注册 / 邀请
I. Toast / Dialog / Drawer / Sheet
J. Empty / Loading / Error / Permission 状态
````

### 3.5 视觉方向

不要让用户选择抽象设计术语。使用下面的自然语言选项：

````md
希望视觉整体更接近哪种？

A. 干净专业：少装饰，适合企业后台
B. 高密度效率：信息多，但层级清楚
C. 轻品牌感：比普通后台更有识别度，但不花
D. 科技感：适合 AI / 数据 / 开发者工具，但不要青紫霓虹模板
E. 国内互联网产品感：中文信息密度、运营感、业务感更强
F. 设计作品级完成度：希望明显不像默认模板
G. 温和友好：适合教育、内容、协作类产品
H. 暗色专业：适合监控、数据、开发者、指挥台
````

### 3.6 技术约束

````md
技术约束：

A. Vue + shadcn-vue
B. Vue + Element Plus
C. React + shadcn/ui
D. Tailwind only
E. 已有组件库，不能换
F. 不确定，需要系统推荐
````

如果选择 Vue + shadcn-vue：

- React shadcn blocks 只能作为 pattern source。
- 必须输出 shadcn-vue primitive mapping。
- 必须定义 project wrapper。
- 不允许直接复制 React 代码。

## 4. 默认 Preset

### 4.1 Vue + shadcn-vue 后台优化

当用户说“Vue + shadcn-vue 后台”“shadcn-vue admin”“后台不要模板感”时，默认使用：

````md
UI 类型：
- 后台 / 管理端 / 工作台
- Dashboard / 数据看板
- 数据表格 / 列表详情 / CRUD

参考目标：
- 组件封装
- 页面结构
- 区块组合
- 视觉完成度
- 状态系统

借鉴强度：
- 中等

后台模块：
- Sidebar / 顶部导航 / 应用壳
- Dashboard 首页 / 工作台
- Data Table / 筛选 / 批量操作
- 图表 / 指标 / 趋势分析
- Empty / Loading / Error / Permission 状态

视觉方向：
- 干净专业
- 高密度效率
- 轻品牌感

技术约束：
- Vue + shadcn-vue
````

默认来源路由：

- shadcn/ui blocks：dashboard / sidebar / login / data table anatomy only。
- shadcnblocks blocks：application shell、dashboard、data table、chart group、sidebar。
- shadcnblocks components / 21st.dev：组件变体、状态和封装参考。
- shadcn-vue：primitive mapping 和 registry / wrapper 可行性。
- Vue admin 模板：后台工程结构、权限、菜单、主题、路由和状态。
- 站酷 / UXUE / UI 中国 / MasterGo / Pixso：国内 UI 案例、中文信息密度、视觉完成度和设计方法。
- Awwwards：默认 N/A；只有 Hybrid、品牌入口、onboarding、空态或用户明确选择动效时才使用。

## 5. Reference Selection 输出格式

````md
Reference Selection:
- UI type:
- Stack:
- Selected needs:
- Borrow strength:
- Admin modules:
- Visual direction:
- Source routing:
- Reuse boundary:
- Offline behavior:
- Human confirmation:
````

## 6. Design Contract JSON 字段

````json
{
  "reference_selection": {
    "ui_type": [],
    "stack": [],
    "selected_needs": [],
    "borrow_strength": "",
    "admin_modules": [],
    "visual_direction": [],
    "source_routing": [],
    "reuse_boundary": [],
    "offline_behavior": "",
    "human_confirmation": {
      "status": "confirmed | defaulted | pending",
      "reason": ""
    },
    "forbidden": []
  }
}
````
