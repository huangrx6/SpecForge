# 边界规则入口

本目录是 SpecForge 的边界治理规则包。入口文件只保留“何时加载、核心原则、按需分流”；具体细则按主题拆到 `references/`。

边界规则要解决的不是“文件改多改少”，而是：

- 这个 work item 到底负责什么。
- 哪些内容必须保持不变。
- 实现时可以写到哪里。
- 发现新问题时是继续、修订 spec，还是拆新 work item。
- review 和 verify 应该检查哪些影响面。

## 什么时候启用

遇到下面任一情况，必须读取本入口：

- 新建 work item、明确范围、判断是否拆分。
- requirements / ui_design / technical_design / tasks 阶段。
- 实现中发现原方案不够，要扩大修改范围。
- code review 需要判断是否越界。
- verification 需要确认影响面是否覆盖。

## 按需加载参考

先读本入口，再根据场景继续读取必要参考：

| 场景 | 继续读取 |
|---|---|
| owner、责任、非目标、上下游契约 | `references/scope-ownership.md` |
| 写入范围、边界冻结、实现时的越界判断 | `references/write-scope.md` |
| 什么时候暂停、修订 spec、拆新 work item | `references/work-item-control.md` |
| review、verify、证据与边界违规 | `references/review-verification.md` |

## 六类边界

每个非 lite work item 都应至少判断：

| 维度 | 要回答的问题 |
|---|---|
| 责任边界 | 本 work item 拥有什么责任，不负责什么 |
| 契约边界 | 依赖哪些 API、schema、配置、权限和长期约定 |
| 写入边界 | 允许修改哪些文件、模块、目录和生成物 |
| 验证边界 | 改完后必须重新验证哪些路径、角色、平台或下游 |
| 数据边界 | 是否改变持久化数据、迁移、兼容或回滚方式 |
| 决策边界 | 哪些决定已拍板，哪些仍需澄清或用户批准 |

## 核心原则

- 一个 work item 必须只有一个主要 owner。
- 一个 work item 可以触碰多个模块，但必须说明为什么它们属于同一交付目标。
- 范围必须同时写清“要做什么”和“明确不做什么”。
- `spec_review` 通过后默认进入边界冻结；扩大边界必须更新 spec。
- 读上下文可以广，写入范围必须窄。
- 不用“顺手”“顺便”“为了以后”扩大范围。
- 当 review 无法在一次完整阅读中判断正确性时，应优先拆 work item。

## 阶段落点

| 阶段 | 边界职责 |
|---|---|
| `brief.md` | 给出边界候选、owner 候选、是否可能拆分 |
| `requirements.md` | 明确范围、非目标、依赖、影响面、验收边界 |
| `ui-design.md` | 固化 UI 范围、页面 / 状态边界和用户确认的体验取舍 |
| `technical-design.md` | 固化责任边界、契约变化、写入范围、回滚与验证边界 |
| `tasks.md` | 任务级 `_Boundary:_`、`_Depends:_`、`_Evidence:_` |
| `spec_review` | 判断边界是否足以允许实现开始 |
| `implementation` | 发现越界时暂停并走边界变更协议 |
| `code_review` | 判断 diff 是否仍处于批准范围内 |
| `verification` | 验证受影响边界是否覆盖 |

## 实现前自检

Agent 开始改代码前，至少要回答：

- 这次实现的主目标是什么？
- 哪些行为必须保持不变？
- 我准备修改的每个区域，都能在 `technical-design.md` 的写入范围里找到依据吗？
- 是否有任何一个文件“只是顺手改一下”？
- 如果这个 work item 今天被撤回，回滚边界是否清楚？
- 我是否已经知道哪些测试或验证能证明边界没有被破坏？

答不上来时，不要急着写代码，先回 spec。
