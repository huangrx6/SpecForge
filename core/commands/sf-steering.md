# /sf-steering

用于存量项目或大型代码库接入后建立项目画像。

```bash
node .specforge/core/scripts/codebase-index.mjs --json
node .specforge/core/scripts/codebase-index.mjs --write-report
```

然后读取：

```text
.specforge/core/workflows/stages/steering/SKILL.md
```

输出应包含：

- 代码库规模判断。
- 已确认模块和入口。
- 需要更新的 `.specforge/wiki/*.md`。
- 下一步路由到 `sf-intake` 或暂停等待用户确认。
