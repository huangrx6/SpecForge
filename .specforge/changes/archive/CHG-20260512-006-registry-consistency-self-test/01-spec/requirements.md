# 需求规格

## 摘要

CHG-005 归档实战暴露出 registry active entry 删除不完整的问题。本变更将 registry 操作抽到共享库，新增自测脚本，并增强 validate 的双向一致性检查，防止 active/archive 目录和 `.specforge/registry.yaml` 再次漂移。

## 边界

### 本变更负责

- 抽取 registry entry 删除、active 空状态归一化、archive entry 追加和 registry entry 解析函数。
- `archive` 命令复用共享 registry 函数。
- 新增 `node .specforge/tools/self-test.mjs`，覆盖 registry 删除和归档追加的内存级测试。
- `validate` 检查 active/archive 目录与 registry 双向一致。
- 回写功能清单和校验模型。

### 本变更不负责

- 不引入测试框架。
- 不重写 registry 为复杂 YAML parser。
- 不调整旧 archive 内容。

### 依赖

- `.specforge/registry.yaml` 继续使用当前三段式结构：active、blocked、archive。
- `.specforge/tools/lib/specforge.mjs` 作为共享运行时库。

### 重新验证触发条件

- registry 结构变化。
- archive 命令更新。
- validate registry 逻辑更新。

## 待澄清项

无。

## 功能需求

必要时使用 EARS 风格：

- WHEN 用户运行 `node .specforge/tools/self-test.mjs`, THE SYSTEM SHALL 验证 registry 单 active 删除、多 active 保留和 archive 追加逻辑。
- WHEN 用户运行 `node .specforge/tools/validate-structure.mjs`, THE SYSTEM SHALL 检查每个 active/archive 目录在 registry 中存在对应 entry。
- IF registry entry path 与 section 生命周期不匹配, THE SYSTEM SHALL 校验失败。
- IF registry 中存在重复 id, THE SYSTEM SHALL 校验失败。

## 非功能需求

- 测试不依赖文件系统写入。
- 自测失败必须以非 0 退出。
- 校验错误必须指明具体 registry section、id 或 path。

## 不在范围内

- 完整 YAML AST 解析。
- CLI 测试框架。
- 自动修复 registry。

## 验收标准

| 标准 | 验证方式 |
|---|---|
| registry 删除 bug 被自测覆盖 | `node .specforge/tools/self-test.mjs` |
| registry 与目录双向一致 | `node .specforge/tools/validate-structure.mjs` |
| 当前 active change 可被 graph 识别 | `node .specforge/tools/artifact-graph-status.mjs` |
