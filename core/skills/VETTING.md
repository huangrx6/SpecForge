# 第三方 Skill 审查规则

`core/skills/` 只托管少量第三方 skill 快照。新增、升级或恢复已删除 skill 前，必须先完成本文件的审查。

## 当前托管清单

| Skill | 来源 | 支撑文件 | 主要风险 | 结论 |
|---|---:|---:|---|---|
| `product-brainstorming` | `anthropics/knowledge-work-plugins` | 0 | 可能把假设写成事实 | 只作为脑暴方法，结论必须等用户确认 |
| `to-prd` | `mattpocock/skills` | 0 | 可能把技术细节带入 PRD | 只归一化到 SpecForge PRD |
| `user-story-writing` | `aj-geddes/useful-ai-prompts` | 4 | 可能带入故事点 / Sprint 承诺 | 只取故事拆分和验收标准方法 |
| `pencil` | `partme-ai/full-stack-skills` | 0 | 依赖 Pencil MCP，`.pen` 不应普通读取 | 只用于 Pencil 原型读写和截图证据 |
| `web-design-guidelines` | `vercel-labs/agent-skills` | 0 | 可能变成泛泛 UI 建议 | 只用于审查清单和可验证发现 |
| `playwright-skill` | `lackeyjb/playwright-skill` | 4 | 浏览器自动化可能接触敏感数据 | 只在受控测试环境做 E2E 证据 |

## 审查步骤

1. 确认来源仓库、路径、许可证和维护状态。
2. 读取 `SKILL.md` 和声明的 support files，只保留确实会被 SpecForge 阶段读取的文件。
3. 检查是否要求执行外部发布、读取凭据、上传数据、修改第三方系统或绕过用户确认。
4. 在 `registry.json` 写清 `trigger`、`normalizeTo` 和 `doNotUseFor`。
5. 更新 `ORCHESTRATION.md`，说明它在哪个阶段、以什么边界使用。
6. 同步 starter，并运行：

```bash
node core/scripts/validate-external-skills.mjs
node core/scripts/sync-starter.mjs --check
```

## 禁止项

- 不新增“看起来可能有用”但没有明确阶段用途的 skill。
- 不把外部 skill 输出原样落进 work item 或 wiki。
- 不恢复多路 UI 生成 / Figma / getdesign / design-md / 独立竞品研究等能力，除非用户明确要求重新纳入默认流程。
- 不保存、输出、转发 Cookie、token、密码、localStorage 或 sessionStorage 敏感信息。
- 不让第三方 skill 替代用户确认、SpecForge artifact 模板或 gate evidence。
