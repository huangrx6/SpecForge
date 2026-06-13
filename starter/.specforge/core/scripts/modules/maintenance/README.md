# Maintenance Module

职责：仓库健康、框架自审计、starter 同步、skill 校验、结构校验和外部 skill 更新。

稳定入口：`doctor.mjs`、`self-test.mjs`、`framework-audit.mjs`、`sync-starter.mjs`、`update-skills.mjs`、`validate-structure.mjs`、`validate-skills.mjs`、`validate-external-skills.mjs`。

框架级改动完成前必须至少运行 `doctor.mjs` 和 `framework-audit.mjs`。
