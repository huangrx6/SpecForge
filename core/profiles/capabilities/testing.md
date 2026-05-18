# Testing Capability

用于选择测试层级和工具组合。具体验证深度见 `core/standards/engineering.md`。

## 适用

- 新增功能、bugfix 回归、API 契约、UI 流程、数据迁移、安全敏感变更。

## 选择矩阵

| 场景 | 推荐 |
|---|---|
| TS/React/Vite 组件和纯逻辑 | Vitest |
| 浏览器真实流程、角色权限、下载上传 | Playwright |
| API 契约和服务集成 | 框架集成测试 + contract examples |
| DB 迁移和数据一致性 | migration dry-run + rollback test |
| 安全敏感 | 权限矩阵 + 非法输入 + 敏感日志检查 |

## Design 必填

- 本次最低测试层级。
- 必测 happy path、异常、边界。
- 无法自动化的人工验证步骤。
- CI / 本地命令和通过标准。
