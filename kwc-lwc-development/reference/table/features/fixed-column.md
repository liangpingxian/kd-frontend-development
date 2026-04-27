# 固定列

[返回目录](../index.md)

## 功能说明

通过列配置 `fixed: 'left' | 'right'` 并配合 `table-scroll.x` 实现固定列。

## 示例代码（LWC）

```html
<template>
  <sl-table
    kwc:external
    row-key="id"
    columns={columns}
    data-source={dataSource}
    table-scroll={tableScroll}
  ></sl-table>
</template>
```

```js
import { KingdeeElement } from "@kdcloudjs/kwc";
import "@kdcloudjs/shoelace/dist/components/table/table.js";

export default class TableFixedColumn extends KingdeeElement {
  tableScroll = { x: 900 };
  columns = [
    { dataIndex: "name", title: "姓名", width: 160, fixed: "left" },
    { dataIndex: "gender", title: "性别", width: 140 },
    { dataIndex: "age", title: "年龄", width: 120 },
    { dataIndex: "email", title: "邮箱", width: 280 },
    { dataIndex: "position", title: "岗位", width: 180, fixed: "right" },
  ];
  dataSource = [
    {
      id: "1",
      name: "Alice",
      gender: "Female",
      age: 28,
      email: "alice@example.com",
      position: "SE",
    },
  ];
}
```

## 注意事项

1. **必须设置 table-scroll.x**：固定列时需要设置 `table-scroll.x`，否则没有横向滚动效果
