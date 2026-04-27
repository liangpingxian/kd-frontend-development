# 列宽调整

[返回目录](../index.md)

## 功能说明

通过 `enableColumnResizing` 开启拖拽调整列宽，使用 `onColumnResize` 获取调整结果。

## 示例代码（Vue）

```vue
<template>
  <sl-table
    rowKey="id"
    :columns.prop="columns"
    :dataSource.prop="dataSource"
    :enableColumnResizing.prop="true"
    :onColumnResize.prop="handleColumnResize"
  ></sl-table>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/table/table.js';

const columns = [
  { dataIndex: 'name', title: '姓名', width: 160 },
  { dataIndex: 'email', title: '邮箱', width: 280 }
];

const dataSource = [{ id: '1', name: 'Alice Smith', email: 'alice@example.com' }];

const handleColumnResize = (sizes) => {
  console.log('sizes', sizes);
};
</script>
```

---

## 注意事项

1. **列宽限制**：列宽调整有最小值（60px）和最大值（500px）限制
2. **拖拽手柄**：鼠标悬停在列边框时会显示拖拽手柄（col-resize 光标）

