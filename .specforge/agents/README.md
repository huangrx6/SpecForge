# 内置 Agent 说明

`.specforge/agents/` 定义 SpecForge 推荐的内置协作角色。它们不是独立运行时，也不是强制多 Agent 调度器；它们是给支持 subagent / agent role 的工具使用的角色说明。

默认只内置 SDD 流程中高频、低争议、能降低风险的角色：

| Agent | 主要阶段 | 作用 |
|---|---|---|
| `spec-orchestrator` | 全流程 | 判断状态、路由下一步、保护 gate |
| `codebase-explorer` | intake / design | 定向阅读代码，回答“当前系统怎么做” |
| `architect-reviewer` | design / spec_review | 审查架构边界、模块责任和长期影响 |
| `code-reviewer` | code_review | 审查实现偏差、缺陷、回归和可维护性 |
| `test-writer` | implementation / verification | 补测试策略、测试用例和验证证据 |
| `security-auditor` | design / review / verify | 审查权限、密钥、输入、数据和供应链风险 |
| `debugger` | verify / bugfix | 定位失败根因，提出最小修复路径 |
| `delivery-engineer` | verify / closure | 检查 CI、配置、发布、回滚和上线观察 |
| `knowledge-curator` | closure | 判断长期知识是否需要回流 |

## 使用原则

- 只在角色能明显降低上下文污染、审查风险或专业盲区时使用。
- 每个 agent 只处理自己的职责，不替代 gate。
- agent 输出是建议或证据，最终状态仍由 `.specforge/tools/gate.mjs` 写入。
- 不要为普通小改动强行启动多个 agent。
- 不要把 archived change 默认交给 agent 读取，除非任务需要历史背景。

## 文件结构

```text
agents/
├── README.md
├── loading.md
└── builtins/
    ├── spec-orchestrator.md
    ├── codebase-explorer.md
    ├── architect-reviewer.md
    ├── code-reviewer.md
    ├── test-writer.md
    ├── security-auditor.md
    ├── debugger.md
    ├── delivery-engineer.md
    └── knowledge-curator.md
```

如果后续要增加前端、后端、数据库等专项 agent，先确认对应 rules 已存在，再加入 builtins；否则容易变成泛泛专家名片。
