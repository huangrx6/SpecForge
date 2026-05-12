# 规则索引

规则层保存长期有效的工程约束。它不记录某个 change 的临时状态，也不替代 `requirements.md`、`design.md` 或 `tasks.md`。Agent 进入项目后，应按任务类型加载必要规则，并在产物中留下已遵守或偏离规则的证据。

## 加载原则

- 先读 `.specforge/AGENTS.md`、`.specforge/manifest.yaml`、`.specforge/registry.yaml` 和当前 `change.yaml`。
- 再根据本索引加载规则。不要一次性把全部规则塞进上下文。
- 如果规则和当前项目知识冲突，优先以 `.specforge/knowledge/` 的长期事实为准，并在当前 change 中记录冲突。
- 如果规则和用户明确指令冲突，先遵守更高优先级指令，并在产物里写清偏离原因。
- 涉及外部框架、SDK、API 或安全标准时，必须查当前官方文档。

## 场景到规则

| 场景 | 必读规则 |
|---|---|
| 通用工程改动 | `engineering/README.md` |
| 范围界定、拆分 change | `boundaries/README.md`、`spec-quality/README.md` |
| 加载上下文、控制 token | `context/README.md` |
| 判断流程状态、读产物依赖 | `artifact-graph.md` |
| 阶段推进、批准或拒绝 gate | `gates/README.md`、`review/README.md` |
| 需求、设计、任务编写 | `spec-quality/README.md`、`boundaries/README.md` |
| API、SDK、事件、集成契约 | `api-design/README.md`、`security/README.md`、`testing/README.md` |
| 安全敏感变更 | `security/README.md`、`review/README.md`、`testing/README.md` |
| 测试计划、验证和证据 | `testing/README.md`、`gates/README.md` |
| 发布、配置、回滚、运维证据 | `delivery/README.md`、`security/README.md` |
| 人类可读文档、中文协作 | `localization.md` |

## 规则文件职责

| 文件 | 职责 |
|---|---|
| `engineering/README.md` | 工程纪律入口；细节按需读取 `engineering/references/` |
| `boundaries/README.md` | 边界治理入口；细节按需读取 `boundaries/references/` |
| `context/README.md` | 上下文治理入口；细节按需读取 `context/references/` |
| `artifact-graph.md` | schema、artifact、gate、registry、archive 的状态判断 |
| `gates/README.md` | 门禁入口；细节按需读取 `gates/references/` |
| `review/README.md` | 审查入口；细节按需读取 `review/references/` |
| `spec-quality/README.md` | 规格质量入口；细节按需读取 `spec-quality/references/` |
| `api-design/README.md` | API 契约入口；细节按需读取 `api-design/references/` |
| `security/README.md` | 安全入口；细节按需读取 `security/references/` |
| `testing/README.md` | 测试入口；细节按需读取 `testing/references/` |
| `delivery/README.md` | 交付入口；细节按需读取 `delivery/references/` |
| `localization.md` | 中文优先、术语一致和引用表达 |

## 参考来源

- Kiro Specs: https://kiro.dev/docs/specs/
- Kiro Steering: https://kiro.dev/docs/steering/
- GitHub Spec Kit: https://github.github.com/spec-kit/
- OpenSpec: https://openspec.pro/
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- NIST SSDF: https://csrc.nist.gov/projects/ssdf
