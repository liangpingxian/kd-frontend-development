# 校验

[返回目录](../index.md)

## 功能说明

`sl-datepicker` 支持内置校验（`required`、`min/max` 范围）和自定义校验（`setCustomValidity`）。组件实现了标准的表单校验接口，可与浏览器原生表单校验机制无缝配合。在 Vue 中，使用 `ref` 获取组件实例调用校验方法，通过 `@sl-invalid` 监听校验失败事件。

## API

### 校验相关属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `required` | 是否必填 | `boolean` | `false` |
| `min` | 最小可选日期 | `string` | `'0001-01-01'` |
| `max` | 最大可选日期 | `string` | `'9999-12-31'` |

### 校验方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `checkValidity()` | 检查是否有效（不显示提示） | `boolean` |
| `reportValidity()` | 检查并显示校验提示 | `boolean` |
| `setCustomValidity(message)` | 设置自定义校验消息 | `void` |

### 校验相关属性（只读）

| 属性 | 说明 | 类型 |
|------|------|------|
| `validity` | 校验状态对象 | `ValidityState` |
| `validationMessage` | 当前校验消息 | `string` |

### 校验事件

| 事件 | 说明 |
|------|------|
| `sl-invalid` | 校验失败时触发 |

---

## 代码示例

### 示例1：必填校验

设置 `required` 属性，空值时校验不通过。通过 `@sl-invalid` 监听校验失败事件。

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <sl-datepicker
        ref="pickerRef"
        name="birthday"
        label="出生日期"
        required
        placeholder="此字段必填"
        @sl-invalid="handleInvalid"
      ></sl-datepicker>
    </div>
    <sl-button type="submit" variant="primary">提交</sl-button>
  </form>
  <div v-if="errorMsg" class="message error">{{ errorMsg }}</div>
  <div v-if="successMsg" class="message success">{{ successMsg }}</div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const pickerRef = ref(null);
const errorMsg = ref('');
const successMsg = ref('');

function handleSubmit(event) {
  const picker = pickerRef.value;

  if (picker.reportValidity()) {
    errorMsg.value = '';
    successMsg.value = `提交成功，出生日期: ${picker.value}`;
  }
}

function handleInvalid() {
  successMsg.value = '';
  errorMsg.value = '请填写出生日期';
}
</script>

<style scoped>
.form-group {
  margin-bottom: var(--sl-spacing-medium);
  max-width: 300px;
}
.message {
  margin-top: var(--sl-spacing-small);
  padding: var(--sl-spacing-small);
  border-radius: var(--sl-border-radius-medium);
  font-size: var(--sl-font-size-small);
}
.error {
  background: var(--sl-color-danger-50);
  border: 1px solid var(--sl-color-danger-200);
  color: var(--sl-color-danger-600);
}
.success {
  background: var(--sl-color-success-100);
  border: 1px solid var(--sl-color-success-300);
  color: var(--sl-color-success-600);
}
</style>
```

---

### 示例2：自定义校验消息

使用 `setCustomValidity()` 设置自定义校验消息，通过 `@sl-change` 监听值变化来清除错误状态。

```vue
<template>
  <div class="form-group">
    <sl-datepicker
      ref="pickerRef"
      label="项目截止日期"
      placeholder="选择截止日期"
      @sl-change="handleChange"
    ></sl-datepicker>
  </div>
  <sl-button variant="primary" @click="validateDate">校验日期</sl-button>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const pickerRef = ref(null);

function handleChange() {
  // 值变化时清除之前的校验消息
  pickerRef.value.setCustomValidity('');
}

function validateDate() {
  const picker = pickerRef.value;
  const value = picker.value;

  if (!value) {
    picker.setCustomValidity('截止日期不能为空，请选择一个日期');
    picker.reportValidity();
    return;
  }

  const selectedDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate <= today) {
    picker.setCustomValidity('截止日期必须是未来的日期');
    picker.reportValidity();
    return;
  }

  // 校验通过，清除错误消息
  picker.setCustomValidity('');
  console.log('校验通过，截止日期:', value);
}
</script>

<style scoped>
.form-group {
  margin-bottom: var(--sl-spacing-medium);
  max-width: 300px;
}
</style>
```

---

### 示例3：业务规则校验（工作日校验）

自定义校验逻辑：只允许选择工作日（周一至周五）。

```vue
<template>
  <div class="form-group">
    <sl-datepicker
      ref="pickerRef"
      label="发货日期"
      placeholder="仅工作日可选"
      helpText="发货仅支持工作日（周一至周五）"
      @sl-change="validateWorkday"
    ></sl-datepicker>
  </div>
  <div v-if="statusText" class="status">
    <span :class="isValid ? 'valid' : 'invalid'">{{ statusText }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

const pickerRef = ref(null);
const statusText = ref('');
const isValid = ref(false);

function validateWorkday(event) {
  const value = event.target.value;
  const picker = pickerRef.value;

  if (!value) {
    picker.setCustomValidity('');
    statusText.value = '';
    return;
  }

  const date = new Date(value);
  const dayOfWeek = date.getDay();
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    picker.setCustomValidity(`${dayNames[dayOfWeek]}不可发货，请选择工作日`);
    picker.reportValidity();
    statusText.value = `${value} 是${dayNames[dayOfWeek]}，不可发货`;
    isValid.value = false;
  } else {
    picker.setCustomValidity('');
    statusText.value = `${value} 是${dayNames[dayOfWeek]}，可以发货`;
    isValid.value = true;
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: var(--sl-spacing-medium);
  max-width: 300px;
}
.status {
  padding: var(--sl-spacing-small);
  border-radius: var(--sl-border-radius-medium);
  font-size: var(--sl-font-size-small);
}
.valid {
  color: var(--sl-color-success-600);
}
.invalid {
  color: var(--sl-color-danger-600);
}
</style>
```

---

### 示例4：多字段联合校验

对表单中多个日期字段进行联合校验。

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <sl-datepicker
        ref="startRef"
        name="startDate"
        label="开始日期"
        required
        placeholder="选择开始日期"
        @sl-change="crossValidate"
      ></sl-datepicker>
    </div>
    <div class="form-group">
      <sl-datepicker
        ref="endRef"
        name="endDate"
        label="结束日期"
        required
        placeholder="选择结束日期"
        @sl-change="crossValidate"
      ></sl-datepicker>
    </div>
    <div class="form-group">
      <sl-datepicker
        ref="reportRef"
        name="reportDate"
        label="报告日期"
        required
        placeholder="选择报告日期"
        helpText="报告日期必须在结束日期之后"
        @sl-change="crossValidate"
      ></sl-datepicker>
    </div>
    <sl-button type="submit" variant="primary">提交</sl-button>
  </form>
  <div v-if="errors.length > 0" class="errors">
    <h4>校验错误:</h4>
    <div v-for="error in errors" :key="error" class="error-item">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const startRef = ref(null);
const endRef = ref(null);
const reportRef = ref(null);
const errors = ref([]);

function crossValidate() {
  const startPicker = startRef.value;
  const endPicker = endRef.value;
  const reportPicker = reportRef.value;

  // 清除所有自定义校验
  startPicker.setCustomValidity('');
  endPicker.setCustomValidity('');
  reportPicker.setCustomValidity('');

  const startDate = startPicker.value ? new Date(startPicker.value) : null;
  const endDate = endPicker.value ? new Date(endPicker.value) : null;
  const reportDate = reportPicker.value ? new Date(reportPicker.value) : null;

  // 结束日期必须大于开始日期
  if (startDate && endDate && endDate <= startDate) {
    endPicker.setCustomValidity('结束日期必须晚于开始日期');
  }

  // 报告日期必须大于结束日期
  if (endDate && reportDate && reportDate <= endDate) {
    reportPicker.setCustomValidity('报告日期必须晚于结束日期');
  }
}

function handleSubmit() {
  crossValidate();

  const pickers = [startRef.value, endRef.value, reportRef.value];
  const errorList = [];
  let allValid = true;

  pickers.forEach(picker => {
    if (!picker.reportValidity()) {
      allValid = false;
      errorList.push(`${picker.label}: ${picker.validationMessage}`);
    }
  });

  errors.value = errorList;

  if (allValid) {
    console.log('所有校验通过，提交表单');
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: var(--sl-spacing-medium);
  max-width: 300px;
}
.errors {
  margin-top: var(--sl-spacing-medium);
  padding: var(--sl-spacing-medium);
  background: var(--sl-color-danger-50);
  border: 1px solid var(--sl-color-danger-200);
  border-radius: var(--sl-border-radius-medium);
}
.errors h4 {
  margin: 0 0 var(--sl-spacing-x-small) 0;
  color: var(--sl-color-danger-600);
  font-size: var(--sl-font-size-small);
}
.error-item {
  color: var(--sl-color-danger-600);
  font-size: 13px;
  margin-bottom: var(--sl-spacing-2x-small);
}
</style>
```

---

### 示例5：checkValidity 静默校验

使用 `checkValidity()` 进行不显示 UI 提示的静默校验。

```vue
<template>
  <div class="form-group">
    <sl-datepicker
      ref="pickerRef"
      label="会议日期"
      required
      placeholder="请选择会议日期"
      @sl-change="handleChange"
    ></sl-datepicker>
  </div>
  <div class="actions">
    <sl-button variant="primary" @click="silentCheck">静默校验 (checkValidity)</sl-button>
    <sl-button variant="default" @click="reportCheck">UI 校验 (reportValidity)</sl-button>
  </div>
  <div v-if="checkResult" class="result">
    校验结果: {{ checkResult }}
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const pickerRef = ref(null);
const checkResult = ref('');

function handleChange() {
  checkResult.value = '';
}

function silentCheck() {
  // checkValidity 不会显示 UI 提示
  const isValid = pickerRef.value.checkValidity();
  checkResult.value = isValid
    ? '有效（checkValidity 不会显示提示框）'
    : '无效（checkValidity 不会显示提示框）';
}

function reportCheck() {
  // reportValidity 会显示 UI 提示
  const isValid = pickerRef.value.reportValidity();
  checkResult.value = isValid
    ? '有效（reportValidity 已显示/隐藏提示）'
    : '无效（reportValidity 已显示提示）';
}
</script>

<style scoped>
.form-group {
  margin-bottom: var(--sl-spacing-medium);
  max-width: 300px;
}
.actions {
  display: flex;
  gap: var(--sl-spacing-x-small);
  margin-bottom: var(--sl-spacing-medium);
}
.result {
  padding: var(--sl-spacing-small);
  background: var(--sl-color-neutral-100);
  border-radius: var(--sl-border-radius-medium);
  font-size: var(--sl-font-size-small);
  font-family: monospace;
}
</style>
```

---

## 注意事项

1. **required 校验时机**：`required` 校验在调用 `reportValidity()` 或表单 `submit` 时触发，不会在输入过程中实时触发
2. **setCustomValidity 使用**：设置自定义消息后需调用 `reportValidity()` 才会显示；传入空字符串 `''` 清除错误
3. **Vue 方法调用**：所有校验方法（`checkValidity`、`reportValidity`、`setCustomValidity`）均需通过 `ref` 获取实例后调用
4. **min/max 是输入级校验**：`min/max` 范围之外的日期在日历面板中被禁用，但通过输入框键入的超范围值会在失焦时回退
5. **清除时的校验**：清除值后再次校验会触发 `required` 的必填校验
6. **validity 属性**：`validity` 是只读的 `ValidityState` 对象，包含 `valid`、`valueMissing` 等标准属性

[返回目录](../index.md)
