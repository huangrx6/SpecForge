# Reference Workflow

把外部参考从“看了某个网站”变成可审查的 Selection -> Routing -> Evidence -> Extraction -> Output 链路。用户只表达参考意图；Agent 负责来源路由、观察、抽取、复用边界和禁止复制项。

外部来源不是风格名，也不是可复制资产库。它们只能提供 pattern、layout anatomy、component anatomy、state coverage、visual completion、motion boundary、UX / IA 方法、source basis 和 anti-reference。

## 1. Trigger

读取本文件：

- 用户说“多参考一些好的网站 / 模板 / 案例”。
- 用户给 URL、截图、模板站、设计社区、shadcn blocks、国内案例。
- 用户要求“后台更好看 / 不像默认模板 / 更像成熟产品”。
- 用户想参考 Awwwards、Crafted、粒子动效、滚动叙事、GSAP、Three.js 或高级网站。
- 页面缺少目标用户、任务、导航、恢复状态、微文案或 UX / IA 证据。

如果用户给真实 URL / 截图 / 模板站，必须按 `## 5. Live Evidence Protocol` 输出 `reference_evidence`。无法访问时写 catalog / offline fallback，不允许假装已浏览。

## 2. Selection Fields

`reference_selection` 的字段和 enum 权威是 `contracts/design-contract.schema.json#/$defs/referenceSelection`；本文件不维护第二份枚举表。选择时只判断六类意图：UI type、selected needs、borrow strength、stack、visual direction、admin modules。

Product UI / admin 默认：`borrow_strength: moderate`，needs 包含 page-structure、component-wrapper、visual-completion、state-system；local component 默认 conservative；visual critique 默认 review-only。

## 3. Source Routing

Route by the design question, not by the source's fame:

- `component-wrapper`：shadcnblocks、21st.dev、shadcn-vue、Ant Design、Semi、Element Plus；抽 component anatomy、variants、states、density、primitive mapping、wrapper、a11y；只做 `component-contract-only`。
- `block-composition` / `page-structure`：shadcn/ui blocks、admin templates、Vue admin repos；抽 section anatomy、navigation、primary work surface、state matrix、responsive；只做 `pattern-only` / `page-pattern-only`。
- `state-system` / `ux-ia`：Vue admin templates、Ant Design、Semi、TDesign、Arco、Element Plus、UXUE、优设、product docs；抽权限、route/menu/tabs、table/form/drawer/settings、恢复路径、microcopy、a11y；只做 `method-only`。
- `visual-completion` / `domestic-ui-case` / `industry-case`：ZCOOL、UXUE、UI China、MasterGo、Pixso、优设、68Design、真实产品站；抽 hierarchy、typography rhythm、surface、Chinese density、industry operation、anti-reference；只做 `inspiration-only`。
- `motion`：Awwwards、Crafted、21st.dev、Motion / GSAP examples；抽 purpose、trigger、duration、reduced motion、fallback、verification；只做 `inspiration-only`。

Avoid：copy React / unknown-license code、paid templates、assets、screenshots、copywriting；把 KPI cards 当 dashboard job；把 sidebar + topbar 当结构；把 tooltip / toast 当 UX；把 Brand Surface motion 带入高频 Product UI。

Product UI guardrail：Awwwards / Crafted / GSAP / Three.js 默认 N/A，除非是 Hybrid、Brand Surface、onboarding、empty state、AI tool trace、data spatial surface 或用户明确要 motion。

## 4. Evidence And Reuse Gates

每个 used source 都要写 access status、viewport / interaction when relevant、adopt / adapt / avoid 和 fallback。Gate rules：`license_unknown` 抽 pattern 不复制；`paid_or_pro` 只用公开结构观察；`react_only` 翻译为 Vue / shadcn-vue contract；`inspiration_gallery` 只进 extraction / creative direction；`product_ui` 禁止 hero scroll narrative、Three.js background、decorative bloom 或 looping float 污染高频控件；`external_unavailable` 用 catalog fallback；`user_screenshot` 抽 atmosphere / layout / token / do-don't，不假设资产归属。

## 5. Live Evidence Protocol

只要用户提供网站、模板、设计社区、截图，或要求“多看一些好网站”，就必须产出可审查的 `reference_evidence`，而不是只写“参考了某站”。

Live evidence 是状态采样，不是风格感受。能访问时至少看 desktop first viewport；如果站点依赖滚动、菜单、视频、3D、hover、filter、form、pricing toggle 或 mobile navigation，必须追加对应状态。不能访问时写 `offline-fallback`，并说明不能确认哪些体验。

Access modes：`catalog` 记录 source id、用途、fallback 和未访问原因；`static` 记录桌面首屏和可抽取 pattern；`scroll` 记录首屏 / 中段 / 尾段、scroll behavior 和 motion purpose；`interactive` 记录交互步骤、状态变化、fallback 和可用性风险；`comparative` 记录每个来源 adopt / adapt / avoid 和选择理由；`offline-fallback` 记录不能确认的体验。

Scan path：确认来源身份 -> 桌面首屏 -> 移动窄屏 when relevant -> 滚动到节奏变化处 -> 交互影响体验的控件 -> 截取 pattern lesson -> 写 adopt / adapt / avoid -> 记录 license、confidence 和 reuse boundary。不要逐像素复刻，也不要只看首页 hero 就宣布“已调研”。

Observation lenses：first viewport、layout rhythm、typography、color / material、media strategy、motion、interaction、Product UI boundary。不要逐项灌水；只记录能改变设计选择的证据。

Evidence record 以 `contracts/design-contract.schema.json#/$defs/referenceEvidence` 为权威，最少包含 source、access、viewport、observed、borrowed、rejected、confidence；Markdown 可用短表格补充 source_url、state、adopt / adapt / avoid。

Fauna-like robotics sites teach real product media, friendly trust, capability video and section rhythm. CRAV-like food sites teach oversized type, object cutouts, playful collisions and photography as composition actors. Awwwards motion sites teach scroll scene, spatial transition and media choreography. Treat them as pattern lessons, not styles to copy.

## 6. UX / IA Add-on

当页面缺用户证据、导航、任务路径或恢复状态时，选 `selected_needs: ux-ia`，并输出 UX / IA 摘要。不要虚构完整 persona；没有真实研究时只能写 `Persona-lite assumption` 并标注需要用户确认。

Lens：User -> persona-lite / role difference / context；Task -> primary task / success criteria；Pain -> pain point / workaround；IA -> navigation / scroll regions / page hierarchy；Recovery -> error / permission / offline / retry path；A11y -> keyboard / focus / contrast / touch target / reduced motion。

Rules：主导航按任务分组；不要默认“后台就侧边栏”；3 步以上流程有位置、返回和确认；失败重试不丢有效输入；无结果、无权限、加载失败、首次无数据必须分开；按钮写“动词 + 对象 + 范围”；输入有 label、focus visible、44 x 44 CSS px 触控目标，状态不能只靠颜色。

## 7. Extraction Matrix

所有抽取都写 Adopt / Adapt / Avoid，优先紧凑表格。

Required capture：Component -> component、source、purpose、structure、variants、states、density、primitive mapping、wrapper、a11y、motion、content；Block -> section role、layout anatomy、component composition、data requirements、state coverage、responsive；Page -> primary user / object / job、navigation、primary work surface、secondary regions、scroll regions、state matrix；Domestic / Inspiration -> source、case type、industry、atmosphere、density、rhythm、typography、surface、motion、UX / IA lesson、signature carrier、fallback；UX / IA -> user、task、context、navigation、recovery paths、microcopy、a11y、high-impact unknown。

If only the source website is known, write `sub_source: unknown`; do not invent case names. Brand Surface references for Product UI must be translated into density、state coverage、component hierarchy and task efficiency, not hero scale. For advanced sites, extract the interaction's job: reveal content, compare states, orient space, dramatize product material, or support memory. Decorative wow without a job becomes anti-reference.

## 8. Domestic Case Extraction

站酷、UXUE、UI 中国、MasterGo、Pixso、优设、68Design 等国内来源进入参考链路时，在本文件内抽取。国内来源可能是作品、文章、课程、资源、设计系统、团队作品集、UI case 或行业案例；不要写成单一“品牌气质源”。

Capture：source、sub_source / author / topic、case type、industry、UI type、reusable pattern、information density、Chinese content structure、typography、spacing、surface / visual completion、interaction / flow lesson、empty / error / permission pattern、microcopy lesson、adopt、adapt、avoid。

优先抽取中文后台信息密度、国内产品操作路径、B 端层级、表格 / 筛选 / 批量操作、中文微文案、导航 / 列表 / 标签 / 表单模式和完成度。禁止复制图片 / 截图 / 文案 / 商业素材；未知子来源写 `sub_source: unknown`。

## 9. Vue Translation

React shadcn / Next.js / Tailwind 来源只能转成 Vue / shadcn-vue 合同。Capture：React source concept、shadcn-vue primitive、needed project wrapper、props / emits / slots、state owner、Tailwind / CSS variable mapping、motion implementation、unsupported parts。

Do not copy React hooks, Next.js routing, template file structure, screenshots, images, icons, copywriting or paid template assets.

## 10. DESIGN.md Extraction

当用户给参考网站、截图或品牌材料，且需要把“整体感觉”转成 SpecForge 可执行设计语言时，在 Reference Output 中追加 DESIGN.md extraction。禁止照抄品牌身份；每条规则都要能落到 token、组件、页面、动效或禁用项。

Capture：visual theme、color roles、typography rules、component styling、layout principles、depth / elevation、motion / interaction、do / don't、adopt / adapt / avoid、agent prompt guide、Pencil handoff suggestions。

必须说明哪些参考规则不适合当前宿主项目。缺 live evidence 时，只能输出 catalog / offline fallback，不要假装已浏览。

## 11. Output

当 reference 被使用时，Markdown 输出 Reference Selection、Reference Scan Manifest、Extracted Reference Patterns、UX / IA Summary（如适用）；JSON 输出 `reference_selection`，有真实 URL / 截图 / 模板证据时还输出 `reference_evidence`。

The Design Contract JSON field is `reference_selection`; schema and `references/output-contract.md` own exact structure. If no external reference is used, omit `reference_selection` and record `reference_selection: no external reference requested` in `scan_manifest.skipped_with_reason`.

## 12. Stop Conditions

- URL provided but no access status.
- Claiming a site was scanned without viewport, observation or artifact.
- Copying external images, screenshots, text, paid template code or brand elements.
- Treating a website name as a style name.
- Bringing Brand Surface motion into high-frequency Product UI without a Product UI purpose.
