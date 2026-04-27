# Lookup 弹出选择器

> **包归属**：`@kdcloudjs/shoelace-biz`（业务组件库），非 `@kdcloudjs/shoelace` 基础库。

F7 风格的弹出选择器组件，支持实时搜索、多选、自定义列显示，可与 BOS 平台集成。

> **⚠️ 核心约束：SlLookup 不支持本地数据选择**
>
> SlLookup 是一个**远程搜索组件**，必须配置 `app` + `entity` 属性，由组件内部自动调用后端 API（`/kwc/v1/kd/{app}/kwcform/{entity}/lookupdatas?search=...`）进行搜索和数据获取。
>
> **严禁**在 `sl-lookup-search` 事件中手动设置 `results`/`columns` 来实现本地数据过滤，这不是该组件的设计用途。如果需要本地数据选择，请使用 `<sl-select>` 或 `<sl-combobox>` 等组件。

## 特性概览

- **F7 弹出选择器风格**：点击搜索按钮或输入文字时弹出下拉面板，显示多列数据供用户选择
- **远程搜索**：必须配置 app + entity，组件自动调用后端 API 获取数据，支持防抖
- **单选/多选**：支持单选和多选模式，多选值以分号分隔
- **自定义列**：通过 columns 属性配置面板中显示的字段和表头
- **displayFields/editFields**：分别控制选中后显示值和编辑态显示值
- **BOS 平台集成**：通过 formId 等参数可打开 BOS showconfig 弹窗
- **页脚按钮**：可选的"新增"和"更多"按钮
- **三种尺寸**：small/medium/large
- **表单集成**：支持 required/disabled、表单验证等
- **快捷键**：F7 打开更多弹窗

## 基础用法

最简单的用法，配置 `app` 和 `entity` 后组件自动调用后端 API 搜索数据。

```vue
<template>
  <sl-lookup
    app="bos"
    entity="bos_user"
    placeholder="请输入搜索关键词"
    @sl-lookup-change="handleChange"
  ></sl-lookup>
</template>

<script setup>
import '@kdcloudjs/shoelace-biz/dist/components/lookup/lookup.js';

function handleChange(event) {
  console.log('选中项:', event.detail.value);
}
</script>
```

## 自定义列

使用 columns 属性配置面板显示的列，包括字段名、表头和列宽。配合 app + entity 使用。数组/对象类型属性必须使用 `.prop` 修饰符传递。

```vue
<template>
  <sl-lookup
    app="hr"
    entity="employee"
    :columns.prop="columns"
    placeholder="搜索员工"
  ></sl-lookup>
</template>

<script setup>
import '@kdcloudjs/shoelace-biz/dist/components/lookup/lookup.js';

const columns = [
  { field: 'number', header: '编码', width: '100px' },
  { field: 'name', header: '名称', width: '120px' },
  { field: 'department', header: '部门', width: '100px' },
];
</script>
```

## 实时搜索（API 集成）

配置 app 和 entity 属性后，组件会自动调用 API 获取搜索结果，无需手动处理。

```vue
<template>
  <sl-lookup
    app="hr"
    entity="employee"
    :columns.prop="columns"
    :debounce="300"
    placeholder="输入关键词自动搜索"
    @sl-lookup-change="handleChange"
  ></sl-lookup>
</template>

<script setup>
import '@kdcloudjs/shoelace-biz/dist/components/lookup/lookup.js';

const columns = [
  { field: 'number', header: '编码', width: '100px' },
  { field: 'name', header: '名称', width: '150px' },
];

function handleChange(event) {
  console.log('选中项:', event.detail.value);
}
</script>
```

## 多选模式

使用 `multiple` 属性开启多选，选中的多个值以分号分隔显示。

```vue
<template>
  <sl-lookup
    app="bos"
    entity="bos_user"
    multiple
    :columns.prop="columns"
    placeholder="选择标签（可多选）"
    @sl-lookup-change="handleChange"
  ></sl-lookup>
</template>

<script setup>
import '@kdcloudjs/shoelace-biz/dist/components/lookup/lookup.js';

const columns = [
  { field: 'number', header: '编码', width: '100px' },
  { field: 'name', header: '名称', width: '120px' },
];

function handleChange(event) {
  // 多选模式下 value 是数组
  const selectedItems = event.detail.value;
  console.log('选中项数组:', selectedItems);
}
</script>
```

## displayFields 和 editFields

displayFields 控制选中后输入框显示的字段，editFields 控制获焦编辑时显示的字段。数组类型属性使用 `.prop` 修饰符。

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: var(--sl-spacing-medium);">
    <div>
      <p>显示名称，编辑时显示编码：</p>
      <sl-lookup
        app="bos"
        entity="bos_user"
        :columns.prop="columns"
        :displayFields.prop="['name']"
        :editFields.prop="['number']"
        placeholder="选择商品"
      ></sl-lookup>
    </div>
    <div>
      <p>显示编码+名称：</p>
      <sl-lookup
        app="bos"
        entity="bos_user"
        :columns.prop="columns"
        :displayFields.prop="['number', 'name']"
        :editFields.prop="['number', 'name']"
        separator=" - "
        placeholder="选择商品"
      ></sl-lookup>
    </div>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace-biz/dist/components/lookup/lookup.js';

const columns = [
  { field: 'number', header: '编码', width: '100px' },
  { field: 'name', header: '名称', width: '150px' },
];
</script>
```

## 自定义分隔符

使用 `separator` 属性控制多字段显示时的分隔符。

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: var(--sl-spacing-medium);">
    <sl-lookup
      app="bos"
      entity="bos_user"
      :columns.prop="columns"
      :displayFields.prop="['number', 'name']"
      separator=" | "
      placeholder="分隔符: |"
    ></sl-lookup>
    <sl-lookup
      app="bos"
      entity="bos_user"
      :columns.prop="columns"
      :displayFields.prop="['number', 'name']"
      separator=" - "
      placeholder="分隔符: -"
    ></sl-lookup>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace-biz/dist/components/lookup/lookup.js';

const columns = [
  { field: 'number', header: '编码', width: '100px' },
  { field: 'name', header: '名称', width: '120px' },
];
</script>
```

## 页脚按钮

通过 `show-add-button` 和 `show-more-button` 控制面板底部的"新增"和"更多"按钮显示。

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: var(--sl-spacing-medium);">
    <sl-lookup
      app="bos"
      entity="bos_user"
      show-add-button
      show-more-button
      placeholder="显示新增和更多按钮"
      @sl-lookup-add="handleAdd"
      @sl-lookup-more="handleMore"
    ></sl-lookup>
    <sl-lookup
      app="bos"
      entity="bos_user"
      :show-add-button="false"
      show-more-button
      placeholder="仅显示更多按钮"
      @sl-lookup-more="handleMore"
    ></sl-lookup>
    <sl-lookup
      app="bos"
      entity="bos_user"
      :show-add-button="false"
      :show-more-button="false"
      placeholder="隐藏所有页脚按钮"
    ></sl-lookup>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace-biz/dist/components/lookup/lookup.js';

function handleAdd() {
  console.log('点击新增按钮');
}

function handleMore() {
  console.log('点击更多按钮或按 F7');
}
</script>
```

## 禁用与必填

使用 `disabled` 禁用组件，使用 `required` 设置必填验证。

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: var(--sl-spacing-medium);">
    <sl-lookup
      label="禁用状态"
      disabled
      value="已选择的值"
      placeholder="禁用的 lookup"
    ></sl-lookup>
    <sl-lookup
      label="必填字段"
      required
      placeholder="此字段为必填"
      help-text="请选择一个选项"
    ></sl-lookup>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace-biz/dist/components/lookup/lookup.js';
</script>
```

## 尺寸变体

支持 small、medium、large 三种尺寸。

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: var(--sl-spacing-medium);">
    <sl-lookup app="bos" entity="bos_user" size="small" placeholder="小尺寸 (small)"></sl-lookup>
    <sl-lookup app="bos" entity="bos_user" size="medium" placeholder="中尺寸 (medium)"></sl-lookup>
    <sl-lookup app="bos" entity="bos_user" size="large" placeholder="大尺寸 (large)"></sl-lookup>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace-biz/dist/components/lookup/lookup.js';
</script>
```

## 监听事件

监听 search、change、clear 等事件处理用户交互。

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: var(--sl-spacing-medium);">
    <sl-lookup
      app="bos"
      entity="bos_user"
      clearable
      placeholder="操作后查看事件日志"
      @sl-lookup-search="handleSearch"
      @sl-lookup-change="handleChange"
      @sl-lookup-clear="handleClear"
      @sl-focus="handleFocus"
      @sl-blur="handleBlur"
    ></sl-lookup>
    <div class="event-log">
      <strong>事件日志：</strong>
      <p v-for="(log, index) in eventLog" :key="index" class="log-item">{{ log }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace-biz/dist/components/lookup/lookup.js';

const eventLog = ref([]);

function logEvent(eventName, detail) {
  eventLog.value = [...eventLog.value.slice(-4), `${eventName}: ${JSON.stringify(detail)}`];
}

function handleSearch(event) {
  logEvent('sl-lookup-search', event.detail);
}

function handleChange(event) {
  logEvent('sl-lookup-change', event.detail);
}

function handleClear() {
  logEvent('sl-lookup-clear', {});
}

function handleFocus() {
  logEvent('sl-focus', {});
}

function handleBlur() {
  logEvent('sl-blur', {});
}
</script>

<style scoped>
.event-log {
  padding: var(--sl-spacing-small);
  background: var(--sl-color-neutral-50);
  border-radius: var(--sl-border-radius-medium);
  font-size: var(--sl-font-size-x-small);
}
.log-item {
  margin: var(--sl-spacing-2x-small) 0;
  font-family: monospace;
}
</style>
```

## 通过 ref 控制

使用 ref 操作 show/hide/focus 等方法。注意：show() 仅在组件已有搜索结果时才会打开面板。

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: var(--sl-spacing-medium);">
    <div style="display: flex; gap: var(--sl-spacing-x-small); flex-wrap: wrap;">
      <sl-button size="small" @click="handleHide">hide()</sl-button>
      <sl-button size="small" @click="handleFocus">focus()</sl-button>
      <sl-button size="small" @click="handleCheckValidity">checkValidity()</sl-button>
    </div>
    <sl-lookup
      ref="lookupRef"
      app="bos"
      entity="bos_user"
      required
      label="通过 ref 控制"
      placeholder="使用上方按钮控制"
    ></sl-lookup>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace-biz/dist/components/lookup/lookup.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const lookupRef = ref(null);

async function handleHide() {
  await lookupRef.value?.hide();
}

function handleFocus() {
  lookupRef.value?.focus();
}

function handleCheckValidity() {
  const isValid = lookupRef.value?.checkValidity();
  alert(`表单验证结果: ${isValid ? '有效' : '无效'}`);
}
</script>
```

## BOS 平台集成

配置 formId、parentPageId 等参数与 BOS showconfig 弹窗集成。

```vue
<template>
  <sl-lookup
    app="hr"
    entity="employee"
    form-id="hr_employee_list"
    parent-page-id="page_001"
    check-right-app-id="hr_app"
    call-back-id="callback_001"
    :columns.prop="columns"
    show-more-button
    placeholder="点击更多或按 F7 打开 BOS 弹窗"
    @sl-lookup-more="handleMore"
    @sl-lookup-change="handleChange"
  ></sl-lookup>
</template>

<script setup>
import '@kdcloudjs/shoelace-biz/dist/components/lookup/lookup.js';

const columns = [
  { field: 'number', header: '编码', width: '100px' },
  { field: 'name', header: '名称', width: '150px' },
];

function handleMore() {
  console.log('打开 BOS showconfig 弹窗');
}

function handleChange(event) {
  console.log('BOS 选中数据:', event.detail.value);
}
</script>
```

## Properties

| 属性 | HTML 属性 | 类型 | 默认值 | 说明 |
|-----|----------|------|-------|------|
| name | name | `string` | `''` | 表单提交时的字段名 |
| value | value | `string` | `''` | 当前选中值 |
| defaultValue | - | `string` | `''` | 表单控制的默认值 |
| size | size | `'small' \| 'medium' \| 'large'` | `'medium'` | 输入框尺寸 |
| placeholder | placeholder | `string` | `''` | 输入框占位符 |
| disabled | disabled | `boolean` | `false` | 禁用状态 |
| clearable | clearable | `boolean` | `true` | 是否显示清除按钮 |
| open | open | `boolean` | `false` | 下拉面板是否打开 |
| hoist | hoist | `boolean` | `true` | 防止面板在 overflow 容器中被裁剪 |
| filled | filled | `boolean` | `false` | 使用填充样式 |
| label | label | `string` | `''` | 输入框标签 |
| placement | placement | `'top' \| 'bottom' \| ...` | `'bottom-start'` | 面板首选位置 |
| helpText | help-text | `string` | `''` | 帮助文本 |
| form | form | `string` | `''` | 关联的表单 ID |
| required | required | `boolean` | `false` | 必填字段 |
| results | - | `LookupResult[]` | `[]` | 搜索结果数据数组（`.prop` 传递） |
| columns | - | `LookupColumn[]` | `[]` | 面板列定义（`.prop` 传递） |
| showAddButton | show-add-button | `boolean` | `true` | 显示页脚"新增"按钮 |
| showMoreButton | show-more-button | `boolean` | `true` | 显示页脚"更多"按钮 |
| app | app | `string` | `''` | API 请求的应用编码（**必填**） |
| entity | entity | `string` | `''` | API 请求的实体名称（**必填**） |
| formId | form-id | `string` | `''` | BOS showconfig 子页面标识 |
| parentPageId | parent-page-id | `string` | `''` | BOS showconfig 父页面 ID |
| checkRightAppId | check-right-app-id | `string` | `''` | BOS showconfig 权限检查应用 ID |
| callBackId | call-back-id | `string` | `''` | BOS showconfig 回调 ID |
| apiUrl | api-url | `string` | `''` | 自定义 API 基础 URL |
| debounce | debounce | `number` | `300` | 搜索防抖延迟（毫秒） |
| displayFields | display-fields | `string[]` | `['name']` | 选中后输入框显示的字段列表（`.prop` 传递） |
| editFields | edit-fields | `string[]` | `['name']` | 获焦时编辑显示的字段列表（`.prop` 传递） |
| editStyle | edit-style | `'button' \| 'input'` | `'input'` | 编辑触发模式 |
| separator | separator | `string` | `','` | 多字段值拼接分隔符 |
| multiple | multiple | `boolean` | `false` | 是否允许多选 |

## Events

| 事件名 | Vue 绑定 | 说明 | 事件详情 |
|--------|---------|------|---------|
| sl-lookup-search | `@sl-lookup-search` | 点击搜索按钮或输入时触发 | `{ value: string }` |
| sl-lookup-change | `@sl-lookup-change` | 选中项变化时触发 | `{ value: StandardData \| StandardData[] }` |
| sl-lookup-clear | `@sl-lookup-clear` | 点击清除按钮时触发 | - |
| sl-clear | `@sl-clear` | 清除按钮（向后兼容） | - |
| sl-lookup-add | `@sl-lookup-add` | 点击"新增"按钮时触发 | - |
| sl-lookup-more | `@sl-lookup-more` | 点击"更多"按钮或按 F7 键时触发 | - |
| sl-focus | `@sl-focus` | 获得焦点时触发 | - |
| sl-blur | `@sl-blur` | 失去焦点时触发 | - |

## Public Methods

| 方法名 | 参数 | 返回值 | 说明 |
|-------|------|-------|------|
| show() | - | `Promise<void>` | 显示下拉面板 |
| hide() | - | `Promise<void>` | 隐藏下拉面板 |
| focus(options?) | `FocusOptions` | `void` | 设置焦点 |
| blur() | - | `void` | 移除焦点 |
| checkValidity() | - | `boolean` | 检查有效性 |
| reportValidity() | - | `boolean` | 检查有效性并显示验证消息 |
| setCustomValidity(message) | `string` | `void` | 设置自定义验证消息 |
| getForm() | - | `HTMLFormElement \| null` | 获取关联表单 |

## CSS Parts

| Part 名称 | 描述 |
|-----------|------|
| form-control | 表单控制顶层容器 |
| form-control-label | 标签容器 |
| form-control-input | 输入框容器 |
| form-control-help-text | 帮助文本容器 |
| combobox | 包装前缀、输入框、按钮的容器 |
| display-input | 实际的 input 元素 |
| clear-button | 清除按钮 |
| search-button | 搜索按钮 |
| panel | 下拉面板容器 |
| panel-header | 面板表头 |
| panel-body | 面板主体 |
| panel-footer | 面板页脚 |
| empty | 空状态区域 |
| prefix | 前缀区域 |
| suffix | 后缀区域 |

## Slots

| 插槽名称 | 描述 |
|---------|------|
| label | 标签的插槽 |
| prefix | 输入框前的图标或元素 |
| suffix | 输入框后的图标或元素 |
| search-icon | 搜索按钮图标 |
| clear-icon | 清除按钮图标 |
| empty | 无结果时显示的内容（默认 '暂无数据'） |

## 接口定义

```typescript
interface LookupColumn {
  field: string;     // 对应数据字段名
  header: string;    // 列表头显示文本
  width?: string;    // 列宽（CSS 值，如 "120px"）
}

interface LookupResult {
  [key: string]: any;
  disabled?: boolean;   // 是否禁用该行
}

// sl-lookup-change 事件返回的标准数据格式
interface StandardData {
  id: string | number;
  name: string;
  number: string;
}
```

## API 路径

- 默认: `/kwc/v1/kd/{app}/kwcform/{entity}/lookupdatas?search={searchValue}`
- 自定义: `{apiUrl}/kwc/v1/kd/{app}/kwcform/{entity}/lookupdatas?search={searchValue}`

## Vue 特别注意事项

1. **数组/对象属性传递**：`columns`、`displayFields`、`editFields`、`results` 等非原始类型属性，**必须使用 `.prop` 修饰符**（如 `:columns.prop="columns"`），否则只会被序列化为字符串。
2. **事件绑定**：使用 `@sl-lookup-search`、`@sl-lookup-change` 等标准 Vue 事件语法，事件名保持原始 kebab-case。
3. **ref 方法调用**：通过 `ref` 获取元素后直接调用 `lookupRef.value?.show()` 等方法。

## 常见问题

### Q: SlLookup 能否做本地数据选择？

A: **不能**。SlLookup 是远程搜索组件，必须配置 `app` + `entity`，由组件自动调用后端 API 获取数据。如需本地数据选择，请使用 `<sl-select>` 或 `<sl-combobox>`。

### Q: app 和 entity 必须配置吗？

A: **是的**。`app` 指定应用编码，`entity` 指定实体名称，组件会自动请求 `/kwc/v1/kd/{app}/kwcform/{entity}/lookupdatas?search=...` 获取搜索结果。

### Q: displayFields 和 editFields 有什么区别？

A:
- **displayFields**：选中后输入框显示的字段，如 `['name']` 显示名称
- **editFields**：获焦进入编辑态时显示的字段，通常用于显示编码以便快速搜索

### Q: 多选模式下值的格式是什么？

A: 多选模式下：
- 输入框显示值以分号分隔，如 "张三;李四;王五"
- `sl-lookup-change` 事件的 `detail.value` 是数组格式：`StandardData[]`

### Q: 如何与 BOS 平台集成？

A: 配置以下属性实现 BOS showconfig 弹窗集成：

```vue
<sl-lookup
  form-id="hr_employee_list"
  parent-page-id="page_001"
  check-right-app-id="hr_app"
  call-back-id="callback_001"
  @sl-lookup-more="handleMore"
/>
```

点击"更多"按钮或按 F7 键时触发 `sl-lookup-more` 事件，组件会根据配置参数打开 BOS 弹窗。
