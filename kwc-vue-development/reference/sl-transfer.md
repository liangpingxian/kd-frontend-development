# Transfer 穿梭框组件

## 组件概述

`sl-transfer` 是一个穿梭框组件，用于在两个列表之间移动数据。支持搜索、分页、全选、单向穿梭、自定义渲染等功能。

## 组件导入

```js
import '@kdcloudjs/shoelace/dist/components/transfer/transfer.js';
```

## 基础用法

```vue
<template>
  <sl-transfer
    :dataSource.prop="dataSource"
    :targetKeys.prop="targetKeys"
    @sl-transfer-change="handleChange"
  ></sl-transfer>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/transfer/transfer.js';

const dataSource = [
    { key: '1', title: '选项一' },
    { key: '2', title: '选项二' },
    { key: '3', title: '选项三' },
    { key: '4', title: '选项四' },
    { key: '5', title: '选项五' }
];

const targetKeys = ref(['3', '5']);

const handleChange = (e) => {
    targetKeys.value = e.detail.targetKeys;
};
</script>
```

## 带搜索框

```vue
<template>
  <sl-transfer
    :dataSource.prop="dataSource"
    :targetKeys.prop="targetKeys"
    show-search
    search-placeholder="搜索"
    @sl-transfer-change="handleChange"
  ></sl-transfer>
</template>
```

## 分页

```vue
<template>
  <sl-transfer
    :dataSource.prop="dataSource"
    :targetKeys.prop="targetKeys"
    pagination
    page-size="5"
    @sl-transfer-change="handleChange"
  ></sl-transfer>
</template>
```

## 单向穿梭

```vue
<template>
  <sl-transfer
    :dataSource.prop="dataSource"
    :targetKeys.prop="targetKeys"
    one-way
    @sl-transfer-change="handleChange"
  ></sl-transfer>
</template>
```

## 受控选中

```vue
<template>
  <sl-transfer
    :dataSource.prop="dataSource"
    :targetKeys.prop="targetKeys"
    :selectedKeys.prop="selectedKeys"
    @sl-transfer-change="handleChange"
    @sl-transfer-select-change="handleSelectChange"
  ></sl-transfer>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/transfer/transfer.js';

const selectedKeys = ref([]);

const handleSelectChange = (e) => {
    const { sourceSelectedKeys, targetSelectedKeys } = e.detail;
    selectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys];
};
</script>
```

## API

### Transfer 属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `data-source` | 数据源（Vue 中需 `:dataSource.prop`） | `TransferItem[]` | `[]` |
| `target-keys` | 目标列表的 key 集合（Vue 中需 `:targetKeys.prop`） | `string[]` | `[]` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `pagination` | 是否显示分页 | `boolean` | `false` |
| `page-size` | 每页显示条数 | `number` | `10` |
| `show-search` | 是否显示搜索框 | `boolean` | `false` |
| `show-select-all` | 是否显示全选 | `boolean` | `true` |
| `one-way` | 是否单向穿梭 | `boolean` | `false` |
| `titles` | 两个列表的标题（Vue 中需 `:titles.prop`） | `string[]` | `['源列表', '目标列表']` |
| `status` | 组件状态 | `'normal' \| 'success' \| 'error'` | `'normal'` |
| `search-placeholder` | 搜索框占位符 | `string` | `'请输入搜索内容'` |
| `selected-keys` | 受控选中项 key 集合（Vue 中需 `:selectedKeys.prop`） | `string[]` | - |
| `itemRender` | 自定义渲染列表项内容（需 `.prop`） | `(item: TransferItem) => unknown` | - |
| `filterOption` | 自定义搜索过滤逻辑（需 `.prop`） | `(inputValue: string, option: TransferItem, direction: TransferDirection) => boolean` | - |

### TransferItem 数据项

| 属性 | 说明 | 类型 | 必填 |
|------|------|------|------|
| `key` | 唯一标识键 | `string` | 是 |
| `title` | 显示标题 | `string` | 是 |
| `description` | 描述信息 | `string` | 否 |
| `disabled` | 是否禁用 | `boolean` | 否 |

### 事件

通过 `@事件名` 绑定，事件数据通过 `event.detail` 获取。

| 事件名 | 说明 | 回调参数（`event.detail`） |
|--------|------|---------------------------|
| `sl-transfer-change` | 数据穿梭完成时触发 | `{ targetKeys: string[], direction: 'left' \| 'right', moveKeys: string[] }` |
| `sl-transfer-select-change` | 选中项变化时触发 | `{ sourceSelectedKeys: string[], targetSelectedKeys: string[], type: TransferSelectType }` |
| `sl-transfer-search` | 搜索时触发 | `{ direction: 'left' \| 'right', value: string }` |
| `sl-transfer-scroll` | 列表滚动时触发 | `{ direction: 'left' \| 'right', event: Event }` |

### TransferSelectType

`'single' | 'selectAll' | 'selectAllItems' | 'selectPage' | 'invertPage' | 'api'`

### 方法

| 方法名 | 说明 | 参数 |
|--------|------|------|
| `moveToTarget()` | 将源列表选中项移动到目标列表 | - |
| `moveToSource()` | 将目标列表选中项移动到源列表 | - |
| `setSourceSelectedKeys(keys)` | 设置源列表选中项 | `keys: string[]` |
| `setTargetSelectedKeys(keys)` | 设置目标列表选中项 | `keys: string[]` |

### Slots（插槽）

| Slot | 说明 |
|------|------|
| `move-to-target` | 自定义"移动到目标列表"按钮内容 |
| `move-to-source` | 自定义"移动到源列表"按钮内容 |
| `operation` | 完全自定义操作区域，替换默认穿梭按钮 |
| `source-empty` | 自定义源列表空提示内容 |
| `target-empty` | 自定义目标列表空提示内容 |
| `source-item-list` | 自定义源列表内容区域，替换默认列表渲染 |
| `target-item-list` | 自定义目标列表内容区域，替换默认列表渲染 |
| `source-footer` | 自定义源列表底部内容，位于分页上方 |
| `target-footer` | 自定义目标列表底部内容，位于分页上方 |

### CSS Parts

| Part 名称 | 说明 |
|-----------|------|
| `base` | 组件基础容器 |
| `source-panel` | 源列表面板 |
| `target-panel` | 目标列表面板 |
| `panel-header` | 面板头部 |
| `panel-list` | 面板列表 |
| `operation` | 操作按钮区域 |
| `search-input` | 搜索输入框 |

### CSS 自定义属性

| 属性 | 说明 |
|------|------|
| `--sl-transfer-list-width` | 单个面板的宽度 |
| `--sl-transfer-list-height` | 单个面板的高度 |
| `--sl-transfer-border-color` | 面板边框颜色 |
| `--sl-transfer-border-radius` | 面板圆角 |
| `--sl-transfer-bg-color` | 面板背景色 |
| `--sl-transfer-header-padding` | 面板头部内边距 |
| `--sl-transfer-header-bg-color` | 面板头部背景色 |
| `--sl-transfer-header-font-size` | 面板头部字体大小 |
| `--sl-transfer-search-padding` | 搜索框内边距 |
| `--sl-transfer-list-item-padding` | 列表项内边距 |
| `--sl-transfer-list-item-hover-bg-color` | 列表项悬停背景色 |
| `--sl-transfer-footer-padding` | 底部内边距 |
| `--sl-transfer-operation-button-gap` | 操作按钮间距 |
| `--sl-transfer-border-color-error` | 错误状态边框色 |
| `--sl-transfer-border-color-warn` | 成功状态边框色 |
