# 日期时间模式

[返回目录](../index.md)

## 功能说明

通过设置 `type="datetime"`，Datepicker 组件切换为日期时间选择模式，允许用户同时选择日期和时间（时、分、秒）。在桌面端，日历面板右侧会显示时间选择面板，并需要点击"确定"按钮确认选择；在移动端，时间选择通过底部滚轮面板进行。

## API 属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `type` | 选择器类型 | `'date' \| 'datetime'` | `'date'` |

### 类型对比

| 特性 | `date` 模式 | `datetime` 模式 |
|------|-------------|-----------------|
| 值格式 | `yyyy-MM-dd` | `yyyy-MM-dd HH:mm:ss` |
| 时间面板 | 无 | 有（时/分/秒） |
| 确认按钮 | 无（选择日期即确认） | 有（需点击确定） |
| 输入验证格式 | `yyyy-MM-dd` | `yyyy-MM-dd HH:mm:ss` |
| 失焦行为 | 提交当前值 | 回退到上一有效值 |
| 示例值 | `2024-01-15` | `2024-01-15 14:30:00` |

---

## 代码示例

### 示例1：基础日期时间选择

设置 `type="datetime"` 开启日期时间选择模式。

```vue
<template>
  <sl-datepicker
    label="选择日期时间"
    type="datetime"
    placeholder="请选择日期和时间"
    @sl-change="handleChange"
  ></sl-datepicker>
  <div v-if="selectedDatetime" class="result">
    选中的日期时间: {{ selectedDatetime }}
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

const selectedDatetime = ref('');

function handleChange(event) {
  selectedDatetime.value = event.target.value;
}
</script>

<style scoped>
.result {
  margin-top: var(--sl-spacing-small);
  padding: var(--sl-spacing-small);
  background: var(--sl-color-primary-100);
  border-radius: var(--sl-border-radius-medium);
  font-size: var(--sl-font-size-small);
}
</style>
```

---

### 示例2：设置默认日期时间

通过 `value` 设置初始日期时间，格式必须为 `yyyy-MM-dd HH:mm:ss`。

```vue
<template>
  <sl-datepicker
    label="会议时间"
    type="datetime"
    :value="currentValue"
    @sl-change="handleChange"
  ></sl-datepicker>
  <div class="result">当前值: {{ currentValue }}</div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

const currentValue = ref('2024-06-15 09:30:00');

function handleChange(event) {
  currentValue.value = event.target.value;
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

### 示例3：日期与日期时间对比

并排展示两种模式的差异。

```vue
<template>
  <div class="comparison">
    <div class="picker-wrapper">
      <sl-datepicker
        label="日期模式 (date)"
        type="date"
        placeholder="选择日期"
        @sl-change="handleDateChange"
      ></sl-datepicker>
      <div class="value">值: {{ dateValue }}</div>
    </div>

    <div class="picker-wrapper">
      <sl-datepicker
        label="日期时间模式 (datetime)"
        type="datetime"
        placeholder="选择日期和时间"
        @sl-change="handleDatetimeChange"
      ></sl-datepicker>
      <div class="value">值: {{ datetimeValue }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

const dateValue = ref('（未选择）');
const datetimeValue = ref('（未选择）');

function handleDateChange(event) {
  dateValue.value = event.target.value || '（未选择）';
}

function handleDatetimeChange(event) {
  datetimeValue.value = event.target.value || '（未选择）';
}
</script>

<style scoped>
.comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.picker-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-x-small);
}
.value {
  font-size: 13px;
  color: var(--sl-color-neutral-600);
  font-family: monospace;
  word-break: break-all;
}
</style>
```

---

### 示例4：动态切换模式

动态切换 `date` 和 `datetime` 模式。

```vue
<template>
  <div class="toolbar">
    <sl-button
      :variant="pickerType === 'date' ? 'primary' : 'default'"
      @click="switchToDate"
    >日期模式</sl-button>
    <sl-button
      :variant="pickerType === 'datetime' ? 'primary' : 'default'"
      @click="switchToDatetime"
    >日期时间模式</sl-button>
  </div>
  <sl-datepicker
    label="动态切换"
    :type="pickerType"
    :placeholder="pickerType === 'date' ? '请选择日期' : '请选择日期和时间'"
    :value="currentValue"
    @sl-change="handleChange"
  ></sl-datepicker>
  <div class="result">
    <div>当前模式: {{ pickerType }}</div>
    <div>当前值: {{ currentValue }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const pickerType = ref('date');
const currentValue = ref('');

function switchToDate() {
  pickerType.value = 'date';
  currentValue.value = '';
}

function switchToDatetime() {
  pickerType.value = 'datetime';
  currentValue.value = '';
}

function handleChange(event) {
  currentValue.value = event.target.value;
}
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: var(--sl-spacing-x-small);
  margin-bottom: var(--sl-spacing-medium);
}
.result {
  margin-top: var(--sl-spacing-small);
  padding: var(--sl-spacing-small);
  background: var(--sl-color-neutral-100);
  border-radius: var(--sl-border-radius-medium);
  font-size: var(--sl-font-size-small);
  color: var(--sl-color-neutral-600);
}
.result div {
  margin-bottom: var(--sl-spacing-2x-small);
}
</style>
```

---

## 注意事项

1. **值格式严格匹配**：`datetime` 模式下值格式必须为 `yyyy-MM-dd HH:mm:ss`，缺少时间部分会导致解析失败
2. **确认行为差异**：`date` 模式选择日期后自动关闭弹窗并提交；`datetime` 模式需要点击"确定"按钮才提交
3. **失焦行为差异**：`datetime` 模式下，如果弹窗打开时失焦，会回退到上一有效值而非提交当前值
4. **切换模式清空值**：从 `date` 切换到 `datetime` 模式（或反之）时，建议清空当前值，因为值格式不兼容
5. **时间面板**：桌面端日历面板右侧显示时/分/秒三列滚动选择；移动端通过底部滚轮选择

[返回目录](../index.md)
