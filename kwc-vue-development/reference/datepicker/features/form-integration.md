# 表单集成

[返回目录](../index.md)

## 功能说明

`sl-datepicker` 实现了表单控件接口，可以无缝集成到原生 HTML 表单中。支持 `name`、`required`、`form` 等标准表单属性，以及 `checkValidity()`、`reportValidity()` 等表单校验方法。在 Vue 中，调用组件方法需要通过 `ref` 获取组件实例。

## API 属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `name` | 表单字段名 | `string` | `''` |
| `value` | 表单提交值 | `string` | `''` |
| `required` | 是否必填 | `boolean` | `false` |
| `form` | 关联表单的 ID | `string` | `''` |
| `disabled` | 禁用（不参与表单提交） | `boolean` | `false` |

### 表单方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `checkValidity()` | 校验是否有效 | `boolean` |
| `reportValidity()` | 校验并显示提示 | `boolean` |
| `setCustomValidity(message)` | 设置自定义校验消息 | `void` |
| `getForm()` | 获取关联的表单元素 | `HTMLFormElement \| null` |

---

## 代码示例

### 示例1：基础表单提交

Datepicker 配合表单使用，通过 `name` 属性设置表单字段名。

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <sl-datepicker
        name="birthday"
        label="出生日期"
        required
        placeholder="请选择出生日期"
      ></sl-datepicker>
    </div>
    <div class="form-group">
      <sl-datepicker
        name="joinDate"
        label="入职日期"
        placeholder="请选择入职日期"
      ></sl-datepicker>
    </div>
    <div class="form-actions">
      <sl-button type="submit" variant="primary">提交</sl-button>
      <sl-button type="reset" variant="default">重置</sl-button>
    </div>
  </form>
  <div v-if="submitResult" class="result">
    提交数据: {{ submitResult }}
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const submitResult = ref('');

function handleSubmit(event) {
  const form = event.target;
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  submitResult.value = JSON.stringify(data, null, 2);
}
</script>

<style scoped>
.form-group {
  margin-bottom: var(--sl-spacing-medium);
  max-width: 300px;
}
.form-actions {
  display: flex;
  gap: var(--sl-spacing-x-small);
  margin-top: 24px;
}
.result {
  margin-top: var(--sl-spacing-medium);
  padding: var(--sl-spacing-small);
  background: var(--sl-color-neutral-100);
  border-radius: var(--sl-border-radius-medium);
  font-family: monospace;
  font-size: var(--sl-font-size-small);
  white-space: pre;
}
</style>
```

---

### 示例2：必填校验

设置 `required` 属性后，表单提交时会自动校验。通过 `ref` 获取组件实例调用 `reportValidity()`。

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <sl-datepicker
        ref="startDateRef"
        name="startDate"
        label="项目开始日期"
        required
        placeholder="必填项"
        helpText="此字段为必填"
      ></sl-datepicker>
    </div>
    <div class="form-group">
      <sl-datepicker
        ref="endDateRef"
        name="endDate"
        label="项目结束日期"
        placeholder="选填项"
        helpText="此字段为选填"
      ></sl-datepicker>
    </div>
    <sl-button type="submit" variant="primary">提交</sl-button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const startDateRef = ref(null);
const endDateRef = ref(null);

function handleSubmit() {
  const pickers = [startDateRef.value, endDateRef.value].filter(Boolean);
  let isValid = true;

  pickers.forEach(picker => {
    if (!picker.reportValidity()) {
      isValid = false;
    }
  });

  if (isValid) {
    console.log('表单校验通过，提交数据');
  }
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

### 示例3：通过 form 属性关联外部表单

使用 `form` 属性将 Datepicker 关联到不在其 DOM 层级内的表单。

```vue
<template>
  <form id="myForm" @submit.prevent="handleSubmit">
    <div class="form-group">
      <sl-input name="username" label="用户名" placeholder="请输入用户名"></sl-input>
    </div>
    <sl-button type="submit" variant="primary">提交</sl-button>
  </form>

  <!-- datepicker 在 form 标签外部，通过 form 属性关联 -->
  <div class="external-field">
    <sl-datepicker
      name="eventDate"
      label="活动日期（外部字段）"
      form="myForm"
      placeholder="此字段通过 form 属性关联到上方表单"
    ></sl-datepicker>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/input/input.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

function handleSubmit(event) {
  const formData = new FormData(event.target);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  console.log('提交数据:', data);
}
</script>

<style scoped>
.form-group {
  margin-bottom: var(--sl-spacing-medium);
  max-width: 300px;
}
.external-field {
  margin-top: 24px;
  padding: var(--sl-spacing-medium);
  background: var(--sl-color-neutral-50);
  border: 1px dashed var(--sl-color-neutral-300);
  border-radius: var(--sl-border-radius-medium);
  max-width: 300px;
}
</style>
```

---

### 示例4：程序化校验

通过 `ref` 获取组件实例，调用校验方法进行程序化校验。

```vue
<template>
  <div class="form-group">
    <sl-datepicker
      ref="pickerRef"
      label="交付日期"
      required
      placeholder="请选择交付日期"
      @sl-change="handleDateChange"
    ></sl-datepicker>
  </div>
  <div class="actions">
    <sl-button variant="primary" @click="validate">校验</sl-button>
    <sl-button variant="default" @click="resetValidation">重置校验</sl-button>
  </div>
  <div v-if="validationMessage" :class="['result', isValid ? 'result-success' : 'result-error']">
    {{ validationMessage }}
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const pickerRef = ref(null);
const validationMessage = ref('');
const isValid = ref(false);

function handleDateChange(event) {
  const value = event.target.value;
  if (value) {
    pickerRef.value.setCustomValidity('');
    validationMessage.value = '';
  }
}

function validate() {
  const picker = pickerRef.value;

  if (!picker.value) {
    picker.setCustomValidity('请选择一个有效的交付日期');
    picker.reportValidity();
    validationMessage.value = '校验失败：请选择交付日期';
    isValid.value = false;
    return;
  }

  // 自定义业务校验：不能选周末
  const date = new Date(picker.value);
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    picker.setCustomValidity('交付日期不能是周末');
    picker.reportValidity();
    validationMessage.value = '校验失败：不能选择周末';
    isValid.value = false;
    return;
  }

  picker.setCustomValidity('');
  validationMessage.value = '校验通过';
  isValid.value = true;
}

function resetValidation() {
  pickerRef.value.setCustomValidity('');
  validationMessage.value = '';
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
  border-radius: var(--sl-border-radius-medium);
  font-size: var(--sl-font-size-small);
}
.result-success {
  background: var(--sl-color-success-100);
  border: 1px solid var(--sl-color-success-300);
  color: var(--sl-color-success-600);
}
.result-error {
  background: var(--sl-color-danger-50);
  border: 1px solid var(--sl-color-danger-200);
  color: var(--sl-color-danger-600);
}
</style>
```

---

## 注意事项

1. **name 属性**：设置 `name` 后，Datepicker 的值才会包含在 FormData 中
2. **disabled 不提交**：禁用状态的 Datepicker 不参与表单提交
3. **required 校验**：`required` 校验在 `reportValidity()` 或表单提交时触发，空值会提示必填
4. **自定义校验**：使用 `setCustomValidity(message)` 设置自定义错误信息，传入空字符串 `''` 清除校验错误
5. **Vue 方法调用**：调用 `reportValidity()`、`setCustomValidity()` 等方法需通过 `ref` 获取组件实例，如 `pickerRef.value.reportValidity()`
6. **表单重置**：原生表单的 `reset` 事件会将 Datepicker 恢复到 `defaultValue`

[返回目录](../index.md)
