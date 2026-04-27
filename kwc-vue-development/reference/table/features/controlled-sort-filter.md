# 受控排序筛选

[返回目录](../index.md)

## 功能说明

通过 `sortOrder`、`filteredValue` + `@sl-change` 实现受控排序/筛选，适用于服务端联动。在 Vue 中使用 `computed` 动态返回 columns 配置。

## 示例代码（Vue）

```vue
<template>
  <sl-table
    rowKey="id"
    :columns.prop="columns"
    :dataSource.prop="dataSource"
    @sl-change="handleChange"
  ></sl-table>
</template>

<script setup>
import { ref, computed } from 'vue';
import '@kdcloudjs/shoelace/dist/components/table/table.js';

const sorting = ref({});
const filters = ref({ name: [] });

const dataSource = [
  { id: '1', no: 1, name: 'Alice' },
  { id: '2', no: 2, name: 'Bob' },
];

const columns = computed(() => [
  {
    dataIndex: 'no',
    title: '#',
    width: 60,
    sorter: () => null,
    sortOrder: sorting.value.no || '',
  },
  {
    dataIndex: 'name',
    title: '姓名',
    sorter: (a, b) => a.name.localeCompare(b.name),
    sortOrder: sorting.value.name || '',
    filters: [
      { text: 'Alice', value: 'Alice' },
      { text: 'Bob', value: 'Bob' },
    ],
    filteredValue: filters.value.name || [],
    onFilter: () => true,
  },
]);

function handleChange(e) {
  const { changeType, sorting: s, columnFilters } = e.detail || {};
  if (changeType === 'sorter') {
    const next = {};
    (s || []).forEach((item) => {
      next[item.id] = item.desc ? 'desc' : 'asc';
    });
    sorting.value = next;
  }
  if (changeType === 'filters') {
    const next = {};
    (columnFilters || []).forEach((f) => {
      next[f.id] = f.value;
    });
    filters.value = next;
  }
}
</script>
```

---

## 注意事项

1. **受控模式切换**：一旦设置了 `sortOrder` 或 `filteredValue`，该列就进入受控模式，组件不会自动排序/筛选
2. **必须配合回调使用**：受控模式下需要使用`@sl-change`事件并手动更新状态
3. **Vue computed 配置**：使用 `computed` 动态返回 columns 配置，确保受控状态变化后 columns 随之更新
4. **清空受控值**：将 `sortOrder` 设为 `null`、`filteredValue` 设为空数组可清除对应状态

[返回目录](../index.md)
