---
name: kd-frontend-development
description: "【KD 全栈开发技能包】覆盖金蝶前端自定义页面开发全流程：需求分析与实体澄清、工程脚手架初始化（kd CLI）、KWC 组件与页面元数据契约、KingScript 脚本控制器开发、前后端 adapterApi 联调与端到端自检、环境部署与调试。当用户需求涉及 KWC 页面开发、KWC 工程创建、KWC 组件开发、KWC 应用搭建或 KingScript Controller 开发时触发。"
version: 1.0.0
---

# KD Frontend Development

本技能是 KWC 工程的总入口。负责脚手架命令、元数据契约、前后端联调、部署。
**首次接触 KWC 工程**：先读 [`references/concepts.md`](./references/concepts.md)（交付对象 / 元数据驱动模型 / 组件页面关系约束），后续直接执行无需重复。

## KWC 工程目录结构

`kd project init` 生成的工程统一遵循以下结构（找文件 / 创建文件都按这个走）：

```
<项目根>/
├── .kd/                                    CLI 配置（含 config.json，含 framework 字段）
├── app/
│   ├── kwc/                                🔴 前端组件目录
│   │   ├── <ComponentName>/                每个组件一个目录
│   │   │   ├── <ComponentName>.tsx         组件代码（vue/lwc 工程对应 .vue / .js）
│   │   │   └── <ComponentName>.js-meta.kwc 组件元数据
│   │   ├── ExampleComponent/               脚手架自带示例（**可参考但不要部署**，必要时删除其 .js-meta.kwc）
│   │   ├── static/                         静态资源
│   │   ├── types/                          类型声明（含 declarations.d.ts）
│   │   ├── index.html / main.tsx           本地预览入口（**不是交付路径**，详见 concepts.md）
│   │   └── tsconfig.json
│   ├── pages/                              🔴 页面元数据目录
│   │   └── <page_name>.page-meta.kwp       每个页面一个文件
│   └── ks/controller/                      🔴 后端 Controller 目录（按需创建）
│       ├── <ControllerName>.kws            Controller 元数据（路由 / 方法 / 权限）
│       └── <ControllerName>.ts             Controller 脚本（KingScript）
├── dist/                                   构建产物（不要手动修改）
├── scripts/                                工程内 npm 脚本
├── server.ts / vite.config.ts              本地预览相关
├── package.json
└── README.md / README_zh.md
```

**关键路径速查**：
- 找/写**组件**：`app/kwc/<ComponentName>/`
- 找/写**页面元数据**：`app/pages/<page_name>.page-meta.kwp`
- 找/写**Controller**：`app/ks/controller/<ControllerName>.{kws,ts}`
- 找**框架配置**：`.kd/config.json`（`framework` 字段判定 react/vue/lwc）
- 找**类型声明**：`app/kwc/types/declarations.d.ts`（新增第三方包必须在此 `declare module`）

**不要做的事**：
- 不要手工创建上述目录/文件，统一用 `kd project create`
- 不要把组件直接挂到 `main.tsx` 当成"交付完成"——交付靠 `app/pages/*.page-meta.kwp` 中的 `<controls>`
- 不要修改 `dist/` 下的产物

## 阶段判别

按这个顺序判断当前任务该走哪一步：

1. 当前目录无 `.kd/` → 视为未初始化 KWC 工程，走「初始化工程」
2. 用户要新建组件 / 页面 / Controller → 用 `kd project create`，禁止手工拼目录
3. 用户要部署 / 调试 → 直接 `kd project deploy`（默认环境），失败提示无环境时再配置
4. 用户开始写前端组件代码（*.tsx / *.vue / *.js） → **写前必读** [`references/kwc-frontend-contract.md`](./references/kwc-frontend-contract.md)；UI 实现细节自由发挥
5. 用户要写后端 Controller → 走 [`kwc-ks-controller-development`](./kwc-ks-controller-development/SKILL.md)

## 自动化脚本定位

脚本不在用户项目中，需先定位：

```bash
SKILL_DIR=$(dirname "$(find ~/ -path '*/kd-frontend-development/scripts/project-init.mjs' -maxdepth 10 2>/dev/null | head -1)")
# 兜底：指定常见安装位置
[ -z "$SKILL_DIR" ] && SKILL_DIR=$(dirname "$(find ~/.kcode ~/.qoder ~/.cursor ~/.config -path '*/kd-frontend-development/scripts/project-init.mjs' 2>/dev/null | head -1)")
```

| 脚本 | 用途 |
|------|------|
| `project-init.mjs` | 工程初始化（替代 CLI 交互） |
| `setup-env.mjs` | 环境配置与认证 |
| `test-controller.mjs` | Controller 端到端自检 |
| `form-link.mjs` | 生成 render 卡片访问链接 |
| `meta-query-api.mjs` | 查询苍穹实体字段（写 Controller 前必查） |
| `menu-api.mjs` | 应用菜单管理 |

> ⚠️ 必须先定位脚本路径再执行，禁止因找不到脚本就改用 CLI 交互式命令。

## 代码实现的职责分工

### 前端组件代码（*.tsx / *.vue / *.js）

**自由实现**——React/Vue/LWC 怎么写、用什么 UI 库（Shoelace / 原生 div / ECharts 任选）、布局怎么排，按业务需求自行决断。

**唯一硬约束**：符合 KWC 框架契约。**编写前必读** [`references/kwc-frontend-contract.md`](./references/kwc-frontend-contract.md)（≤80 行，覆盖 KwcConfig props 形状、`config` 字段、adapterApi 调用入口、declarations.d.ts、main.tsx 非交付路径）。

### 后端 Controller 脚本代码（*.ts）

**禁止凭通用 Node/Java 经验自行编写**——KingScript 运行时与 Node.js / Java Servlet 完全不同，SDK 是封闭生态。**编写前必读** [`kwc-ks-controller-development/SKILL.md`](./kwc-ks-controller-development/SKILL.md) 及其 rule.md / reference/。SDK 检索查 [`kingscript-code-generator/SKILL.md`](./kingscript-code-generator/SKILL.md)。

## 初始化工程

必须使用 `project-init.mjs` 一键完成，禁止直接执行 `kd project init`（交互式）。

```bash
node $SKILL_DIR/project-init.mjs --name <项目名> --framework react --language ts --app <应用编码> --cwd <目标父目录绝对路径>
```

- 必填：`--name` / `--framework` / `--language` / `--app`
- **强烈建议显式传 `--cwd`**：工程生成在 `<cwd>/<name>` 下；不传时用 `process.cwd()`，多 workspace 场景易跑偏
- 网络加速可选 `--registry https://registry.npmmirror.com` 或环境变量 `KWC_NPM_REGISTRY`
- 脚本默认**不**执行 `npm install`，初始化完成后提示用户手动 `cd <项目目录> && npm install`
- 框架默认 `react` + `ts`；用户明确指定 Vue/LWC 时按指定执行

## 创建组件 / Controller / 页面

```bash
kd project create <ComponentName>  --type kwc          # 组件
kd project create <ControllerName> --type controller   # Controller (-e <env> 可选, 指定拉 SDK 的环境)
kd project create <page_name>      --type page         # 页面
```

**创建后必做**：
1. 立刻补齐 `.js-meta.kwc` / `.kws` / `.page-meta.kwp` 模板字段（这是本 Skill 的职责，元数据先行）
2. 写代码前阅读对应契约文档（前端 → kwc-frontend-contract.md；Controller → 子技能）

详细元数据字段规则：[`references/component-metadata.md`](./references/component-metadata.md) / [`references/page-metadata.md`](./references/page-metadata.md)（首次接触工程必读，后续可复用）。

页面元数据关键约束：
- `<control type>` 必须与组件元数据 `name` **完全一致（含大小写）**，不要因目录在 `app/kwc/` 下就加 `kwc_` 前缀
- 页面 `name` ≤ 20 字符（系统会拼 ISV 前缀）
- 新生成的 `page-meta.kwp` 默认只有注释模板，必须主动补全 `<controls>`

## 必须用户提供的输入

不可推断时必须停下来询问，提供 2-4 个明确选项：

- 项目名 / 现有项目路径
- 苍穹应用编码 `app`（**全文唯一权威定义**）：
  - 必须用户明确提供或来自 `.kd/config.json`，**不可猜测、不可使用示例值**
  - 标准格式 `{isv}_{应用名}`（如 `kdtest_kwc_test`），`kingdee` 开头的应用例外
  - 缺 ISV 前缀且不是 `kingdee` 开头时必须向用户确认
- 目标环境别名和 URL（仅当无已配置环境时）
- 认证参数（仅当环境未认证时）
- 页面标识与业务用途
- 哪些组件参数需要做成可配置属性

`isv` 例外：开发阶段可留空，`kd project deploy` 时自动从环境写入。
框架例外：未指定时默认 `react` + `ts`，无需询问。
部署不属于敏感动作，创建组件/页面后**默认自动部署**。删除/发布等敏感动作必须先确认。

## Skill 自动决策的内容（不要推回给用户）

- 业务需求 → 组件拆分（通常 1 需求 = 1 组件 + 1 页面）
- 组件 PascalCase 名 / 页面小写标识 / 实例唯一 name
- 组件元数据中需暴露的 `<property>` 推断
- 当前阶段判别（init / create / deploy / open / debug）
- 元数据变更时递增对应文件的 `version`

## Controller 端到端自检（🔴 硬门槛）

Controller 部署成功后**必须**跑 [`scripts/test-controller.mjs`](./scripts/test-controller.mjs) 自检；**未通过前禁止写前端 adapterApi 对接代码**。完整流程详见 [`references/controller-e2e-check.md`](./references/controller-e2e-check.md)（账号配置、命令模式、验证标准、3 次重试上限与超限处理）。

3 次失败 → 停下来向用户输出诊断报告，**禁止自作主张降级到 Mock 数据**。

## 端到端执行链路

用户说"帮我开发一个 KWC 页面/功能"时，默认按这条推进：

1. 识别新工程 / 已有工程；收集不可推断的环境输入
2. 评估是否涉及后端数据交互；若是规划 Controller
3. 创建组件工程（必要时一并创建 Controller）
4. 补全所有元数据：`.js-meta.kwc`、`.kws`（若有）
5. 实现前端组件代码（必读 [`references/kwc-frontend-contract.md`](./references/kwc-frontend-contract.md)）
6. 若有 Controller：实现脚本（必读 [`kwc-ks-controller-development`](./kwc-ks-controller-development/SKILL.md)）→ `npm run build:controller`（仅本地编译）→ `kd project deploy`（真正上传） → 跑 test-controller.mjs 自检（必须通过）
7. 创建并补全页面元数据
8. `kd project deploy`（默认环境，无需询问）
9. **发送 render 卡片**（见下）
10. [可选] `kd open` / `kd debug` 仅当用户明确要求

### render 卡片输出时机

```bash
node $SKILL_DIR/scripts/form-link.mjs generate --pageMeta <页面元数据文件路径> [--formNumber <实体编码>] [--env <环境名>]
```
- **禁止手动拼接** `:::render:kdform ...:::` JSON，必须用脚本生成
- **仅前端任务**（无 Controller）：部署成功后立即输出
- **含后端任务**（有 Controller）：必须等 Controller 自检通过 + 前端 adapterApi 对接代码部署后才输出。Controller 3 次失败已转交用户决策的，**同样禁止输出**
- **新对话修改已部署页面**：修改部署后**必须重新输出**（即使此前已发过）

## 输出要求

每次输出方案或命令时，同时给出：
- 当前阶段 + 下一条命令
- 还需用户补充的关键输入
- 是否依赖已有环境认证 / 是否需改 `page-meta.kwp` / 元数据 version 是否需递增
- 是否已满足 render 卡片发送条件并已发送

## 参考文档触发标准

| 文件 | 触发级别 |
|------|---------|
| [`references/concepts.md`](./references/concepts.md) | 首次接触 KWC 工程必读一次 |
| [`references/kwc-frontend-contract.md`](./references/kwc-frontend-contract.md) | **🔴 写前端代码前必读** |
| [`references/component-metadata.md`](./references/component-metadata.md) | **🔴 首次接触工程**必读（写组件元数据） |
| [`references/page-metadata.md`](./references/page-metadata.md) | **🔴 首次接触工程**必读（写页面元数据） |
| [`references/controller-e2e-check.md`](./references/controller-e2e-check.md) | Controller 部署后必读 |
| [`references/workflow-orchestration.md`](./references/workflow-orchestration.md) | 含后端 / 含 Controller / 含实体识别时必读 |
| [`references/deployment-guide.md`](./references/deployment-guide.md) | 新建环境 / 首次部署 / 菜单发布 / 部署失败排查时必读 |
| [`references/metadata-operations.md`](./references/metadata-operations.md) | 元数据上传失败 / CLI 报错 / 查询环境元数据时必读 |

## 子技能

| 子技能 | 用途 | 激活条件 |
|--------|------|---------|
| [kwc-ks-controller-development](./kwc-ks-controller-development/SKILL.md) | KingScript 脚本控制器开发 | `app/ks/controller/` 目录已存在 |
| [kingscript-code-generator](./kingscript-code-generator/SKILL.md) | KingScript SDK 索引检索、风险审查 | 写 Controller 或 Kingscript 二开 |

前端组件代码可自由实现，遵循 [`references/kwc-frontend-contract.md`](./references/kwc-frontend-contract.md) 即可，不再设独立子技能。
