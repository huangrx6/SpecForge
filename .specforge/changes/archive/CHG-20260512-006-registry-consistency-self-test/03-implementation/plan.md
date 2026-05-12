# 实现计划

## 范围

修复并固化 registry 归档一致性：

- 抽取 registry helper。
- 新增 selftest。
- validate 增加目录和 registry 双向检查。
- SSoT 记录新命令。

## 步骤

- [x] 抽取 `removeRegistryEntry` 等函数到共享库。
- [x] 更新 archive 命令使用共享函数。
- [x] 新增 selftest 并注册 npm script。
- [x] validate 增加双向一致性检查。
- [ ] 回写 SSoT。
- [ ] 归档 CHG-006。

## 预计变更文件

| Path | Reason |
|---|---|
| `.specforge/tools/lib/specforge.mjs` | registry helper |
| `.specforge/tools/archive-change.mjs` | 复用 registry helper |
| `.specforge/tools/self-test.mjs` | 自测 registry 逻辑 |
| `.specforge/tools/validate-structure.mjs` | 双向一致性校验 |
| `package.json` | 新增 `selftest` |
