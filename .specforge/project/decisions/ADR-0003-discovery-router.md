# ADR-0003: Discovery 作为路由器

## 状态

Accepted

## 背景

不是每个任务都值得走完整 spec workflow。社区实践和类似 SDD 工具都显示，把所有变更强行套进同一流程会制造额外负担。

## 决策

SpecForge discovery 将工作路由到五类结果：

- `NO_SPEC_NEEDED`
- `SINGLE_CHANGE`
- `MULTI_CHANGE`
- `EXTEND_EXISTING`
- `MIXED`

Discovery 写入持久上下文后停止，不自动运行后续流程。

## 后果

- 小变更保持轻量。
- 大工作可以先拆解再实现。
- 工作流保持纪律，但不变成仪式。
