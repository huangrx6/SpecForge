# 应用安全防护底线 (Security & OWASP Defenses)

## 1. 强制身份与会话边界 (Authentication & Sessions)
- **Token 保管金科玉律**：前端决不能将关键的身份凭证 (如 JWT、Session ID) 存放在可以被 JavaScript 任意读取的 `localStorage` 或 `sessionStorage` 内。
- **最佳范式**：必须通过 `HttpOnly` 且 `Secure` 的 Cookie 下发验证态，防止 XSS 攻击直接盗窃凭证。
- **暴力破解抑制**：所有涉及认证、验证码、重置密码的高危端点，必须在上层网关或者缓存层挂载坚决的访问限流 (Rate Limiting) 策略。

## 2. 授权与越权拦截 (IDOR & Broken Access Control)
- **防御水平越权**：不仅要校验用户是否登录，后端每当执行按 `id` 检索、更新或删除敏感数据资源时，必须二次确认所请求的这行数据归属权 `owner_id` 是否吻合当前请求者的会话声明。
- **防御垂直越权**：建立极其清晰的 RBAC (基于角色的权限) 体系，严禁在客户端侧通过布尔值 (如 `isAdmin: true`) 去做最终决策拦截，决策主权必须完全交由后端守卫层 (Guards / Middleware) 决断。

## 3. 注入防御机制 (Injection Mitigation)
- **防 SQL 注入**：这在现代已属于低级错误。永远严禁手动进行 SQL 字符串直接拼接拼装。无论使用何种架构，必须采用参数化绑定 (Parameterized Queries) 或是成熟的 ORM / Query Builder 体系进行查询。
- **防 XSS (跨站脚本攻击)**：
  - 现代主流框架 (React, Vue) 已经在模板插值底层提供了防御逃逸。
  - 危险区在于 `dangerouslySetInnerHTML` 和 `v-html`。若必须渲染用户输入的富文本或 Markdown，在渲染最终 HTML 前，必须经过专门的安全工具（如 `DOMPurify`、`sanitize-html`）进行白名单级别的大规模消毒净化过滤。

## 4. 传输与基础加固 (Network & Headers)
- **HTTPS 与重定向**：线上业务强关联 `Strict-Transport-Security` (HSTS) 头，废除所有明文传输可能。
- **CORS 约束**：禁止跨域资源共享配置 `Access-Control-Allow-Origin: *` 与 `Allow-Credentials: true` 同时使用，这形同裸奔。必须精准配置允许来源。
- **头盔加持**：后端必须部署安全响应头注入中间件 (如 Node.js 下的 Helmet) 屏蔽框架指纹外漏、防御点击劫持框架 (`X-Frame-Options: DENY`) 及 MIME 类型嗅探。

## 5. Design 必填问题

- 谁可以访问该能力？角色、资源归属和管理员边界是什么？
- 认证态存储在哪里？token/cookie 的过期、刷新和撤销策略是什么？
- 哪些输入会被渲染为 HTML、SQL、命令、文件路径或外部 URL？
- 是否有上传、导入、Webhook、AI prompt、富文本或 Markdown？
- 日志、错误和埋点中可能出现哪些敏感信息？

## 6. Spec Review 检查项

- 后端做最终授权，不依赖前端隐藏按钮。
- 所有外部输入有 schema、长度和格式限制。
- 富文本 / Markdown 渲染经过白名单净化。
- CORS、Cookie、CSRF、限流策略与部署方式一致。
- 日志不包含密码、token、完整身份证号、银行卡等敏感值。
