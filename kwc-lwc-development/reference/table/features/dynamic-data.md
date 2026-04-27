# 动态数据更新

[返回目录](../index.md)

## 功能说明

Table 组件支持动态更新数据源，包括添加数据、删除数据、清空并重新加载等操作。在 LWC 中，需要通过 `@track` 装饰器或重新赋值数组来触发响应式更新。

## 代码示例

### 示例1：添加数据

动态向表格添加新数据行。

**index.html**
```html
<template>
    <div class="toolbar">
        <sl-button kwc:external variant="primary" onclick={handleAdd}>添加一行</sl-button>
        <sl-button kwc:external onclick={handleAddMultiple}>添加多行</sl-button>
        <span class="count">共 {dataCount} 条数据</span>
    </div>
    <sl-table kwc:external
        row-key="id"
        columns={columns}
        data-source={dataSource}
    ></sl-table>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/table/table.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class AddDataTable extends KingdeeElement {
    @track dataSource = [
        { id: '1', name: '张三', age: 28, department: '研发部' },
        { id: '2', name: '李四', age: 32, department: '产品部' }
    ];
    
    @track counter = 3;

    columns = [
        { title: 'ID', dataIndex: 'id', width: 80 },
        { title: '姓名', dataIndex: 'name', width: 150 },
        { title: '年龄', dataIndex: 'age', width: 100 },
        { title: '部门', dataIndex: 'department' }
    ];

    get dataCount() {
        return this.dataSource.length;
    }

    handleAdd() {
        const newItem = {
            id: String(this.counter),
            name: `新员工${this.counter}`,
            age: 20 + Math.floor(Math.random() * 20),
            department: ['研发部', '产品部', '设计部'][Math.floor(Math.random() * 3)]
        };
        // 必须重新赋值数组以触发更新
        this.dataSource = [...this.dataSource, newItem];
        this.counter++;
    }

    handleAddMultiple() {
        const newItems = Array.from({ length: 5 }, (_, i) => ({
            id: String(this.counter + i),
            name: `批量员工${this.counter + i}`,
            age: 20 + Math.floor(Math.random() * 20),
            department: ['研发部', '产品部', '设计部'][Math.floor(Math.random() * 3)]
        }));
        this.dataSource = [...this.dataSource, ...newItems];
        this.counter += 5;
    }
}
```

---

### 示例2：删除数据

从表格中删除指定数据行。

**index.html**
```html
<template>
    <sl-table kwc:external
        row-key="id"
        columns={columns}
        data-source={dataSource}
    >
        <template for:each={dataSource} for:item="row">
            <div key={row.id} slot={row.actionSlot} class="action-cell">
                <sl-button kwc:external 
                    size="small" 
                    variant="danger"
                    onclick={handleDelete}
                    data-id={row.id}
                >
                    删除
                </sl-button>
            </div>
        </template>
    </sl-table>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/table/table.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class DeleteDataTable extends KingdeeElement {
    @track rawData = [
        { id: '1', name: '张三', email: 'zhangsan@example.com' },
        { id: '2', name: '李四', email: 'lisi@example.com' },
        { id: '3', name: '王五', email: 'wangwu@example.com' },
        { id: '4', name: '赵六', email: 'zhaoliu@example.com' }
    ];

    columns = [
        { title: '姓名', dataIndex: 'name', width: 150 },
        { title: '邮箱', dataIndex: 'email', width: 250 },
        { title: '操作', dataIndex: 'action', width: 100, slot: true }
    ];

    get dataSource() {
        return this.rawData.map(item => ({
            ...item,
            actionSlot: `custom-cell-action-${item.id}`
        }));
    }

    handleDelete(event) {
        const id = event.target.dataset.id;
        this.rawData = this.rawData.filter(item => item.id !== id);
    }
}
```

---

### 示例3：清空并重新加载

清空表格数据并重新加载。

**index.html**
```html
<template>
    <div class="toolbar">
        <sl-button kwc:external variant="primary" onclick={handleReload}>重新加载</sl-button>
        <sl-button kwc:external variant="default" onclick={handleClear}>清空数据</sl-button>
    </div>
    <sl-table kwc:external
        row-key="id"
        loading={isLoading}
        columns={columns}
        data-source={dataSource}
    ></sl-table>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/table/table.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class ReloadDataTable extends KingdeeElement {
    @track isLoading = false;
    @track dataSource = [];

    columns = [
        { title: 'ID', dataIndex: 'id', width: 80 },
        { title: '任务名称', dataIndex: 'task', width: 200 },
        { title: '状态', dataIndex: 'status', width: 100 },
        { title: '创建时间', dataIndex: 'createdAt' }
    ];

    connectedCallback() {
        this.loadData();
    }

    handleClear() {
        this.dataSource = [];
    }

    handleReload() {
        this.loadData();
    }

    async loadData() {
        this.isLoading = true;
        this.dataSource = [];  // 先清空
        
        // 模拟异步请求
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 生成新数据
        const now = new Date();
        this.dataSource = Array.from({ length: 10 }, (_, index) => ({
            id: String(index + 1),
            task: `任务${index + 1}`,
            status: ['待处理', '进行中', '已完成'][index % 3],
            createdAt: new Date(now - index * 86400000).toLocaleDateString()
        }));
        
        this.isLoading = false;
    }
}
```

---

### 示例4：编辑数据

实现行数据的编辑功能。

**index.html**
```html
<template>
    <sl-table kwc:external
        row-key="id"
        columns={columns}
        data-source={dataSource}
    >
        <template for:each={dataSource} for:item="row">
            <div key={row.id} slot={row.actionSlot} class="action-cell">
                <sl-button kwc:external 
                    size="small" 
                    variant="primary"
                    onclick={handleEdit}
                    data-id={row.id}
                >
                    编辑
                </sl-button>
            </div>
        </template>
    </sl-table>
    
    <!-- 编辑弹窗 -->
    <sl-dialog kwc:external class="edit-dialog" label="编辑用户" open={isDialogOpen}>
        <div class="form-item">
            <label>姓名:</label>
            <sl-input kwc:external class="name-input" value={editingName}></sl-input>
        </div>
        <div class="form-item">
            <label>年龄:</label>
            <sl-input kwc:external class="age-input" type="number" value={editingAge}></sl-input>
        </div>
        <sl-button kwc:external slot="footer" variant="primary" onclick={handleSave}>保存</sl-button>
        <sl-button kwc:external slot="footer" onclick={handleDialogClose}>取消</sl-button>
    </sl-dialog>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/table/table.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import '@kdcloudjs/shoelace/dist/components/dialog/dialog.js';
import '@kdcloudjs/shoelace/dist/components/input/input.js';

export default class EditDataTable extends KingdeeElement {
    @track rawData = [
        { id: '1', name: '张三', age: 28 },
        { id: '2', name: '李四', age: 32 },
        { id: '3', name: '王五', age: 25 }
    ];
    
    @track isDialogOpen = false;
    @track editingId = null;
    @track editingName = '';
    @track editingAge = '';

    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;
        const dialog = this.template.querySelector('.edit-dialog');
        if (dialog) {
            dialog.addEventListener('sl-hide', this.handleDialogClose.bind(this));
        }
        const nameInput = this.template.querySelector('.name-input');
        if (nameInput) {
            nameInput.addEventListener('sl-input', this.handleNameChange.bind(this));
        }
        const ageInput = this.template.querySelector('.age-input');
        if (ageInput) {
            ageInput.addEventListener('sl-input', this.handleAgeChange.bind(this));
        }
    }

    columns = [
        { title: '姓名', dataIndex: 'name', width: 150 },
        { title: '年龄', dataIndex: 'age', width: 100 },
        { title: '操作', dataIndex: 'action', width: 100, slot: true }
    ];

    get dataSource() {
        return this.rawData.map(item => ({
            ...item,
            actionSlot: `custom-cell-action-${item.id}`
        }));
    }

    handleEdit(event) {
        const id = event.target.dataset.id;
        const item = this.rawData.find(d => d.id === id);
        if (item) {
            this.editingId = id;
            this.editingName = item.name;
            this.editingAge = String(item.age);
            this.isDialogOpen = true;
        }
    }

    handleNameChange(event) {
        this.editingName = event.target.value;
    }

    handleAgeChange(event) {
        this.editingAge = event.target.value;
    }

    handleSave() {
        this.rawData = this.rawData.map(item => {
            if (item.id === this.editingId) {
                return {
                    ...item,
                    name: this.editingName,
                    age: parseInt(this.editingAge, 10)
                };
            }
            return item;
        });
        this.handleDialogClose();
    }

    handleDialogClose() {
        this.isDialogOpen = false;
        this.editingId = null;
        this.editingName = '';
        this.editingAge = '';
    }
}
```

---

## 注意事项

1. **响应式更新**：在 LWC 中，必须通过 `@track` 装饰器声明数据，且需要重新赋值数组（如 `this.data = [...this.data, newItem]`）才能触发视图更新
2. **避免直接修改**：不要使用 `push`、`splice` 等方法直接修改数组，需要创建新数组
3. **rowKey 唯一性**：添加新数据时确保 `rowKey` 字段值唯一