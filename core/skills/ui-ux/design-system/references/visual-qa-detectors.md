# Visual QA Detectors

本文件把“不要廉价感 / 不要模板感”变成可执行检测器。发现 fail signal 时，不只写审美评价，必须写修正动作并更新 Design Contract Summary 的 `anti_slop_rules`。

## Detectors

| Detector | Fail signal | Severity | Fix |
| --- | --- | --- | --- |
| Generic SaaS shell | 左侧菜单 + 顶部栏 + 灰白卡片 + 蓝色按钮，无业务 signature | high | 引入业务结构 signature，或重构主任务布局、密度、信息层级 |
| Card soup | 页面 80% 内容都是同质卡片，卡片之间没有层级或任务差异 | high | 合并层级，改成 table / timeline / split panel / drawer / command surface |
| Pastel icon grid | 每个功能入口都是彩色 icon + 浅色底，无法说明任务优先级 | medium | 改成任务分组、状态指标、最近操作、命令面板或角色入口 |
| Fake premium gradient | 紫蓝渐变、玻璃、高光、模糊背景不服务信息 | high | 删除装饰，回到 semantic token、信息层级、内容和业务 signature |
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
2. 针对截图、Pencil、样例板或 UI 描述逐项扫描 detector。
3. 每个 high severity fail 必须修正，或在 `视觉质量 Review` 写 owner、影响和接受理由。
4. 修正动作必须落到 token、layout、component contract、state matrix、motion 或 copy 之一。
5. `sf-verify` 可用 detector 名称作为 visual verification hook。

## Output Format

```md
Visual QA Detectors:
| Detector | Result | Evidence | Fix / Accepted reason |
| --- | --- | --- | --- |
| Generic SaaS shell | ok / issue | | |
| State missing | ok / issue | | |
```
