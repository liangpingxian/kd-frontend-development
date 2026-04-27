# Radio Group 单选框组

用于将多个单选框或单选按钮组合在一起，作为单个表单控件使用。

## 特性概览

- **布局控制**：支持 `horizontal`（水平）和 `vertical`（垂直）两种排列方式
- **尺寸控制**：支持 `small`、`medium`、`large` 三种尺寸
- **表单集成**：支持表单验证和自定义校验
- **两种样式**：支持普通单选框（sl-radio）和按钮式单选框（sl-radio-button）

## 基础用法

最简单的用法，将多个 `sl-radio` 放入 `sl-radio-group` 中。

```vue
<template>
  <sl-radio-group label="选择一个选项" name="option" v-model="value">
    <sl-radio value="1">选项 1</sl-radio>
    <sl-radio value="2">选项 2</sl-radio>
    <sl-radio value="3">选项 3</sl-radio>
  </sl-radio-group>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/radio-group/radio-group.js';
import '@kdcloudjs/shoelace/dist/components/radio/radio.js';

const value = ref('1');
</script>
```

## 布局方向

使用 `layout` 属性控制单选框的排列方向。默认为 `vertical`（垂直排列），设置为 `horizontal` 可实现水平排列。

```vue
<template>
  <div class="demo-container">
    <sl-radio-group label="垂直排列（默认）" name="a" value="1" layout="vertical">
      <sl-radio value="1">选项 1</sl-radio>
      <sl-radio value="2">选项 2</sl-radio>
      <sl-radio value="3">选项 3</sl-radio>
    </sl-radio-group>

    <sl-radio-group label="水平排列" name="b" value="1" layout="horizontal">
      <sl-radio value="1">选项 1</sl-radio>
      <sl-radio value="2">选项 2</sl-radio>
      <sl-radio value="3">选项 3</sl-radio>
    </sl-radio-group>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/radio-group/radio-group.js';
import '@kdcloudjs/shoelace/dist/components/radio/radio.js';
</script>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
```

## 按钮式单选框布局

`layout` 属性同样适用于按钮式单选框（sl-radio-button）。

```vue
<template>
  <div class="demo-container">
    <sl-radio-group label="水平按钮" name="c" value="1" layout="horizontal">
      <sl-radio-button value="1">选项 1</sl-radio-button>
      <sl-radio-button value="2">选项 2</sl-radio-button>
      <sl-radio-button value="3">选项 3</sl-radio-button>
    </sl-radio-group>

    <sl-radio-group label="垂直按钮" name="d" value="1" layout="vertical">
      <sl-radio-button value="1">选项 1</sl-radio-button>
      <sl-radio-button value="2">选项 2</sl-radio-button>
      <sl-radio-button value="3">选项 3</sl-radio-button>
    </sl-radio-group>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/radio-group/radio-group.js';
import '@kdcloudjs/shoelace/dist/components/radio-button/radio-button.js';
</script>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
```

## 帮助文本

使用 `help-text` 属性添加描述性帮助文本。

```vue
<template>
  <sl-radio-group 
    label="选择一个选项" 
    help-text="请选择最合适的选项" 
    name="option" 
    value="1"
  >
    <sl-radio value="1">选项 1</sl-radio>
    <sl-radio value="2">选项 2</sl-radio>
    <sl-radio value="3">选项 3</sl-radio>
  </sl-radio-group>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/radio-group/radio-group.js';
import '@kdcloudjs/shoelace/dist/components/radio/radio.js';
</script>
```

## 尺寸

使用 `size` 属性设置单选框组的尺寸，会应用到所有子单选框。

```vue
<template>
  <div class="demo-container">
    <sl-radio-group label="小尺寸" size="small" name="s" value="1">
      <sl-radio value="1">选项 1</sl-radio>
      <sl-radio value="2">选项 2</sl-radio>
    </sl-radio-group>

    <sl-radio-group label="中等尺寸" size="medium" name="m" value="1">
      <sl-radio value="1">选项 1</sl-radio>
      <sl-radio value="2">选项 2</sl-radio>
    </sl-radio-group>

    <sl-radio-group label="大尺寸" size="large" name="l" value="1">
      <sl-radio value="1">选项 1</sl-radio>
      <sl-radio value="2">选项 2</sl-radio>
    </sl-radio-group>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/radio-group/radio-group.js';
import '@kdcloudjs/shoelace/dist/components/radio/radio.js';
</script>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
```

## Properties

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 单选框组的标签 | `string` | `''` |
| help-text | 帮助文本 | `string` | `''` |
| name | 表单提交时的字段名 | `string` | `'option'` |
| value | 当前选中的值 | `string` | `''` |
| size | 尺寸大小 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| layout | 排列方向 | `'horizontal' \| 'vertical'` | `'vertical'` |
| form | 关联的表单 ID | `string` | `''` |
| required | 是否必填 | `boolean` | `false` |

## Events

| 事件名称 | Vue 绑定 | 描述 |
| --- | --- | --- |
| sl-change | `@sl-change` | 选中值变化时触发 |
| sl-input | `@sl-input` | 用户输入时触发 |
| sl-invalid | `@sl-invalid` | 表单验证失败时触发 |

## Slots

| 插槽名称 | 描述 |
| --- | --- |
| (default) | 放置 sl-radio 或 sl-radio-button 元素 |
| label | 自定义标签内容 |
| help-text | 自定义帮助文本内容 |

## CSS Parts

| Part 名称 | 描述 |
| --- | --- |
| form-control | 表单控件容器 |
| form-control-label | 标签容器 |
| form-control-input | 输入区域容器 |
| form-control-help-text | 帮助文本容器 |
| button-group | 按钮组容器（使用 radio-button 时） |
| radios | 单选框容器（使用 radio 时） |

## 导入说明

```js
import '@kdcloudjs/shoelace/dist/components/radio-group/radio-group.js';
import '@kdcloudjs/shoelace/dist/components/radio/radio.js';
// 如果使用按钮式单选框
import '@kdcloudjs/shoelace/dist/components/radio-button/radio-button.js';
```
