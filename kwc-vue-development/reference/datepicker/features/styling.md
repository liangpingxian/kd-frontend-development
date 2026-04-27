# 样式定制

[返回目录](../index.md)

## 功能说明

`sl-datepicker` 提供多种样式定制方式：通过内置属性（`size`、`filled`、`pill`）快速切换外观风格，通过 Slots 自定义标签、前缀、后缀等内容，通过 CSS Parts 深度自定义组件各部分样式。

## API 属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `size` | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `filled` | 填充样式 | `boolean` | `false` |
| `pill` | 圆角药丸样式 | `boolean` | `false` |
| `hoist` | 弹出层提升到固定定位 | `boolean` | `false` |

### Slots

| Slot | 说明 |
|------|------|
| `label` | 自定义标签内容 |
| `prefix` | 输入框前缀 |
| `suffix` | 输入框后缀（默认为日历图标） |
| `clear-icon` | 自定义清除按钮图标 |
| `help-text` | 自定义帮助提示内容 |

### CSS Parts

| Part 名称 | 说明 |
|-----------|------|
| `input` | 输入框组件 |
| `popup` | 弹出面板 |
| `calendar` | 日历组件 |
| `calendar-base` | 日历基础容器 |
| `calendar-header` | 日历头部导航 |
| `calendar-nav-button` | 日历导航按钮 |
| `calendar-title` | 日历标题（年月） |
| `calendar-day` | 日期单元格 |
| `calendar-day-header` | 星期标题 |

---

## 代码示例

### 示例1：填充样式（filled）

使用 `filled` 属性为输入框应用填充背景样式。

```vue
<template>
  <div class="stack">
    <sl-datepicker
      label="默认样式"
      placeholder="默认外观"
    ></sl-datepicker>

    <sl-datepicker
      label="填充样式"
      filled
      placeholder="filled 外观"
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

### 示例2：药丸样式（pill）

使用 `pill` 属性为输入框应用圆角药丸样式。

```vue
<template>
  <div class="stack">
    <sl-datepicker
      label="默认圆角"
      placeholder="默认样式"
    ></sl-datepicker>

    <sl-datepicker
      label="药丸圆角"
      pill
      placeholder="pill 样式"
    ></sl-datepicker>

    <sl-datepicker
      label="填充 + 药丸"
      filled
      pill
      placeholder="filled + pill 样式"
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

### 示例3：自定义前缀 Slot

通过 `prefix` slot 在输入框前方添加自定义内容。

```vue
<template>
  <sl-datepicker
    label="带前缀的日期选择"
    placeholder="请选择日期"
  >
    <sl-icon slot="prefix" name="calendar-event"></sl-icon>
  </sl-datepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
</script>
```

---

### 示例4：自定义标签 Slot

通过 `label` slot 自定义标签内容，支持富文本。

```vue
<template>
  <sl-datepicker placeholder="请选择日期">
    <div slot="label" class="custom-label">
      <span>预约日期</span>
      <span class="required-badge">必填</span>
    </div>
  </sl-datepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
</script>

<style scoped>
.custom-label {
  display: flex;
  align-items: center;
  gap: var(--sl-spacing-x-small);
}
.required-badge {
  display: inline-block;
  padding: 0 6px;
  font-size: var(--sl-font-size-x-small);
  line-height: 20px;
  background: var(--sl-color-danger-600);
  color: white;
  border-radius: var(--sl-border-radius-medium);
}
</style>
```

---

### 示例5：自定义帮助文本 Slot

通过 `help-text` slot 自定义帮助提示内容。

```vue
<template>
  <sl-datepicker label="活动日期" placeholder="请选择活动日期">
    <div slot="help-text" class="custom-help">
      <sl-icon name="info-circle"></sl-icon>
      <span>格式: yyyy-MM-dd，如 2024-01-15</span>
    </div>
  </sl-datepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
</script>

<style scoped>
.custom-help {
  display: flex;
  align-items: center;
  gap: var(--sl-spacing-2x-small);
  color: var(--sl-color-neutral-500);
  font-size: var(--sl-font-size-x-small);
}
</style>
```

---

### 示例6：通过 CSS Parts 自定义样式

使用 `::part()` 选择器深度自定义组件内部样式。注意 CSS Parts 样式不能使用 `scoped`，需写在全局样式块中。

```vue
<template>
  <sl-datepicker
    class="custom-datepicker"
    label="自定义样式"
    placeholder="深度定制外观"
    value="2024-06-15"
  ></sl-datepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
</script>

<!-- 注意：::part() 不能加 scoped，需去掉 scoped 或单独写全局样式 -->
<style>
/* 自定义输入框样式 */
.custom-datepicker::part(input) {
  --sl-input-border-color: #722ed1;
  --sl-input-border-color-focus: #531dab;
}

/* 自定义日历选中日期样式 */
.custom-datepicker::part(calendar-day) {
  border-radius: 50%;
}

/* 自定义日历标题样式 */
.custom-datepicker::part(calendar-title) {
  color: #722ed1;
  font-weight: bold;
}

/* 自定义日历导航按钮样式 */
.custom-datepicker::part(calendar-nav-button) {
  color: #722ed1;
}
</style>
```

---

### 示例7：弹出层提升（hoist）

在模态框或滚动容器中使用时，设置 `hoist` 属性将弹出层提升到固定定位，避免被容器裁切。

```vue
<template>
  <div class="scroll-container">
    <div class="content">
      <sl-datepicker
        label="普通定位"
        placeholder="可能被容器裁切"
      ></sl-datepicker>
    </div>
  </div>

  <div class="scroll-container">
    <div class="content">
      <sl-datepicker
        label="提升定位（hoist）"
        hoist
        placeholder="弹出层不被裁切"
      ></sl-datepicker>
    </div>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
</script>

<style scoped>
.scroll-container {
  height: 120px;
  overflow: auto;
  border: 1px solid var(--sl-color-neutral-300);
  border-radius: var(--sl-border-radius-medium);
  margin-bottom: var(--sl-spacing-medium);
  padding: var(--sl-spacing-medium);
}
.content {
  min-height: 200px;
}
</style>
```

---

### 示例8：综合样式展示

组合使用多种样式属性。

```vue
<template>
  <div class="grid">
    <sl-datepicker size="small" placeholder="Small"></sl-datepicker>
    <sl-datepicker size="small" filled placeholder="Small Filled"></sl-datepicker>
    <sl-datepicker size="small" pill placeholder="Small Pill"></sl-datepicker>

    <sl-datepicker size="medium" placeholder="Medium"></sl-datepicker>
    <sl-datepicker size="medium" filled placeholder="Medium Filled"></sl-datepicker>
    <sl-datepicker size="medium" pill placeholder="Medium Pill"></sl-datepicker>

    <sl-datepicker size="large" placeholder="Large"></sl-datepicker>
    <sl-datepicker size="large" filled placeholder="Large Filled"></sl-datepicker>
    <sl-datepicker size="large" pill placeholder="Large Pill"></sl-datepicker>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sl-spacing-medium);
}
</style>
```

---

## 注意事项

1. **CSS Parts 作用范围**：`::part()` 选择器只能选中组件直接暴露的 part，不支持嵌套选择器
2. **CSS Parts 与 scoped**：`::part()` 样式不能写在 `<style scoped>` 中，需写全局样式（去掉 `scoped`）
3. **Slot 覆盖默认内容**：使用 `suffix` slot 会覆盖默认的日历图标，如需保留请手动添加
4. **filled 和 pill 可组合**：`filled` 和 `pill` 可以同时使用，产生填充 + 圆角效果
5. **hoist 的使用场景**：仅在弹出层被容器 `overflow: hidden/auto/scroll` 裁切时才需要设置 `hoist`
6. **size 影响整体**：`size` 属性会同时影响输入框高度和字体大小

[返回目录](../index.md)
