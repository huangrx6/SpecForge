# Wiki Scripts

本模块负责把 work item / steering 证据转成可执行的 wiki 回写计划，并在需要时 hydrate `.specforge/wiki/` 的基础当前事实。

| 脚本 | 用途 |
|---|---|
| `wiki-update-plan.mjs` | 读取当前 work item、changed files 和 wiki 状态，输出长期事实候选、必须更新的 wiki target、是否允许 N/A。 |
| `wiki-hydrate.mjs` | 从 `codebase-intelligence.md` 或当前 work artifacts 生成 / 刷新核心 wiki 文件，避免 bootstrap 空壳进入 close。 |

`wiki-quality.mjs` 仍属于 quality 模块；本模块产出的文件必须通过 `wiki-quality --mode steering` 或 `wiki-quality --mode close`。
