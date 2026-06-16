# Quality Module

职责：阶段感知质量检查、证据分级、测试用例质量、implementation ledger、wiki / closure readiness 和 gate preflight。

稳定入口：`quality-suite.mjs`、`artifact-quality.mjs`、`decision-quality.mjs`、`source-quality.mjs`、`implementation-quality.mjs`、`test-case-quality.mjs`、`evidence-summary.mjs`、`wiki-quality.mjs`、`closure-quality.mjs`、`gate-preflight.mjs`。

`artifact-quality.mjs` 同时负责通用可读性检查和 spec profile lint。新增 requirements、technical_design、tasks 的结构规则时，优先放在 `core/scripts/lib/artifact-quality.mjs`，并补 self-test fixture；不要把同一规则复制到多个 stage skill。

`wiki-quality.mjs` 支持 `--mode bootstrap | steering | close`：

- `bootstrap`：允许刚初始化的空骨架存在，用于新项目 scaffold。
- `steering`：用于存量项目画像，核心 wiki 文件 placeholder、缺导航证据、graph fact 未回写会变成 `FAIL`。
- `close`：用于 work item 归档前，额外读取 `wiki-update-plan`，阻断已验证 work item 后 wiki 仍为空壳或 N/A 与 required targets 冲突。

新增质量规则优先做成只读检查；不要在检查脚本里自动修 artifact。
