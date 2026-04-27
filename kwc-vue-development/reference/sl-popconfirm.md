# Popconfirm 气泡确认框

点击元素，弹出气泡式的确认框，用于在操作前进行二次确认。

## 特性概览

- **气泡确认**：在目标元素附近弹出轻量级确认浮层，无需打断用户流程
- **12 个弹出方向**：支持 `top`、`topLeft`、`topRight`、`bottom`、`bottomLeft`、`bottomRight`、`left`、`leftTop`、`leftBottom`、`right`、`rightTop`、`rightBottom`
- **异步确认**：`onConfirm` 回调支持返回 Promise，确认按钮自动 loading
- **自定义图标**：通过 `icon` 属性或 `icon` 插槽自定义图标
- **箭头控制**：支持显示/隐藏箭头，支持箭头精准指向目标元素中心
- **语义化样式定制**：通过 `classNames` 和 `customStyles` 自定义各语义结构的类名和内联样式
- **禁用状态**：支持整体禁用交互

## 基础用法

最简单的用法，点击按钮弹出确认浮层。通过 `title` 设置确认框标题。

```vue
<template>
  <sl-popconfirm title="确定删除吗？" :onConfirm.prop="onConfirm" :onCancel.prop="onCancel">
    <sl-button>删除</sl-button>
  </sl-popconfirm>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/popconfirm/popconfirm.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const onConfirm = () => console.log('确认');
const onCancel = () => console.log('取消');
</script>
```

## 自定义按钮文字

通过 `okText` 和 `cancelText` 自定义确认和取消按钮的文字。

```vue
<template>
  <sl-popconfirm title="Are you sure to delete this task?" okText="Yes" cancelText="No">
    <sl-button variant="danger">Delete</sl-button>
  </sl-popconfirm>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/popconfirm/popconfirm.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
</script>
```

## 添加描述

通过 `description` 属性为确认框添加描述信息。

```vue
<template>
  <sl-popconfirm title="确定删除吗？" description="删除后将无法恢复，请谨慎操作。">
    <sl-button>删除</sl-button>
  </sl-popconfirm>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/popconfirm/popconfirm.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
</script>
```

## 禁用状态

通过添加 `disabled` 属性，可以禁用气泡确认框，使其无法弹出。

```vue
<template>
  <sl-popconfirm title="确定删除吗？" disabled>
    <sl-button>删除</sl-button>
  </sl-popconfirm>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/popconfirm/popconfirm.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
</script>
```

## 位置

通过 `placement` 属性控制弹出位置，支持 12 个方向。

```vue
<template>
  <div style="display: flex; gap: 8px">
    <sl-popconfirm title="Top 确认？" placement="top">
      <sl-button>Top</sl-button>
    </sl-popconfirm>
    <sl-popconfirm title="Bottom 确认？" placement="bottom">
      <sl-button>Bottom</sl-button>
    </sl-popconfirm>
    <sl-popconfirm title="Left 确认？" placement="left">
      <sl-button>Left</sl-button>
    </sl-popconfirm>
    <sl-popconfirm title="Right 确认？" placement="right">
      <sl-button>Right</sl-button>
    </sl-popconfirm>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/popconfirm/popconfirm.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
</script>
```

## 自定义图标

通过 `icon` 属性更换图标名称。

```vue
<template>
  <sl-popconfirm title="确定提交？" icon="question-circle-fill">
    <sl-button>提交</sl-button>
  </sl-popconfirm>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/popconfirm/popconfirm.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
</script>
```

## 异步确认

当 `onConfirm` 回调返回 Promise 时，确认按钮自动进入 loading 状态，请求成功后气泡自动关闭。

```vue
<template>
  <sl-popconfirm title="确定提交吗？" description="将模拟 2 秒异步请求" :onConfirm.prop="onConfirm">
    <sl-button>异步确认</sl-button>
  </sl-popconfirm>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/popconfirm/popconfirm.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const onConfirm = () => new Promise(resolve => setTimeout(resolve, 2000));
</script>
```

## 确认按钮类型

通过 `okType` 属性设置确认按钮的类型，支持 `primary`、`danger`、`default`。

```vue
<template>
  <div style="display: flex; gap: 16px">
    <sl-popconfirm title="确定？" okType="primary">
      <sl-button>Primary</sl-button>
    </sl-popconfirm>
    <sl-popconfirm title="确定删除？" okType="danger">
      <sl-button variant="danger">Danger</sl-button>
    </sl-popconfirm>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/popconfirm/popconfirm.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
</script>
```

## Properties

| 属性         | 描述                                           | 类型                                                                                                                                                             | 默认值                      |
| ------------ | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| title        | 确认框标题                                     | `string`                                                                                                                                                         | `''`                        |
| description  | 确认框描述                                     | `string`                                                                                                                                                         | `''`                        |
| okText       | 确认按钮文字                                   | `string`                                                                                                                                                         | `'确定'`                    |
| cancelText   | 取消按钮文字                                   | `string`                                                                                                                                                         | `'取消'`                    |
| `direction` | 确认框方向 | `'ltr' \| 'rtl'` | `'ltr'` |
| placement    | 弹出位置                                       | `'top' \| 'topLeft' \| 'topRight' \| 'bottom' \| 'bottomLeft' \| 'bottomRight' \| 'left' \| 'leftTop' \| 'leftBottom' \| 'right' \| 'rightTop' \| 'rightBottom'` | `'top'`                     |
| open         | 是否显示（reflects）                           | `boolean`                                                                                                                                                        | `false`                     |
| disabled     | 是否禁用（reflects）                           | `boolean`                                                                                                                                                        | `false`                     |
| icon         | 图标名称                                       | `string`                                                                                                                                                         | `'exclamation-circle-fill'` |
| arrow        | 是否显示箭头，支持设置箭头精准指向目标元素中心 | `boolean \| { pointAtCenter: boolean }`                                                                                                                          | `true`                      |
| okType       | 确认按钮类型                                   | `'primary' \| 'danger' \| 'default'`                                                                                                                             | `'primary'`                 |
| onConfirm    | 点击确认的回调（JS 属性，需用 `.prop`），支持返回 Promise | `() => void \| Promise<void>`                                                                                                                    | -                           |
| onCancel     | 点击取消的回调（JS 属性，需用 `.prop`）        | `() => void`                                                                                                                                                     | -                           |
| classNames   | 自定义语义化结构的 CSS 类名（JS 属性，需用 `.prop`） | `Partial<Record<'body' \| 'icon' \| 'title' \| 'description' \| 'footer', string>>`                                                                        | -                           |
| customStyles | 自定义语义化结构的内联样式（JS 属性，需用 `.prop`）  | `PopconfirmStylesObject \| PopconfirmStylesFn`                                                                                                              | -                           |

## Methods

| 方法名 | 描述           | 参数 | 返回值          |
| ------ | -------------- | ---- | --------------- |
| show() | 显示气泡确认框 | -    | `Promise<void>` |
| hide() | 隐藏气泡确认框 | -    | `Promise<void>` |

## Slots

| 名称    | 描述                 |
| ------- | -------------------- |
| default | 触发气泡确认框的元素 |
| icon    | 自定义图标内容       |

## CSS Parts

| 名称        | 描述           |
| ----------- | -------------- |
| body        | 确认框主体容器 |
| icon        | 图标区域       |
| title       | 标题区域       |
| description | 描述区域       |
| footer      | 底部按钮区域   |

## CSS Custom Properties

| CSS 属性                | 描述     | 默认值         |
| ----------------------- | -------- | -------------- |
| --max-width             | 最大宽度 | `20rem`        |
| --sl-tooltip-arrow-size | 箭头大小 | 继承自 tooltip |

## 常见问题

### Q: 如何在 Vue 中绑定 onConfirm / onCancel 回调？

A: `onConfirm` 和 `onCancel` 是 JS 属性（非 HTML 属性），必须使用 `.prop` 修饰符传递：

```vue
<sl-popconfirm title="确认？" :onConfirm.prop="handleConfirm" :onCancel.prop="handleCancel">
  ...
</sl-popconfirm>
```

### Q: placement 属性值和 sl-popup 的 placement 有什么区别？

A: Popconfirm 使用驼峰命名（如 `topLeft`），内部会映射为 sl-popup 的 `top-start` 格式。完整映射关系：

- `topLeft` → `top-start`，`topRight` → `top-end`
- `bottomLeft` → `bottom-start`，`bottomRight` → `bottom-end`
- `leftTop` → `left-start`，`leftBottom` → `left-end`
- `rightTop` → `right-start`，`rightBottom` → `right-end`
