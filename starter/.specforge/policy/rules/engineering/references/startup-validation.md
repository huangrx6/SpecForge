# 开发环境启动验证清单 (Dev Startup Validation)

> 这是解决 "代码写好了但跑不起来" 这个高频问题的系统性防线。

## 为什么这是强制规则
对话历史数据表明，缺少启动验证导致的问题（端口冲突、缺依赖、环境变量未配、DB 未迁移）
占整个开发调试时长的 20~40%。"我以为可以跑"不算验证证据。

## 启动验证强制检查项（每次 implementation 完成后执行）

### 通用项
- [ ] **端口可用**：`lsof -i :<PORT>` 确认目标端口没有被占用。
- [ ] **环境变量完整**：对比 `.env.example` 和 `.env`，无遗漏的必填变量。
- [ ] **依赖已安装**：`npm install` / `pip install -r requirements.txt` / `uv sync` 最新执行无报错。

### 前端项目
- [ ] `npm run dev` 启动无报错。
- [ ] 浏览器访问 `http://localhost:<PORT>` 首页可以加载（不是 404 / 白屏）。
- [ ] `npx tsc --noEmit` 执行无类型错误。

### 后端项目
- [ ] 数据库迁移已执行：`alembic upgrade head` / `python manage.py migrate` / `npx prisma migrate dev`。
- [ ] 健康检查端点响应正常：`curl http://localhost:<PORT>/health` 返回 `{"status":"ok"}`。
- [ ] 后端日志无 `ERROR` / `CRITICAL` 级别异常。

### 全栈项目
- [ ] 前后端均已单独验证（先后端冒烟，再前端冒烟）。
- [ ] 前端 API 代理配置指向正确的后端地址（`vite.config.ts` 或 `.env.NEXT_PUBLIC_API_URL`）。
- [ ] 执行一次"登录"操作确认前后端联通性完整，不仅靠健康端点。

## 结果记录
以上验证结果必须以清单形式写入 `03-implementation/report.md` 的"启动验证"章节。
凡验证未通过项，必须立即修复，不允许带着 `ERROR` 状态提交 code_review gate。
