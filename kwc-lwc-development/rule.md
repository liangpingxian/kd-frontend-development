# KWC LWC 开发硬性约束 (Hard Rules)

所有 KWC LWC 开发工作必须严格遵守以下约束。违反这些规则的代码将无法运行或无法通过审查。

> **⚠️ KWC 扩展组件声明（最高优先级）**
>
> 以下组件由 `@kdcloudjs/shoelace` 扩展提供，**开源版 Shoelace 不含这些组件**，但 KWC 版本已完整支持。AI 不得因“Shoelace 没有该组件”而使用原生 HTML 或第三方库替代。
>
> **禁止原生 HTML 替代**：
>
> | 原生 HTML（禁止） | KWC 组件（必须使用） | 文档 |
> |---|---|---|
> | `<table>` / 原生 HTML 表格 | `<sl-table>` | `./reference/table/index.md` |
> | `<input type="date">` / 原生日期输入 | `<sl-datepicker>` | `./reference/datepicker/index.md` |
>
> **KWC 扩展组件完整清单**（均可直接使用，严禁猜测 API，必须查阅对应 reference 文档）：
>
> `sl-table` · `sl-datepicker` · `sl-timepicker` · `sl-daterange-picker` · `sl-pagination` · `sl-nav` · `sl-dialog`(扩展) · `sl-x-markdown` · `sl-think` · `sl-thought-chain` · `sl-sender` · `sl-upload` · `sl-tree-select` · `sl-cascader` · `sl-float-button` · `sl-steps` · `sl-grid` · `sl-notification` · `sl-radio-group`(扩展) · `sl-space` · `sl-segmented` · `sl-transfer` · `sl-popconfirm` · `sl-bubble` · `sl-image` · `sl-lookup`(业务组件, shoelace-biz)

## 1. 核心框架与继承
- **必须使用 KingdeeElement**：所有组件必须继承 `KingdeeElement`。
  - ❌ 禁止：`import { LightningElement } from 'lwc';`
  - ✅ 必须：`import { KingdeeElement } from '@kdcloudjs/kwc';`
- **类定义**：`export default class MyComponent extends KingdeeElement { ... }`

## 2. 模板约束 (Template)
- **禁止 JavaScript 表达式**：HTML 模板中禁止使用任何 JS 表达式（如 `{a ? b : c}`, `{count + 1}`）。仅允许绑定属性 `{prop}` 或 getter `{getterName}`。
- **禁止自闭合标签**：自定义组件禁止自闭合（如 `<sl-input />`），必须使用完整闭合标签（`<sl-input></sl-input>`）。
- **属性绑定**：属性绑定禁止使用引号包裹表达式。
  - ❌ 禁止：`value="{val}"`
  - ✅ 必须：`value={val}`
- **禁止属性缩写**：自定义属性名禁止缩写（如 `<sl-input disabled></sl-input>`），必须使用完整属性赋值（如 `<sl-input disabled={isTrue}></sl-input>`）。
- **禁止 ID 选择器**：禁止在元素上定义 `id` 属性用于 CSS 或 JS 获取。必须使用 `class`，并通过 `this.template.querySelector('.class')` 获取。

## 3. Shoelace 组件集成规范
- **通用规则**：
  - **库说明**：`@kdcloudjs/shoelace` 是 `@shoelace-style/shoelace` 的 **100% 克隆**，标准组件 API **完全一致**，仅新增了部分 KWC 专用组件（如 Table、DatePicker 等）。
  - **包名**：必须使用 `@kdcloudjs/shoelace`，禁止使用 `@shoelace-style/shoelace`。
  - **属性名**：HTML 属性名使用小写（kebab-case），如 `readonly`、`help-text`。
  - **样式**：默认不手工导入主题 CSS，平台通常已注入。
- **kwc:external 使用规则**：
  - ✅ **所有Shoelace 组件**（`sl-*`）：**必须**添加 `kwc:external`。
  - ❌ **KWC 内部组件**（`kwc-*`）：**绝对禁止**添加 `kwc:external`。
- **属性命名**：属性名必须全小写（kebab-case）。
  - ❌ 禁止：`pageSize={...}`
  - ✅ 必须：`page-size={...}`
- **导入规范**：
  - **基础组件**：使用组件前必须导入对应的 `.js` 定义文件。
    - 示例：`import '@kdcloudjs/shoelace/dist/components/button/button.js';`
  - **业务组件**（`@kdcloudjs/shoelace-biz`）：从 `shoelace-biz` 包导入。
    - 当前业务组件：**Lookup (F7)**，后续可能新增其他业务组件。
    - 示例：`import '@kdcloudjs/shoelace-biz/dist/components/lookup/lookup.js';`

## 4. 事件绑定约束 (Event Binding)
- **HTML 中仅限原生事件**：HTML 模板中只能绑定原生交互事件（`click`, `focus`, `blur`, 键盘/鼠标事件）。
- **禁止在 HTML 绑定 Shoelace 事件**：严禁在 HTML 中使用 `onslchange`, `onslinput` 等。
- **JS 中绑定 Shoelace 事件**：
  - 必须在 `renderedCallback` 中通过 `this.template.querySelector` 获取元素并使用 `addEventListener` 绑定。
  - **防止重复绑定**：需设置标志位（如 `_eventsBound`）确保只绑定一次。
- **自定义事件 (子传父)**：
  - 必须使用 `CustomEvent`，数据存放在 `detail` 中。
  - 示例：`this.dispatchEvent(new CustomEvent('change', { detail: { value: 'data' } }));`

## 5. JavaScript 与 DOM 规范
- **禁止引入 CSS 文件**：JS 文件中不需要也不允许引入 CSS 文件（如 `import './exampleComponent.css'`）。样式应通过同名 `.css` 文件自动加载。
- **DOM 访问限制**：
  - ❌ 禁止：`document.getElementById`, `window.document`。
  - ✅ 必须：`this.template.querySelector('.class-name')`。
- **生命周期**：
  - ❌ 禁止：调用 `super.connectedCallback()` 或 `super.renderedCallback()`。
- **数据响应式**：
  - 修改对象属性或数组元素时，必须通过**重赋值**触发更新（Immutable Pattern）。
  - ✅ 推荐：`this.items = [...this.items, newItem];`

## 6. KWC 扩展组件文档与约束
- **标准组件**（Button/Input/Icon 等）：参考官网 [https://shoelace.style/](https://shoelace.style/)
- **扩展组件**（`@kdcloudjs/shoelace`）：以下组件为 KWC 专用扩展组件（不在 Shoelace 官网），当任务涉及这些组件时，**必须立即调用 Read 工具读取并学习**对应的 reference 文档，严禁凭空猜测 API：

- **对话框 (Dialog)**:
  - 文档：`./reference/sl-dialog.md`
  - 扩展属性：`mask-closable` 控制点击蒙层是否允许关闭
- **表格 (Table)**:
  - 文档：`./reference/table/index.md` (**涉及表格开发时必须读取**)
  - **严禁使用原生 HTML `<table>` 实现表格需求**，必须使用 `sl-table`（KWC 扩展组件）。开源 Shoelace 不含 Table 组件，但 `@kdcloudjs/shoelace` 已扩展提供，禁止退回原生 HTML 表格。
  - `sl-table` 不支持 `sl-table-column`，必须通过 `columns` 属性定义列。
  - 需导入 `@kdcloudjs/shoelace/dist/components/table/table.js`。
  - 查阅文档排查 `sl-table` 列未显示等问题。
- **日期选择器 (DatePicker)**:
  - 文档：`./reference/datepicker/index.md`
  - 严禁使用 `<sl-input type="date">`，必须使用 `<sl-datepicker kwc:external>`。
  - 需导入 `@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js`。
- **时间选择器 (TimePicker)**:
  - 文档：`./reference/sl-timepicker.md`
- **分页器 (Pagination)**:
  - 文档：`./reference/sl-pagination.md`
- **导航 (Nav)**:
  - 文档：`./reference/sl-nav.md`
  - 涉及 `sl-nav`、`sl-nav-item`、`sl-nav-group`、`sl-nav-submenu` 时必须先阅读
- **Markdown 渲染器 (XMarkdown)**:
  - 文档：`./reference/sl-xmarkdown.md`
  - 涉及 `sl-x-markdown` 时必须先阅读
- **思考过程 (Think)**:
  - 文档：`./reference/sl-think.md`
- **消息发送 (Sender)**:
  - 文档：`./reference/sender/index.md` (**涉及 Sender 开发时必须读取**)
  - 包含 `sl-sender`（主体）、`sl-sender-header`（可折叠头部）、`sl-sender-switch`（功能开关）三个子组件
  - 需导入对应的 `.js` 定义文件，标签必须加 `kwc:external`
  - **自定义插槽**：优先使用 `lit` 中的 `html` 模板字面量（`import { html } from 'lit'`）实现自定义插槽功能（如 `header`、`footer`、`suffixContent`、`prefixContent`），而非 DOM 操作或原生 slot 元素
  - **自定义 footer**：必须使用函数式 `footer`（`sender.footer = (defaultFooter, { components }) => html\`...\``），并通过 `components` 解构使用 `SendButton`、`ClearButton`、`LoadingButton` 等内置按钮渲染器，禁止手动创建发送/清空/加载按钮
- **文件上传 (Upload)**:
  - 文档：`./reference/upload/index.md` (**涉及 Upload 开发时必须读取**)
  - 需导入 `@kdcloudjs/shoelace/dist/components/upload/upload.js`，标签必须加 `kwc:external`
  - 支持点击上传、拖拽上传、粘贴上传、目录上传等多种模式
  - 支持 `beforeUpload` 校验、`customRequest` 自定义上传、`itemRender`/`iconRender` 自定义渲染

- **其他扩展组件**（使用前**必须**阅读对应 reference 文档，严禁猜测 API）：
  - sl-thought-chain（思维链）: `./reference/sl-thought-chain.md`
  - sl-daterange-picker（日期范围选择器）: `./reference/sl-daterangepicker.md`
  - sl-tree-select（树选择器）: `./reference/sl-tree-select.md`
  - sl-cascader（级联选择器）: `./reference/sl-cascader.md`
  - sl-float-button（浮动按钮）: `./reference/sl-float-button.md`
  - sl-steps（步骤条）: `./reference/sl-steps.md`
  - sl-grid（栅格布局）: `./reference/sl-grid.md`
  - sl-notification（通知提醒）: `./reference/sl-notification.md`
  - sl-radio-group（单选组，扩展）: `./reference/sl-radio-group.md`
  - sl-space（间距）: `./reference/sl-space.md`
  - sl-segmented（分段控制器）: `./reference/sl-segmented.md`
  - sl-transfer（穿梭框）: `./reference/sl-transfer.md`
  - sl-popconfirm（气泡确认框）: `./reference/sl-popconfirm.md`
  - sl-bubble（气泡）: `./reference/sl-bubble.md`
  - sl-image（图片）: `./reference/sl-image.md`

- **业务组件**（`@kdcloudjs/shoelace-biz`）：以下组件来自业务组件库，**导入路径为 `@kdcloudjs/shoelace-biz/dist/components/...`**，不是 `@kdcloudjs/shoelace`：

- **弹出选择器 / F7 (Lookup)**:
  - 文档：`./reference/sl-lookup.md` (**涉及 Lookup 开发时必须读取**)
  - 导入：`import '@kdcloudjs/shoelace-biz/dist/components/lookup/lookup.js';`
  - 远程搜索组件，必须配置 `app` + `entity`，不支持本地数据选择
  - 标签必须加 `kwc:external`

## 7. 常见排障
1. **构建报错 `(!) Unresolved dependencies`**：例如提示 `sl/tabPanel` 无法解析。这是因为 HTML 中 Shoelace 组件缺少 `kwc:external` 属性，导致编译器将其误判为 LWC 组件。
2. **组件不渲染样式**：如果构建正常但页面组件无样式（显示为原生标签），检查 JS 中是否导入了组件定义文件。
3. **事件未触发**：检查是否在 JS 中通过 `addEventListener` 绑定，HTML 中禁止绑定自定义事件。
4. **找不到 Table 文档**：使用 `reference/table/index.md`，不要查 Shoelace 官网。

## 8. 开发工具与环境约束 (Tools & Environment)
- **严禁运行 ESLint/Prettier 修复与校验**：**绝对禁止**运行任何形式的 lint fix 命令（无论是手动还是自动，如 `eslint --fix`）。同时，**不需要**关注或修复 ESLint 格式报错。KWC LWC 的特殊语法（如无表达式模板）可能与通用规则冲突，强行修复会导致代码损坏。
- **严禁修改既有配置**：严禁修改 `.eslintrc`, `.prettierrc` 或 `package.json` 中的构建脚本。

## 9. ⚠️ API 响应防御性校验约束（P0 高频问题）

**背景**：KS 运行时在序列化后端响应时，**可能将 JavaScript 数组 `[]` 转换为空对象 `{}`**，导致前端代码调用 `.map()` 等数组方法时崩溃白屏。

### 9.1 禁止对 adapterApi 响应直接强转类型

```javascript
// ❌ 危险：直接信任响应结构
this.data = responseData;
this.items = this.data.items; // 如果 items 是 {} 而非 []，后续崩溃

// ✅ 安全：逐字段校验 + 容错
const raw = responseData || {};
this.title = raw.title ?? '';
this.summary = raw.summary ?? '';
this.items = Array.isArray(raw.items) ? [...raw.items] : [];
```

### 9.2 数组字段必须用 `Array.isArray()` 校验后再使用

```javascript
// ❌ 危险：如果 items 实际是 {}，迭代器行为异常
get itemsList() {
  return this.items.map(item => ({ label: item }));
}

// ✅ 安全：先校验再处理
get itemsList() {
  if (!Array.isArray(this.items)) return [];
  return this.items.map(item => ({ label: item }));
}
```

### 9.3 如后端返回 JSON 字符串化的数组，前端需安全 parse

```javascript
let items = [];
try {
  const parsed = JSON.parse(raw.items);
  items = Array.isArray(parsed) ? parsed : [];
} catch (e) {
  items = [];
}
this.items = items;
```

## 10. Controller API 调用规范

当组件需要调用后端 Controller API 时，**必须**使用 `adapterApi` 的 `doGet` / `doPost` 方法，并正确配置 `endpointConfig`。

> **完整用法、参数说明和示例请参考**：`../kwc-ks-controller-development/reference/frontend-integration.md`——编写 Controller API 调用代码前**必须阅读**该文档。

### 10.1 关键约束

- `endpointConfig` 中的 `isv` 和 `app` **必须**从 `this.config.isvId` 和 `this.config.moduleId` 动态获取，**禁止**硬编码
- `source` 字段必须与 Controller XML 配置中的 URL 路径一致（去掉 `/{isv}/{app}/` 前缀）
- `version` 固定为 `'v1'`
- 组件销毁时**必须**调用 `adapter.disconnect()` 防止内存泄漏（在 `disconnectedCallback` 中处理）

### 10.2 快速参考

```javascript
import { adapterApi } from '@kdcloudjs/kwc-shared-utils/api';

export default class MyComponent extends KingdeeElement {
  adapter = null;

  connectedCallback() {
    this.fetchData();
  }

  disconnectedCallback() {
    if (this.adapter) this.adapter.disconnect();
  }

  fetchData() {
    if (this.adapter) this.adapter.disconnect();

    this.adapter = adapterApi.doGet(({ data, error }) => {
      if (error) { console.error(error.message); return; }
      // 处理 data（注意防御性校验，见第 9 节）
      this.data = data;
    });

    this.adapter.update({
      endpointConfig: {
        isv: this.config.isvId,
        app: this.config.moduleId,
        source: 'sample/users',   // Controller XML url 去掉 /{isv}/{app}/ 前缀
        version: 'v1',
      },
      params: { page: 1, size: 10 },
      headers: {},
    });
  }
}
```

## 11. CSS 样式规范 — 必须使用 Design Token
- 编写 CSS 时，颜色、间距、字号、圆角等属性**必须**使用 Shoelace Design Token，**禁止**硬编码 hex 色值或 px 数值。
- 完整的 Token 速查表（颜色/间距/字号/圆角映射、正反示例、例外情况）请参考：`./reference/css-design-tokens.md`
- **编写 CSS 代码前必须阅读该文档。**

## 12. 强制自检清单
- [ ] 继承自 `KingdeeElement` 而非 `LightningElement`
- [ ] **所有Shoelace 组件**（`sl-*`）有 `kwc:external`，**所有KWC 内部组件**（`kwc-*`）没有 `kwc:external`
- [ ] HTML 无 JS 表达式，无自闭合标签，无属性缩写
- [ ] Shoelace 事件 (`sl-change`) 在 JS 中绑定
- [ ] 扩展组件（Table/DatePicker等）已参考本地 reference 文档
- [ ] CSS 样式使用 Design Token，无硬编码 hex 色值或 px 间距/字号/圆角
- [ ] **API 响应校验**: 是否对 adapterApi 响应做了防御性校验？禁止直接信任响应结构？数组字段是否用 `Array.isArray()` 校验？
- [ ] **API 调用规范**: 调用 Controller API 时是否使用 `adapterApi`？`isv`/`app` 是否从 `config` 动态获取？
- [ ] **未运行**任何 ESLint/Prettier 修复命令，并**忽略**了所有 ESLint 格式报错
