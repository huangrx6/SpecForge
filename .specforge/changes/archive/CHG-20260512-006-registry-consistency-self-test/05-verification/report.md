# 验证报告

## 范围

验证 registry helper、自测脚本和 validate 双向一致性检查。

## 命令

- `node .specforge/tools/self-test.mjs`
- `node .specforge/tools/validate-structure.mjs`
- `node .specforge/tools/instructions.mjs -- apply`

## 结果

- `node .specforge/tools/self-test.mjs` 通过，覆盖 registry 单 active 删除、多 active 保留和 archive 追加。
- `node .specforge/tools/validate-structure.mjs` 通过，检查 97 个 required paths、workflow schema、registry paths 和 change evidence。
- `node .specforge/tools/instructions.mjs -- apply` 可读取 CHG-006 tasks，当前 3/6 完成。

## 边界检查

- 未引入第三方依赖。
- 未修改 registry 文件格式。
- 未修改已归档 change 内容。

## 重新验证触发条件

- 修改 registry helper。
- 修改 archive 命令。
- 修改 validate registry 检查。

## Evidence

- `05-verification/ci-result.md`

## 已知缺口

- 自测仍是脚本级测试，不覆盖真实文件移动。
