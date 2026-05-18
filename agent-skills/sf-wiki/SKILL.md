---
name: sf-wiki
description: 更新 SpecForge 项目 Wiki；用于用户要求“回写知识库、更新 wiki、同步 Wiki”，或 close 前需要把 work item 的长期事实沉淀到 .specforge/wiki/*.md 时。
---

# sf-wiki

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行后续命令。不要在 `frontend/`、`backend/` 等子目录直接运行相对 `.specforge/...` 命令。

`sf-wiki` 只维护项目当前事实，不复制 work item 过程流水账。Wiki 是项目长期记忆，不是 work item 的第二份报告。

## 启动

```bash
node .specforge/core/scripts/instructions.mjs
```

如果当前 ready artifact 是 `wiki_sync`，先创建 evidence：

```bash
node .specforge/core/scripts/create-artifact.mjs wiki_sync
```

如果 `.specforge/wiki/` 缺少基础文件，先补齐：

```bash
node .specforge/core/scripts/sync-wiki.mjs
```

## 内部技能母本

写入 wiki 前读取：

```text
.specforge/core/workflows/stages/wiki-sync/SKILL.md
```

如果本次 wiki 回写涉及设计系统、产品规则、外部调研或第三方 skill 产出的长期事实，还要读取 `.specforge/core/skills/ORCHESTRATION.md`，只沉淀已经被 SpecForge artifact 证实的稳定内容。

## Wiki 结构

每个知识项一个文件，保持当前最新状态：

```text
.specforge/wiki/
  index.md
  project-overview.md
  product-rules.md
  architecture.md
  module-<name>.md        # 按需创建，模块级架构
  api-<domain>.md         # 按需创建，接口域汇总
  design-system.md        # 按需创建，稳定 UI 组件、token、风格规则
  data-model.md
  operations.md
  decisions.md
  glossary.md
  risks.md
```

## 动作

1. 读取 active 或指定 archived work 的最终产物：
   - `00-intake/brief.md`
   - `00-intake/prd.md`（存在时）
   - `01-spec/requirements.md`
   - `01-spec/ui-design.md`（存在时）
   - `01-spec/technical-design.md`（存在时）
   - `02-spec-review/spec-review-v1.md`（存在时）
   - `03-implementation/report.md`
   - `04-code-review/code-review-v1.md`
   - `05-verification/report.md`
2. 先做“是否回写”判断：
   - 只影响一次性实现、临时日志、测试输出：写 N/A 理由，不更新 wiki。
   - 改变长期产品、架构、接口、数据、运行、设计系统、术语、风险：必须更新对应 wiki 文件。
   - 参考 implementation report 的 Wiki 回写提示、verification 的已知缺口和 technical_design 的影响面，不只凭主观判断。
3. 判断哪些事实长期有效：
   - 产品规则、角色、权限、审批、状态机。
   - 架构、模块边界、技术栈、依赖关系。
   - API、事件、Webhook、SDK 契约语义。
   - 数据模型、字段语义、生命周期、迁移注意事项。
   - 部署、启动、配置、任务调度、监控、回滚。
   - UI 设计系统、组件用法、token、风格方向。
   - Figma MCP / Pencil MCP / DESIGN.md 中已经稳定为项目规则的设计系统约定。
   - 决策、术语、风险、技术债。
4. 更新对应 `.specforge/wiki/*.md` 文件。每个知识项只保留一个当前文件；事实变化时更新原文件，不新建 v2、日期版或 work item 版文件。确需新增时按 `module-<name>.md`、`api-<domain>.md`、`design-system.md` 这类见名知意的短名。
5. 每个更新文件都保留并刷新 frontmatter：`title`、`kind`、`owner`、`last_updated`、`source_work`、`status`。
6. 更新 `.specforge/wiki/index.md` 的当前文件索引、摘要和最后同步时间。
7. 在 `06-close/wiki-sync.md` 中记录：
   - 本次是否影响 wiki。
   - 更新了哪些文件。
   - 哪些事实未更新及原因。
   - 来源 work 和证据路径。
8. 更新 wiki_sync gate：

```bash
node .specforge/core/scripts/gate.mjs wiki_sync APPROVED --evidence 06-close/wiki-sync.md
```

缺少事实证据时不要批准：

```bash
node .specforge/core/scripts/gate.mjs wiki_sync REQUEST_CHANGES
```

## 完成标准

- 每个被更新的 wiki 文件都有 frontmatter：`title`、`kind`、`owner`、`last_updated`、`source_work`、`status`。
- 同一知识项只有一个 `status: current` 文件。
- wiki 只包含当前事实；被替代的旧事实已更新或移入 `decisions.md` 的决策背景，不保留重复 current 文件。
- `index.md` 已反映最新 current 文件列表。
- `06-close/wiki-sync.md` 已写明更新或不更新原因。
- `wiki_sync` gate 状态与证据一致。

## 不做

- 不把临时日志、测试输出、截图或实现流水账复制进 wiki。
- 不创建按日期命名的 wiki 文件。
- 不用 wiki 替代 work item evidence。
