# Quality Module

职责：阶段感知质量检查、证据分级、测试用例质量、implementation ledger、wiki / closure readiness 和 gate preflight。

稳定入口：`quality-suite.mjs`、`artifact-quality.mjs`、`decision-quality.mjs`、`source-quality.mjs`、`implementation-quality.mjs`、`test-case-quality.mjs`、`evidence-summary.mjs`、`wiki-quality.mjs`、`closure-quality.mjs`、`gate-preflight.mjs`。

新增质量规则优先做成只读检查；不要在检查脚本里自动修 artifact。
