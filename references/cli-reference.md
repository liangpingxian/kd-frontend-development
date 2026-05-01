> **本文档提供 CLI 命令参考，实际执行时：**
> - 工程初始化 → `node scripts/project-init.mjs`
> - 环境配置 → `node scripts/setup-env.mjs`  
> - 创建组件/页面/Controller → `kd project create`
> 
> **禁止直接在终端执行本文档中的初始化和环境配置类 CLI 命令（应使用对应脚本）。组件/页面/Controller 创建可直接使用 `kd project create` 命令。**

---

# KWC CLI Reference

按需读取本文件，用于补充命令语法、OpenAPI 参数和页面元数据示例。

## 核心概念

- `Project`：本地项目目录，保存源代码、配置文件和元数据。
- `Env`：远端苍穹环境，一个本地项目可以连接多个环境。

## 安装 CLI

```bash
npm i -g @kdcloudjs/cli
kd -v
```

更新脚手架到最新版本：

```bash
kd update
```

## 初始化项目

```bash
kd project init my-demo-project
```

交互过程中通常需要：

- 选择框架，如 React、Vue、LWC
- 选择语言，如 TypeScript、JavaScript
- 输入应用标识 `app`（必须由用户明确提供，详见 SKILL.md「需要用户提供或确认的输入」一节）

初始化后执行：

```bash
cd my-demo-project
npm install
npm run dev
```

## 创建组件

```bash
kd project create DemoComponent1 --type kwc
kd project create DemoComponent2 --type kwc
```

建议：

- 使用 `PascalCase` 作为组件名。
- 先让 CLI 生成组件工程，再补充具体实现代码。
- 生成后应继续检查并完善 `.js-meta.kwc`，不要把脚手架模板直接当成最终元数据。

## 创建 Controller

```bash
kd project create myController --type controller
kd project create myController --type controller -e dev  # 指定拉取 SDK 的目标环境
```

建议：

- 使用 `PascalCase` 作为控制器名，建议以 `Controller` 后缀结尾。
- Controller 工程生成在 `app/ks/controller/<ControllerName>/` 下。
- 创建后应继续检查并完善 .kws 元数据文件，补齐 name、isv、app、version、url、scriptFile、methods 等必填字段。

## 创建页面

```bash
kd project create demo_page --type page
```

页面元数据常见示例：

```xml
<?xml version="1.0" encoding="UTF-8"?>

<Page>
    <name>demo_page</name>
    <masterLabel>demo_page</masterLabel>
    <template>oneregion</template>
    <isv></isv>  <!-- deploy 时由脚手架自动从环境拉取 -->
    <app>your_app_code</app>
    <version>1</version>
    <regions>
        <region>
            <name>region1</name>
            <controls>
                <control>
                    <type>DemoComponent1</type>
                    <name>instance1</name>
                </control>
                <control>
                    <type>DemoComponent1</type>
                    <name>instance2</name>
                </control>
                <control>
                    <type>DemoComponent2</type>
                    <name>instance3</name>
                </control>
            </controls>
        </region>
    </regions>
</Page>
```

字段提醒：

- `name`：页面标识。
- `masterLabel`：页面展示名。
- `template`：页面模板。
- `app`：苍穹应用编码（必须由用户明确提供，详见 SKILL.md）。
- `version`：正整数；仅当该页面元数据文件有变更并准备重新上传时，手动加 `1`。
- `control.type`：组件类型名。
- `control.name`：页面内的组件实例名。
- 实测默认不会自动插入真实 `<control>` 节点，只保留注释模板。
- 页面中配置的属性名，应与组件元数据里定义的 `<property name="...">` 对应。

## 环境管理

创建环境：

```bash
kd env create dev --url https://feature.kingdee.com:1026/feature_dev/
```

OpenAPI 认证：

```bash
kd env auth openapi
```

常用环境命令：

```bash
kd env set target-env dev
kd env info
kd env delete dev
```

OpenAPI 认证时通常需要：

- 数据中心
- Client ID
- Client Secret
- Username

注意：这里的"数据中心"应由脚手架在认证过程中读取列表后供用户选择，不应和其他凭据一样让用户手动输入。

如果环境不存在，先向用户收集以下字段，再继续：

- env name
- env url
- Client ID
- Client Secret
- Username

推荐直接让用户按这个模板回填：

```text
请补充以下环境信息：
1. env name:
2. env url:
3. client id:
4. client secret:
5. username:

说明：data center 不需要先手填，后续由脚手架读取候选项供选择。
```

相关 OpenAPI 应用需具备这些接口授权：

1. `updateKwc`
2. `kwcisv`
3. `updatePageMeta`

补充提醒：

- 环境配置写入 `~/.kd`。
- 在受限环境中执行 `kd env create` 后，务必再跑 `kd env list` 检查是否真正保存成功。
- 删除环境后要重新确认默认环境是否被 CLI 自动切换。

## 构建

全量构建（前端 + Controller + 元数据）：

```bash
npm run build
```

仅构建前端组件：

```bash
npm run build:frontend
npm run build:frontend -- ExampleComponent      # 构建指定组件
npm run build:frontend -- ComponentA ComponentB  # 构建多个组件
```

仅构建 Controller：

```bash
npm run build:controller
npm run build:controller -- --env=dev           # 指定目标环境
npm run build:controller -- MyController        # 构建指定 Controller
```

也可以使用 kd CLI 构建：

```bash
kd project build --type frontend              # 构建前端资源
kd project build --type controller            # 构建 Controller
kd project build --type controller -e dev     # 构建 Controller 到指定环境
kd project build myComponent --type frontend  # 构建指定组件
```

构建说明：

- 前端构建输出到 `dist/kwc/`
- Controller 构建输出到 `dist/controller/`
- 元数据文件拷贝到 `dist/metadata/`
- Controller 构建前会检查 `app/ks/controller/` 目录是否存在

## 部署

部署整个项目：

```bash
kd project deploy
```

仅部署指定组件到 `sit` 环境：

```bash
kd project deploy -d app/kwc/MyComponent -e sit
```

仅部署指定页面元数据到 `sit` 环境：

```bash
kd project deploy -d app/pages/my_page -e sit
```

仅部署指定 Controller 到 `sit` 环境：

```bash
kd project deploy -d app/ks/controller/MyController -e sit
```

部署包含的内容（一次 deploy 上传全部）：

1. 组件元数据（.js-meta.kwc）
2. 页面元数据（.page-meta.kwp）
3. Controller 元数据（.kws）及 Controller 脚本 — 开发阶段由 deploy 直接处理，无需预先 build
4. 前端静态文件（dist/kwc/）— 需先执行 `npm run build:frontend`，开发环境自动上传

注意：

- 部署时脚手架会自动替换组件及页面元数据中的 `isv`。
- 若未指定环境，则使用默认环境。
- 若环境未认证，CLI 会直接阻止部署。
- 从 0.0.13 版本开始，部署到开发环境时，deploy 会同时将前端构建产物（静态文件）上传到该环境。
- 不要把 `deploy` 当成每次改代码后的必跑步骤；先看是否真的改了元数据文件。

版本管理规则：

| 变更类型 | 是否需要递增 `version` | 是否需要 `deploy` | 推荐动作 |
| --- | --- | --- | --- |
| 只改组件实现代码，未改任何元数据 | 否 | 视需求 | 本地调试：`npm run build` + `kd debug`；查看环境效果：`npm run build` + `kd project deploy`（上传静态文件）+ `kd open` |
| 改了组件元数据 `.js-meta.kwc` | 是，递增该组件元数据 `version` | 是 | 部署该组件或整个项目 |
| 改了页面元数据 `.page-meta.kwp` | 是，递增该页面元数据 `version` | 是 | 部署该页面元数据或整个项目 |
| 同时改了组件元数据和页面元数据 | 是，分别递增 | 是 | 部署受影响路径或整个项目 |
| 新建组件元数据或页面元数据 | 初始值设为 `1` | 是 | 首次上传 |
| 修改 Controller 代码或 .kws 元数据 | 是，递增 Controller 元数据 version | 是 | 直接 `kd project deploy`（开发阶段无需 build） |

判断提醒：

- 是否需要 `deploy`，先看元数据文件是否变更。
- 是否需要递增 `version`，也先看对应元数据文件是否变更。
- 只改组件代码，不要因为"刚改了东西"就盲目 `deploy`。

构建前置条件（开发阶段）：

- 改了前端代码 → 先 `npm run build:frontend`，再 deploy
- 改了 Controller 代码或 .kws → 直接 deploy，不需要 build（开发阶段 deploy 直接处理 Controller）
- 只改元数据文件 → 直接 deploy，不需要 build
- `npm run build:controller` 和 `npm run build` 仅用于生产环境构建产物

## 打开表单

部署后直接在浏览器中打开环境上已部署的表单页面，无需 DNS 代理：

```bash
kd open -e dev -f kdtest_demo_page          # 打开 dev 环境的表单（kdtest_demo_page 取自 .page-meta.kwp 中的 <name> 值）
kd open -e sit -f kdtest_demo_page          # 打开 sit 环境的表单
```

### 选项说明

- `-e, --target-env <name>`：**（必填）** 指定目标环境（如 `dev`, `sit`）
- `-f, --formid <name>`：**（必填）** 指定表单。**必须读取 `.page-meta.kwp` 文件中 `<name>` 节点的值，不是表单文件名称**（文件名和元数据 name 可能不同，元数据 name 已包含 ISV 前缀）

### 与 kd debug 的区别

| 对比项 | `kd debug` | `kd open` |
|--------|-----------|----------|
| 运行方式 | 通过 DNS 代理，将本地开发服务器与环境连接 | 直接打开环境上已部署的页面，无 DNS 代理 |
| 适用场景 | 本地开发调试，实时预览代码修改 | 部署后验证线上效果 |
| 是否需要本地服务 | 是，需要本地 dev server 运行 | 否，直接访问远端环境 |
| `-f` 参数 | `.page-meta.kwp` 中 `<name>` 节点的值（不是文件名） | `.page-meta.kwp` 中 `<name>` 节点的值（不是文件名） |

### 使用前提

- 已通过 `kd project deploy` 将元数据和前端静态文件部署到目标环境

### 表单名称取值

与 `kd debug` 一致，`-f` 传入当前本地 `.page-meta.kwp` 中 `<name>` 节点的实际值。deploy 后脚手架会自动更新本地文件中的 name（拼接 isv 前缀），因此应使用 deploy 后的完整名称。

## 调试

> 仅当用户明确要求本地调试或联调时使用 `kd debug`。若只需查看环境上的部署效果，应使用 `kd open`。

```bash
kd debug                              # 交互选择表单
kd debug -e sit                       # 指定环境
kd debug -f kdtest_demo_page           # 直接指定表单（值取自 .page-meta.kwp 中 <name> 节点，不是文件名）
kd debug -f kdtest_demo_page -e sit    # 同时指定表单和环境
```

### 选项说明

- `-e, --target-env <name>`：指定调试连接的后端环境
- `-f, --formid <name>`：指定调试表单。**必须读取 `.page-meta.kwp` 文件中的 `<name>` 节点值，不是表单文件名称**（文件名和元数据 name 可能不同，元数据 name 已包含 ISV 前缀）

### 表单名称与 ISV 前缀机制

理解 `kd debug -f` 参数时，需要明确表单名称在 deploy 前后的变化：

1. **创建页面阶段**：你在 `.page-meta.kwp` 中填写的 `<name>` 可以是业务标识，如 `demo_page`
2. **Deploy 阶段**：执行 `kd project deploy` 时，脚手架会：
   - 自动从环境拉取 isv 标识（如 `kdtest`）
   - 将 isv 前缀拼接到 name 上，形成 `kdtest_demo_page` 上传到远端
   - **同时更新本地的 `.page-meta.kwp` 文件**，将 `<name>` 改为 `kdtest_demo_page`，并填入 `<isv>kdtest</isv>`
3. **Debug 阶段**：`kd debug -f` 参数应传入**当前本地文件中 `<name>` 节点的实际值**
   - 首次 deploy 前，本地 name 可能是 `demo_page`
   - Deploy 后，本地 name 会自动变成 `kdtest_demo_page`
   - 因此 debug 时应使用 deploy 后的完整名称

示例流程：

```bash
# 1. 创建页面，此时 .page-meta.kwp 中 <name>demo_page</name>
kd project create demo_page --type page

# 2. 部署后，脚手架自动更新本地文件为 <name>kdtest_demo_page</name> 和 <isv>kdtest</isv>
kd project deploy

# 3. 调试时使用更新后的完整名称
kd debug -f kdtest_demo_page
```

如果不确定当前的 name 值，可以直接打开 `.page-meta.kwp` 查看 `<name>` 节点。

### 调试约定（按需触发）

- 仅当用户明确要求本地调试或联调时才使用 `kd debug`；查看环境效果优先使用 `kd open`
- 运行 `kd debug` 时**必须使用后台模式**（`is_background: true`），因为这是一个持续运行的开发服务器，不会自动结束
- 若使用前台模式运行 `kd debug`，命令会在 90 秒后因超时被强制终止，导致本地服务被 kill
- `kd debug` 启动后会先打开浏览器访问对应地址，但此时本地服务可能尚未完全启动，需等待服务启动完成后再刷新
- 可以通过 `get_terminal_output` 查看 `kd debug` 的运行状态和输出
- 先确保 `target-env` 正确，再运行 `kd debug`
- AI 应结合当前任务、最近修改页面和 `app/pages/*.page-meta.kwp` 自行判断预览目标
- `kd debug` 会自动打开浏览器，后续在浏览器里继续定位并验证目标页面

### 调试前确认

- 已部署过组件或页面元数据
- 当前默认环境正确，或已通过 `-e <env>` 参数指定
- `.kd/config.json` 中 `app` 编码与目标应用一致
- 若 `.kd/config.json` 缺少 `isv/app`，静态路由不会挂载
- `localhost:3333` 未被占用

### 注意事项

- 若需在不同 app 间切换调试，请手动修改 `.kd/config.json` 中的 `app` 编码

按需深入读取：

- `component-metadata.md`
- `env-setup.md`
- `page-metadata.md`
