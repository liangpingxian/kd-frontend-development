# Controller 在 KWC 工程中的集成工作流

本文档说明脚本控制器（Script Controller）在 KWC 工程中的位置、创建、构建和部署流程。

## 1. Controller 在 KWC 工程中的位置

### 1.1 目录结构

Controller 位于 KWC 工程的 `app/ks/controller/` 目录下：

```
my-kwc-project/
├── .kd/
│   └── config.json          # 工程配置
├── app/
│   ├── kwc/                  # 前端组件目录
│   │   └── MyComponent/
│   ├── pages/                # 页面元数据目录
│   │   └── myPage.page-meta.kwp
│   └── ks/
│       └── controller/       # Controller 目录
│           └── UserController/
│               ├── UserController.kws    # .kws 元数据文件
│               └── UserController.ts     # 脚本文件
├── dist/
│   ├── kwc/                  # 前端构建输出
│   └── controller/           # Controller 构建输出
└── package.json
```

### 1.2 文件组成

每个 Controller 包含两个文件：

| 文件 | 说明 | 示例 |
|------|------|------|
| .kws 元数据文件 | 定义路由、方法、权限 | `UserController.kws` |
| TypeScript 脚本文件 | 实现业务逻辑 | `UserController.ts` |

## 2. 创建 Controller

### 2.1 使用 CLI 创建

通过 `kd project create` 命令创建 Controller：

```bash
# 基本用法
kd project create <ControllerName> --type controller

# 指定目标环境（用于拉取 SDK）
kd project create <ControllerName> --type controller -e dev
```

**示例**：

```bash
# 创建 UserController
kd project create UserController --type controller

# 创建 OrderController，指定 dev 环境
kd project create OrderController --type controller -e dev
```

### 2.2 创建后的目录结构

执行命令后，会在 `app/ks/controller/` 下生成：

```
app/ks/controller/
└── UserController/
    ├── UserController.kws    # 模板元数据文件
    └── UserController.ts     # 模板脚本文件
```

### 2.3 注意事项

- Controller 目录名称使用 PascalCase
- 文件名与目录名保持一致
- 首次创建时会自动创建 `app/ks/controller/` 父目录

## 3. 构建 Controller

### 3.1 构建命令

有多种方式构建 Controller：

```bash
# 方式 1：使用 npm 脚本（推荐）
npm run build:controller                    # 构建所有 Controller
npm run build:controller -- MyController    # 构建指定 Controller
npm run build:controller -- --env=dev       # 指定环境

# 方式 2：使用 kd CLI
kd project build --type controller          # 构建所有 Controller
kd project build MyController --type controller  # 构建指定 Controller
kd project build --type controller -e dev   # 指定环境
```

### 3.2 构建输出

构建产物输出到 `dist/controller/` 目录：

```
dist/
└── controller/
    ├── UserController/
    │   ├── UserController.kws
    │   └── UserController.js
    └── OrderController/
        ├── OrderController.kws
        └── OrderController.js
```

### 3.3 构建前检查

构建命令会检查：
- `app/ks/controller/` 目录是否存在
- .kws 元数据文件是否有效
- 脚本文件语法是否正确

## 4. 部署 Controller

### 4.1 部署命令

Controller 通过统一的部署命令上传：

```bash
# 部署整个项目（包括前端组件和 Controller）
kd project deploy

# 部署到指定环境
kd project deploy -e sit

# 仅部署特定 Controller
kd project deploy -d dist/controller/UserController
```

### 4.2 部署时的自动处理

部署时会自动：
- 从环境拉取 isv 值并写入 .kws 元数据
- 校验版本号（必须大于已部署版本）
- 注册 Controller 路由

### 4.3 部署前提

- 已通过 `kd env auth` 完成环境认证
- 已执行构建命令生成部署产物
- .kws 元数据中的 version 大于服务端已有版本

## 5. 版本管理

### 5.1 版本号规则

- 类型：正整数（1, 2, 3...）
- 新 Controller 首次部署设为 `1`
- 每次更新部署必须递增版本号
- **不支持**相同版本号覆盖

### 5.2 版本更新示例

```xml
<!-- 首次部署 -->
<version>1</version>

<!-- 第一次更新 -->
<version>2</version>

<!-- 第二次更新 -->
<version>3</version>
```

### 5.3 版本错误处理

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| 版本号相同 | 版本号与服务端一致 | 递增版本号 |
| 版本号更低 | 版本号小于服务端 | 使用更大的版本号 |

## 6. 完整工作流编排

### 6.1 新建 Controller 流程

```
1. kd project create UserController --type controller
   └── 生成模板文件
   
2. 编写 .kws 元数据
   └── 定义 url、methods、permission
   
3. 编写脚本代码
   └── 实现业务逻辑
   
4. npm run build:controller
   └── 构建到 dist/controller/
   
5. kd project deploy
   └── 部署到云端环境
```

### 6.2 更新 Controller 流程

```
1. 修改 .kws 元数据或脚本代码

2. 递增 .kws 元数据中的 version
   └── <version>2</version>
   
3. npm run build:controller
   └── 重新构建
   
4. kd project deploy
   └── 部署更新
```

### 6.3 调试流程

```
1. 修改代码

2. npm run build:controller

3. kd project deploy

4. 使用 API 工具测试接口
   └── GET ../kwc/v1/kd/dev/users/123
```

## 7. 职责边界说明

### 7.1 kwc-ks-controller-development 职责

- ✅ 编写/修改 Controller 元数据 (.kws)
- ✅ 编写/修改 Controller 脚本代码
- ✅ 查阅 SDK 文档和索引

### 7.2 脚手架工作流职责

- ✅ 创建 Controller（`kd project create --type controller`）
- ✅ 构建 Controller（`npm run build:controller`）
- ✅ 部署 Controller（`kd project deploy`）
- ✅ 环境管理（`kd env` 相关命令）

### 7.3 协作流程

```
脚手架工作流          kwc-ks-controller-development
       │                                   │
       │  kd project create               │
       │────────────────────────────►     │
       │                                   │
       │                          编写 .kws 元数据
       │                          编写脚本代码
       │                                   │
       │  返回构建部署                     │
       │◄────────────────────────────     │
       │                                   │
       │  npm run build:controller         │
       │  kd project deploy                │
       │                                   │
```

## 8. 调试与测试

### 8.1 本地调试

- 调试由脚手架工作流负责，使用 `kd debug` 启动
- **必须使用后台模式**（`is_background: true`），否则 90 秒超时被 kill
- 启动后浏览器可能早于服务就绪打开，需等待后刷新
- 通过 `get_terminal_output` 查看调试进程状态

### 8.2 前后端联调流程

1. 确保后端 Controller 已部署（version 递增 → build → deploy）
2. 确保前端组件已使用正确的 adapterApi 配置
3. 启动 `kd debug` 进行本地联调
4. 在浏览器中访问对应页面，触发前端组件调用后端 API
5. 查看浏览器开发者工具 Network 面板确认请求/响应

### 8.3 常见调试场景

- **API 返回 404**：检查 source 路径、version 是否匹配、Controller 是否已部署
- **API 返回 401/403**：检查权限配置（permitAll/needall/entityNumber）
- **请求参数丢失**：确认 GET 用 params（查询参数）、POST 用 params（请求体）
- **响应数据格式不符**：确认 `response.ok()` 传入的是正确的数据结构
