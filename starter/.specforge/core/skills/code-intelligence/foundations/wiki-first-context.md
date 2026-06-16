# Wiki-first Context

代码智能不是日常 work item 的第一入口。已有 Wiki 时，先从项目知识库定位范围，再用 provider 或 `rg` 验证。

## 默认顺序

1. 读取 `.specforge/wiki/00-index.md`。
2. 读取相关知识项：项目概览、架构、模块、对外接口、数据模型、配置、权限、任务事件、运行与风险。
3. 从 Wiki 提取 bounded context：入口路径、关键符号、API、数据读写、测试位置、运行命令和风险。
4. 在 bounded context 内使用 CodeGraph、Repomix、bootstrap map、`rg` 或文件阅读。
5. 如果 Wiki 缺失、过期或与代码冲突，路由 `sf-steering` 刷新，不在普通阶段临时全仓探索。

## 阶段约束

- `sf-intake`：只把定位结果写成 brief 的 code context；不刷新全仓 Wiki。
- `sf-requirements`：只验证现有行为和边界；不让 CodeGraph 直接生成需求。
- `sf-tech-design`：可深度使用 impact / callers / callees，但必须围绕本次影响面。
- `sf-code-review`：围绕真实 diff 查影响面和受影响测试。
- `sf-verify`：用 impact / affected tests 决定验证范围。
- `sf-wiki` / `sf-close`：只把已验证的稳定事实写回长期 Wiki。

