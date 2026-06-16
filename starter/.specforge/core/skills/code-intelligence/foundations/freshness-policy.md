# 新鲜度策略

## 默认策略

如果 CodeGraph MCP server 正在运行，优先依赖自动同步。CodeGraph 会在 MCP server 运行时监听文件变化，并在 debounce 后自动同步；MCP 响应如发现 pending / stale 文件，应提示 Agent 直接读取当前文件。

不要设计成“每次保存文件都强制 `codegraph sync`”。这会和 watcher 重复，也会拖慢日常实现。

## 阶段入口检查

以下阶段在使用图谱事实前必须做 freshness check：

- `sf-steering`
- `sf-tech-design`
- `sf-implement` 修改前
- `sf-code-review`
- `sf-verify`
- `sf-wiki` / `sf-close` 写长期事实前

可用命令：

```bash
codegraph status
node .specforge/core/scripts/graph-freshness.mjs --json
```

## 需要手动 sync 的场景

- 没有 MCP server / watcher。
- sandbox 禁用 watcher。
- 设置了 `CODEGRAPH_NO_DAEMON=1`。
- CI / 脚本模式。
- `git pull` / branch switch 后立刻要查询。
- code-review / verify 前需要确定 changed files 的影响面。

命令：

```bash
codegraph sync
```

## Pending sync 处理

如果 status 或 MCP 响应显示 pending sync：

1. 等待 debounce 完成。
2. 重新查 status。
3. 如仍 pending，运行 `codegraph sync`。
4. 对 pending / stale 文件必须直接读取当前文件，不得只信图谱。
5. freshness 仍不 clean 时，graph facts 的 `freshness` 写 `pending-sync` 或 `manual-verified`，不能写 `ready`。
