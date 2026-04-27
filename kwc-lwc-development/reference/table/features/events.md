# 事件监听

[返回目录](../index.md)

## 功能说明

通过 `change` 事件统一监听分页、排序、筛选变化。

## 示例代码（LWC）

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

```js
handleChange(event) {
  const { sorting, columnFilters, changeType, pagination } = event.detail || {};
  console.log({ sorting, columnFilters, changeType, pagination });
}
```
---

## 注意事项

1. **何时使用**：当用户希望使用受控模式下的分页、过滤、筛选时使用

