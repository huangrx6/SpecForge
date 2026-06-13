# XMind Export Rules

XMind 可以帮助人快速审查测试空间，但不能成为唯一事实源。

## 必须导出

使用 XMind、白板或脑图时，必须导出至少一种：

- `05-verification/test-design/test-design-tree.md`
- `05-verification/test-design/test-design-tree.json`

并在 `05-verification/test-cases.md#1.1 Test Design Artifacts` 登记：

| Artifact | Format | Path | Derived Cases | Export Path | Status |
|---|---|---|---|---|---|
| 测试设计脑图 | xmind | 05-verification/test-design/test-design.xmind | TC-001, PW-001 | 05-verification/test-design/test-design-tree.md | exported |

## 节点命名

推荐节点标题格式：

```text
[Source][Risk][Case] Assertion
```

示例：

```text
[AC-003][high][PW-001] 无权限用户提交时展示权限错误且不产生数据变更
```

## 禁止

- 只保存 `.xmind` 文件，不导出 Markdown / JSON。
- 只保存脑图截图，不回填 TC / PW。
- 用脑图颜色表示风险但不填写 test-cases 的 Risk 字段。
- 用“待测”“验证一下”这类不可执行节点作为叶子。
