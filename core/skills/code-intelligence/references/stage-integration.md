# Stage Integration

## sf-steering

建立或刷新长期 Wiki：

1. `codebase-index --json`
2. 用户选择 scan mode
3. provider health / freshness check
4. `codebase-index --write-report`
5. provider query -> `graph_facts[]`
6. `graph_facts[]` + 文件验证 -> Wiki
7. `wiki-quality`

`sf-steering` 只负责项目画像和 Wiki 回写，不内置所有 provider 细节。

## sf-intake

把用户请求绑定到已有系统范围：

1. 先读 Wiki。
2. Wiki 能定位模块 / API / 数据时直接进入 brief。
3. Wiki 缺失或过期时，使用 change-focused 查询定位入口。
4. 只把结果写成 brief 的 code context。
5. 如果确认 Wiki 过期，路由 `sf-steering`。

## sf-requirements

验证现有行为和边界：

- 现有系统是否已有类似行为。
- 角色 / 权限边界是否已有约束。
- 数据来源 / 运行事实是否存在。
- Wiki 中现有契约是否仍可信。

CodeGraph 结果只能进入 current fact / existing behavior / pending evidence，不能直接变成 MUST / SHALL。

## sf-tech-design

最适合深度集成代码智能的阶段：

1. 读取 Wiki bounded context。
2. `graph-freshness --json`。
3. `codegraph_explore` 目标模块 / 入口。
4. `codegraph_callers` / `codegraph_callees` 关键 symbol。
5. `codegraph_impact` 拟修改 symbol。
6. 归一 `graph_facts[]`。

写入 Architecture Contract、Impact Analysis、Affected Modules、Affected Tests 和 Implementation Handoff。

## sf-tasking

根据 `graph_facts[]` 和 technical design：

- 按模块边界拆任务。
- 把调用链高风险点拆成独立任务。
- 把 affected tests 写入每个任务的 Verification。
- 把 rollback seam 写进任务。

## sf-implement

修改前：

- 读取 task boundary。
- 用 `codegraph_explore` / `codegraph_node` 定位具体 symbol。
- 只读取目标文件和必要上下游文件。

修改后：

- `graph-freshness --json`。
- pending sync 时等待或 sync。
- MCP 提示 stale file 时直接读取当前文件。
- implementation report 写 touched symbols、graph freshness、affected area。

## sf-code-review

对真实 diff 做影响面审查：

```bash
git diff --name-only | codegraph affected --stdin --json
node .specforge/core/scripts/graph-impact.mjs --from-git --json
```

检查：

- diff 是否超出 technical design 边界。
- affected tests 是否运行。
- changed-files 与 graph impact 是否匹配。
- impact 是否暴露 API / data / job / auth 风险。

## sf-verify

用 affected tests 和 impact 选择验证范围：

- code-review 有 affected tests：优先运行。
- UI / route 受影响：跑对应 Playwright。
- API / data / job 受影响：跑 contract / integration / runtime smoke。

## sf-wiki / sf-close

代码变更稳定后，更新长期 Wiki：

- code_review approved。
- verification passed。
- diff 改变长期 API、数据、权限、配置、任务、运行或架构边界。
- `wiki-refresh-plan --from-diff --json` 返回需要更新。

