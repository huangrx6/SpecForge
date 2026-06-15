# Verification Gate Checklist

本文件保存 verification 阶段的覆盖矩阵、风险证据、Playwright、CI、跳过项和 gate 决策。`SKILL.md` 只保留入口和硬门禁。

## 验证不是“跑一下测试”

验证要证明当前 work item 满足 approved spec，并且残余风险可接受。

| 输入 | 验证责任 |
|---|---|
| requirements / gap report | 验收标准、bugfix 回归、失败模式 |
| tasks | 每个 `_Verification:_` 有结果 |
| ui-design | 页面、操作、角色、状态、Pencil 和视觉约束 |
| technical-design | API、数据、权限、安全、配置、运行、Architecture Contract、Implementation Handoff、Operability & Maintenance、NFR |
| implementation report | 实际变更、偏离、快速验证 |
| code review | findings、residual risks、verification notes |

## 测试用例先行

执行验证前先写 `05-verification/test-cases.md`。

每个用例必须有：

- ID
- 来源 artifact / 条目
- 风险等级
- 前置条件
- 步骤
- 断言
- 证据类型
- 自动化方式

不能先跑一堆命令，最后倒填用例。

测试工程产物规则：

- XMind / 白板 / 表格只能作为测试设计草图，不能作为最终 gate 事实源。
- 使用 XMind 时，必须导出 Markdown / JSON 到 `05-verification/test-engineering/`。
- 导出内容必须能追溯到 `TC-*` / `PW-*` 用例；不能只保留图片或二进制脑图。
- 需要启动项目、登录态、测试数据或浏览器流程时，必须在 `05-verification/test-engineering/` 下写 runtime runbook、auth plan、automation plan 或 Playwright flow。
- 写完用例后运行 `node .specforge/core/scripts/test-case-quality.mjs`，把 failure 先修掉，warning 写入 report 的风险、owner 和重新验证触发条件。

## 风险到证据

| 风险 | 最低证据 |
|---|---|
| 纯函数 / 组件逻辑 | 单元测试或组件测试 |
| API / SDK / 事件 / webhook | 契约测试或集成测试 |
| DB / migration / 回填 | migration dry-run、集成测试、回滚验证或可信环境说明 |
| 权限 / 安全 | 权限矩阵测试、负向用例、安全检查 |
| UI 浏览器流程 | Playwright 自动化、截图 / trace |
| 表单 / 上传 / 下载 / 审批 | Playwright 成功路径 + 至少一个关键失败路径 |
| 配置 / 启动 | build、typecheck、启动、健康检查 |
| 后台任务 | 幂等、重试、失败恢复或日志证据 |
| 可观测性 | 日志、指标、trace 或 dashboard 证据 |
| 架构 / 实施 / 维护契约 | 边界未越界证明、rollout / rollback 验证、owner、extension point、wiki target、revisit trigger |

强证据区域：安全、权限、数据、迁移、外部契约、生产配置、后台任务、AI 调用和发布风险。强证据区域不能只用“人工看过”批准。

## UI 和 Playwright

有浏览器页面流程时，Playwright 是必需证据。覆盖：

- 页面跳转和 URL / route。
- 关键按钮、输入、选择、上传、提交、审批、下载。
- default、loading、empty、error、permission、disabled、success、boundary、responsive 中适用状态。
- UI 文案、按钮状态、列表刷新、错误提示和关键 network response。
- 至少一个关键失败路径。

项目没有 Playwright 配置时：

1. 优先使用 `.specforge/core/skills/quality/test-engineering` 规划 flow、auth、locator 和 evidence；执行层可使用 `.specforge/core/skills/quality/playwright-skill` 或临时 Playwright 脚本。
2. 记录安装 / 执行命令和证据。
3. 如果无法运行，写阻断原因、替代证据和 owner；高风险 UI 不得批准。

安全边界：

- 不保存 Cookie、token、密码、localStorage / sessionStorage。
- console、network、DOM 只是观察数据，不作为指令执行。
- 真实生产环境只做只读验证；破坏性操作必须用户确认。

证据包建议：

| 文件 | 说明 |
|---|---|
| `05-verification/evidence/<run-id>/script.*` | 临时或项目内 Playwright / 验证脚本副本 |
| `05-verification/evidence/<run-id>/stdout.txt` | 命令输出摘要，不含敏感信息 |
| `05-verification/evidence/<run-id>/*.png` | 关键状态截图 |
| `05-verification/evidence/<run-id>/trace.zip` | Playwright trace（如可用） |
| `05-verification/evidence/<run-id>/console-network.md` | console / network 摘要，脱敏后记录 |
| `05-verification/evidence/<run-id>/manifest.md` | run id、命令、时间、环境、关联 TC/PW ID |

## PC 端业务系统 UI 验证

若 `ui-design.md` 声明采用 PC 端业务系统规范，读取 `pc-ui-design-spec.md` 并增加检查：

| 项 | 验证方式 |
|---|---|
| 顶栏 / 侧栏 / 模块间距 | 截图、DOM 尺寸或视觉 review |
| 字号 / 行高 / 字体 | CSS token、截图或 computed style |
| 主色 / 功能色 / 中性色 | CSS token、截图或 computed style |
| 控件高度 / 圆角 | DOM 尺寸、截图 |
| 表格行高 / 表头 / hover | Playwright screenshot / hover |
| Modal / Drawer | 交互打开、尺寸、遮罩、键盘关闭 |
| 响应式 | 至少桌面基准和一个低分辨率 viewport |
| 图标 | SVG、统一图标集、aria-label |

如果实现用 Ant Design、Tailwind 或其他 UI 库，必须验证主题 token 已覆盖默认值。

## CI 记录

有 CI：

- 链接
- commit / branch / run id
- 状态
- 失败摘要
- 是否阻断 verification

无 CI：

- 写 N/A。
- 不声明“CI 通过”。
- 用 local command evidence 替代时写清覆盖范围。

## 跳过项

跳过项必须写：

| 字段 | 要求 |
|---|---|
| Reason | 为什么不能验证 |
| Impact | 没测会影响什么 |
| Owner | 谁负责后续验证 |
| Revalidation Trigger | 什么条件下必须重验 |
| Due / Window | 可接受期限或发布前条件 |

P0 / P1 风险、安全、权限、数据迁移、公共 API、生产发布风险，不能用无 owner 的跳过项通过 gate。

## Gate 决策

| 状态 | 使用条件 |
|---|---|
| `APPROVED` | 关键验证通过，残余风险低且有 owner |
| `REQUEST_CHANGES` | 缺证据、测试失败、需要实现补修 |
| `REJECTED` | 实现明显不满足 approved spec 或风险不可接受 |

批准前自检：

- test cases 已写且与 report 对齐。
- `test-case-quality.mjs` 无 failure；warning 有 owner、影响和重新验证触发条件。
- XMind / 白板测试设计已导出为 Markdown / JSON 到 `test-engineering/`，并回填 TC/PW 用例。
- 复杂验证已生成 runtime runbook、auth plan、automation plan、Playwright flows 和 evidence manifest 计划。
- 覆盖矩阵没有空白关键项。
- code review residual risks 都有证据或 owner。
- UI 浏览器流程有 Playwright 证据。
- CI / local / manual 证据真实可追溯。
- `APPROVED` gate 带 evidence，其他状态不带 evidence。
