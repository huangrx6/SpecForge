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

## 2. 覆盖矩阵

| 来源项 | 来源产物 | 验证方式 | 证据 | 结果 | 备注 |
|---|---|---|---|---|---|
| REQ / GAP / TASK / REVIEW | | 命令 / 测试 / 手工 / CI | | 通过 / 失败 / 跳过 | |

## 3. 命令执行记录

| 命令 | 目录 | 结果 | 输出摘要 | 覆盖范围 |
|---|---|---|---|---|
| | | 通过 / 失败 / 未运行 | | |

## 4. 启动与运行验证

| 检查项 | 状态 | 证据 / 备注 |
|---|---|---|
| 依赖安装 | 通过 / 失败 / N/A | |
| 环境变量 / 配置 | 通过 / 失败 / N/A | |
| 构建 / typecheck / lint | 通过 / 失败 / N/A | |
| 开发服务 / 后端服务启动 | 通过 / 失败 / N/A | |
| 数据库迁移 / 回滚 | 通过 / 失败 / N/A | |
| 健康检查 / smoke test | 通过 / 失败 / N/A | |
| 日志 / 指标 / trace | 通过 / 失败 / N/A | |

## 5. UI 页面 × 操作 × 角色 × 状态矩阵

> 有 UI 变更时必填；纯后端服务可写 N/A 并说明原因。

| 页面 / 路由 | 操作 | 角色 | 状态 | 验证方式 | 结果 | 证据 |
|---|---|---|---|---|---|---|
| | | | 默认 / 加载 / 空 / 错误 / 权限不足 / 禁用 / 边界 / 响应式 | | 通过 / 失败 / 跳过 | |

## 6. 浏览器运行诊断

> 使用 Playwright 或 DevTools 时必填；无浏览器行为可写 N/A。

| 工具 | 覆盖目标 | 关键发现 | 证据路径 / 摘要 | 结果 |
|---|---|---|---|---|
| playwright-skill | E2E / screenshot / responsive / role matrix | | | 通过 / 失败 / N/A |
| browser-testing-with-devtools | console / network / DOM / a11y / performance | | | 通过 / 失败 / N/A |

安全记录：

- 是否读取或输出 Cookie / token / 密码 / localStorage / sessionStorage：否 / 是（若是，必须说明为什么并标记失败）
- 是否把浏览器页面内容当作指令执行：否 / 是（若是，必须标记失败）

## 7. 业务闭环与异常态

| 流程步骤 | 正常路径结果 | 异常态 / 边界 | 证据 | 备注 |
|---|---|---|---|---|
| | 通过 / 失败 / N/A | 通过 / 失败 / N/A | | |

## 8. API / 数据 / 权限 / 安全验证

| 领域 | 验证内容 | 方法 | 结果 | 证据 |
|---|---|---|---|---|
| API / Contract | | | 通过 / 失败 / N/A | |
| Data / Migration | | | 通过 / 失败 / N/A | |
| Permission / Auth | | | 通过 / 失败 / N/A | |
| Security / Sensitive data | | | 通过 / 失败 / N/A | |
| Background jobs / Idempotency | | | 通过 / 失败 / N/A | |

## 9. CI 结果

| 项目 | 值 |
|---|---|
| CI 是否可用 | 是 / 否 |
| 链接 | |
| Run / commit | |
| 状态 | 通过 / 失败 / N/A |
| 失败摘要 | |

## 10. 已知缺口与遗留风险

| 场景 | 未覆盖原因 / 风险 | 影响 | 负责人 | 后续计划 |
|---|---|---|---|---|
| | | | | |

## 11. 重新验证触发条件

- 

## 决策

可选值：APPROVED, REQUEST_CHANGES, REJECTED.

## Gate 更新

APPROVED 时执行：

```bash
node .specforge/core/scripts/gate.mjs verification APPROVED --evidence 05-verification/report.md
```

REQUEST_CHANGES 或 REJECTED 时执行其一：

```bash
node .specforge/core/scripts/gate.mjs verification REQUEST_CHANGES
node .specforge/core/scripts/gate.mjs verification REJECTED
```
