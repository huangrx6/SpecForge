# Code Intelligence Workflow Playbook

代码智能的目标是把“现有代码事实”变成可追溯、可降级、可写入 SpecForge artifact 的证据。默认不做全仓重读；先建立 bounded context，再按风险选择 provider 或 fallback。

## 1. 默认顺序

1. 读取 `.specforge/wiki/00-index.md`。
2. 读取相关 Wiki：项目概览、架构、模块、API、数据模型、权限、运行、风险。
3. 从 Wiki 和用户请求提取 bounded context：模块、路径、symbol、API、页面、数据读写、测试位置、运行命令、风险。
4. 运行或读取适用机器入口：
   - `node .specforge/core/scripts/codebase-index.mjs --json`
   - `node .specforge/core/scripts/graph-freshness.mjs --json`
   - `node .specforge/core/scripts/graph-impact.mjs --from-git --json`
   - `node .specforge/core/scripts/wiki-refresh-plan.mjs --from-diff --json`
5. 在 bounded context 内使用 CodeGraph、MCP / SCIP provider、Repomix、bootstrap map、`rg` 或文件阅读验证局部事实。
6. 把 provider / fallback 输出归一为 `graph_facts[]` 或 impact report。
7. 按阶段写入 brief、requirements、technical design、tasks、implementation report、code review、verification report 或 Wiki。

## 2. 扫描模式

| 模式 | 适用 | 规则 |
| --- | --- | --- |
| `baseline-lite` | 小项目、目录清楚、首次粗看 | bootstrap map + `rg` + 少量关键文件 |
| `baseline-standard` | 普通存量项目首接入 | 建立项目概览、架构、数据、运行、风险；必要时局部 Repomix |
| `baseline-deep` | 大型仓库、遗留单体、多服务 | 必须优先使用 CodeGraph / MCP / SCIP provider；无 provider 且无目标范围时暂停 |
| `change-focused` | 新需求已有业务域、页面、接口或模块 | 只读本次范围和上下游 |
| `bug-focused` | 已有报错、日志、复现路径或异常模块 | 聚焦复现链路、调用链和回归测试 |

`codebase-index.mjs --json` 返回 `scan_mode_required` 时，不要擅自选模式；需要用户选择或已有明确 work item 线索。

## 3. Provider 选择

| 场景 | 推荐 |
| --- | --- |
| small | Wiki + bootstrap map + `rg` |
| medium | Wiki + bootstrap map + `rg`；目标模块明确时可用 Repomix |
| large / legacy | CodeGraph / MCP / SCIP graph provider |
| focused bug / change | 先限定模块；必要时用 graph provider 做 trace / impact |

小项目不要为了完整强行安装 provider。大型项目不能靠“多读文件”替代图谱；无 ready provider 且无目标模块时暂停，让用户选择 provider 或提供范围。

## 4. Bounded Context

普通阶段的查询必须围绕：

- 用户请求中的业务域、页面、接口、报错、日志、路径或复现步骤。
- Wiki 已知模块、API、数据、运行、风险。
- work item 的 requirements、technical design、tasks、changed files。
- code review 的 findings、residual risks、verification notes。

禁止把 CodeGraph、Repomix、bootstrap map 或 `rg` 当成“重新理解全仓”的借口。只有 steering / onboarding 明确选择 baseline 扫描模式时，才做项目画像级扫描。

## 5. 停止条件

- 大型仓库没有 ready graph provider，也没有用户给出的目标模块、业务域、页面、接口、报错路径或复现线索。
- provider 正在 indexing、pending sync 或 stale，且当前结论需要高置信图谱事实。
- provider 输出没有 source paths，却准备写成 high confidence 当前事实。
- Wiki 与当前文件、测试、CI 或用户确认冲突。
- provider 原始输出被准备直接粘贴到 Wiki、requirements 或 technical design。
