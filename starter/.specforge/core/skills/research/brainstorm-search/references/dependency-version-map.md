# Dependency Version Map

本文件用于 `brainstorm-search` 中的版本依赖关系查证。它不替代 `sf-tech-design` 的最终版本锁定；它负责在 brainstorm 阶段发现会影响方案取舍的版本关系、兼容风险和后续 technical design 必须处理的证据。

## 边界

| 阶段 | 负责 | 不负责 |
|---|---|---|
| `brainstorm-search` | 发现版本关系风险：直接依赖、peer deps、runtime / engine、lockfile、transitive deps、breaking changes、override / resolution 需求 | 最终锁定版本、修改 lockfile、决定迁移方案 |
| `sf-tech-design` | 基于证据锁定版本、确认新增依赖、写兼容策略、升级 / 回滚 / 验证方案 | 回头凭记忆补事实，或忽略 brainstorm 中的未查证项 |

## 必查关系

| 关系类型 | 要查什么 | 优先来源 | 写入重点 |
|---|---|---|---|
| Direct dependency | 当前候选包的 latest / maintained version、release cadence、license | npmjs / PyPI / crates.io / Maven Central / GitHub Releases / deps.dev | 候选包是否仍维护，是否适合新增 |
| Version range | `^` / `~` / exact / prerelease / tag 的含义和更新范围 | package manifest、npm semver docs、SemVer spec、生态官方版本规则 | 范围是否可能引入未测试 minor / patch |
| Peer dependency | 依赖对 host package 的版本要求，例如 React、Vue、Vite、ESLint、TypeScript | package.json、npm package page、repo package.json、pnpm peer resolution docs | host 项目版本是否满足 peer range |
| Runtime / engine | Node、Python、Go、Java、browser、OS、native binding 要求 | package metadata、official docs、release notes、CI matrix | 是否和项目运行时 / 部署平台冲突 |
| Lockfile / pinned tree | 当前实际安装版本、transitive deps、integrity、package manager | package-lock.json、pnpm-lock.yaml、yarn.lock、poetry.lock、uv.lock、go.sum、Cargo.lock | 真实安装树是否和 manifest 期望一致 |
| Transitive dependency | 间接依赖是否引入漏洞、重复大版本、native build、license 风险 | deps.dev、OSV、GitHub advisories、lockfile、package manager explain / why | 是否需要 override、替代包或后续验证 |
| Breaking changes | 目标版本相对当前版本的 breaking changes、migration guide、deprecation | CHANGELOG、release notes、migration docs、GitHub Releases | 是否改变 implementation 成本或 MVP 范围 |
| Override / resolution | 是否需要强制 transitive version、fork、backport 或单一版本 | npm overrides、pnpm overrides、Yarn resolutions、package manager docs | 只能作为风险 / 后续方案，不在 brainstorm 直接改 |

## Ecosystem Quick Map

| 生态 | Manifest | Lockfile | 常见版本关系 |
|---|---|---|---|
| Node / JS / TS | `package.json` | `package-lock.json`、`pnpm-lock.yaml`、`yarn.lock`、`bun.lock` | `dependencies`、`devDependencies`、`peerDependencies`、`optionalDependencies`、`engines`、`overrides` / `resolutions` |
| Python | `pyproject.toml`、`requirements.txt` | `poetry.lock`、`uv.lock`、`Pipfile.lock` | `requires-python`、dependency specifiers、extras、environment markers、build-system requirements |
| Go | `go.mod` | `go.sum` | `require`、`replace`、module version、Go toolchain version |
| Rust | `Cargo.toml` | `Cargo.lock` | crate version requirement、features、MSRV、workspace dependency |
| Java / JVM | `pom.xml`、`build.gradle` | Gradle lock / Maven effective dependency tree | dependency management、BOM、plugin versions、Java version |
| .NET | `.csproj`、`Directory.Packages.props` | `packages.lock.json` | target framework、NuGet range、central package management |

## 输出格式

```md
版本依赖关系：

| 依赖 / 技术 | 当前 / 候选版本 | 关系类型 | 约束来源 | 影响 | Handoff |
|---|---|---|---|---|---|
| motion-v | latest / target | peer/runtime/release | npm + package.json + docs | 需要确认 Vue 版本和 bundler 兼容性 | tech-design 锁定版本并验证 build |
```

字段要求：

| 字段 | 要求 |
|---|---|
| 依赖 / 技术 | 写具体 package、SDK、runtime、framework 或 provider |
| 当前 / 候选版本 | 当前项目版本、候选版本或 `unknown`；不能凭记忆 |
| 关系类型 | `direct` / `peer` / `runtime` / `lockfile` / `transitive` / `breaking` / `override` |
| 约束来源 | URL 或本地 manifest / lockfile 路径 |
| 影响 | 对方案取舍、成本、兼容性、安全或验证的影响 |
| Handoff | `tech-design lock version` / `needs user dependency decision` / `needs spike` / `no action` |

## 判定规则

- 如果只是用户问“这个方向是否值得考虑”，且版本关系不会改变方案取舍，可以只写证据表，不写完整版本关系表。
- 如果新增 / 替换直接依赖，或候选方案依赖特定 framework / runtime / SDK 版本，必须写版本关系表。
- 如果 peer deps、engine、lockfile 或 transitive risk 不清楚，置信度最多为 `likely`，并写未查证项。
- 如果需要 override / resolution 才能成立，不能写成已采纳方案；必须交给 `sf-tech-design` 做依赖确认和验证设计。
- 如果发现版本关系会改变 MVP、交付成本或安全边界，必须回到 `brainstorm.md#问题地图` 标记 `[必须确认]`。
