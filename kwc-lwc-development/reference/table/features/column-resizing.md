# 列宽调整

[返回目录](../index.md)

## 功能说明

通过 `enable-column-resizing` 开启拖拽调整列宽，使用 `sl-column-resize` 获取调整结果。

## 示例代码（LWC）
**index.html**
```html
<template>
  <sl-table
    kwc:external
    row-key="id"
    columns={columns}
    data-source={dataSource}
    enable-column-resizing="true"
    sl-column-resize={handleColumnResize}
  ></sl-table>
</template>
```
**index.js**
```js
import { KingdeeElement } from "@kdcloudjs/kwc";
import "@kdcloudjs/shoelace/dist/components/table/table.js";

export default class TableColumnResizing extends KingdeeElement {
  columns = [
    { dataIndex: "name", title: "姓名", width: 160 },
    { dataIndex: "email", title: "邮箱", width: 280 },
  ];
  dataSource = [{ id: "1", name: "Alice Smith", email: "alice@example.com" }];
  handleColumnResize(e) {
    console.log("sizes", e.detail);
  }
}
```

---

## 注意事项

1. **列宽限制**：列宽调整有最小值（60px）和最大值（500px）限制
2. **拖拽手柄**：鼠标悬停在列边框时会显示拖拽手柄（col-resize 光标）
