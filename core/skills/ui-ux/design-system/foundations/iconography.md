# Iconography

图标用于识别操作、状态和对象，不用于填补空白。

## 选择

- Vue / shadcn-vue 项目优先使用 lucide-vue-next 或项目已有图标库。
- 同一页面只使用一种线性风格；不要混用 filled、duotone、emoji 和自绘 SVG。
- 工具按钮优先 icon-only + tooltip；明确命令可使用 icon + text。
- 状态图标必须配合文字，不能只靠颜色或图标传达失败、危险、禁用。

## 尺寸

| 场景 | 尺寸 | 线宽 |
|---|---:|---:|
| toolbar / table action | 16px | 1.75-2 |
| button leading icon | 16-18px | 1.75-2 |
| nav item | 18-20px | 1.75-2 |
| empty state | 32-48px | 1.5-1.75 |

## 禁止

- 用随机彩色图标让后台显得“活泼”。
- 在同一组按钮中有的带图标、有的不带，且无信息差异。
- 图标按钮无 tooltip、无 aria-label、无 focus 样式。
