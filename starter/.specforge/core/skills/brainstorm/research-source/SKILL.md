---
name: research-source
description: Brainstorm 包内的事实查证 skill。用于当前事实、版本、依赖关系、竞品/定价、AI provider 限制、安全漏洞、法规合规、浏览器兼容性或证据交接会影响 brainstorm 方向、范围、成本、技术路线或推荐置信度时。
---

# 事实查证

本 skill 负责把 `sf-brainstorm` 中的“需要查外部事实”变成可执行搜索流程。它不是 deep research，也不替用户做方案选择；它只回答：查什么、去哪里查、证据够不够、哪些仍不确定。

## 什么时候使用

- 技术选型有 2+ 个候选，且版本、兼容性、维护状态或迁移风险会影响取舍。
- 可能新增 / 替换依赖、SDK、插件、组件库、ORM、驱动、测试库或外部 provider。
- 讨论 AI provider 的模型能力、上下文长度、价格、限流、数据使用或 SDK/API 版本。
- 竞品功能、定价、定位或发布节奏会影响 MVP 范围。
- 用户提到 agent 不熟悉或近期变化明显的库、框架、服务、协议、法规或市场。
- 安全漏洞、合规、数据隐私、浏览器兼容性或可访问性会影响架构或验收。
- 需要判断是否升级为正式 discovery research：多来源结论冲突、争议明显、研究空白会改变决策。

## 读取顺序

1. 读取当前 `brainstorm.md`、`brief.md` 或用户原始问题，提取需要事实支撑的问题。
2. 读取 `references/research-protocol.md`，先确认本地事实、查询模式、时效规则、冲突处理和升级规则。
3. 读取 `references/source-index.md`，按问题类型选择来源。
4. 读取 `references/evidence-contract.md`，确定输出格式、置信度和未查证项写法。
5. 涉及新增 / 替换依赖、SDK、插件、组件库、测试库、运行时或 package manager 时，读取 `references/dependency-version-map.md`，建立版本依赖关系和 tech-design 交接。
6. 如果出现多来源争议、竞品/市场范围大、法规风险或 AI 能力边界是核心变量，把缺口写入 `brainstorm.md#问题地图` 并交给 `sf-discovery` 的 research artifact，不在 brainstorm 内伪装成已解决。

## 搜索流程

1. **拆问题**：把模糊问题拆成可查证事实，例如“这个库靠谱吗”拆成版本、维护、兼容、安全、社区反馈。
2. **读本地事实**：先查已有 artifact、wiki、manifest、lockfile、runtime config 和已批准决策；缺失时写 `unknown`。
3. **选来源**：优先官方文档、release notes、package metadata、GitHub issues、规范文档；社区内容只能补充观点。
4. **查当前资料**：涉及版本、价格、模型能力、API 限制、漏洞、法规或竞品状态时必须联网查证，不能凭旧知识。
5. **处理冲突和时效**：按 `research-protocol.md` 判断来源新旧、冲突、负证据和是否升级 discovery research。
6. **建版本关系**：新增 / 替换依赖时查 direct deps、peer deps、runtime / engine、lockfile、transitive deps、breaking changes 和 override / resolution 需求。
7. **记录证据**：每条证据记录 URL、访问 / 发布日期、结论和置信度。
8. **归一化**：把结论写成 `confirmed / likely / unclear`，并明确哪些问题仍需实测、用户提供账号或后续 research。
9. **交回 brainstorm**：只把事实证据、风险、未查证项和 tech-design 交接交给 `sf-brainstorm`；是否采用某方案仍由用户确认。

## 查证深度

| 深度 | 适用场景 | 最小证据 |
|---|---|---|
| Quick fact check | 单个事实只影响表达或低风险排序 | 1 个 A 级来源，记录访问日期 |
| Standard decision evidence | 会影响 brainstorm 方案取舍、MVP、成本或依赖确认 | 2 个互补来源，例如官方 docs + release / package metadata / pricing |
| Dependency evidence | 新增 / 替换依赖、SDK、插件、运行时或 package manager | package metadata + 官方 docs / release notes + 版本依赖关系表 + 安全 / 维护信号 |
| High-stakes evidence | AI provider 成本、合规、安全、法规、生产兼容性 | 官方来源优先，至少覆盖能力 / 限制 / 成本或风险；冲突时交给 `sf-discovery` research 或写 `unclear` |

如果达不到对应深度，不能把结论写成 `confirmed`。

## 输出到 SpecForge

| 内容 | 写入位置 |
|---|---|
| 搜索计划摘要 | `00-intake/brainstorm.md#当前事实与研究证据` |
| 本地事实输入 | `00-intake/brainstorm.md#当前事实与研究证据`，写明读取到的 artifact / manifest / lockfile 或缺口 |
| 当前事实与研究证据表 | `00-intake/brainstorm.md#当前事实与研究证据` |
| 版本依赖关系表 | `00-intake/brainstorm.md#当前事实与研究证据`，仅在版本关系影响取舍时必填 |
| 未查证项 checklist | `00-intake/brainstorm.md#当前事实与研究证据` |
| 对方案取舍有影响的事实 | `00-intake/brainstorm.md#方案选项` 或 `#问题地图` |
| 需要 discovery research 的原因 | `00-intake/brainstorm.md#参考 Skill 使用记录` 或后续 `01-spec/research.md` |
| 下游技术风险 | 后续 `technical-design.md` 的当前版本事实、依赖确认、风险或验证章节 |

## 输出格式

```md
## 当前事实与研究证据

搜索计划：

| 事实问题 | 来源类型 | 查询入口 | 足够性 |
|---|---|---|---|
| 依赖兼容性 | 官方 docs + release notes | docs URL / GitHub releases | 覆盖版本支持和 breaking changes |

本地事实：
- 已读取：
- 缺失 / unknown：

| 问题 | 来源 | 日期 | 结论 | 置信度 |
|---|---|---|---|---|
| 依赖兼容性 | 官方 docs / release notes URL | 访问或发布日期 | 1-2 句结论 | confirmed / likely / unclear |

版本依赖关系：

| 依赖 / 技术 | 当前 / 候选版本 | 关系类型 | 约束来源 | 影响 | 交接 |
|---|---|---|---|---|---|
| | | direct / peer / runtime / lockfile / transitive / breaking / override | URL 或 manifest / lockfile 路径 | | tech-design lock version / needs user dependency decision / needs spike / no action |

覆盖度：

未查证项：
- [ ] 问题描述 → 待查来源 / 需要用户提供账号或上下文
```

## 置信度

- `confirmed`：A 级来源直接支持结论，或多个可靠来源一致。
- `likely`：来源可靠但间接，或只有 B 级来源支持；需要后续验证。
- `unclear`：来源冲突、缺少日期、官方未说明或需要实测。

## 和 discovery research 的边界

| 能力 | 使用时机 | 产出 |
|---|---|---|
| `research-source` | 单个 brainstorm 取舍需要当前事实证据 | 证据表、版本关系、置信度、未查证项 |
| `sf-discovery` research | 多来源综合、实验、共识 / 争议拆解或研究空白会影响方向 | `01-spec/research.md`、实验和可复现证据 |

## 和 tech-design 的边界

| 能力 | 使用时机 | 产出 |
|---|---|---|
| `research-source` | 版本关系会影响是否采用某方案、是否需要用户确认依赖、是否需要 spike | 版本依赖关系表、风险、未查证项、交接 |
| `sf-tech-design` | 用户已确认技术 / 依赖方向后，需要可实现的工程方案 | 最终版本锁定、依赖确认记录、兼容策略、验证和回滚方案 |

## 禁止

- 不把训练数据、模型记忆或二手文章当当前事实。
- 不引用 AI 生成文章、SEO 聚合页、无日期营销软文作为事实来源。
- 不把社区评论当官方声明；只能作为用户痛点或争议线索。
- 不因为找不到资料就补一个“看起来合理”的结论；写 `unclear`。
- 不替代用户确认，也不把 agent recommendation 写成 approved。

## 质量门槛

- 每个外部事实必须有 URL 或明确写 `unknown / inaccessible`。
- 日期必须是访问日期或来源发布日期；价格、版本、模型能力和竞品状态优先写访问日期。
- 证据结论必须短，只写来源能支撑的事实。
- 版本依赖影响方案取舍时，必须补版本依赖关系表。
- 证据不足时降低置信度或升级 `sf-discovery` research，不用推测补齐。
