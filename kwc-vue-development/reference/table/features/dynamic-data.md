# 动态数据更新

[返回目录](../index.md)

## 功能说明

Table 组件支持动态更新数据源，包括添加数据、删除数据、清空并重新加载等操作。在 Vue 中，使用 `ref` 声明响应式数据，修改后视图会自动更新。必须使用不可变更新方式（展开运算符）创建新数组。

## 代码示例

### 示例1：添加数据

动态向表格添加新数据行。

```vue
<template>
  <div class="toolbar">
    <sl-button variant="primary" @click="handleAdd">添加一行</sl-button>
    <sl-button @click="handleAddMultiple">添加多行</sl-button>
    <span class="count">共 {{ dataSource.length }} 条数据</span>
  </div>
  <sl-table
    rowKey="id"
    :columns.prop="columns"
    :dataSource.prop="dataSource"
  ></sl-table>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/table/table.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const dataSource = ref([
  { id: '1', name: '张三', age: 28, department: '研发部' },
  { id: '2', name: '李四', age: 32, department: '产品部' }
]);

let counter = 3;

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '姓名', dataIndex: 'name', width: 150 },
  { title: '年龄', dataIndex: 'age', width: 100 },
  { title: '部门', dataIndex: 'department' }
];

function handleAdd() {
  const newItem = {
    id: String(counter),
    name: `新员工${counter}`,
    age: 20 + Math.floor(Math.random() * 20),
    department: ['研发部', '产品部', '设计部'][Math.floor(Math.random() * 3)]
  };
  dataSource.value = [...dataSource.value, newItem];
  counter++;
}

function handleAddMultiple() {
  const newItems = Array.from({ length: 5 }, (_, i) => ({
    id: String(counter + i),
    name: `批量员工${counter + i}`,
    age: 20 + Math.floor(Math.random() * 20),
    department: ['研发部', '产品部', '设计部'][Math.floor(Math.random() * 3)]
  }));
  dataSource.value = [...dataSource.value, ...newItems];
  counter += 5;
}
</script>
```

---

### 示例2：删除数据

从表格中删除指定数据行。

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
      class="action-cell"
    >
      <sl-button size="small" variant="danger" @click="handleDelete(row.id)">删除</sl-button>
    </div>
  </sl-table>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/table/table.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const dataSource = ref([
  { id: '1', name: '张三', email: 'zhangsan@example.com' },
  { id: '2', name: '李四', email: 'lisi@example.com' },
  { id: '3', name: '王五', email: 'wangwu@example.com' },
  { id: '4', name: '赵六', email: 'zhaoliu@example.com' }
]);

const columns = [
  { title: '姓名', dataIndex: 'name', width: 150 },
  { title: '邮箱', dataIndex: 'email', width: 250 },
  { title: '操作', dataIndex: 'action', width: 100, slot: true }
];

function handleDelete(id) {
  dataSource.value = dataSource.value.filter(item => item.id !== id);
}
</script>
```

---

### 示例3：清空并重新加载

清空表格数据并重新加载。

```vue
<template>
  <div class="toolbar">
    <sl-button variant="primary" @click="handleReload">重新加载</sl-button>
    <sl-button variant="default" @click="handleClear">清空数据</sl-button>
  </div>
  <sl-table
    rowKey="id"
    :loading="isLoading"
    :columns.prop="columns"
    :dataSource.prop="dataSource"
  ></sl-table>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import '@kdcloudjs/shoelace/dist/components/table/table.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const isLoading = ref(false);
const dataSource = ref([]);

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '任务名称', dataIndex: 'task', width: 200 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'createdAt' }
];

onMounted(() => {
  loadData();
});

function handleClear() {
  dataSource.value = [];
}

function handleReload() {
  loadData();
}

async function loadData() {
  isLoading.value = true;
  dataSource.value = [];
  await new Promise(resolve => setTimeout(resolve, 1000));
  const now = new Date();
  dataSource.value = Array.from({ length: 10 }, (_, index) => ({
    id: String(index + 1),
    task: `任务${index + 1}`,
    status: ['待处理', '进行中', '已完成'][index % 3],
    createdAt: new Date(now - index * 86400000).toLocaleDateString()
  }));
  isLoading.value = false;
}
</script>
```

---

### 示例4：编辑数据

实现行数据的编辑功能。

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
      class="action-cell"
    >
      <sl-button size="small" variant="text" @click="handleEdit(row)">编辑</sl-button>
    </div>
  </sl-table>
  
  <sl-dialog label="编辑用户" :open="isDialogOpen" @sl-hide="handleDialogClose">
    <div class="form-item">
      <label>姓名:</label>
      <sl-input :value="editingItem.name" @sl-input="handleNameInput"></sl-input>
    </div>
    <div class="form-item">
      <label>年龄:</label>
      <sl-input type="number" :value="editingItem.age" @sl-input="handleAgeInput"></sl-input>
    </div>
    <sl-button slot="footer" variant="primary" @click="handleSave">保存</sl-button>
    <sl-button slot="footer" @click="handleDialogClose">取消</sl-button>
  </sl-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';
import '@kdcloudjs/shoelace/dist/components/table/table.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import '@kdcloudjs/shoelace/dist/components/dialog/dialog.js';
import '@kdcloudjs/shoelace/dist/components/input/input.js';

const dataSource = ref([
  { id: '1', name: '张三', age: 28 },
  { id: '2', name: '李四', age: 32 },
  { id: '3', name: '王五', age: 25 }
]);

const isDialogOpen = ref(false);
const editingItem = reactive({ id: null, name: '', age: '' });

const columns = [
  { title: '姓名', dataIndex: 'name', width: 150 },
  { title: '年龄', dataIndex: 'age', width: 100 },
  { title: '操作', dataIndex: 'action', width: 100, slot: true }
];

function handleEdit(row) {
  editingItem.id = row.id;
  editingItem.name = row.name;
  editingItem.age = String(row.age);
  isDialogOpen.value = true;
}

function handleNameInput(event) {
  editingItem.name = event.target.value;
}

function handleAgeInput(event) {
  editingItem.age = event.target.value;
}

function handleSave() {
  dataSource.value = dataSource.value.map(item => {
    if (item.id === editingItem.id) {
      return { ...item, name: editingItem.name, age: parseInt(editingItem.age, 10) };
    }
    return item;
  });
  handleDialogClose();
}

function handleDialogClose() {
  isDialogOpen.value = false;
  editingItem.id = null;
  editingItem.name = '';
  editingItem.age = '';
}
</script>
```

---

## 注意事项

1. **响应式更新**：在 Vue 中，使用 `ref` 声明响应式数据，必须使用不可变更新方式（展开运算符）创建新数组才能触发视图更新
2. **避免直接修改**：不要使用 `push`、`splice` 等方法直接修改数组，需要创建新数组
3. **rowKey 唯一性**：添加新数据时确保 `rowKey` 字段值唯一
4. **正确的 slot 写法**：在 `v-for` 循环的元素上直接绑定 `:slot="\`custom-cell-{dataIndex}-${row.id}\`"`，禁止在 `<template>` 上使用 `v-for` + `#[动态表达式]` 动态插槽语法

[返回目录](../index.md)
