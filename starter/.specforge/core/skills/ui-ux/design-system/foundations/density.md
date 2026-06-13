# Density

密度决定产品是否像真实工具。后台、运营台、现场 H5、品牌页和大屏不能共用同一套空间比例。

## 档位

| 档位 | 场景 | 控件高度 | 页面特征 |
|---|---|---:|---|
| compact | 运营后台、表格、配置台、审批台 | 28-32px | 列表优先，筛选紧凑，卡片少用 |
| comfortable | 常规 SaaS、工作台、AI 助手、业务表单 | 36-40px | 信息清晰，留白适中，主任务突出 |
| expressive | 品牌页、会员中心、活动页、直播间 | 40-48px | 内容更有呼吸感，媒体和动效可以更强 |
| command | 命令面板、快捷工具、搜索选择 | 36-44px | 键盘路径清晰，分组和最近使用明显 |

## 规则

- 表格页默认 compact，除非触控或现场操作需要加大目标。
- H5 触控目标不小于 44px；PC 工具栏按钮不小于 28px。
- 卡片不是布局万能容器；重复对象可以用卡片，页面 section 不要套卡。
- 密度变化必须来自 token，不要在页面里散落一次性高度和 margin。

## 输出格式

```md
Density: compact
Control height: 32px
Table row: 44px
Section gap: 16px
Reason: 高频运营页面，需要横向扫描和批量操作。
Exceptions: mobile drawer uses 44px touch targets.
```
