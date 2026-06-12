# Colors

## 色彩角色

| Token | 用途 | 建议 |
|---|---|---|
| `brand` | 主操作、导航选中、关键强调 | 只占 5-10%，避免整页单色 |
| `surface` | 页面背景、容器、浮层 | 用亮度和边框区分层级，不靠大片阴影 |
| `text` | 标题、正文、辅助说明、禁用 | 至少 4 个语义层级 |
| `border` | 分隔、输入框、表格线 | 低对比但可见 |
| `success/warning/error/info` | 状态反馈 | 不与品牌色混用 |

## 去廉价感规则

- 不用大面积纯色渐变、荧光色、低透明度彩色卡片堆满页面。
- 不把所有按钮、标签、图标都染成主色。
- 状态色只服务状态，不做装饰。
- 深色模式要重做层级，不能简单反色。

## SpecForge 输出

在 `ui-design.md` 中写：

```text
Color language:
- Brand:
- Surface:
- Text:
- Border:
- States:
- Do not use:
```
