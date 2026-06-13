# UX Research, IA, Interaction

本文件吸收原 `ux-designer` 的有效方法，但改写为 SpecForge 内部规则。它不是独立 skill；只在 `design-system` 或 `sf-ui-design` 需要补齐用户证据、信息架构、交互恢复、微文案、可访问性和视觉层级时读取。

## Use When

- PRD / requirements 里缺少目标用户、使用场景、用户任务或痛点。
- 页面结构、导航、流程步骤、信息密度或移动端路径不清楚。
- 需要判断是否应该退回 brainstorm 让用户确认体验方向。
- UI design 需要写 UX rationale、IA、interaction state、microcopy 或 accessibility review。

## Research Lens

| Need | Ask | Output |
|---|---|---|
| 用户是谁 | 谁在什么场景下使用？频率和压力如何？ | persona-lite、角色差异、场景约束 |
| 任务是什么 | 用户要完成的 single job 是什么？成功信号是什么？ | primary task、success criteria |
| 现状痛点 | 用户上次做这件事卡在哪里？用了什么替代方案？ | pain point、workaround、机会点 |
| 风险假设 | 哪个假设如果错了会推翻 UI？ | high-impact unknown |
| 证据来源 | 来自用户、业务、日志、截图、还是 agent 假设？ | evidence label |

不要虚构完整 persona。没有真实研究时，只能写 `Persona-lite assumption`，并标注需要用户确认。

## Interview Prompts

- “上一次你/一线人员处理这个任务时，从哪里开始、在哪里结束？”
- “最容易出错或最耗时间的一步是什么？”
- “哪些信息必须第一眼看到？哪些可以点开再看？”
- “如果失败，用户最需要知道什么才能恢复？”
- “移动端 / 弱网 / 现场环境下，哪些操作会变难？”

避免诱导问题，例如“你觉得这个功能有用吗”。优先问过去行为和真实场景。

## Information Architecture

- 主导航按用户心智和任务分组，不按组织架构或数据库表分组。
- 桌面主导航默认控制在 5-7 项；移动底部导航控制在 3-5 项。
- 导航模式需要确认：侧边、顶部、混合、tabs、命令面板、移动底部导航各有适用场景，不能默认“后台就侧边栏”。
- 桌面主导航若采用 sidebar，应保持 fixed/sticky，不随主内容滚动；主内容、右侧辅助栏和局部列表应明确各自滚动区域。
- 层级超过 2 层时需要 breadcrumb、返回路径或上下文标题。
- 标签使用用户语言：名词用于区域，动词用于动作。
- 搜索适用于内容/对象超过 50 项的场景；搜索必须说明范围。
- Tabs 只用于同级视图切换，不替代主导航或顺序流程。
- 重要路径不要藏在 hamburger 或“更多”里。

## Interaction Rules

- 先画 happy path，再补 error / empty / permission / offline / retry / conflict。
- 3 步以上流程必须有进度位置、返回路径和最终确认。
- 用户返回上一步、刷新、失败重试时，不能丢失已填写的有效输入。
- 危险操作必须说明对象、后果和是否可撤销。
- 异步任务需要处理中、成功、失败、部分成功和查看结果路径。
- 表单错误尽早出现，靠近字段；全局错误要给恢复动作。
- 无结果、无权限、加载失败、首次无数据必须是不同状态。

## Microcopy Rules

- 按钮使用“动词 + 对象 + 范围”，如“导出当前筛选”“保存配置”。
- 危险动作写清后果，如“删除 3 个成员”，不用“确定”。
- 错误文案说明如何修复，如“请输入 11 位手机号”。
- 空态说明原因和下一步，不只写“暂无数据”。
- 权限不可用说明角色、状态或前置条件。
- 同一动作在全产品使用同一术语，不混用删除 / 移除 / 清理。

## Accessibility Baseline

- 正文对比度至少 4.5:1，大号文本至少 3:1。
- 所有输入必须有可见 label，不用 placeholder 替代。
- 所有交互元素必须可键盘访问；focus visible 不可删除。
- 触控目标至少 44 x 44 CSS px，移动端关键操作建议 48px。
- 状态不能只靠颜色表达，必须配文字或图标。
- 弹窗、抽屉和命令面板必须有焦点管理和 Esc / 返回路径。
- 支持 200% zoom、弱网、长文本和中文输入法组合态。
- 动效遵守 reduced motion；不使用高频闪烁。

## Visual Hierarchy Checks

- 首屏第一眼能看到主任务、当前状态和下一步。
- 页面只保留一个真正主 CTA；次级操作降噪。
- 信息密度和用户频率匹配：高频内部工具更紧凑，品牌/说明页更留白。
- 文字层级控制在 3-4 个核心等级，避免所有内容都加粗。
- 色彩有语义：品牌色用于主动作，状态色用于反馈，装饰色受控。
- 相关内容距离更近，无关内容用空间、分割线或区块标题拉开。
- 移动端不靠缩小桌面布局解决问题，要重排任务路径。

## SpecForge Output

写入 `01-spec/ui-design.md` 时按需提炼：

```md
UX Research / Assumptions:
- User:
- Task:
- Context:
- Evidence:
- High-impact unknown:

Information Architecture:
- Navigation:
- Page hierarchy:
- Labels:
- Search / filters:

Interaction Recovery:
- Happy path:
- Error path:
- Permission path:
- Offline / retry:

Microcopy:
- Primary action:
- Empty:
- Error:
- Permission:

Accessibility:
- Keyboard:
- Focus:
- Contrast:
- Touch target:
- Motion:
```

如果关键用户、任务、导航或流程方向无法从现有材料判断，停止 UI design，回到 `sf-brainstorm` 让用户确认。
