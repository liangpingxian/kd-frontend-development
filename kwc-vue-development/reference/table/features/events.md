# 事件监听

[返回目录](../index.md)

## 功能说明

通过 `@sl-change` 事件统一监听分页、排序、筛选变化。

## 示例代码（Vue）

```vue
<template>
  <sl-table
    rowKey="id"
    :columns.prop="columns"
    :dataSource.prop="dataSource"
    :pagination.prop="pagination"
    @sl-change="handleChange"
  ></sl-table>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/table/table.js';

function handleChange(event) {
  const { sorting, columnFilters, changeType, pagination } = event.detail || {};
  console.log({ sorting, columnFilters, changeType, pagination });
}
</script>
```

---

## 注意事项

1. **何时使用**：当用户希望使用受控模式下的分页、过滤、筛选时使用
