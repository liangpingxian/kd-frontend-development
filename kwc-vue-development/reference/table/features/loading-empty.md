# 加载状态与空数据

[返回目录](../index.md)

## 功能说明

`loading` 控制加载态，`table-empty` slot 支持空态自定义。

## 示例代码（Vue）

```vue
<template>
  <sl-table
    rowKey="id"
    :columns.prop="columns"
    :dataSource.prop="dataSource"
    :loading.prop="loading"
  >
    <div slot="table-empty" class="empty-wrap">
      <sl-icon name="calendar4"></sl-icon>
      <p>暂无数据</p>
    </div>
  </sl-table>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/table/table.js';

const loading = ref(false);

const columns = [{ dataIndex: 'name', title: '姓名' }];

const dataSource = ref([]);
</script>
```

