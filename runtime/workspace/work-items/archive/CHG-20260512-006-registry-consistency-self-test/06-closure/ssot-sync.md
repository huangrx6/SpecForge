# SSoT 同步

## 本变更是否影响项目 SSoT？

是。新增 `selftest` 命令和 registry 双向一致性校验，属于项目验证模型变化。

## 已更新文件

- `README.md`
- `.specforge/project/engineering/validation-model.md`
- `.specforge/project/product/feature-list.md`

## 契约变化

- 新增 `node .specforge/tools/self-test.mjs`。
- `node .specforge/tools/validate-structure.mjs` 增加 registry active/archive 目录和 registry entry 双向一致性检查。

## 需要下游重新验证

- 修改 registry helper 或 archive 命令时运行 `node .specforge/tools/self-test.mjs`。
- 修改 registry 文件后运行 `node .specforge/tools/validate-structure.mjs`。

## 未更新原因

无。

## 备注

本次变更由 CHG-005 归档实战暴露的问题驱动。
