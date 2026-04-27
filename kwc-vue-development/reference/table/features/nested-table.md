# 嵌套子表格

[返回目录](../index.md)

## 功能说明

在展开行中再放置一个 `sl-table`，用于展示子数据。

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
      v-for="item in expandRows"
      :key="item.slotName"
      :slot="item.slotName"
      class="expand-wrap"
    >
      <sl-table
        rowKey="subId"
        :columns.prop="subColumns"
        :dataSource.prop="item.children"
        :showHeader.prop="showHeader"
      ></sl-table>
    </div>
  </sl-table>
</template>

<script setup>
import { ref, computed } from 'vue';
import '@kdcloudjs/shoelace/dist/components/table/table.js';

const showHeader = ref(false);

const columns = [
  { dataIndex: 'name', title: '姓名', width: 160 },
  { dataIndex: 'email', title: '邮箱' }
];

const subColumns = [
  { dataIndex: 'task', title: '任务', width: 180 },
  { dataIndex: 'status', title: '状态' }
];

const dataSource = ref([
  {
    id: '1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    children: [{ subId: '1-1', task: '需求评审', status: '完成' }]
  }
]);

const expandProps = {
  rowExpandable: true,
  expandableRowKeys: ['1'],
  defaultExpandedRowKeys: ['1']
};

const expandRows = computed(() => {
  return dataSource.value.map((r) => ({
    slotName: `custom-row-${r.id}`,
    children: r.children || []
  }));
});
</script>
```

## 注意事项

1. **rowKey 必须唯一**：`rowKey` 指定的字段在数据中必须唯一，否则会导致行展开功能异常
