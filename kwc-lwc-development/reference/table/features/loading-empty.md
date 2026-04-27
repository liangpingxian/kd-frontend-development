# 加载状态与空数据

[返回目录](../index.md)

## 功能说明

`loading` 控制加载态，`table-empty` slot 支持空态自定义。

## 示例代码（LWC）

```html
<template>
  <sl-table
    kwc:external
    row-key="id"
    columns={columns}
    data-source={dataSource}
    loading={loading}
  >
    <div slot="table-empty" class="empty-wrap">
      <sl-icon kwc:external name="calendar4"></sl-icon>
      <p>暂无数据</p>
    </div>
  </sl-table>
</template>
```

```js
import { KingdeeElement } from "@kdcloudjs/kwc";
import "@kdcloudjs/shoelace/dist/components/table/table.js";

export default class TableLoadingEmpty extends KingdeeElement {
  loading = false;
  columns = [{ dataIndex: "name", title: "姓名" }];
  dataSource = [];
}
```
