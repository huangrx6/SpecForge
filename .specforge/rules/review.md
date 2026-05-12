# 审查规则

审查规则用于 `spec_review` 和 `code_review`。审查的目标不是挑毛病，而是阻止错误阶段推进，并把风险变成可处理的修改项。

## 审查姿态

- 先看 correctness、边界、安全、测试和回滚，再看风格。
- 所有发现必须指向具体文件、产物、需求、任务或证据。
- 不用个人偏好阻断 change，除非偏好已经是项目规则。
- 对可接受风险写明为什么可接受。
- 对阻断项写明修改后如何重新审查。

## spec review

输入：

- `00-intake/brief.md`
- `01-spec/requirements.md`
- `01-spec/design.md`
- `01-spec/tasks.md`
- 相关 `.specforge/project/` 长期事实

必须检查：

- 目标、范围、非目标是否清楚。
- 验收标准是否可验证。
- design 是否覆盖关键需求。
- tasks 是否能执行并追溯到 design。
- API、数据、权限、配置、部署影响是否写清。
- 风险和未知项是否被标记。
- 是否需要拆分 change。

批准条件：

- Agent 可以仅凭 spec 和必要代码上下文开始实现。
- 关键风险已设计处理或明确延后。
- 没有阻断性歧义。

## code review

输入：

- 当前 diff。
- `requirements.md`、`design.md`、`tasks.md`。
- `changed-files.md`、implementation report。
- 测试和验证证据。

必须检查：

- 实现是否满足验收标准。
- 是否越过 design 写入范围。
- 是否引入未声明行为。
- 是否破坏 API、数据、权限或部署契约。
- 错误处理、日志、并发、资源释放是否符合场景。
- 测试是否覆盖关键路径和失败路径。
- 是否需要 SSoT sync。

## 输出格式

审查结论必须使用：

- `APPROVED`
- `REQUEST_CHANGES`
- `REJECTED`

建议结构：

```text
Status: REQUEST_CHANGES

Findings
- [P1] <问题> - <文件或产物>

Evidence
- Checked: ...
- Missing: ...

Required changes
- ...
```

严重级别：

- `P0`：会导致安全事故、数据损坏、生产不可用或错误发布。
- `P1`：会导致功能错误、权限问题、明显回归或 gate 不应通过。
- `P2`：质量、维护性或测试缺口，建议本 change 修复。
- `P3`：非阻断建议。

## 阻断项

以下问题应阻断：

- 验收标准不可测或关键需求缺失。
- 实现和 spec 不一致。
- 权限、安全、数据迁移缺少设计或验证。
- 明文密钥、敏感日志或生产配置泄露。
- 关键路径没有测试，也没有替代验证。
- 公共契约破坏兼容但没有迁移策略。
- 变更范围失控，无法在当前 review 中可靠判断。

## 非阻断项

以下通常不应单独阻断：

- 与当前行为无关的历史代码风格问题。
- 可以后续独立处理的重构建议。
- 不影响理解和维护的小命名偏好。
- 已记录且风险可接受的测试缺口。

## 参考来源

- Google Engineering Practices 建议小 CL、相关测试同 CL、重构和行为变更尽量分离：https://google.github.io/eng-practices/review/developer/small-cls.html
- NIST SSDF 强调在软件生命周期中加入安全实践和漏洞响应：https://csrc.nist.gov/projects/ssdf
