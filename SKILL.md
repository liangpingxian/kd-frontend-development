---
name: kd-frontend-development
description: "【KD 全栈开发技能包】覆盖金蝶前端自定义页面开发全流程：需求分析与实体澄清、页面 UE 设计与组件选型、工程脚手架初始化（kd CLI）、React/Vue/LWC 三框架组件实现、KingScript 脚本控制器开发、@kdcloudjs/shoelace 组件库集成、元数据管理（.kwc/.kwp/.kws）、环境部署与调试。当用户需求涉及 KWC 页面开发、KWC 工程创建、KWC 组件开发、KWC 应用搭建或 KingScript Controller 开发时触发。"
version: 1.0.0
---

# KD Frontend Development

## 自动化脚本使用说明

本技能提供三个自动化脚本用于替代 CLI 交互操作。脚本位于**本 SKILL.md 同级的 `scripts/` 目录**下。

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
| batch-create.mjs | 批量创建 | `node $SKILL_DIR/batch-create.mjs --components A,B --pages x,y --controllers Z` |

> **⚠️ 必须先定位脚本路径再执行，禁止因找不到脚本就改用 CLI 命令。**

将本技能包作为 KWC 工程脚手架工作的入口。
优先把用户需求归入以下几类：初始化项目、创建组件、创建 Controller、创建页面元数据、配置环境、部署、查看环境效果、调试。

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
2. 需要几个组件，各自承担什么职责
3. 组件是否需要后端数据支持？若需要，规划对应的 KS Controller 和 API 方法
4. 需要几个页面元数据文件，页面里如何组合这些组件
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
- 当 batch-create.mjs 脚本创建完成后需写代码 → **必须阅读对应框架子技能的 SKILL.md 并遵循其规范，禁止直接编写**
- 当代码写完需补元数据或部署 → 回到脚手架工作流
- 当 Controller 目录已创建且需要编写脚本代码 → **必须阅读 [kwc-ks-controller-development](./kwc-ks-controller-development/SKILL.md) 并遵循其规范，禁止直接编写**
- 当 Controller 脚本代码写完需构建或部署 → 回到脚手架工作流

#### 异常流程保护

当自动化脚本失败（如 `batch-create.mjs` 报错）而改用手动方式创建文件/目录时，代码编写阶段的子技能规范遵循规则**同样适用**。手动创建目录结构不等于可以手动编写业务代码。

- 只要进入 `.ts` / `.tsx` / `.vue` / `.js` 文件的编写，无论前置步骤是否通过 CLI 完成，都**必须先阅读对应框架子技能的 SKILL.md 并遵循其规范**
- 典型场景：`batch-create.mjs` 脚本失败 → 手动创建 `app/kwc/MyComponent/` 目录和 `.js-meta.kwc` → 到这里仍是脚手架职责 → 开始写 `MyComponent.tsx` 时 → **必须阅读对应框架子技能的 SKILL.md**
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

- 将业务需求拆成组件列表
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

- `references/component-metadata.md`

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

- `references/page-metadata.md`

## 先判断当前所处阶段

按这个顺序判断并推进：

1. 若当前目录下不存在 `.kd`，先视为“尚未初始化 KWC 工程”。
2. 若用户要新建页面或组件，优先使用 batch-create.mjs 脚本，不要手工拼目录结构。
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

**必填参数：**
- `--name` / `--framework` / `--language` / `--app`

**关于 `--cwd`（强烈建议显式传入）：**
- 工程会生成在 `<cwd>/<name>` 中；若不传 `--cwd`，脚本使用 `process.cwd()`
- 在多 workspace / 脚本被外部调度的场景下，`process.cwd()` 可能不是用户期望的父目录，导致工程生成位置跑偏（例如建到 workspace 同级目录）
- 应始终显式传入用户希望的**目标父目录绝对路径**

**可选参数（应对 npm 超时 / 网络加速）：**
- `--skipInstall`：跳过 `npm install`，脚本立即返回。**适用于 CI / AI agent 120s 超时限制场景**；返回 JSON 中 `installed: false` + `nextSteps: ["cd <path>", "npm install"]`，由调用方在长驻终端中自行执行
- `--registry <url>`：指定 npm 镜像地址，国内网络推荐 `https://registry.npmmirror.com`
- 环境变量 `KWC_NPM_REGISTRY`：未显式传 `--registry` 时，脚本读取此环境变量作为默认值

**脚本行为：**
- 自动检测并安装 kd CLI（无需手动安装）
- 以 `kd project init <name> --framework <fw> --language <lang> --app <app>` 原生参数无交互完成工程初始化（跨平台，macOS / Linux / Windows 通用）
- 执行 `npm install`（除非 `--skipInstall`），每 30s 打一次心跳输出，避免外部调用方误判卡死
- 若用户明确指定了其他框架（Vue/LWC），将 `--framework` 和 `--language` 参数替换为对应值即可

**返回 JSON 关键字段：**
- `success` / `project` / `framework` / `language` / `app` / `path` / `installed`
- `--skipInstall` 时额外含 `nextSteps`，AI 应把其中的命令在长驻终端里顺序执行

## 创建组件

> **⚠️ 必须通过脚本执行，禁止直接在终端运行任何 kd CLI 交互式命令。**

在已有项目中新增组件时：

### 必须使用批量创建脚本

**必须使用 `batch-create.mjs` 脚本完成组件创建，禁止直接执行 CLI 交互式命令。**

当需要创建一个或多个组件时，使用 `batch-create.mjs` 一次性完成：

> 脚本位于本技能安装目录的 `scripts/` 子目录下，不在用户项目目录中。请先确定本 SKILL.md 文件的绝对路径，然后执行：

```bash
node $SKILL_DIR/batch-create.mjs --components ComponentA,ComponentB,ComponentC [--env dev]
```

- 支持同时传入 `--components`、`--pages`、`--controllers` 参数，一次性批量创建所有工程结构
- 组件名使用 `PascalCase`，多个组件用英文逗号分隔
- `--env` 可选，指定 Controller 拉取 SDK 的目标环境

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

> **⚠️ 必须通过脚本执行，禁止直接在终端运行任何 kd CLI 交互式命令。**

在已有项目中新增 KingScript 脚本控制器时：

### 必须使用批量创建脚本

**必须使用 `batch-create.mjs` 脚本完成 Controller 创建，禁止直接执行 CLI 交互式命令。**

当需要创建一个或多个 Controller 时，使用 `batch-create.mjs` 一次性完成：

> 脚本位于本技能安装目录的 `scripts/` 子目录下，不在用户项目目录中。请先确定本 SKILL.md 文件的绝对路径，然后执行：

```bash
node $SKILL_DIR/batch-create.mjs --controllers ControllerA,ControllerB [--env dev]
```

- Controller 名使用 `PascalCase`，建议以 `Controller` 后缀结尾，多个用英文逗号分隔
- `--env` 可选，指定拉取 SDK 的目标环境
- 支持同时传入 `--components`、`--pages`、`--controllers` 参数，一次性批量创建所有工程结构

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

在需要新增页面时：

**必须使用批量创建脚本**：使用 `batch-create.mjs` 批量创建（可同时创建组件、页面、Controller）：

> 脚本位于本技能安装目录的 `scripts/` 子目录下，不在用户项目目录中。请先确定本 SKILL.md 文件的绝对路径，然后执行：

```bash
node $SKILL_DIR/batch-create.mjs --pages page1,page2 [--components ComponentA --controllers ControllerB --env dev]
```

不要忽略以下约束：

- `type` 是组件类型名，必须与组件元数据中的组件 `name` 完全一致，不能只做到语义对应或名称相近。
- `name` 是组件实例名，需要在页面内唯一。
- `isv` 开发阶段可留空，deploy 时会自动从环境拉取并写入
- `app` 规则见“需要用户提供或确认的输入”一节

若需要字段规则、校验约束和示例，读取 `references/page-metadata.md`。

补充：新生成的 `page-meta.kwp` 默认只包含注释掉的 `<control>` 模板，Skill 必须根据需求主动补全 `<controls>`。

## 脚手架命令的推荐编排

### 需求前后端评估

面对完整业务需求时，按以下优先级判断是否需要 Controller：

**强信号（命中任意一条即直接判定需要 Controller，无需询问用户）：**
- 需求涉及列表/表格数据展示（如"XX列表"、"XX查询"、"XX监控"）
- 需求涉及筛选/搜索/过滤条件
- 需求涉及图表/报表/统计/仪表盘
- 需求涉及数据的增删改操作（保存、提交、审核、删除等）
- 需求涉及详情查看/编辑
- 需求涉及业务实体名称（如物料、仓库、订单、客户、库存等）

**弱信号（需要停下来向用户提问确认，提供"需要 Controller"和"纯前端即可"两个选项）：**
- 需求仅描述了 UI 样式或布局，未提及数据来源
- 需求可能通过本地 mock 数据或配置项完成

**排除信号（不需要 Controller）：**
- 页面仅展示静态内容、说明文档或本地计算结果
- 纯展示型组件（如欢迎页、关于页）

默认倾向：当需求描述中出现任何业务数据相关的词汇时，优先判定需要 Controller，而非额外向用户提问确认。

### 实体识别与澄清

判定需要 Controller 后，必须进一步识别需求涉及哪些业务实体，用于后续 `meta-query-api.mjs` 查询真实字段：

1. **从需求中提取实体关键词**：分析用户需求描述，提取所有可能的业务实体名称（如"物料"、"仓库"、"库存"、"订单"等）
2. **确认表单编码来源**：表单/实体编码**禁止猜测**，只能通过以下两种方式获取：
   - **用户直接提供**：用户在需求中明确给出了表单编码（如 `bd_material`、`im_inventory`）
   - **通过查询确认**：使用 `queryFormsByApp` 搜索表单，从返回结果中确认真实编码
3. **向用户澄清实体**：若用户未提供表单编码，且实体名称可能存在歧义（如"库存"可能对应库存台账、库存余额、安全库存等不同表单），必须停下来向用户提问确认：
   - 向用户提问："您提到的'库存'对应的是哪个业务表单？"，并将可能的候选表单作为选项供用户选择
   - 若实体名称无歧义且用户也不确定编码，可先用 `queryFormsByApp` 按关键词搜索，将结果作为选项列表让用户选择
4. **确认后再查询字段**：只有在明确了表单编码后，才执行 `getEntityFields` 查询字段结构

### 前后端统一编排

当需求同时涉及前端组件和后端 Controller 时，按以下流程执行（元数据先于代码）：

1. 若无工程，执行 project-init.mjs 脚本初始化（参数见「初始化工程」章节）
2. 创建工程结构（本 Skill 职责）：
   a. 使用 batch-create.mjs 脚本批量创建所有前端组件（参数见「创建组件」章节）
   b. 使用 batch-create.mjs 脚本批量创建所有 Controller（参数见「创建 Controller」章节）
3. **查询业务实体字段**（当 Controller 涉及实体数据操作时）：
   - 用户提供了表单名称/编码/实体相关信息时，使用 `meta-query-api.mjs` 查询真实字段
   - 先 `queryFormsByApp` 搜索表单，再 `getEntityFields` 获取字段结构（见「元数据查询」章节）
   - 查询结果用于指导后续 Controller 元数据和代码编写，**禁止猜测字段名**
4. 补全所有元数据（本 Skill 职责，元数据先行）：
   a. 补全组件元数据 `.js-meta.kwc`
   b. 补全 Controller 元数据 `.kws`（定义 URL、方法、权限配置）
5. **阅读框架子技能文档并实现前端组件代码**：阅读对应框架子技能的 SKILL.md 编写组件代码（*.tsx / *.vue / *.js）
6. **阅读 Controller 子技能文档并实现后端代码**：阅读 [kwc-ks-controller-development](./kwc-ks-controller-development/SKILL.md) 编写 Controller 脚本（*.ts）
7. 回到脚手架工作流：创建页面元数据并补全 `<controls>`
8. 构建前端：`npm run build:frontend`
9. 确认或创建目标环境，完成认证
10. 执行 `kd project deploy`
11. 部署成功后，生成并发送页面访问链接（`:::render:kdform ...:::`）（见「页面访问链接」章节）

**关键原则**：
- 步骤 4（元数据补全）中，组件元数据 `.kwc` + Controller 元数据 `.kws` 都由本 Skill 完成
- 步骤 5-6（代码实现）分别遵循对应子技能的规范，脚手架工作流严禁直接编写代码
- 步骤 7 起回到脚手架工作流主导

### 仅前端编排

若确认不涉及后端，仅前端开发时，优先按这条顺序执行：

1. 若无工程，执行 project-init.mjs 脚本初始化（参数见「初始化工程」章节）
2. 使用 batch-create.mjs 脚本批量创建所有页面组件（参数见「创建组件」章节）
3. **补全组件 `.js-meta.kwc`**（本 Skill 职责）
4. **查询关联业务实体**（可选，当组件涉及表单数据绑定时）：使用 `meta-query-api.mjs` 查询关联表单的字段结构，辅助组件设计（见「元数据查询」章节）
5. **阅读框架子技能文档并实现代码**：确认当前工程 framework，**必须**阅读对应框架子技能的 SKILL.md（[kwc-react-development](./kwc-react-development/SKILL.md) / [kwc-vue-development](./kwc-vue-development/SKILL.md) / [kwc-lwc-development](./kwc-lwc-development/SKILL.md)）并遵循其规范
6. **框架子技能规范下实现组件代码**（*.tsx / *.vue / *.js）
7. 代码实现完成后，回到脚手架工作流：使用 batch-create.mjs 脚本创建页面元数据（参数见「创建页面元数据」章节）
8. 补全页面 `app/pages/<page-name>.page-meta.kwp`
9. 构建前端：`npm run build:frontend`
10. **自动部署**：先执行 `kd env list` 检查已有环境。若有已认证环境，直接执行 `kd project deploy -e <环境名>`（无需询问用户）；若无环境，先收集环境信息并配置，再部署。详见「部署决策（默认自动部署）」章节
11. 当次任务所有部署完成后，生成并发送页面访问链接（`:::render:kdform ...:::`）（见「页面访问链接」章节，**不可跳过**）
12. 仅当用户明确要求查看效果时执行 `kd open`，明确要求本地联调时执行 `kd debug`（须后台模式）

**关键原则**：
- 步骤 3（元数据补全）必须由脚手架工作流完成
- 步骤 5-6（代码实现）**必须**遵循框架子技能规范，脚手架工作流严禁直接编写代码
- 步骤 7 起（页面创建及后续）回到脚手架工作流主导

如果是修改已有页面：

1. 先识别是改组件实现、改组件元数据、改页面元数据，还是三者都改
2. **若涉及组件代码修改**：必须阅读对应框架子技能的 SKILL.md 并遵循其规范，禁止脚手架工作流直接修改代码
3. **自动部署**：先执行 `kd env list` 检查已有环境，若有已认证环境直接 `kd project deploy` 部署变更（无需询问用户）；仅当用户明确表示不需要部署时才跳过

### 仅后端 Controller 编排

若确认仅涉及后端，不需要新增前端组件时：

1. 若无工程，执行 project-init.mjs 脚本初始化（参数见「初始化工程」章节）
2. 使用 batch-create.mjs 脚本批量创建所有 Controller（参数见「创建 Controller」章节）
3. **查询业务实体字段**（当 Controller 涉及实体数据操作时）：使用 `meta-query-api.mjs` 先搜索表单再获取字段结构（见「元数据查询」章节），**禁止猜测字段名**
4. **补全 Controller 元数据 `.kws`**（本 Skill 职责）
5. **阅读 Controller 子技能文档并实现代码**：**必须**阅读 [kwc-ks-controller-development](./kwc-ks-controller-development/SKILL.md) 并遵循其规范
6. **Controller 子技能规范下编写脚本代码**（*.ts）
7. 代码实现完成后，回到脚手架工作流：先执行 `kd env list` 检查已有环境，若有已认证环境直接执行 `kd project deploy` 部署到目标环境（无需询问用户，Controller 无需预先 build）；若无环境，先收集环境信息并配置，再部署
8. 当次任务所有部署完成后，生成并发送页面访问链接（`:::render:kdform ...:::`）（见「页面访问链接」章节，**不可跳过**）

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

- **部署即发送**：每完成一段可预览的工作（该段涉及的所有 deploy 均已成功），立即发送页面访问链接
- **同一段工作内不重复**：如果一段工作涉及多次 deploy（如先部署组件、再部署页面、再部署 Controller），应在该段全部部署完成后发送一次
- 适用于任何 deploy 形式：整体部署（`kd project deploy`）、指定路径部署（`-d app/kwc/...`、`-d app/pages/...`、`-d app/ks/controller/...`）

### 页面访问链接

部署成功后，生成页面访问链接供用户点击查看效果。此输出是一个独立的链接卡片，与任务总结无关。

**链接卡片格式（固定，不再区分是否关联业务实体）：**
```
:::render:kdform {"title":"<masterLabel值>","url":"<环境URL>/?formId=<页面name>"}:::
```

| 字段 | 必须 | 来源 |
|------|------|------|
| `title` | ✅ 必须 | `.page-meta.kwp` 中的 `<masterLabel>` |
| `url` | ✅ 必须 | `{环境URL}/?formId={页面name}`，页面 name 取自 `.page-meta.kwp` 的 `<name>` 字段，已包含 ISV 前缀 |

**URL 拼接规则：**
- 环境 URL：从 `kd env info` 或 `~/.kd/config.json` 中读取当前环境的 url
- formId：直接使用 `.page-meta.kwp` 中的 `<name>` 值（已包含 ISV 前缀），如 `kdtest_inv_dashboard`

> ⚠️ 这是一个**链接卡片**，不是总结。JSON 仅包含上述两个字段（`title`、`url`），禁止额外拼接其他字段（包括旧版的 `metadata` 字段已废弃）。

> 💡 也可通过 `form-link.mjs` 脚本自动生成链接卡片（见 scripts 目录），但不强制要求使用脚本。

### 执行顺序

```
当段工作所有 deploy 完成 → 发送页面访问链接（:::render:kdform ...:::） → 向用户提问是否需要菜单发布（可选）
```

### 强制约束

- 每段工作的部署完成后**必须**发送页面访问链接，不可省略或跳过
- 多轮对话中每段完成的工作都应发送，不要只在最终结束时才发送
- 同一段工作内不重复发送（多条 deploy 命令属于同一段工作时，等全部完成后发送一次）
- 链接卡片 JSON 仅含 `title`、`url` 两个字段
- 所有值从实际文件和环境中读取，禁止猜测
- 任务总结（如有）应作为**独立文本**写在链接卡片之后

## 查看环境效果（kd open）

> 注意：部署后默认仅发送页面访问链接（见「页面访问链接」章节），不自动执行 kd open。仅当用户明确要求查看环境效果时才使用本命令。

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
- 已发送页面访问链接（见「页面访问链接」章节，部署后必须先发送链接再执行 open/debug）
- 环境已认证

```
用户意图判断：
├── "看效果/打开页面/查看部署结果/看看环境上的表单" → kd open
├── "调试/联调/本地调试/实时预览修改" → kd debug
└── 未明确表达 → 默认发送页面访问链接即结束，不自动执行 kd open 或 kd debug
```

补充：环境未认证时 `kd project deploy` 会直接阻止部署。

## 应用菜单管理

> 菜单管理将部署后的页面注册到应用导航菜单，使页面在苍穹环境中可被用户导航访问。
> 所有菜单操作通过 `scripts/menu-api.mjs` 脚本完成，详细命令参考见 [references/app-menu.md](references/app-menu.md)。

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

- 按层级缩进展示，用图标区分类型（📁 分组 / 📄 页面 / 🔗 链接），展示规范见 [references/app-menu.md](references/app-menu.md)
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
2. **再引导菜单发布**：向用户提问是否需要将页面发布到应用菜单（提供“发布到菜单”/“跳过”两个选项）

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

## 元数据查询

> 元数据查询用于在已认证环境中搜索表单和获取实体字段结构，为 KS 脚本编写、页面开发等提供上下文信息。
> 所有查询操作通过 `scripts/meta-query-api.mjs` 脚本完成，详细命令参考见 [references/meta-query.md](references/meta-query.md)。

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

## 端到端执行原则

当用户说“帮我开发一个 KWC 页面/功能”时，默认按这条链路推进：

1. 识别是新工程还是已有工程
2. 收集不可推断的环境输入
3. 评估需求是否涉及后端数据交互，若是则规划 Controller
4. 拆分组件并创建组件工程；若需要 Controller，一并创建 Controller 工程
5. 补全所有元数据：组件元数据 `.js-meta.kwc`、Controller 元数据 `.kws`（若有）
6. 实现前端组件代码（阅读对应框架子技能的 SKILL.md 并遵循其规范）
7. 若有 Controller，实现 Controller 脚本代码（阅读 [kwc-ks-controller-development](./kwc-ks-controller-development/SKILL.md) 并遵循其规范）
8. 创建并补全页面元数据
9. 若有 Controller，执行 `npm run build:controller`
10. **自动部署**：先执行 `kd env list` 检查已有环境。若有已认证环境，直接执行 `kd project deploy -e <环境名>`（无需询问用户）；若无环境，先收集环境信息并配置，再部署。详见「部署决策（默认自动部署）」章节
11. 部署成功后，生成并发送页面访问链接（`:::render:kdform ...:::`）（见「页面访问链接」章节）
12. 仅当用户明确要求查看效果时执行 `kd open`
13. 仅当用户明确要求本地联调时，执行 `kd debug`

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

## 快速导航

按常见场景快速定位参考文档：

- **新工程初始化** → `cli-reference.md`（project init）+ 本文「初始化工程」章节
- **添加组件** → `cli-reference.md`（project create）+ `component-metadata.md`
- **创建页面** → `page-metadata.md` + 本文「创建页面元数据」章节
- **环境配置与部署** → `env-setup.md` + `cli-reference.md`（deploy/open/debug）+ 本文「配置环境」「部署与调试」章节
- **应用菜单管理** → `app-menu.md` + 本文「应用菜单管理」章节
- **元数据查询** → `meta-query.md` + 本文「元数据查询」章节

## 参考资料

| 主题 | 参考文件 |
|------|----------|
| CLI 命令语法、参数、示例 | `references/cli-reference.md` |
| 组件元数据字段与属性类型 | `references/component-metadata.md` |
| 环境信息收集与认证流程 | `references/env-setup.md` |
| 页面元数据字段、controls 规则、命名规范 | `references/page-metadata.md` |
| 应用菜单管理命令与展示规范 | `references/app-menu.md` |
| 元数据查询命令与响应格式 | `references/meta-query.md` |

---

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

---

## 附录：CLI 手动降级方案

> **🚫 禁止区域 — AI 不得阅读或执行以下内容**
> 
> 以下 CLI 命令仅供人工故障排查参考。AI 在任何情况下都必须使用自动化脚本（project-init.mjs / setup-env.mjs / batch-create.mjs），即使脚本执行失败，也应报告错误而非降级到手动 CLI。

### A. 工程初始化降级

当 `project-init.mjs` 脚本执行失败时，可降级为手动流程：

1. 安装 CLI。
2. 运行 `kd project init <project-name>`。
3. 在交互流程中按用户要求选择框架和语言；若用户未指定，默认选择 `react` + `ts`，无需询问用户。若用户明确指定了其他框架（Vue/LWC），则按用户指定的执行。
4. 输入应用标识 `app`（规则见“需要用户提供或确认的输入”一节）。
5. 初始化完成后进入项目目录，执行 `npm install`。
6. 仅在需要本地辅助预览组件时，再执行 `npm run dev`。

补充：`kd project init` 依赖 `git clone` 下载模板，若失败优先检查 `git`。

### B. 组件创建降级

当 `batch-create.mjs` 脚本执行失败时，可降级为逐个创建：

1. 运行 `kd project create <ComponentName> --type kwc`。
2. 使用 `PascalCase` 组件名。
3. 让 CLI 生成目录和基础文件。
4. 若用户同时要创建多个组件，逐个执行创建命令，不要手工复制推断目录结构。

### C. Controller 创建降级

当 `batch-create.mjs` 脚本执行失败时，可降级为逐个创建：

1. 运行 `kd project create <ControllerName> --type controller`。
2. 使用 `PascalCase` 控制器名，建议以 `Controller` 后缀结尾。
3. 让 CLI 生成目录和基础文件。Controller 工程生成在 `app/ks/controller/<ControllerName>/` 下。
4. 若需指定拉取 SDK 的目标环境，可使用 `-e` 选项：`kd project create <ControllerName> --type controller -e dev`。

### D. 页面元数据创建降级

当 `batch-create.mjs` 脚本执行失败时，可降级为逐个 CLI 创建：

1. 运行 `kd project create <page-name> --type page`。
2. 打开 `app/pages/<page-name>.page-meta.kwp`。
3. 至少核对并填写 `name`、`masterLabel`、`app`、`version`。
4. 在 `<controls>` 中把页面实例和组件类型关联起来。
5. 仅当该页面元数据文件有变更并准备重新上传时，手动将 `version` 加 `1`。
6. 将组件树、实例名和页面布局映射到 XML，而不是停留在“组件已经创建”这一步。

### E. 环境配置降级

当 `setup-env.mjs` 脚本执行失败时，可降级为手动流程：

1. 使用 `kd env create <env-name> --url <url>` 创建环境别名。
2. 使用 `kd env auth openapi` 走交互式认证。
3. 若用户经常切换环境，可用 `kd env set target-env <env-name>` 设置默认环境。
4. 必要时使用 `kd env info` 检查当前配置。

优先采用 `openapi` 认证方式；`web` 模式暂不作为默认路径。
