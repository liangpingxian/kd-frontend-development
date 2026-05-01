# KWC Vue 开发硬性约束 (Hard Rules)

所有 KWC Vue 开发工作必须严格遵守以下约束。违反这些规则的代码将无法运行或无法通过审查。

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

> **框架版本**：本项目基于 **Vue 3**，统一使用 Composition API + `<script setup>` 语法。**绝对禁止**使用 Vue 2 的 Options API 或 Vue 2 特有语法。

## P0：组件使用强制约束

- 实现 UI **必须优先使用** @kdcloudjs/shoelace 扩展组件，禁止用原生 HTML 元素替代已有组件功能（如用 `<div>` 模拟 `<sl-card>`、用 `<table>` 替代 `<sl-table>`）
- 页面布局**必须参考** `references/page-design-guide.md` 中的模板和组件组合模式
- 样式**必须使用** Design Token（CSS 变量），禁止硬编码颜色、字号、间距、圆角等数值

## P0：KWC 组件入参规范（⚠️ 高频踩坑）

KWC 运行时**直接将 KwcConfig 的字段作为 props 传入组件**，不会用 `{ config }` 包裹。

✅ 正确写法：
```vue
<script setup lang="ts">
// KwcConfig 的字段直接作为 props
const props = defineProps<{ pageId: string; componentId: string; isvId: string; moduleId: string }>();
const { pageId, isvId, moduleId } = toRefs(props);
</script>
```

❌ 错误写法（会导致 `Cannot read properties of undefined`）：
```vue
<script setup lang="ts">
// ❌ config 是 undefined，运行时崩溃
const props = defineProps<{ config: KwcConfig }>();
const pageId = props.config.pageId;
</script>
```

**原因**：KWC 框架在渲染组件时，是 `<MyComponent v-bind="kwcConfig" />`，而不是 `<MyComponent :config="kwcConfig" />`。

> 注意：本文档其他章节中提及的 `config.isvId`、`config.moduleId` 等，均指 `defineProps` 接收的 props 对象（命名为 `config` 的变量），**不是** `props.config`。

## 1. Vue 3 基础规范
- **Composition API**：
  - 统一使用 `<script setup>` 或 `<script setup lang="ts">` 语法。
  - **禁止** Options API（`export default { data(), methods, computed, watch, mounted() }`）。
  - **禁止**使用 `this`（Composition API 中无 `this`）。
- **响应式状态**：
  - 使用 `ref()` 声明基础类型响应式数据，使用 `reactive()` 声明对象类型。
  - 修改 `ref` 值使用 `.value`。
- **生命周期**：使用 `onMounted()`、`onUnmounted()` 等 Composition API 钩子，**禁止** `mounted()`、`created()` 等 Options API 钩子。
- **Vue 2 禁止语法清单**：
  - `Vue.use()` / `Vue.component()` / `new Vue()` → 无需注册，导入即用
  - `this.$refs` / `this.$emit` / `this.$set` / `this.$delete` → 使用 `ref()` / `emit()` / 直接赋值
  - `<slot>` 中 `v-bind` slot 属性（Scoped Slots Vue 2 语法） → 使用 Vue 3 `#slotName` 语法
- **⭐ 极度重要：自定义单元格 / 展开行 slot 写法**：
  - **禁止**在 `<template>` 上使用 `v-for` + 动态插槽指令（如 `#[\`custom-cell-xxx-${row.id}\`]`），在 Vite 编译时会报 错。
  - **正确写法**：在 `v-for` 循环的**元素本身**上绑定 `:slot` 属性：
    ```html
    <!-- ✅ 正确：在循环元素上绑定 :slot -->
    <div
      v-for="row in dataSource"
      :key="row.id"
      :slot="`custom-cell-status-${row.id}`"
    >
      ...
    </div>

    <!-- ❌ 错误：在 <template> 上使用 v-for + 动态插槽指令，Vite 编译报错 -->
    <template v-for="row in dataSource" #[`custom-cell-status-${row.id}`] :key="row.id">
      <div>...</div>
    </template>
    ```

## 2. 导入规范
- **基础组件导入**：
  - 从 `@kdcloudjs/shoelace/dist/components/[component]/[component].js` 导入。
  - 导入即注册 Web Component，无需 `Vue.use()` 或 `components: {}` 注册。
  - 示例：`import '@kdcloudjs/shoelace/dist/components/input/input.js';`
- **业务组件导入**（`@kdcloudjs/shoelace-biz`）：
  - 从 `@kdcloudjs/shoelace-biz/dist/components/[component]/[component].js` 导入。
  - 当前业务组件：**Lookup (F7)**，后续可能新增其他业务组件。
  - 示例：`import '@kdcloudjs/shoelace-biz/dist/components/lookup/lookup.js';`

## 3. 模板规范 (Template)
- **组件标签**：必须使用 kebab-case 标签（如 `<sl-input></sl-input>`），禁止 PascalCase（`<SlInput>`）。
- **Shoelace 事件绑定**：
  - 必须使用 `@sl-*` 绑定自定义事件。
  - 示例：`@sl-change="handleChange"`，`@sl-input="handleInput"`。
  - 禁止使用 `@change` 或 `@input` 监听 Shoelace 组件（除非组件文档明确支持原生事件）。
- **属性绑定**：
  - 使用 `:prop` 绑定属性。
  - 使用 `v-model` 进行双向绑定（需组件支持 `v-model` 接口）。
  - Boolean 属性直接写属性名表示 true，省略表示 false。
  - **⭐ 极度重要：对象/数组类型属性必须用 camelCase + `.prop` 修饰符**：
    - 由于 DOM attribute 只能为字符串，传递对象/数组类型的属性时必须直接设置 DOM property。
    - **属性名必须使用 camelCase**：kebab-case 的动态绑定无法正确映射到 DOM property。
    - **必须添加 `.prop` 修饰符**：强制 Vue 3 以 DOM property 方式传递值。
    ```html
    <!-- ✅ 正确：camelCase + .prop 修饰符 -->
    <sl-table :dataSource.prop="rows" :columns.prop="cols" :rowSelection.prop="sel"></sl-table>
    <sl-pagination :pageSizeOpts.prop="[25, 50, 100]"></sl-pagination>

    <!-- ❌ 错误：kebab-case 绑定，数组/对象会变成 [object Array] / [object Object] -->
    <sl-table :data-source="rows" :row-selection="sel"></sl-table>
    <sl-pagination :page-size-opts="[25, 50, 100]"></sl-pagination>
    ```
  - **数字类型属性**：使用 camelCase 绑定，不需要 `.prop` 修饰符（如 `:pageSize="20"`、`:currentPage="1"`）。
  - **字符串和布尔属性**：必须使用 camelCase，无需 `.prop`（如 `rowKey="id"`、`showHeader`、`simpleMode`）。**禁止** kebab-case（如 `row-key`、`show-header`、`simple-mode`）。
    ```html
    <!-- ✅ 正确：camelCase 属性名 -->
    <sl-table rowKey="id" showHeader></sl-table>
    <sl-pagination simpleMode></sl-pagination>

    <!-- ❌ 错误：kebab-case 属性名 -->
    <sl-table row-key="id" show-header></sl-table>
    <sl-pagination simple-mode></sl-pagination>
    ```

## 4. Shoelace 组件集成规范
- **通用规则**：
  - **库说明**：`@kdcloudjs/shoelace` 是 `@shoelace-style/shoelace` 的 **100% 克隆**，标准组件 API **完全一致**，仅新增了部分 KWC 专用组件。
  - **包名**：必须使用 `@kdcloudjs/shoelace`，禁止使用 `@shoelace-style/shoelace`。
  - **属性名**：向 Shoelace 组件传递属性时，属性名**必须使用 camelCase**（如 `rowKey`、`showHeader`、`simpleMode`），**禁止** kebab-case（如 `row-key`、`show-header`、`simple-mode`）。
  - **样式**：默认不手工导入主题 CSS，平台通常已注入。
- **排障**：
  - **组件不渲染样式**：检查是否在 script 中导入了 `.js` 文件。

## 5. 事件与数据处理
- **事件对象**：在处理函数中通过 `event.target` 获取组件值（Shoelace 组件通常是 Web Component，`v-model` 可能不适用所有场景）。
  - 示例：`const value = (event.target as HTMLInputElement).value;`
- **响应式状态**：
  - 推荐使用 `ref` 或 `reactive` (Composition API)。
  - 保持事件命名与业务语义一致（如 `handleInput`、`handleSubmit`）。
- **⭐极度重要：Web Components 响应式数据更新**：
  - 向 Shoelace/KWC Web Components （例如 `sl-table` 的 `:dataSource.prop`）传递复杂数据（数组/对象）时，**绝对禁止**进行“原地修改”（如调用 `push`、`splice` 或直接修改对象属性）。
  - Web Components 内部（基于 Lit）进行的是严格的引用比对（`===`），只有整个数组/对象引用发生改变时，才会触发组件重新渲染。即使你在 Vue 中使用了 `reactive`，原地修改也无法驱动组件刷新。
  - **规范写法**：始终使用不可变方式更新数据，如 `dataSource.value = [...dataSource.value, newItem]` 或 `dataSource.value = dataSource.value.map(...)` 生成**全新的引用**并重新赋值。

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
- **日期选择器 (DatePicker)**:
  - 文档：`./reference/datepicker/index.md`
  - 严禁使用 `<sl-input type="date">`，必须使用 `<sl-datepicker>`。
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
  - 需导入对应的 `.js` 定义文件
  - **自定义插槽**：优先使用 `lit` 中的 `html` 模板字面量（`import { html } from 'lit'`）实现自定义插槽功能（如 `header`、`footer`、`suffixContent`、`prefixContent`），而非 DOM 操作或原生 Vue 模板
  - **自定义 footer**：必须使用函数式 `footer`（`sender.footer = (defaultFooter, { components }) => html\`...\``），并通过 `components` 解构使用 `SendButton`、`ClearButton`、`LoadingButton` 等内置按钮渲染器，禁止手动创建发送/清空/加载按钮
- **文件上传 (Upload)**:
  - 文档：`./reference/upload/index.md` (**涉及 Upload 开发时必须读取**)
  - 需导入 `@kdcloudjs/shoelace/dist/components/upload/upload.js`
  - 支持点击上传、拖拽上传、粘贴上传、目录上传等多种模式
  - 支持 `beforeUpload` 校验、`customRequest` 自定义上传、`itemRender`/`iconRender` 自定义渲染
  - **对象/数组属性必须用 `.prop`**：`:headers.prop`、`:fileList.prop`、`:beforeUpload.prop` 等

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

## 7. 开发工具与环境约束 (Tools & Environment)
- **严禁运行 ESLint/Prettier 修复与校验**：**绝对禁止**运行任何形式的 lint fix 命令（无论是手动还是自动，如 `eslint --fix`）。同时，**不需要**关注或修复 ESLint 格式报错。KWC Vue 的特殊语法可能与通用规则冲突，强行修复会导致代码损坏。
- **严禁修改既有配置**：严禁修改 `.eslintrc`, `.prettierrc` 或 `package.json` 中的构建脚本。

## 8. ⚠️ API 响应防御性校验约束（P0 高频问题）

**背景**：KS 运行时在序列化后端响应时，**可能将 JavaScript 数组 `[]` 转换为空对象 `{}`**，导致前端代码调用 `.map()` 等数组方法时崩溃白屏。

### 8.1 禁止对 adapterApi 响应直接使用 `as` 类型断言

```typescript
// ❌ 危险：直接强转，运行时数据类型可能与接口定义不符
const result = responseData as MyResponse;

// ✅ 安全：逐字段校验 + 容错
const raw = responseData || {};
data.value = {
  title: raw.title ?? '',
  summary: raw.summary ?? '',
  items: Array.isArray(raw.items) ? raw.items : [],
};
```

### 8.2 数组字段必须用 `Array.isArray()` 校验后再使用 `v-for`

```html
<!-- ❌ 危险：如果 items 实际是 {}，v-for 行为异常 -->
<li v-for="item in data.items" :key="item">{{ item }}</li>

<!-- ✅ 安全：先校验再渲染 -->
<template v-if="Array.isArray(data.items)">
  <li v-for="item in data.items" :key="item">{{ item }}</li>
</template>
```

### 8.3 如后端返回 JSON 字符串化的数组，前端需安全 parse

```typescript
const items: string[] = (() => {
  try {
    const parsed = JSON.parse(raw.items);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
})();
```

## 9. Controller API 调用规范

当组件需要调用后端 Controller API 时，**必须**使用 `adapterApi` 的 `doGet` / `doPost` 方法，并正确配置 `endpointConfig`。

> **完整用法、参数说明和示例请参考**：`../kwc-ks-controller-development/reference/frontend-integration.md`——编写 Controller API 调用代码前**必须阅读**该文档。

### 9.1 关键约束

- `endpointConfig` 中的 `isv` 和 `app` **必须**从组件参数 `config.isvId` 和 `config.moduleId` 动态获取，**禁止**硬编码
- `source` 字段必须与 Controller XML 配置中的 URL 路径一致（去掉 `/{isv}/{app}/` 前缀）
- `version` 固定为 `'v1'`
- 组件卸载时**必须**调用 `adapter.disconnect()` 防止内存泄漏（在 `onUnmounted` 中处理）

### 9.2 快速参考

```typescript
import { adapterApi } from '@kdcloudjs/kwc-shared-utils/api';
import { ref, onUnmounted } from 'vue';

// KWC 组件直接接收 config 作为 props（与 React 的 (config) => {} 等价）
const config = defineProps<{ isvId: string; moduleId: string }>();

let adapter: any = null;
const data = ref<any>(null);

function fetchData() {
  if (adapter) adapter.disconnect();

  adapter = adapterApi.doGet(({ data: resData, error }) => {
    if (error) { console.error(error.message); return; }
    // 处理 resData（注意防御性校验，见第 8 节）
    data.value = resData;
  });

  adapter.update({
    endpointConfig: {
      isv: config.isvId,
      app: config.moduleId,
      source: 'sample/users',   // Controller XML url 去掉 /{isv}/{app}/ 前缀
      version: 'v1',
    },
    params: { page: 1, size: 10 },
    headers: {},
  });
}

onUnmounted(() => {
  if (adapter) adapter.disconnect();
});
```

## 10. CSS 样式规范 — 必须使用 Design Token
- 编写 CSS 时，颜色、间距、字号、圆角等属性**必须**使用 Shoelace Design Token，**禁止**硬编码 hex 色值或 px 数值。
- 完整的 Token 速查表（颜色/间距/字号/圆角映射、正反示例、例外情况）请参考：`./reference/css-design-tokens.md`
- **编写 CSS 代码前必须阅读该文档。**

## 11. 强制自检清单
- [ ] 使用 Vue 3 Composition API (`<script setup>`)，未使用 Options API
- [ ] 已导入所有使用的 Shoelace 组件 (`import '.../dist/components/...'`)
- [ ] 模板中使用 kebab-case 标签 (`<sl-input>`)
- [ ] 事件绑定使用 `@sl-*` (`@sl-change`)
- [ ] 响应式状态使用 `ref()` / `reactive()`，未使用 `this`
- [ ] 自定义单元格/展开行 slot 使用 `v-for` + `:slot="\`...-${row.id}\`"` 绑定，**未**在 `<template>` 上使用动态插槽指令
- [ ] **API 响应校验**: 是否对 adapterApi 响应做了防御性校验？禁止直接 `as` 强转？数组字段是否用 `Array.isArray()` 校验？
- [ ] **API 调用规范**: 调用 Controller API 时是否使用 `adapterApi`？`isv`/`app` 是否从 `config` 动态获取？
- [ ] 未运行 `eslint --fix`
