# Datepicker 日期选择器组件

## 组件概述

`sl-datepicker` 是一个日期/日期时间选择器组件，支持日期选择（`date`）和日期时间选择（`datetime`）两种模式。基于 Web Components 标准开发，支持在 KWC Vue 框架中使用。组件在桌面端以弹出面板形式展示日历，在移动端（屏幕宽度 ≤ 500px）自动切换为底部抽屉面板。

## 功能列表

| 功能 | 说明 | 详细文档 |
|------|------|----------|
| 基础用法 | 日期选择、占位符、默认值、尺寸、清除等基础功能 | [basic-usage.md](./features/basic-usage.md) |
| 日期时间模式 | datetime 模式选择日期和时间 | [datetime-mode.md](./features/datetime-mode.md) |
| 日期格式化 | 通过 format 自定义日期显示格式（基于 dayjs） | [format.md](./features/format.md) |
| 日期范围限制 | 通过 min/max 限制可选日期范围 | [date-range.md](./features/date-range.md) |
| 事件处理 | sl-input、sl-change 事件监听与处理 | [events.md](./features/events.md) |
| 表单集成 | name、required、form 属性及表单方法使用 | [form-integration.md](./features/form-integration.md) |
| 样式定制 | size、filled、pill、Slots、CSS Parts 样式定制 | [styling.md](./features/styling.md) |
| 校验 | required、min/max 校验及 setCustomValidity 自定义校验 | [validation.md](./features/validation.md) |

## 核心约束

### 必须遵守的规则

1. **值格式要求**
   - `date` 模式：值格式为 `yyyy-MM-dd`（如 `2024-01-15`）
   - `datetime` 模式：值格式为 `yyyy-MM-dd HH:mm:ss`（如 `2024-01-15 14:30:00`）
   - 支持 `-`、`/`、`.` 作为日期分隔符输入，但输出统一为 `-` 分隔

2. **Vue 框架规范**
   - 属性绑定使用 `:prop` 语法（如 `:value="date"`）
   - 事件绑定使用 `@sl-*` 语法（如 `@sl-change="handleChange"`）
   - Boolean 属性直接写属性名表示 `true`（如 `disabled`、`clearable`）
   - 通过 `event.target.value` 获取值，而非 `event.detail`
   - 需要调用方法时，使用 `ref` 获取组件实例

3. **组件标签名**
   - 标签名为 `sl-datepicker`，注意不是 `sl-date-picker`

## 快速开始

### 组件导入

```js
// 必须导入 - Datepicker 核心组件
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
```

### 最简示例

```vue
<template>
  <sl-datepicker
    label="选择日期"
    placeholder="请选择日期"
  ></sl-datepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
</script>
```

### 带事件处理示例

```vue
<template>
  <sl-datepicker
    label="选择日期"
    placeholder="请选择日期"
    @sl-change="handleChange"
  ></sl-datepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

function handleChange(event) {
  console.log('选中日期:', event.target.value);
}
</script>
```

## API 概览

### 主要属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `value` | 当前日期值 | `string` | `''` |
| `type` | 选择器类型 | `'date' \| 'datetime'` | `'date'` |
| `placeholder` | 占位提示文本 | `string` | `''` |
| `label` | 标签文本 | `string` | `''` |
| `name` | 表单字段名 | `string` | `''` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `readonly` | 是否只读 | `boolean` | `false` |
| `clearable` | 是否可清除 | `boolean` | `true` |
| `required` | 是否必填 | `boolean` | `false` |
| `size` | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `min` | 最小可选日期 | `string` | `'0001-01-01'` |
| `max` | 最大可选日期 | `string` | `'9999-12-31'` |
| `pattern` | 输入格式正则 | `string` | - |
| `format` | 日期显示格式（dayjs） | `string` | `'YYYY-MM-DD'` / `'YYYY-MM-DD HH:mm:ss'` |
| `hoist` | 弹出层提升到固定定位 | `boolean` | `false` |
| `filled` | 填充样式 | `boolean` | `false` |
| `pill` | 圆角药丸样式 | `boolean` | `false` |
| `helpText` | 帮助提示文本 | `string` | `''` |
| `form` | 关联的表单 ID | `string` | `''` |
| `autofocus` | 自动获取焦点 | `boolean` | `false` |

### 主要事件

| 事件 | 说明 | 触发时机 |
|------|------|----------|
| `sl-change` | 值变更事件 | 用户选择日期或确认输入后触发 |
| `sl-input` | 输入事件 | 用户在输入框中输入或选择日期时触发 |
| `sl-invalid` | 校验失败事件 | 表单校验失败时触发 |

### 主要方法

| 方法 | 说明 | 参数 |
|------|------|------|
| `focus(options?)` | 聚焦并打开面板 | `FocusOptions` |
| `blur()` | 失焦并关闭面板 | - |
| `checkValidity()` | 检查表单校验 | - |
| `reportValidity()` | 报告校验结果 | - |
| `setCustomValidity(message)` | 设置自定义校验消息 | `string` |
| `getForm()` | 获取关联的表单元素 | - |

### Slots（插槽）

| Slot | 说明 |
|------|------|
| `label` | 自定义标签内容 |
| `prefix` | 输入框前缀 |
| `suffix` | 输入框后缀（默认为日历图标） |
| `clear-icon` | 自定义清除按钮图标 |
| `help-text` | 自定义帮助提示内容 |

## 使用建议

1. **日期选择**：仅需选择日期时使用默认 `type="date"`，选择后自动关闭弹窗
2. **日期时间选择**：需要精确到时分秒时设置 `type="datetime"`，需点击确定按钮确认
3. **日期范围限制**：通过 `min` 和 `max` 属性限制可选范围，超出范围的日期会被禁用
4. **表单集成**：配合 `name`、`required`、`form` 属性可无缝集成到表单中
5. **移动端适配**：组件自动检测屏幕宽度，≤ 500px 时切换为移动端底部抽屉面板
