# Agent 加载策略

按任务选择 agent，不按习惯启动 agent。完整上下文规则见 `.specforge/policy/rules/context/README.md`。

## 选择顺序

1. 先运行 `node .specforge/execution/tools/instructions.mjs` 判断当前 ready artifact。
2. 根据 artifact 和风险选择一个主 agent。
3. 只有当问题明显跨专业边界时，才增加第二个 agent。
4. agent 输出不能替代 gate；gate 仍必须由 `.specforge/execution/tools/gate.mjs` 写入。

## 默认映射

| 场景 | 首选 agent | 可选补充 |
|---|---|---|
| 不知道下一步 | `spec-orchestrator` | `codebase-explorer` |
| 需要理解现有代码 | `codebase-explorer` | `architect-reviewer` |
| 设计方案或边界审查 | `architect-reviewer` | `security-auditor` |
| 实现后审查 | `code-reviewer` | `security-auditor`、`test-writer` |
| 测试失败或行为异常 | `debugger` | `test-writer` |
| 验证和证据 | `test-writer` | `delivery-engineer` |
| 发布、配置、回滚 | `delivery-engineer` | `security-auditor` |
| closure 和知识回流 | `knowledge-curator` | `architect-reviewer` |

## 上下文选择

| 任务 | 加载内容 |
|---|---|
| 规划变更 | workflow、artifact schema、templates、knowledge |
| 探索代码 | 当前问题、相关代码入口、必要测试和配置 |
| 审查 | 当前 work item、changed files、review templates、相关 rules |
| 验证 | 当前 work item、verification templates、testing rules |
| 收口 | 当前 work item、SSoT sync template、knowledge |

## 不做

- 不为小改动强行启动多个 agent。
- 不让 agent 读取全部 archive。
- 不让 agent 自行批准 gate。
- 不让 agent 改写未授权范围。
