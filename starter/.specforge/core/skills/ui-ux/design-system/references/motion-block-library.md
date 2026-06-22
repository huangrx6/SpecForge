# Motion And Asset Signature Library

把“需要图片 / 3D / 视频 / 纹理”和“想用 GSAP / Three.js / 高级滚动”收束成一个可验证的 signature 入口。设计阶段只决定素材 brief、motion block、依赖边界、fallback 和验证 hook；具体包、renderer、cleanup 和实现代码由 `sf-tech-design` 确认。

## 1. Block Contract

Motion Block 必须写：name、design mode、best for、purpose、trigger、affected elements、implementation boundary、duration / scroll budget、reduced motion、fallback、verification、avoid。

Purpose 只能是 hierarchy、storytelling、feedback、state transition、spatial relation。不要写“高级 / 酷炫 / 科技感”。

### Motion Brief Add-on

当 motion 需要交给后续实现时，在 `interaction_signature` 旁补 brief；不要另读独立 prompt。Capture：motion intent、selected recipe、CSS / Vue Transition owns、motion adapter owns、GSAP / Three.js owns、why heavier layer is necessary or rejected、reduced motion、verification hooks。

### Asset Brief Add-on

当页面需要好看的图片、3D、视频、纹理、插画、透明 PNG、产品物体、品牌场景，或模型环境不能直接生成素材但用户愿意去外部工具生成时，输出 `asset_manifest`。Brand Surface / landing / 作品集 / 活动页默认检查素材；Product UI 只在空态、onboarding、欢迎页、品牌入口、真实对象预览或低频说明面板使用，不能污染高频表格和表单。

`asset_manifest[]` 的字段权威是 schema：`kind`、`target_path`、`purpose`、`prompt_or_source`、`placement`、`required`、`license_note`。fallback、alt text、loading、移动端裁切、reduced motion / no WebGL fallback 和验证方式写到 Implementation Notes、`verification_hooks` 或 `interaction_signature`，不要塞进 JSON 额外字段。

Prompt 必须写 subject、material / lighting、composition role、ratio / transparency、camera、style boundary、negative prompt 和 target path；禁止 vague abstract、假截图、随机 UI、文字、logo、水印或默认科技背景。Mode boundary：Product UI 只用 real object thumbnails、empty-state illustration、onboarding diagram 或低频 brand panel；Brand Surface 可用 real product、generated hero object、texture、video still、scroll layers、3D object；Hybrid 把 welcome / intro asset 和工作面分开；Avatar-IP / Empty State 只做局部角色或插画集。Placement：hero asset 参与构图，重叠文字保留对比和移动 fallback，section asset 角色要有差异；avoid decorative hero inside table page、pure text hero、fake dashboard screenshot、brand asset 降低任务密度、global token pollution。

### Foundation Motion Tokens

先从 `data/foundation-recipes.csv` 的 `recipe_type=motion` 选择 `motion_recipe_id`。动效要和 design mode、页面任务、字体空间密度一起决定，不能在实现阶段临时补“好看点的动画”。

Motion token rules：Feedback 用于点击、提交、成功、错误，100-180ms；Transition 用于页面 / 面板切换，180-280ms 且方向一致；Emphasis 只对一个关键目标使用；Loading 优先骨架、进度和可取消状态。

默认只动画 `opacity` 和 `transform`；颜色、边框、背景可用于 hover / focus。禁止动画 `top`、`left`、`width`、`height`、`margin`、`padding`、`grid-template-*`。超过 hover / focus 的动效必须有 reduced motion：保留状态变化，移除位移和长时间编排。

## 2. Motion Blocks

Block map：Sticky Stack / Horizontal Pan 用于 Brand Surface / Hybrid walkthrough、作品集、流程和时间线，layer 通常是 GSAP ScrollTrigger，purpose 是分段叙事或空间旅程，避免每屏 sticky 或移动端横向劫持；Kinetic Type Reveal / Text Mask Media / Object Parallax Layers 用于品牌首屏、产品视频、机器人、餐饮和实物品牌，layer 是 CSS / Motion / GSAP，purpose 是让文字、媒体或对象成为构图主角，避免无真实媒体、遮挡 CTA 或污染后台标题；Scroll Path / Particle Field 用于流程、物流、协议、数据场和音乐 / 游戏，layer 是 SVG / GSAP / CSS scroll-driven 或 Three.js / shader，purpose 是路径、空间和品牌材质，避免装饰线条和默认科技背景；Tool Trace Timeline / Object-to-Inspector / Live Data Pulse 用于 AI 调用、导入导出、列表详情、告警和监控，layer 是 GSAP timeline、Motion / Flip 或 CSS，purpose 是步骤、对象关系和数据新鲜度，避免抽象 loading、拖慢表格扫描或高频闪烁。

## 3. Layer Decision

默认从轻到重选择。不要因为页面想显得高级就跳到 GSAP / Three.js。

Layer order：CSS transition 负责 hover、focus、active、drawer、popover、toast、skeleton，无新增依赖；Vue motion adapter 负责 presence、enter / exit、轻量列表错峰、对象状态切换，必须是项目批准 adapter 或 local wrapper；GSAP timeline / Flip / ScrollTrigger 只用于多步骤流程、AI 工具调用、品牌首屏、滚动叙事、大屏编排，需要 Vue lifecycle cleanup；Three.js / TresJS 只用于 3D 产品、空间数据、shader / particle signature，需要 renderer、asset budget 和 static fallback。

React / R3F / Drei examples are reference sources only. Vue projects must translate them into a Vue component contract before implementation; do not paste React snippets into Vue code.

## 4. Selection Rules

Rules：Product UI 默认只选 Tool Trace Timeline、Object-to-Inspector、Live Data Pulse 中确实服务任务的块；Brand Surface 必须至少有一个视觉或动效 signature，但只能有一个主 block；Hybrid 拆展示面和工作面，展示面可用 Sticky Stack / Particle Field，工作面回到 Product UI motion；没有 reduced motion、fallback 和 verification 不允许选择高级 block；素材未准备好先输出 `asset_manifest`，不要用抽象 div 替代。

Use boundary：普通按钮、菜单、toast、drawer、form state 用 CSS / Vue `<Transition>`；AI tool trace、批处理、导入导出和审批推进可用 CSS + optional GSAP timeline；Brand hero / scroll scene / visual signature 才考虑 GSAP ScrollTrigger 或 Three.js。GSAP 不用于普通 hover、focus、toast。

## 5. Source Boundary

`data/foundation-recipes.csv` 的 `recipe_type=advanced_interaction` 记录 motion / GSAP / Three source ids；本文件只消费 `source_ids` 和 reuse boundary，不维护第二份官方链接索引。需要新增依赖或确认 API 时，由 `sf-tech-design` 查官方文档并做 dependency decision。

Vue 项目优先确认 Vue-native 或项目已有 motion adapter；React / R3F / Drei examples 只能作为参考来源，不直接复制到 Vue。

## 6. Technical Handoff Boundary

Design stage 不写完整组件代码，不替 technical design 选包。必须交出：selected block、trigger、timeline / scene intent、affected elements、source ids、dependency candidate、fallback、reduced motion、verification hook。

`sf-tech-design` 再确认 CSS / Vue Transition / motion adapter / GSAP / Three.js / TresJS 的实际实现方式、SSR / lifecycle / cleanup、renderer、asset loading、performance budget 和 package decision。

## 7. Verification

Verify by layer：CSS / Vue Transition 覆盖 mouse、keyboard、reduced motion、rapid trigger；GSAP timeline / ScrollTrigger / Flip 覆盖默认态、reduced motion、cleanup、快速重复触发、移动端 / 低高度屏、滚动恢复和无动画 fallback；Three.js / shader / particles 覆盖 canvas 非空、资源失败、移动性能、缩放裁切、对比度、可读性、fallback 和 reduced motion。

## 8. Blockers

- 没有业务目的，只写“高级动效 / 酷炫 3D / 科技感”。
- 没有 reduced motion、fallback、cleanup / revert 或验证方式。
- 没有 dependency decision，直接要求实现引入 GSAP / Three.js。
- Product UI 高频页面使用 3D 背景、ScrollTrigger、全局视差或每个元素 GSAP。
- 复制 React / R3F / Drei 示例到 Vue，而没有 Vue translation contract。
- 关键内容只有动画后才出现，或 reduced motion 下不可读。

## 9. Output

`interaction_signature` 字段由 schema 管，必须写 purpose、trigger、technique、motion_blocks、fallback、verification，可选 reduced_motion。`motion.layer_3_gsap` 不使用时写空数组；一旦使用，数组项必须包含 effect、fallback、verification。

`interaction_signature` 必须和 `motion.layer_3_gsap`、`asset_manifest`、technical design dependency decision 和 `visual_qa` 对齐。
