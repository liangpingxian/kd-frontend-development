# 可编辑单元格

[返回目录](../index.md)

## 功能说明

通过 `slot` 渲染输入框实现单元格编辑，点击进入编辑态，失焦后保存。

## 示例代码（LWC）

```html
<template>
  <sl-table
    kwc:external
    row-key="id"
    columns={columns}
    data-source={dataSource}
  >
    <template for:each={cellSlots} for:item="cell">
      <div
        key={cell.slotName}
        slot={cell.slotName}
        data-row-index={cell.rowIndex}
        data-col-key={cell.colKey}
        onclick={handleCellClick}
        style="width: 100%"
      >
      <template kwc:if={cell.editing}>
        <sl-input
          kwc:external
          class={cell.slotName}
          value={cell.value}
          data-row-index={cell.rowIndex}
          data-col-key={cell.colKey}>
        </sl-input>
      </template>
      <template kwc:else>
        <div>{cell.value}</div>
      </template>
      </div>
    </template>
  </sl-table>
</template>
```

```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/table/table.js';
import '@kdcloudjs/shoelace/dist/components/input/input.js';

export default class TableEditableCell extends KingdeeElement {
  editKey = '';
  columns = [
    { title: '姓名', dataIndex: 'name', slot: true },
    { title: '薪资', dataIndex: 'salary', slot: true },
    { title: '地址', dataIndex: 'address', slot: true }
  ];
  dataSource = [
    { id: '1', name: 'Jane Doe', salary: '18000', address: 'London' },
    { id: '2', name: 'Alisa Ross', salary: '24000', address: 'Paris' }
  ];

  get cellSlots() {
    const list = [];
    this.dataSource.forEach((row, rowIndex) => {
      this.columns.forEach((col) => {
        list.push({
          slotName: `custom-cell-${col.dataIndex}-${row.id}`,
          rowIndex,
          colKey: col.dataIndex,
          value: row[col.dataIndex],
          editing: this.editKey === `custom-cell-${col.dataIndex}-${rowIndex}`
        });
      });
    });
    return list;
  }

  handleCellClick(e) {
    const { rowIndex, colKey } = e.currentTarget.dataset;
    this.editKey = `custom-cell-${colKey}-${rowIndex}`;
  }
  handleInputChange(e) {
    console.log(11);
    const { rowIndex, colKey } = e.currentTarget.dataset;
    const next = [...this.dataSource];
    next[Number(rowIndex)] = {
      ...next[Number(rowIndex)],
      [colKey]: e.target.value
    };
    this.dataSource = next;
  }
  handleInputBlur() {
    this.editKey = '';
  }
}
```
---
## 注意事项

1. **Slot 名称格式**：必须严格遵循 `custom-cell-{dataIndex}-{rowKeyValue}` 格式
2. **rowKey 值**：slot 名称中的 rowKeyValue 是数据中 rowKey 字段的实际值
3. **性能考虑**：大量自定义单元格会增加 DOM 复杂度，大数据量时建议配合虚拟滚动
4. **组件使用**：当需要渲染通用组件如（`input、select、datepicker`）时，优先使用`@kdcloudjs/shoelace`提供的组件