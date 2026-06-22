# Research Source

本文件是 Brainstorm 的事实查证协议。用于当前事实、版本、依赖关系、竞品 / 定价、AI provider 限制、安全漏洞、法规合规、浏览器兼容性或证据交接会影响方向、范围、成本、技术路线或推荐置信度时。

它不是 deep research，也不替用户做方案选择；它只回答：查什么、去哪里查、证据够不够、哪些仍不确定。

## 使用时机

- 技术选型有 2 个以上候选，且版本、兼容性、维护状态或迁移风险会影响取舍。
- 可能新增 / 替换依赖、SDK、插件、组件库、ORM、驱动、测试库或外部 provider。
- 讨论 AI provider 的模型能力、上下文长度、价格、限流、数据使用或 SDK / API 版本。
- 竞品功能、定价、定位或发布节奏会影响 MVP 范围。
- 用户提到 agent 不熟悉或近期变化明显的库、框架、服务、协议、法规或市场。
- 安全漏洞、合规、数据隐私、浏览器兼容性或可访问性会影响架构或验收。
- 需要判断是否升级为正式 discovery research。

## 读取顺序

1. 读取当前 `brainstorm.md`、`brief.md` 或用户原始问题，提取需要事实支撑的问题。
2. 先确认本地事实：artifact、wiki、manifest、lockfile、runtime config 和已批准决策。
3. 按问题类型选择来源。
4. 确定输出格式、置信度和未查证项写法。
5. 涉及新增 / 替换依赖、SDK、插件、组件库、测试库、运行时或 package manager 时，建立版本依赖关系和 tech-design 交接。
6. 如果出现多来源争议、竞品 / 市场范围大、法规风险或 AI 能力边界是核心变量，把缺口写入 `brainstorm.md#问题地图` 并交给 `sf-discovery` research。

## 本地事实优先

联网前先确认是否已有本地事实。已有本地事实不是最终事实，但能缩小搜索范围，避免查错生态或版本。

| 本地事实 | 优先文件 / 位置 | 用途 |
|---|---|---|
| 已有技术栈 | `.specforge/wiki/`、`package.json`、`pyproject.toml`、`go.mod`、`Cargo.toml`、`pom.xml`、`build.gradle` | 判断是否沿用现有栈 |
| 实际安装版本 | lockfile、package manager output | 判断当前安装树和 manifest 是否一致 |
| 项目运行时 | `.nvmrc`、`.node-version`、`.python-version`、Dockerfile、CI config、deployment config | 判断 engine / runtime / deploy compatibility |
| 已批准决策 | `brief.md`、`brainstorm.md`、`prd.md`、`requirements.md`、`ui-design.md`、`technical-design.md` | 区分用户已确认、Agent 推荐和未决项 |
| 安全 / 合规约束 | requirements、wiki、security notes、deployment docs | 决定是否升级为 high-stakes evidence |

本地事实缺失时不能假设默认版本；写 `unknown`，并在未查证项中说明缺哪个文件或上下文。

## 搜索流程

1. **拆问题**：把“这个库靠谱吗”拆成版本、维护、兼容、安全、社区反馈。
2. **读本地事实**：先查已有 artifact、wiki、manifest、lockfile、runtime config。
3. **选来源**：优先官方文档、release notes、package metadata、GitHub issues、规范文档；社区内容只能补充观点。
4. **查当前资料**：涉及版本、价格、模型能力、API 限制、漏洞、法规或竞品状态时必须查证，不能凭旧知识。
5. **处理冲突和时效**：判断来源新旧、冲突、负证据和是否升级 discovery research。
6. **建版本关系**：新增 / 替换依赖时查 direct deps、peer deps、runtime / engine、lockfile、transitive deps、breaking changes 和 override / resolution 需求。
7. **记录证据**：每条证据记录 URL、访问 / 发布日期、结论和置信度。
8. **归一化**：把结论写成 `confirmed / likely / unclear`。
9. **交回 brainstorm**：只把事实证据、风险、未查证项和 tech-design 交接交给 brainstorm；是否采用某方案仍由用户确认。

## 查证深度

| 深度 | 适用场景 | 最小证据 |
|---|---|---|
| Quick fact check | 单个事实只影响表达或低风险排序 | 1 个 A 级来源，记录访问日期 |
| Standard decision evidence | 会影响方案取舍、MVP、成本或依赖确认 | 2 个互补来源，例如官方 docs + release / package metadata / pricing |
| Dependency evidence | 新增 / 替换依赖、SDK、插件、运行时或 package manager | package metadata + 官方 docs / release notes + 版本依赖关系表 + 安全 / 维护信号 |
| High-stakes evidence | AI provider 成本、合规、安全、法规、生产兼容性 | 官方来源优先，至少覆盖能力 / 限制 / 成本或风险；冲突时交给 research 或写 `unclear` |

达不到对应深度时，不能把结论写成 `confirmed`。

## Source Index

| 问题类型 | 首选来源 | 使用说明 |
|---|---|---|
| npm 包版本、维护状态 | npmjs、GitHub Releases、deps.dev、scorecard.dev | 看 latest、release cadence、license、advisory、维护活跃度 |
| 依赖兼容性 / peer deps | package metadata、repo `package.json`、CHANGELOG、npm / pnpm docs | 对照当前项目 host package、engine、bundler、runtime |
| Lockfile / 实际安装树 | package-lock、pnpm-lock、yarn.lock、poetry.lock、uv.lock、go.sum、Cargo.lock | manifest 只说明期望，lockfile 说明实际安装树 |
| Breaking changes | CHANGELOG、release notes、migration docs、GitHub Releases | 判断是否改变 implementation 成本或 MVP 范围 |
| 安全漏洞 | OSV、deps.dev、GitHub Advisories、NVD、Snyk | 引入新依赖或升级关键包前查当前 advisory |
| AI provider 能力 / 价格 | provider 官方 docs、pricing、rate limits、data usage、SDK releases | 模型和价格变化快，必须记录访问日期 |
| 竞品功能 / 定价 | 竞品官网、docs、pricing、changelog、official blog | 第三方评测只能作观点，不当事实 |
| 浏览器兼容 / Web API | MDN、caniuse、W3C / WHATWG / TC39 | 记录目标浏览器和 fallback |
| 可访问性 | WCAG、WAI-ARIA APG、MDN Accessibility | 查 pattern 和键盘路径 |
| 法规 / 合规 | 官方法规、监管机构、标准组织、OWASP | high-stakes evidence；不足时写 `unclear` |

禁止来源：

- AI 生成文章。
- 无日期 SEO 聚合页。
- 无法追溯来源的搬运内容。
- 用社区评论证明功能、价格、兼容性或安全状态。

## 时效规则

| 事实类型 | 必填日期 | 过期边界 |
|---|---|---:|
| AI provider 价格、模型能力、上下文长度、限流、配额 | 访问日期 | 14 天 |
| 竞品 pricing、套餐、功能可用性 | 访问日期 | 30 天 |
| npm / SDK / API latest version | 访问日期或 registry / release 日期 | 30 天 |
| peer deps、engine、breaking changes | release 日期 + 当前项目 manifest / lockfile 日期 | 90 天，或目标版本变化时立即过期 |
| 安全漏洞 / CVE / advisory | 访问日期 | 7 天 |
| 浏览器兼容性 / Web API | 访问日期 + 目标浏览器版本 | 90 天 |
| 法规 / 合规 | 法规版本、发布日期或官方访问日期 | 有修订 / 生效日期变化时过期 |

资料过期但会影响成本、安全或架构时，写 `unclear` 并升级后续 research / technical design。

## 交叉验证与冲突处理

来源冲突时不要平均处理，也不要选择更符合推荐方案的来源。

1. 先按来源等级排序：官方当前文档 / registry / release notes > 官方 issue / maintainer comment > 标准或 advisory database > 高质量参考文章 > 社区讨论。
2. 同等级下优先当前资料，旧资料降级为背景。
3. A 级来源和 B 级来源冲突时，以 A 级当前来源为事实；B 级只记录为风险线索。
4. 两个 A 级来源冲突时，优先更接近事实主体的来源：provider / package / product 官方 > 标准 / registry / advisory > framework 集成文档。
5. 官方 docs 和 registry / package metadata 冲突时，补查 release notes、repo manifest、issue / maintainer comment。
6. 仍冲突则写 `unclear`，列出冲突来源和需要谁确认。
7. 冲突会改变 MVP、成本、安全或架构时，写入 `[必须确认]` 或交给 `sf-discovery` research。

负证据写法：

```md
未查证项：
- [ ] 未找到官方说明 X 是否支持 Vue 3.5；已查 docs、npm metadata、GitHub releases，需要 tech-design spike 验证。
```

禁止把“没搜到问题”写成“没有问题”。只能写“未发现公开证据显示...”“官方文档未说明...”“需要项目实测 / 账号 / lockfile 才能确认...”

## Dependency Version Map

涉及新增 / 替换依赖、SDK、插件、组件库、测试库、运行时、package manager 或 AI provider SDK 时，必须建立版本依赖关系。

| 关系类型 | 要查什么 | 优先来源 |
|---|---|---|
| Direct dependency | latest / maintained version、release cadence、license | registry、GitHub Releases、deps.dev |
| Version range | `^` / `~` / exact / prerelease / tag 的含义和更新范围 | manifest、SemVer spec、生态官方版本规则 |
| Peer dependency | 对 React、Vue、Vite、ESLint、TypeScript 等 host package 的版本要求 | package.json、registry metadata、repo package.json |
| Runtime / engine | Node、Python、Go、Java、browser、OS、native binding 要求 | package metadata、official docs、CI matrix |
| Lockfile / pinned tree | 实际安装版本、transitive deps、integrity、package manager | lockfile、package manager explain / why |
| Transitive dependency | 漏洞、重复大版本、native build、license 风险 | deps.dev、OSV、GitHub advisories、lockfile |
| Breaking changes | 相对当前版本的 breaking changes、migration guide、deprecation | changelog、release notes、migration docs |
| Override / resolution | 是否需要强制 transitive version、fork、backport | package manager docs、maintainer issue |

输出：

```md
版本依赖关系：

| 依赖 / 技术 | 当前 / 候选版本 | 关系类型 | 约束来源 | 影响 | 交接 |
|---|---|---|---|---|---|
| | | direct / peer / runtime / lockfile / transitive / breaking / override | URL 或 manifest / lockfile 路径 | | tech-design lock version / needs user dependency decision / needs spike / no action |
```

如果 peer deps、engine、lockfile 或 transitive risk 不清楚，置信度最多为 `likely`，并写未查证项。如果需要 override / resolution 才能成立，不能写成已采纳方案；交给 `sf-tech-design` 做依赖确认和验证设计。

## Evidence Contract

输出必须短、可追溯、可被 `sf-brainstorm` 直接写入 `brainstorm.md`。

```md
## 当前事实与研究证据

搜索计划：

| 事实问题 | 来源类型 | 查询入口 | 足够性 |
|---|---|---|---|
| | 官方文档 / release notes / npm / GitHub issues / 竞品官网 | URL 或搜索入口 | 为什么这些来源足以支撑或限制结论 |

本地事实：
- 已读取：
- 缺失 / unknown：

| 问题 | 来源 | 日期 | 结论 | 置信度 |
|---|---|---|---|---|
| | | | | confirmed / likely / unclear |

版本依赖关系：

| 依赖 / 技术 | 当前 / 候选版本 | 关系类型 | 约束来源 | 影响 | 交接 |
|---|---|---|---|---|---|
| | | direct / peer / runtime / lockfile / transitive / breaking / override | URL 或 manifest / lockfile 路径 | | tech-design lock version / needs user dependency decision / needs spike / no action |

覆盖度：

未查证项：
- [ ] 问题描述 → 待查来源 / 需要用户提供账号或上下文
```

字段要求：

- `问题` 必须是可查证问题，不写“研究一下 X”。
- `来源` 必须是 URL 或本地文件路径；外部事实不能只写“官方文档”。
- `日期` 是访问日期或来源发布日期；版本、价格、模型、竞品必须用访问日期。
- `结论` 只写来源能支撑的事实，1-2 句。
- `置信度` 只能是 `confirmed`、`likely`、`unclear`。

置信度：

| 置信度 | 判定 |
|---|---|
| `confirmed` | A 级当前来源直接支持结论，并且 URL / 日期完整；或两个以上独立可靠来源一致且没有相反证据 |
| `likely` | 来源可靠但间接；只有 B 级来源；A 级来源过期；缺少当前项目 lockfile / runtime；或需要项目实测才能最终确认 |
| `unclear` | 来源冲突、缺 URL、缺日期、官方未说明、需要登录 / 账号 / 实测 / 用户上下文，或证据不足会影响 MVP、成本、安全或架构 |

`unclear` 写法：

```md
结论：unclear。已查 [来源 A] 和 [来源 B]，官方未说明 / 两处来源冲突 / 需要账号或实测才能确认。影响：该事实会影响 [方案 / 成本 / 安全 / 架构]。下一步：交给 [sf-discovery research / sf-tech-design spike / 用户确认]。
```

## 升级规则

| 触发 | 动作 |
|---|---|
| 多个候选方案都依赖不确定事实 | 交给 `sf-discovery` research 或回到用户确认 |
| 当前资料互相冲突且影响方向 | 写 `unclear`，标记 `[必须确认]` |
| 需要安装、运行、压测或登录后台 | 写未查证项，交接给 `sf-tech-design` / research spike |
| 涉及法规、合规、安全或用户数据 | 使用 high-stakes evidence，不足则不得 confirmed |
| 用户要求“最新 / 当前推荐” | 必须查证，并记录访问日期 |
| 新依赖的 peer / transitive / breaking 风险会影响工期、架构或回滚 | 升级 `sf-discovery` research 或 `sf-tech-design` spike |
| AI provider 能力、价格、限流或数据边界是成本模型关键变量 | 升级 research-heavy；不足时不能进入 adopt |
| 竞品事实推翻类比方向或 MVP 假设 | 回写类比迁移，把对应类比标为 `needs revision` |
| 来源需要账号、私有仓库、企业合同或地域价格才能确认 | 写 `unclear`，向用户要上下文或升级人工查证 |

## 边界

| 能力 | 使用时机 | 产出 |
|---|---|---|
| `research-source` | 单个 brainstorm 取舍需要当前事实证据 | 证据表、版本关系、置信度、未查证项 |
| `sf-discovery` research | 多来源综合、实验、共识 / 争议拆解或研究空白会影响方向 | `01-spec/research.md`、实验和可复现证据 |
| `sf-tech-design` | 用户已确认技术 / 依赖方向后，需要可实现的工程方案 | 最终版本锁定、依赖确认记录、兼容策略、验证和回滚方案 |

## 禁止

- 不把训练数据、模型记忆或二手文章当当前事实。
- 不引用 AI 生成文章、SEO 聚合页、无日期营销软文作为事实来源。
- 不把社区评论当官方声明；只能作为用户痛点或争议线索。
- 不因为找不到资料就补一个“看起来合理”的结论；写 `unclear`。
- 不替代用户确认，也不把 Agent recommendation 写成 approved。
