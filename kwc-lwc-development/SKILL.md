# KWC LWC 开发专家

当项目确认使用 LWC 框架后，本 Skill 负责该框架下的代码编写规范与组件使用指导。

## 重要：使用前置条件

**必须同时满足以下条件才能使用本 Skill：**
1. 当前目录已存在 `.kd/config.json` 文件
2. 配置文件中 `framework` 字段值为 `lwc`
3. 工程已通过脚手架工作流完成初始化

**以下场景禁止使用本 Skill，必须交由脚手架工作流：**
- 工程初始化（`kd project init`）
- 创建组件或页面（`kd project create`）
- 生成或修改 `.js-meta.kwc` 组件元数据
- 生成或修改 `.page-meta.kwp` 页面元数据
- 环境配置（`kd env` 相关命令）
- 部署操作（`kd project deploy`）
- 调试操作（`kd debug`）— 调试由脚手架工作流负责，须以后台模式运行（`is_background: true`），详见其调试约定

若当前不满足上述前置条件，请立即停止并回到脚手架工作流（主入口）。

## 核心职责
你负责指导用户进行 KWC LWC 组件的开发、修改和维护。
**重要**：你必须严格遵守**本 Skill 目录下的** `rule.md` 文件中定义的硬性约束。在开始任何代码编写前，请务必阅读并理解这些规则。

## 1. 环境上下文确认
- **项目根目录**：包含 `.kd` 文件夹和 `app/kwc` 目录。
- **配置环境**：`.kd/config.json` 中 `framework` 配置为 `lwc`。
- **重要**：若当前环境**不满足**上述条件（如缺少 `.kd` 或 `framework` 不为 `lwc`），**必须立即停止**使用本 Skill 的所有约束，转而按**通用 Web 项目**标准协助用户。
- **执行原则**：仅在确认环境符合上述特征时，才强制执行本 Skill 及**本 Skill 目录下的** `rule.md` 定义的所有 KWC LWC 开发规范。

## 2. 平台差异说明 (Salesforce LWC vs @kdcloudjs/kwc)
`@kdcloudjs/kwc` 是 Salesforce LWC 的 100% 语法克隆，仅有以下差异需要注意：

| 项目 | Salesforce LWC | @kdcloudjs/kwc（本平台） |
|-----|---------------|------------------------|
| **基类** | `LightningElement` | `KingdeeElement` |
| **导入路径** | `from 'lwc'` | `from '@kdcloudjs/kwc'` |
| **配置文件** | `lwc.config.json` | `kwc.config.json` |
| **组件库** | `<lightning-button>` 等 | `<sl-button kwc:external>` 等（必须使用 `kwc:external` 属性，禁止直接使用 `lightning-*` 组件） |
| **平台限制** | 支持标准 LWC 语法 | HTML 中禁止表达式、禁止自闭合标签、Shoelace自定义事件在renderedCallback中绑定监听 |

## 3. 标准工作流 (Workflow)

1. **新建组件**：
   - **必须**使用 CLI 工具，严禁手工创建文件：
     ```bash
     kd project create [组件名] --type kwc
     ```
   - 组件命名遵循 `camelCase`。

2. **页面设计**：
   - 确定页面类型 → 阅读 `references/page-design-guide.md` 选择合适的页面模板和组件组合

3. **代码实现与修改**：
   - **必须先参考**：在实现前，**必须**先阅读并参考项目根目录下的 `app/kwc/exampleComponent` 或本 Skill 目录下的 `./assets/examples` 示例代码，确保掌握正确的开发模式。
   - **严格合规**：代码必须符合**本 Skill 目录下的** `rule.md` 中的所有约束（html无表达式、无自闭合、正确的事件绑定等）。
   - **Shoelace 集成**：涉及 Shoelace 组件时，确保导入路径正确且添加了 `kwc:external`。

4. **验证与交付**：
   - 按项目入口更新 `app/kwc/main*` 引用。
   - 运行 `npm run dev` 进行验证。
   - 检查代码是否符合所有硬性约束。

## 4. 关键约束摘要

### ⚠️ KWC 组件入参规范（高频踩坑）

KWC 运行时通过 `@api config` 将配置对象传入组件，组件通过 `this.config` 直接访问。

✅ 正确写法：
```js
import { KingdeeElement, api } from '@kdcloudjs/kwc';

export default class MyComponent extends KingdeeElement {
  @api config; // KWC 框架直接传入 config 对象

  get pageId() {
    return this.config?.pageId; // ✅ 直接从 this.config 取值
  }
}
```

❌ 错误写法（不要双层嵌套）：
```js
// ❌ this.config.config 是 undefined
get pageId() {
  return this.config.config.pageId;
}
```

---

完整约束详见**本 Skill 目录下的** `rule.md`，以下仅列最核心要点：
- **模板**：禁止 JS 表达式、禁止自闭合标签、禁止 ID 选择器
- **事件**：HTML 仅绑定原生事件，Shoelace 事件必须在 JS `renderedCallback` 中绑定
- **Shoelace**：`sl-*` 标签必须加 `kwc:external`
- 其他约束（CSS Design Token、API 响应校验、Controller 调用规范等）请查阅 `rule.md` 对应章节

## 5. 图表组件

图表相关需求（柱状图、折线图、饼图、仪表盘等）**统一使用 ECharts**：

- 安装：`npm install echarts`
- LWC 中直接使用 ECharts API（无需额外封装库），示例：
  ```js
  import * as echarts from 'echarts';
  
  // 在 renderedCallback 中初始化
  renderedCallback() {
    if (this._chartInitialized) return;
    const container = this.template.querySelector('.chart-container');
    if (container) {
      this._chart = echarts.init(container);
      this._chart.setOption(this.chartOption);
      this._chartInitialized = true;
    }
  }
  ```
- 禁止使用其他图表库（如 Chart.js、D3.js、Highcharts 等），除非用户明确指定

## 6. 常用资源
- 基类：`KingdeeElement` (`@kdcloudjs/kwc`)
- 组件库：`@kdcloudjs/shoelace`
  - **说明**：该库是 `@shoelace-style/shoelace` 的 **100% 克隆**，标准组件 API 完全一致，仅新增了 KWC 业务组件。
  - **标准组件文档**：[https://shoelace.style/](https://shoelace.style/)
  - **所有扩展组件文档**（位于本 Skill 的 `reference/` 目录下）：
  - Table: `reference/table/index.md`
  - DatePicker: `reference/datepicker/index.md`
  - TimePicker: `reference/sl-timepicker.md`
  - Pagination: `reference/sl-pagination.md`
  - Daterangepicker: `reference/sl-daterangepicker.md`
  - ThoughtChain: `reference/sl-thought-chain.md`
  - Nav: `reference/sl-nav.md`
  - XMarkdown: `reference/sl-xmarkdown.md`
  - Think: `reference/sl-think.md`
  - TreeSelect: `reference/sl-tree-select.md`
  - Sender: `reference/sender/index.md`
  - SenderHeader: `reference/sender/index.md`
  - SenderSwitch: `reference/sender/index.md`
  - Cascader: `reference/sl-cascader.md`
  - FloatButton: `reference/sl-float-button.md`
  - FloatButtonGroup: `reference/sl-float-button.md`
  - Steps: `reference/sl-steps.md`
  - Grid: `reference/sl-grid.md`
  - Notification: `reference/sl-notification.md`
  - RadioGroup: `reference/sl-radio-group.md`
  - Upload: `reference/upload/index.md`
  - Segmented: `reference/sl-segmented.md`
  - Transfer: `reference/sl-transfer.md`
  - Popconfirm: `reference/sl-popconfirm.md`
  - Bubble: `reference/sl-bubble.md`
  - **业务组件**（`@kdcloudjs/shoelace-biz`，导入路径为 `@kdcloudjs/shoelace-biz/dist/components/...`）：
  - Lookup (F7): `reference/sl-lookup.md`
  - **使用前必须阅读相应文档**。

## 7. 输出检查清单

提交代码前，请按 `rule.md` 中的「强制自检清单」逐项自查。
