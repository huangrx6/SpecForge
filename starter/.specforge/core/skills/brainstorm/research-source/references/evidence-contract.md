# 证据契约

`research-source` 的输出必须短、可追溯、可被 `sf-brainstorm` 直接写入 `brainstorm.md`。

## 搜索计划

证据表前必须先列一个轻量搜索计划，避免先有结论再补来源。

```md
搜索计划：

| 事实问题 | 来源类型 | 查询入口 | 足够性 |
|---|---|---|---|
| | 官方文档 / release notes / npm / GitHub issues / 竞品官网 | URL 或搜索入口 | 为什么这些来源足以支撑或限制结论 |
```

字段要求：

| 字段 | 要求 |
|---|---|
| 事实问题 | 必须是会影响 brainstorm 取舍的具体事实问题 |
| 来源类型 | 从 `source-index.md` 选择，不写泛泛的“网上搜索” |
| 查询入口 | 优先写具体 URL；无法提前定位时写明确搜索入口和关键词 |
| 足够性 | 说明这些来源能确认什么，不能确认什么 |

## 证据表

```md
## 当前事实与研究证据

搜索计划：

| 事实问题 | 来源类型 | 查询入口 | 足够性 |
|---|---|---|---|
| | | | |

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
```

字段要求：

| 字段 | 要求 |
|---|---|
| 问题 | 必须是可查证问题，不写“研究一下 X” |
| 来源 | URL 或本地文件路径；外部事实必须是 URL |
| 日期 | 访问日期或来源发布日期；版本、价格、模型、竞品必须用访问日期 |
| 结论 | 1-2 句，只写来源能支撑的事实 |
| 置信度 | `confirmed` / `likely` / `unclear` |

## 本地事实

证据表前必须说明是否读取了本地事实。没有本地项目上下文时也必须显式写 `缺失 / unknown`，不能假设默认版本。

```md
本地事实：
- 已读取：`package.json`、`pnpm-lock.yaml`、`.specforge/wiki/00-index.md`
- 缺失 / unknown：部署 Node 版本未找到；需要 tech-design 从 CI / Dockerfile 确认
```

## 版本关系图

涉及新增 / 替换依赖、SDK、插件、组件库、测试库、运行时、package manager 或 AI provider SDK 时，证据表后必须补版本依赖关系表。

字段要求：

| 字段 | 要求 |
|---|---|
| 依赖 / 技术 | 具体 package、SDK、runtime、framework 或 provider |
| 当前 / 候选版本 | 当前项目版本、候选版本或 `unknown`；外部事实必须有来源 |
| 关系类型 | `direct` / `peer` / `runtime` / `lockfile` / `transitive` / `breaking` / `override` |
| 约束来源 | URL 或本地 manifest / lockfile 路径 |
| 影响 | 对方案取舍、成本、兼容性、安全或验证的影响 |
| 交接 | `tech-design lock version` / `needs user dependency decision` / `needs spike` / `no action` |

跳过版本依赖关系表时，必须写一句跳过理由，例如：

```md
版本依赖关系：N/A。本轮只查竞品定价，不涉及新增依赖或运行时兼容性。
```

## 置信度

| 置信度 | 判定 |
|---|---|
| `confirmed` | A 级来源直接支持结论，或两个以上可靠来源一致 |
| `likely` | 来源可靠但间接；只有 B 级来源；或需要项目实测才能最终确认 |
| `unclear` | 来源冲突、缺日期、官方未说明、需要登录/账号/实测或用户上下文 |

## 覆盖度检查

证据表后必须用一句话说明覆盖度，尤其是没有达到 `SKILL.md#查证深度` 中对应最小证据时。

```md
覆盖度：standard decision evidence 已满足（官方 docs + release notes）；dependency evidence 未满足，因为当前项目 lockfile 不可访问，已列入未查证项。
```

判定规则：

- 达不到对应查证深度时，置信度不能写 `confirmed`。
- 缺少当前项目 manifest / lockfile 时，不能断言版本兼容；只能写 `likely` 或 `unclear`。
- 社区反馈只能补充用户痛点或风险线索，不能补足官方来源缺口。

## 未查证项

```md
未查证项：
- [ ] 问题描述 → 待查来源 / 需要用户提供账号或上下文
```

未查证项必须用于以下情况：

- 需要登录后台、企业合同、私有仓库或用户账号才能看到事实。
- 官方文档没有说明，社区讨论互相矛盾。
- 需要安装、运行或压测才能验证。
- 事实会随时间变动，但当前无法联网或来源不可访问。
- 当前项目 manifest / lockfile / runtime 版本不可访问，无法判断 peer deps、engine 或 transitive risk。

## 交接说明

如果某条证据会影响方案选择，必须在 `brainstorm.md#方案选项` 或 `#问题地图` 中引用它：

```md
- [必须确认] 是否引入 X：当前证据显示 peer deps 与现有 Vue 版本可能冲突（见“当前事实与研究证据”第 2 行和“版本依赖关系”第 1 行），需要 tech-design 锁定版本并验证 build。
```
