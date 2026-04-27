# 单元格自定义渲染

[返回目录](../index.md)

## 功能说明

在列上设置 `slot: true`，并通过 `custom-cell-{dataIndex}-{rowKey}` slot 名称渲染自定义内容。

## 示例代码（LWC）

```html
<template>
  <sl-table
    kwc:external
    row-key="id"
    columns={columns}
    data-source={dataSource}
  >
    <template for:each={customSlots} for:item="item">
      <div key={item.slotName} slot={item.slotName} class="op-cell" style="width: 100%">
        <sl-button
          kwc:external
          size="small"
          variant="text"
          data-id={item.rowId}
          onclick={handleDelete}
          >删除</sl-button
        >
      </div>
    </template>
  </sl-table>
</template>
```

```js
import { KingdeeElement } from "@kdcloudjs/kwc";
import "@kdcloudjs/shoelace/dist/components/table/table.js";
import "@kdcloudjs/shoelace/dist/components/button/button.js";

export default class TableCustomCell extends KingdeeElement {
  columns = [
    { dataIndex: "name", title: "姓名", width: 160 },
    { dataIndex: "email", title: "邮箱", width: 260 },
    {
      dataIndex: "action",
      title: "操作",
      width: 120,
      align: "center",
      slot: true,
    },
  ];
  dataSource = [
    { id: "1", name: "Alice Smith", email: "alice@example.com" },
    { id: "2", name: "Bob Johnson", email: "bob@example.com" },
  ];

  get customSlots() {
    return this.dataSource.map((row) => ({
      slotName: `custom-cell-action-${row.id}`,
      rowId: row.id,
    }));
  }

  handleDelete(e) {
    const id = e.currentTarget.dataset.id;
    this.dataSource = this.dataSource.filter((r) => r.id !== id);
    this.requestUpdate();
  }
}
```

---

## 注意事项

1. **Slot 名称格式**：必须严格遵循 `custom-cell-{dataIndex}-{rowKeyValue}` 格式
2. **rowKey 值**：slot 名称中的 rowKeyValue 是数据中 rowKey 字段的实际值
3. **性能考虑**：大量自定义单元格会增加 DOM 复杂度，大数据量时建议配合虚拟滚动
