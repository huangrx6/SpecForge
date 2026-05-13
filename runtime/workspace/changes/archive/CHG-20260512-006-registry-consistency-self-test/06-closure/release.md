# 发布记录

## 发布摘要

新增 registry 自测和双向一致性校验，修复 CHG-005 归档实战暴露的 active entry 残留风险。

## 部署说明

仓库内脚本更新，无独立包发布。使用者拉取后可运行：

- `node .specforge/tools/self-test.mjs`
- `node .specforge/tools/validate-structure.mjs`

## 发布状态

Ready for archive.
