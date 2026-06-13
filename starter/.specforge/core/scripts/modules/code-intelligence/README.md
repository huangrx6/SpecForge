# Code Intelligence Module

职责：存量项目画像、provider 检测、CodeGraph health、Repomix 编排计划、bootstrap map 和 provider graph facts 归一化。

稳定入口：`codebase-map.mjs`、`codebase-index.mjs`。

内部模块：`provider-facts.mjs` 负责把 CodeGraph / MCP / SCIP 查询结果归一为 `graph_facts[]`。

不要把 provider 原始输出直接写入 wiki；先归一为当前事实和证据。
