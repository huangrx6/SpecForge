# 规则索引

规则层保存长期有效的工程约束。它不记录某个 change 的临时状态，也不替代 `requirements.md`、`design.md` 或 `tasks.md`。Agent 进入项目后，应按任务类型加载必要规则，并在产物中留下已遵守或偏离规则的证据。

## 加载原则

- 先读 `.specforge/AGENTS.md`、`.specforge/manifest.yaml`、`.specforge/registry.yaml` 和当前 `change.yaml`。
- 再根据本索引加载规则。不要一次性把全部规则塞进上下文。
- 如果规则和当前项目 SSoT 冲突，优先以 `.specforge/project/` 的项目事实为准，并在当前 change 中记录冲突。
- 如果规则和用户明确指令冲突，先遵守更高优先级指令，并在产物里写清偏离原因。
- 涉及外部框架、SDK、API 或安全标准时，必须查当前官方文档。

## 场景到规则

| 场景 | 必读规则 |
|---|---|
| 通用工程改动 | `engineering.md` |
| 范围界定、拆分 change | `boundaries.md`、`spec-quality.md` |
| 加载上下文、控制 token | `context.md` |
| 判断流程状态、读产物依赖 | `artifact-graph.md` |
| 阶段推进、批准或拒绝 gate | `gates.md`、`review.md` |
| 需求、设计、任务编写 | `spec-quality.md`、`boundaries.md` |
| API、SDK、事件、集成契约 | `api-design.md`、`security.md`、`testing.md` |
| 安全敏感变更 | `security.md`、`review.md`、`testing.md` |
| 测试计划、验证和证据 | `testing.md`、`gates.md` |
| 发布、配置、回滚、运维证据 | `delivery.md`、`security.md` |
| 人类可读文档、中文协作 | `localization.md` |

## 规则文件职责

| 文件 | 职责 |
|---|---|
| `engineering.md` | 代码改动、依赖、配置、数据迁移、错误处理和工程证据 |
| `boundaries.md` | owner、非目标、上下游契约、写入范围和边界违规 |
| `context.md` | 渐进加载、SSoT 优先级、外部事实验证和上下文预算 |
| `artifact-graph.md` | schema、artifact、gate、registry、archive 的状态判断 |
| `gates.md` | gate 状态、证据、推进条件和跳过规则 |
| `review.md` | spec review、code review、review 输出和阻断条件 |
| `spec-quality.md` | requirements、design、tasks 的质量标准 |
| `api-design.md` | HTTP API、RPC、SDK、事件、错误码、兼容性和 OpenAPI 约束 |
| `security.md` | 安全开发、密钥、认证授权、数据保护、日志和依赖安全 |
| `testing.md` | 测试分层、覆盖策略、验证证据和风险匹配 |
| `delivery.md` | 配置、构建发布、日志、可观测性、回滚和上线准备 |
| `localization.md` | 中文优先、术语一致和引用表达 |

## 参考来源

- Kiro Specs: https://kiro.dev/docs/specs/
- Kiro Steering: https://kiro.dev/docs/steering/
- GitHub Spec Kit: https://github.github.com/spec-kit/
- OpenSpec: https://openspec.pro/
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- NIST SSDF: https://csrc.nist.gov/projects/ssdf
