# Button

## 语义

| 类型 | 用途 |
|---|---|
| Primary | 当前页面最主要动作，一个区域最多一个 |
| Secondary | 次要动作 |
| Ghost | 工具栏、低强调操作 |
| Danger | 删除、撤销、强风险动作 |
| Icon | 工具按钮，必须有 tooltip |

## shadcn-vue 映射

- 使用 shadcn-vue Button primitive 作为基础。
- 项目级按钮要封装 loading、icon、permission disabled、danger confirm。
- 不把所有操作都做成 primary。

## 状态

default / hover / active / focus / disabled / loading / success / danger。
