# 虚拟滚动

[返回目录](../index.md)

## 功能说明

通过 `virtualized` 开启大数据渲染，建议同时设置 `table-scroll.y`。

## 示例代码（LWC）
**index.html**
```html
<template>
  <sl-table
    kwc:external
    row-key="id"
    columns={columns}
    data-source={dataSource}
    table-scroll={tableScroll}
    virtualized={virtualized}
  ></sl-table>
</template>
```
**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/table/table.js';

export default class TableVirtualized extends KingdeeElement {
  columns = [
    { dataIndex: 'id', title: '#', width: 80 },
    { dataIndex: 'name', title: '姓名', width: 180 },
    { dataIndex: 'email', title: '邮箱' }
  ];
  dataSource = Array.from({ length: 2000 }).map((_, i) => ({
    id: i + 1,
    name: `User-${i + 1}`,
    email: `user${i + 1}@example.com`
  }));
  tableScroll = { y: 500 };
  virtualized = { itemHeight: 40, onScroll: (e) => console.log(e.target) };
}
```
---

## 注意事项

1. **必须设置 table-scroll.y**：虚拟滚动需要固定高度才能计算可视区域
2. **默认行高**：不设置 `itemHeight` 时默认行高为 40px
3. **自定义单元格**：虚拟滚动与自定义单元格（slot）兼容，但需注意 slot 内容不要过于复杂
4. **滚动性能**：虚拟滚动大幅提升渲染性能，推荐数据量超过 100 条时使用