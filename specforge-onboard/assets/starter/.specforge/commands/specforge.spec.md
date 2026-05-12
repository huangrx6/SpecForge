# specforge.spec

为 change 生成或更新 `01-spec` 产物。

## 读取

- 当前 `change.yaml`
- `00-intake/brief.md`
- `.specforge/templates/requirements.md`
- `.specforge/templates/design.md`
- `.specforge/templates/tasks.md`

## 写入

- `01-spec/requirements.md`
- `01-spec/design.md`
- `01-spec/tasks.md`

## 生成命令

```bash
node .specforge/tools/create-artifact.mjs requirements
node .specforge/tools/create-artifact.mjs design
node .specforge/tools/create-artifact.mjs tasks
```

## Gate

standard workflow 下必须继续生成 `02-spec-review/spec-review-v1.md`。
