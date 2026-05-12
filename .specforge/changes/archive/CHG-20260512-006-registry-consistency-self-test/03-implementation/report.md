# 实现报告

## 摘要

已完成 registry 一致性补强：

- 将 archive 命令中内联的 registry 文本处理抽到 `.specforge/tools/lib/specforge.mjs`。
- 新增 `.specforge/tools/self-test.mjs`，覆盖 CHG-005 实战暴露的 active entry 删除残留问题。
- `validate` 增加 registry 与 active/archive 目录的双向一致性检查。
- `package.json` 新增 `selftest`。

## 变更内容

- `removeRegistryEntry` 修复了正则在多行匹配中提前停止的问题。
- `parseRegistryEntries` 用于 selftest 和 validate。
- validate 会发现 registry 缺少目录 entry、重复 id、path 生命周期不匹配。

## 审查提示

- 重点看 selftest 是否覆盖单 active 删除和多 active 保留。
- 重点看 validate 是否会对 active: [] 产生误报。
