---
name: sf-prd
description: 生成或更新产品需求文档；用于产品型工作项、AI 功能、后台工具、全栈应用或高层模糊需求在需求阶段前明确核心问题、目标用户、功能候选、最小可行版本边界、成功指标、风险和路线图时。
---

# sf-prd

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，必须先定位宿主项目根：项目根是“包含 `.specforge/` 目录的业务项目目录”，不是 `.specforge/` 目录本身。若当前目录是 `.specforge/` 或其任意子目录，先 `cd ..` 回到宿主项目根；若当前目录是 `frontend/`、`backend/` 等子目录，也先向上回到包含 `.specforge/` 的项目根。禁止从 `.specforge/` 内执行 `node .specforge/core/scripts/...`，否则会形成 `.specforge/.specforge/...` 的错误路径。

`sf-prd` 把简报的分析结论升级为可对齐产品、设计与工程的产品需求文档。它回答“为什么做、给谁做、第一版交付哪些价值、哪些先不做”，不替代 `sf-requirements`。需求阶段才回答“系统必须表现出哪些可测试行为、边界和验收标准”。

产品需求文档不是固定问卷。它是一份产品决策文档：先识别当前需求最可能出错的决策点，再用少量高价值问题、候选功能池和可防守假设，把模糊想法推进到可进入需求阶段的状态。

面向 B 端、运营商、大数据、AI 应用、管理后台、数据看板、驾驶舱或任务配置平台时，使用 `references/prd-authoring-guide.md#B 端运营商 / 数据产品镜头` 补充业务关键指标、部门角色、使用频率、电脑 / 移动端、数据口径、接口来源、脱敏、审批和审计问题。该镜头只补足产品事实，不把产品需求文档扩写成界面设计、接口设计或技术方案。

## 必读

- `.specforge/core/skills/prd/SKILL.md`：SpecForge 产品需求文档决策主能力包，定义阶段边界、决策状态、输出结构、转译规则、模式、质量审查和需求阶段交接。
- `.specforge/core/skills/prd/foundations/product-decision-boundary.md`：产品需求文档可以决定什么、不能决定什么，以及进入需求阶段的最小条件。
- `.specforge/core/skills/prd/references/output-contract.md`：`prd-lite / prd-standard / prd-deep` 输出契约和标准产品需求文档结构。
- `.specforge/core/skills/product/SKILL.md`：当问题空间、机会、候选功能或最小可行版本切分不清楚时，使用本地产品发现能力包。
- `references/prd-authoring-guide.md`：产品需求文档深度、本地能力包与外部参考编排、访谈镜头、模板和质量标准。
- `.specforge/core/artifacts/templates/prd.md`：写入骨架。
- `.specforge/skills/sf-brainstorm/stages/brainstorm/SKILL.md`：候选功能池和用户确认纪律。
- `.specforge/skills/sf-discovery/stages/discovery/SKILL.md`：预研 / 产品发现输入和跳过理由。
- `.specforge/core/standards/product.md`：产品需求文档决策、功能候选、最小可行版本、目标和指标。
- `.specforge/core/standards/design.md`：用户流程和体验方向。
- `.specforge/core/standards/workflow.md`：非目标、范围和中文协作。
- `.specforge/core/standards/ai-toolkit.md`：产品需求文档深度选择、输出预算、人工确认点和后续工具链衔接。
- `.specforge/core/skills/ORCHESTRATION.md`、`README.md`、`registry.json`：本地 prd / product 主能力包和外部参考 skill 的选择、边界和来源风险。

## 启动扫描

1. 运行：

```bash
node .specforge/core/scripts/status.mjs
node .specforge/core/scripts/doctor.mjs
```

2. 找到唯一 active work item；如果存在多个 active work item，先让用户指定目标，不猜。
3. 读取：
   - `00-intake/original-request.md`
   - `00-intake/brief.md`
   - `00-intake/brainstorm.md`（如果存在）
   - 已存在的 `00-intake/prd.md`（如果是更新产品需求文档）
   - `.specforge/wiki/` 中与产品、用户、业务、竞品、设计系统或既有架构相关的长期事实

## 执行序列

### A. 判断能否写产品需求文档

1. 读取 `brief.md#产品需求文档决策`，确认本工作项需要产品需求文档。
2. 读取 `brainstorm.md` 的用户确认、明确延后和未决问题。
3. 如果需要多方案取舍但没有用户确认，暂停并向用户提问。
4. 如果原始需求仍模糊且没有可追溯确认摘要，按 `references/prd-authoring-guide.md#需求摘要确认` 先输出摘要并等待用户确认，不直接写完整产品需求文档。
5. 如果目标用户、核心问题、最小可行版本边界或高风险角色/数据/AI 质量决策缺失，按 `references/prd-authoring-guide.md#自适应产品访谈` 提出少量高价值问题。

### B. 选择深度和参考输入

1. 按 `.specforge/core/skills/prd/references/output-contract.md` 和 `references/prd-authoring-guide.md#产品需求文档深度` 选择 `prd-lite / prd-standard / prd-deep`。
2. 如果问题空间、机会、候选功能或最小可行版本切分不清楚，先读取 `.specforge/core/skills/product/SKILL.md`，输出机会图、功能池、最小可行版本建议和产品需求文档交接。
3. 如需外部参考，按 `references/prd-authoring-guide.md#本地能力包与外部参考编排` 选择 `create-prd` 或 `opportunity-solution-tree`；它们只能作为参考，不能替代本地 `prd` / `product`。
4. 第三方输出只作为候选和检查视角，必须归一化到 SpecForge 产品需求文档结构。

### C. 裁剪候选和写产品需求文档

1. 先整理候选功能池，不直接替用户定最小可行版本。
2. 拆分“最小可行版本 / 可选增强 / 后续版本”，写清非目标。
3. 使用 `.specforge/core/artifacts/templates/prd.md`、`.specforge/core/skills/prd/references/output-contract.md` 或 `references/prd-authoring-guide.md#产品需求文档模板` 写入 `00-intake/prd.md`。
4. 没有内容的章节写“无”并说明原因，不留空。
5. 填写产品决策门禁：产品需求文档深度、输出预算、最小可行版本确认、高影响未决问题和是否可进入需求阶段。
6. 可进入需求阶段时，把决策状态写为 `approved-for-requirements`；否则写 `needs-decision` 并暂停。

### D. 回写 brief 和路由

产品需求文档完成后，回写或补充 `00-intake/brief.md`：

- 功能候选池。
- 用户选择。
- 影响面矩阵。
- 组件标记推荐。
- 待澄清项。
- 是否需要产品需求文档：是
- 产品需求文档深度：`prd-lite / prd-standard / prd-deep`

不要让 `brief.md` 和 `prd.md` 在最小可行版本、非目标、组件标记上互相矛盾。

## 判定表

| 条件 | 状态 |
|---|---|
| 多个 active work item | 停止：请用户指定目标 |
| `brief.md#产品需求文档决策` 不需要产品需求文档 | 停止：跳过本阶段，简报已标记跳过理由 |
| 需要多方案取舍但缺少 `brainstorm.md` 或用户确认记录 | 停止：需先完成方向取舍 |
| 目标用户、核心问题或最小可行版本功能边界无法确认 | 停止：提问澄清 |
| 成功指标完全缺失，且无法安全给出默认指标 | 停止：提问 |
| 存在产品方向、角色权限、合规/数据风险或 AI 质量目标冲突 | 停止：等待用户或业务负责人决策 |
| 用户要求产品需求文档直接替代需求规格、界面设计或技术设计 | 停止：说明边界 |

## 完成标准

- `00-intake/prd.md` 存在且内容足以支撑 `sf-requirements`。
- 决策状态为 `approved-for-requirements`，或者明确标记为 `needs-decision` 并暂停。
- 功能边界、非目标、成功指标、风险和路线图已有用户确认或明确默认假设。
- 产品决策门禁明确说明产品需求文档是 `prd-lite`、`prd-standard` 还是 `prd-deep`，以及为什么。
- 产品型需求的功能候选池已经裁剪为最小可行版本、可选增强和后续版本。
- AI 功能已经写明评估策略、人工兜底、安全隐私和成本边界。
- `brief.md` 已同步，所有 `[NEEDS ... DECISION]` 已清除。
- 完成后运行 `node .specforge/core/scripts/instructions.mjs`，将输出展示给用户，让用户知道当前流程的下一步是什么。

## 不做

- 不写技术方案。
- 不写接口契约、错误处理、边界条件或工程实现细节；这些进入需求阶段或技术设计阶段。
- 不把用户故事里的验收种子包装成最终需求规格；必须交给 `sf-requirements` 转译。
- 不替用户做关键产品决策；可以给推荐方案，但要标明假设并等待确认。
- 不把延后功能列入最小可行版本。
