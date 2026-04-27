# RTL 方向

[返回目录](../index.md)

## 功能说明

通过 `direction="rtl"` 开启从右到左布局。

## 示例代码（Vue）

根据语言设置动态切换表格方向。

```vue
<template>
  <div class="toolbar">
    <sl-button-group>
      <sl-button
        :variant="direction === 'ltr' ? 'primary' : 'default'"
        @click="direction = 'ltr'"
      >
        LTR (English)
      </sl-button>
      <sl-button
        :variant="direction === 'rtl' ? 'primary' : 'default'"
        @click="direction = 'rtl'"
      >
        RTL (العربية)
      </sl-button>
    </sl-button-group>
  </div>
  <sl-table
    rowKey="id"
    :direction="direction"
    bordered
    :columns.prop="columns"
    :dataSource.prop="dataSource"
  ></sl-table>
</template>

<script setup>
import { ref, computed } from 'vue';
import '@kdcloudjs/shoelace/dist/components/table/table.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import '@kdcloudjs/shoelace/dist/components/button-group/button-group.js';

const direction = ref('ltr');

const columns = computed(() => {
  if (direction.value === 'rtl') {
    return [
      { title: 'الاسم', dataIndex: 'name', width: 150 },
      { title: 'العمر', dataIndex: 'age', width: 100 },
      { title: 'المدينة', dataIndex: 'city' }
    ];
  }
  return [
    { title: 'Name', dataIndex: 'name', width: 150 },
    { title: 'Age', dataIndex: 'age', width: 100 },
    { title: 'City', dataIndex: 'city' }
  ];
});

const dataSource = computed(() => {
  if (direction.value === 'rtl') {
    return [
      { id: '1', name: 'أحمد', age: 28, city: 'القاهرة' },
      { id: '2', name: 'محمد', age: 35, city: 'الإسكندرية' },
      { id: '3', name: 'فاطمة', age: 30, city: 'الجيزة' }
    ];
  }
  return [
    { id: '1', name: 'John', age: 28, city: 'New York' },
    { id: '2', name: 'Jane', age: 35, city: 'Los Angeles' },
    { id: '3', name: 'Bob', age: 30, city: 'Chicago' }
  ];
});
</script>
```
