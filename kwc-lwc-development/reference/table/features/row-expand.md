# 行展开

[返回目录](../index.md)

## 功能说明

通过 `expand-props` 开启行展开，并使用 `custom-row-{rowKey}` slot 自定义展开内容。

## 示例代码（LWC）
**index.html**
```html
<template>
  <sl-table
    kwc:external
    row-key="id"
    columns={columns}
    data-source={dataSource}
    expand-props={expandProps}
  >
    <template for:each={expandSlots} for:item="item">
      <div key={item.slotName} slot={item.slotName}>
        <p>姓名：{item.row.name}</p>
        <p>部门：{item.row.department}</p>
      </div>
    </template>
  </sl-table>
</template>
```
**index.js**
```js
import { KingdeeElement } from "@kdcloudjs/kwc";
import "@kdcloudjs/shoelace/dist/components/table/table.js";

export default class TableRowExpand extends KingdeeElement {
  columns = [
    { dataIndex: "name", title: "姓名", width: 160 },
    { dataIndex: "department", title: "部门", width: 140 },
    { dataIndex: "email", title: "邮箱" },
  ];
  dataSource = [
    {
      id: "1",
      name: "Alice Smith",
      department: "研发",
      email: "alice@example.com",
    },
    {
      id: "2",
      name: "Bob Johnson",
      department: "产品",
      email: "bob@example.com",
    },
  ];
  expandProps = {
    rowExpandable: true,
    expandableRowKeys: ["1", "2"],
    defaultExpandedRowKeys: ["1"],
  };
  get expandSlots() {
    return this.dataSource.map((row) => ({
      slotName: `custom-row-${row.id}`,
      row,
    }));
  }
}
```

---

## 注意事项
1. **rowKey 必须唯一**：`row-key` 指定的字段在数据中必须唯一，否则会导致行展开功能异常