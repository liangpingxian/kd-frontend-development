# 行拖拽

[返回目录](../index.md)

## 功能说明

通过 `rowDrag` 开启拖拽排序，监听 `sl-row-reorder` 更新数据顺序。

## 示例代码（Vue）

```vue
<template>
  <sl-table
    rowKey="id"
    :rowDrag.prop="true"
    :columns.prop="columns"
    :dataSource.prop="dataSource"
    @sl-row-reorder="handleRowReorder"
  ></sl-table>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/table/table.js';

const columns = [
  { dataIndex: 'name', title: '姓名', width: 160 },
  { dataIndex: 'position', title: '岗位' }
];

const dataSource = ref([
  { id: '1', name: 'Alice Smith', position: 'SE' },
  { id: '2', name: 'Bob Johnson', position: 'PM' },
  { id: '3', name: 'Carol White', position: 'UX' }
]);

const handleRowReorder = (detail) => {
  console.log(detail);
};
</script>
```
