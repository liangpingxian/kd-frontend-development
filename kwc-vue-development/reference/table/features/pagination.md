# 分页

[返回目录](../index.md)

## 功能说明

通过 `pagination` 配置分页，支持受控与非受控模式。

## 示例代码（Vue）

### 非受控

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

const columns = [
  { dataIndex: 'name', title: '姓名', width: 160 },
  { dataIndex: 'email', title: '邮箱' }
];

const dataSource = Array.from({ length: 100 }).map((_, i) => ({
  id: String(i + 1),
  name: `User-${i + 1}`,
  email: `user${i + 1}@example.com`
}));

const pagination = { pageSize: 10, pageSizeOpts: [10, 20, 50, 100] };

const handleChange = (e) => { console.log(e.detail); };
</script>
```

### 受控

```vue
<template>
  <sl-table
    rowKey="id"
    :columns.prop="columns"
    :dataSource.prop="dataSource"
    :pagination.prop="tablePagination"
    @sl-change="handleChange"
  ></sl-table>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/table/table.js';

const tablePagination = ref({ pageSize: 10, pageSizeOpts: [10, 20, 50, 100], currentPage: 1, total: 100 });

const columns = [
  { dataIndex: 'name', title: '姓名', width: 160 },
  { dataIndex: 'email', title: '邮箱' }
];

const dataSource = Array.from({ length: 100 }).map((_, i) => ({
  id: String(i + 1),
  name: `User-${i + 1}`,
  email: `user${i + 1}@example.com`
}));

const handleChange = (e) => {
  const { type, pagination } = e.detail;
  console.log(e);
  if (type === 'pagination') {
    const { pageNumber } = pagination;
    tablePagination.value = {
      ...tablePagination.value,
      currentPage: pageNumber
    };
  }
};
</script>
```

