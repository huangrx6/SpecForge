---
name: discovery
description: SpecForge 内部 discovery 路由技能。用于将原始请求判断为无需 spec、单 change、多 change、扩展已有 change 或混合路线。
---

# Discovery Skill

用于作为新工作的路由入口。

Discovery 是路由器，不是自动执行器。它判断请求是不需要 spec、需要一个 change、需要多个 changes，还是需要 initiative。然后写入足够的持久上下文，保证下一步可以恢复，不需要重新解释请求。

## 输入

- 原始请求
- `.specforge/registry.yaml`
- 相关 `.specforge/project/` SSoT 文件
- boundary、context、spec-quality 规则

## 输出文件

- `00-intake/original-request.md`
- `00-intake/brief.md`
- 多 change 拆解时可输出 `00-intake/roadmap.md`

## 路由结果

| Outcome | 含义 | 默认下一步 |
|---|---|---|
| `NO_SPEC_NEEDED` | 足够小，可直接实现 | 直接实现并验证 |
| `SINGLE_CHANGE` | 一个有边界的 change 可独立交付 | 创建一个 active change |
| `MULTI_CHANGE` | 工作应拆成多个独立 changes | 创建 roadmap，再创建 changes |
| `EXTEND_EXISTING` | 工作属于已有 active change | 更新该 change |
| `MIXED` | 部分扩展已有工作、部分需要新 change、部分可直接实现 | 先写拆解计划 |

## 完成标准

- 范围和非目标明确。
- 候选边界已命名。
- 建议 workflow 有理由。
- 歧义用 `[NEEDS CLARIFICATION: question]` 标记。
- 下一步可执行，而不是泛泛描述。
