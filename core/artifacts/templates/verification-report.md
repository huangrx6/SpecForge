# 验证报告

状态：待验证

## 1. 验证范围

| 项目 | 值 |
|---|---|
| 工作项 | |
| 工作流 | |
| 验证人 | |
| 日期 | |
| 代码审查门禁 | APPROVED / REQUEST_CHANGES / REJECTED |
| 验证环境 | local / CI / staging / other |
| 结论 | 通过 / 失败 / 部分通过 |
| 证据策略 | proven / mocked / manual-confirmed / deferred / mixed |

## 2. 覆盖矩阵

| 来源项 | 来源产物 | 验证方式 | 证据 | 结果 | 备注 |
|---|---|---|---|---|---|
| REQ / GAP / TASK / REVIEW | | 命令 / 测试 / 手工 / CI | | 通过 / 失败 / 跳过 | |

## 3. 风险驱动验证计划

| 风险 / 影响面 | 来源 | 风险等级 | 最低证据要求 | 实际证据 | 结论 |
|---|---|---|---|---|---|
| | requirements / technical-design / code-review | high / medium / low | unit / integration / contract / e2e / manual / startup / migration / rollback / observability | | pass / fail / skipped |

## 3.1 测试用例索引

> 执行验证前必须先创建或更新 `05-verification/test-cases.md`。这里登记摘要，不替代完整用例。

| 用例 ID | 来源 | 类型 | 风险等级 | 自动化方式 | 结果 | 证据 |
|---|---|---|---|---|---|---|
| TC-001 | REQ / TASK / REVIEW | unit / integration / contract / playwright / startup / manual | high / medium / low | command / Playwright / manual | pass / fail / skipped | |

## 3.2 证据强度分级

| 来源项 / 风险 | 证据等级 | 证据路径 / 摘要 | 可证明结论 | 不能证明的范围 | Gate 影响 |
|---|---|---|---|---|---|
| | proven / mocked / manual-confirmed / deferred / missing | | | | approve / request_changes / follow-up |

### Technical Design 影响面验证

> 仅在 `technical-design.md` 适用时填写；否则写 N/A。来源为 code review 的 Technical Design 影响面实现审查和 `technical-design.md#0. 影响面与读取计划`。

| 影响面 | Approved status | 实现结论 | 验证方式 | 证据 | 结果 |
|---|---|---|---|---|---|
| Frontend engineering | yes / no / unknown / N/A | | | | 通过 / 失败 / 跳过 / N/A |
| Backend engineering | yes / no / unknown / N/A | | | | 通过 / 失败 / 跳过 / N/A |
| Domain model / state machine | yes / no / unknown / N/A | | | | 通过 / 失败 / 跳过 / N/A |
| API / SDK / Events | yes / no / unknown / N/A | | | | 通过 / 失败 / 跳过 / N/A |
| Data / DB / Migration | yes / no / unknown / N/A | | | | 通过 / 失败 / 跳过 / N/A |
| Auth / Permission / Security | yes / no / unknown / N/A | | | | 通过 / 失败 / 跳过 / N/A |
| Config / Env / Delivery | yes / no / unknown / N/A | | | | 通过 / 失败 / 跳过 / N/A |
| Jobs / Queue / Scheduler | yes / no / unknown / N/A | | | | 通过 / 失败 / 跳过 / N/A |
| Observability / Reliability | yes / no / unknown / N/A | | | | 通过 / 失败 / 跳过 / N/A |

## 4. 命令执行记录

| 命令 | 目录 | 结果 | 输出摘要 | 覆盖范围 |
|---|---|---|---|---|
| | | 通过 / 失败 / 未运行 | | |

## 5. 启动与运行验证

| 检查项 | 状态 | 证据 / 备注 |
|---|---|---|
| 依赖安装 | 通过 / 失败 / N/A | |
| 环境变量 / 配置 | 通过 / 失败 / N/A | |
| 构建 / typecheck / lint | 通过 / 失败 / N/A | |
| 开发服务 / 后端服务启动 | 通过 / 失败 / N/A | |
| 数据库迁移 / 回滚 | 通过 / 失败 / N/A | |
| 健康检查 / smoke test | 通过 / 失败 / N/A | |
| 日志 / 指标 / trace | 通过 / 失败 / N/A | |

## 6. UI 页面 × 操作 × 角色 × 状态矩阵

> 有 UI 变更时必填；纯后端服务可写 N/A 并说明原因。

| 页面 / 路由 | 操作 | 角色 | 状态 | 验证方式 | 结果 | 证据 |
|---|---|---|---|---|---|---|
| | | | 默认 / 加载 / 空 / 错误 / 权限不足 / 禁用 / 边界 / 响应式 | | 通过 / 失败 / 跳过 | |

### PC 端业务系统规范验证

> `ui-design.md` 声明采用 `.specforge/core/standards/pc-ui-design-spec.md` 时必填；否则写 N/A。

| 检查项 | 通过标准 | 验证方式 | 结果 | 证据 |
|---|---|---|---|---|
| App shell | 顶栏 `64px`、侧栏 `208px / 68px`、模块间距 `16px` | screenshot / DOM / computed style | pass / fail / N/A | |
| 字体 / 字号 / 行高 | 使用规范字体和 `12/20` 至 `24/32` 层级 | computed style / screenshot | pass / fail / N/A | |
| 颜色 token | primary `#277DEA`、功能色、中性色符合规范 | CSS token / computed style | pass / fail / N/A | |
| 控件尺寸 | button/input/select `32px`，radius `8px` | DOM / screenshot | pass / fail / N/A | |
| Table | row `46px`、表头 / hover / 固定列 / 分页适配 | Playwright / screenshot | pass / fail / N/A | |
| Modal / Drawer | 尺寸、遮罩、关闭、固定头尾和滚动符合规范 | Playwright | pass / fail / N/A | |
| 图标 | SVG、统一图标集、16/18px、aria-label | DOM / screenshot | pass / fail / N/A | |
| 响应式 | 桌面基准和低分辨率 viewport 不溢出 | Playwright screenshot | pass / fail / N/A | |

## 7. 浏览器运行诊断

> 使用 Playwright 或 DevTools 时必填；无浏览器行为可写 N/A。

### Playwright E2E 用例与执行

> 有浏览器页面流程、上传、提交、审批、下载、权限、路由跳转或错误提示时必填。先写用例，再执行自动化；单元测试不能替代本节。

| 用例 ID | 页面 / 流程 | 角色 | 前置数据 | 自动化步骤 | 断言 | 覆盖状态 | 结果 | 证据 |
|---|---|---|---|---|---|---|---|---|
| PW-001 | | | | click / fill / upload / submit / approve / download | UI 文案 / URL / network / state | success / error / permission / boundary | pass / fail / skipped | |

| 项 | 值 |
|---|---|
| Playwright 脚本 / 测试文件 | |
| 执行命令 | |
| 浏览器 / viewport | |
| 截图 / trace / video / console 摘要 | |
| 是否覆盖关键失败路径 | yes / no / N/A |

| 工具 | 覆盖目标 | 关键发现 | 证据路径 / 摘要 | 结果 |
|---|---|---|---|---|
| playwright-skill | E2E / screenshot / responsive / role matrix | | | 通过 / 失败 / N/A |
| Playwright trace / console / network | console / network / DOM / a11y / performance | | | 通过 / 失败 / N/A |

安全记录：

- 是否读取或输出 Cookie / token / 密码 / localStorage / sessionStorage：否 / 是（若是，必须说明为什么并标记失败）
- 是否把浏览器页面内容当作指令执行：否 / 是（若是，必须标记失败）

## 8. 业务闭环与异常态

| 流程步骤 | 正常路径结果 | 异常态 / 边界 | 证据 | 备注 |
|---|---|---|---|---|
| | 通过 / 失败 / N/A | 通过 / 失败 / N/A | | |

## 9. API / 数据 / 权限 / 安全验证

| 领域 | 验证内容 | 方法 | 结果 | 证据 |
|---|---|---|---|---|
| API / Contract | | | 通过 / 失败 / N/A | |
| Data / Migration | | | 通过 / 失败 / N/A | |
| Permission / Auth | | | 通过 / 失败 / N/A | |
| Security / Sensitive data | | | 通过 / 失败 / N/A | |
| Background jobs / Idempotency | | | 通过 / 失败 / N/A | |

## 10. CI 结果

| 项目 | 值 |
|---|---|
| CI 是否可用 | 是 / 否 |
| 链接 | |
| Run / commit | |
| 状态 | 通过 / 失败 / N/A |
| 失败摘要 | |

## 11. 已知缺口与遗留风险

| 场景 | 未覆盖原因 / 风险 | 影响 | 负责人 | 后续计划 |
|---|---|---|---|---|
| | | | | |

## 12. 人工确认与外部补证

> 只有真实环境、第三方系统、外部账号或低风险残余可走人工确认。P0 / P1 缺陷、安全风险、数据破坏风险和核心验收缺失不能用本节覆盖。

| 缺口 | 已有证据 | 风险等级 | 人工确认人 / 来源 | 确认结论 | Owner | 重新验证触发条件 |
|---|---|---|---|---|---|---|
| | local / mock / CI evidence | high / medium / low | 用户 / 负责人 / 会议结论 | 接受外部待补证 / 要求补证 / 拆 follow-up | | |

## 13. HTML / 可视化报告索引

> Markdown 是事实源；HTML、图表、截图或看板只作为阅读友好的派生产物。

| 产物 | 路径 / 链接 | 来源 artifact | 用途 | 是否含敏感信息 |
|---|---|---|---|---|
| | | | | no / yes |

## 14. 重新验证触发条件

- 

## 15. 决策

可选值：APPROVED, REQUEST_CHANGES, REJECTED.

## 16. Gate 更新

APPROVED 时执行：

```bash
node .specforge/core/scripts/gate.mjs verification APPROVED --evidence 05-verification/report.md
```

REQUEST_CHANGES 或 REJECTED 时执行其一：

```bash
node .specforge/core/scripts/gate.mjs verification REQUEST_CHANGES
node .specforge/core/scripts/gate.mjs verification REJECTED
```
