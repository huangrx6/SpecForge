---
name: sf-verify
description: 执行 SpecForge verification 阶段；用于 code_review 已通过，需要运行测试、记录证据并批准 verification gate 时。
---

# sf-verify

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

执行验证并留下证据。没有证据，不批准 verification。

## 启动

```bash
node .specforge/execution/tools/create-artifact.mjs verification
```

## 内部技能母本

开始验证前，读取 `.specforge/execution/stages/verification/SKILL.md`。验证证据、报告内容、停止条件和完成标准以内置母本为准。

## 关联规则

- `.specforge/policy/rules/testing/README.md`：验证深度匹配风险。
- `.specforge/policy/rules/gates/README.md`：verification evidence。
- `.specforge/policy/rules/boundaries/README.md`：验证下游影响。
- `.specforge/policy/rules/security/README.md`：安全敏感变更需要额外检查。
- `.specforge/policy/rules/delivery/README.md`：发布、配置和运行态验证。

## 动作

1. 从 design 和 tasks 里提取验证策略。
2. 选择测试、构建、lint、手工验证或日志证据。
3. 运行命令并记录结果。
4. 写入：
   - `05-verification/report.md`
   - `05-verification/ci-result.md`
5. 验证通过后：

```bash
node .specforge/execution/tools/gate.mjs verification APPROVED --evidence 05-verification/report.md
```

## 报告必须包含

- 验证范围。
- 具体命令。
- 输出摘要。
- 通过 / 失败结论。
- 已知缺口。
- 重新验证触发条件。

## 完成标准

- 验证命令、结果、证据和缺口清楚。
- verification gate 为 `APPROVED`。
- 下一步路由到 `sf-close`。

## 验证范围

`sf-verify` 负责收集和记录足以支撑当前 change 验收标准的证据。默认优先级：

1. 与本次 change 直接相关的单元测试、集成测试、lint、typecheck 或构建命令。
2. 设计和 tasks 中声明的验证策略。
3. 项目已有 CI 输出、日志、截图或手工验证记录。
4. 当命令无法运行时，记录无法运行的原因、影响、替代证据和剩余风险。

它不负责实际部署，也不凭空声明外部 CI 成功。CI 结果如果可得，应写入 `05-verification/ci-result.md`；如果不可得，应在报告中明确标记为未覆盖。

验证深度必须匹配风险：安全、权限、数据迁移、部署配置或公共 API 变更需要更强证据。

## 测试边界决策表

| 验证类型 | 是否属于 verify | 何时需要 |
|---|---|---|
| 单元测试 | 是 | 纯函数、组件、小型业务规则、bugfix 回归 |
| 集成测试 | 是 | 数据库、缓存、消息队列、外部服务适配、配置组合 |
| 契约测试 | 是 | API、SDK、RPC、事件、Webhook 或公共接口变化 |
| E2E 测试 | 条件属于 | 关键用户路径、权限链路、跨系统流程；如果项目未配置 E2E，记录未覆盖原因 |
| lint / typecheck / build | 是 | 代码、模板、CLI 或类型相关变更 |
| 手工验证 | 是 | UI、部署环境、第三方系统、一次性运维或无法自动化的场景 |
| 外部 CI 执行 | 不由 verify 触发 | CI 由外部系统运行；verify 只记录可获得的 CI 结果和链接 |
| 生产发布 | 不属于 | 交给 `sf-close` 的 release / rollback 记录处理 |

## verify 与 gate 的分工

- `sf-verify` 负责选择验证方式、运行或收集证据、写 `05-verification/report.md` 和 `05-verification/ci-result.md`。
- `gate.mjs` 只负责把已经完成的审查结论写回 `change.yaml`，并强制 `APPROVED` 必须绑定已存在的 evidence 文件。
- 没有验证报告时，不调用 `gate.mjs verification APPROVED`。
- 测试失败时，不批准 verification gate；应回到 implementation 或 review。

## 不做

- 不用“未运行测试”批准 verification。
- 失败时不归档；回到 implementation 或 review。
