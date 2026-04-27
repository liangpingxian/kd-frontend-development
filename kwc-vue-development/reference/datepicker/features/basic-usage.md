# 基础用法

[返回目录](../index.md)

## 功能说明

Datepicker 组件的基础用法包括：日期选择、设置占位符、默认值、不同尺寸、可清除、禁用、只读等基础功能。

## API 属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `value` | 当前日期值（格式：`yyyy-MM-dd`） | `string` | `''` |
| `placeholder` | 占位提示文本 | `string` | `''` |
| `label` | 标签文本 | `string` | `''` |
| `size` | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `clearable` | 是否可清除 | `boolean` | `true` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `readonly` | 是否只读 | `boolean` | `false` |
| `autofocus` | 自动获取焦点 | `boolean` | `false` |

---

## 代码示例

### 示例1：最简日期选择器

最基础的用法，点击输入框弹出日历面板选择日期。

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

---

### 示例2：设置默认值

通过 `value` 属性设置初始日期值，格式为 `yyyy-MM-dd`。

```vue
<template>
  <sl-datepicker
    label="入职日期"
    :value="selectedDate"
    @sl-change="handleChange"
  ></sl-datepicker>
  <div class="result">当前值: {{ selectedDate }}</div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

const selectedDate = ref('2024-06-15');

function handleChange(event) {
  selectedDate.value = event.target.value;
}
</script>

<style scoped>
.result {
  margin-top: var(--sl-spacing-small);
  color: var(--sl-color-neutral-600);
  font-size: var(--sl-font-size-small);
}
</style>
```

---

### 示例3：不同尺寸

通过 `size` 属性设置三种尺寸：`small`、`medium`（默认）、`large`。

```vue
<template>
  <div class="stack">
    <sl-datepicker label="Small" size="small" placeholder="小尺寸"></sl-datepicker>
    <sl-datepicker label="Medium" size="medium" placeholder="中尺寸（默认）"></sl-datepicker>
    <sl-datepicker label="Large" size="large" placeholder="大尺寸"></sl-datepicker>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
</script>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
  max-width: 300px;
}
</style>
```

---

### 示例4：可清除

`clearable` 属性默认为 `true`，输入框有值时显示清除按钮。设置 `:clearable="false"` 可禁用清除功能。

```vue
<template>
  <div class="stack">
    <sl-datepicker
      label="可清除（默认）"
      value="2024-01-15"
      placeholder="有清除按钮"
    ></sl-datepicker>

    <sl-datepicker
      label="不可清除"
      value="2024-01-15"
      :clearable="false"
      placeholder="无清除按钮"
    ></sl-datepicker>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
</script>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
  max-width: 300px;
}
</style>
```

---

### 示例5：禁用与只读

`disabled` 禁止所有交互，`readonly` 允许查看值但不允许修改。

```vue
<template>
  <div class="stack">
    <sl-datepicker label="禁用状态" value="2024-01-15" disabled></sl-datepicker>
    <sl-datepicker label="只读状态" value="2024-01-15" readonly></sl-datepicker>
    <sl-datepicker label="正常状态" value="2024-01-15"></sl-datepicker>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
</script>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
  max-width: 300px;
}
</style>
```

---

### 示例6：带标签和帮助文本

通过 `label` 和 `helpText` 属性为选择器添加标签和帮助提示。

```vue
<template>
  <div class="stack">
    <sl-datepicker
      label="出生日期"
      helpText="请选择您的出生日期"
      placeholder="yyyy-MM-dd"
    ></sl-datepicker>

    <sl-datepicker
      label="项目截止日期"
      helpText="项目需在此日期前完成"
      placeholder="选择截止日期"
      value="2024-12-31"
    ></sl-datepicker>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
</script>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
  max-width: 300px;
}
</style>
```

---

### 示例7：动态控制值

通过程序动态设置和清空日期值。

```vue
<template>
  <div class="toolbar">
    <sl-button variant="primary" @click="setToday">设为今天</sl-button>
    <sl-button variant="default" @click="setNewYear">设为元旦</sl-button>
    <sl-button variant="default" @click="clearValue">清空</sl-button>
  </div>
  <sl-datepicker
    label="动态控制"
    :value="dateValue"
    @sl-change="handleChange"
  ></sl-datepicker>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const dateValue = ref('');

function setToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  dateValue.value = `${year}-${month}-${day}`;
}

function setNewYear() {
  const year = new Date().getFullYear();
  dateValue.value = `${year}-01-01`;
}

function clearValue() {
  dateValue.value = '';
}

function handleChange(event) {
  dateValue.value = event.target.value;
}
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: var(--sl-spacing-x-small);
  margin-bottom: var(--sl-spacing-medium);
}
</style>
```

---

## 注意事项

1. **值格式**：`value` 属性的格式必须为 `yyyy-MM-dd`（如 `2024-01-15`），不符合格式的值会被自动清空
2. **属性绑定**：静态字符串直接写属性值（如 `value="2024-01-15"`），动态值需用 `:` 绑定（如 `:value="dateRef"`）
3. **清除默认开启**：`clearable` 默认为 `true`，如不需要请显式设置 `:clearable="false"`
4. **输入分隔符**：支持 `-`、`/`、`.` 三种分隔符输入，输出统一为 `-` 分隔的标准格式

[返回目录](../index.md)
