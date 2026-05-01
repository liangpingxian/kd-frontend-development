---
name: kd-frontend-development
description: "【KD 全栈开发技能包】覆盖金蝶前端自定义页面开发全流程：需求分析与实体澄清、页面 UE 设计与组件选型、工程脚手架初始化（kd CLI）、React/Vue/LWC 三框架组件实现、KingScript 脚本控制器开发、@kdcloudjs/shoelace 组件库集成、元数据管理（.kwc/.kwp/.kws）、环境部署与调试。当用户需求涉及 KWC 页面开发、KWC 工程创建、KWC 组件开发、KWC 应用搭建或 KingScript Controller 开发时触发。"
version: 1.0.0
---

# KD Frontend Development

## 自动化脚本使用说明

本技能提供两个自动化脚本用于替代 CLI 交互操作。脚本位于**本 SKILL.md 同级的 `scripts/` 目录**下。

### 定位脚本路径

脚本不在用户项目目录中，需要先定位。执行以下命令获取脚本所在目录：

```bash
SKILL_DIR=$(dirname "$(find ~/ -path '*/kd-frontend-development/scripts/project-init.mjs' -maxdepth 10 2>/dev/null | head -1)")
echo "脚本目录: $SKILL_DIR"
```

如果上述命令无结果，尝试在常见安装位置查找：

```bash
SKILL_DIR=$(dirname "$(find ~/.kcode ~/.qoder ~/.cursor ~/.config -path '*/kd-frontend-development/scripts/project-init.mjs' 2>/dev/null | head -1)")
```

定位成功后，使用 `$SKILL_DIR` 执行脚本：

| 脚本 | 用途 | 执行命令 |
|------|------|----------|
| project-init.mjs | 工程初始化 | `node $SKILL_DIR/project-init.mjs --name <项目名> --framework react --language ts --app <应用编码> --cwd <目标目录>` |
| setup-env.mjs | 环境配置与认证 | `node $SKILL_DIR/setup-env.mjs --envName <名称> [--envUrl <URL>] --clientId <ID> --clientSecret <Secret> --username <用户名>` |

> **⚠️ 必须先定位脚本路径再执行，禁止因找不到脚本就改用 CLI 命令。**

### 创建组件/页面/Controller

使用原生 `kd project create` 命令（在用户项目目录中执行）：

```bash
kd project create <ComponentName> --type kwc          # 创建组件
kd project create <PageName> --type page               # 创建页面
kd project create <ControllerName> --type controller   # 创建 Controller
kd project create <ControllerName> --type controller -e dev  # 创建 Controller 并指定拉取 SDK 的目标环境
```

将本技能包作为 KWC 工程脚手架工作的入口。
优先把用户需求归入以下几类：初始化项目、创建组件、创建 Controller、创建页面元数据、配置环境、部署、查看环境效果、调试。

## 组件与页面的关系约束

- 页面内组件只能从上到下垂直排列，不支持自由布局
- 一般情况下，1 个需求 = 1 个组件 + 1 个页面（页面仅包含这 1 个组件）
- 所有复杂布局（栅格、卡片、多区域等）在组件内部实现，不要拆成多个组件
- 禁止将一个页面的不同区域（如统计卡片区、图表区、列表区）拆分为独立组件

## 正确认知交付对象

不要把 KWC 工作流理解成“本地把一个组件渲染出来”。
KWC 的核心交付对象是：

1. 组件工程本身（前端代码 + 组件元数据 `.js-meta.kwc`）
2. 页面元数据 `*.page-meta.kwp`
3. KS Controller 元数据 `*.kws` 和脚本代码（当功能涉及后端数据交互时）
4. 目标环境配置与认证
5. 通过 `kd project deploy` 上传后的环境渲染结果

页面最终展示依赖页面元数据中的 `<controls>` 和组件类型映射，而不是本地 `main.tsx` 是否挂载了某个组件。
main.tsx` 和 `npm run dev` 只用于本地辅助预览，不是最终交付路径。

KWC 不仅是前端开发框架。当页面需要读取或操作业务数据时，KS Controller 提供后端 REST API 能力，通过 KingScript 脚本访问苍穹平台的数据查询、业务操作等服务。一个完整的业务功能通常包含前端组件（展示与交互）和后端 Controller（数据获取与业务逻辑）两部分。

Controller 也遵循"元数据 + 代码"的二元模型：
- Controller 元数据（.kws）：定义路由 URL、HTTP 方法、权限策略等声明式配置
- Controller 脚本代码（.ts）：实现具体的业务逻辑

这与前端的"组件元数据 .kwc + 组件代码"模式完全对称。

## 元数据驱动的全栈开发模型

从用户开发角度看，一个完整的 KWC 功能最多涵盖以下层次：

**前端（展示与交互）：**
1. 组件代码（*.tsx / *.vue / *.js）：负责渲染和交互逻辑
2. 组件元数据 `.js-meta.kwc`：声明"这个组件可以被页面如何引用、可以暴露哪些可配置属性"
3. 页面元数据 `.page-meta.kwp`：声明"这个页面由哪些组件实例组成，并给每个实例传什么属性值"

**后端（数据与业务逻辑）：**
4. Controller 元数据 `.kws`：声明"这个 Controller 暴露哪些 API 端点、使用什么 HTTP 方法、需要什么权限"
5. Controller 脚本代码（*.ts）：实现具体的数据查询、业务操作等后端逻辑

前端和后端都遵循"元数据先行、代码实现跟进"的模式——先声明结构和契约，再填充实现。

因此，面对需求时不要只问“要写几个组件”，还要继续判断：

- 哪些参数是写死在组件代码里的
- 哪些参数需要暴露给页面配置者，通过组件元数据定义为 `<property>`
- 哪些组件实例会出现在页面元数据的 `<controls>` 中
- 组件是否需要调用后端 API 获取数据或提交操作
- 若需要，Controller 元数据（.kws）需要定义哪些 API 端点（URL、HTTP 方法、权限）
- Controller 脚本需要调用哪些 SDK 能力（数据查询、业务操作等）

默认原则：

- 能固定在组件内部的实现细节，不要暴露到元数据
- 只有需要被页面装配、复用、配置的参数，才进入组件元数据和页面元数据

## 先把需求翻译成工程目标

面对“帮我开发一个 KWC 页面/功能”的请求时，先把需求翻译成下面几项：

1. 是否需要新建工程，还是在已有工程里继续开发
2. 是否需要组件（通常 1 个需求 = 1 个组件），组件承担什么职责
3. 组件是否需要后端数据支持？若需要，规划对应的 KS Controller 和 API 方法
4. 需要几个页面元数据文件（通常 1 个页面包含 1 个组件）
5. 最终要部署到哪个环境

只有把这几项补齐，脚手架命令才有明确目标。

## 框架开发 Skill 协作

将本技能包视为 KWC 工作流的总入口，但不要让脚手架工作流吞掉框架子技能的职责。

### 硬性约束：代码实现必须遵循框架子技能规范

**当任务进入"实现组件代码"阶段时，必须遵循以下强制规则：**

1. **禁止直接编写代码**：脚手架工作流严禁直接编写、修改任何组件实现代码（*.tsx / *.vue / *.js）和 Controller 脚本代码（*.ts）
2. **必须先阅读对应子技能文档**：前端代码阅读对应框架子技能的 SKILL.md（kwc-react/vue/lwc-development），Controller 代码阅读 `./kwc-ks-controller-development/SKILL.md`
3. **禁止凭通用知识自行编写**：KingScript 运行时的 request/response API 与 Node.js / Java Servlet 完全不同，凭通用经验编写的代码将部署失败
4. **多环节任务不是例外**：即使当前任务涉及工程搭建 + 元数据 + Controller + 前端组件多个环节，每进入一个代码编写阶段都必须阅读对应子技能文档并遵循其规范，不可"一口气"跳过
5. **框架识别依据**：
   - 新建工程：以 project-init.mjs 初始化时指定的 --framework 参数为准
   - 已有工程：以 `.kd/config.json` 中的 `framework` 字段为准
   - 若无法识别 framework，默认使用 `react` + `ts`；若用户明确指定了其他框架（Vue/LWC），则按用户指定的执行

### 协作边界表

| 任务阶段 | 负责 Skill | 产出物 |
|----------|------------|--------|
| 工程初始化 | scaffold | .kd/config.json |
| 创建组件目录 | scaffold | app/kwc/Component/ |
| **页面设计（🔴 必读）** | **scaffold + [page-design-guide](./references/page-design-guide.md)**（每个新需求必须先读，禁止跳过） | **页面模板选型、组件组合方案**——禁止直接复用已有组件布局替代阅读设计指南 |
| **编写组件代码** | **[react](./kwc-react-development/SKILL.md)/[vue](./kwc-vue-development/SKILL.md)/[lwc-development](./kwc-lwc-development/SKILL.md)** | ***.tsx / *.vue / *.js** |
| 补全组件元数据 | scaffold | *.js-meta.kwc |
| 创建页面元数据 | scaffold | *.page-meta.kwp |
| 环境配置与部署 | scaffold | 环境渲染结果 |
| 创建 Controller 目录 | scaffold | app/ks/controller/ControllerName/ |
| 补全 Controller 元数据 | scaffold | *.kws（URL、方法、权限配置） |
| 构建 Controller | scaffold | dist/controller/ |
| **编写 Controller 脚本代码** | **[kwc-ks-controller-development](./kwc-ks-controller-development/SKILL.md)** | **.ts 脚本（业务逻辑实现）** |

#### 切换时机

- 当任务仍处于需求拆分、脚手架命令、元数据、环境、`deploy`、`open`、`debug` 阶段时，继续由脚手架工作流主导
- 当 `kd project create` 创建完成后需写代码 → **必须阅读对应框架子技能的 SKILL.md 并遵循其规范，禁止直接编写**
- 当代码写完需补元数据或部署 → 回到脚手架工作流
- 当 Controller 目录已创建且需要编写脚本代码 → **必须阅读 [kwc-ks-controller-development](./kwc-ks-controller-development/SKILL.md) 并遵循其规范，禁止直接编写**
- 当 Controller 脚本代码写完需构建或部署 → 回到脚手架工作流

#### 异常流程保护

当 `kd project create` 命令失败而改用手动方式创建文件/目录时，代码编写阶段的子技能规范遵循规则**同样适用**。手动创建目录结构不等于可以手动编写业务代码。

- 只要进入 `.ts` / `.tsx` / `.vue` / `.js` 文件的编写，无论前置步骤是否通过 CLI 完成，都**必须先阅读对应框架子技能的 SKILL.md 并遵循其规范**
- 典型场景：`kd project create` 失败 → 手动创建 `app/kwc/MyComponent/` 目录和 `.js-meta.kwc` → 到这里仍是脚手架职责 → 开始写 `MyComponent.tsx` 时 → **必须阅读对应框架子技能的 SKILL.md**
- Controller 同理：手动创建 `app/ks/controller/` 目录和 `.kws` → scaffold 职责 → 开始写 `.ts` 脚本 → **必须阅读 [kwc-ks-controller-development](./kwc-ks-controller-development/SKILL.md)**

#### 框架子技能激活检查清单

在进入代码实现阶段前，确认以下事项：

- [ ] 已识别当前工程 framework（react/vue/lwc）
- [ ] 已阅读对应框架子技能的 SKILL.md（kwc-*-development）
- [ ] 框架子技能的 rule.md 约束已加载并生效
- [ ] 脚手架工作流不再直接处理任何代码文件内容

#### 推荐规则

1. 若是新建工程，以 project-init.mjs 初始化时指定的 --framework 参数作为后续推荐 Skill 依据
2. 若是已有工程，以 `.kd/config.json` 中的 `framework` 作为推荐 Skill 依据
3. 当 `framework=react` 时，**必须**阅读 [kwc-react-development](./kwc-react-development/SKILL.md) 并遵循其规范
4. 当 `framework=vue` 时，**必须**阅读 [kwc-vue-development](./kwc-vue-development/SKILL.md) 并遵循其规范
5. 当 `framework=lwc` 时，**必须**阅读 [kwc-lwc-development](./kwc-lwc-development/SKILL.md) 并遵循其规范
6. 若还无法判断 framework，默认使用 `react` + `ts`；若用户明确指定了其他框架（Vue/LWC），则按用户指定的执行
7. 当任务涉及 Controller/脚本控制器代码编写时，**必须**阅读 [kwc-ks-controller-development](./kwc-ks-controller-development/SKILL.md) 并遵循其规范
8. Controller 代码实现与前端框架无关，不受 framework 字段影响

注意：不要同时阅读三个框架子技能的文档；只根据当前工程的 framework 引用一个。

## 用户交互约定

当需要向用户提问、确认决策或让用户做选择时，**必须停下来向用户提问，并提供明确的选项供用户选择**，禁止在对话中以纯文本方式输出问题后继续执行。

### 规则

1. 一次只问**当前最阻塞**的一个问题
2. 每个问题必须附带 2-4 个**明确的可选项**，让用户可以直接点选（用户始终可以自由输入其他答案）
3. 如果有候选数据（如查询到的表单列表、框架选项等），将候选项作为选项提供
4. 删除、发布等**敏感动作**必须先向用户确认后再执行（注意：部署不属于敏感动作，创建组件/页面后默认自动部署）
5. 用户未回答前，**禁止**进入依赖该答案的后续步骤

### 示例

**框架默认行为**：
用户未指定框架时，默认使用 React + TypeScript 开发 KWC 组件，无需询问用户。若用户明确指定了其他框架（Vue/LWC），则按用户指定的执行。

**部署行为**：
创建组件/页面后，默认执行部署到当前环境（`kd project deploy`），无需等待用户确认。仅当用户明确表示不需要部署时才跳过。若环境未配置，应提示用户先配置环境，而非跳过部署。

**菜单发布**：
向用户提问："部署成功，是否需要将页面发布到应用菜单？"，提供以下选项：
- 发布到菜单：将页面添加到应用菜单树
- 跳过：暂不发布菜单，稍后手动配置

## 需要用户提供或确认的输入

这些输入若无法从现有工程或上下文推断，就必须停下来向用户提问并提供选项确认：

- 项目名或现有项目路径
- 框架和语言（用户未指定时默认使用 `react` + `ts`，无需询问）
- 苍穹应用编码 `app`
- 目标环境别名和 URL
- 认证方式，以及 OpenAPI 所需的真实参数
- 页面标识，例如 page name，以及业务页面用途
- 哪些组件需要暴露给页面使用，哪些只是内部逻辑组件
- 哪些参数需要做成可配置属性
- 若用户已有环境，是否允许直接部署到该环境

这些信息不要擅自编造，尤其是 `app`、环境 URL、认证参数和最终部署环境。

关于 `isv`（开发商标识）：开发阶段可以留空，在组件与环境绑定时会从环境拉取开发商标识，`kd project deploy` 时会自动写入组件和页面元数据，因此不需要用户手工提供或维护。

对 `app` 使用最严格的规则（本节为全文唯一权威定义）：

- `app` 必须由用户明确提供，或来自 `.kd/config.json`
- 不可猜测、不可使用示例值
- 新建工程时作为 project-init.mjs 的 --app 参数传入
- 若无 `app`，不继续生成元数据或部署
- **ISV 前缀校验**：`app` 编码的标准格式为 `{isv}_{应用名}`（如 `kdtest_kwc_test`，ISV 前缀为 `kdtest_`）。`kingdee` 开头的应用无需 ISV 前缀（如 `kingdee_xxx`）。若从上下文或用户输入判断 `app` 编码缺少 ISV 前缀且不是 `kingdee` 开头，必须向用户确认完整的 app 编码

## 由 Skill 自动决策或生成的内容

这些内容应由 Skill 基于用户需求主动完成，不要把它们再推回给用户逐项设计：

- 将业务需求映射为组件（通常 1 个需求 = 1 个组件，所有复杂布局在组件内部完成）
- 为组件生成稳定的 `PascalCase` 名称
- 为页面和实例生成符合规范的小写标识
- 判断组件是否需要保留 `.js-meta.kwc`，还是应删除以避免被当成可部署组件
- 将需求映射为组件元数据里的 `<property>`
- 为页面生成 `page-meta.kwp` 并填充 `<controls>`
- 为页面中的每个组件实例生成唯一 `name`
- 判断当前该执行 `init`、`create`、`deploy`、`open` 还是 `debug`
- 查看环境效果时结合当前任务和页面元数据，自行判断使用 `kd open` 的目标页面；仅当用户明确要求本地联调时才使用 `kd debug`
- 仅当对应元数据文件变更并需要重新上传时，递增该元数据的 `version`
- 在环境操作后复核 `kd env info`

默认策略是：对不可推断的关键环境参数停下来向用户提问确认，由 Skill 负责把需求落实成工程结构和元数据。

`app` 是例外：即使在自动决策范围内，也必须严格遵守"需要用户提供或确认的输入"中的 `app` 规则。

## 从需求生成组件元数据

当用户要“开发一个页面功能”时，不要等到最后才补 `.js-meta.kwc`。
应在组件职责确定后，立即判断组件元数据应如何生成。

按这个顺序处理：

1. 先识别组件是否会被页面元数据直接引用。
2. 若会被页面引用，就保留并完善对应的 `.js-meta.kwc`。
3. 若组件只是内部复用逻辑、不需要在元数据页面中声明，可删除对应 `.js-meta.kwc`，避免被脚手架当作可部署组件。
4. 将“页面配置者可调的参数”提炼为 `<property>`，不要把所有内部 props 都暴露出去。

组件元数据至少应关注这些字段：

- `version`：自然数；脚手架模板可能留空，Skill 需要补成有效值
- `name`：通常与组件名保持一致，作为组件类型标识
- `masterLabel`：组件的中文名称（如「销售订单卡片」「采购申请列表」），作为组件在页面装配侧的显示标题
- `isv`：开发商标识，开发阶段可留空，deploy 时自动从环境拉取写入
- `app`：规则见“需要用户提供或确认的输入”一节
- `framework`
- `targets`
- `targetConfigs`

如果需要字段规则、类型和示例，读取：

- `references/component-metadata.md`（**🔴 必读 — 首次接触工程**：第一次为该项目写组件元数据时必读一次；后续可复用已建立的认知）

## 从需求生成页面元数据

页面元数据不是简单“列出组件名称”，而是把用户要的页面装配结构显式写出来。

按这个顺序处理：

1. 先确定页面名称、标题、所属应用、业务单元、版本策略。
2. 根据需求把页面拆成一个或多个组件实例。
3. 为每个实例生成 `<control>`。
4. `control.type` 必须与组件元数据里的组件 `name` 完全一致，包含大小写也必须一致。
5. `control.name` 是页面内唯一实例名，必须符合页面元数据命名规范。
6. 只有组件元数据中定义过的属性，才能写进 `<propertys>`。

例如，若组件元数据中的 `name` 是 `OverviewCard`，则页面元数据里的 `control.type` 只能写 `OverviewCard`。
不要因为组件目录在 `app/kwc/` 下，就擅自写成 `kwc_OverviewCard`；这类前缀不是组件类型名的一部分。

页面字段默认策略：

- `name` 长度不得超过 **20 个字符**（系统会自动拼接 ISV 前缀如 `kdtest_`，总长度有限制）
- `masterLabel`：页面的中文名称（如「销售订单」「采购申请」「库存查询」），作为页面在导航和管理界面的显示标题
- `template` 默认使用 `oneregion`
- `isv` deploy 时自动写入，无需手填
- `app` 规则见“需要用户提供或确认的输入”一节

如果需要字段规则、校验约束和示例，读取：

- `references/page-metadata.md`（**🔴 必读 — 首次接触工程**：第一次为该项目写页面元数据时必读一次；后续可复用已建立的认知）

## 先判断当前所处阶段

按这个顺序判断并推进：

1. 若当前目录下不存在 `.kd`，先视为“尚未初始化 KWC 工程”。
2. 若用户要新建页面或组件，使用 `kd project create` 命令创建，不要手工拼目录结构。
3. 若用户要部署或调试，先检查环境是否已配置（可通过 `kd env list` 查看）。
4. 若用户开始编写具体前端实现代码，先判断当前工程 framework，再阅读对应框架子技能的 SKILL.md 并遵循其规范，不要把脚手架工作流当成组件编码规范。

## 执行前置检查

先确认以下前提：

- 将 `Project` 理解为本地工程目录。
- 将 `Env` 理解为远端苍穹环境。
- 提醒用户本地需具备 `node`、`npm`、`git`。

## 初始化工程

> **⚠️ 必须通过脚本执行，禁止直接在终端运行任何 kd CLI 交互式命令。**

在用户尚未拥有 KWC 工程时，按以下流程执行：

### 必须使用自动化脚本

**必须使用 `project-init.mjs` 脚本完成工程初始化，禁止直接执行 CLI 交互式命令。**

使用 `project-init.mjs` 一键完成工程初始化，AI 需先向用户收集**项目名**和**应用编码 `app`**（规则见"需要用户提供或确认的输入"一节），框架默认 `react` + `ts`（用户未指定时无需询问）：

> 脚本位于本技能安装目录的 `scripts/` 子目录下，不在用户项目目录中。请先确定本 SKILL.md 文件的绝对路径，然后执行：

```bash
node $SKILL_DIR/project-init.mjs --name <项目名> --framework react --language ts --app <应用编码> --cwd <目标父目录绝对路径>
```

> **注意**：脚本默认不执行 `npm install`。初始化完成后，提示用户在终端中手动执行：
> ```bash
> cd <项目目录> && npm install
> ```

**必填参数：**
- `--name` / `--framework` / `--language` / `--app`

**关于 `--cwd`（强烈建议显式传入）：**
- 工程会生成在 `<cwd>/<name>` 中；若不传 `--cwd`，脚本使用 `process.cwd()`
- 在多 workspace / 脚本被外部调度的场景下，`process.cwd()` 可能不是用户期望的父目录，导致工程生成位置跑偏（例如建到 workspace 同级目录）
- 应始终显式传入用户希望的**目标父目录绝对路径**

**可选参数（网络加速）：**
- `--registry <url>`：指定 npm 镜像地址，国内网络推荐 `https://registry.npmmirror.com`
- 环境变量 `KWC_NPM_REGISTRY`：未显式传 `--registry` 时，脚本读取此环境变量作为默认值

**脚本行为：**
- 自动检测并安装 kd CLI（无需手动安装）
- 以 `kd project init <name> --framework <fw> --language <lang> --app <app>` 原生参数无交互完成工程初始化（跨平台，macOS / Linux / Windows 通用）
- 脚本默认不执行 `npm install`，初始化完成后提示用户手动执行 `cd <项目目录> && npm install`
- 若用户明确指定了其他框架（Vue/LWC），将 `--framework` 和 `--language` 参数替换为对应值即可

**返回 JSON 关键字段：**
- `success` / `project` / `framework` / `language` / `app` / `path` / `installed`
- 始终包含 `nextSteps` 字段，AI 应提示用户在终端中手动执行其中的命令（`cd <项目目录> && npm install`）

## 创建组件

在已有项目中新增组件时，使用 `kd project create` 命令：

```bash
kd project create <ComponentName> --type kwc
```

- 组件名使用 `PascalCase`
- 若需创建多个组件，逐个执行创建命令
- 牢记「组件与页面的关系约束」：通常 1 个需求只需要 1 个组件，所有复杂布局在组件内部完成

### 创建后处理（无论使用哪种方式）

1. **立刻检查生成出来的 `.js-meta.kwc`，补齐可部署所需字段和属性定义**（这是本 Skill 的职责）。
2. **组件代码实现**：确认 `.js-meta.kwc` 补齐后，必须停止脚手架工作流的代码编写，阅读对应的框架子技能文档（[kwc-react-development](./kwc-react-development/SKILL.md) / [kwc-vue-development](./kwc-vue-development/SKILL.md) / [kwc-lwc-development](./kwc-lwc-development/SKILL.md)）并遵循其规范来编写组件实现代码。

若用户只提供了页面结构想法，没有组件名，先根据语义生成稳定、可复用的组件名，再创建。
若用户给的是完整业务诉求，而不是组件清单，先主动拆分组件职责，再批量创建。

补充：
- 组件生成在 `app/kwc/<ComponentName>/` 下
- 脚手架生成的 `.js-meta.kwc` 只是模板，需按上述规则补齐
- **严禁在脚手架工作流中直接修改组件代码文件（*.tsx / *.vue / *.js），代码实现必须遵循框架子技能规范**

## 创建 Controller

在已有项目中新增 KingScript 脚本控制器时，使用 `kd project create` 命令：

```bash
kd project create <ControllerName> --type controller
kd project create <ControllerName> --type controller -e dev  # 指定拉取 SDK 的目标环境
```

- Controller 名使用 `PascalCase`，建议以 `Controller` 后缀结尾
- 若需创建多个 Controller，逐个执行创建命令
- `--env` / `-e` 可选，指定拉取 SDK 的目标环境

### 创建后处理（无论使用哪种方式）

1. 检查生成的 .kws 元数据文件，补齐必填字段（name/isv/app/version/url/scriptFile/methods）。
2. **Controller 代码实现**：确认 .kws 元数据补齐后，必须停止脚手架工作流的代码编写，阅读 [kwc-ks-controller-development](./kwc-ks-controller-development/SKILL.md) 并遵循其规范来编写控制器脚本代码。

补充：
- Controller 与前端组件（KWC）是独立的工程实体，可以在同一个项目中共存
- 脚手架生成的 .kws 元数据只是模板，需按控制器开发指南补齐
- **严禁在脚手架工作流中直接修改 Controller 脚本代码（*.ts），代码实现必须遵循 [kwc-ks-controller-development](./kwc-ks-controller-development/SKILL.md) 规范**

## 创建页面元数据

页面元数据是最终交付链路的核心。
环境在部署后会根据 `page-meta.kwp` 的 `<controls>` 来渲染页面包含的组件，因此这里不是可选步骤，而是页面交付的主入口。

在需要新增页面时，使用 `kd project create` 命令：

```bash
kd project create <page_name> --type page
```

不要忽略以下约束：

- `type` 是组件类型名，必须与组件元数据中的组件 `name` 完全一致，不能只做到语义对应或名称相近。
- `name` 是组件实例名，需要在页面内唯一。
- `isv` 开发阶段可留空，deploy 时会自动从环境拉取并写入
- `app` 规则见“需要用户提供或确认的输入”一节

若需要字段规则、校验约束和示例，读取 `references/page-metadata.md`。

补充：新生成的 `page-meta.kwp` 默认只包含注释掉的 `<control>` 模板，Skill 必须根据需求主动补全 `<controls>`。

### 工程流程编排

> **条件触发**：需求含后端数据交互 / 含 Controller / 含实体识别 / 前后端联合开发时**必读**。
> 阅读 `references/workflow-orchestration.md` 获取完整编排流程（包含需求前后端评估、实体识别与澄清、前后端统一编排、仅前端编排、仅后端编排）。

### 页面设计与 UI 布局

> **🔴 必读 — 每个新需求**：只要产出新页面/新组件就**必须先读**，用于选模板、定布局。**禁止跳过直接复用已有组件的布局**。
> 阅读 [`references/page-design-guide.md`](./references/page-design-guide.md) 获取页面设计与 UI 布局指南（工作台/图表/个性化/表单/列表/向导模板）。
>
> ⚠️ **禁止以"工程中已有类似组件可参考"为由跳过阅读 page-design-guide.md。**
> 不同类型的页面（工作台/图表/向导/列表/表单）有不同的最佳模板，必须先选型再实现。

### 环境配置与部署

> **条件触发**：新建环境 / 首次部署 / 菜单发布 / 部署失败排查时**必读**。
> 阅读 `references/deployment-guide.md` 获取完整流程（包含环境存在性检查、新建环境流程、多数据中心处理、构建与部署决策树、页面访问链接生成规则、应用菜单管理）。

### 元数据查询与故障排查

> **故障时触发**：元数据上传失败 / CLI 报错 / 需查询环境元数据时**必读**。
> 阅读 `references/metadata-operations.md`（包含元数据查询工作流、参考资料与快速导航、故障排查速查表、CLI 手动降级方案）。

### 参考文档触发标准

| 文件 | 触发级别 | 硬判定标准 |
|------|---------|------------|
| [`references/page-design-guide.md`](./references/page-design-guide.md) | **🔴 必读** — 每个新需求 | 只要产出新页面/新组件就必须先读，用于选模板、定布局。**禁止跳过直接复用已有组件的布局** |
| [`references/component-metadata.md`](./references/component-metadata.md) | **🔴 必读** — 首次接触工程 | 第一次为该项目写组件元数据时必读一次；后续可复用已建立的认知 |
| [`references/page-metadata.md`](./references/page-metadata.md) | **🔴 必读** — 首次接触工程 | 第一次为该项目写页面元数据时必读一次；后续可复用已建立的认知 |
| [`references/workflow-orchestration.md`](./references/workflow-orchestration.md) | 条件触发 | 需求含后端数据交互 / 含 Controller / 含实体识别 / 前后端联合开发时必读 |
| [`references/deployment-guide.md`](./references/deployment-guide.md) | 条件触发 | 新建环境 / 首次部署 / 菜单发布 / 部署失败排查时必读 |
| [`references/metadata-operations.md`](./references/metadata-operations.md) | 故障时触发 | 元数据上传失败 / CLI 报错 / 需查询环境元数据时必读 |

## 端到端执行原则

当用户说“帮我开发一个 KWC 页面/功能”时，默认按这条链路推进：

1. 识别是新工程还是已有工程
2. 收集不可推断的环境输入
3. 评估需求是否涉及后端数据交互，若是则规划 Controller
4. 拆分组件并创建组件工程；若需要 Controller，一并创建 Controller 工程
5. 补全所有元数据：组件元数据 `.js-meta.kwc`、Controller 元数据 `.kws`（若有）
6. **页面设计（🔴 必读，禁止跳过）**：**必须**阅读 [`references/page-design-guide.md`](./references/page-design-guide.md)，确定页面模板和组件布局方案
   > ⚠️ **禁止以"工程中已有类似组件可参考"为由跳过阅读 page-design-guide.md。**
   > 不同类型的页面（工作台/图表/向导/列表/表单）有不同的最佳模板，必须先选型再实现。
7. 实现前端组件代码（阅读对应框架子技能的 SKILL.md 并遵循其规范）
8. 若有 Controller，实现 Controller 脚本代码（阅读 [kwc-ks-controller-development](./kwc-ks-controller-development/SKILL.md) 并遵循其规范）
9. 创建并补全页面元数据
10. 若有 Controller，执行 `npm run build:controller`
11. **自动部署**：先执行 `kd env list` 检查已有环境。若有已认证环境，直接执行 `kd project deploy -e <环境名>`（无需询问用户）；若无环境，先收集环境信息并配置，再部署。详见「部署决策（默认自动部署）」章节
12. **【立即】部署成功后，生成并发送页面访问链接**（`:::render:kdform {"title":"...","url":"..."}:::`）——这是部署流程的完成标志，不可跳过或延迟。**JSON 只允许 `title` 和 `url` 两个字段，`url` 必须是完整的 HTTP/HTTPS URL（含环境域名 + formId 参数）**，详见「页面访问链接」章节
13. [可选] 若用户明确要求"打开页面"或"查看效果"，执行 `kd open`
14. [可选] 若用户明确要求本地联调，执行 `kd debug`

不要只完成其中的"创建组件"或"本地跑起来"，除非用户明确只要某个局部步骤。

## 输出要求

输出方案或执行命令时，尽量同时给出：

- 用户还需要补充哪些关键输入
- 当前处于哪个阶段
- 下一条应执行的命令
- 是否依赖已有环境认证
- 是否需要修改 `page-meta.kwp`
- 页面元数据将如何组合组件
- 部署默认执行，是否用户明确要求跳过部署
- 若需要部署，是否因为元数据变更而必须递增 `version`
- 部署成功后是否已发送页面访问链接（`:::render:kdform ...:::`，见「页面访问链接」章节）

## 子技能路由表

本技能包含以下子技能，根据上下文自动引用对应文档：

| 子技能 | 用途 | 激活条件 | 入口文件 |
|--------|------|---------|----------|
| kwc-react-development | React 框架下的 KWC 组件代码编写 | `.kd/config.json` 中 `framework=react` | [SKILL.md](./kwc-react-development/SKILL.md) |
| kwc-vue-development | Vue 3 框架下的 KWC 组件代码编写 | `.kd/config.json` 中 `framework=vue` | [SKILL.md](./kwc-vue-development/SKILL.md) |
| kwc-lwc-development | LWC 框架下的 KWC 组件代码编写 | `.kd/config.json` 中 `framework=lwc` | [SKILL.md](./kwc-lwc-development/SKILL.md) |
| kwc-ks-controller-development | KingScript 脚本控制器开发 | `app/ks/controller/` 目录已存在 | [SKILL.md](./kwc-ks-controller-development/SKILL.md) |
| kingscript-code-generator | Kingscript 代码生成、SDK 索引检索、风险审查 | Kingscript 二开或 KS Controller 编写 | [SKILL.md](./kingscript-code-generator/SKILL.md) |

### 路由规则

1. **KWC 工程开发**：本文档（脚手架工作流）为主入口，代码实现阶段根据 framework 配置引用对应框架子技能
2. **Controller 开发**：识别后端需求后引用 kwc-ks-controller-development，遇 SDK/语言问题参考 kingscript-code-generator
3. **Kingscript 二开/插件**：直接引用 kingscript-code-generator


