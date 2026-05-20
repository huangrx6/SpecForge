# SpecForge Project Runtime

本目录是业务项目内 `.specforge/` 的运行时入口。业务代码留在项目源码中，`.specforge/` 负责保存规范、工具链、项目知识和工作项证据。

## Golden Rule (黄金法则)
**先理解，再行动。** 绝不修改不理解的代码，绝不删除无法解释的代码，绝不推进未准备好的阶段。不确定就立即询问用户。

## 核心实现节奏 (GSD 循环)
对每个开发任务，遵循以下极简 5 步：
1. **理解 (Understand)**：精读需求与代码。
2. **计划 (Plan)**：规划变更影响，杜绝过度设计。
3. **实现 (Implement)**：编写最精简代码，严禁边修 bug 边重构。
4. **验证 (Verify)**：**每步修改后立即运行验证 (build + test)**，绝不累积验证。
5. **提交 (Commit)**：留下常规格式的原子化 Git 提交。

> [!WARNING]
> 对同一技术难题连续尝试修复 **3 次** 失败后，必须立即停止并联系用户汇报。

---

## 启动与加载顺序
1. **读取状态**：读取 `.specforge/AGENTS.md`、`manifest.yaml`、`registry.yaml`。若有活跃工作项，则加载其 `work.yaml`。
2. **就绪判定**：运行 `node .specforge/core/scripts/instructions.mjs` 获取当前 ready artifact 与推荐技能。
3. **按需加载**：根据当前阶段，只加载对应所需的 `core/standards/` 规则与 wiki 事实。

---

## 领域标准地图 (仅在对应阶段按需读取)
详细的流程图、命名规范、Gate 纪律和归档约束，请查阅 `core/standards/workflow.md`。

| 标准文件 | 适用阶段 / 模块 | 核心回答问题 |
|---|---|---|
| `core/standards/workflow.md` | intake、流程、gate、边界、归档 | 流程怎么走，门禁怎么过，边界在哪 |
| `core/standards/product.md` | intake、PRD、requirements | 用户想要什么，如何定义验收标准 |
| `core/standards/design.md` | ui_design (有 UI 变更时) | 界面如何交互，状态矩阵是否覆盖 |
| `core/standards/engineering.md` | technical_design、实现、review、验证 | 架构怎么设计，代码怎么安全实现与测试 |
| `core/standards/code-intelligence.md` | steering (新项目画像) | 存量大代码库如何快速定位与理解 |
| `core/standards/wiki.md` | wiki_sync、closure | 哪些项目事实需要沉淀为长期知识 |

---

## 技能分类导航 (根据任务场景按需执行)

### 1. 核心技能 (每个工作项的生命周期必经之路)
- `sf-intake`：接单并初始化工作项 (生成 `work.yaml` 与 brief)。
- `sf-requirements`：产出可测试的详细需求规格书。
- `sf-implement`：依照任务拆分逐步编写代码。
- `sf-verify`：通过 Playwright E2E 或单元测试提供完整验证证据。
- `sf-close`：编写 release/rollback，归档工作项并清理分支。

### 2. 辅助技能 (按阶段或业务特性按需触发)
- `sf-prd`：当 brief 决策需要时，进行 Socratic 访谈并生成 PRD。
- `sf-discovery` / `sf-tasking`：进行深入技术调研，或将大需求拆解为任务。
- `sf-ui-design` / `sf-tech-design`：设计 Pencil 交互原型，或进行系统架构设计。
- `sf-spec-review` / `sf-code-review`：分别在实现前后对设计规格和代码成果做严格把关。
- `sf-wiki`：将本次工作项沉淀的长期事实（如数据模型、API 等）回写至 wiki 库。

### 3. 系统维护技能 (维护与诊断)
- `sf-router` / `sf-work`：自动检测工作项状态并路由到相应动作。
- `sf-doctor` / `sf-onboard`：用于 `.specforge` 项目健康诊断与新系统配置。
- `sf-steering`：用于对未知的大型/存量代码库进行首次基线画像扫描。
