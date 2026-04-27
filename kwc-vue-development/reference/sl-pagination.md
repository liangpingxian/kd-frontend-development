# Pagination 分页器

用于数据分页展示的控件，支持页码跳转和每页条数设置。

## 特性概览

- **双模式切换**：支持标准模式和简洁模式 (`simpleMode`)
- **页码跳转**：支持输入页码快速跳转（标准模式）
- **每页条数**：支持自定义每页显示条数选项
- **受控/非受控**：支持受控模式 (`:currentPage`) 和非受控模式 (`:defaultCurrentPage`)
- **禁用状态**：支持整体禁用交互
- **自定义样式**：丰富的 CSS 自定义属性

## 基础用法

最简单的分页器用法，使用默认配置。

```vue
<template>
  <sl-pagination></sl-pagination>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';
</script>
```

## 设置总数据量

使用 `total` 属性设置总数据量，组件会自动计算总页数。

```vue
<template>
  <sl-pagination :total="1000"></sl-pagination>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';
</script>
```

## 设置每页条数

使用 `pageSize` 属性设置每页显示的条数，默认为 20。

```vue
<template>
  <sl-pagination :total="500" :pageSize="50"></sl-pagination>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';
</script>
```

## 自定义每页条数选项

使用 `pageSizeOpts` 属性自定义下拉菜单中的每页条数选项。该属性为数组类型，必须使用 `:pageSizeOpts.prop` 传递。

```vue
<template>
  <sl-pagination
    :total="1000"
    :pageSize="25"
    :pageSizeOpts.prop="[25, 50, 100, 200]"
  ></sl-pagination>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';
</script>
```

## 设置默认页码

使用 `defaultCurrentPage` 属性设置默认显示的页码（非受控模式）。

```vue
<template>
  <sl-pagination :total="500" :defaultCurrentPage="5"></sl-pagination>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';
</script>
```

## 受控模式

使用 `currentPage` 属性进行受控模式，页码由外部状态管理。监听 `@sl-page-change` 事件并更新 `currentPage`。

```vue
<template>
  <div class="pagination-demo">
    <p class="page-info">当前页码: <span>{{ currentPage }}</span></p>
    <sl-pagination
      :total="500"
      :currentPage="currentPage"
      @sl-page-change="handlePageChange"
    ></sl-pagination>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';

const currentPage = ref(1);

function handlePageChange(event) {
  currentPage.value = event.detail.pageNumber;
}
</script>

<style scoped>
.pagination-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
}
.page-info {
  font-size: var(--sl-font-size-small);
  color: var(--sl-color-neutral-600);
}
</style>
```

## 简洁模式

使用 `simpleMode` 属性启用简洁模式，只显示上一页/下一页按钮和每页条数选择器，不显示页码输入框和总页数信息。

```vue
<template>
  <sl-pagination :total="500" simpleMode></sl-pagination>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';
</script>
```

## 禁用状态

使用 `disabled` 属性禁用分页器的所有交互。

```vue
<template>
  <sl-pagination :total="500" disabled></sl-pagination>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';
</script>
```

## 监听分页事件

通过 `@sl-page-change` 事件获取页码变化和每页条数变化。事件的 `detail` 对象包含 `pageNumber`（当前页码）和 `pageSize`（每页条数）。

```vue
<template>
  <div class="pagination-demo">
    <div class="event-info">
      <p>当前页码: <span>{{ pageNumber }}</span></p>
      <p>每页条数: <span>{{ pageSize }}</span></p>
    </div>
    <sl-pagination
      :total="1000"
      @sl-page-change="handlePageChange"
    ></sl-pagination>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';

const pageNumber = ref(1);
const pageSize = ref(20);

function handlePageChange(event) {
  pageNumber.value = event.detail.pageNumber;
  pageSize.value = event.detail.pageSize;
  console.log(`请求第 ${event.detail.pageNumber} 页数据，每页 ${event.detail.pageSize} 条`);
}
</script>

<style scoped>
.pagination-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
}
.event-info {
  padding: var(--sl-spacing-small);
  background: var(--sl-color-neutral-100);
  border-radius: var(--sl-border-radius-medium);
}
.event-info p {
  margin: var(--sl-spacing-2x-small) 0;
  font-size: var(--sl-font-size-small);
}
</style>
```

## 与表格配合使用

分页器通常与数据表格配合使用，以下是一个完整的示例。

```vue
<template>
  <div class="table-with-pagination">
    <sl-table
      rowKey="id"
      :columns.prop="columns"
      :dataSource.prop="tableData"
    ></sl-table>
    <div class="pagination-wrapper">
      <sl-pagination
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @sl-page-change="handlePageChange"
      ></sl-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';
import '@kdcloudjs/shoelace/dist/components/table/table.js';

const tableData = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '名称', dataIndex: 'name', width: 200 },
  { title: '状态', dataIndex: 'status', width: 100 }
];

function fetchData() {
  // 模拟数据
  total.value = 256;
  const start = (currentPage.value - 1) * pageSize.value;
  tableData.value = Array.from({ length: pageSize.value }, (_, i) => ({
    id: start + i + 1,
    name: `Item ${start + i + 1}`,
    status: i % 2 === 0 ? 'Active' : 'Inactive'
  }));
}

function handlePageChange(event) {
  currentPage.value = event.detail.pageNumber;
  pageSize.value = event.detail.pageSize;
  fetchData();
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.table-with-pagination {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
}
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: var(--sl-spacing-x-small) 0;
}
</style>
```

## 自定义样式

使用 CSS 自定义属性调整分页器的外观。

```vue
<template>
  <sl-pagination class="custom-pagination" :total="500"></sl-pagination>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';
</script>

<style>
.custom-pagination {
  --sl-pagination-text-color: var(--sl-color-neutral-700);
  --sl-pagination-current-page-color: var(--sl-color-primary-600);
  --sl-pagination-font-size: var(--sl-font-size-small);
  --sl-pagination-icon-font-size: 18px;
  --sl-pagination-current-page-border-radius: 6px;
  --sl-pagination-current-page-sizing-width: 4rem;
}
</style>
```

## 动态更新分页器

通过 `ref` 动态更新分页器的属性。

```vue
<template>
  <div class="pagination-demo">
    <div class="controls">
      <sl-button size="small" @click="setPage5">跳转到第5页</sl-button>
      <sl-button size="small" @click="setSize50">设置每页50条</sl-button>
      <sl-button size="small" @click="reset">重置</sl-button>
    </div>
    <sl-pagination
      :total="500"
      :currentPage="currentPage"
      :pageSize="pageSize"
      @sl-page-change="handlePageChange"
    ></sl-pagination>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const currentPage = ref(1);
const pageSize = ref(20);

function handlePageChange(event) {
  currentPage.value = event.detail.pageNumber;
  pageSize.value = event.detail.pageSize;
}

function setPage5() {
  currentPage.value = 5;
}

function setSize50() {
  pageSize.value = 50;
}

function reset() {
  currentPage.value = 1;
  pageSize.value = 20;
}
</script>

<style scoped>
.pagination-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
}
.controls {
  display: flex;
  gap: var(--sl-spacing-x-small);
}
</style>
```

## Properties

| 属性                 | 描述                                     | 类型       | 默认值            |
| -------------------- | ---------------------------------------- | ---------- | ----------------- |
| currentPage          | 当前页码（受控模式），数字类型用 `:currentPage` | `number`   | -                 |
| defaultCurrentPage   | 默认页码（非受控模式），数字类型用 `:defaultCurrentPage` | `number`   | `1`               |
| pageSize             | 每页显示条数，数字类型用 `:pageSize`      | `number`   | `20`              |
| pageSizeOpts         | 每页条数选项，数组类型用 `:pageSizeOpts.prop` | `number[]` | `[10, 20, 50, 100]` |
| total                | 数据总条数                               | `number`   | `5000`            |
| disabled             | 是否禁用分页器                           | `boolean`  | `false`           |
| simpleMode           | 是否使用简洁模式（隐藏页码输入和总页数） | `boolean`  | `false`           |
| className            | 自定义 CSS 类名                          | `string`   | `''`              |

## Events

| 事件名称       | 描述                       | 事件详情                                        |
| -------------- | -------------------------- | ----------------------------------------------- |
| sl-page-change | 页码或每页条数变化时触发   | `{ pageNumber: number, pageSize: number }`      |

### 事件绑定方式

在 Vue 模板中，使用 `@sl-page-change` 绑定分页事件，通过 `event.detail` 获取页码信息：

```vue
<sl-pagination :total="500" @sl-page-change="handlePageChange"></sl-pagination>
```

```js
function handlePageChange(event) {
  const { pageNumber, pageSize } = event.detail;
  console.log('当前页:', pageNumber);
  console.log('每页条数:', pageSize);
}
```

### 受控模式 vs 非受控模式

- **非受控模式**：使用 `:defaultCurrentPage`，组件内部管理状态
- **受控模式**：使用 `:currentPage`，需要在事件回调中手动更新该属性

```vue
<!-- 受控模式示例 -->
<sl-pagination
  :total="total"
  :currentPage="currentPage"
  @sl-page-change="handlePageChange"
></sl-pagination>
```

```js
function handlePageChange(event) {
  currentPage.value = event.detail.pageNumber;
  // 触发数据刷新...
}
```

## CSS Custom Properties

| CSS 属性                                      | 描述                   | 默认值                                 |
| --------------------------------------------- | ---------------------- | -------------------------------------- |
| --sl-pagination-text-color                    | 文字颜色               | `var(--sl-color-neutral-600)`          |
| --sl-pagination-current-page-color            | 当前页码颜色           | `var(--sl-color-neutral-900)`          |
| --sl-pagination-font-size                     | 字体大小               | `var(--sl-font-size-small)`            |
| --sl-pagination-current-page-border-width     | 页码输入框边框宽度     | `var(--sl-input-border-width)`         |
| --sl-pagination-current-page-border-radius    | 页码输入框圆角         | `var(--sl-input-border-radius-small)`  |
| --sl-pagination-current-page-sizing-width     | 页码输入框宽度         | `3rem`                                 |
| --sl-pagination-current-page-background       | 页码输入框背景色       | `var(--sl-input-background-color)`     |
| --sl-pagination-icon-font-size                | 图标大小               | `1rem`                                 |
| --sl-pagination-icon-font                     | 图标颜色               | `var(--sl-color-neutral-600)`          |
| --sl-pagination-icon-font-hover               | 悬停时图标颜色         | `var(--sl-color-primary-600)`          |
| --sl-pagination-icon-font-disabled            | 禁用时图标颜色         | `var(--sl-color-neutral-400)`          |

## 内部状态

| 状态      | 描述                                       | 类型     |
| --------- | ------------------------------------------ | -------- |
| totalPage | 总页数（根据 total 和 pageSize 自动计算）  | `number` |
