---
name: sf-steering
description: 为存量项目或大型代码库建立 SpecForge 项目画像；用于新需求或 bugfix 前理解现有架构、刷新 wiki、生成后续 work item 的上下文基线。
---

# sf-steering

## 运行目录

执行任何 `node .specforge/...` 命令或读取 `.specforge/...` 文件前，先从当前目录向上找到包含 `.specforge/` 的项目根，并在该目录执行。不要在 `frontend/`、`backend/` 等子目录直接运行相对路径命令，除非该子目录就是独立仓库根。

`sf-steering` 用来理解存量项目。它不写业务代码，也不创建普通需求产物；它先建立可复用的项目画像，并把稳定事实回写到 `.specforge/wiki/*.md`。后续 `sf-intake`、`sf-requirements`、`sf-tech-design`、`sf-implement` 才能基于这些事实做新需求、bugfix 或重构。

## 何时触发

- 已有项目刚接入 SpecForge，`.specforge/wiki/architecture.md` 仍是空模板。
- 用户说“先理解这个项目 / 扫描项目 / 项目画像 / 架构地图 / 存量项目 / 老项目”。
- 新需求或 bugfix 会触碰既有模块，但 wiki 中没有对应模块、API、数据或运行事实。
- 项目较大，不能靠一次性读取所有文件来理解。
- wiki 明显过期，和当前代码实现冲突。

## 启动检查

```bash
node .specforge/core/scripts/doctor.mjs
node .specforge/core/scripts/codebase-map.mjs --json
```

读取内部阶段母本：

```text
.specforge/core/workflows/stages/steering/SKILL.md
```

`codebase-map.mjs` 的输出只作为第一层地图，不等于结论。结论必须来自代码、配置、测试、CI、现有文档或用户确认。

## 工作模式

按代码规模和用户目标选择模式：

| 模式 | 适用场景 | 处理方式 |
|---|---|---|
| `baseline-lite` | 小项目，代码量少，模块清晰 | 读取入口、配置、主要模块、测试和部署文件，直接更新核心 wiki |
| `baseline-standard` | 中型项目或普通存量项目首接入 | 先按模块分层扫描，再更新项目概览、架构、数据、运行、风险 |
| `baseline-deep` | 大型项目、单体遗留系统、多服务仓库 | 不读全量文件；按目录、语言、入口、依赖、API、数据、测试、部署逐层建立地图，并分批更新 wiki |
| `change-focused` | 用户已有明确新需求 | 只理解相关模块和上下游，输出“本次变更上下文基线”，再路由 `sf-intake` |
| `bug-focused` | 用户已有异常或 bug | 先理解复现路径、调用链、相关模块、日志和测试，再路由 `sf-intake` 或 `sf-discovery` |

## 大项目策略

不要把大型仓库直接打包进上下文。采用四层策略：

1. **仓库地图层**：用 `codebase-map.mjs` 识别语言、目录、入口、API、数据、测试、部署候选。
2. **模块事实层**：每次只读一个模块的入口、公共接口、核心模型、测试和配置。
3. **关系层**：梳理模块之间的调用、数据流、事件流、任务流和权限边界。
4. **任务上下文层**：针对后续需求或 bug，只加载相关 wiki + 相关文件，不重新扫描全仓库。

成熟开源工具的做法可以作为参考：Aider 的 repo map、Repomix/Gitingest 的代码打包、CodeGraphContext/repowise 的图谱与 MCP 检索、RepoAgent 的文档生成。但在 SpecForge 中，外部工具输出只能作为证据来源，最终必须改写成 `.specforge/wiki/*.md` 的当前事实。

## 写入 wiki

根据实际发现更新这些文件；不需要的文件保持不动：

| 文件 | 写入内容 |
|---|---|
| `.specforge/wiki/project-overview.md` | 项目目标、主要用户、核心能力、边界 |
| `.specforge/wiki/architecture.md` | 架构形态、服务/模块划分、入口、关键依赖 |
| `.specforge/wiki/module-<name>.md` | 单个模块职责、入口、依赖、关键文件、测试位置 |
| `.specforge/wiki/api-<domain>.md` | API 域、路由、请求响应、鉴权、错误约定 |
| `.specforge/wiki/data-model.md` | 数据库、核心表/模型、迁移、索引、数据生命周期 |
| `.specforge/wiki/operations.md` | 本地启动、构建、测试、部署、CI、环境变量 |
| `.specforge/wiki/decisions.md` | 已确认的架构或产品决策 |
| `.specforge/wiki/glossary.md` | 领域术语、缩写、系统内命名 |
| `.specforge/wiki/risks.md` | 技术债、风险点、未知区、需用户确认项 |
| `.specforge/wiki/index.md` | 当前 wiki 索引和摘要 |

Wiki 只保留当前事实。不要按日期、版本或 work item 复制多份同类文档。

## 输出给用户

完成后输出：

- 本次选择的模式。
- 代码库规模判断：small / medium / large。
- 已更新的 wiki 文件。
- 已确认的关键模块和入口。
- 尚未确认的业务含义或风险。
- 下一步建议路由：通常是 `sf-intake`；如果用户只是要求项目画像，则停在这里。

## 停止条件

- `codebase-map.mjs` 显示仓库过大或多仓库混合，但用户没有给出目标模块或业务域。
- 代码事实和现有 wiki / 文档冲突，无法判断哪个是当前事实。
- 需要业务 owner 确认术语、权限、流程或上线规则。
- 发现安全、数据迁移、生产配置风险，但没有足够权限或证据继续判断。

## 完成标准

- `.specforge/wiki/` 至少包含当前项目概览和架构概览。
- 大型项目至少有相关模块级 wiki，而不是只有笼统总结。
- 后续 `sf-intake` 能引用 wiki 判断影响面，不必重新理解全仓库。
- 未确认内容写入 `risks.md` 或在输出中列为待确认，不混入当前事实。

## 不做

- 不直接实现新需求或修 bug。
- 不创建 PRD、requirements、technical_design 或 tasks。
- 不把外部工具生成的大段原文直接写入 wiki。
- 不因为扫描到文件就推断业务含义；无法确认就标为未知。
