# 技术选择卡

`profiles/` 只回答一个问题：本次技术设计选什么技术组合，为什么选，边界是什么。质量标准不放在这里，统一放在 `core/standards/`。

## 目录

```text
profiles/
├── frontend/       # 前端主栈
├── backend/        # 后端主栈
├── database/       # 持久化选择
└── capabilities/   # 横向能力卡
```

## 使用方式

`technical-design.md` 必须填写 `Tech Profile Selection`：

| 维度 | 选中 profile | 采用范围 | 选择理由 | 偏离 / 替代 |
|---|---|---|---|---|
| Frontend | `frontend/react-vite-tailwind-ts` | full | 内部工具、纯 SPA、交互密集 | 不选 Next.js，避免 SSR 复杂度 |
| Database | `database/rdbms-postgresql` | full | 事务、复杂查询、JSON 支持 | 无 |
| Capability | `capabilities/processing-ai-jobs` | partial | 文件上传、批处理、LLM 调用 | 并发限制由需求决定 |

## 选择顺序

1. 先判断本次是否真的需要 profile；纯文案、纯配置、小 bugfix 可写 N/A。
2. 主栈只在受影响时选择：Frontend、Backend、Database。
3. 横向能力按需选择：内容编辑、文件处理、AI 调用、任务调度、可观测性、测试、安全等。
4. 如果项目已有技术栈，以 `.specforge/wiki/architecture.md` 为准；profile 只用于确认是否沿用或偏离。
5. 使用 profile 之外的关键技术，必须写偏离原因、风险和验证方式。

## 分类原则

| 目录 | 放什么 | 不放什么 |
|---|---|---|
| `frontend/` | React / Vue / Next 等前端主栈 | UI 设计规则、视觉风格 |
| `backend/` | FastAPI / Spring Boot / Go / Next API 等后端主栈 | API 质量标准 |
| `database/` | PostgreSQL / MySQL / SQLite 等存储选择 | 具体项目表结构 |
| `capabilities/` | 可组合能力：内容编辑、架构模式、安全、测试、观测、任务、AI | 长篇规范、一次性实现计划 |

## 维护规则

- 每张 profile 控制在“选择卡”粒度，避免写成教程。
- 文件名要表达技术或能力，不要用泛词。
- 不为了热门技术新增 profile；只有可复用选择条件时才新增。
- standards 变化不复制到 profiles；profiles 只链接相关标准。
