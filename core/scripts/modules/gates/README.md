# Gates Module

职责：更新 gate 状态、绑定 evidence、触发 hook。

稳定入口：`gate.mjs`。

Gate 脚本不负责判断是否应批准；批准依据来自 review / verification / wiki-sync evidence 和 preflight。
