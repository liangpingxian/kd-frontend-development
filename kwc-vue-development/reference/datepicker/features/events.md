# 事件处理

[返回目录](../index.md)

## 功能说明

`sl-datepicker` 提供 `sl-change`、`sl-input` 和 `sl-invalid` 三个核心事件，分别用于监听值确认变更、输入过程中的值变化和校验失败。

## API 事件

| 事件 | 说明 | 触发时机 |
|------|------|----------|
| `sl-change` | 值确认变更 | 选择日期并确认、输入框失焦提交、清除值时触发 |
| `sl-input` | 输入过程变化 | 输入框键入、日历面板选择日期时触发（值变化的实时通知） |
| `sl-invalid` | 校验失败 | 表单校验失败时触发 |

### 事件获取值的方式

```js
// 通过 event.target.value 获取当前值
function handleChange(event) {
  const value = event.target.value;  // 如 '2024-01-15' 或 '2024-01-15 14:30:00'
}
```

### sl-change 与 sl-input 的区别

| 特性 | `sl-change` | `sl-input` |
|------|-------------|------------|
| 触发频率 | 仅在值最终确认时 | 值每次变化都触发 |
| date 模式 | 选择日期后 | 选择日期时、输入时 |
| datetime 模式 | 点击确定后 | 选择日期/时间时、输入时 |
| 清除操作 | 触发 | 触发 |
| 用途 | 保存数据、提交表单 | 实时预览、联动更新 |

---

## 代码示例

### 示例1：基础事件监听

监听 `@sl-change` 事件获取用户最终选择的日期。

```vue
<template>
  <sl-datepicker
    label="选择日期"
    placeholder="请选择日期"
    @sl-change="handleChange"
  ></sl-datepicker>
  <div v-if="lastChangeValue" class="event-log">
    sl-change 触发，值: {{ lastChangeValue }}
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

const lastChangeValue = ref('');

function handleChange(event) {
  lastChangeValue.value = event.target.value || '（已清空）';
}
</script>

<style scoped>
.event-log {
  margin-top: var(--sl-spacing-small);
  padding: var(--sl-spacing-small);
  background: var(--sl-color-primary-100);
  border-radius: var(--sl-border-radius-medium);
  font-size: var(--sl-font-size-small);
  font-family: monospace;
}
</style>
```

---

### 示例2：区分 sl-change 和 sl-input

对比两个事件的触发时机和频率。

```vue
<template>
  <sl-datepicker
    label="输入或选择日期"
    placeholder="请操作查看事件触发"
    @sl-input="handleInput"
    @sl-change="handleChange"
  ></sl-datepicker>
  <div class="event-panel">
    <div class="event-section">
      <h4>sl-input 事件（实时触发）</h4>
      <div class="count">触发次数: {{ inputCount }}</div>
      <div class="value">最新值: {{ lastInputValue }}</div>
    </div>
    <div class="event-section">
      <h4>sl-change 事件（确认时触发）</h4>
      <div class="count">触发次数: {{ changeCount }}</div>
      <div class="value">最新值: {{ lastChangeValue }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

const inputCount = ref(0);
const changeCount = ref(0);
const lastInputValue = ref('（无）');
const lastChangeValue = ref('（无）');

function handleInput(event) {
  inputCount.value++;
  lastInputValue.value = event.target.value || '（空）';
}

function handleChange(event) {
  changeCount.value++;
  lastChangeValue.value = event.target.value || '（空）';
}
</script>

<style scoped>
.event-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sl-spacing-medium);
  margin-top: var(--sl-spacing-medium);
}
.event-section {
  padding: var(--sl-spacing-medium);
  background: var(--sl-color-neutral-50);
  border: 1px solid var(--sl-color-neutral-200);
  border-radius: var(--sl-border-radius-medium);
}
.event-section h4 {
  margin: 0 0 var(--sl-spacing-small) 0;
  font-size: var(--sl-font-size-small);
}
.count {
  font-size: 24px;
  font-weight: bold;
  color: var(--sl-color-primary-600);
  margin-bottom: var(--sl-spacing-x-small);
}
.value {
  font-size: 13px;
  color: var(--sl-color-neutral-600);
  font-family: monospace;
}
</style>
```

---

### 示例3：实时预览与确认保存

利用 `sl-input` 做实时预览，`sl-change` 做最终保存。

```vue
<template>
  <sl-datepicker
    label="选择日期"
    type="datetime"
    placeholder="实时预览 + 确认保存"
    @sl-input="handleInput"
    @sl-change="handleChange"
  ></sl-datepicker>
  <div class="panels">
    <div class="panel preview">
      <h4>实时预览（sl-input）</h4>
      <div class="display">{{ previewValue }}</div>
    </div>
    <div class="panel saved">
      <h4>已保存（sl-change）</h4>
      <div class="display">{{ savedValue }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

const previewValue = ref('等待输入...');
const savedValue = ref('等待确认...');

function handleInput(event) {
  previewValue.value = event.target.value || '（空）';
}

function handleChange(event) {
  savedValue.value = event.target.value || '（已清空）';
  console.log('保存到服务器:', event.target.value);
}
</script>

<style scoped>
.panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sl-spacing-medium);
  margin-top: var(--sl-spacing-medium);
}
.panel {
  padding: var(--sl-spacing-medium);
  border-radius: var(--sl-border-radius-medium);
}
.preview {
  background: var(--sl-color-warning-50);
  border: 1px solid var(--sl-color-warning-300);
}
.saved {
  background: var(--sl-color-success-100);
  border: 1px solid var(--sl-color-success-300);
}
.panel h4 {
  margin: 0 0 var(--sl-spacing-x-small) 0;
  font-size: var(--sl-font-size-small);
}
.display {
  font-size: var(--sl-font-size-medium);
  font-family: monospace;
  font-weight: 500;
}
</style>
```

---

### 示例4：监听校验失败事件

通过 `@sl-invalid` 事件捕获校验失败。

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <sl-datepicker
        ref="datepickerRef"
        name="deadline"
        label="截止日期"
        required
        placeholder="必填字段"
        @sl-invalid="handleInvalid"
        @sl-change="handleChange"
      ></sl-datepicker>
    </div>
    <sl-button type="submit" variant="primary">提交</sl-button>
  </form>
  <div v-if="errorMessage" class="error-message">
    {{ errorMessage }}
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const datepickerRef = ref(null);
const errorMessage = ref('');

function handleSubmit() {
  if (datepickerRef.value && datepickerRef.value.reportValidity()) {
    errorMessage.value = '';
    console.log('提交成功:', datepickerRef.value.value);
  }
}

function handleInvalid() {
  errorMessage.value = '请选择截止日期后再提交';
}

function handleChange() {
  errorMessage.value = '';
}
</script>

<style>
.form-group {
  margin-bottom: var(--sl-spacing-medium);
  max-width: 300px;
}
.error-message {
  margin-top: var(--sl-spacing-medium);
  padding: var(--sl-spacing-small);
  background: var(--sl-color-danger-50);
  border: 1px solid var(--sl-color-danger-200);
  border-radius: var(--sl-border-radius-medium);
  color: var(--sl-color-danger-600);
  font-size: var(--sl-font-size-small);
}
</style>
```

---

### 示例5：联动多个日期选择器

通过事件实现多个日期选择器的联动逻辑。

```vue
<template>
  <div class="form-row">
    <sl-datepicker
      label="入职日期"
      placeholder="先选择入职日期"
      @sl-change="handleJoinDateChange"
    ></sl-datepicker>

    <sl-datepicker
      label="试用期结束"
      :min="joinDate"
      :placeholder="probationPlaceholder"
      :disabled="!joinDate"
      :value="probationEndDate"
      @sl-change="handleProbationChange"
    ></sl-datepicker>

    <sl-datepicker
      label="转正日期"
      :min="probationEndDate"
      :placeholder="regularPlaceholder"
      :disabled="!probationEndDate"
      :value="regularDate"
      @sl-change="handleRegularChange"
    ></sl-datepicker>
  </div>
  <div v-if="summaryText" class="summary">{{ summaryText }}</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

const joinDate = ref('');
const probationEndDate = ref('');
const regularDate = ref('');

const probationPlaceholder = computed(() =>
  joinDate.value ? '选择试用期结束日期' : '请先选择入职日期'
);
const regularPlaceholder = computed(() =>
  probationEndDate.value ? '选择转正日期' : '请先选择试用期结束日期'
);
const summaryText = computed(() => {
  if (joinDate.value && probationEndDate.value && regularDate.value) {
    return `入职: ${joinDate.value} -> 试用期结束: ${probationEndDate.value} -> 转正: ${regularDate.value}`;
  }
  return '';
});

function handleJoinDateChange(event) {
  joinDate.value = event.target.value;
  if (joinDate.value) {
    const date = new Date(joinDate.value);
    date.setMonth(date.getMonth() + 3);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    probationEndDate.value = `${year}-${month}-${day}`;
  } else {
    probationEndDate.value = '';
    regularDate.value = '';
  }
}

function handleProbationChange(event) {
  probationEndDate.value = event.target.value;
  if (!probationEndDate.value) {
    regularDate.value = '';
  }
}

function handleRegularChange(event) {
  regularDate.value = event.target.value;
}
</script>

<style scoped>
.form-row {
  display: flex;
  gap: var(--sl-spacing-medium);
  flex-wrap: wrap;
}
.summary {
  margin-top: var(--sl-spacing-medium);
  padding: var(--sl-spacing-small);
  background: var(--sl-color-primary-50);
  border: 1px solid var(--sl-color-primary-200);
  border-radius: var(--sl-border-radius-medium);
  font-size: var(--sl-font-size-small);
}
</style>
```

---

## 注意事项

1. **事件绑定方式**：在 Vue 模板中使用 `@sl-change`、`@sl-input`、`@sl-invalid` 绑定事件
2. **获取值**：统一通过 `event.target.value` 获取当前值，而非 `event.detail`
3. **sl-change 不频繁触发**：`sl-change` 仅在值最终确认时触发，适合做数据保存；`sl-input` 实时触发，适合做预览
4. **datetime 模式差异**：在 `datetime` 模式下，选择日期/时间过程中只触发 `sl-input`，点击确定后才触发 `sl-change`
5. **清除触发**：清除按钮会同时触发 `sl-input` 和 `sl-change`，值为空字符串 `''`

[返回目录](../index.md)
