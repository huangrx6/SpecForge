# UI 设计模式路由

本文件只回答一个问题：当前 UI 需求应该走哪种设计模式，并读取哪些 reference。它不写具体页面模板，也不替代 `ui-design-process.md` 的访谈、Pencil 门禁和视觉 review。

## Design Mode

| Design Mode | 适用场景 | 设计重点 | 读取顺序 |
|---|---|---|---|
| Product UI | 后台、SaaS、配置台、数据表格、审批、运营工具、内部平台 | 任务效率、信息密度、权限、状态、可维护组件 | `ui-design-process.md` -> `admin-product-ui-contracts.md`；PC 业务系统再读 `pc-business-system-spec.md` |
| Brand Surface | 官网、landing、portfolio、品牌页、公开展示页、视觉 redesign | 品牌记忆点、首屏叙事、版式气质、视觉资产、动效边界 | `ui-design-process.md` -> 外部 `design-taste-frontend` reference |
| Hybrid | 同时包含公开展示页和管理端，例如官网 + 控制台、客户门户 + 后台 | 把展示面和工作台分开设计，避免同一套规则互相污染 | 先拆分 Product UI / Brand Surface，再分别读取对应 reference |

## 路由规则

1. 先根据用户目标、使用者、页面类型和频率判断 `Design Mode`，写入 `ui-design.md#3 UI 设计访谈与方向选择`。
2. 如果用户已明确指定模式，以用户指定为准；若与需求明显冲突，先说明冲突并请求确认。
3. 如果是 Product UI，默认以任务效率和稳定组件为先，不引入营销页 hero、大面积装饰图形、夸张动效或品牌页式留白。
4. 如果是 Brand Surface，可以读取 `design-taste-frontend` 提炼视觉气质，但仍要归一到 SpecForge 的 Visual Style Brief、页面地图、状态矩阵和 Pencil 证据。
5. 如果是 Hybrid，必须把公开展示页和管理端分开写：两套页面目标、信息密度、组件策略和状态矩阵可以不同，但品牌 token 需要说明共享或隔离关系。

## 按需 reference

| 条件 | 读取 |
|---|---|
| 管理端 / 后台 / dashboard / data table / shadcn/ui | `admin-product-ui-contracts.md` |
| PC 端业务系统、运营后台、审批台、配置台、数据管理系统 | `pc-business-system-spec.md` 和 `.specforge/core/standards/pc-ui-design-spec.md` |
| landing、品牌页、作品集、官网、公开展示页 | 外部 `design-taste-frontend` skill/reference |
| 需要创建、读取、截图或审查 `.pen` | `.specforge/core/skills/ui-ux/pencil/SKILL.md` |

## 不混用

- Product UI 不用 Brand Surface 的首屏叙事和大图装饰替代高频操作效率。
- Brand Surface 不用后台表格和筛选栏堆砌首屏价值表达。
- shadcn/ui 是 primitive / registry 层，不等于完整管理端设计系统。
- PC 业务系统规范是具体 token 和组件约束，不负责 UI 方向访谈。
