# 行拖拽

[返回目录](../index.md)

## 功能说明

通过 `row-drag` 开启拖拽排序，监听 `sl-row-reorder` 更新数据顺序。

## 示例代码（LWC）
**index.html**
```html
<template>
  <sl-table
    kwc:external
    row-key="id"
    row-drag="true"
    columns={columns}
    data-source={dataSource}
    sl-row-reorder={handleRowReorder}
  ></sl-table>
</template>
```
**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/table/table.js';

export default class TableRowDrag extends KingdeeElement {
  columns = [
    { dataIndex: 'name', title: '姓名', width: 160 },
    { dataIndex: 'position', title: '岗位' }
  ];
  dataSource = [
    { id: '1', name: 'Alice Smith', position: 'SE' },
    { id: '2', name: 'Bob Johnson', position: 'PM' },
    { id: '3', name: 'Carol White', position: 'UX' }
  ];
  handleRowReorder(detail) {
    console.log(detail);
  }
}
```
