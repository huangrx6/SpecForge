# ADR-0002: 边界优先规格

## 状态

Accepted

## 背景

Agent 生成的改动可能很快跨越许多文件。如果没有明确 owner 和边界，并行或长时间运行的工作会悄悄破坏相邻模块。

## 决策

SpecForge v0.1 将边界视为一等要素。Requirements 定义范围和非目标，Design 记录边界承诺和文件结构计划，Tasks 使用 `_Boundary:_` 和 `_Depends:_` 标注，Review 检查边界违规。

## 后果

- Specs 更小，也更容易审查。
- Review 聚焦契约，而不是文档体积。
- 实现前需要一定的范围澄清。
