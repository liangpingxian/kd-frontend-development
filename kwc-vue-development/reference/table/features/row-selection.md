# 行选择

[返回目录](../index.md)

## 功能说明

通过 `rowSelection` 开启选择列，支持 `checkbox` 和 `radio`。

## 示例代码（Vue）

```vue
<template>
  <sl-table
    rowKey="id"
    :columns.prop="columns"
    :dataSource.prop="dataSource"
    :rowSelection.prop="rowSelection"
  ></sl-table>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/table/table.js';

const columns = [
  { dataIndex: 'name', title: '姓名', width: 160 },
  { dataIndex: 'role', title: '角色', width: 140 },
  { dataIndex: 'email', title: '邮箱' }
];

const dataSource = [
  { id: '1', name: 'Alice Smith', role: 'Admin', email: 'alice@example.com' },
  { id: '2', name: 'Bob Johnson', role: 'User', email: 'bob@example.com' }
];

const rowSelection = {
  type: 'checkbox', // 单选模式为radio
  onChange: (keys, rows) => console.log('selected', keys, rows)
};
</script>
```

---

## 注意事项

1. **rowKey 必须唯一**：`rowKey` 指定的字段在数据中必须唯一，否则会导致行选择功能异常
2. **单选模式无全选**：`type: 'radio'` 时表头不显示全选 Checkbox
3. **defaultSelectedRowKeys 只在初始化时生效**：后续选择变化不会更新此属性，需要通过回调自行管理状态

