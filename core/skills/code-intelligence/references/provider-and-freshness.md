# Provider And Freshness

本文件定义 provider 生命周期、CodeGraph 使用边界和 freshness 处理。核心判断：installed 不等于 ready，ready 也不等于可以不读关键源码。

## Provider 状态

| 状态 | 含义 | 可用性 |
| --- | --- | --- |
| `missing` | 未安装 | 不可用 |
| `installed` | CLI 已安装 | 不代表可被 Agent 调用 |
| `mcp-configured` | 已接入 Agent MCP | 可被 Agent 调用 |
| `initialized` | 当前项目有 `.codegraph/` 或 provider 项目索引 | 可建图 / 可查询候选 |
| `indexing` | 正在建索引或同步 | 不能写当前事实 |
| `sync-required` | 索引落后代码 | 只能作为候选 |
| `ready` | initialized + clean + no pending sync | 可作为证据源 |

## CodeGraph 正常接入

1. 安装 CLI。
2. 运行 `codegraph install`，把 CodeGraph MCP server 接入当前 Agent。
3. 在项目根运行 `codegraph init` 或 `codegraph init -i`，创建 `.codegraph/` 并构建索引。
4. 运行 `codegraph status` 或 MCP `codegraph_status`。
5. 只有 ready 后，才能把它作为 graph provider。

SpecForge 判定：

- `command -v codegraph` 只能说明 CLI installed。
- `codegraph install` 是否执行过，决定 Agent 能否直接调用 MCP。
- `.codegraph/` 是否存在，决定当前项目是否初始化。
- `codegraph_status` / `codegraph status` 决定 freshness。
- 安装、初始化或同步之前，必须让用户选择：用户自己处理，或授权 Agent 辅助处理。

## MCP / CLI 使用

| 能力 | 用途 |
| --- | --- |
| `codegraph_search` / `codegraph query` | 按名称找 symbol |
| `codegraph_explore` | 返回相关 symbols、源码片段和关系 |
| `codegraph_callers` / `codegraph callers` | 查调用方 |
| `codegraph_callees` / `codegraph callees` | 查被调用方 |
| `codegraph_impact` / `codegraph impact` | 分析影响半径 |
| `codegraph_node` | 查看单个 symbol 或文件 |
| `codegraph_files` | 查看索引文件结构 |
| `codegraph_status` / `codegraph status` | 检查健康和 pending sync |
| `codegraph affected --stdin --json` | changed files -> affected tests |
| `codegraph sync` | watcher 不可用、CI、branch switch 后手动同步 |

## Freshness 策略

如果 CodeGraph MCP server 正在运行，优先依赖 watcher 自动同步。不要设计成每次保存都强制 `codegraph sync`。

必须检查 freshness 的阶段：

- `sf-steering`
- `sf-tech-design`
- `sf-implement` 修改前
- `sf-code-review`
- `sf-verify`
- `sf-wiki` / `sf-close` 写长期事实前

需要手动 sync 的场景：

- 没有 MCP server / watcher。
- sandbox 禁用 watcher。
- 设置了 `CODEGRAPH_NO_DAEMON=1`。
- CI / 脚本模式。
- `git pull` / branch switch 后立刻查询。
- code-review / verify 前需要确定 changed files 影响面。

Pending sync 处理：

1. 等待 debounce 完成。
2. 重新查 status。
3. 如仍 pending，运行 `codegraph sync`。
4. 对 pending / stale 文件必须直接读取当前文件。
5. freshness 仍不 clean 时，graph facts 的 `freshness` 写 `pending-sync` 或 `manual-verified`，不能写 `ready`。

## 官方来源

- CodeGraph docs: https://colbymchenry.github.io/codegraph/
- CodeGraph README: https://github.com/colbymchenry/codegraph
