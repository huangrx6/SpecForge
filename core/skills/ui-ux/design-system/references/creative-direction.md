# Creative Direction

设计导演层先回答“为什么这样设计”，再让 palette、组件、动效和素材服务同一个方向。它不生成最终 UI，不复制 mode / motion / QA 规则；它只决定 grounding、互斥方向、signature carrier 和人工确认点。

## 1. When To Use

除 `local-component` 小修外必须使用：新页面、页面重构、dashboard / admin / landing / brand surface、用户反馈“不好看 / 老套 / 模板 / AI 味”、给外部参考、需要高级动效或需要图片 / 3D / 视频 / 插画提示词。

## 2. Grounding Gate

先输出一行 Design Read，再做方向：

`Design Read: 这是一个 [page kind]，面向 [audience]，核心任务是 [single job]，视觉应该从 [world material] 中长出来，优先探索 [direction family]。`

每次设计必须写四个事实；缺失时不要进入样例板、Pencil handoff 或实现：`Subject` 是具体产品或页面；`Audience` 说明谁在用、频率、环境、压力和设备；`Single job` 是第一屏最重要的一件事；`World material` 是业务世界里的视觉材料，例如告警、工单、地图、指标、音频、直播流、审批证据、资源拓扑。

不要把“现代、简洁、高级、科技感”当判断；必须落到 subject、audience、single job 和 world material。

## 3. Direction Card

方向必须互斥。方向不是换色，而是换 signature carrier、布局逻辑、素材策略、审美气质或动效主角。

每个方向只写：id、name、design mode、positioning、fit、risk、signature carrier、first viewport promise、layout move、palette family、type attitude、asset strategy、motion / interaction strategy、product UI boundary、what gets quieter、rejected defaults。输出数量：小修 1 个；Product UI 2-3 个且至少 1 个不是传统 sidebar + cards；Brand Surface / landing 3 个且覆盖强视觉资产、强排版、强动效或材质；Visual Calibration 2 个；用户明确指定时输出主方向 + 风险备选。

## 4. Signature Carrier

一次只选一个主 signature，最多一个辅助 signature。

Carrier 选择：`structure` 适合 Product UI / 后台 / 工具，例如异常作战台、对象 inspector、命令 cockpit、时间线诊断；`typography` 适合品牌页、作品集和强内容页；`material` 适合真实物体或行业质感；`interaction` 适合工具、AI、命令和复杂状态；`motion` 适合品牌页、活动页和低频入口；`asset` 适合真实图片、生成素材、3D、视频；`mixed` 只给复杂 Hybrid，展示面一个 signature，工作面回到 Product UI。

每个方向必须说明 atmosphere、palette、type、layout、components、motion、signature 和 risk；否则只是在换形容词。

## 5. Aesthetic Library

审美方向是画面气质，不是业务模式。Aesthetic direction 决定感觉、材质、字体和视觉语言；Business translation 决定它如何落到工作面。不要把 `Operational Calm`、`Command Center`、`Data Instrument` 这类结构策略当成美学；它们只能作为用户选定审美后的 business translation。

Recommendation protocol：先判断对象类型，再推荐 2-3 个互斥 aesthetic direction；用户选择后，再翻译成 foundations、components、pages、asset / motion 和 Pencil handoff constraints。后台 / 政企 / 工具型产品可以克制，但仍要明确审美来源，不要只写“简洁高级”。

### Palette ID Mapping

Mapping：极简主义 / 日式留白 / Notion -> `minimal`, `japanese-ma`, `notion`；玩具感 / 泡泡 / 可爱 -> `toy`, `bubble`；水彩 / 森系 / 温柔 -> `watercolor`, `forest`；赛博朋克 / Web3 / 协议感 -> `obsidian-phosphor`, `black-white-cool`, `cyberpunk`；极简科技 / AI 数据 -> `minimal-tech`, `ai-data`, `obsidian-phosphor`；玻璃 / 轻奢 / 复古 -> `glass`, `luxury`, `poster-retro`；专业可信 -> `enterprise-trust`, `finance-pro`, `medical-clean`, `industrial-order`, `legal-compliance`, `minimal`。

用户给“高级、清透、森系、赛博朋克”这类气质词时，先映射 palette id，再输出 token contract，不在页面里自由挑 hex。

### Direction Families

方向族只负责启发，不直接当最终方案名：

Family map：简洁 / 高级 -> 工具后台、知识库、高价值服务，但不能用大留白牺牲高密扫描；可爱 / 活泼 -> AI 助手、头像、空态、教育、年轻化 H5，只能局部化；艺术 / 氛围 -> 品牌插画、封面、活动专题，不能遮挡任务；复古 / 怀旧 -> 文化、潮流、文旅、游戏化，低频展示优先；科技 / 未来 -> AI、数据、开发者工具、机器人、硬件，不能默认青紫霓虹；潮流 / 个性 -> 活动、个人品牌、年轻社区，严肃业务只保留局部微交互；自然 / 温柔 -> 生活、健康、教育、公益，温柔不等于低对比；专业 / 可信 -> 政务、金融、审计、医疗、工业、法务，可信来自可访问和可追溯；材质 / 3D -> 工具入口、产品架构、品牌插画，必须有 asset plan；插画 / 角色 -> 空态、帮助、引导、客服，不能抢业务路径；图形 / 排版实验 -> 数据报告、作品集、专业品牌、开发者工具，高频页面仍要可读；地域 / 文化 -> 文旅、政务展示、城市服务，现代转译不堆符号；情绪 / 体验调性 -> AI、客服、运营、支付完成、监控告警，不能覆盖任务优先级。

Business translation patterns：Operational Calm、Command Center、Diagnostic Chain、Data Instrument、Structured Workflow、Knowledge Workspace、Field Mobile、Secure Enterprise。它们回答“该审美如何落到高密表格、命令面板、诊断步骤、图表、流程、文档、移动现场或安全审计”，不是审美名称。

Mixing rules：主审美决定 palette、字体、形状、插画和整体气质；辅助审美只影响一个局部；严肃业务优先混合克制方向；AI 助手可局部角色化；不混合三个以上方向。

## 6. Mode Handoff

模式判断、必读文件和禁止项的权威是 `references/read-profiles.md#Design Mode Routing`。本文件只决定“方向和 signature carrier”，再交给对应文件落地：

Product UI 可提出结构、交互或排版 signature，但真实工作面、状态矩阵和 KPI 规则回到 `references/product-ui-signature-patterns.md`。Brand Surface 用下方 add-on 决定首屏对象、媒体策略和记忆点，素材和高级动效合同回到 `references/motion-block-library.md`。Hybrid 展示面可以有一个 signature，工作面回到 Product UI 密度、状态和可访问性。

需要图片、3D、视频或纹理而模型不能生成时，必须输出 `asset_manifest`，让用户生成素材后放到指定目录。

### Brand Surface Add-on

适用于官网、landing、活动页、介绍页和作品集。它不是 Product UI 的放大版；首屏必须让品牌、人、产品、offer 或真实对象成为第一眼信号，不能只有抽象口号、居中卡片或 fake dashboard。

必须决定 5 件事：first viewport object / offer、主 signature carrier、media need、section rhythm、accessibility floor。失败信号：整屏大字但不知道卖什么、每一层都抢戏、纯文字堆叠、section 全是同款卡片、动态背景压住小字。

Web3 / AI / 科技品牌页不要自动选 `cyberpunk`。先比较 `obsidian-phosphor`、`black-white-cool`、`cyberpunk` 和 `data-command`；若选择青紫霓虹、玻璃或 glow，必须说明为什么不是通用 AI 模板，并记录 anti-reference。

Brand Surface 使用 GSAP / Three.js 时，本文件只写 signature object、trigger 和 content binding；reduced motion、fallback、performance budget 和 verification 由 `references/motion-block-library.md` 生成 `interaction_signature`。Brand Surface 的 signature 只能作为局部品牌线索进入 Product UI，不能污染表格、表单、审批、权限、错误和运营工作面。

## 7. Rejected Defaults

每个方向至少拒绝 3 条默认模板；稳定 detector 清单在 `references/visual-qa-detectors.md`。本文件只保留方向层常见拒绝项：generic SaaS shell、sidebar + topbar as automatic choice、KPI wallpaper、card soup、cyan / violet / rose AI neon、fake screenshot divs、pure text hero、decorative GSAP without purpose。

出现以下信号时必须重做方向：任意同类产品换文案也成立；只有抽象形容词；仍是居中 hero + 四张卡 + 紫蓝渐变；所有层级靠卡片和图标底色；动效只是所有元素飞入，而不是说明状态或空间关系。

## 8. Sample Board

方向会影响视觉气质、信息架构、组件形态或动效时，先给样例板并等待用户确认；低风险可逆默认只用于小范围 Product UI。

Sample Board 用一张短表即可：Direction、Best for、Risk、Visual language、Components、Motion、Decision。每个方向必须补 Adopt / Avoid / Human question / Implementation mapping，不要把样例板扩展成第二份 design contract。

## 9. Execution Summary

独立执行 Creative Direction 时按顺序输出：Design Read、Grounding Gate、2-3 个 Direction Cards、Recommendation、需要用户确认的点、低风险默认、可选 Sample Board、schema 字段草案。不要在这里生成最终 UI；URL / 截图证据回到 `references/reference-workflow.md#Live Evidence Protocol`，素材和高级动效回到 `references/motion-block-library.md`。

## 10. Contract Output

必须对齐 `contracts/design-contract.schema.json#$defs.creativeDirection`：`selected`、`why`、`alternatives[]`、`rejected_defaults[]`、`signature_carrier`。`signature_carrier` 只能是 `structure`、`typography`、`asset`、`motion`、`material`、`interaction`、`mixed`，并且必须和 `foundation_system`、`layout`、`motion`、`asset_manifest`、`interaction_signature` 保持一致。
