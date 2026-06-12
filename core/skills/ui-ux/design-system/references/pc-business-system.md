# PC Business System Reference

PC 业务系统规范的权威数值仍以 `.specforge/core/standards/pc-ui-design-spec.md` 为准。本文件只说明 design-system skill 如何引用它。

## 什么时候读

- 运营后台、管理系统、审批台、配置台、数据管理系统。
- 用户明确要求 PC 端业务系统 UI 规范。
- 页面主体包含筛选、表格、弹窗、抽屉、图表和批量操作。

## 归一化

- foundations：颜色、字号、行高、间距、圆角。
- components：Button、Form、Table、Modal、Drawer、Chart。
- pages：list-detail、dashboard、async-job-import-export。

不要复制完整 token 表到每个 artifact；在 `ui-design.md` 只写本次使用的 token 和偏离项。
