# SpecForge Project Runtime

本目录是业务项目内 `.specforge/` 的运行时入口。它保存规则、模板、工具、项目知识和 change 证据；业务代码仍留在项目源码目录，不放进 `.specforge/`。

## 加载顺序

1. 读取当前用户请求，以及更高优先级的系统 / 开发者指令。
2. 读取 `.specforge/attention.md`。
3. 读取 `.specforge/manifest.yaml`。
4. 读取 `.specforge/registry.yaml`。
5. 如果有且只有一个 active change，读取它的 `change.yaml`。
6. 自动推进或高风险操作前，运行 `node .specforge/execution/tools/doctor.mjs`。
7. 运行 `node .specforge/execution/tools/instructions.mjs` 判断下一个 ready artifact。
8. 只加载当前 artifact 需要的 rules、templates 和 knowledge。

## 工作流状态机

```text
feature:   intake -> requirements -> design -> tasks -> spec_review -> implementation -> code_review -> verification -> ssot_sync -> closure
standard:  intake -> requirements -> design -> tasks -> spec_review -> implementation -> code_review -> verification -> ssot_sync -> closure
lite:      intake -> requirements -> tasks -> implementation -> code_review -> verification -> ssot_sync -> closure
bugfix:    intake -> gap_report -> tasks -> implementation -> code_review -> verification -> ssot_sync -> closure
refactor:  intake -> design -> tasks -> spec_review -> implementation -> code_review -> verification -> ssot_sync -> closure
discovery: intake -> research -> ssot_sync -> closure
```

## 门禁纪律

必需门禁由当前 workflow schema 决定，记录在 `change.yaml` 中，并且必须绑定证据文件：

- `spec_review`：`02-spec-review/spec-review-v1.md`
- `code_review`：`04-code-review/code-review-v1.md`
- `verification`：`05-verification/report.md` 或 `05-verification/ci-result.md`
- `ssot_sync`：`06-closure/ssot-sync.md`

必需门禁未处于 `APPROVED`，或证据文件不存在时，不得进入下游阶段。

## 边界约束

- 动态 change 证据放在 `.specforge/workspace/changes/active/<change-id>/`。
- 长期事实放在 `.specforge/workspace/knowledge/`。
- 稳定规则放在 `.specforge/policy/rules/`，不要把一次性 change 报告粘进去。
- 如果实现需要扩大已批准写入范围，先停下来更新 spec 或询问用户。
