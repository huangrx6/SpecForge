# Testing Capability

用于选择单元、集成、契约、E2E、浏览器自动化、测试数据和 CI 验证策略。

## 适用

- 需求涉及核心业务流、权限、安全、数据迁移、外部接口或 UI 交互。
- 需要在 implementation 前明确测试层级和证据强度。
- 当前项目测试薄弱，需要定义最低可接受验证。

## 设计必填

- 哪些风险用 unit / integration / contract / Playwright / manual 覆盖？
- 测试数据和 mock / fake / sandbox 环境如何准备？
- 哪些用例必须进 `05-verification/test-cases.md`？
- CI 是否可用；不可用时本地命令证据如何替代？
- 哪些跳过项需要 owner、影响和重新验证触发条件？

## 验证

- `test-cases.md` 先于执行存在并通过 `test-case-quality.mjs`。
- 关键路径有命令输出、截图、trace、日志或 CI 链接。
- 失败测试不得标为通过；人工确认只用于低风险或外部待补证。
