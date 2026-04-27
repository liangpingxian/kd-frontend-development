# 行/单元格属性

[返回目录](../index.md)

## 功能说明

通过 `:slRow`、`:slHeaderRow`、`slCell`、`slHeaderCell` 注入 class、style 和事件。

## 示例代码（Vue）

```vue
<template>
  <sl-table 
    rowKey="id" 
    :columns.prop="columns"
    :dataSource.prop="dataSource"
    :slRow.prop="slRow"
    :slHeaderRow.prop="slHeaderRow">
  </sl-table>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/table/table.js';

const dataSource = [
  { id: '1', name: 'Alice Smith', email: 'alice@example.com' },
  { id: '2', name: 'Bob Johnson', email: 'bob@example.com' }
];
const columns = [
  {
    dataIndex: 'name',
    title: '姓名',
    slCell: (record) => ({
      onmouseenter: () => console.log('onmouseenter cell', record.id)
    }),
    slHeaderCell: () => ({ className: 'name-header' })
  }
];

const slRow = (record, rowIndex) => {
  return {
    onclick: () => console.log('click row', record.id),
    className: rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
  };
};

const slHeaderRow = () => ({ className: 'table-head-row' });
</script>
```

---

## 注意事项

1. **返回的事件名大小写**：返回的是js原生事件，需要用小写格式，例如`onclick`、`onmouseenter`等
