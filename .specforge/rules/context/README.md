# 上下文规则入口

本目录定义 SpecForge 的上下文治理方式。它要解决的不是“多读一点资料”，而是：

- 什么事实最有权威。
- 当前阶段到底该读什么。
- 什么内容必须查当前官方资料。
- 什么时候应该停止继续吞上下文。
- 哪些上下文应沉淀，哪些只应临时使用。

SpecForge 采用“渐进加载、按阶段加载、以事实源优先级解决冲突”的方式管理上下文。

## 什么时候启用

遇到下面任一情况，必须读取本入口：

- 进入仓库、恢复一个 active change。
- 生成 requirements / design / tasks。
- 需要决定是否读取 knowledge、rules、archive 或外部资料。
- 做 review / verify，需要核对证据和事实来源。
- 任务出现上下文冲突、版本敏感事实或“该不该继续读”的判断。

## 按需加载参考

先读本入口，再根据场景继续读取：

| 场景 | 继续读取 |
|---|---|
| 事实优先级、SSoT、archive 何时能用 | `references/source-priority.md` |
| 进入仓库、阶段加载顺序、上下文预算 | `references/progressive-loading.md` |
| 外部官方文档、版本敏感事实、资料可信度 | `references/external-facts.md` |
| 什么该沉淀、什么不该沉淀、上下文污染防治 | `references/context-hygiene.md` |

## 核心原则

- 更多上下文不一定更好，相关上下文才更好。
- 低优先级资料不得覆盖高优先级事实。
- 当前 change 优先于历史 archive，knowledge 优先于旧实现记录。
- 按 artifact 和当前阶段加载，而不是一次性把全部 rules、templates 和 archive 都塞进上下文。
- 涉及外部框架、SDK、协议或版本敏感事实时，必须查当前官方资料。
- 长期可复用事实应沉淀到 `.specforge/knowledge/`；临时推理不应伪装成 SSoT。

## 四层上下文模型

| 层级 | 作用 |
|---|---|
| 指令层 | 系统、开发者、用户当前要求 |
| 工作流层 | 当前 change、artifact、gate、rules、templates |
| 项目事实层 | `.specforge/knowledge/`、架构、产品、决策、风险 |
| 外部事实层 | 官方文档、标准、版本说明、可信来源 |

Kiro 的 steering 和 OpenSpec 的指令模型都偏向“持久项目知识 + 按需加载”，这支持 SpecForge 继续坚持按需注入，而不是默认全量加载。

## 快速工作法

进入任务时，优先按这条路径走：

1. 读取当前请求和更高优先级指令。
2. 读取 SpecForge 入口和当前 change 控制面。
3. 识别当前 artifact。
4. 只加载该 artifact 所需 rules、templates 和 knowledge。
5. 只有在事实不够或版本敏感时，才扩展到外部资料或历史 archive。

## 反模式速记

- 还不知道任务就加载整个仓库。
- 复制旧规格文本而不检查是否仍适用。
- 把旧 implementation report 当成当前架构。
- 用社区文章替代官方规范。
- 把一次性调研结论直接写成长期 SSoT。
- 在没有证据的情况下声称“已经验证”或“兼容所有情况”。
