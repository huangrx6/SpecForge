# Agent 上下文加载策略

按任务加载上下文，不按习惯加载上下文。

## 必读入口

1. `.specforge/manifest.yaml`
2. `.specforge/registry.yaml`
3. 有 active change 时读取当前 `change.yaml`

## 上下文选择

| 任务 | 加载内容 |
|---|---|
| 规划变更 | workflow、artifact schema、templates、project SSoT |
| 实现 | 当前 change、implementation templates、相关规则 |
| 审查 | 当前 change、changed files、review templates、相关规则 |
| 验证 | 当前 change、verification templates、testing rules |
| 收口 | 当前 change、SSoT sync template、project SSoT |

除非用户需要历史上下文，否则不要加载无关 archived changes。
