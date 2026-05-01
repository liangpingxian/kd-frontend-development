# 完整工程流程编排

> 本文档从主 SKILL.md 中拆分而来，按需加载。触发条件：需求含后端数据交互 / 含 Controller / 含实体识别 / 前后端联合开发时必读。

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

1. 若无工程，执行 project-init.mjs 脚本初始化（参数见主 SKILL.md「初始化工程」章节），初始化完成后提示用户手动执行 `cd <项目目录> && npm install`
2. 创建工程结构（本 Skill 职责）：
   a. 使用 `kd project create <ComponentName> --type kwc` 创建前端组件（通常 1 个需求只需 1 个组件）
   b. 使用 `kd project create <ControllerName> --type controller` 创建 Controller
3. **查询业务实体字段**（当 Controller 涉及实体数据操作时）：
   - 用户提供了表单名称/编码/实体相关信息时，使用 `meta-query-api.mjs` 查询真实字段
   - 先 `queryFormsByApp` 搜索表单，再 `getEntityFields` 获取字段结构（见 `references/metadata-operations.md`「元数据查询」章节）
   - 查询结果用于指导后续 Controller 元数据和代码编写，**禁止猜测字段名**
4. 补全所有元数据（本 Skill 职责，元数据先行）：
   a. 补全组件元数据 `.js-meta.kwc`
   b. 补全 Controller 元数据 `.kws`（定义 URL、方法、权限配置）
5. **阅读框架子技能文档并实现前端组件代码**：阅读对应框架子技能的 SKILL.md 编写组件代码（*.tsx / *.vue / *.js）
6. **阅读 Controller 子技能文档并实现后端代码**：阅读 [kwc-ks-controller-development](../kwc-ks-controller-development/SKILL.md) 编写 Controller 脚本（*.ts）
7. 回到脚手架工作流：创建页面元数据并补全 `<controls>`
8. 构建前端：`npm run build:frontend`
9. 确认或创建目标环境，完成认证
10. 执行 `kd project deploy`
11. **【立即】部署成功后，生成并发送页面访问链接**（`:::render:kdform ...:::`）——这是部署流程的完成标志，不可跳过或延迟（见 `references/deployment-guide.md`「页面访问链接」章节）

**关键原则**：
- 步骤 4（元数据补全）中，组件元数据 `.kwc` + Controller 元数据 `.kws` 都由本 Skill 完成
- 步骤 5-6（代码实现）分别遵循对应子技能的规范，脚手架工作流严禁直接编写代码
- 步骤 7 起回到脚手架工作流主导

### 仅前端编排

若确认不涉及后端，仅前端开发时，优先按这条顺序执行：

1. 若无工程，执行 project-init.mjs 脚本初始化（参数见主 SKILL.md「初始化工程」章节），初始化完成后提示用户手动执行 `cd <项目目录> && npm install`
2. 使用 `kd project create <ComponentName> --type kwc` 创建页面组件（通常 1 个需求只需 1 个组件，所有复杂布局在组件内部完成）
3. **补全组件 `.js-meta.kwc`**（本 Skill 职责）
4. **查询关联业务实体**（可选，当组件涉及表单数据绑定时）：使用 `meta-query-api.mjs` 查询关联表单的字段结构，辅助组件设计（见 `references/metadata-operations.md`「元数据查询」章节）
5. **阅读框架子技能文档并实现代码**：确认当前工程 framework，**必须**阅读对应框架子技能的 SKILL.md（[kwc-react-development](../kwc-react-development/SKILL.md) / [kwc-vue-development](../kwc-vue-development/SKILL.md) / [kwc-lwc-development](../kwc-lwc-development/SKILL.md)）并遵循其规范
6. **框架子技能规范下实现组件代码**（*.tsx / *.vue / *.js）
7. 代码实现完成后，回到脚手架工作流：使用 `kd project create <page_name> --type page` 创建页面元数据（参数见主 SKILL.md「创建页面元数据」章节）
8. 补全页面 `app/pages/<page-name>.page-meta.kwp`
9. 构建前端：`npm run build:frontend`
10. **自动部署**：先执行 `kd env list` 检查已有环境。若有已认证环境，直接执行 `kd project deploy -e <环境名>`（无需询问用户）；若无环境，先收集环境信息并配置，再部署。详见 `references/deployment-guide.md`「部署决策（默认自动部署）」章节
11. **【立即】当次任务所有部署完成后，生成并发送页面访问链接**（`:::render:kdform ...:::`）——这是部署流程的完成标志，不可跳过或延迟（见 `references/deployment-guide.md`「页面访问链接」章节）
12. [可选] 若用户明确要求查看效果时执行 `kd open`，明确要求本地联调时执行 `kd debug`（须后台模式）

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

1. 若无工程，执行 project-init.mjs 脚本初始化（参数见主 SKILL.md「初始化工程」章节），初始化完成后提示用户手动执行 `cd <项目目录> && npm install`
2. 使用 `kd project create <ControllerName> --type controller` 创建 Controller
3. **查询业务实体字段**（当 Controller 涉及实体数据操作时）：使用 `meta-query-api.mjs` 先搜索表单再获取字段结构（见 `references/metadata-operations.md`「元数据查询」章节），**禁止猜测字段名**
4. **补全 Controller 元数据 `.kws`**（本 Skill 职责）
5. **阅读 Controller 子技能文档并实现代码**：**必须**阅读 [kwc-ks-controller-development](../kwc-ks-controller-development/SKILL.md) 并遵循其规范
6. **Controller 子技能规范下编写脚本代码**（*.ts）
7. 代码实现完成后，回到脚手架工作流：先执行 `kd env list` 检查已有环境，若有已认证环境直接执行 `kd project deploy` 部署到目标环境（无需询问用户，Controller 无需预先 build）；若无环境，先收集环境信息并配置，再部署
8. **【立即】当次任务所有部署完成后，生成并发送页面访问链接**（`:::render:kdform ...:::`）——这是部署流程的完成标志，不可跳过或延迟（见 `references/deployment-guide.md`「页面访问链接」章节）
