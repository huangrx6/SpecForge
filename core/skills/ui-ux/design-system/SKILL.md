---
name: design-system
description: SpecForge UI 设计规范 skill；用于可见体验、设计语言、Design Contract、组件契约、token、动效、视觉 QA 和跨阶段交接。凡涉及新页面、页面重构、后台 / 品牌页 / Web3 / AI / 大屏 / 移动 H5 / 组件系统、Pencil handoff、截图审查、去廉价感、动效或 shadcn-vue UI 落地时，都应使用本 skill。
---

# Design System Skill

本 skill 是 SpecForge 的 UI 设计系统入口。它不直接承载全部规则；它负责选择最短读取路径，并把颜色、字体、组件、动效、Pencil handoff requirements、视觉 QA 和实现提示汇总到同一个 Design Contract。

## 什么时候使用

使用本 skill：新页面、页面重构、可见组件、后台 / 管理端 / Dashboard / 大屏 / 移动 H5；用户说“不好看 / 廉价 / AI 味 / 老套 / 想更高级 / 参考优秀网站 / 模板 / 国内后台感觉”；用户提到 shadcn-vue、shadcnblocks、shadcn.io、21st.dev、站酷、UXUE、Awwwards、Crafted、MasterGo、Pixso、UI 中国、优设、Vue admin 模板；需要 GSAP、Three.js、粒子、滚动叙事、生成图片 / 3D / 视频 / 纹理或正式 Pencil handoff；后续阶段需要读取 token、组件、状态、动效、Visual QA 或 verification hooks。

不调用：纯后端、纯数据迁移、无 UI 表面的脚本任务。只改文案、图标或单个状态时，用 `local-component` profile。

## 入口协议

Protocol：先读 `references/read-profiles.md` 选 profile 和 design mode；按最短链路读取，只在需要时追加 reference、asset、motion、Pencil 或 calibration；除 `local-component` 外，先做 Creative Direction；输出前读 `references/output-contract.md` 和 `references/visual-qa-detectors.md`；完整编排或多 profile 合并时使用 `references/read-profiles.md#Full-System Orchestration`。Profiles：`local-component` 单组件 / 小状态 -> compact；`product-page` 后台主任务 -> standard；`brand-surface` 官网 / 作品集 / 活动页 -> full；`visual-calibration` 视觉反馈 / 截图修正 -> compact / standard；`full-system` 完整设计系统 / 复杂 Hybrid -> full。

如果实际读取超过 profile 必读链路 2 个以上文件，必须在 `scan_manifest.scanned_files` 或 `scan_manifest.skipped_with_reason` 中说明升级原因。

## Add-on 路由

Add-ons：Creative Direction -> `references/creative-direction.md`；Reference Workflow -> `references/reference-workflow.md`、`data/reference-source-catalog.csv`、`contracts/design-contract.schema.json#/$defs/referenceSelection`；Shadcn resource audit -> `components/component-system.md#Shadcn Resource Audit`；Domestic case extraction -> `references/reference-workflow.md#Domestic Case Extraction`；Asset Brief -> `references/motion-block-library.md#Asset Brief Add-on`；Motion Block -> `references/motion-block-library.md`；Component System -> `components/component-system.md`、`contracts/component-contract.template.md`；Pencil Handoff -> `references/read-profiles.md#Pencil Handoff Add-on`。

Reference Workflow 负责“参考什么、从哪里参考、抽取什么、禁止什么”。外部网站必须有 access / viewport / observation / fallback 记录；没有证据就不能写“已参考”。

## 输出契约

所有 profile 都输出 `Design Contract Summary` 和 fenced `Design Contract JSON`。入口文件不维护 required 字段清单；字段权威只看 `contracts/design-contract.schema.json` 和 `references/output-contract.md`。

`ui-design.md` 的写入位置、条件字段、组件矩阵、Pencil handoff、停止条件和 cross-stage payload map 全部以 `references/output-contract.md` 为准。入口只决定读取路径和 add-on；输出前按 schema 顶层 `required`、条件化 `allOf` 和 quality gate 检查。

## 工作原则

Principles：外部网站是证据和 pattern 来源，不是风格名或资产库；Creative Direction 决定为什么这样设计，palette / 组件 / 动效只是落地手段；Product UI 的高级感来自真实工作面、对象关系、状态推进、命令效率和异常恢复；Brand Surface / Hybrid 可以有 signature，但必须有 fallback、reduced motion、asset plan 和验证方式；React shadcn 资源必须转译为 shadcn-vue primitive、project wrapper、props、events、slots 和 state owner；未确认 license、付费模板、商业资产、截图、插画、文案只能抽象为 pattern；需要图片或 3D 而模型不能生成时，输出 asset prompt 和目标路径。

## 阻断摘要

不允许进入 Pencil handoff / technical design / implementation：

- 没有 read profile，或小任务默认走 `full-system` 且没有升级理由。
- 非小修 UI 缺 `creative_direction`。
- 有外部参考诉求但缺 `reference_selection`、来源路由、复用边界、禁止项或 `reference_evidence`。
- 需要素材却缺 `asset_manifest`；使用高级 motion 却缺 `interaction_signature`。
- Design Contract JSON 缺 required fields，或与 `contracts/design-contract.schema.json` 不一致。
- `human_confirmation.status` 仍是 `pending`，或 agent 推荐被写成用户 confirmed。
- `selected_data` 与 `selection_rationale` 不一致。
- Product UI / Hybrid 缺真实工作表面、状态矩阵或 `product_ui_quality`。
- high severity `visual_qa` issue 仍是 `pending` / `blocked`。
- GSAP / Three.js 没有 fallback、reduced motion 和 verification。

## 完成标准

Done when：`ui-design.md` 说明为什么这样设计；Markdown Summary 和 Design Contract JSON 同步且可解析；外部参考有选择题、来源路由、扫描证据、adopt / adapt / avoid、复用边界和禁止项；Product UI 没有 empty dashboard skeleton、KPI wallpaper、card soup 或 primitive pile；Brand Surface / Web3 / AI 避免默认 cyan + violet + rose + glow 模板，并有 signature、fallback 和 reduced motion；后续阶段能直接读取 token、组件、状态、动效、Pencil handoff requirements、Visual QA 和 verification hooks。
