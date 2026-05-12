---
name: specforge-intake
description: 为新请求创建或整理 SpecForge change；用于用户提出新需求、bug、重构或边界不清的工作，需要进入 intake/discovery 时。
---

# specforge-intake

把用户的原始诉求变成一个可推进的 active change。它负责 intake，不负责写完整规格或实现代码。

## 启动扫描

1. 读取 `.specforge/attention.md`。
2. 读取 `.specforge/registry.yaml`。
3. 读取相关 `.specforge/project/` SSoT；只读和请求相关的文件。
4. 运行 `node .specforge/tools/status.mjs`，确认 active change 数量。

## 关联规则

- `.specforge/rules/context.md`：只加载必要上下文。
- `.specforge/rules/boundaries.md`：判断范围、非目标和写入边界。
- `.specforge/rules/spec-quality.md`：遇到歧义必须标记 `[NEEDS CLARIFICATION]`。
- `.specforge/rules/localization.md`：面向人类的产物优先中文。

## 动作

1. 没有 active change 时创建：

```bash
node .specforge/tools/create-change.mjs "Change title"
```

2. 写清：
   - `00-intake/original-request.md`
   - `00-intake/brief.md`
3. 判断 workflow：`lite`、`standard`、`bugfix`。
4. 在 brief 中写：
   - 背景和目标。
   - 本次负责 / 不负责。
   - 受影响区域。
   - 依赖、风险、澄清项。

## 停止条件

- 有多个 active change，且用户未指定要继续哪一个。
- 需求边界不清，无法判断是 bug、feature、refactor 或 research。
- 存在生产、安全、权限、数据迁移风险但没有足够上下文。

## 完成标准

- change 已进入 `.specforge/changes/active/`。
- brief 足以支撑 requirements。
- 下一步明确路由到 `specforge-spec`，或因澄清项暂停。

## 不做

- 不直接实现。
- 不跳过 requirements / design / tasks。
