# 行展开

[返回目录](../index.md)

## 功能说明

通过 `expandProps` 开启行展开，并使用 `custom-row-{rowKey}` slot 自定义展开内容。

## 示例代码（Vue）

```vue
<template>
  <sl-table
    rowKey="id"
    :columns.prop="columns"
    :dataSource.prop="dataSource"
    :expandProps.prop="expandProps"
  >
    <div
      v-for="row in dataSource"
      :key="row.id"
      :slot="`custom-row-${row.id}`"
    >
      <p>姓名：{{ row.name }}</p>
      <p>部门：{{ row.department }}</p>
    </div>
  </sl-table>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/table/table.js';

const columns = [
  { dataIndex: 'name', title: '姓名', width: 160 },
  { dataIndex: 'department', title: '部门', width: 140 },
  { dataIndex: 'email', title: '邮箱' }
];

const dataSource = [
  {
    id: '1',
    name: 'Alice Smith',
    department: '研发',
    email: 'alice@example.com'
  },
  {
    id: '2',
    name: 'Bob Johnson',
    department: '产品',
    email: 'bob@example.com'
  }
];

const expandProps = {
  rowExpandable: true,
  expandableRowKeys: ['1', '2'],
  defaultExpandedRowKeys: ['1']
};
</script>
```

---

## 注意事项

1. **rowKey 必须唯一**：`rowKey` 指定的字段在数据中必须唯一，否则会导致行展开功能异常

