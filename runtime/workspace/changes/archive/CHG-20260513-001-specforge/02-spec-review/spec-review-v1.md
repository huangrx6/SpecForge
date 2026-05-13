# Spec Review

Status: APPROVED

## Checklist

- [x] 分析深度档位匹配复杂度，且 `brief.md` 记录了需求理解、代码探索、外部研究 / 跳过理由、澄清记录和分析综合。
- [x] Requirements 可测试且无歧义。
- [x] 产品 / 功能候选已展开，并记录用户选择或明确默认假设。
- [x] `[NEEDS CLARIFICATION]` 已解决或明确接受。
- [x] 边界清楚。
- [x] 非目标明确。
- [x] 验收标准有验证路径。
- [x] 有用户可见页面时，design 包含页面地图、用户流程、线稿 / 原型、视觉方向和交互状态。
- [x] 技术栈、组件库、编辑器、数据层和测试方案已引用 profile 或写清偏离理由。
- [x] 高风险默认选择已被显式确认，例如无认证后台、公网部署、危险 HTML 渲染、数据迁移。
- [x] 非 light 变更已展示实施计划或等价 spec review 证据，用户确认或默认假设可追溯。
- [x] Workflow 选择匹配任务规模。

## Findings

- [RESOLVED] 用户指出 `/Users/huangrx6/workspace/specforge` 没有真实目录变化，意图是继续实施目录重组，而不是只生成 spec。按已讨论方案进入 implementation：`sf` / `sf-*` 作为新技能名，源码母本改为 `runtime/`，业务项目仍输出 `.specforge/`，starter 扁平化，hooks 默认 noop + 项目覆盖。旧 `specforge` / `specforge-*` 是否保留为安装兼容入口，在实现中优先通过文档和 package 兼容处理，不阻断首轮迁移。

- [P1] 实现前必须先做路径抽象，再移动目录。仓库中存在大量硬编码 `.specforge/*`、`specforge-*`、`bin/specforge.mjs` 和 `specforge-onboard/assets/starter/.specforge` 引用；如果直接搬目录，doctor、onboard、skill install 和 starter sync 很容易同时断。

- [P1] `runtime/workspace/changes` 只能作为空模板 / 母本结构，不能承载 SpecForge 仓库当前 active change。tasks 已把这个点拆成 T005/T011/T012，但实现阶段必须重点防止把 `.specforge/changes/active/CHG-20260513-001-specforge` 复制进 starter。

- [P2] `commands/` 和 `hooks/` 的语义已清楚，但还需要在实现时用最小可运行闭环证明：slash command card 只做用户入口映射；hook loader 支持默认 noop、项目覆盖、pre 阻断和 post strict/non-strict 两种行为。

## Decision

APPROVED

Implementation notes:

1. 按 tasks 的 P0 -> P1 -> P2 -> P3 顺序执行，先让工具识别新布局，再搬迁目录。
2. 保留根级 `README.md` / `AGENTS.md` / `CLAUDE.md` 作为轻量入口 shim，完整维护者文档迁入 `docs/`。
3. 任何安装脚本和 starter 生成逻辑必须保证业务项目仍只创建 `.specforge/`。
