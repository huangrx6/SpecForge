# 生成产物

`specforge-onboard/assets/starter/.specforge/` 是由根目录 `.specforge/starter.manifest.json` 生成的自包含发行快照，不是源码母本。

保留这个目录的原因是：`specforge-onboard` 作为独立 skill 安装后，可能只能访问自己的 skill 目录；starter 快照让它在离线或没有 npm CLI 的环境中仍可完成初始化。

不要手工修改 `assets/starter/.specforge/`。需要更新 starter 时，修改根 `.specforge/` 母本或 `.specforge/starter.manifest.json`，然后运行：

```bash
npm run sync:starter
npm run check:starter
```
