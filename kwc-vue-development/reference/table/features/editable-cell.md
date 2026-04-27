# 可编辑单元格

[返回目录](../index.md)

## 功能说明

通过 `slot` 渲染输入框实现单元格编辑，点击进入编辑态，失焦后保存。

## 示例代码（Vue）

```vue
<template>
  <sl-table
    rowKey="id"
    :columns.prop="columns"
    :dataSource.prop="dataSource"
  >
    <div
      style="width: 100%"
      v-for="cell in cellSlots"
      :key="cell.slotName"
      :slot="cell.slotName"
      @click="handleCellClick(cell)"
    >
      <template v-if="cell.editing">
        <sl-input
          :class="cell.slotName"
          :value="cell.value"
          @sl-change="handleInputChange($event, cell)"
          @sl-blur="handleInputBlur"
        ></sl-input>
      </template>
      <template v-else>
        <div>{{ cell.value }}</div>
      </template>
    </div>
  </sl-table>
</template>

<script setup>
import { ref, computed } from 'vue';
import '@kdcloudjs/shoelace/dist/components/table/table.js';
import '@kdcloudjs/shoelace/dist/components/input/input.js';

const editKey = ref('');

const columns = [
  { title: '姓名', dataIndex: 'name', slot: true },
  { title: '薪资', dataIndex: 'salary', slot: true },
  { title: '地址', dataIndex: 'address', slot: true }
];

const dataSource = ref([
  { id: '1', name: 'Jane Doe', salary: '18000', address: 'London' },
  { id: '2', name: 'Alisa Ross', salary: '24000', address: 'Paris' }
]);

const cellSlots = computed(() => {
  const list = [];
  dataSource.value.forEach((row, rowIndex) => {
    columns.forEach((col) => {
      list.push({
        slotName: `custom-cell-${col.dataIndex}-${row.id}`,
        rowIndex,
        colKey: col.dataIndex,
        value: row[col.dataIndex],
        editing: editKey.value === `custom-cell-${col.dataIndex}-${rowIndex}`
      });
    });
  });
  return list;
});

const handleCellClick = (cell) => {
  editKey.value = `custom-cell-${cell.colKey}-${cell.rowIndex}`;
};

const handleInputChange = (event, cell) => {
  const { rowIndex, colKey } = cell;
  const next = [...dataSource.value];
  next[rowIndex] = {
    ...next[rowIndex],
    [colKey]: event.target.value
  };
  dataSource.value = next;
};

const handleInputBlur = () => {
  editKey.value = '';
};
</script>
```

---

## 注意事项

1. **Slot 名称格式**：必须严格遵循 `custom-cell-{dataIndex}-{rowKeyValue}` 格式
2. **rowKey 值**：slot 名称中的 rowKeyValue 是数据中 rowKey 字段的实际值
3. **性能考虑**：大量自定义单元格会增加 DOM 复杂度，大数据量时建议配合虚拟滚动
4. **组件使用**：当需要渲染通用组件如（`input、select、datepicker`）时，优先使用`@kdcloudjs/shoelace`提供的组件
