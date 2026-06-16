# Provider Selection

| 场景 | 推荐 |
|---|---|
| small | Wiki + bootstrap map + `rg` |
| medium | Wiki + bootstrap map + `rg`；局部上下文可用 Repomix |
| large / legacy | CodeGraph / MCP / SCIP graph provider |
| focused bug / change | 先限定模块；必要时用 graph provider 做 trace / impact |

## 选择规则

- 小项目不要为了完整而强行安装 provider。
- 中型项目先看 Wiki 是否能定位范围；范围明确时 Repomix 只能打包目标模块，不打包全仓。
- 大型项目不能靠“多读文件”解决；无 ready graph provider 且无目标范围时必须暂停。
- bugfix / change-focused 优先让用户提供模块、业务域、页面、接口、报错路径或复现线索。

