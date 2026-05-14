# 规格审查

## 输入

- `00-intake/brief.md`
- `01-spec/requirements.md`
- `01-spec/ui-design.md`（存在时）
- `01-spec/technical-design.md`（存在时）
- `01-spec/tasks.md`
- 相关 `.specforge/workspace/knowledge/` 长期事实
- `analysis-workflow/README.md`

## 必查项

- 目标、范围、非目标是否清楚。
- 分析深度是否匹配复杂度，`brief.md` 是否记录需求理解、代码探索、外部研究或跳过理由、澄清记录和分析综合。
- 验收标准是否可验证。
- ui_design 是否覆盖用户可见页面、流程、状态、视觉风格确认和原型证据；无 UI 影响时 N/A 是否可信。
- technical_design 是否覆盖工程影响面、边界、风险、API、数据、权限、配置、NFR 和验证策略；无技术影响时 N/A 是否可信。
- tasks 是否能执行并追溯到 requirements、适用的 ui_design 和适用的 technical_design。
- ui_design、technical_design 和 tasks 是否能追溯到用户确认、代码库发现或外部研究结论；被 components 跳过的 artifact 不应被强行要求。
- 有 UI 影响且没有现成设计系统时，是否记录用户选择的风格方向或可接受默认假设。
- API、数据、权限、配置、部署影响是否写清。
- 风险和未知项是否被标记。
- 是否需要拆分 work item。

## 批准条件

- Agent 可以仅凭 spec 和必要代码上下文开始实现。
- 非 light 变更已通过 spec review evidence 展示实施计划或等价计划，并记录用户确认或可接受默认假设。
- 关键风险已设计处理或明确延后。
- 没有阻断性歧义。

## 典型阻断项

- 需求写成愿望，不可测试。
- ui_design / technical_design 只是文件列表，或把 UI 与技术架构混成一张大表。
- UI 变更没有 style brief，或只写“参考某产品”却没有转译成项目内设计原则。
- tasks 没有依赖、边界和证据。
- 规格里混入未决策的方案争议。
- 复杂需求缺少代码探索、外部研究或用户澄清证据。
- 计划无法追溯到分析证据。

## 参考

Kiro 的 specs 也把 requirements、design、tasks 视为推进实现前必须收敛的三层产物；SpecForge 将 design 拆成 `ui_design` 与 `technical_design`，分别审查体验和工程实现。
