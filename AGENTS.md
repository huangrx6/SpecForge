# SpecForge Agent 导航

SpecForge 是一套仓库原生的规范驱动开发协议，以根级 Agent Skills bundle 的形式分发。根目录下的 `specforge` 和 `specforge-*` 是可安装技能；`.specforge/` 是这些技能依赖的运行时、starter 资产、规则、模板、工具和项目知识库。

## 开发 SpecForge 仓库本身时

当你修改本仓库时，要把它同时视为产品本体和自举实践项目。

- `specforge/` 是根路由技能，只负责扫描项目状态并路由到一个生命周期技能。
- `specforge-*` 是生命周期技能，每个技能只处理一个阶段。
- `.specforge/tools/` 是运行时命令层。修改工具时，能覆盖的部分应同步补充或运行 `node .specforge/tools/self-test.mjs`。
- `.specforge/schemas/standard.json` 是标准工作流的 artifact graph。
- `.specforge/templates/` 负责把 artifact 输出映射到可编辑模板。
- `.specforge/skills/` 是内部技能库。阶段规则变化时，先改内部 `SKILL.md`，再同步对应根级技能。
- `.specforge/knowledge/` 是长期知识源，只记录跨 change 仍然有效的产品、架构、术语、风险和决策。
- `.specforge/changes/archive/` 是历史证据。除非用户明确要求迁移或修复历史，不要改写归档 change。

框架改动后建议运行：

```bash
node .specforge/tools/self-test.mjs
node .specforge/tools/validate-skills.mjs
node .specforge/tools/validate-structure.mjs
node .specforge/tools/doctor.mjs
```

## 在业务项目中使用时

业务仓库接入 SpecForge 后，只应新增和维护一个项目内目录：

```text
.specforge/
├── AGENTS.md
├── attention.md
├── manifest.yaml
├── registry.yaml
├── rules/
├── workflows/
├── schemas/
├── templates/
├── tools/
├── knowledge/
└── changes/
    ├── inbox/
    ├── active/
    └── archive/
```

业务项目内的 `.specforge/AGENTS.md` 是本地运行时权威入口，它定义该项目的加载顺序和边界约束。

## 加载顺序

1. 读取当前用户请求，以及更高优先级的系统 / 开发者指令。
2. 读取 `.specforge/attention.md`。
3. 读取 `.specforge/manifest.yaml`。
4. 读取 `.specforge/registry.yaml`。
5. 如果有且只有一个 active change，读取它的 `change.yaml`。
6. 自动推进或高风险操作前，运行 `node .specforge/tools/doctor.mjs`。
7. 运行 `node .specforge/tools/instructions.mjs` 判断下一个 ready artifact。
8. 只加载当前 artifact 需要的 rules、templates 和 knowledge。

## 工作流状态机

标准流程由 artifact graph 驱动，不依赖聊天记忆：

```text
intake -> requirements -> design -> tasks -> spec_review gate
-> implementation -> code_review gate -> verification gate
-> ssot_sync gate -> closure -> archive
```

图定义在 `.specforge/schemas/standard.json`。当前 change 状态保存在 `.specforge/changes/active/<change-id>/change.yaml`。`registry.yaml` 只是索引，不是完整事实源。

## 门禁纪律

必需门禁记录在 `change.yaml` 中，并且必须绑定证据文件：

- `spec_review`：证据在 `02-spec-review/spec-review-v1.md`
- `code_review`：证据在 `04-code-review/code-review-v1.md`
- `verification`：证据在 `05-verification/report.md` 或 `05-verification/ci-result.md`
- `ssot_sync`：证据在 `06-closure/ssot-sync.md`

必需门禁未处于 `APPROVED`，或证据文件不存在时，不得进入下游阶段。用户口头认可可以作为上下文，但不能代替门禁证据。

## 路由规则

- 没有 `.specforge/`：使用 `specforge-onboard`。
- 没有 active change，且用户提出新功能、bug 或重构：使用 `specforge-intake`。
- 下一个 ready artifact 是 requirements、design、tasks 或 spec review：使用 `specforge-spec`。
- spec review 已批准且 apply ready：使用 `specforge-implement`。
- 下一个 ready artifact 是 spec review 或 code review：使用 `specforge-review`。
- code review 已批准：使用 `specforge-verify`。
- verification 已批准且 closure 仍未完成：使用 `specforge-close`。
- 用户明确要求自动推进：使用 `specforge-work`，但仍要在未解决 gate、失败检查、高风险操作或澄清项处停止。

## 边界约束

- 业务代码留在业务项目源码目录，不放进 `.specforge/`。
- 动态 change 证据放在 `.specforge/changes/active/<change-id>/`。
- 长期事实放在 `.specforge/knowledge/`。
- 规则应稳定、可复用，不要把一次性 change 报告粘进 `.specforge/rules/`。
- 除非用户要求历史或回归证据，不要把 archived change 当作当前上下文读取。
- 如果实现需要扩大已批准写入范围，先停下来更新 spec 或询问用户。
