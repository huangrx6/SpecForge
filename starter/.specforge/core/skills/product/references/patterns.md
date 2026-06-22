# Product Discovery Patterns

本文件按工作项类型补充产品发现必须确认的问题和输出重点。只读取与当前工作项匹配的 1-2 个 pattern；不要全量套用。

## AI Agent Product

适用：

- AI 助手。
- Agent 工具调用。
- RAG 问答。
- 意图识别。
- 自动分类。
- 自动生成。
- 自动分析。

Opportunity 维度：

- 用户想减少什么人工判断。
- 哪些任务可以自动化。
- 哪些任务必须人工确认。
- 错误成本是什么。
- 用户如何发现 AI 错误。
- AI 失败时是否有兜底路径。
- 工具调用是否可追踪。

必须问：

- AI 的输入是什么。
- 输出要给谁看。
- 错误是否可接受。
- 是否需要人工复核。
- 成本和延迟边界。
- 是否需要引用来源。
- 是否需要审计工具调用。

输出重点：

- AI task。
- Quality metric。
- Human review boundary。
- Cost / latency risk。
- Data privacy。
- PRD handoff。

## B2B Operator Data Product

适用：

- 政企。
- 通信运营商。
- 客户经理工具。
- 数据看板。
- 到期提醒。
- 客户画像。
- 领导驾驶舱。
- 报表 / 导出。
- 任务配置。

Opportunity 维度：

- 用户是否能快速判断优先级。
- 数据口径是否可信。
- 是否减少人工汇总。
- 是否降低漏跟进风险。
- 是否提升跨部门协同。
- 是否支撑管理层决策。
- 是否降低合规风险。

必须问：

- 目标部门是谁。
- 哪个 KPI 会被影响。
- 谁每天使用。
- 使用频率。
- 数据来源。
- 更新频率。
- 权限范围。
- 是否导出。
- 是否审计。
- 是否地市隔离。

输出重点：

- Desired outcome。
- Opportunity map。
- Feature pool。
- Data / permission risk。
- PRD handoff。

## Dashboard Analytics

适用：指标看板、分析报表、经营驾驶舱和趋势监控。

Opportunity 维度：

- 谁需要做决策。
- 当前决策缺少什么指标或解释。
- 数据延迟、口径不一致或权限边界是否影响信任。
- 哪些指标变化会触发行动。

输出重点：

- Desired outcome。
- Opportunity map。
- Metric candidates。
- Data risk。
- Experiment / validation：口径、可得性、权限。

## Internal Platform

适用：内部平台、配置台、公共能力、工具链和跨团队复用能力。

Opportunity 维度：

- 哪些团队重复建设。
- 哪些能力需要标准化。
- 谁是平台用户，谁是最终业务用户。
- 平台能力如何被发现、接入、审计和回滚。

输出重点：

- Platform desired outcome。
- Opportunity map by user group。
- Feature pool。
- Adoption / governance risk。
- PRD handoff。

## Workflow Ops

适用：审批、任务流、运营处理、导入导出、工单和后台协作。

Opportunity 维度：

- 哪一步最耗时。
- 哪一步最容易漏。
- 哪些状态不透明。
- 失败恢复是否依赖人工问询。
- 多角色交接是否明确。

输出重点：

- Opportunity map。
- Candidate workflow improvements。
- State / exception risks。
- MVP recommendation。
- PRD handoff for Product Flow。
