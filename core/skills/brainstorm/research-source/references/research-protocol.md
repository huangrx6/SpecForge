# 查证协议

本文件定义 `research-source` 的实际查证动作：先看本地事实、再联网、再交叉验证、最后归一化到 brainstorm。它补足 `source-index.md` 的“去哪查”和 `evidence-contract.md` 的“怎么写”之间的执行空隙。

## 本地事实优先

联网前先确认是否已有本地事实。已有本地事实不是最终事实，但能缩小搜索范围，避免查错生态或版本。

| 本地事实 | 优先文件 / 位置 | 用途 |
|---|---|---|
| 已有技术栈 | `.specforge/wiki/`、`package.json`、`pyproject.toml`、`go.mod`、`Cargo.toml`、`pom.xml`、`build.gradle` | 判断是否沿用现有栈，避免把“新增依赖”误判为“既有依赖” |
| 实际安装版本 | lockfile、`node_modules/.package-lock.json`、package manager output | 判断当前安装树和 manifest 是否一致 |
| 项目运行时 | `.nvmrc`、`.node-version`、`.python-version`、Dockerfile、CI config、deployment config | 判断 engine / runtime / deploy compatibility |
| 已批准决策 | `brief.md`、`brainstorm.md`、`prd.md`、`requirements.md`、`ui-design.md`、`technical-design.md` | 区分用户已确认、agent 推荐和未决项 |
| 安全 / 合规约束 | requirements、wiki、security notes、deployment docs | 决定是否升级为 high-stakes evidence |

如果本地事实缺失，不能假设默认版本；写 `unknown`，并在未查证项中说明缺哪个文件或上下文。

## 查询模式

按问题类型组合查询，不用泛泛的“搜索 X”。

| 问题类型 | 查询模式 |
|---|---|
| 当前版本 | `<package> npm`、`<package> releases GitHub`、`<provider> SDK release notes` |
| 兼容性 | `<package> peerDependencies`、`<package> package.json engines`、`<package> changelog breaking changes` |
| 已知 bug | `<package> GitHub issues bug <version>`、`<package> regression <version>` |
| 安全漏洞 | `<package> OSV`、`<package> GitHub advisory`、`<package> NVD CVE` |
| 价格 / 限流 | `<provider> pricing official`、`<provider> rate limits official`、`<provider> quotas official` |
| 竞品功能 | `<product> docs <feature>`、`<product> changelog <feature>`、`<product> pricing` |
| 浏览器兼容 | `<api> MDN compatibility`、`<feature> caniuse` |
| 可访问性 pattern | `<component> WAI ARIA authoring practices`、`<component> keyboard interaction` |

## 时效规则

| 事实类型 | 时效规则 |
|---|---|
| 价格、模型、限流、配额、竞品套餐 | 必须用访问日期；超过 30 天的证据只能作为历史线索 |
| SDK / API / package 版本 | 必须用访问日期或 release 日期；以 package registry / official release 为准 |
| 安全漏洞 | 必须查当前 advisory database；旧博客不能证明当前安全状态 |
| 法规 / 合规 | 必须记录法规版本、发布日期或官方页面访问日期 |
| 浏览器兼容性 | 必须记录 MDN / caniuse 的当前状态或目标浏览器版本 |
| 行业报告 | 必须记录报告年份、样本范围或调查时间 |

如果事实类型变化快，但只能找到旧资料，置信度最多为 `likely`；如果会影响成本、安全或架构，写 `unclear` 并升级后续 research / technical design。

## 交叉验证

| 场景 | 需要交叉验证 |
|---|---|
| 来源是官方 docs，但没有日期 | 用 release notes、GitHub releases 或 package registry 补日期 |
| npm / package metadata 和 README 不一致 | 以 registry + release notes 为准，并记录冲突 |
| 竞品官网和第三方评测不一致 | 以竞品官网 / docs / changelog 为事实，第三方只作观点 |
| 社区 issue 说有 bug | 查 issue 状态、maintainer 回复、release fix、复现条件 |
| 安全漏洞命中 transitive dependency | 查 advisory affected range、lockfile 实际版本、patched version |
| AI provider 能力 / 价格影响成本模型 | 同时查模型文档、pricing、rate limits、data usage |

## 冲突处理

来源冲突时不要平均处理，也不要选择更符合推荐方案的来源。

1. 先按来源等级排序：官方当前文档 / registry / release notes > 官方 issue / maintainer comment > 标准或 advisory database > 高质量参考文章 > 社区讨论。
2. 再按日期排序：同等级下优先当前资料，旧资料降级为背景。
3. 如果仍冲突，写 `unclear`，列出冲突来源和需要谁确认。
4. 如果冲突会改变 MVP、成本、安全或架构，必须在 `brainstorm.md#问题地图` 标记 `[必须确认]` 或交给 `sf-discovery` research。

## 负证据

找不到资料也是证据，但必须说清楚搜索范围。

```md
未查证项：
- [ ] 未找到官方说明 X 是否支持 Vue 3.5；已查 docs、npm metadata、GitHub releases，需要 tech-design spike 验证。
```

禁止把“没搜到问题”写成“没有问题”。只能写：

- `未发现公开证据显示...`
- `官方文档未说明...`
- `需要项目实测 / 账号 / lockfile 才能确认...`

## 升级规则

| 触发 | 动作 |
|---|---|
| 多个候选方案都依赖不确定事实 | 交给 `sf-discovery` research 或回到用户确认 |
| 当前资料互相冲突且影响方向 | 写 `unclear`，标记 `[必须确认]` |
| 需要安装、运行、压测或登录后台 | 写未查证项，交接给 `sf-tech-design` / research spike |
| 涉及法规、合规、安全或用户数据 | 使用 high-stakes evidence，不足则不得 confirmed |
| 用户要求“最新 / 当前推荐” | 必须联网查证，并记录访问日期 |

## 输出自检

交回 `sf-brainstorm` 前逐项检查：

- 是否先读了本地事实，或写明本地事实缺失。
- 每条外部事实是否有 URL 和访问 / 发布日期。
- 是否达到对应查证深度；没达到时是否降级置信度。
- 版本相关问题是否有版本依赖关系表或 N/A 理由。
- 是否区分事实、观点、agent recommendation 和用户确认。
- 是否把会影响取舍的事实回填到 `问题地图` 或 `方案选项`。
