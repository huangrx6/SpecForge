# Reference Source Routing

本文件负责把 Reference Picker 的用户选择映射到合适的外部来源池。来源池不是风格名，而是资源类型：组件、区块、页面、模板、国内 UI 案例、动效案例、UX / IA 方法、设计系统或后台工程模板。

## 1. Source Types

| Source type | 说明 | 代表来源 | 默认复用方式 |
|---|---|---|---|
| component-library | 组件库 / 组件市场 | shadcnblocks components、21st.dev、shadcn-vue、Ant Design、Semi、Element Plus | component contract only |
| block-library | 区块库 | shadcn/ui blocks、shadcnblocks blocks、21st.dev blocks | layout anatomy / section pattern |
| page-template-library | 页面 / 模板库 | shadcnblocks pages/templates、shadcn.io templates、satnaing-shadcn-admin | page pattern / navigation / state matrix |
| admin-template | 后台工程模板 | Vue Vben Admin、Soybean Admin、vue-pure-admin、Fantastic Admin | product UI structure / implementation feasibility |
| design-community | 设计社区 / 作品池 | 站酷、UI 中国、MasterGo、Pixso、优设、68Design | visual completion / domestic UI density / case pattern |
| award-gallery | 国际案例 / 奖项网站 | Awwwards、炫网站、Crafted | brand surface / motion / interaction / typography |
| ux-method-source | UX / IA 方法来源 | UXUE、优设、站酷文章、Ant Design、Semi Design | UX grounding / IA / copy / recovery pattern |
| design-system-source | 企业级设计系统 | Ant Design、Semi、TDesign、Arco、Element Plus | component behavior / token / accessibility / Product UI constraints |

## 2. Routing Rules

### 2.1 用户选择“组件封装”

优先来源：

- shadcnblocks components
- 21st.dev
- shadcn-vue
- Ant Design
- Semi Design
- Element Plus

抽取：

- component anatomy
- variants
- states
- density
- shadcn-vue primitive mapping
- project wrapper
- a11y
- content rules
- anti-patterns

禁止：

- React 组件直接进入 Vue 实现
- 未确认 license 的代码复用
- 只复制视觉而不定义 states / props / slots / events

### 2.2 用户选择“区块组合”

优先来源：

- shadcn/ui blocks
- shadcnblocks blocks
- 21st.dev blocks

抽取：

- section anatomy
- layout role
- data density
- responsive behavior
- navigation relation
- state placeholder
- component composition

禁止：

- 把 block 当作完整业务页面
- 把 KPI card / chart group 直接当 dashboard 主任务
- 不做 Product UI Layout Audit 就复制 dashboard layout

### 2.3 用户选择“整页 / 页面结构”

优先来源：

- shadcnblocks pages
- shadcnblocks templates
- shadcn.io templates
- satnaing-shadcn-admin
- Vue Vben Admin
- Soybean Admin
- vue-pure-admin

抽取：

- page map
- navigation decision
- layout archetype
- scroll regions
- primary work surface
- state matrix
- responsive strategy

禁止：

- 直接复制付费模板
- 把 React / Next.js 页面文件直接用于 Vue
- 复制模板文案、品牌资产或截图

### 2.4 用户选择“后台产品结构”

优先来源：

- Vue Vben Admin
- Soybean Admin
- vue-pure-admin
- Ant Design Pro 类模式
- Semi Design / Ant Design / TDesign / Arco / Element Plus docs
- shadcn admin templates

抽取：

- app shell
- permission / role model surface
- route / menu / tab pattern
- table / form / drawer / settings pattern
- state ownership
- Product UI Layout Audit evidence

禁止：

- 只复制 sidebar + topbar + KPI cards
- 使用 brand hero、滚动叙事、Three.js 背景污染后台
- 让快捷入口替代真实工作表面

### 2.5 用户选择“视觉完成度”

优先来源：

- 站酷
- UXUE
- UI 中国
- MasterGo 资源社区
- Pixso 资源社区
- 优设
- Awwwards
- Crafted
- 炫网站

抽取：

- composition quality
- information hierarchy
- typography rhythm
- surface treatment
- icon / illustration discipline
- Chinese UI density
- visual anti-reference
- industry-specific material

禁止：

- 写“站酷品牌气质”
- 复制图片、插画、截图、文案或付费素材
- 让审美来源覆盖 design_mode 边界
- 把 Brand Surface 装饰带进 Product UI 高频控件

### 2.6 用户选择“动效”

优先来源：

- Awwwards
- 21st.dev
- Motion examples
- GSAP examples
- Crafted

抽取：

- motion purpose
- trigger
- duration budget
- easing personality
- reduced motion
- fallback
- verification method

Product UI 默认：

- 只允许 hover / focus / loading / drawer enter-exit / toast / skeleton / row highlight 等状态反馈。
- 不允许 hero scroll narrative、Three.js 背景、循环漂浮、decorative bloom。

Brand Surface / Hybrid：

- 可以选择一个主 signature。
- 必须写 fallback、reduced motion 和性能预算。

### 2.7 用户选择“国内设计案例”

优先来源：

- 站酷
- UXUE
- UI 中国
- MasterGo
- Pixso
- 优设
- 68Design

抽取：

- 中文信息密度
- 国内产品 UI 完成度
- 行业页面组织
- 运营 / 内容 / 会员 / 活动 / B 端管理模式
- microcopy tone
- typography and spacing habit
- common anti-patterns

禁止：

- 把国内案例等同于“土味”或“品牌气质”
- 复制商业作品
- 不查上下文就套用营销页视觉

### 2.8 用户选择“UX / 信息架构”

优先来源：

- UXUE
- 优设
- 站酷文章
- Ant Design
- Semi Design
- design-system/references/ux-research-ia.md

抽取：

- user role
- task flow
- information architecture
- form recovery
- empty / error / permission recovery
- microcopy
- accessibility
- progressive disclosure

禁止：

- 只提炼视觉，不解决任务路径
- 用 tooltip / toast 替代结构设计
- 忽略 loading / empty / error / permission / stale 状态

## 3. Source Reuse Gate

每个来源必须经过复用门禁：

| Gate | Rule |
|---|---|
| license_unknown | 不复制代码、图片、截图、插画、文案；只抽象 pattern |
| paid_or_pro | 只使用公开描述、结构观察和抽象 pattern；不内置资产 |
| react_only | 只能转成 Vue / shadcn-vue contract；不能直接实现 |
| inspiration_gallery | 只能进入 Design Reference Extraction；不能进入 implementation |
| product_ui | 不引入 hero、滚动叙事、大面积动效或装饰背景 |
| external_unavailable | 使用 local source catalog，并在 scan manifest 记录 unavailable |
| user_screenshot | 只抽取 atmosphere / layout / token / component / do-don't；不默认保存资产 |

## 4. Reference Source Routing 输出格式

```md
Reference Source Routing:
| Selected need | Source pool | Use for | Reuse mode | Avoid |
|---|---|---|---|---|
| Component wrapper | shadcnblocks components / shadcn-vue | component anatomy, states, primitive mapping | contract only | copy React code |
| Dashboard structure | shadcn/ui blocks / shadcnblocks blocks | app shell, data table, chart group | pattern only | KPI wallpaper |
| Domestic UI cases | ZCOOL / UXUE / UI China | visual completion, Chinese density | inspiration only | copy assets |
```

## 5. Reference Scan Manifest 输出格式

```md
Reference Scan Manifest:
| Source | Type | Access | Used for | Status | Fallback / reason |
|---|---|---|---|---|---|
| shadcn/ui blocks | official blocks | online / offline / catalog | dashboard anatomy | scanned / fallback / skipped | |
| shadcnblocks components | component-library | online / offline / catalog | component variants | scanned / fallback / skipped | |
| ZCOOL / UXUE | design-community | online / offline / catalog | domestic UI cases | scanned / fallback / skipped | |
| Awwwards | award-gallery | online / offline / catalog | motion / interaction | scanned / fallback / skipped | Product UI N/A |
```
