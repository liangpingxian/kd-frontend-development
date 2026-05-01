# 环境配置、部署与菜单管理

> 本文档从主 SKILL.md 中拆分而来，按需加载。触发条件：当任务进入环境配置、部署、页面访问链接生成或菜单配置阶段时，阅读本文件。

## 配置环境

在部署前先完成环境配置。

### 环境存在性检查

当用户提供了具体的环境名称或别名（如 `dev`、`sit`、`uat` 等）时，应先执行环境存在性检查：

1. 运行 `kd env list` 查看当前已配置的环境列表
2. 若目标环境已存在于列表中：
   - 不需要再让用户提供 URL、Client ID/Secret 等环境信息
   - 直接使用该环境进行后续操作（如 deploy、debug）
   - 若该环境不是当前默认环境，可通过 `kd env set target-env <name>` 切换
   - 使用 `kd env list` 确认环境认证状态
3. 只有当环境不存在时，才进入完整的环境创建和认证流程

### 新建环境流程

> **⚠️ 必须通过脚本执行，禁止直接在终端运行任何 kd CLI 交互式命令。**

当环境不存在时，按以下流程执行：

#### 必须使用自动化脚本

**必须使用 `setup-env.mjs` 脚本完成环境配置，禁止直接执行 CLI 交互式命令。**

使用 `setup-env.mjs` 一键完成环境创建和认证。脚本会自动检测环境是否已存在，根据情况决定是否需要创建环境。

AI **必须**先向用户收集以下认证信息，用户未提供时应**停下来询问**：

**始终必填：**
- 环境名（envName）
- Client ID（clientId）
- Client Secret（clientSecret）
- 用户名（username）

**条件必填：**
- 环境 URL（envUrl）：环境不存在时必填，环境已存在时可省略

> 若环境已存在（如通过 `kd env create` 创建过），只需提供认证参数（clientId、clientSecret、username），脚本会自动跳过环境创建直接认证。

收集完毕后执行：

> 脚本位于本技能安装目录的 `scripts/` 子目录下，不在用户项目目录中。请先确定本 SKILL.md 文件的绝对路径，然后执行：

```bash
# 环境不存在时（需要创建）：
node $SKILL_DIR/setup-env.mjs --envName <环境名> --envUrl <URL> --clientId <ID> --clientSecret <Secret> --username <用户名>

# 环境已存在时（仅认证，脚本会从 ~/.kd/config.json 读取 url）：
node $SKILL_DIR/setup-env.mjs --envName <环境名> --clientId <ID> --clientSecret <Secret> --username <用户名>

# 多数据中心时（第一次调用会退出码 2 并打印候选列表，按提示补 --datacenter 重跑）：
node $SKILL_DIR/setup-env.mjs --envName <环境名> --envUrl <URL> --clientId <ID> --clientSecret <Secret> --username <用户名> --datacenter <accountId>
```

**脚本执行流程（零交互，跨平台）：**
1. 参数校验
2. 确定 `envUrl`（优先 `--envUrl`，环境已存在时可从 `~/.kd/config.json` 读取）
3. 先无副作用地调用 `<envUrl>/auth/getAllDatacenters.do` 探测数据中心列表（失败不会污染本地配置）
4. 根据数据中心数量决定：
   - **1 个** → 自动选用，继续
   - **多个 + 传了 `--datacenter`** → 校验 `accountId` 存在则使用
   - **多个 + 未传 `--datacenter`** → 打印候选列表 + **退出码 2**，要求调用方补 `--datacenter <accountId>` 重跑（此时本地还没 createEnv，不会残留孤儿环境）
5. 数据中心确认后才 createEnv（若不存在）
6. 以 `kd env auth openapi -e <env> --datacenter <id> --client-id <cid> --client-secret <secret> --username <user>` 原生参数完成认证
7. 从 `~/.kd/config.json` 验证 `client_id / access_token / username` 确已落库

**退出码约定：**
- `0`：成功
- `1`：参数错误 / 认证失败 / 其他错误
- `2`：多数据中心且未指定 `--datacenter`，stderr 含候选列表，格式为 `accountName<TAB>(accountId=xxx)`

**AI 处理策略：**
调用脚本遇到退出码 `2` 时，从 stderr 提取候选列表并以选项方式呈现给用户（展示字段用 `accountName`），用户选定后以 `--datacenter <accountId>` 重跑脚本。

### 需要收集环境信息的情况

如果目标环境不存在，或环境存在但尚未完成认证，先停下来收集这些字段：

**始终必填：**
- 环境别名
- Client ID
- Client Secret
- Username

**环境不存在时额外必填：**
- 环境 URL

其中 `data center` 不属于预先手填字段，而属于"读取后选择"的字段：

- 先有环境 URL
- setup-env.mjs 在认证前会调用 `<envUrl>/auth/getAllDatacenters.do` 读取可用数据中心列表
- **单个数据中心**：脚本自动选用（accountId），无需用户介入
- **多个数据中心**：脚本以**退出码 2** 终止并打印候选列表（`accountName <TAB> accountId=...`），AI 应将候选列表作为选项让用户选择（展示字段用 `accountName`，入参字段用 `accountId`），选定后以 `--datacenter <accountId>` 重跑脚本

收集规则：

- 环境别名、环境 URL、Client ID、Client Secret、Username 这些值必须由用户手工提供
- `data center` 不要让用户自由输入，应让脚手架读取候选项后再选择
- 不要使用历史环境中的凭据去猜测新环境
- 不要因为存在 `dev`、`sit`、`base` 等别名，就自动推断这次要绑定哪个环境

交互方式规则：

- 不要假设当前一定支持弹窗或表单式输入
- 在当前常规模式下，先让用户回填手工字段；数据中心由 setup-env.mjs 处理（单个自动选；多个走退出码 2 再由 AI 承接交互）
- 若运行环境明确支持结构化选择工具，可以在脚本返回退出码 2 后把候选列表以选项形式展示给用户
- 即便如此，Client Secret 这类自由文本仍应让用户手填

推荐向用户索要环境信息的格式（环境不存在时）：

```text
请补充以下环境信息：
1. env name:
2. env url:（环境已存在时可不填）
3. client id:
4. client secret:
5. username:

说明：
- 若环境已存在，只需填写 1、3、4、5，脚本会自动跳过创建直接认证
- data center 不需要先手填，后续会由脚手架读取候选项供选择
```

补充：环境配置保存在 `~/.kd` 而非项目目录；创建后必须用 `kd env list` 复核是否持久化成功；环境认证在 URL 不可达时会直接失败。

## 部署与调试

### 构建命令

开发阶段只需要构建前端，Controller 由 deploy 直接处理：

| 场景 | 构建命令 | 说明 |
|------|---------|------|
| 改了前端代码（.tsx/.vue/.js） | `npm run build:frontend` | 构建前端静态资源，输出到 dist/kwc/ |
| 改了 Controller 代码（.ts）或 .kws | 不需要 build | 开发阶段 deploy 直接处理 Controller |
| 仅改元数据文件（.kwc/.kwp/.kws） | 不需要 build | 元数据由 deploy 直接上传 |

补充用法：
- `npm run build:frontend -- MyComponent`：构建指定前端组件
- `npm run build:controller`：仅用于生产环境构建 Controller 产物，开发阶段不需要
- `npm run build`：全量构建（前端 + Controller），仅用于生产环境

### 部署决策（默认自动部署）

创建/修改组件、页面或 Controller 后，**必须自动执行部署**，按以下流程操作：

#### 步骤 1：检查已有环境

```bash
kd env list
```

- 如果输出中有**任何环境**（不为空） → 进入步骤 2
- 如果输出为空（无任何环境） → 进入步骤 3

#### 步骤 2：直接部署（最常见场景）

从 `kd env list` 输出中选择已认证的环境，直接执行部署：

```bash
kd project deploy -e <环境名>
```

或者如果已配置默认环境（`kd env info` 有输出），直接：

```bash
kd project deploy
```

**禁止在已有环境的情况下向用户询问环境信息，直接部署即可。**

#### 步骤 3：无环境时收集信息

仅当 `kd env list` 输出为空时，才向用户收集环境信息并通过 setup-env.mjs 创建环境，然后再部署。

#### 总结

| 场景 | 动作 |
|------|------|
| 有已认证环境 | **直接 `kd project deploy`，不问用户** |
| 有环境但未认证 | 收集认证参数（clientId/clientSecret/username），认证后部署 |
| 无任何环境 | 收集完整环境信息，创建+认证后部署 |
| 用户明确说不要部署 | 跳过部署 |

#### 部署内容决策树

```
改了什么？
├── 只改前端代码（.tsx/.vue/.js/.html/.scss）
│   ├── 用户明确要求仅本地调试 → npm run build:frontend → kd debug（不需要 deploy）
│   └── 默认 → npm run build:frontend → kd project deploy
├── 只改 Controller 代码（.ts）或 .kws 元数据
│   → .kws version + 1 → 直接 kd project deploy（不需要 build）
├── 前端 + Controller 都改了
│   → 递增相关 version → npm run build:frontend → kd project deploy
├── 只改元数据（.js-meta.kwc / .page-meta.kwp）
│   → version + 1 → 直接 kd project deploy（不需要 build）
└── 新建组件/页面/Controller
    → version = 1 → 若有前端代码则 npm run build:frontend → kd project deploy
```

### 常用命令

1. `kd project deploy`：一次性部署整个项目的所有元数据（.js-meta.kwc + .page-meta.kwp + .kws）和前端静态文件到默认环境；开发阶段 Controller 由 deploy 直接处理，无需预先 build
2. `kd project deploy -d app/kwc/MyComponent -e sit`：仅部署指定组件到 `sit`
3. `kd project deploy -d app/pages/my_page -e sit`：仅部署指定页面元数据到 `sit`
4. `kd project deploy -d app/ks/controller/MyController -e sit`：仅部署指定 Controller 到 `sit`
5. `kd open -e dev -f kdtest_demo_page`：部署后直接打开环境上的表单查看效果（无 DNS 代理）。`-f` 的值必须取自 `.page-meta.kwp` 中的 `<name>` 字段值（已含 ISV 前缀），不是文件名
6. `kd debug`：进入本地调试，通过 DNS 代理连接环境（**必须使用 `is_background: true` 运行**，仅当用户明确要求调试时使用）。`-f` 的值同样取自 `.page-meta.kwp` 中的 `<name>` 字段值

## 页面访问链接

部署成功后，生成页面访问链接供用户点击查看效果。这是部署流程的最后一个执行步骤，**不是任务总结**。

### 发送时机

> **⚠️ 强制约束：部署成功后必须立即生成并发送 render 卡片（`:::render:kdform ...:::`），这是部署流程的完成标志。禁止将 render 卡片的生成延迟到用户请求 `kd open` 或其他后续操作时才执行。**

- **部署即发送（不可延迟）**：每完成一段可预览的工作（该段涉及的所有 deploy 均已成功），**必须立即**生成并发送 render 卡片，不可等待用户下一步指令
- **同一段工作内不重复**：如果一段工作涉及多次 deploy（如先部署组件、再部署页面、再部署 Controller），应在该段全部部署完成后发送一次
- 适用于任何 deploy 形式：整体部署（`kd project deploy`）、指定路径部署（`-d app/kwc/...`、`-d app/pages/...`、`-d app/ks/controller/...`）

### 页面访问链接

部署成功后，生成页面访问链接供用户点击查看效果。此输出是一个独立的链接卡片，与任务总结无关。

**链接卡片格式（固定，不再区分是否关联业务实体）：**
```
:::render:kdform {"title":"<masterLabel值>","url":"<环境URL>/?formId=<页面name>"}:::
```

**✅ 完整正确示例：**
```
:::render:kdform {"title":"运维监控工作台","url":"https://feature.kingdee.com:1026/feature_vb/?formId=kdtest_opsmonitor"}:::
```

**⚠️ JSON 只允许 `title` 和 `url` 两个字段，`url` 必须是完整的 HTTP/HTTPS URL（包含环境域名），不是 formId 或其他参数。**

| 字段 | 必须 | 来源 | 说明 |
|------|------|------|------|
| `title` | ✅ 必须 | `.page-meta.kwp` 中的 `<masterLabel>` | 页面中文名称，如「运维监控工作台」 |
| `url` | ✅ 必须 | `{环境URL}/?formId={页面name}` | **必须是完整 URL**（含协议、域名、端口、路径、formId 参数），页面 name 取自 `.page-meta.kwp` 的 `<name>` 字段（已包含 ISV 前缀） |

**URL 拼接规则：**
- 环境 URL：从 `kd env info` 或 `~/.kd/config.json` 中读取当前环境的 url（如 `https://feature.kingdee.com:1026/feature_vb`）
- formId：直接使用 `.page-meta.kwp` 中的 `<name>` 值（已包含 ISV 前缀），如 `kdtest_inv_dashboard`
- 最终 url = `{环境URL}/?formId={页面name}`，如 `https://feature.kingdee.com:1026/feature_vb/?formId=kdtest_inv_dashboard`

---

**🚫 禁止格式（常见错误，以下格式均为错误，禁止使用）：**

| 错误示例 | 错误原因 |
|----------|----------|
| ❌ `{"formId":"xxx","env":"vb"}` | 缺少 `title` 和完整 `url`，`formId`/`env` 不是合法字段 |
| ❌ `{"title":"xxx","formId":"xxx"}` | `url` 必须是完整 URL，不能只传 `formId` |
| ❌ `{"title":"xxx","url":"xxx","metadata":{...}}` | 只允许 `title` 和 `url` 两个字段，禁止额外字段 |
| ❌ `{"title":"xxx","url":"xxx","formId":"xxx"}` | 同上，`formId` 已包含在 `url` 参数中，禁止单独传 |
| ❌ `{"title":"xxx","url":"kdtest_opsmonitor"}` | `url` 必须是完整的 HTTP/HTTPS URL，不能只写 formId 值 |

---

> ⚠️ 这是一个**链接卡片**，不是总结。JSON **仅包含 `title` 和 `url` 两个字段**，禁止额外拼接其他字段（包括旧版的 `metadata`、`formId`、`env` 等字段均已废弃）。

> 💡 也可通过 `form-link.mjs` 脚本自动生成链接卡片（见 scripts 目录），但不强制要求使用脚本。

### 执行顺序

```
当段工作所有 deploy 完成 → 发送页面访问链接（:::render:kdform ...:::） → 向用户提问是否需要菜单发布（可选）
```

### 强制约束

- 每段工作的部署完成后**必须立即**发送页面访问链接（render 卡片），不可省略、跳过或延迟
- **render 卡片是部署流程的完成标志**——deploy 成功而未发送 render 卡片，视为部署流程未完成
- **禁止将 render 卡片延迟到 `kd open` 时才生成**——render 卡片与 `kd open` 是独立的两个动作
- 多轮对话中每段完成的工作都应发送，不要只在最终结束时才发送
- 同一段工作内不重复发送（多条 deploy 命令属于同一段工作时，等全部完成后发送一次）
- 链接卡片 JSON 仅含 `title`、`url` 两个字段
- 所有值从实际文件和环境中读取，禁止猜测
- 任务总结（如有）应作为**独立文本**写在链接卡片之后

## 查看环境效果（kd open）

> render 卡片（`:::render:kdform ...:::`）在部署完成后已立即生成并发送，用户可直接点击卡片中的链接查看效果。
> 以下 `kd open` 命令是**可选**的补充操作，仅当用户明确要求在浏览器中打开页面时使用。

部署后使用 `kd open` 查看环境上的表单效果：

- `kd open -e <env> -f <page_name>`：直接在浏览器中打开对应环境上已部署的表单页面
- `-e` 指定目标环境（必填），`-f` 传入页面元数据 `<name>` 值（必填），**必须读取 `.page-meta.kwp` 文件中的 `<name>` 字段值，不是文件名**（文件名和元数据 name 可能不同，元数据 name 已包含 ISV 前缀，如 `kdtest_inv_dashboard`）
- 不需要本地 dev server 运行，不走 DNS 代理
- 使用前提：已通过 `kd project deploy` 将元数据和静态文件部署到目标环境

适用场景：用户说"看看效果"、"打开页面"、"查看环境上的表单"、"看看部署结果"等。

### 本地调试（kd debug）

仅当用户明确说"调试"、"本地调试"、"联调"、"实时预览代码修改"时才使用 `kd debug`：

- 运行 `kd debug` 时**必须使用后台模式**（`is_background: true`），因为这是一个持续运行的开发服务器，不会自动结束
- 若使用前台模式运行 `kd debug`，命令会在 90 秒后因超时被强制终止，导致本地服务被 kill
- `kd debug` 启动后会先打开浏览器访问对应地址，但此时本地开发服务可能尚未完全启动，页面可能暂时无法访问。应等待服务启动完成后再刷新浏览器
- 可以通过 `get_terminal_output` 查看 `kd debug` 的运行状态和输出
- 若目标环境不是当前默认环境，先执行 `kd env set target-env <env-name>`
- 不要手工拼调试 URL，由 AI 自行结合任务和页面元数据判断预览目标
- 浏览器自动打开后继续定位目标页面

### 触发决策

前置条件（必须在触发 open/debug 前完成）：
- 已完成代码编写
- 已执行必要的 build 命令（若修改了代码）
- 已执行 kd project deploy（若需要部署）
- **已发送 render 卡片**（`:::render:kdform ...:::`）——部署成功后必须立即发送，这是 open/debug 的前置步骤
- 环境已认证

**部署后完整流程决策树：**

```
kd project deploy 成功
  ↓
【必须】生成并发送 render 卡片（:::render:kdform ...:::）
  ↓
用户意图判断：
├── 用户直接点击链接 → 无需脚手架介入
├── 用户要求"打开页面/看效果/查看部署结果" → kd open
├── 用户要求"调试/联调/本地调试/实时预览修改" → kd debug
└── 用户未明确要求 → 结束，等待后续指示
```

补充：环境未认证时 `kd project deploy` 会直接阻止部署。

## 应用菜单管理

> 菜单管理将部署后的页面注册到应用导航菜单，使页面在苍穹环境中可被用户导航访问。
> 所有菜单操作通过 `scripts/menu-api.mjs` 脚本完成，详细命令参考见 [references/app-menu.md](app-menu.md)。

### 触发条件

- `kd project deploy` 成功后，引导用户是否将页面发布到应用菜单
- 用户直接说"发布菜单"、"添加菜单"、"菜单管理"、"查看菜单"、"修改菜单"、"删除菜单"、"移动菜单"

### 前置条件

- 环境已认证（通过 setup-env.mjs 或手动认证完成）
- bizAppNumber 已知（来自 `.kd/config.json` 的 `app` 字段，或用户明确提供）

### 接口依赖关系（强制约束）

**所有菜单操作必须遵循「先查后改」原则，禁止跳过查询直接执行写操作。**

```
queryTree（必须）→ 获得 menuId / 菜单结构 → 执行写操作 → getMenu 或 queryTree 验证结果
```

| 约束 | 说明 |
|------|------|
| **menuId 只能从接口获取** | `menuId` 只能来自 `queryTree` 返回的菜单树、`addMenu` 返回的新建菜单、或 `getMenu` 返回的详情。禁止凭记忆或猜测构造 menuId |
| **修改/删除/移动前必须先查询** | 执行 `updateMenu`、`deleteMenu`、`moveMenu` 前，必须先执行 `queryTree` 获取当前菜单树，从返回结果中确认目标 menuId 存在且状态正确 |
| **新增后必须捕获 menuId** | `addMenu` 成功后，必须从响应中提取新菜单的 `menuId` 并记录，供后续修改/移动使用 |
| **写操作后必须验证** | 任何写操作（add/update/delete/move）完成后，必须执行 `getMenu` 或 `queryTree` 验证实际状态，不能仅凭返回的 success 判断 |
| **parentMenuId 必须来自查询** | 新增子菜单时，`parentMenuId` 必须从 `queryTree` 的返回结果中获取已有菜单的 menuId，禁止猜测 |

### Step 1: 上下文准备

- 读取 `.kd/config.json` 的 `app` 字段作为 bizAppNumber
- 若从部署流程进入：formNumber = deploy 后 `.page-meta.kwp` 中 `<name>` 标签的实际值（已含 ISV 前缀）
- 若用户直接触发菜单管理：仅已知 bizAppNumber，进入 Step 2 查询菜单树

> ⚠ formNumber 必须从 deploy 后的 `.page-meta.kwp` 文件中读取 `<name>` 标签的实际值，不要自行拼接 ISV 前缀。

### Step 2: 查询并展示菜单树（任何操作的前置步骤）

**无论用户要求什么菜单操作，都必须先执行此步骤获取当前菜单状态。**

```bash
node "{menu_api}" queryTree --bizAppNumber {bizAppNumber}
```

- 按层级缩进展示，用图标区分类型（📁 分组 / 📄 页面 / 🔗 链接），展示规范见 [references/app-menu.md](app-menu.md)
- **记录所有菜单的 menuId**，后续操作必须使用这里获取到的 menuId
- 展示后根据来源引导下一步：
  - **部署后进入** → 根据表单名称和现有菜单结构，推荐菜单放置位置（分析语义关联，推荐同类分组；菜单树为空则推荐创建一级菜单）。推荐前须检查目标位置层级深度（不超过 3 级）
  - **用户直接触发** → 展示菜单树后等待用户指示操作

### Step 3: 执行菜单操作

根据用户意图执行对应操作（所有 menuId 必须来自 Step 2 的查询结果）：

| 操作 | 命令 | 执行前检查 |
|------|------|------------|
| 新增 | `addMenu --bizAppNumber {app} --name {name} --formNumber {form} [--parentMenuId {pid}] [--seq {n}]` | 确认菜单名称和位置；检查层级不超 3 级；parentMenuId 必须来自 queryTree 结果；**批量新增同级菜单时必须传递从小开始的递增 --seq 值（如 1、2、3），禁止使用大数值，范围 1–32767** |
| 修改 | `updateMenu --bizAppNumber {app} --menuId {id} [--name ...] [--visible ...] [--seq {n}]` | menuId 必须来自 queryTree 结果；修改 visible 为 0 时警告级联隐藏；修改 parentMenuId 时检查循环引用和层级 |
| 删除 | `deleteMenu --bizAppNumber {app} --menuId {id}` | menuId 必须来自 queryTree 结果；检查 HPCE 保护；警告级联删除子菜单；需停下来向用户二次确认（提供"确认删除"/"取消"两个选项） |
| 移动 | `moveMenu --bizAppNumber {app} --menuId {id} --direction {up/down}` | menuId 必须来自 queryTree 结果；展示当前排序位置；若报错「序号一致」，先用 updateMenu --seq 修改相邻菜单序号再重试 |

> 每次操作前均需将配置方案展示给用户，并停下来向用户提问获得确认后再执行。

### Step 4: 验证并展示结果

- 任何写操作完成后**必须**验证实际结果：
  - **删除操作**：优先用 `getMenu` 确认目标菜单返回 `MENU_NOT_FOUND`（菜单树可能存在短暂缓存延迟）
  - **其他写操作**：执行 `getMenu`（单个菜单）或 `queryTree`（全局）验证
- addMenu 成功后，从响应中提取并记录新菜单的 menuId
- 展示完成信息，并提供后续操作选项：
  1. 修改此菜单
  2. 移动菜单位置
  3. 删除此菜单
  4. 继续添加其他菜单
  5. 查看完整菜单树
  6. 完成

### 与部署流程的集成

`kd project deploy` 成功后：

1. **先发送页面访问链接**：生成并发送 `:::render:kdform ...:::`（见「页面访问链接」章节）
2. **再引导菜单发布**：向用户提问是否需要将页面发布到应用菜单（提供"发布到菜单"/"跳过"两个选项）

> 通过弹窗提问："部署成功，是否需要将页面发布到应用菜单？"，选项为"发布到菜单"和"跳过"。

若用户同意 → 自动进入 Step 1（bizAppNumber 和 formNumber 均已可从当前上下文获取）。

### 约束速查

| 约束 | 何时提醒 |
|------|----------|
| 菜单最多 3 级 | 新增或移动菜单时检查 |
| HPCE 菜单不可删除 | 删除前检查 menuId 是否以 HPCE 结尾 |
| 级联隐藏 | 修改 visible 从 1→0 时警告 |
| 级联删除 | 删除有子菜单的菜单时警告 |
| formNumber 取实际值 | 新增页面菜单时 |
