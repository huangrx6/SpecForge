# Go (Golang) 云原生微服务架构规范

## 1. 适用场景 (Applicability)
- **业务定位**：流量洪峰网关、大型微服务底座、高并发流处理、云原生系统级中间件、对 CPU/内存资源消耗极度敏感的后台计算服务。
- **技术优势**：令人赞叹的超高并发处理能力 (Goroutine + Channel)、极致的内存效率、快速的静态链接编译机制、无任何运行时依赖的跨平台单文件二进制产出。

## 2. 目录布局理念 (Standard Project Layout)
严格尊崇业界公认的 `golang-standards/project-layout` 理念以实现架构收敛：
- `cmd/`：系统入口主程序的聚居地。每个应用均在这个目录下拥有自己的子目录与独立的 `main.go`。
- `internal/`：代码防火墙。Go 编译器会在此目录前筑起高墙，任何不属于本项目范围的外部包均被禁止引入此目录内的代码，用以存放不对外的私密核心业务。
  - `internal/api/` 或 `internal/handler/`：专注于 HTTP/gRPC 层面的入站路由与参数收发。
  - `internal/service/` 或 `internal/biz/`：承载具体的领域逻辑与业务流。
  - `internal/data/` 或 `internal/repository/`：专门处理与数据库、Redis 及其他下层第三方服务的网络通讯和读写。
- `pkg/`：工具函数博物馆。仅放置那些能够被公司内外不同项目无脑引用、高度泛化抽象的通用包（例如定制化 logger, 通用加密解密工具）。

## 3. 框架与 RPC 选型 (Frameworks & Protocol)
- **Web 框架导向**：
  - 追求极致性能与极简路由首推 **Gin** 或 **Echo**。
  - 面向高频小巧 API，强烈建议直接驾驭原生标准库 `net/http`（结合 Go 1.22+ 内置的增强版路由机制）。
- **微服务内部交互协议**：
  - 丢弃性能低下的 HTTP+JSON，服务间内网通讯强制规定使用 **gRPC 配合 Protocol Buffers (Protobuf)**，利用二进制序列化和 HTTP/2 获得极低的延迟和严格的前后端代码生成契约约束。

## 4. 并发陷阱防御与上下文传递 (Concurrency & Context)
- **Context 渗透法则**：
  - **铁律约束**：所有任何涉及网络 IO、数据库交互、RPC 发起以及可能产生阻塞的函数声明，**第一个入参必须且只能是 `ctx context.Context`**。
  - 系统必须依靠 Context 全链路传播截止时间控制 (Timeout)、服务降级和优雅中断 (Cancellation)。
- **Goroutine 野蛮生长抑制**：
  - 绝对禁止随意抛出未经 `recover` 兜底保护的悬空 `go func()`。单一协程抛出的 panic 会无情地将整个主进程一起拉崩。
  - 并发编排与群组控制推荐采用官方增强包 `golang.org/x/sync/errgroup`。
- **错误处理哲学**：
  - 错误绝不可被吞噬：只要出现 `if err != nil`，必须即刻做出决断（重试、妥善处理或层层上抛）。
  - 全链路错误跟踪：向上层抛出时必须利用 `fmt.Errorf("...: %w", err)` 进行装箱包装，确保附带上下文现场和原始错误栈堆。

## 5. 数据管控层 (Persistence)
- **操作阵营**：
  - 追求 SQL 控制力和底噪极简的场景首选原生的 `database/sql` 辅以 `sqlx` 组件。
  - 追求开发效率与强大钩子能力的场景部署 **GORM** 或 Facebook 的 **Ent**。
- **热数据缓冲**：
  - 应用 `go-redis/redis`。开发侧必须在架构期规划防御雪崩（通过时间随机扰动 Jitter）和防范穿透漏洞策略。

## 6. 测试与工程交付流水线 (Testing & CI)
- **单元构建机制**：深入使用原生标准库 `testing`。强烈倡导且要求使用表驱动测试 (Table-Driven Tests) 的规范模式编写测试边界，使用 `stretchr/testify` 提供可读断言。
- **依赖切割 (Mocking)**：使用 **gomock** 工具，或是借助 Interface 面向接口编程，通过注入手工造桩类，将复杂的第三方系统完全隔离开。
- **安全与容器化交付**：
  - 构建阶段采用 Docker Multi-stage 机制。产物采用 Alpine 或无底包 Scratch 映像，镜像总大小必须严控在几十兆字节级别。
  - CI 流程硬控门禁：拦截线必须挂载 `golangci-lint`。

## 7. Design 必填问题

- 服务是 HTTP API、gRPC 内部服务、worker，还是网关？
- 包边界如何映射到 `cmd/`、`internal/`、`pkg/`？
- 哪些接口需要 context timeout、取消和请求级 trace？
- 并发模型是什么：worker pool、errgroup、channel、队列？
- 数据访问选 `database/sql`、sqlx、GORM 还是 Ent？为什么？

## 8. Spec Review 检查项

- 网络、数据库和 RPC 函数第一个参数为 `context.Context`。
- 没有无管理的悬空 goroutine。
- 错误使用 `%w` 包装并保留上下文。
- `pkg/` 没有放项目私有业务代码。
- 表驱动测试覆盖核心分支，CI 包含 `go test` 和 `golangci-lint`。
