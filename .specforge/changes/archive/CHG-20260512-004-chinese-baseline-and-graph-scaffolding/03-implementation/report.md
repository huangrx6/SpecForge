# Implementation Report

## 摘要

已完成 graph 驱动脚手架基础能力和核心中文化。新 change 以后只生成控制面和 intake，后续通过 `new:artifact` 生成指定产物。validate 已支持 active incomplete / archive complete 的不同规则。

## 变更内容

- `new:change` 改为 intake-only。
- 新增 `new:artifact`。
- `validate` 改为读取 workflow schema，并校验 registry path、active/archived change。
- `graph:status` 改为依赖优先判断，避免提前模板误判 done。
- 中文化 Agent 入口、rules、skills、commands、templates、getting-started 和部分 SSoT。

## 审查提示

- 未引入外部依赖。
- CHG-004 是旧脚手架创建的，因此已有全部模板；状态判断已修正为依赖未满足时阻塞。
- 历史 archive 内容未全量中文化，后续可单独做迁移。
