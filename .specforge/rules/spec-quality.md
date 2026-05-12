# 规格质量规则

好规格应约束 Agent，而不是把每个变更都拖成瀑布项目。

## 合适的规格重量

- 小变更可以走 lite workflow 或直接实现。
- 中等变更应成为一个 standard change。
- 大变更应拆成多个 change，并明确契约。

如果规格显得很重，先判断是不是变更本身太大。

## requirements 质量

`requirements.md` 应回答“要什么”和“如何验收”，不提前绑定实现细节。

必须包含：

- 背景和目标。
- 范围和非目标。
- 用户、系统或调用方视角的行为。
- 可验证的验收标准。
- 依赖的上游契约和影响的下游区域。
- 歧义、假设和待确认问题。

建议写法：

- 行为需求优先使用 EARS。
- 非功能需求写成可验证约束，例如性能、可靠性、安全、兼容性。
- 不确定项使用 `[NEEDS CLARIFICATION: question]`，不要用含糊描述盖过去。
- 对 bugfix，必须写清当前行为、期望行为、保持不变的行为和复现条件。

避免：

- “优化一下”“更好用”“保证稳定”这类不可验收表述。
- 在需求里规定内部函数名、文件结构或算法，除非它本身就是约束。
- 把方案争议藏在需求里。

## design 质量

`design.md` 应回答“怎么做”和“为什么这样做”。

必须包含：

- 方案概览。
- 受影响模块和写入范围。
- 关键流程、数据流或时序。
- API、数据库、配置、权限、部署等契约变化。
- 错误处理、日志、可观测性和回滚考虑。
- 测试策略和风险。
- 备选方案与取舍，至少覆盖被放弃的关键路径。

设计不得只是代码清单。对 Agent 有价值的设计是边界、契约、风险和验证路线。

## tasks 质量

`tasks.md` 应把设计切成可执行、可审查、可验证的小任务。

每个任务应包含：

- 明确动作和完成条件。
- `_Boundary:_` 说明写入范围或责任边界。
- `_Depends:_` 标注依赖。
- `_Evidence:_` 标注完成后要留下的证据。

任务粒度判断：

- 一个任务应该能在一次聚焦实现中完成。
- 任务之间依赖应尽量少，依赖复杂时考虑拆 change。
- 不把“实现全部功能”作为一个任务。
- 测试、文档、配置和迁移不是附属品，风险高时应成为独立任务。

## 必备质量标记

- requirements 在合适时使用 EARS 风格描述。
- 歧义用 `[NEEDS CLARIFICATION: question]` 标记。
- 非目标明确。
- 验收标准可验证。
- 设计决策能追溯到需求。
- 任务足够小，可以在一次聚焦实现中完成。

## EARS 示例

```text
WHEN <event>, THE SYSTEM SHALL <response>.
IF <condition>, THE SYSTEM SHALL <response>.
WHILE <state>, THE SYSTEM SHALL <response>.
WHERE <feature applies>, THE SYSTEM SHALL <response>.
```

## 验收标准模板

验收标准应尽量写成：

```text
- GIVEN <前置条件>
  WHEN <触发动作>
  THEN <可观察结果>
```

或：

```text
- WHEN <事件>, THE SYSTEM SHALL <响应>.
```

验收标准必须能被以下至少一种方式验证：

- 自动化测试。
- 手工复现步骤和截图/日志。
- API 调用或命令输出。
- 配置检查、数据库查询或监控指标。
- code review 证据，适用于纯结构性变更。

## 规格完整性检查

提交 spec review 前检查：

- requirements、design、tasks 三者是否互相引用一致。
- 每条关键需求是否至少有一个设计点和一个任务覆盖。
- 每个任务是否能追溯到需求或设计。
- 非目标是否避免了实现范围扩张。
- 是否有迁移、兼容、回滚或安全缺口。
- 是否写明哪些事情无需做，以及为什么。

## 避免

- 没有证据的未来能力。
- 没有证据的 future-proofing。
- 过早描述实现细节的需求。
- 变成代码转储的设计文档。
- 没有依赖信息的任务列表。
- 只有目录结构，没有行为约束。
- 只有 happy path，没有错误态、空态、权限态或回滚态。
- 用“待后续完善”绕过当前必须决策的问题。

## 参考来源

- Kiro Specs 采用 requirements / design / tasks 作为规格核心产物：https://kiro.dev/docs/specs/
- GitHub Spec Kit 强调先定义 intent，再经过多阶段 refinement 进入实现：https://github.github.com/spec-kit/
- OpenSpec 强调先达成共识再构建，并为每个 change 保存 proposal、spec、design、tasks：https://openspec.pro/
