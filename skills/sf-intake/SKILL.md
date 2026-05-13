---
name: sf-intake
description: 为新请求创建或整理 SpecForge change；用于用户提出新需求、bug、重构或边界不清的工作，需要进入 intake/discovery 时。
---

# sf-intake

把用户的原始诉求变成一个可推进的 active change。它负责 intake，不负责写完整规格或实现代码。

## 启动扫描

1. 读取 `.specforge/attention.md`。
2. 读取 `.specforge/registry.yaml`。
3. 读取相关 `.specforge/workspace/knowledge/` 长期事实；只读和请求相关的文件。
4. 运行 `node .specforge/execution/tools/status.mjs`，确认 active change 数量。

## 内部技能母本

开始整理 intake 前，读取 `.specforge/execution/stages/discovery/SKILL.md`。本根级 skill 只保留入口动作；discovery 的输入、输出、停止条件和完成标准以内置母本为准。

## 关联规则

- `.specforge/policy/rules/context/README.md`：只加载必要上下文。
- `.specforge/policy/rules/analysis-workflow/README.md`：判断分析深度、代码探索、外部研究和计划确认证据。
- `.specforge/policy/rules/product-discovery/README.md`：产品、页面、全栈应用必须展开候选功能池。
- `.specforge/policy/rules/boundaries/README.md`：判断范围、非目标和写入边界。
- `.specforge/policy/rules/spec-quality/README.md`：遇到歧义必须标记 `[NEEDS CLARIFICATION]`。
- `.specforge/policy/rules/localization.md`：面向人类的产物优先中文。

## 动作

1. 没有 active change 时创建：

```bash
node .specforge/execution/tools/create-change.mjs "Change title"
```

2. 写清：
   - `00-intake/original-request.md`
   - `00-intake/brief.md`
3. 判断 workflow：`lite`、`standard`、`bugfix`。
4. 在 brief 中写：
   - 背景和目标。
   - 分析深度、代码库探索、外部研究或跳过理由、澄清记录和分析综合。
   - 候选功能池、推荐 MVP、用户已确认选择和明确延后项。
   - 本次负责 / 不负责。
   - 受影响区域。
   - 依赖、风险、澄清项。

## 停止条件

- 有多个 active change，且用户未指定要继续哪一个。
- 需求边界不清，无法判断是 bug、feature、refactor 或 research。
- 产品 / 页面 / 全栈应用的 MVP 功能组合尚未确认，且无法安全默认。
- `standard` / `deep` 缺少代码库探索证据或明确跳过原因。
- `deep` 缺少外部研究证据或明确跳过原因。
- 存在生产、安全、权限、数据迁移风险但没有足够上下文。

## 完成标准

- change 已进入 `.specforge/workspace/changes/active/`。
- brief 足以支撑 requirements。
- 下一步明确路由到 `sf-spec`，或因澄清项暂停。

## 不做

- 不直接实现。
- 不跳过 requirements / design / tasks。
