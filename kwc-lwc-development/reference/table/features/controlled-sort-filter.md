# 受控排序筛选

[返回目录](../index.md)

## 功能说明

通过 `sortOrder`、`filteredValue` + `onChange` 实现受控排序/筛选，适用于服务端联动。

## 示例代码（LWC）

```html
<template>
  <sl-table
    kwc:external
    row-key="id"
    columns={columns}
    data-source={dataSource}
    onchange={handleChange}
  ></sl-table>
</template>
```

```js
import { KingdeeElement } from "@kdcloudjs/kwc";
import "@kdcloudjs/shoelace/dist/components/table/table.js";

export default class TableControlledSortFilter extends KingdeeElement {
  sorting = {};
  filters = { name: [] };
  dataSource = [
    { id: "1", no: 1, name: "Alice" },
    { id: "2", no: 2, name: "Bob" },
  ];

  get columns() {
    return [
      {
        dataIndex: "name",
        title: "姓名",
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: this.sorting.name || "",
        filters: [
          { text: "Alice", value: "Alice" },
          { text: "Bob", value: "Bob" },
        ],
        filteredValue: this.filters.name || [],
        onFilter: () => true,
      },
    ];
  }

  handleChange(e) {
    const { changeType, sorting, columnFilters } = e.detail || {};
    if (changeType === "sorter") {
      const next = {};
      (sorting || []).forEach((s) => {
        next[s.id] = s.desc ? "desc" : "asc";
      });
      this.sorting = next;
    }
    if (changeType === "filters") {
      const next = {};
      (columnFilters || []).forEach((f) => {
        next[f.id] = f.value;
      });
      this.filters = next;
    }
    this.requestUpdate();
  }
}
```

---

## 注意事项

1. **受控模式切换**：一旦设置了 `sortOrder` 或 `filteredValue`，该列就进入受控模式，组件不会自动排序/筛选
2. **必须配合回调使用**：受控模式下需要使用`onChange`事件并手动更新状态
3. **清空受控值**：将 `sortOrder` 设为 `null`、`filteredValue` 设为空数组可清除对应状态