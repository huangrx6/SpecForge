# Visual QA Detectors

视觉质量闭环：先用 taste matrix 判断是否有真实设计判断，再用稳定 detector 生成机器可读 `visual_qa`，最后在截图、实现或用户反馈后用 calibration loop 反灌 Design Contract。

## 1. Taste Matrix

用于审查 UI 是否有真实设计判断，而不是 AI 默认美化。

Pass signals：视觉来自产品世界和用户任务；只有一个明确 signature；字体、空间、圆角、阴影、动效服务同一气质；结构编码业务关系；Product UI 有主要使用者、对象、任务和首屏工作面；组件有 project contract、状态和复用规则；loading / empty / error / permission 明确；motion 表达反馈、进度或空间关系；copy 具体、可操作、像用户语言。

Revise signals：任意同类产品都能套用；到处都想表现；颜色还行但其他层各说各话；只是在排卡片；KPI strip + 大空白 + 快捷入口；shadcn primitive 直接堆页面；只有 happy path；装饰性飞入、弹跳、旋转；模板营销话术或系统术语。

结论使用 `pass / needs revision / blocked`。Product UI 的高级来自秩序、密度、状态和可信层级；Brand Surface 的高级来自选择、资产、排版或一个明确 signature，不来自堆料。

## 2. Detectors

发现 fail signal 时，不只写审美评价，必须写修正动作，并同步更新 Design Contract Summary 的 `visual_qa` 和 `anti_slop_rules`。

| Detector | Fail signal | Severity | Fix |
| --- | --- | --- | --- |
| Generic SaaS shell | 左侧菜单 + 顶部栏 + 灰白卡片 + 蓝色按钮，无业务 signature | high | 引入业务结构 signature，或重构主任务布局、密度、信息层级 |
| Color-only design | token 正确，但字体、空间、圆角、阴影和动效没有统一 Composition Recipe | high | 补 `foundation_system` 和 Composition Recipe |
| Empty dashboard skeleton | 侧栏 + 顶栏 + KPI 卡 + 大空白面板 + 快捷入口，无主对象、主队列、异常或趋势 | high | 先做 Product UI Layout Audit，把首屏改成队列、表格、时间线或异常面板 |
| Default admin shell | 自动 sidebar + topbar + card grid，没有说明导航、滚动区、主对象和非传统候选 | high | 至少比较 Command Cockpit / Anomaly Board / Object Inspector / Evidence Timeline 候选 |
| KPI wallpaper | 指标只有大数字和涨跌幅，没有口径、时间范围、阈值、解释、drilldown 或动作 | high | 增加可行动字段；无法行动的指标降级为紧凑统计或过滤摘要 |
| Blank framed content | 第一屏大卡片被边框包住但内容稀薄，超过 40% 是空白 | high | 删除无意义容器，换成真实行数据、状态矩阵、趋势、队列或 inspector |
| Todo list without workflow | 待办列表无对象标识、SLA、优先级、负责人、时间和下一步动作 | high | 转成工作队列，补状态、优先级、时间、负责人、批量操作和恢复路径 |
| Dead quick actions | 快捷入口是通用 icon grid，和角色频率、当前状态或主任务无关 | medium | 换成命令面板、最近活动、上下文动作或角色任务入口 |
| Card soup | 页面 80% 内容都是同质卡片，卡片之间没有层级或任务差异 | high | 改成 table / timeline / split panel / drawer / command surface |
| Pastel icon grid | 每个功能入口都是彩色 icon + 浅色底，无法说明任务优先级 | medium | 改成任务分组、状态指标、最近操作或命令面板 |
| Fake premium gradient | 紫蓝渐变、玻璃、高光、模糊背景不服务信息 | high | 删除装饰，回到 semantic token、信息层级、内容和业务 signature |
| Default AI neon | 青色主色 + 紫色辅色 + 玫红强调 + 玻璃 / glow / 渐变按钮 | high | 执行 Palette De-template；换非默认 palette 或 custom palette delta |
| Missing creative direction | 直接输出 palette、组件、页面结构，没有 Design Read、互斥方向或 signature carrier | high | 先补 Creative Direction，再回填 color_system、foundation_system、layout 和 motion |
| Reference claim without evidence | 用户给 URL / 截图，但只写“参考某站”，没有 access、viewport、观察、抽取或 fallback | high | 执行 live reference，补 reference_evidence 和 adopt / adapt / avoid |
| Assetless brand surface | 品牌页 / landing 没有真实或生成视觉资产，也没有 asset_manifest | high | 输出 asset_manifest，生成或预留 hero / object / texture / video / 3D 素材位 |
| Decorative motion signature | 声称 GSAP / Three.js / 高级动效，但缺 purpose、trigger、fallback、reduced motion 和 verification | high | 选择 motion block，并写 interaction_signature |
| Motion noise | 多个元素同时飞入、弹跳、闪烁，或 Product UI 中有无任务价值动效 | high | 只保留状态反馈、空间关系、进度或品牌 signature 动效 |
| State missing | 只有 default，没有 loading / empty / error / permission / stale | high | 补状态矩阵，并把状态责任写入组件契约 |
| Primitive pile | 页面直接拼 Button / Table / Dialog，没有 project wrapper | high | 定义 project wrapper、props、events、slots、state ownership |
| Token drift | 大量一次性 hex、arbitrary spacing、随机圆角和阴影 | high | 收敛到 semantic token 和 foundation delta |
| Text overflow | 按钮、表格、badge、移动端标题出现截断或遮挡 | high | 调整容器、换行、密度、列策略和 responsive constraints |
| Empty decoration | 空态只有插画或口号，没有恢复路径 | medium | 补原因、下一步动作、权限 / 筛选 / 首次使用差异 |
| Low contrast subtlety | 灰字、彩色底、禁用态、图表辅助线对比不足 | high | 提升 contrast，补语义颜色和 a11y 验证 |
| Brand bleed | Brand Surface 的视觉语言直接污染后台控件或表格 | medium | 只保留有限 token / signature，Product UI 控件回到任务密度 |

## 3. Calibration Loop

用户反馈、不满意截图、实现偏差或 Brand Surface / Hybrid 模板感必须进入 calibration loop。

Trigger handling：不好看 / 没质感 -> 至少改 palette、type、layout、motion 或 signature 中两项；AI 味 / 模板感 / cyber 过重 -> 执行 Palette De-template，换 custom token delta 或非默认 palette；不像目标产品 -> 重做 subject + world material grounding；实现和 Design Contract 不一致 -> 更新实现或更新 contract，不能分离；GSAP / Three.js 只是背景 -> 重写 interaction_signature，让内容、滚动、pointer 或 section state 驱动。

Visual Calibration 输出字段由 schema 管；影响层稳定值：`color`、`typography`、`spacing`、`surface`、`layout`、`motion`、`advanced_interaction`、`content`、`signature`。

## 4. Palette De-template

Brand Surface 和 Hybrid 选择 palette 后必须问：是否像任何 AI 工具官网、是否出现 cyan + violet + rose + glow + glass、是否只有颜色表达行业、主按钮是否用多色渐变、Three.js / GSAP 是否只是发光背景。

如果 2 项以上为 yes，必须写 custom palette delta：从哪里偏移、为什么偏移、影响哪些 token。常见修正：换磷光绿、铜、石墨、墨黑、骨白、酸橙、深酒红；改不透明 surface、细边框、材质阴影或真实 3D / motion signature；主按钮改为单色或材质色。

## 5. Review Protocol

Protocol：先确认 design mode，Product UI 必须先做 Product UI Layout Audit；针对截图、Pencil、样例板或 UI 描述扫描 detector；每个 high severity fail 必须修正，或在 `visual_qa` 写 owner、影响和接受理由，status 标为 `fixed` 或 `accepted`；修正动作必须落到 token、layout、component contract、state matrix、motion 或 copy；有用户反馈或截图证据时同步输出 `visual_calibration`；`sf-verify` 读取 Design Contract JSON 的 `visual_qa`，不重新解析自然语言表格。

Mirror pass：去掉装饰是否更好；主色减半层级是否仍清楚；换真实业务文案是否成立；手机宽度第一任务是否仍清楚；隐去图标后信息是否仍可理解。

## 6. Review Prompt

需要审查截图、Pencil、实现或用户反馈时，按此输入输出执行，不再读取独立 QA prompt。Input：Subject、Audience、Single job、Design mode、Direction / Signature、Foundations、Components、Page pattern、Screenshot / implementation notes、Confirmed design language。

Review：产品真实感、Signature、信息层级、密度、组件一致性、廉价感 / 模板感、状态覆盖、可访问性、动效目的、实现可行性。Output：Verdict、Keep、Top issues、Required fixes、Remove、Missing states、Optional polish、Evidence、Human confirmation needed、修改后应呈现的设计语言。`blocked` 只用于 design mode 错误、缺真实参考证据、Product UI 缺工作表面、Brand Surface 缺资产或高级动效缺 fallback。

## 7. Output

Markdown 至少输出 `Visual QA Detectors` 短表：Detector、Result、Evidence、Fix / Accepted reason。

JSON 字段由 schema 和 `artifact-quality` 管：`visual_qa[]` 必须包含 `detector`、`result`、`severity`、`evidence`、`fix`、`status`、`owner`。`result` 为 `ok / issue / not-applicable`；`severity` 为 `low / medium / high`；`evidence` 必填 artifact、viewport、region；`status` 为 `fixed / accepted / pending / blocked / not-applicable`。

`severity: high` 且 `result: issue` 时，`status` 只能是 `fixed` 或 `accepted`，否则不得进入 `sf-verify`。High severity detector 不能在 JSON 中降级。
