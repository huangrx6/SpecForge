# 上下文规则

上下文应渐进加载。更多上下文不一定更好。

## 上下文优先级

| 优先级 | 来源 | 用途 |
|---|---|---|
| 1 | 当前用户指令、系统/开发者指令 | 当前任务的最高约束 |
| 2 | `.specforge/AGENTS.md`、`manifest.yaml` | SpecForge 加载协议和路径约定 |
| 3 | 当前 `change.yaml` 和 active change 产物 | 当前工作状态、gate 和证据 |
| 4 | `.specforge/project/` | 长期项目事实和 SSoT |
| 5 | `.specforge/rules/`、workflow、schema | 长期流程和工程规则 |
| 6 | archived change | 历史原因、回归背景、决策证据 |
| 7 | 外部官方文档 | 版本敏感事实、第三方 API、工具行为 |

低优先级资料不得覆盖高优先级事实。发现冲突时，应在当前产物记录冲突，并给出处理方式。

## 加载原则

- 从 `AGENTS.md`、`.specforge/manifest.yaml`、`.specforge/registry.yaml` 和当前 `change.yaml` 开始。
- 只加载当前任务需要的 workflow、rules、templates 和 project SSoT。
- 当前事实优先使用 project SSoT，不优先使用 archived change。
- archived change 只用于历史原因、回归背景或用户明确要求。
- 涉及库、API、框架或外部工具时，版本敏感事实必须查官方当前文档。
- 读取代码时先用 `rg`、`rg --files`、目录索引和入口文件定位，不做无目标的全量阅读。
- 对外部资料只沉淀结论、适用范围和链接，不搬运大段原文。
- 对 AI 工具可自动加载的规则，应保持短、稳定、可执行；长篇研究放到 `reference/`。

## 上下文预算

| 任务规模 | 默认处理 |
|---|---|
| 小 | 直接实现或 lite workflow |
| 中 | standard workflow，包含 requirements、design、tasks、review、verification |
| 大 | 先 discovery，再拆成多个 change 或 initiative |

## 加载顺序

### 进入仓库

1. 读取根 `AGENTS.md` 或 `.specforge/AGENTS.md`。
2. 读取 `.specforge/manifest.yaml`，确认 profile、workflow 和路径。
3. 读取 `.specforge/registry.yaml`，确认 active / blocked / archive。
4. 如果有 active change，读取对应 `change.yaml`。
5. 根据当前 stage 加载必要规则和模板。

### 做需求或设计

- 加载 `spec-quality.md`、`boundaries.md`、`api-design.md`。
- 如涉及已有系统，加载 `.specforge/project/engineering/architecture.md` 和相关 code map。
- 如涉及外部接口，查官方文档或项目内 OpenAPI / proto / SDK 契约。

### 做实现

- 加载当前 `requirements.md`、`design.md`、`tasks.md`。
- 加载 `engineering.md`、`security.md`、`testing.md` 中相关段落。
- 只读取任务涉及的源码、测试和配置。

### 做 review 或 verify

- 加载 `review.md`、`gates.md`、`testing.md`。
- 对照 `changed-files.md`、测试输出、CI 结果和用户验收证据。

## 外部事实规则

必须查官方当前文档的情况：

- SDK、CLI、框架、云服务、AI 工具、协议或规范可能已经更新。
- 用户要求“最新”“当前”“今天”“现在”。
- 安全、合规、金融、医疗、法律或生产部署相关结论。
- 文档中要引用具体命令、参数、版本、错误码或配置字段。

优先级：

1. 官方规范、官方文档、标准组织。
2. 项目源码、release note、README。
3. 维护者公告或 issue / discussion。
4. 博客、教程、社区经验只作为补充，不作为唯一依据。

## 反模式

- 还不知道任务就加载整个仓库。
- 复制旧规格文本而不检查是否仍适用。
- 把旧 implementation report 当成当前架构。
- 发现歧义后继续推进却不记录。
- 用社区文章替代官方规范。
- 把一次性调研结论写进长期规则，却没有适用范围和过期风险。
- 在没有证据的情况下声称“已经验证”“兼容所有情况”。

## 参考来源

- Kiro Steering 建议把持久项目知识拆成聚焦的 markdown 文件，并控制何时加载：https://kiro.dev/docs/steering/
- Claude Skills 文档把复杂能力、脚本、模板和参考资料组织成按需加载的目录：https://docs.claude.com/en/docs/agents-and-tools/agent-skills
- OpenAI prompt engineering 建议明确任务、上下文、输出格式和成功标准：https://help.openai.com/en/articles/6654000-comprehensive-step-by-step-guide-to-prompt-engineering-with-chatgpt
