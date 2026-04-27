# 日期范围限制

[返回目录](../index.md)

## 功能说明

通过 `min` 和 `max` 属性限制用户可选择的日期范围。超出范围的日期在日历面板中会被禁用（灰色不可点击），通过输入框输入的超范围日期也会被视为无效值。

## API 属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `min` | 最小可选日期 | `string` | `'0001-01-01'` |
| `max` | 最大可选日期 | `string` | `'9999-12-31'` |

### 格式要求

- `min` 和 `max` 的值格式为 `yyyy-MM-dd`（如 `2024-01-01`）
- 支持 `-`、`/`、`.` 分隔符
- 超出范围的日期在日历中显示为禁用状态

---

## 代码示例

### 示例1：设置最小日期

限制用户只能选择今天及之后的日期。

```vue
<template>
  <sl-datepicker
    label="预约日期"
    :min="today"
    placeholder="只能选择今天及之后"
    :helpText="`最早可选日期: ${today}`"
    @sl-change="handleChange"
  ></sl-datepicker>
  <div v-if="selectedDate" class="result">
    选中日期: {{ selectedDate }}
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

const selectedDate = ref('');

const today = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

function handleChange(event) {
  selectedDate.value = event.target.value;
}
</script>

<style scoped>
.result {
  margin-top: var(--sl-spacing-small);
  padding: var(--sl-spacing-small);
  background: var(--sl-color-success-100);
  border-radius: var(--sl-border-radius-medium);
  font-size: var(--sl-font-size-small);
}
</style>
```

---

### 示例2：设置最大日期

限制用户只能选择今天及之前的日期（例如出生日期场景）。

```vue
<template>
  <sl-datepicker
    label="出生日期"
    :max="today"
    placeholder="请选择出生日期"
    helpText="不能选择未来的日期"
  ></sl-datepicker>
</template>

<script setup>
import { computed } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

const today = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});
</script>
```

---

### 示例3：设置日期区间

同时使用 `min` 和 `max` 限定一个日期范围。

```vue
<template>
  <sl-datepicker
    label="活动报名日期"
    min="2024-03-01"
    max="2024-03-31"
    placeholder="请选择 3 月份的日期"
    helpText="报名时间：2024年3月1日 至 2024年3月31日"
    @sl-change="handleChange"
  ></sl-datepicker>
  <div v-if="selectedDate" class="result">
    报名日期: {{ selectedDate }}
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

const selectedDate = ref('');

function handleChange(event) {
  selectedDate.value = event.target.value;
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

### 示例4：关联日期选择器（开始/结束日期）

两个日期选择器联动，开始日期限制结束日期的最小值，结束日期限制开始日期的最大值。

```vue
<template>
  <div class="date-range-group">
    <sl-datepicker
      label="开始日期"
      :max="endDate"
      placeholder="选择开始日期"
      :value="startDate"
      @sl-change="handleStartChange"
    ></sl-datepicker>

    <span class="separator">至</span>

    <sl-datepicker
      label="结束日期"
      :min="startDate"
      placeholder="选择结束日期"
      :value="endDate"
      @sl-change="handleEndChange"
    ></sl-datepicker>
  </div>
  <div v-if="rangeText" class="result">
    选择的日期范围: {{ rangeText }}
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

const startDate = ref('');
const endDate = ref('');

const rangeText = computed(() => {
  if (startDate.value && endDate.value) return `${startDate.value} 至 ${endDate.value}`;
  if (startDate.value) return `${startDate.value} 至 ...`;
  if (endDate.value) return `... 至 ${endDate.value}`;
  return '';
});

function handleStartChange(event) {
  startDate.value = event.target.value;
}

function handleEndChange(event) {
  endDate.value = event.target.value;
}
</script>

<style scoped>
.date-range-group {
  display: flex;
  align-items: flex-end;
  gap: var(--sl-spacing-small);
}
.separator {
  padding-bottom: var(--sl-spacing-x-small);
  color: var(--sl-color-neutral-500);
  font-size: var(--sl-font-size-small);
}
.result {
  margin-top: var(--sl-spacing-medium);
  padding: var(--sl-spacing-small);
  background: var(--sl-color-primary-100);
  border-radius: var(--sl-border-radius-medium);
  font-size: var(--sl-font-size-small);
}
</style>
```

---

## 注意事项

1. **min/max 格式**：`min` 和 `max` 的值格式为 `yyyy-MM-dd`，不包含时间部分（即使在 `datetime` 模式下也是按日期维度限制）
2. **禁用效果**：超出范围的日期在日历面板中显示为灰色禁用状态，无法点击
3. **输入验证**：通过输入框键入的超出范围日期会被视为无效值，失焦时回退到上一有效值
4. **"今天"按钮**：日历面板底部的"今天"快捷按钮在今天日期不在 min/max 范围内时也会被禁用
5. **动态更新**：修改 `:min` 或 `:max` 后，日历面板会自动更新禁用状态

[返回目录](../index.md)
