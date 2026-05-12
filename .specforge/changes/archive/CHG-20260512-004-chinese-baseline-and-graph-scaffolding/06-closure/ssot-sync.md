# SSoT Sync

## 本变更是否影响项目 SSoT？

Yes.

## 已更新文件

- `.specforge/project/constitution.md`
- `.specforge/project/glossary.md`
- `.specforge/project/risks.md`
- `.specforge/project/engineering/architecture.md`
- `.specforge/project/engineering/validation-model.md`
- `.specforge/project/product/feature-list.md`

## 契约变化

- `new:change` 现在只创建控制面和 intake。
- 新增 `new:artifact` 作为 artifact graph 驱动的产物生成入口。
- validate 支持 active incomplete，但 archive 必须完整。
- 核心人类可读内容进一步中文化。

## 需要下游重新验证

- 后续 workflow schema 变更。
- 后续 CLI 化。
- 后续中文化历史 archive。

## 未更新原因

不适用。

## 备注

历史 archive 内容未做全量中文迁移，避免改写已归档证据。
