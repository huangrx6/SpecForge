# Research To PRD

research 输入只转成产品决策证据、风险、约束、指标或 open question；不直接写技术方案。

| Research 内容 | PRD 位置 | 处理 |
|---|---|---|
| confirmed fact | Background / Risks / Snapshot | 写事实、来源和影响 |
| unclear fact | Open Questions | 写 owner / needed-by |
| provider limit | AI / Data / Compliance Snapshot | 写成本、延迟、限流或交付风险 |
| competitor fact | Candidate Feature Pool / Risk | 写参考，不当作必须照抄 |
| compliance / security fact | Risk / Non-goals / Handoff | 写数据、安全、人工复核或 research-needed |

## Rules

- 当前事实不足以决定范围或指标时，Decision Status = `research-needed`。
- 技术事实只在 PRD 中写产品影响，例如成本、延迟、可用性、合规限制。
- PRD 不把 research PoC 的实现细节变成 MVP。
- 引用事实时记录来源文件和结论，不复制长篇 research。
