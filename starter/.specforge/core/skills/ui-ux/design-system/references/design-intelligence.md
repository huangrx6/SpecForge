# Design Intelligence

用于把“做得好看一点”变成可判断、可确认、可落地的设计方向。

## 1. Ground the subject

每次设计先写四句话：

```md
Subject:
Audience:
Single job:
World material:
```

- `Subject`：具体产品或页面，不写“一个后台系统”这种泛化对象。
- `Audience`：谁在用，频率、环境、压力和设备。
- `Single job`：用户打开这个页面最重要的一件事。
- `World material`：业务世界里的视觉材料，例如告警、工单、地图、指标、音频、表格、直播流、会员权益、审批流。

没有这四句，不进入样例板。

## 2. Direction anatomy

每个 UI 方向必须包含：

| Part | Question |
|---|---|
| Atmosphere | 这个界面给人的第一感受是什么 |
| Palette | 4-6 个语义色，主色占比是否克制 |
| Type | 标题、正文、数字、标签分别承担什么角色 |
| Layout | 页面用什么结构表达信息，而不是装饰 |
| Components | 按钮、卡片、输入、表格、弹窗有什么项目特征 |
| Motion | 动效服务反馈、空间关系还是品牌记忆 |
| Signature | 唯一记忆点是什么 |
| Risk | 这个方向最容易翻车在哪里 |

## 3. Signature rules

Signature 是“这个设计为什么不是模板”的证据。只能选一个主角：

- **Structural signature**：特殊但合理的信息结构，如事故时间线、诊断链路、资源拓扑、指令面板。
- **Typographic signature**：标题、数字、标签或代码感排版成为识别点。
- **Material signature**：来自业务世界的视觉材料，如网格地图、错误堆栈、工单纸条、直播间弹幕。
- **Interaction signature**：一个关键交互被做得清楚，例如自动消费上下文、步骤推进、异常恢复。
- **Motion signature**：一个编排动效表达状态变化，例如工具调用进度、直播切场、指标刷新。

Product UI 的 signature 必须服务任务，不能是纯装饰。

## 4. Default detectors

出现以下信号时，必须重做一个方向：

- 任意 SaaS / AI 产品换上同样文案也成立。
- 只有“现代、简洁、高级、科技感”四个形容词，没有可执行 token。
- 仍然是居中 hero、四张卡片、紫蓝渐变、Inter、圆角大卡片。
- 页面所有层级都靠卡片和图标底色完成。
- 动效是每个元素都飞入，而不是状态或空间关系。

## 5. Direction options

给用户的 2-3 个方向应互斥，不要只是同一设计换颜色。

```md
Direction A:
- Signature:
- What changes in layout:
- What changes in tokens:
- What gets quieter:
- Risk:

Direction B:
- Signature:
- What changes in layout:
- What changes in tokens:
- What gets quieter:
- Risk:
```
