# 行/单元格属性

[返回目录](../index.md)

## 功能说明

通过 `sl-row`、`sl-header-row`、`slCell`、`slHeaderCell` 注入 class、style 和事件。

## 示例代码（LWC）

**index.html**
```html
<template>
  <sl-table 
    kwc:external
    row-key="id" 
    columns={columns}
    data-source={dataSource}
    sl-row={slRow}
    sl-header-row={slHeaderRow}>
  </sl-table>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/table/table.js';

export default class DataTable extends KingdeeElement {
  dataSource = [
    { id: '1', name: 'Alice Smith', email: 'alice@example.com' },
    { id: '2', name: 'Bob Johnson', email: 'bob@example.com' }
  ];
  columns = [
    {
      dataIndex: 'name',
      title: '姓名',
      slCell: (record) => ({
        onmouseenter: () => console.log('onmouseenter cell', record.id)
      }),
      slHeaderCell: () => ({ className: 'name-header' })
    }
  ];

  slRow = (record, rowIndex) => {
    return {
      onclick: () => console.log('click row', record.id),
      className: rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
    };
  };

  slHeaderRow = () => ({ className: 'table-head-row' });
}
```

---

## 注意事项

1. **返回的事件名大小写**：返回的是js原生事件，需要用小写格式，例如`onclick`、`onmouseenter`等
