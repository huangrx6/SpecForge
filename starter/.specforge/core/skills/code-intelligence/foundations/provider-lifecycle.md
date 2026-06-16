# Provider 生命周期

## Provider 状态

| 状态 | 含义 | 可用性 |
|---|---|---|
| `missing` | 未安装 | 不可用 |
| `installed` | CLI 已安装 | 不代表可被 Agent 调用 |
| `mcp-configured` | 已接入 Agent MCP | 可被 Agent 调用 |
| `initialized` | 当前项目有 `.codegraph/` 或 provider 项目索引 | 可建图 / 可查询候选 |
| `indexing` | 正在建索引或同步 | 不能写当前事实 |
| `sync-required` | 索引落后代码 | 只能作为候选 |
| `ready` | initialized + clean + no pending sync | 可作为证据源 |

## CodeGraph 正常接入步骤

1. 安装 CLI。
2. 运行 `codegraph install`，把 CodeGraph MCP server 接入当前 Agent。
3. 在项目根运行 `codegraph init` 或 `codegraph init -i`，创建 `.codegraph/` 并构建索引。
4. 运行 `codegraph status` 或 MCP `codegraph_status`。
5. 只有 ready 后，才能把它作为 graph provider。

## SpecForge 判定规则

- `command -v codegraph` 只能说明 CLI installed。
- `codegraph install` 是否执行过，决定 Agent 能不能直接调用 MCP 工具。
- `.codegraph/` 是否存在，决定当前项目是否初始化。
- `codegraph_status` / `codegraph status` 决定是否 fresh。
- 未 ready 时，不得把 graph 结果写入 Wiki 当前事实。
- 安装、初始化或同步之前，必须让用户选择：用户自己处理，或授权 Agent 辅助处理。

## 官方事实来源

- CodeGraph docs: https://colbymchenry.github.io/codegraph/getting-started/introduction/
- CodeGraph README: https://github.com/colbymchenry/codegraph
