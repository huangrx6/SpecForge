---
name: specforge-review
description: 执行 SpecForge 的 spec_review 或 code_review gate；用于 ready artifact 是 spec_review/code_review，或用户要求审查当前 change 时。
---

# specforge-review

执行门禁审查。审查是 gate，不是顺手补实现。

## 判定 review 类型

运行：

```bash
node .specforge/tools/instructions.mjs
```

- ready artifact 为 `spec_review`：审查 requirements / design / tasks。
- ready artifact 为 `code_review`：审查 implementation 是否符合已批准规格。

## 关联规则

- `.specforge/rules/gates.md`：gate 状态和 evidence。
- `.specforge/rules/boundaries.md`：范围和写入边界。
- `.specforge/rules/spec-quality.md`：规格审查。
- `.specforge/rules/security.md`：安全敏感检查。
- `.specforge/rules/testing.md`：验证证据是否匹配风险。

## spec_review 检查

- requirements 可测试且无歧义。
- design 能追踪到 requirements。
- tasks 有边界、依赖和验证。
- 非目标明确。
- 验收标准可执行。

## code_review 检查

- 实现未偏离 approved spec。
- 未改批准范围外文件。
- 没有密钥或明文凭据。
- 没有无依据的大抽象。
- 测试或验证证据匹配风险。
- 已识别 SSoT 影响。

## 动作

1. 生成对应 review artifact。
2. 写 findings，按严重程度排序。
3. 决策为：
   - `APPROVED`
   - `REQUEST_CHANGES`
   - `REJECTED`
4. APPROVED 时更新 gate：

```bash
node .specforge/tools/gate.mjs <gate> APPROVED --evidence <path>
```

## 完成标准

- review 文件有明确 decision。
- gate 状态与 review decision 一致。
- `REQUEST_CHANGES` 必须指出回到哪个 artifact。

## 不做

- 不用空泛“看起来没问题”批准 gate。
- 不在 review 阶段顺手改实现。
