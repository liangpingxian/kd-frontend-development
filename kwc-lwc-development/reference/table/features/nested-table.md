# 嵌套子表格

[返回目录](../index.md)

## 功能说明

在展开行中再放置一个 `sl-table`，用于展示子数据。

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
    <template for:each={expandRows} for:item="item">
      <div key={item.slotName} slot={item.slotName} class="expand-wrap">
        <sl-table
          kwc:external
          row-key="subId"
          columns={subColumns}
          data-source={item.children}
          show-header={showHeader}
        ></sl-table>
      </div>
    </template>
  </sl-table>
</template>
```
**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/table/table.js';

export default class TableNested extends KingdeeElement {
  showHeader = false;
  columns = [
    { dataIndex: 'name', title: '姓名', width: 160 },
    { dataIndex: 'email', title: '邮箱' }
  ];
  subColumns = [
    { dataIndex: 'task', title: '任务', width: 180 },
    { dataIndex: 'status', title: '状态' }
  ];
  dataSource = [
    {
      id: '1',
      name: 'Alice Smith',
      email: 'alice@example.com',
      children: [{ subId: '1-1', task: '需求评审', status: '完成' }]
    }
  ];
  expandProps = {
    rowExpandable: true,
    expandableRowKeys: ['1'],
    defaultExpandedRowKeys: ['1']
  };
  get expandRows() {
    return this.dataSource.map((r) => ({
      slotName: `custom-row-${r.id}`,
      children: r.children || []
    }));
  }
}
```

## 注意事项
1. **rowKey 必须唯一**：`row-key` 指定的字段在数据中必须唯一，否则会导致行展开功能异常
