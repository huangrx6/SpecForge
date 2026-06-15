---
name: problem-framing
description: Brainstorm 包内的问题重构 skill。用于用户请求仍然模糊、目标用户不清、成功标准缺失、约束/非目标/决策边界不明，或 agent 准备发散方案前需要先把一句话需求整理成可分析的问题空间。
---

# 问题重构

本 skill 只做问题重构，不做方案选择。目标是把“我想优化一下”“这个功能怎么做”“这个 skill 怎么设计”这类模糊请求，转成后续 `divergent-thinking`、`research-source`、`decision-matrix` 能使用的结构化输入。

## 读取

- 用户原始请求和最近对话。
- 已有 `brainstorm.md`、`brief.md`、PRD、requirements、UI design、technical design。
- 能说明约束的 wiki、manifest、lockfile 或代码事实；没有读取到时写 `unknown`。
- 如果当前事实会改变取舍，把问题交给 `research-source`，不要凭记忆补。

## 执行步骤

1. 用一句话重述原始请求，保留用户真正关心的对象。
2. 判断工作对象：产品、页面、流程、agent skill、架构、运营机制、验证方案或决策本身。
3. 分离“问题”和“用户已经暗示的解法”。不要把解法当目标。
4. 填写问题重构表，缺失但会影响范围、成本、体验、架构或安全的项标记为 `[必须确认]`。
5. 标出固定约束、可改变空间、明确不做和可安全默认。
6. 列出事实查证问题：版本、价格、竞品、AI provider、依赖、法规、安全、兼容性。
7. 产出问题地图，并按优先级排序：核心目标/范围 > 体验方向 > 数据与安全 > 集成与依赖 > 交付验收。

## 输出格式

### 问题重构表

```md
## 问题重构

| 维度 | 当前理解 | 缺口 / 风险 | 处理 |
|---|---|---|---|
| 原始表述 | | | preserve / rewrite |
| 真实目标 | | | confirmed / must-confirm / default |
| 用户 / 受众 | | | confirmed / must-confirm / default |
| 当前痛点 | | | confirmed / must-confirm / default |
| 成功标准 | | | confirmed / must-confirm / default |
| 固定约束 | | | confirmed / must-confirm / default |
| 可改变空间 | | | confirmed / must-confirm / default |
| 明确不做 | | | confirmed / must-confirm / default |
| 需要事实查证 | | | research-source / no-action |
```

### 问题地图

```md
## 问题地图

- [已明确] 用户已经说清楚，或项目事实已经证明：
- [必须确认] 会改变范围、体验、成本、架构、安全或验收：
- [可安全默认] 低风险、可回退、行业常规或后续可调整：
```

## 提问规则

- 每次只问一个会改变方向的问题。
- 问题必须带 2-3 个真实选项，选项之间要有成本、风险或体验差异。
- 用户说“你决定”时，写成授权默认，并记录推荐理由、风险和回退点。
- 如果缺失信息只影响后续细化，不阻塞当前 brainstorm，写入下游交接，不要卡住。

## 质量门槛

- 至少区分目标、用户、约束、非目标和成功标准。
- 至少列出 1 个“可能跑偏的点”。
- 必须把 agent 假设和用户确认分开。
- 必须说明是否需要 `research-source`。
- 不能在问题未框定前进入方案推荐。

## 常见失败

| 失败 | 表现 | 修正 |
|---|---|---|
| 把解法当问题 | “用户要加 X，所以方案就是 X” | 回到真实目标：为什么要 X |
| 问题太大 | 一次想解决产品、架构、UI、增长和商业化 | 拆成必须确认项和后续阶段输入 |
| 假设冒充事实 | “应该是 Vue / React / 某竞品这样做” | 标记 unknown，交给 `research-source` |
| 过早提问太多 | 一次问 5 个问题 | 只问最高优先级的一个 |

## 停止条件

- 目标和受众完全不清，且没有可安全默认项：先向用户提一个问题。
- 事实缺口会改变推荐：先交给 `research-source`。
- 用户已经明确方案和范围：不要过度重构，只记录已明确和下一步。
