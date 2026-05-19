# 代码智能标准

本标准回答：存量项目、大型代码库和老系统接入时，AI 应如何建立可靠项目画像。

## 核心定位

`codebase-map.mjs` 是内置保底扫描器，只负责生成 bootstrap map：

- 目录、语言、源码数量和规模判断。
- manifest、入口、API、数据、测试、运维候选。
- 是否存在代码库，以及是否可能需要 `sf-steering`。

它不做符号级理解，不解析调用链，不生成依赖图，也不替代专业索引器。

## Provider 优先级

| 优先级 | Provider 类型 | 代表工具 | 用途 |
|---|---|---|---|
| 1 | 图谱 / MCP / SCIP 类代码智能 | codebase-memory-mcp、CodeGraphContext | 大型项目主索引器，用于查询模块、符号、调用链、依赖、入口关系 |
| 2 | 模块上下文打包 | Repomix | 中型项目或已限定模块的上下文包，不用于全仓主索引 |
| 3 | 内置 bootstrap map | `codebase-map.mjs` | 小项目和所有项目的第一层粗地图 / fallback |
| 4 | 文本搜索 | `rg` | 在已限定范围内验证事实、定位定义和引用 |

SpecForge 的统一入口是：

```bash
node .specforge/core/scripts/codebase-index.mjs --json
```

该脚本负责检测本机 provider、运行 bootstrap map，并输出 normalized decision payload。它不会把第三方工具输出原样写入 wiki。

## 规模策略

| 规模 | 推荐策略 | 停止条件 |
|---|---|---|
| small | `codebase-map.mjs` + `rg` + 关键文件阅读即可 | 无 |
| medium | `codebase-map.mjs` + `rg`；有明确模块时用 Repomix 打包模块上下文；可选图谱 provider | 模块边界不清时先问用户 |
| large | 必须优先使用图谱 / MCP / SCIP 类 provider；只深入目标模块和上下游 | 无 provider 且无目标模块时暂停 |

大型项目不能靠“多读文件”解决。没有 provider 时，只能做 change-focused / bug-focused 局部理解，或停下让用户安装 provider / 指定模块。

## Wiki 归一化

无论 provider 输出多丰富，最终进入 `.specforge/wiki/*.md` 的只能是当前事实：

- 项目目标、边界、模块职责。
- 入口、API、数据、后台任务、运行和部署路径。
- 能被代码、配置、测试、CI、文档或用户确认支持的关系。
- 未确认内容写入 `risks.md`，不要混进当前事实。

禁止把 provider 的原始报告、全仓上下文包、大段代码摘要直接粘贴进 wiki。

## Provider 缺失处理

当 `codebase-index.mjs` 输出 `blocked_large_without_provider`：

1. 停止全仓扫描。
2. 询问用户是否安装 codebase-memory-mcp / CodeGraphContext，或指定目标模块、业务域、报错路径。
3. 用户指定范围后，可以用 bootstrap map + `rg` 做局部理解。
4. 后续 work item 只加载相关 wiki 和相关文件。
