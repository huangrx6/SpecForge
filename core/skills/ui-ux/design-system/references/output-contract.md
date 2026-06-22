# Output Contract

`sf-ui-design` 调用 design-system 后，必须把设计判断归一化到 `ui-design.md`。Markdown 给 reviewer 快速阅读；fenced `Design Contract JSON` 给 `sf-tech-design`、`sf-tasking`、`sf-implement` 和 `sf-verify` 稳定解析。

本文件只负责输出路由、跨阶段 handoff 和阻断条件；JSON 字段结构只看 `contracts/design-contract.schema.json`，质量提示只看 `core/scripts/lib/artifact-quality.mjs`。不要在这里维护第二份完整字段样板。

## Always Output

所有 profile 都输出：`Design Contract Summary`、fenced `Design Contract JSON`、`Design Scan Manifest`、`Visual QA`、`Verification hooks`。

输出前按 schema 顶层 `required`、条件化 `allOf` 和 quality gate 检查一遍。Markdown Summary 只解释为什么这样选；JSON 提供可解析值，不用空对象、空数组、`null`、`"N/A"` 或占位文案绕过质量问题。

`design_mode` 只允许 `Product UI`、`Brand Surface`、`Hybrid`、`Avatar-IP`、`Empty State`。不要写组合值；头像/IP 与空态同时适用时，在 JSON 中增加 `scope: "both"`。

## Conditional Output

Conditional fields：非 `local-component` 输出 Creative Direction / `creative_direction` / workflow `creative_direction`；外部来源输出 Reference Selection / `reference_selection`，有 URL、截图或模板证据时加 `reference_evidence`，workflow `reference` / `live_reference`；素材需求输出 Asset Manifest / `asset_manifest` / `asset_brief`；高级 motion 输出 Interaction Signature / `interaction_signature`；Product UI 或 Hybrid 输出 layout audit / `layout`、`state_matrix`、`product_ui_quality`，非默认 pattern 标记 `product_ui_signature`；Avatar-IP 或 Empty State 输出 `scope`；视觉反馈输出 `visual_calibration` / `calibration`；`.pen` 或正式原型证据只输出 Pencil Handoff Requirements，不加顶层字段，使用 `verification_hooks` 和 handoff section。

不适用的条件不要写空对象；在 `scan_manifest.skipped_with_reason` 记录跳过原因。外部来源未使用时，省略 `reference_selection` 和 `reference_evidence`，并写 `reference_selection: no external reference requested`。声明 workflow marker 后必须输出对应字段，或写清为什么跳过。

## Field Ownership

本节只说明谁负责产生判断；字段 shape 和 enum 回到 schema。

Owners：`creative_direction` -> `references/creative-direction.md`，不能把 Product UI / 管理后台 / 极简科技风当方向名；`reference_selection` / `reference_evidence` -> `references/reference-workflow.md`，只抽 pattern、anatomy、state、UX / IA、source basis 和 anti-reference；`asset_manifest` -> `references/motion-block-library.md#Asset Brief Add-on`；`interaction_signature` / `motion` -> `references/motion-block-library.md`；`layout` / `state_matrix` / `product_ui_quality` -> `references/product-ui-signature-patterns.md`；`color_system` / `foundation_system` / `token_delivery_hint` -> `references/design-composition.md`、foundation packs 和 data CSV；`visual_qa` / `visual_calibration` -> `references/visual-qa-detectors.md`。

## Design Scan Manifest

至少记录控制层、路由层和本次实际读取文件：

Required scan groups：Control / design mode / full-system orchestration -> `references/read-profiles.md`；Composition -> `references/design-composition.md` plus selected foundation / data files；Output -> `references/output-contract.md`、`references/visual-qa-detectors.md`。

`scan_manifest.workflow` 只能使用 schema 中的 enum。`scanned_files` 记录真实读取文件；`selected_data` 只记录 id；`selection_rationale` 解释 why、rejected、risk、confidence，且 id 与 selected data 对齐。

## Cross-stage Handoff

本节是 UI design 给后续阶段的唯一交接入口；不要再维护第二份 cross-stage 文件。后续阶段读取 `Design Contract Summary`、本文件和 schema，再按需要进入组件、foundation、reference 或 motion 文件。

### Payload Map

后续阶段按字段组消费，不重新推导风格：

Payload groups：Direction / reference 防止回到默认后台壳、通用 AI 风格、复制外部来源或越过 reuse boundary；Token / component / layout 把 `color_system`、`foundation_system`、`component_strategy`、`layout` 和 `state_matrix` 转成工程边界；Asset / interaction / motion 把素材 prompt、目标路径、依赖决策、fallback、reduced motion 和验证方式落进任务；QA / verification 由 `visual_qa`、`anti_slop_rules`、`verification_hooks` 和 `scan_manifest.selection_rationale` 驱动。

### Handoff Rules

Rules：JSON 必须符合 schema，required 字段提供可消费值；条件字段不适用时省略，并在 `scan_manifest.skipped_with_reason` 写理由，不能用 `null`、空对象、空字符串、`"N/A"` 或占位数组；`human_confirmation.status` 只有用户明确选择才写 `confirmed`，低风险可逆默认写 `defaulted`，待确认写 `pending`；`scan_manifest.selected_data` 只记录 id，`selection_rationale` 解释 why / rejected / risk / confidence 且与 selected data 对齐；`token_delivery_hint` 只是 technical design 的映射提示；`visual_qa` 是 verify gate，high severity issue 只能 `fixed` 或 `accepted`；`motion.layer_3_gsap` 不使用时写空数组，使用时必须有 `effect`、`fallback`、`verification`。

### Engineering Consumption

前端相关 technical design 必须把 Design Contract 转成工程决策，不重新设计：

Engineering decisions：token delivery 选 CSS variables、Tailwind theme、组件局部变量、Pencil variables 或现有 token；reference / component source 只能抽 pattern，并落到现有组件、shadcn-vue primitive、registry、project wrapper 或 domain component；asset / motion source 写素材目录、license、fallback、CSS / Motion Vue / Vue Bits / GSAP 来源，新增依赖单独确认；state ownership 写 loading、empty、error、permission、stale、partial 归页面、wrapper、hook 还是后端；visual verification 写必须截图的页面 / 状态和 DOM / a11y / unit 可验证范围。

实现阶段使用 semantic tokens 和 project wrapper；不要散落 hex、一次性 Tailwind arbitrary value、未知 license 资产、付费模板、React shadcn 代码或无 reduced motion 的动效。

验证阶段至少覆盖 token adherence、foundation adherence、wrapper states、state matrix、Product UI layout、reference boundary、motion fallback、a11y 和 anti-slop rules。只验证构建或接口不等于 UI 验证完成。

## Summary Template

Summary 是 reviewer 读的，不是 schema 的第二份定义。按实际出现的字段写短摘要，每项 1-2 行：direction、reference、asset、interaction、mode、color、foundation、component、layout、motion、visual QA、verification、anti-slop。完整字段以 JSON schema 为准。

## Component And Page Handoff

`ui-design.md` 只保留组件矩阵和链接；完整组件字段不在这里重复维护。复杂、复用或跨页面组件必须输出独立组件契约：

`01-spec/design/components/<component-name>.contract.md`。组件输出只保留 project component、primitive / companions、wrapper responsibility、states owned、contract file。页面输出只保留 layout archetype、navigation、fixed / sticky regions、primary work surface、state matrix、responsive、microcopy。

## Pencil Handoff

仅当请求 `.pen` 或正式原型证据时输出：

Pencil Handoff Requirements 写 target file、artboards、token groups、component contracts、asset reuse、required evidence。实际 `.pen` 创建、截图、导出和持久化验证由 `core/skills/ui-ux/pencil` 执行。

## Stop Conditions

- 非 `local-component` 输出缺少 Creative Direction。
- 有外部参考却缺少 `reference_selection` 或 `reference_evidence`。
- 需要素材却缺少 Asset Manifest。
- 使用高级 motion 却缺少 Interaction Signature、fallback 或 verification。
- Product UI / Hybrid 缺少主要使用者、业务对象、主要任务、首屏工作表面或状态矩阵。
- Design Contract JSON 缺少 required fields，或字段与 `contracts/design-contract.schema.json` 不一致。
