# 分页

[返回目录](../index.md)

## 功能说明

通过 `pagination` 配置分页，支持受控与非受控模式。

## 示例代码（LWC）
### 非受控
**index.html**
```html
<template>
  <sl-table
    kwc:external
    row-key="id"
    columns={columns}
    data-source={dataSource}
    pagination={pagination}
    onchange={handleChange}
  ></sl-table>
</template>
```
**index.js**
```js
import { KingdeeElement } from "@kdcloudjs/kwc";
import "@kdcloudjs/shoelace/dist/components/table/table.js";

export default class TablePagination extends KingdeeElement {
  columns = [
    { dataIndex: "name", title: "姓名", width: 160 },
    { dataIndex: "email", title: "邮箱" },
  ];
  dataSource = Array.from({ length: 100 }).map((_, i) => ({
    id: String(i + 1),
    name: `User-${i + 1}`,
    email: `user${i + 1}@example.com`,
  }));
  pagination = { pageSize: 10, pageSizeOpts: [10, 20, 50, 100] };
  handleChange = (e) => {console.log(e.detail)}
}
```
### 受控

**index.html**
```html
<template>
  <sl-table
    kwc:external
    row-key="id"
    columns={columns}
    data-source={dataSource}
    pagination={tablePagination}
    onchange={handleChange}
  ></sl-table>
</template>
```
**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/table/table.js';

export default class TablePagination extends KingdeeElement {
  @track tablePagination = { pageSize: 10, pageSizeOpts: [10, 20, 50, 100], currentPage: 1, total: 100 };
  columns = [
    { dataIndex: 'name', title: '姓名', width: 160 },
    { dataIndex: 'email', title: '邮箱' }
  ];
  dataSource = Array.from({ length: 100 }).map((_, i) => ({
    id: String(i + 1),
    name: `User-${i + 1}`,
    email: `user${i + 1}@example.com`
  }));
  handleChange = (e) => {
    const { type, pagination } = e.detail;
    console.log(e);
    if (type === 'pagination') {
      const { pageNumber } = pagination;
      this.tablePagination = {
        ...this.tablePagination,
        currentPage: pageNumber
      };
    }
  };
}
```

