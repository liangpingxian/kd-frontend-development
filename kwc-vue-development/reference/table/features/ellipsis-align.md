# 文本省略与对齐

[返回目录](../index.md)

## 功能说明

通过列属性 `ellipsis`、`align`、`className` 控制文本溢出和对齐方式。

## 示例代码（Vue）

```vue
<template>
  <sl-table
    rowKey="id"
    :columns.prop="columns"
    :dataSource.prop="dataSource"
  ></sl-table>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/table/table.js';

const columns = [
  { dataIndex: 'name', title: '姓名', width: 120, align: 'left' },
  {
    dataIndex: 'desc',
    title: '描述',
    width: 120,
    ellipsis: true,
    align: 'center'
  },
  { dataIndex: 'amount', title: '金额', width: 120, align: 'right' }
];

const dataSource = [
  {
    name: '张三',
    desc: '很长的描述很长的描述很长的描述很长的描述很长的描述',
    amount: 1.00
  }
];
</script>
```
