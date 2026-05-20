# 工作流与边界标准

本标准回答：当前 work item 怎么推进、什么时候停、什么算越界、上下文如何加载、gate 如何批准。

## 加载顺序

1. 读用户最新请求和更高优先级指令。
2. 读 `.specforge/AGENTS.md`、`.specforge/manifest.yaml`、`.specforge/registry.yaml`。
3. 若只有一个 active work item，读其 `work.yaml` 和当前 ready artifact。
4. 自动推进或高风险动作前运行 `node .specforge/core/scripts/doctor.mjs`。
5. 运行 `node .specforge/core/scripts/instructions.mjs` 判断下一步。
6. 只加载当前阶段需要的标准、模板、profile 和 wiki。

## Work Item 边界

- work item 名称使用 `<YYYYMMDD>-<kind>-<NNN>-<short-title>`。
- `kind` 使用 `feat`、`bugfix`、`issue`、`refactor`、`research`、`docs`、`chore`、`ops`。
- 每个 work item 必须有明确范围、非目标、写入边界和验证边界。
- 如果实现需要扩大写入范围，先停下更新 spec 或询问用户。
- 不把行为变更、重构、依赖升级、格式化清理混成一个 work item，除非 spec 明确批准。
- 已关闭、已归档或所有 required gate 已完成的 work item 是历史证据；后续发现的缺陷、遗漏、体验问题或测试漏测必须新建 follow-up work item，不继续修改旧 scope。
- follow-up work item 应在 `work.yaml#relations.parent` 记录来源 work item id，并用 `relations.relation` 标明 `follow_up`、`bugfix`、`issue` 或 `split_from`。

## Workflow 选择

| Workflow | 使用场景 | 核心路径 |
|---|---|---|
| `feature` | 新增用户能力或产品功能 | intake -> optional research -> requirements -> optional ui_design -> optional technical_design -> tasks -> review -> implementation -> verification -> wiki -> close |
| `standard` | 普通工程变更或跨域改动 | 同 feature，偏通用 |
| `lite` | 低风险小改 | intake -> requirements -> tasks -> implementation -> review -> verification -> close |
| `bugfix` | 明确缺陷修复 | intake -> gap_report -> tasks -> implementation -> review -> verification -> close |
| `issue` | 运维、配置、环境或非产品问题 | intake -> gap_report -> tasks -> implementation -> review -> verification -> close |
| `refactor` | 行为不变的技术债治理 | intake -> technical_design -> tasks -> review -> implementation -> verification -> close |
| `discovery` | 预研、Spike、黑盒探索 | intake -> research -> wiki -> close |

## Gate 标准

- required gate 必须有 evidence 文件，不能空批准。
- `spec_review` 只在 requirements、适用的 ui_design / technical_design、tasks 足以直接实现时批准。
- `code_review` 只在实现满足 approved spec、边界和测试证据时批准。
- `verification` 必须留下命令、结果、覆盖范围和未覆盖风险。
- `wiki_sync` 只在长期事实已回写或明确 N/A 时批准。

## 上下文标准

- 先读入口标准，再按需读 profile / template / wiki。
- 不读取无关 archive work item，除非当前问题明确依赖历史。
- 外部事实、框架版本、API 行为、安全标准可能变化时，查当前官方资料。
- 用户明确说“不要改代码”“只分析”“先给建议”时，不进入实现。

## 输出语言

- 面向用户和项目文档默认中文。
- 命令、路径、API 字段、代码标识保留原文。
- 引用来源时写链接和适用结论，不复制大段原文。

## 阻断项

- active work item 多个且用户未指定。
- registry、work.yaml、schema 状态互相矛盾。
- required gate 缺 evidence。
- 当前需求越过已批准范围。
- 高风险安全、数据、生产操作缺少验证路径。
