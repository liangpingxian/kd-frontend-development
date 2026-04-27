# 自定义单元格

[返回目录](../index.md)

## 功能说明

在列上设置 `slot: true`，并通过 `custom-cell-{dataIndex}-{rowKey}` slot 名称渲染自定义内容。

## 示例代码（Vue）

```vue
<template>
  <sl-table
    rowKey="id"
    :columns.prop="columns"
    :dataSource.prop="dataSource"
  >
    <div
      v-for="row in dataSource"
      :key="row.id"
      :slot="`custom-cell-action-${row.id}`"
      class="op-cell"
      style="width: 100%"
    >
      <sl-button
        size="small"
        variant="text"
        @click="handleDelete(row.id)"
      >删除</sl-button>
    </div>
  </sl-table>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/table/table.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const columns = [
  { dataIndex: 'name', title: '姓名', width: 160 },
  { dataIndex: 'email', title: '邮箱', width: 260 },
  {
    dataIndex: 'action',
    title: '操作',
    width: 120,
    align: 'center',
    slot: true
  }
];

const dataSource = ref([
  { id: '1', name: 'Alice Smith', email: 'alice@example.com' },
  { id: '2', name: 'Bob Johnson', email: 'bob@example.com' }
]);

const handleDelete = (id) => {
  dataSource.value = dataSource.value.filter((r) => r.id !== id);
};
</script>
```

---

## 注意事项

1. **Slot 名称格式**：必须严格遵循 `custom-cell-{dataIndex}-{rowKeyValue}` 格式
2. **rowKey 值**：slot 名称中的 rowKeyValue 是数据中 rowKey 字段的实际值
3. **性能考虑**：大量自定义单元格会增加 DOM 复杂度，大数据量时建议配合虚拟滚动

