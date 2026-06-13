# Quality Module

职责：阶段感知质量检查、证据分级、测试用例质量、implementation ledger、wiki / closure readiness 和 gate preflight。

稳定入口：`quality-suite.mjs`、`artifact-quality.mjs`、`decision-quality.mjs`、`source-quality.mjs`、`implementation-quality.mjs`、`test-case-quality.mjs`、`evidence-summary.mjs`、`wiki-quality.mjs`、`closure-quality.mjs`、`gate-preflight.mjs`。

`artifact-quality.mjs` 同时负责通用可读性检查和 spec profile lint。新增 requirements、technical_design、tasks 的结构规则时，优先放在 `core/scripts/lib/artifact-quality.mjs`，并补 self-test fixture；不要把同一规则复制到多个 stage skill。

新增质量规则优先做成只读检查；不要在检查脚本里自动修 artifact。
