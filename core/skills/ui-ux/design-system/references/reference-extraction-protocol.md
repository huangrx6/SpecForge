# Reference Extraction Protocol

本文件定义如何从外部来源抽取可落地的设计信息。外部来源不能直接复制，只能转译成 SpecForge 的 Design Contract、Composition Recipe、Component Contract、Page Pattern、Visual QA 和 Verification Hooks。

## 1. 抽取原则

- 抽取结构，不复制资产。
- 抽取规则，不复制代码。
- 抽取 pattern，不复制模板。
- 抽取选择理由，不复制视觉结果。
- 所有抽取都必须写 adopt / adapt / avoid。
- 所有抽取都必须受 design_mode 约束。

## 2. 来源类型与抽取项

### 2.1 Component Library

适用于 shadcnblocks components、21st.dev、shadcn-vue、Ant Design、Semi、Element Plus。

抽取：

````md
Component Pattern:
- Component:
- Source:
- Purpose:
- Structure:
- Variants:
- States:
- Density:
- Primitive mapping:
- Project wrapper:
- Props / events / slots:
- A11y:
- Motion:
- Content rules:
- Adopt:
- Adapt:
- Avoid:
````

### 2.2 Block Library

适用于 shadcn/ui blocks、shadcnblocks blocks、21st.dev blocks。

抽取：

````md
Block Pattern:
- Block:
- Source:
- Design mode:
- Section role:
- Layout anatomy:
- Component composition:
- Data requirements:
- State coverage:
- Responsive behavior:
- Adopt:
- Adapt:
- Avoid:
````

### 2.3 Page / Template Library

适用于 shadcnblocks pages/templates、shadcn.io templates、admin templates。

抽取：

````md
Page Pattern:
- Page:
- Source:
- Design mode:
- Primary user:
- Primary object:
- Primary job:
- Navigation:
- Primary work surface:
- Secondary regions:
- Scroll regions:
- State matrix:
- Responsive strategy:
- Adopt:
- Adapt:
- Avoid:
````

### 2.4 Domestic Design Community

适用于站酷、UXUE、UI 中国、MasterGo、Pixso、优设、68Design。

抽取：

````md
Domestic UI Case Pattern:
- Source:
- Sub-source / author / topic:
- Case type:
- Industry:
- UI type:
- What is reusable:
- Information density:
- Typography / spacing observations:
- Surface / visual completion:
- Content / microcopy observation:
- UX / IA lesson:
- Adopt:
- Adapt:
- Avoid:
````

注意：

- 不要写“站酷品牌气质”。
- 必须说明具体参考的是作品、文章、素材、设计团队、教程、资源社区、行业案例还是 UI 页面。
- 如果只知道来源网站，不知道具体子来源，写 `sub_source: unknown`，不要假装知道。

### 2.5 Award / Inspiration Gallery

适用于 Awwwards、Crafted、炫网站等。

抽取：

````md
Inspiration Pattern:
- Source:
- Case / category:
- Design mode:
- Atmosphere:
- Layout rhythm:
- Typography:
- Motion:
- Interaction:
- Media strategy:
- Signature carrier:
- Reduced motion / fallback:
- Adopt:
- Adapt:
- Avoid:
````

Product UI 限制：

- Awwwards / Crafted 的动效和视觉表达默认不进入高频后台表格、表单和数据页。
- 只允许用于 Hybrid 展示区、onboarding、空态、低频欢迎页或 Brand Surface。

## 3. Adopt / Adapt / Avoid 标准

每个外部来源必须写：

````md
Adopt:
- 可以直接采用的抽象规则，例如 layout anatomy、component state、density、navigation pattern。

Adapt:
- 必须为当前项目改造的内容，例如 React -> Vue、Brand Surface -> Product UI、英文信息密度 -> 中文信息密度。

Avoid:
- 不允许复制或不适合当前项目的内容，例如付费模板代码、图片、文案、装饰性动效、generic SaaS shell。
````

## 4. Vue + shadcn-vue 转译规则

当来源是 React shadcn / Next.js / Tailwind：

````md
Vue Translation:
- React component:
- shadcn-vue primitive:
- Needed wrapper:
- Props:
- Events:
- Slots:
- State owner:
- Tailwind / CSS variable mapping:
- Motion implementation:
- Unsupported parts:
````

禁止：

- 直接复制 React hooks / client component / Next.js routing。
- 直接复制模板文件结构。
- 让 React-only block 决定 Vue 技术架构。

## 5. 输出到 Design Contract

抽取结果必须进入：

- `Reference Selection`
- `Reference Scan Manifest`
- `Extracted Reference Patterns`
- `Composition Source Notes`
- `Design Contract JSON.reference_selection`
- 需要时进入 `Design Contract JSON.foundation_system.source_basis`
- 需要时进入 `01-spec/design/components/<component-name>.contract.md`
