# CodeGraph Usage

## MCP 工具

| 工具 | 用途 | SpecForge 使用场景 |
|---|---|---|
| `codegraph_search` | 按名称找 symbol | intake / steering 初步定位 |
| `codegraph_explore` | 返回相关 symbols、源码片段和关系 | steering / tech-design 理解模块 |
| `codegraph_callers` | 查谁调用某 symbol | bugfix / impact |
| `codegraph_callees` | 查某 symbol 调用谁 | technical design / code review |
| `codegraph_impact` | 分析改动影响半径 | tasking / code-review / verification |
| `codegraph_node` | 查看单个 symbol 详情 | implementation 前定位 |
| `codegraph_files` | 查看索引文件结构 | steering / large repo |
| `codegraph_status` | 检查健康和 pending sync | 所有使用图谱前置检查 |

## CLI 命令

| 命令 | 用途 |
|---|---|
| `codegraph status` | 检查索引健康 |
| `codegraph query <symbol> --json` | 搜索 symbol |
| `codegraph callers <symbol> --json` | 查调用方 |
| `codegraph callees <symbol> --json` | 查被调用方 |
| `codegraph impact <symbol> --json` | 查影响面 |
| `codegraph affected --stdin --json` | changed files -> affected tests |
| `codegraph sync` | 脚本 / CI / watcher 不可用时手动增量同步 |

## 禁止

- 不把 `codegraph_explore` 的大段原文直接复制进 Wiki。
- 不把 graph result 直接写成 requirements。
- 不在 pending sync 时信任图谱内容。
- 不在没有 `source_paths` 时写 high confidence。

## 来源

- CodeGraph docs: https://colbymchenry.github.io/codegraph/
- CodeGraph README: https://github.com/colbymchenry/codegraph

