# Timepicker 时间选择器

输入或选择时间的控件，支持时、分、秒的滚动选择。

## 特性概览

- **弹出面板**：点击输入框弹出时间滚动面板（时/分/秒三列），桌面端使用 Popup，移动端自动切换为 Drawer
- **手动输入**：支持在输入框中直接键入时间值（格式 `HH:mm:ss`），输入合法时实时同步面板
- **自定义格式**：通过 `format` 属性控制时间格式，默认 `HH:mm:ss`
- **清除按钮**：默认启用清除按钮（`clearable` 默认为 `true`）
- **键盘操作**：支持 `Enter` 确认选择、`Escape` 关闭面板
- **表单集成**：实现标准表单控件接口，支持 `name`、`required`、`form` 等属性
- **响应式**：自动检测屏幕宽度，窄屏（<500px）自动切换移动端交互模式
- **多种样式**：支持 `filled`（填充）、`pill`（胶囊）、`size`（尺寸）等外观配置

## 基础用法

最简单的时间选择器用法，点击输入框即可打开时间面板。

```vue
<template>
  <sl-timepicker></sl-timepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
</script>
```

## 设置初始值

使用 `value` 属性设置初始时间值，格式为 `HH:mm:ss`。

```vue
<template>
  <sl-timepicker value="14:30:00"></sl-timepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
</script>
```

## 自定义格式（format）

通过 `format` 属性自定义时间的显示格式。格式化底层基于 [dayjs](https://day.js.org/docs/en/display/format) 实现，支持 dayjs 的时间格式化符号。`format` 仅影响输入框的显示文本，`value` 始终保持与 `format` 一致的格式。

### 支持的格式符号（dayjs）

| 符号 | 说明 | 示例 |
|------|------|------|
| `HH` | 24 小时制小时（补零） | `08`、`23` |
| `H` | 24 小时制小时（不补零） | `8`、`23` |
| `hh` | 12 小时制小时（补零） | `02`、`11` |
| `h` | 12 小时制小时（不补零） | `2`、`11` |
| `mm` | 分钟（补零） | `05`、`59` |
| `m` | 分钟（不补零） | `5`、`59` |
| `ss` | 秒（补零） | `00`、`59` |
| `s` | 秒（不补零） | `0`、`59` |
| `A` | 上午/下午（大写） | `AM`、`PM` |
| `a` | 上午/下午（小写） | `am`、`pm` |

### 常用格式示例

| 格式字符串 | 显示效果 | 说明 |
|-----------|---------|------|
| `HH:mm:ss` | `14:30:00` | 默认，24 小时制含秒 |
| `HH:mm` | `14:30` | 24 小时制不含秒 |
| `hh:mm:ss A` | `02:30:00 PM` | 12 小时制含秒 |
| `hh:mm A` | `02:30 PM` | 12 小时制不含秒 |
| `HH时mm分ss秒` | `14时30分00秒` | 中文格式 |
| `HH时mm分` | `14时30分` | 中文格式不含秒 |

### 仅显示时分（省略秒）

设置 `format="HH:mm"` 后，时间面板将只显示时和分两列，隐藏秒列。

```vue
<template>
  <sl-timepicker style="width: 230px" label="时分选择" format="HH:mm" placeholder="HH:mm"></sl-timepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
</script>
```

### 12 小时制

设置 `format="hh:mm:ss A"` 后，时间面板将以 12 小时制显示，并附带 AM/PM 选择。

```vue
<template>
  <sl-timepicker style="width: 230px" label="12 小时制" format="hh:mm:ss A" placeholder="hh:mm:ss AM/PM"></sl-timepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
</script>
```

### 12 小时制仅时分

```vue
<template>
  <sl-timepicker style="width: 230px" label="12 小时制（时分）" format="hh:mm A" placeholder="hh:mm AM/PM"></sl-timepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
</script>
```

### 中文格式

```vue
<template>
  <sl-timepicker style="width: 230px" label="中文时间格式" format="HH时mm分ss秒" placeholder="请选择时间"></sl-timepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
</script>
```

### 多种格式对比

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 16px; width: 230px">
    <sl-timepicker label="默认 (HH:mm:ss)" value="14:30:00"></sl-timepicker>
    <sl-timepicker label="时分 (HH:mm)" format="HH:mm" value="14:30:00"></sl-timepicker>
    <sl-timepicker label="12 小时制 (hh:mm A)" format="hh:mm A" value="14:30:00"></sl-timepicker>
    <sl-timepicker label="中文 (HH时mm分)" format="HH时mm分" value="14:30:00"></sl-timepicker>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
</script>
```

## 标签

使用 `label` 属性为选择器提供标签。若标签内需包含 HTML，请改用 `label` 插槽。

```vue
<template>
  <sl-timepicker label="选择时间"></sl-timepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
</script>
```

## 帮助文本

使用 `helpText` 属性为选择器添加描述性帮助文本。若帮助文本内需包含 HTML，请改用 `help-text` 插槽。

```vue
<template>
  <sl-timepicker
    label="会议时间"
    helpText="请选择会议开始时间"
  ></sl-timepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
</script>
```

## 占位符

使用 `placeholder` 属性添加占位文本。

```vue
<template>
  <sl-timepicker placeholder="HH:mm:ss"></sl-timepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
</script>
```

## 可清除

`clearable` 属性默认启用（`true`），当有值时会显示清除按钮。设置 `:clearable="false"` 可以隐藏清除按钮。

```vue
<template>
  <div class="timepicker-group">
    <sl-timepicker value="09:30:00" placeholder="默认可清除"></sl-timepicker>
    <sl-timepicker :clearable="false" value="09:30:00" placeholder="不可清除"></sl-timepicker>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
</script>

<style scoped>
.timepicker-group {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-small);
  width: 230px;
}
</style>
```

## 填充样式

添加 `filled` 属性可绘制填充样式的选择器。

```vue
<template>
  <sl-timepicker placeholder="Filled" filled></sl-timepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
</script>
```

## 胶囊样式

使用 `pill` 属性可为选择器设置椭圆圆角样式。

```vue
<template>
  <sl-timepicker placeholder="Pill" pill></sl-timepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
</script>
```

## 尺寸

使用 `size` 属性更改时间选择器的尺寸，支持 `small`、`medium`（默认）、`large`。

```vue
<template>
  <div class="timepicker-group">
    <sl-timepicker placeholder="Small" size="small"></sl-timepicker>
    <sl-timepicker placeholder="Medium" size="medium"></sl-timepicker>
    <sl-timepicker placeholder="Large" size="large"></sl-timepicker>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
</script>

<style scoped>
.timepicker-group {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
  width: 230px;
}
</style>
```

## 禁用

使用 `disabled` 属性禁用选择器，禁用后无法打开面板、无法输入。

```vue
<template>
  <sl-timepicker value="10:00:00" disabled></sl-timepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
</script>
```

## 只读

使用 `readonly` 属性设置只读状态，可以看到值但不能修改。

```vue
<template>
  <sl-timepicker value="10:00:00" readonly></sl-timepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
</script>
```

## 必填校验

使用 `required` 属性标记为必填，配合表单使用时可进行校验。

```vue
<template>
  <form class="time-form" @submit.prevent="handleSubmit">
    <sl-timepicker
      ref="timepickerRef"
      label="上班时间"
      required
      helpText="此字段为必填"
    ></sl-timepicker>
    <sl-button type="submit" variant="primary">提交</sl-button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const timepickerRef = ref(null);

function handleSubmit() {
  if (timepickerRef.value && timepickerRef.value.reportValidity()) {
    console.log('提交时间:', timepickerRef.value.value);
  }
}
</script>

<style scoped>
.time-form {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
  width: 230px;
}
</style>
```

## Hoist（提升定位）

当时间选择器位于溢出隐藏的容器中时，弹出面板可能被裁剪。添加 `hoist` 属性可使面板使用 `fixed` 定位策略脱离容器限制。

```vue
<template>
  <div class="overflow-container">
    <sl-timepicker placeholder="Hoisted" hoist></sl-timepicker>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
</script>

<style scoped>
.overflow-container {
  overflow: hidden;
  border: 1px solid var(--sl-color-neutral-300);
  padding: var(--sl-spacing-medium);
  height: 80px;
}
</style>
```

## 监听时间变化事件

通过 `@sl-change` 和 `@sl-input` 绑定事件获取时间值变化。

- `sl-change`：用户**确认提交**值的修改时触发（点击面板"确定"按钮、按 Enter、失焦时）
- `sl-input`：值**实时变化**时触发（用户在面板滚动选择时、在输入框中输入时）

```vue
<template>
  <div class="timepicker-demo">
    <div class="event-info">
      <p>当前值 (sl-change): <span>{{ changeValue }}</span></p>
      <p>实时值 (sl-input): <span>{{ inputValue }}</span></p>
    </div>
    <sl-timepicker
      placeholder="选择时间"
      @sl-change="handleChange"
      @sl-input="handleInput"
    ></sl-timepicker>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';

const changeValue = ref('-');
const inputValue = ref('-');

function handleChange(event) {
  changeValue.value = event.target.value || '-';
  console.log('sl-change:', event.target.value);
}

function handleInput(event) {
  inputValue.value = event.target.value || '-';
}
</script>

<style scoped>
.timepicker-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
  width: 280px;
}
.event-info {
  padding: var(--sl-spacing-small);
  background: var(--sl-color-neutral-100);
  border-radius: var(--sl-border-radius-medium);
}
.event-info p {
  margin: var(--sl-spacing-2x-small) 0;
  font-size: var(--sl-font-size-small);
}
</style>
```

## 监听焦点与清除事件

```vue
<template>
  <div class="timepicker-demo">
    <p class="event-log">最近事件: <span>{{ logText }}</span></p>
    <sl-timepicker
      value="08:00:00"
      @sl-focus="showLog('获得焦点 (sl-focus)')"
      @sl-blur="showLog('失去焦点 (sl-blur)')"
      @sl-clear="showLog('已清除 (sl-clear)')"
    ></sl-timepicker>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';

const logText = ref('无');

function showLog(text) {
  logText.value = text;
}
</script>

<style scoped>
.timepicker-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-small);
  width: 230px;
}
.event-log {
  font-size: var(--sl-font-size-small);
  color: var(--sl-color-neutral-600);
}
</style>
```

## 通过响应式数据动态设置值

通过 `ref` 响应式数据驱动时间选择器的值，符合 Vue 3 数据驱动视图的开发理念。

```vue
<template>
  <div class="timepicker-demo">
    <div class="controls">
      <sl-button size="small" @click="setMorning">设为上午9点</sl-button>
      <sl-button size="small" @click="setNoon">设为中午12点</sl-button>
      <sl-button size="small" @click="clearTime">清空</sl-button>
    </div>
    <sl-timepicker
      :value="timeValue"
      placeholder="选择时间"
      @sl-change="handleChange"
    ></sl-timepicker>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const timeValue = ref('');

function setMorning() {
  timeValue.value = '09:00:00';
}

function setNoon() {
  timeValue.value = '12:00:00';
}

function clearTime() {
  timeValue.value = '';
}

function handleChange(event) {
  timeValue.value = event.target.value;
}
</script>

<style scoped>
.timepicker-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
  width: 280px;
}
.controls {
  display: flex;
  gap: var(--sl-spacing-x-small);
}
</style>
```

## 自定义校验

使用 `setCustomValidity()` 方法设置自定义校验消息，实现业务逻辑校验。

```vue
<template>
  <div class="timepicker-demo">
    <sl-timepicker
      ref="pickerRef"
      label="工作时间"
      helpText="仅允许选择 09:00 - 18:00 之间的时间"
      @sl-change="onChangeResetValidity"
    ></sl-timepicker>
    <sl-button variant="primary" size="small" @click="validate">校验</sl-button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const pickerRef = ref(null);

function onChangeResetValidity() {
  if (pickerRef.value) pickerRef.value.setCustomValidity('');
}

function validate() {
  const picker = pickerRef.value;
  if (!picker) return;
  const val = picker.value;
  if (!val) {
    picker.setCustomValidity('请选择一个时间');
  } else if (val < '09:00:00' || val > '18:00:00') {
    picker.setCustomValidity('时间必须在 09:00 到 18:00 之间');
  } else {
    picker.setCustomValidity('');
  }
  picker.reportValidity();
}
</script>

<style scoped>
.timepicker-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-small);
  width: 280px;
}
</style>
```

## 多个时间选择器组合（时间范围）

组合两个时间选择器实现起止时间选择。

```vue
<template>
  <div class="time-range">
    <sl-timepicker
      ref="startPickerRef"
      label="开始时间"
      placeholder="开始"
      @sl-change="handleStartChange"
    ></sl-timepicker>
    <span class="range-separator">~</span>
    <sl-timepicker
      ref="endPickerRef"
      label="结束时间"
      placeholder="结束"
      @sl-change="handleEndChange"
    ></sl-timepicker>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';

const startPickerRef = ref(null);
const endPickerRef = ref(null);

function validateRange(startVal, endVal) {
  const endPicker = endPickerRef.value;
  if (!endPicker) return;

  if (startVal && endVal && endVal <= startVal) {
    endPicker.setCustomValidity('结束时间必须晚于开始时间');
    endPicker.reportValidity();
  } else {
    endPicker.setCustomValidity('');
  }
}

function handleStartChange(event) {
  const startVal = event.target.value;
  const endVal = endPickerRef.value?.value;
  validateRange(startVal, endVal);
}

function handleEndChange(event) {
  const startVal = startPickerRef.value?.value;
  const endVal = event.target.value;
  validateRange(startVal, endVal);
}
</script>

<style scoped>
.time-range {
  display: flex;
  align-items: flex-end;
  gap: var(--sl-spacing-x-small);
}
.range-separator {
  line-height: 40px;
  color: var(--sl-color-neutral-500);
}
</style>
```

## 使用插槽自定义前缀/后缀

通过 `prefix` 和 `suffix` 插槽自定义输入框的前缀和后缀内容。

```vue
<template>
  <sl-timepicker placeholder="选择时间">
    <sl-icon slot="prefix" name="alarm"></sl-icon>
  </sl-timepicker>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/timepicker/timepicker.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
</script>
```

## Properties

| 属性          | 描述                                                         | 类型                              | 默认值       |
| ------------- | ------------------------------------------------------------ | --------------------------------- | ------------ |
| value         | 时间选择器的当前值，格式由 `format` 决定，默认 `HH:mm:ss`。 | `string`                          | `''`         |
| format        | 时间格式字符串（基于 dayjs）。                               | `string`                          | `'HH:mm:ss'` |
| name          | 表单名称，随表单数据以"名称/值"对的形式提交。                | `string`                          | `''`         |
| placeholder   | 为空时的占位提示文本。                                       | `string`                          | `''`         |
| label         | 标签文本。                                                   | `string`                          | `''`         |
| helpText     | 辅助说明文本。                                               | `string`                          | `''`         |
| size          | 时间选择器的尺寸。                                           | `'small' \| 'medium' \| 'large'`  | `'medium'`   |
| filled        | 是否使用填充样式。                                           | `boolean`                         | `false`      |
| pill          | 是否为圆角胶囊样式。                                         | `boolean`                         | `false`      |
| clearable     | 是否显示清除按钮（当有值时）。                               | `boolean`                         | `true`       |
| disabled      | 是否禁用输入。                                               | `boolean`                         | `false`      |
| readonly      | 是否为只读状态。                                             | `boolean`                         | `false`      |
| required      | 是否为必填项。                                               | `boolean`                         | `false`      |
| hoist         | 是否使用 `fixed` 定位策略提升弹出面板，避免被溢出容器裁剪。  | `boolean`                         | `false`      |
| form          | 关联的表单 ID。                                              | `string`                          | `''`         |
| autofocus     | 是否自动获取焦点。                                           | `boolean`                         | `false`      |

## Slots

| 名称       | 描述                                            |
| ---------- | ----------------------------------------------- |
| label      | 时间选择器的标签。也可以使用 `label` 属性。     |
| prefix     | 在输入框前部添加图标或元素。                    |
| suffix     | 在输入框后部添加图标或元素（默认显示时钟图标）。|
| clear-icon | 自定义清除按钮的图标。                          |
| help-text  | 辅助说明文字。也可以使用 `helpText` 属性。     |

## Events

| 事件名称   | 描述                                                                               |
| ---------- | ---------------------------------------------------------------------------------- |
| sl-change  | 当用户确认值的修改时触发（点击"确定"按钮、按 Enter 键、输入框失焦时）。            |
| sl-input   | 当值实时变化时触发（用户在面板中滚动选择时、在输入框中输入合法时间时）。            |
| sl-focus   | 当控件获得焦点时触发。                                                             |
| sl-blur    | 当控件失去焦点时触发。                                                             |
| sl-clear   | 当清除按钮被激活时触发。                                                           |

### 事件绑定方式

在 Vue 模板中，使用 `@sl-*` 语法绑定 Shoelace 自定义事件，通过 `event.target.value` 获取值：

```vue
<sl-timepicker @sl-change="handleChange" @sl-input="handleInput"></sl-timepicker>
```

```js
function handleChange(event) {
  console.log('确认选择的时间:', event.target.value);
}

function handleInput(event) {
  console.log('实时变化的时间:', event.target.value);
}
```

### sl-change 和 sl-input 的区别

- `sl-input`：在用户每次滚动面板选择或输入合法时间时即触发（实时变化），适合做预览、联动等
- `sl-change`：仅在用户确认提交值时触发（点击确定、按 Enter、失焦），适合做最终的数据保存和业务逻辑处理

## Methods

| 方法                | 描述                                     | 参数                  |
| ------------------- | ---------------------------------------- | --------------------- |
| focus()             | 使时间选择器获得焦点并打开面板。         | options: FocusOptions |
| blur()              | 使时间选择器失去焦点并关闭面板。         | -                     |
| checkValidity()     | 检查有效性但不显示消息。                 | -                     |
| getForm()           | 获取关联的表单元素。                     | -                     |
| reportValidity()    | 检查有效性并在无效时显示浏览器原生消息。 | -                     |
| setCustomValidity() | 设置自定义校验消息。传空字符串清除校验。 | message: string       |

## Parts

| 名称                        | 描述                         |
| --------------------------- | ---------------------------- |
| input                       | 内部输入框元素。             |
| popup                       | 弹出面板容器（桌面端）。     |
| panel                       | 时间面板。                   |
| time-panel-base             | 时间面板基础容器。           |
| time-panel-header           | 时间面板头部（显示当前时间）。|
| time-panel-columns          | 时间面板滚动列容器。         |
| time-panel-column           | 时间面板单列（时/分/秒）。   |
| time-panel-hour             | 小时列。                     |
| time-panel-minute           | 分钟列。                     |
| time-panel-second           | 秒列。                       |
| time-panel-item             | 时间面板中的单个时间项。     |
| time-panel-footer           | 时间面板底部（确定按钮）。   |

## 值格式说明

时间值必须为 `HH:mm:ss` 格式字符串（24 小时制，两位补零）：

```js
// 正确
picker.value = '09:05:00';
picker.value = '23:59:59';
picker.value = '';  // 清空

// 错误
picker.value = '9:5:0';     // 不补零
picker.value = '09:05';     // 缺少秒
picker.value = '2:30 PM';   // 12 小时制
```

## 交互行为说明

### 桌面端
- **打开面板**：点击输入框或尾部时钟图标打开时间面板（Popup 定位于输入框下方）
- **滚动选择**：面板包含时/分/秒三列，鼠标悬停列可滚动，点击项即选中
- **确认选择**：点击面板底部"确定"按钮或按 `Enter` 键确认选择并关闭面板
- **取消选择**：按 `Escape` 键或点击面板外部区域关闭面板，值回退到上次有效值
- **手动输入**：在输入框中直接键入 `HH:mm:ss` 格式时间，输入合法时实时同步面板

### 移动端（屏幕宽度 < 500px）
- 自动切换为 Drawer 抽屉模式
- 输入框变为只读，点击后弹出抽屉面板
- 抽屉面板包含"确定"、"取消"、"清除"操作按钮
