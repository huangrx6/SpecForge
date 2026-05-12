# 快速开始

## 校验仓库

```bash
node .specforge/tools/validate-structure.mjs
```

## 查看当前状态

```bash
node .specforge/tools/status.mjs
node .specforge/tools/artifact-graph-status.mjs
```

## 创建 Change

先预览 ID：

```bash
node .specforge/tools/create-change.mjs --dry-run "Add user login"
```

创建 change：

```bash
node .specforge/tools/create-change.mjs "Add user login"
```

`new:change` 只生成：

- `change.yaml`
- `00-intake/original-request.md`
- `00-intake/brief.md`

后续产物按 artifact graph 逐步生成：

```bash
node .specforge/tools/create-artifact.mjs requirements
node .specforge/tools/create-artifact.mjs design
node .specforge/tools/create-artifact.mjs tasks
node .specforge/tools/create-artifact.mjs spec_review
```

也可以让 SpecForge 根据当前状态提示下一步：

```bash
node .specforge/tools/instructions.mjs
node .specforge/tools/instructions.mjs -- design
node .specforge/tools/instructions.mjs -- apply
```

## 标准流程

1. `00-intake`：原始请求和 brief。
2. `01-spec`：requirements、design、tasks。
3. `02-spec-review`：批准规格或要求修改。
4. `03-implementation`：实现计划和实现报告。
5. `04-code-review`：按批准契约审查实现。
6. `05-verification`：记录测试、CI 或手工验证证据。
7. `06-closure`：release、rollback、SSoT sync。

## Gate 更新

Gate 不建议手工改 `change.yaml`，使用命令更新：

```bash
node .specforge/tools/gate.mjs spec_review APPROVED --evidence 02-spec-review/spec-review-v1.md
node .specforge/tools/gate.mjs code_review APPROVED --evidence 04-code-review/code-review-v1.md
node .specforge/tools/gate.mjs verification APPROVED --evidence 05-verification/report.md
node .specforge/tools/gate.mjs ssot_sync APPROVED --evidence 06-closure/ssot-sync.md
```

`APPROVED` 必须提供 evidence，且 evidence 必须存在于当前 change 目录下。

## 边界审查

实现前确认：

- 变更拥有清晰范围。
- 非目标明确。
- 任务有 `_Boundary:_` 和必要的 `_Depends:_`。
- 契约变化时已经命名下游重验证对象。

## 归档 Change

满足以下条件后，change 才能从 `.specforge/changes/active/` 移到 `.specforge/changes/archive/`：

- required `spec_review` 已批准。
- required `code_review` 已批准。
- `verification` 已批准。
- `ssot_sync` 已批准。
- `closure` 已生成 release 和 rollback 记录。

归档命令：

```bash
node .specforge/tools/archive-change.mjs
```

如果还有阻塞项，命令会列出未完成 artifact。
