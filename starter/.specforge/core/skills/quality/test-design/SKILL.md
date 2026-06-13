---
name: test-design
description: SpecForge 测试设计参考 skill。用于 verification 前把 requirements、gap report、UI design、technical design、tasks 和 code review notes 转成测试设计树、XMind 导出、用例矩阵与自动化验证策略。
---

# Test Design Skill

本 skill 不替代 `sf-verify`，只负责把“要验证什么”设计清楚。输出必须归一化到 `05-verification/test-cases.md`、`05-verification/test-design/` 和 `05-verification/report.md`。

## 什么时候用

- verification 前需要系统生成测试用例、XMind / 白板测试设计、页面流程测试或自动化策略。
- requirements、tasks、UI 状态矩阵、technical design 风险或 code review findings 较多，人工难以直接写测试矩阵。
- 用户明确要求测试文档、测试用例、XMind 图、自动化单元测试、页面测试或流程测试。
- `test-case-quality.mjs` 提示测试用例缺少来源、步骤、断言、证据强度或自动化方式。

## 读取顺序

1. `01-spec/requirements.md` 或 `01-spec/gap-report.md`。
2. `01-spec/tasks.md`。
3. `01-spec/ui-design.md` 和 Pencil / 截图证据（有 UI 时）。
4. `01-spec/technical-design.md`。
5. `04-code-review/code-review-v1.md`。
6. `.specforge/wiki/` 中与运行、权限、API、数据、风险相关的当前事实。
7. `references/test-design-tree.md`、`references/automation-matrix.md`、`references/xmind-export.md`。

## 输出

- `05-verification/test-design/test-design-tree.md`：测试设计树，便于转 XMind 或评审。
- `05-verification/test-design/test-design-tree.json`：机器可读测试设计树，适合脚本、XMind 或仪表盘派生。
- `05-verification/test-cases.md`：最终事实源，必须回填 TC / PW 用例。
- `05-verification/evidence/<run-id>/`：执行证据目录。

## 方法

1. **建测试对象树**
   - 根节点：本 work item 的可观察目标。
   - 一级：业务能力、角色 / 权限、API / 数据、UI 页面 / 状态、错误 / 边界、运行 / 发布。
   - 二级：来源 ID，例如 `REQ-*`、`AC-*`、`GAP-*`、`Txxx`、`UI-*`、`TD-*`、review finding。
   - 叶子：可执行断言和证据类型。

2. **分层选择测试方式**
   - 纯函数 / formatter / policy：unit。
   - API、权限、数据库、第三方契约：integration / contract。
   - 页面交互、提交、审批、上传、下载、错误提示：Playwright。
   - 启动、配置、迁移、回滚：startup / smoke / runbook。
   - 外部真实环境不可达：mocked + manual-confirmed / deferred，必须记录 owner 和触发条件。

3. **生成用例矩阵**
   - 每个叶子至少生成一个 TC。
   - 有浏览器流程时生成 PW，并关联到 TC。
   - 每个用例必须有 Source、Steps、Assertions、Evidence Required、Evidence Strength Target、Automation、Risk。
   - 高风险用例默认目标证据为 `proven`；mock 只能证明局部结论。

4. **XMind / 白板归一化**
   - XMind 是测试设计草图，不是最终事实源。
   - 必须导出 Markdown 或 JSON 到 `05-verification/test-design/`。
   - `05-verification/test-cases.md#1.1 Test Design Artifacts` 必须登记源文件、导出文件和派生 TC / PW。
   - 导出的节点必须能追溯到 TC / PW；不能只保留脑图图片。

5. **自动化执行规划**
   - 为每个用例声明 `command / Playwright / manual`。
   - 自动化命令要落在 verification report 或 evidence run 目录里。
   - Playwright 用例优先使用用户可见 locator、真实点击输入和截图 / trace / console / network 摘要。
   - 不能读取或保存 token、cookie、密码、localStorage、sessionStorage。

## 完成标准

- 测试设计树覆盖 requirements / gap / tasks / UI / technical design / review notes 中的关键风险。
- XMind / 白板如被使用，已导出 Markdown / JSON，并回填到 `test-cases.md`。
- `test-cases.md` 中至少有可解析 TC；有 UI 浏览器流程时至少有 PW。
- `node .specforge/core/scripts/test-case-quality.mjs` 无 FAIL。
- 每个跳过 / 延后项都有 Existing Evidence、Impact、Owner、Manual Confirmation Required 和 Revalidation Trigger。

## 不做

- 不直接批准 verification gate。
- 不把 XMind、截图或白板当作唯一事实源。
- 不用 happy path 替代权限、错误、边界和回归路径。
- 不为低风险小改生成过重测试文档；可使用 compact 树和少量 TC。
