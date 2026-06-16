# Font Source Index

本文件解决两个问题：字体从哪里来，以及什么时候应该不用外部字体。中文 UI 优先考虑可访问、可授权、可实现、可回退，不追求“看起来新奇”。

## 1. 字体来源优先级

| 优先级 | 来源类型 | 适合场景 | 规则 |
| --- | --- | --- | --- |
| A | 系统内置字体栈 | Product UI、后台、表格、表单、高频工作台 | 默认使用，无下载和许可风险 |
| A | 官方开源 / 官方发布字体 | 品牌页、混合入口、需要中文气质的产品 | 必须记录官方 URL、license note、是否允许商用和内置 |
| B | 大厂公开字体 | 企业 / 科技 / 商业品牌感 | 只从官方入口确认授权，不从搬运站下载 |
| C | 字体聚合站 / 文章推荐 | 灵感发现 | 不能作为 license source；最终仍回官方来源确认 |
| D | 盗链、网盘、未注明授权 | 禁止 | 不写入设计契约，不下载，不内置 |

## 2. 内置系统字体栈

没有明确品牌字体需求时，优先使用这些 stack。它们最稳、加载最快，也最适合国内用户。

| font_source_id | 场景 | CSS font-family | 说明 |
| --- | --- | --- | --- |
| system-cn-ui | 通用 Product UI | `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif` | 后台 / 表格 / 表单默认 |
| system-cn-apple | macOS / iOS 优先体验 | `-apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Arial, sans-serif` | 客户端、H5、轻量品牌面 |
| system-cn-windows | Windows / 政企环境 | `"Microsoft YaHei UI", "Microsoft YaHei", "Segoe UI", system-ui, sans-serif` | 政企后台、内网系统 |
| system-mono | 代码 / 日志 / ID | `"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace` | 日志、trace、代码、金额可配 tabular |

## 3. 国内可访问字体来源

以下来源用于 design-system 查询和记录，不表示可以无条件打包进项目。每次实际使用仍要按当前官方页面确认许可。

| font_source_id | 字体 | 适合场景 | 官方入口 | 使用建议 | license note |
| --- | --- | --- | --- | --- | --- |
| alibaba-puhuiti | 阿里巴巴普惠体 | 商业后台、电商、运营系统、品牌页正文 | https://www.iconfont.cn/fonts/detail?cnid=puhuiti | 可作为 system stack 后的品牌增强字体 | 以阿里官方页面当前授权为准，记录是否允许商用和内置 |
| harmonyos-sans | HarmonyOS Sans | 科技产品、移动端、设备生态、轻 Product UI | https://developer.huawei.com/consumer/cn/design/resource/ | 适合 Hybrid / app-like UI；Product UI 仍需控制字号和行高 | 以华为开发者官方资源页授权为准 |
| misans | MiSans | 科技品牌、消费电子、活动页、轻工作台 | https://hyperos.mi.com/font/ | 适合标题和正文统一品牌感 | 以小米官方页面当前授权为准 |
| oppo-sans | OPPO Sans | 消费品牌、移动端、活动页 | https://www.coloros.com/article/A00000050/ | 可用于 Brand Surface 和移动端 | 以 OPPO / ColorOS 官方页面授权为准 |
| source-han-sans | 思源黑体 / Source Han Sans | 通用中文开源 UI、长文本、品牌正文 | https://github.com/adobe-fonts/source-han-sans | 适合自托管；体积较大，需子集化 | SIL Open Font License；实际打包需保留 license |
| source-han-serif | 思源宋体 / Source Han Serif | 品牌页、文化、阅读、正式文案 | https://github.com/adobe-fonts/source-han-serif | 不用于高密后台正文 | SIL Open Font License；实际打包需保留 license |
| zcool-fonts | 站酷字体 | 标题、海报、活动页局部 | https://www.zcool.com.cn/special/zcoolfonts/ | 只用于 display，不做后台正文 | 单字体逐一确认授权 |
| youshe-title | 优设标题黑 | 活动页、品牌标题、专题页 | https://www.uisdc.com/uisdc-first-free-font | 只用于 display；避免长文本 | 以优设官方说明为准 |

## 4. 不同场景的字体选择

| 场景 | 默认选择 | 可增强 | 禁止 |
| --- | --- | --- | --- |
| 政企后台 / 审批 / 管理端 | `system-cn-ui` 或 `system-cn-windows` | 阿里巴巴普惠体、HarmonyOS Sans | display 字体、大量自托管字体、标题字体做正文 |
| 电商 / 商家后台 | `system-cn-ui` | 阿里巴巴普惠体 | 过度品牌化导致表格扫描变差 |
| AI / 数据 / 开发者工具 | `system-cn-ui` + `system-mono` | HarmonyOS Sans、MiSans | 科技标题字体抢走输入和结果 |
| 品牌页 / 活动页 | 正文字体用 `system-cn-ui` 或开源正文 | display 可用 MiSans、站酷、优设标题黑 | 全站 display 化、正文 14px 以下 |
| 文化 / 教育 / 阅读 | 思源宋体 / 思源黑体组合 | 品牌 display 字体局部使用 | 宋体用于高密表格和表单 |

## 5. 字体落地契约

每次选择字体必须写：

```md
Font Source:
| 项 | 内容 |
| --- | --- |
| font_source_id | system-cn-ui |
| 来源 | 系统内置字体栈 / 官方字体 |
| 官方 URL | N/A / https://... |
| 用途 | 正文 / 标题 / 数字 / 代码 |
| 是否内置字体文件 | no |
| license note | 系统字体，无需打包 |
| fallback | PingFang SC -> Microsoft YaHei -> Noto Sans CJK SC |
```

并写入 `Design Contract JSON.scan_manifest.selected_data.font_source_id` 和 `foundation_system.typography.font_family`。

## 6. 阻断条件

- 没有官方 URL 却声称使用某个下载字体。
- 没有 license note 却要求实现阶段内置字体文件。
- Product UI 使用海报字体作为正文。
- 中文正文行高低于可读范围，或长文案只靠浅灰色弱化。
- 仅写“高级字体 / 中文字体 / 品牌字体”，没有 `font_source_id`。
