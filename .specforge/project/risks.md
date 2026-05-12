# 风险

| 风险 | 缓解措施 |
|---|---|
| v0.1 流程变得过重 | 保留 lite workflow 和 discovery 路由，不强迫小任务走全流程 |
| 文档和实现漂移 | archive 前强制 SSoT sync |
| Agent 加载过多上下文 | 使用 loading protocol、registry 和 artifact graph |
| 文件存在被误判为完成 | active change 使用 graph 状态和 gate 状态共同判断 |
| 中文化不一致 | 使用 `localization.md` 作为默认写作规则 |
