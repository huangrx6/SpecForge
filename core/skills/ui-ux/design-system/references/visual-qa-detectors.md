# Visual QA Detectors

本文件把“不要廉价感 / 不要模板感”变成可执行检测器。发现 fail signal 时，不只写审美评价，必须写修正动作，并同步更新 Design Contract Summary 的 `visual_qa` 和 `anti_slop_rules`。

## Detectors

| Detector | Fail signal | Severity | Fix |
| --- | --- | --- | --- |
| Generic SaaS shell | 左侧菜单 + 顶部栏 + 灰白卡片 + 蓝色按钮，无业务 signature | high | 引入业务结构 signature，或重构主任务布局、密度、信息层级 |
| Color-only design | 色彩 token 正确，但字体、字号、行高、间距、圆角、阴影和动效没有统一 Composition Recipe | high | 补 `foundation_system` 和 Composition Recipe；从 type scale、spacing density、radius / shadow recipe、motion recipe 中选择一套配方 |
| Empty dashboard skeleton | 侧栏 + 顶栏 + KPI 卡 + 大空白面板 + 快捷入口，无主对象、主队列、异常或趋势 | high | 先做 Product UI Layout Audit，选择 Review Desk / Ops Dashboard / Resource Operations，并把首屏改成可处理队列、表格、时间线或异常面板 |
| KPI wallpaper | 指标只有大数字和涨跌幅，没有口径、时间范围、阈值、解释、drilldown 或动作 | high | 给 KPI 增加可行动字段；无法行动的指标降级为紧凑统计、过滤摘要或表格列 |
| Blank framed content | 第一屏大卡片被边框包住但内容稀薄，超过 40% 是空白 | high | 删除无意义容器，换成真实行数据、状态矩阵、趋势 / 分布、队列或 inspector |
| Todo list without workflow | 待办列表只有标签、标题和数量，没有对象标识、SLA / 优先级、负责人、时间和下一步动作 | high | 转成工作队列，补对象、状态、优先级、时间、负责人、批量操作和恢复路径 |
| Dead quick actions | 快捷入口是通用 icon grid，和角色频率、当前状态或主任务无关 | medium | 替换成命令面板、最近活动、上下文动作、SLA 面板或角色任务入口 |
| Card soup | 页面 80% 内容都是同质卡片，卡片之间没有层级或任务差异 | high | 合并层级，改成 table / timeline / split panel / drawer / command surface |
| Pastel icon grid | 每个功能入口都是彩色 icon + 浅色底，无法说明任务优先级 | medium | 改成任务分组、状态指标、最近操作、命令面板或角色入口 |
| Fake premium gradient | 紫蓝渐变、玻璃、高光、模糊背景不服务信息 | high | 删除装饰，回到 semantic token、信息层级、内容和业务 signature |
| Default AI neon | 青色主色 + 紫色辅色 + 玫红强调 + 玻璃 / glow / 渐变按钮，导致 Web3、AI、科技页面像通用模板 | high | 执行 `visual-calibration.md#Palette De-template`；换非默认 palette 或 custom palette delta，并同时调整 surface、button、bloom / glow 和 signature carrier |
| Motion noise | 多个元素同时飞入、弹跳、闪烁，或 Product UI 中有无任务价值动效 | high | 只保留状态反馈、空间关系、进度或品牌 signature 动效 |
| State missing | 只有 default，没有 loading / empty / error / permission / stale | high | 补状态矩阵，并把状态责任写入组件契约 |
| Primitive pile | 页面直接拼 Button / Table / Dialog，没有 project wrapper | high | 定义 project wrapper、props、events、slots、state ownership |
| Token drift | 大量一次性 hex、arbitrary spacing、随机圆角和阴影 | high | 收敛到 semantic token 和 foundation delta |
| Text overflow | 按钮、表格、badge、移动端标题出现截断或遮挡 | high | 调整容器、换行、密度、列策略和 responsive constraints |
| Empty decoration | 空态只有插画或口号，没有恢复路径 | medium | 补原因、下一步动作、权限 / 筛选 / 首次使用差异 |
| Low contrast subtlety | 灰字、彩色底、禁用态、图表辅助线对比不足 | high | 提升 contrast，补语义颜色和 a11y 验证 |
| Brand bleed | Brand Surface 的视觉语言直接污染后台控件或表格 | medium | 只保留有限 token / signature，Product UI 控件回到任务密度 |

## Review Protocol

1. 先按 `references/design-mode-routing.md` 确认当前 design mode。
2. Product UI / 后台 / 管理端 / 工作台 / Dashboard 必须先按 `references/product-ui-layout-quality.md` 完成 Product UI Layout Audit；颜色合格不能抵消结构失败。
3. 针对截图、Pencil、样例板或 UI 描述逐项扫描 detector。
4. 每个 high severity fail 必须修正，或在 `visual_qa` 写 owner、影响和接受理由，并把 status 标为 `fixed` 或 `accepted`。
5. 修正动作必须落到 token、layout、component contract、state matrix、motion 或 copy 之一。
6. `sf-verify` 读取 Design Contract JSON 的 `visual_qa`，不再重新解析自然语言表格；Markdown 表只是 reviewer 视图。

## Output Format

```md
Visual QA Detectors:
| Detector | Result | Evidence | Fix / Accepted reason |
| --- | --- | --- | --- |
| Generic SaaS shell | ok / issue | | |
| Color-only design | ok / issue | | |
| Empty dashboard skeleton | ok / issue | | |
| KPI wallpaper | ok / issue | | |
| Blank framed content | ok / issue | | |
| Default AI neon | ok / issue | | |
| State missing | ok / issue | | |
```

Design Contract JSON 必须同步输出机器可读 `visual_qa`：

```json
{
  "visual_qa": [
    {
      "detector": "Empty dashboard skeleton",
      "result": "issue",
      "severity": "high",
      "evidence": {
        "artifact": "01-spec/ui-mockup-export/dashboard.png",
        "viewport": "1440x900",
        "region": "first viewport"
      },
      "fix": "Replace KPI wallpaper with Review Desk queue and SLA rail",
      "status": "fixed",
      "owner": "sf-ui-design"
    }
  ]
}
```

字段规则：

| 字段 | 要求 |
| --- | --- |
| `detector` | 使用本文件中的稳定 detector 名称 |
| `result` | `ok` / `issue` / `not-applicable` |
| `severity` | `low` / `medium` / `high`；本文件 high detector 不允许降级 |
| `evidence` | 必填 `artifact`、`viewport`、`region`，让验证阶段能定位截图或页面区域 |
| `fix` | `issue` 必填修正动作或接受理由 |
| `status` | `fixed` / `accepted` / `pending` / `blocked` / `not-applicable` |
| `owner` | 负责阶段或角色，例如 `sf-ui-design`、`sf-implement` |

阻断规则：`severity: "high"` 且 `result: "issue"` 时，`status` 只能是 `fixed` 或 `accepted`；`pending` / `blocked` 不允许进入 `sf-verify`。
