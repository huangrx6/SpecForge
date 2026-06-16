# Anti-patterns

| 反模式 | 失败信号 | 修正 |
|---|---|---|
| Steering-only CodeGraph | 只有 `sf-steering` 能读 CodeGraph 规则 | 改为阶段按需读取 `core/skills/code-intelligence` |
| Raw graph dump | Wiki / technical design 中出现 provider 原始长输出 | 归一成 `graph_facts[]`，再写当前事实 |
| Installed equals ready | 看到 CLI 就把 provider 当证据源 | 检查 MCP configured、project initialized、status clean |
| Full-repo reflex | 普通需求阶段临时全仓扫描 | 先读 Wiki，限定模块后查询 |
| Requirement by graph | Graph 结果直接写成 MUST / SHALL | 写成 existing behavior / current fact / pending evidence |
| Stale confidence | pending sync 仍写 high confidence | 降级为 low / pending-sync，并读取当前文件 |
| No source path | 没有 source path 却写 current fact | 降级为候选，补读取路径或测试证据 |

