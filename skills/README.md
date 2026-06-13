# SpecForge Agent Skills

`skills/` 是对外暴露给 Agent / Skills CLI 的稳定入口层。目录名是公共 API，不能为了整理观感随意重命名；真正的内部规则、模板和工具链放在 `core/`。

## 使用分层

| 分层 | Skills | 用途 |
|---|---|---|
| Router | `sf-router`, `sf-doctor`, `sf-work` | 判断当前状态、健康检查、一键推进 |
| Project setup | `sf-onboard`, `sf-steering`, `sf-intake` | 接入项目、建立代码画像、创建 work item |
| Product / discovery | `sf-brainstorm`, `sf-discovery`, `sf-prd`, `sf-requirements` | 模糊需求、研究、PRD、可测试需求 |
| Design / technical planning | `sf-ui-design`, `sf-tech-design`, `sf-tasking`, `sf-spec-review` | UI 设计、技术设计、任务拆解、规格审查 |
| Delivery gates | `sf-implement`, `sf-code-review`, `sf-verify`, `sf-wiki`, `sf-close` | 实现、代码审查、验证、知识沉淀、关闭归档 |

## 入口选择

| 用户说法 | 优先入口 |
|---|---|
| “继续 / 自动推进 / 做完” | `sf-work` |
| “现在到哪了 / 健康吗” | `sf-doctor` |
| “新需求 / 新 bug / 帮我整理一下” | `sf-intake` |
| “先想想方案 / 有点模糊” | `sf-brainstorm` |
| “写 PRD / 需求 / 技术方案 / UI 设计” | 对应 `sf-prd` / `sf-requirements` / `sf-tech-design` / `sf-ui-design` |
| “实现 / review / 验证 / 回写 wiki / 关闭” | 对应 delivery gate skill |

## 维护规则

- 外部 skill 保持薄入口：运行目录、必读文件、启动命令、完成标准和停止条件。
- 具体阶段母本放在 `core/workflows/stages/`。
- 长期标准放在 `core/standards/`。
- 技术选择卡放在 `core/profiles/`。
- UI 设计语言和组件规范放在 `core/skills/ui-ux/design-system/`。
- 可复用脚本逻辑放在 `core/scripts/lib/` 或 `core/scripts/modules/`。

## 校验

修改任意 skill 后运行：

```bash
npm run validate:skills
npm run validate
npm run audit:framework
```

如果新增、删除或重命名 skill，必须同步：

- `core/scripts/validate-skills.mjs`
- `core/skills/ORCHESTRATION.md`
- `core/skills/README.md`
- 本文件的分层表
