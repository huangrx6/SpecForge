# 来源索引

本文件按问题类型列出 `research-source` 的首选来源。执行时必须访问当前来源并记录日期；本文件只定义“去哪查”，不提供事实结论。

## 技术选型 / 版本 / 兼容性

| 问题类型 | 优先来源 | 说明 |
|---|---|---|
| npm 包版本、下载量、维护状态 | npmjs.com、npmtrends.com、deps.dev | 看 weekly downloads 趋势、最后发版时间、版本分布、依赖图和 license / advisory 信号 |
| GitHub 维护健康度 | github.com repo → Issues / Pulse / Releases、OpenSSF Scorecard | 看 open issues 趋势、最近 commit、release 节奏、PR 响应速度和供应链安全健康信号 |
| 框架官方文档 | 各框架官网，例如 react.dev、vuejs.org、docs.astro.build | 必须读官网，不读 Medium 二手文章替代官网 |
| 依赖兼容性 / peer deps | 包的 package.json、npm package metadata、CHANGELOG.md、release notes、deps.dev | 版本锁定风险最常在 peer deps、breaking changes、transitive deps 和 migration guide |
| Runtime / engine 约束 | package.json `engines`、official runtime docs、CI matrix、release notes | 查 Node / Python / Go / Java / browser / OS / native binding 要求，判断部署或本地运行是否冲突 |
| Lockfile / 实际安装树 | package-lock.json、pnpm-lock.yaml、yarn.lock、bun.lock、poetry.lock、uv.lock、go.sum、Cargo.lock | 有项目上下文时优先读 lockfile；manifest 只说明期望，lockfile 才说明实际安装树 |
| Override / resolution 风险 | npm overrides、pnpm overrides、Yarn resolutions、package manager docs | 需要强制 transitive version 时只记录风险和交接，不在 brainstorm 阶段直接决策 |
| 安全漏洞 | osv.dev、deps.dev、GitHub Security Advisories、nvd.nist.gov、snyk.io/vuln | 引入新依赖或升级关键包前查一遍；开源包优先看 OSV / deps.dev 的精确版本映射，再交叉检查 NVD / GitHub / Snyk |
| 性能基准 | Web Almanac、web.dev、MDN、Chrome Developer Blog | 优先使用有数据、日期和测试条件的来源 |

## 依赖 / 包管理器官方入口

| 生态 | 优先来源 | 说明 |
|---|---|---|
| npm / Node | npm package.json docs、npm package-lock docs、SemVer spec、Node.js docs | 查 `dependencies`、`peerDependencies`、`engines`、`overrides`、lockfile 和 semver range |
| pnpm | pnpm lockfile、peer dependencies、overrides / packageExtensions docs | pnpm 对 peer resolution 更严格，新增依赖时要查 peer conflict 和 workspace 影响 |
| Yarn | Yarn manifest、resolutions、packageExtensions docs | 查 resolutions / packageExtensions 是否只是临时补丁 |
| Python | PyPA dependency specifiers、PyPI project metadata、poetry / uv docs | 查 `requires-python`、extras、environment markers、lockfile 和 build backend |
| Go | Go modules reference、go.mod / go.sum docs | 查 `require`、`replace`、module path、Go toolchain 版本 |
| Rust | Cargo reference、Cargo.lock、features / MSRV 文档 | 查 feature flags、workspace deps、MSRV 和 transitive risk |
| JVM | Maven / Gradle dependency management、BOM、plugin docs | 查 BOM、plugin version、Java target、effective dependency tree |

## 产品 / 竞品 / 市场

| 问题类型 | 优先来源 | 说明 |
|---|---|---|
| 竞品功能对比 | 产品官网、官方 changelog、官方 docs、官方 blog | 不用 G2 / Capterra 当事实来源；它们只能辅助理解用户感受 |
| 定价模型 | 产品 Pricing 页面 | 价格随时变，必须记录访问日期；最好记录地区、币种和套餐名 |
| 用户反馈 / 痛点 | Hacker News、Reddit、Product Hunt 评论、GitHub Discussions | 看情绪、场景和反复出现的问题，不把单条评论当结论 |
| 行业报告 | State of JS / State of CSS、ThoughtWorks Tech Radar、Stack Overflow Developer Survey | 必须记录年份、样本量或报告范围 |

## AI / LLM 能力边界

| 问题类型 | 优先来源 | 说明 |
|---|---|---|
| 模型能力、上下文长度、价格 | 各厂商官方文档，例如 platform.openai.com/docs、docs.anthropic.com、ai.google.dev/docs | 模型和价格变更频繁，必须带访问日期 |
| SDK / API 版本 | 官方 GitHub release notes、官方 SDK 文档 | 不信博客，不信旧示例；确认当前 SDK 版本和迁移说明 |
| 限流 / 配额 | 官方 rate limits / usage limits / quotas 页面 | 影响成本模型、排队策略和降级方案时必须查证 |
| 数据使用 / 隐私边界 | 官方 data usage、privacy、enterprise security 文档 | 涉及用户数据、企业合规或默认日志保留时必须查证 |

## 最小来源组合

| 场景 | 最小来源组合 | 不能缺的结论 |
|---|---|---|
| 新增 npm / JS 依赖 | npm package metadata + official docs / README + release notes / changelog + OSV / GitHub Advisories | 当前版本、peer / engine、维护状态、安全信号、breaking changes |
| 新增 Python 依赖 | PyPI metadata + project docs + release notes + dependency specifiers / lockfile + OSV | Python 版本要求、extras / markers、维护状态、安全信号 |
| 新增 AI provider / SDK | provider docs + pricing + rate limits / quotas + data usage / privacy + SDK releases | 模型能力、价格、限流、数据边界、SDK 版本 |
| 竞品功能 / 定价取舍 | product docs / website + pricing page + official changelog / blog | 功能是否存在、价格 / 套餐、发布时间或当前状态 |
| 安全 / 合规影响 | official standard / regulator source + OWASP / MDN / vendor security docs + advisory database | 适用范围、强制要求、项目影响、未查证项 |
| 浏览器 / 可访问性 | MDN / caniuse + WAI-ARIA / WCAG + framework docs | 支持矩阵、fallback、交互 pattern |

## 工程规范 / 最佳实践

| 问题类型 | 优先来源 | 说明 |
|---|---|---|
| 浏览器兼容性 | caniuse.com、MDN Browser Compatibility table | 记录目标浏览器和不支持的 fallback |
| Web 性能标准 | web.dev/articles、Chrome Developer Blog、Web Almanac | 优先引用有指标定义和日期的文章 |
| 安全规范 | OWASP Top 10、OWASP Cheat Sheet Series、MDN Security | 用于威胁建模和安全约束，不替代项目安全评审 |
| 可访问性 | WAI-ARIA Authoring Practices、WCAG 2.2、MDN Accessibility | 交互组件必须查 pattern 和键盘路径 |

## GitHub 内容

| 问题类型 | 优先来源 | 说明 |
|---|---|---|
| 方案成熟度 / 社区采用 | README、Releases、Insights / Pulse、star-history.com、OpenSSF Scorecard、deps.dev | star 不是质量保证；必须结合 release、issue 质量、依赖健康和安全维护信号 |
| Issue 讨论 / 已知 bug | GitHub Issues（label: bug / wontfix / regression）、Discussions | 记录 issue 链接、状态、最后更新时间 |
| 实际用法 | README examples、官方示例仓库、examples 目录 | 只引用能跑通或官方维护的示例 |
| 社区共识 | Discussions、RFC 文档、maintainer comments | 共识必须来自多条证据，不来自单条高赞评论 |

## 技术文章来源质量分级

| 级别 | 来源 | 用法 |
|---|---|---|
| A（可引用为事实） | 官方文档、官方 blog、RFC、规范文档、官方 release notes、官方 pricing | 直接引用，带 URL 和日期 |
| B（可作为参考） | web.dev、MDN、Chrome Developer Blog、Josh W. Comeau、Lee Robinson、Addy Osmani、Kent C. Dodds | 引用时说明“参考文章”，不覆盖官方文档 |
| C（只看观点，不当事实） | Medium、Dev.to、个人博客、知乎、掘金、论坛长帖 | 只摘取问题角度、用户语言或实践经验 |
| D（禁止引用） | AI 生成文章、未注明日期内容、营销软文、SEO 聚合站、无法追溯来源的搬运内容 | 不引用 |
