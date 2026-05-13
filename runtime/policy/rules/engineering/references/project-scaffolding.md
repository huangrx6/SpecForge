# 新项目脚手架铁律 (Project Scaffolding First)

## 核心原则
**新项目或新子模块的第一步永远是使用官方脚手架工具构建骨架，绝对禁止从一个空目录手写 `package.json` / `pyproject.toml` / `requirements.txt` / `go.mod` 等构建文件。**

这是大型科技公司工程效率团队的一致要求，也是防止漂移（Drift）与团队共识成本的关键防线。

## 前端脚手架（必须先执行，再开始写业务代码）

| 技术栈 | 初始化命令 |
|---|---|
| Next.js (App Router) | `npx create-next-app@latest ./ --typescript --tailwind --app --eslint` |
| React + Vite (SPA) | `npm create vite@latest ./ -- --template react-ts` |
| Vue 3 + Vite (SPA) | `npm create vite@latest ./ -- --template vue-ts` |
| Nuxt 3 | `npx nuxi@latest init ./` |

初始化后，必须立即执行以下验证命令确认骨架健康后，再写任何业务代码：
```bash
npm install
npm run dev     # 验证开发服务器可正常启动
npm run build   # 验证生产构建无错误
npx tsc --noEmit  # 验证 TypeScript 类型无错误
```

## 后端脚手架

| 技术栈 | 初始化命令 |
|---|---|
| FastAPI + UV | `uv init && uv add fastapi uvicorn sqlalchemy alembic` |
| Spring Boot | `spring init --dependencies=web,jpa,security --language=java ./` |
| Go (standard layout) | `go mod init <module-path> && mkdir -p cmd/api internal/{domain,repository,service}` |
| Django | `django-admin startproject config . && python manage.py startapp core` |

## 项目初始化后的立即验证清单
Agent 必须在脚手架初始化完成后立刻执行 "开发服务器冒烟验证"：
1. 启动开发服务器，确认无报错。
2. 在浏览器或 curl 中请求首页/健康接口，确认可以访问。
3. 只有冒烟通过，才允许开始写第一行业务代码。

这一步的验证结果必须写入 `03-implementation/plan.md` 的首条记录中。

## 环境依赖声明铁律
- Python 必须使用 `venv` 或 `uv` 隔离，严禁在系统 Python 全局安装业务依赖。
- Node.js 项目必须使用明确的 `engines` 字段锁定版本范围。
- 新增的环境变量必须同步到 `.env.example`。
