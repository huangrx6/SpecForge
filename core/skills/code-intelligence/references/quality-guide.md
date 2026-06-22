# Code Intelligence Quality Guide

## 常见反模式

| 反模式 | 失败信号 | 修正 |
| --- | --- | --- |
| Steering-only CodeGraph | 只有 `sf-steering` 能读 CodeGraph 规则 | 改为阶段按需读取 `core/skills/code-intelligence` |
| Raw graph dump | Wiki / technical design 中出现 provider 原始长输出 | 归一成 `graph_facts[]`，再写当前事实 |
| Installed equals ready | 看到 CLI 就把 provider 当证据源 | 检查 MCP configured、project initialized、status clean |
| Full-repo reflex | 普通需求阶段临时全仓扫描 | 先读 Wiki，限定模块后查询 |
| Requirement by graph | Graph 结果直接写成 MUST / SHALL | 写成 existing behavior / current fact / pending evidence |
| Stale confidence | pending sync 仍写 high confidence | 降级为 low / pending-sync，并读取当前文件 |
| No source path | 没有 source path 却写 current fact | 降级为候选，补读取路径或测试证据 |
| Affected tests as proof | affected tests 被列出但没运行 | 在 review / verify 中记录为待执行或缺证据 |
| Repomix full dump | 中型仓库无目标模块就打包全仓 | 先限定 module / focus |

## 修复顺序

1. 先确认当前阶段是否真的需要代码智能。
2. 若已有 Wiki，先从 Wiki 建 bounded context。
3. 运行 `codebase-index.mjs --json` 判断规模、scan mode、provider health。
4. provider 未 ready 时，决定：用户处理、Agent 授权处理、或降级为 low confidence fallback。
5. provider / fallback 输出先归一为 `graph_facts[]` 或 impact report。
6. 写 artifact 时保留 source paths、confidence、freshness 和 used_for。
7. 与当前文件、测试、CI 或用户确认冲突时，停止并记录冲突。

## 质量门槛

- 每个 high confidence fact 必须有 source_paths。
- 每个 current fact 必须来自 ready / manual-verified freshness。
- 每个 technical design 影响面必须可追溯到 Wiki、GF id、source path 或测试。
- 每个 affected test 在 code review / verification 中必须变成已运行、跳过理由或 verification note。
- 每个 Wiki 回写候选必须说明是长期事实、运行事实、风险事实，还是无需写入。
