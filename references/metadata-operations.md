# 元数据查询、故障排查与参考导航

> 本文档从主 SKILL.md 中拆分而来，按需加载。触发条件：当需要查询或调试元数据、查找参考资料、排查故障或使用 CLI 降级方案时，阅读本文件。

## 元数据查询

> 元数据查询用于在已认证环境中搜索表单和获取实体字段结构，为 KS 脚本编写、页面开发等提供上下文信息。
> 所有查询操作通过 `scripts/meta-query-api.mjs` 脚本完成，详细命令参考见 [references/meta-query.md](meta-query.md)。

### 触发条件

- 用户提到表单名称（如"销售订单"）但未提供 formNumber
- 需要查询某个表单的字段结构
- KS Controller 开发前需了解目标表单的实体字段
- 页面开发时需了解关联表单的数据模型

### 前置条件

- 环境已认证（通过 setup-env.mjs 或手动认证完成）
- appNumber 已知（来自 `.kd/config.json` 的 `app` 字段，或用户明确提供）

### 工作流

#### Step 1: 搜索表单

优先使用 `queryFormsByApp` 在当前应用范围内搜索：

```bash
node "{meta_query_api}" queryFormsByApp --appNumber {appNumber} --keyword {keyword}
```

- `appNumber` 从 `.kd/config.json` 的 `app` 字段获取
- `keyword` 为用户提到的表单名称关键词（可选，不传则列出应用下所有表单）

#### Step 2: 确认目标表单

根据返回结果数量处理：

| 场景 | 处理方式 |
|------|----------|
| 返回单条 | 直接确认为目标表单，提取 `formNumber` |
| 返回多条 | 列表展示候选项（序号 / 表单名称 / 表单编码 / 模型类型 / 所属应用），并停下来向用户提问，将候选项作为选项让用户选择 |
| 返回空 | 提示未找到，建议尝试换关键词重试 |

#### Step 3: 获取实体字段（按需）

确认目标表单后，根据需要获取字段结构：

```bash
node "{meta_query_api}" getEntityFields --formNumber {formNumber}
```

返回结果按单头和单据体分组展示字段的 key、类型、是否必录等信息。

#### 灵活使用

- 用户也可以只执行 Step 1-2（仅查询表单列表），不必每次都查字段
- 若用户已知 formNumber，可直接执行 Step 3 获取字段结构
- 查询结果可用于 KS 脚本编写、页面开发、或单纯了解表单结构

### 与其他流程的集成

- **KS Controller 开发**：开发前先查询目标表单字段结构，了解单头/单据体/子分录的字段 key 和类型
- **页面开发**：查询关联表单了解数据模型，辅助组件设计
- **独立使用**：用户只想了解某个表单结构时，可独立调用

## 快速导航

按常见场景快速定位参考文档：

- **新工程初始化** → `cli-reference.md`（project init）+ 主 SKILL.md「初始化工程」章节
- **添加组件** → `cli-reference.md`（project create）+ `component-metadata.md`
- **创建页面** → `page-metadata.md` + 主 SKILL.md「创建页面元数据」章节
- **环境配置与部署** → `env-setup.md` + `cli-reference.md`（deploy/open/debug）+ `deployment-guide.md`
- **应用菜单管理** → `app-menu.md` + `deployment-guide.md`「应用菜单管理」章节
- **元数据查询** → `meta-query.md` + 本文「元数据查询」章节
- **工程流程编排** → `workflow-orchestration.md`

## 参考资料

| 主题 | 参考文件 |
|------|----------|
| CLI 命令语法、参数、示例 | `references/cli-reference.md` |
| 组件元数据字段与属性类型 | `references/component-metadata.md` |
| 环境信息收集与认证流程 | `references/env-setup.md` |
| 页面元数据字段、controls 规则、命名规范 | `references/page-metadata.md` |
| 应用菜单管理命令与展示规范 | `references/app-menu.md` |
| 元数据查询命令与响应格式 | `references/meta-query.md` |
| 完整工程流程编排 | `references/workflow-orchestration.md` |
| 环境配置、部署与菜单管理 | `references/deployment-guide.md` |

## 故障排查速查表

> 以下命令仅用于故障诊断，不可用于正常工作流。

| 症状 | 可能原因 | 解决方案 |
|------|----------|----------|
| `kd project deploy` 提示未认证 | 环境未执行 auth | `kd env auth openapi` |
| 页面元数据上传失败 | version 未递增 | 递增 version 后重试 |
| 页面显示空白 | control.type 与组件 name 不匹配 | 检查大小写完全一致 |
| 组件属性不生效 | 属性未在 .js-meta.kwc 声明 | 添加 `<property>` 定义 |
| name 校验失败 | 格式不符 | 字母开头，仅小写+数字+下划线，≤30字符 |
| isv 不一致 | 页面与环境开发商不匹配 | deploy 会自动替换，无需手填 |
| 在非 KWC 工程目录执行命令 | 缺少 .kd 目录 | 先执行 `kd project init` |
| 创建了页面但组件不显示 | 未把组件写入 `<controls>` | 编辑 page-meta.kwp 添加 control |
| `kd debug` 提示端口占用 | 3333 端口被占用 | 关闭占用进程或重启终端 |
| `kd debug` 启动后无法找到目标表单 / 进入了错误的表单 | 未使用 `-f` 参数指定页面元数据 name，或传入了文件名而非元数据 name 值 | 使用 `kd debug -f <page_name>`，其中 `<page_name>` 为**当前本地 `.page-meta.kwp` 文件中 `<name>` 节点的实际值**。注意：deploy 后脚手架会自动更新本地文件中的 name（拼接 isv 前缀），因此应使用 deploy 后的完整名称，如 `kdtest_demo_page` |
| `kd open` 打开页面后显示空白 | 未部署或静态文件未上传 | 先执行 `kd project deploy` 确保元数据和静态文件已上传 |
| `kd open` 提示表单不存在 | `-f` 参数值不正确 | 传入页面元数据 `<name>` 节点的实际值（deploy 后的完整名称） |

### 表单名称与 ISV 前缀说明

- **创建阶段**：`.page-meta.kwp` 中的 `<name>` 可填写业务标识，如 `demo_page`
- **Deploy 阶段**：脚手架自动从环境拉取 isv（如 `kdtest`），拼接成 `kdtest_demo_page` 上传到远端，并**同步更新本地文件**
- **Debug/Open 阶段**：`kd debug -f` 和 `kd open -f` 均应传入**当前本地文件中的 `<name>` 值**（即 deploy 后的完整名称）
- 如果不确定，直接打开 `.page-meta.kwp` 查看 `<name>` 节点即可

---

## 附录：CLI 手动降级方案

> **🚫 禁止区域 — AI 不得阅读或执行以下内容**
> 
> 以下 CLI 命令仅供人工故障排查参考。AI 在工程初始化和环境配置时必须使用自动化脚本（project-init.mjs / setup-env.mjs），组件/页面/Controller 创建使用 `kd project create` 命令。

### A. 工程初始化降级

当 `project-init.mjs` 脚本执行失败时，可降级为手动流程：

1. 安装 CLI。
2. 运行 `kd project init <project-name>`。
3. 在交互流程中按用户要求选择框架和语言；若用户未指定，默认选择 `react` + `ts`，无需询问用户。若用户明确指定了其他框架（Vue/LWC），则按用户指定的执行。
4. 输入应用标识 `app`（规则见主 SKILL.md"需要用户提供或确认的输入"一节）。
5. 初始化完成后进入项目目录，执行 `npm install`。
6. 仅在需要本地辅助预览组件时，再执行 `npm run dev`。

补充：`kd project init` 依赖 `git clone` 下载模板，若失败优先检查 `git`。

### B. 组件创建降级

当组件创建失败时，可降级为手动创建：

1. 运行 `kd project create <ComponentName> --type kwc`。
2. 使用 `PascalCase` 组件名。
3. 让 CLI 生成目录和基础文件。
4. 若用户同时要创建多个组件，逐个执行创建命令，不要手工复制推断目录结构。

### C. Controller 创建降级

当 Controller 创建失败时，可降级为手动创建：

1. 运行 `kd project create <ControllerName> --type controller`。
2. 使用 `PascalCase` 控制器名，建议以 `Controller` 后缀结尾。
3. 让 CLI 生成目录和基础文件。Controller 工程生成在 `app/ks/controller/<ControllerName>/` 下。
4. 若需指定拉取 SDK 的目标环境，可使用 `-e` 选项：`kd project create <ControllerName> --type controller -e dev`。

### D. 页面元数据创建降级

当页面创建失败时，可降级为手动创建：

1. 运行 `kd project create <page-name> --type page`。
2. 打开 `app/pages/<page-name>.page-meta.kwp`。
3. 至少核对并填写 `name`、`masterLabel`、`app`、`version`。
4. 在 `<controls>` 中把页面实例和组件类型关联起来。
5. 仅当该页面元数据文件有变更并准备重新上传时，手动将 `version` 加 `1`。
6. 将组件树、实例名和页面布局映射到 XML，而不是停留在"组件已经创建"这一步。

### E. 环境配置降级

当 `setup-env.mjs` 脚本执行失败时，可降级为手动流程：

1. 使用 `kd env create <env-name> --url <url>` 创建环境别名。
2. 使用 `kd env auth openapi` 走交互式认证。
3. 若用户经常切换环境，可用 `kd env set target-env <env-name>` 设置默认环境。
4. 必要时使用 `kd env info` 检查当前配置。

优先采用 `openapi` 认证方式；`web` 模式暂不作为默认路径。
