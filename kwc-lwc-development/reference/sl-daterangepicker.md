# Daterangepicker 日期范围选择器

选择一个日期或日期时间范围的控件，支持双日历面板联动、手动输入、范围校验。

## 特性概览

- **双日历面板**：`type="date"` 模式下左右两个日历面板联动，分别显示相邻月份
- **日期时间模式**：`type="datetime"` 模式下显示单日历 + 时间滚动面板，选择后需点击"确定"提交
- **手动输入**：支持在输入框中直接键入日期值（格式 `YYYY-MM-DD` 或 `YYYY-MM-DD HH:mm:ss`），输入合法时实时同步面板
- **范围校验**：自动校验起止日期顺序，非法输入自动回退到上次有效值
- **清除按钮**：默认启用清除按钮（`clearable` 默认为 `true`）
- **键盘操作**：支持 `Enter` 确认选择、`Escape` 关闭面板并回退值
- **表单集成**：实现标准表单控件接口，支持 `name`、`required` 等属性，表单提交时拆分为 `${name}-start` 和 `${name}-end`
- **多种样式**：支持 `filled`（填充）、`pill`（胶囊）、`size`（尺寸）等外观配置
- **min/max 限制**：通过 `min` 和 `max` 属性限制可选日期范围

## 基础用法

最简单的日期范围选择器用法，点击输入框即可打开双日历面板。

```html
<template>
  <sl-daterangepicker kwc:external class="daterange-el" label="日期范围" style="width: 400px"></sl-daterangepicker>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerBasic extends KingdeeElement {}
```

## 设置初始值

使用 `value` 属性设置初始日期范围。HTML attribute 格式为 `YYYY-MM-DD ~ YYYY-MM-DD`，通过 JavaScript 设置时传入 `[Date, Date]` 数组。

```html
<template>
  <sl-daterangepicker
    kwc:external
    class="daterange-el"
    label="默认值"
    style="width: 400px"
    value="2025-01-01 ~ 2025-06-30"
  ></sl-daterangepicker>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerInitialValue extends KingdeeElement {}
```

## 标签

使用 `label` 属性为选择器提供标签。若标签内需包含 HTML，请改用 `label` 插槽。

```html
<template>
  <sl-daterangepicker kwc:external class="daterange-el" label="选择日期范围" style="width: 400px"></sl-daterangepicker>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerLabel extends KingdeeElement {}
```

## 帮助文本

使用 `help-text` 属性为选择器添加描述性帮助文本。若帮助文本内需包含 HTML，请改用 `help-text` 插槽。

```html
<template>
  <sl-daterangepicker
    kwc:external
    class="daterange-el"
    label="入住退房"
    help-text="请选择入住和退房日期"
    style="width: 400px"
  ></sl-daterangepicker>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerHelpText extends KingdeeElement {}
```

## 占位符

使用 `placeholder` 属性设置两个输入框的占位文本。HTML attribute 格式为逗号分隔的字符串，通过 JavaScript 设置时传入 `[string, string]` 数组。

```html
<template>
  <sl-daterangepicker
    kwc:external
    class="daterange-el"
    label="自定义占位符"
    placeholder="Check-in,Check-out"
    style="width: 400px"
  ></sl-daterangepicker>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerPlaceholder extends KingdeeElement {}
```

## 可清除

`clearable` 属性默认启用（`true`），当有值时会显示清除按钮。设置 `clearable` 为 `false` 可以隐藏清除按钮。

```html
<template>
  <div class="daterange-group">
    <sl-daterangepicker
      kwc:external
      class="daterange-clearable"
      value="2025-01-01 ~ 2025-06-30"
      label="默认可清除"
      style="width: 400px"
    ></sl-daterangepicker>
    <sl-daterangepicker
      kwc:external
      class="daterange-no-clear"
      value="2025-01-01 ~ 2025-06-30"
      label="不可清除"
      style="width: 400px"
    ></sl-daterangepicker>
  </div>
</template>
```

```css
.daterange-group {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-small);
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerClearable extends KingdeeElement {
  renderedCallback() {
    if (this._rendered) return;
    this._rendered = true;

    const noClear = this.template.querySelector('.daterange-no-clear');
    if (noClear) {
      noClear.clearable = false;
    }
  }
}
```

## 日期时间模式

使用 `type="datetime"` 启用日期时间选择模式。此模式下显示单个日历面板并附带时间滚动选择面板（时/分/秒三列），选择日期后面板不自动关闭，需点击"确定"按钮提交。

```html
<template>
  <sl-daterangepicker
    kwc:external
    class="daterange-el"
    label="日期时间范围"
    type="datetime"
    style="width: 500px"
  ></sl-daterangepicker>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerDatetime extends KingdeeElement {}
```

## 自定义格式（format）

通过 `format` 属性自定义日期在输入框中的显示格式。格式化底层基于 [dayjs](https://day.js.org/docs/en/display/format) 实现，支持 dayjs 的所有格式化符号。`format` 仅影响输入框的显示文本，`value`（`[Date | null, Date | null]`）不受影响。

### 支持的格式符号（dayjs）

| 符号 | 说明 | 示例 |
|------|------|------|
| `YYYY` | 四位年份 | `2024` |
| `YY` | 两位年份 | `24` |
| `MM` | 两位月份（补零） | `01`、`12` |
| `M` | 月份（不补零） | `1`、`12` |
| `DD` | 两位日期（补零） | `05`、`31` |
| `D` | 日期（不补零） | `5`、`31` |
| `HH` | 24 小时制小时（补零） | `08`、`23` |
| `hh` | 12 小时制小时（补零） | `02`、`11` |
| `mm` | 分钟（补零） | `05`、`59` |
| `ss` | 秒（补零） | `00`、`59` |
| `A` | 上午/下午（大写） | `AM`、`PM` |

### 常用格式示例

| 格式字符串 | 显示效果 | 说明 |
|-----------|---------|------|
| `YYYY-MM-DD` | `2025-01-01` | 默认格式 |
| `YYYY/MM/DD` | `2025/01/01` | 斜杠分隔 |
| `DD.MM.YYYY` | `01.01.2025` | 欧洲风格 |
| `MM-DD-YYYY` | `01-01-2025` | 美式风格 |
| `YYYY年MM月DD日` | `2025年01月01日` | 中文格式 |
| `YYYY-MM-DD HH:mm:ss` | `2025-01-01 08:00:00` | datetime 默认 |
| `YYYY/MM/DD HH:mm` | `2025/01/01 08:00` | datetime 省略秒 |

### 斜杠分隔格式

```html
<template>
  <sl-daterangepicker kwc:external class="daterange-el"
    label="斜杠格式"
    format="YYYY/MM/DD"
    style="width: 400px"
  ></sl-daterangepicker>
</template>
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerSlashFormat extends KingdeeElement {}
```

### 中文日期格式

```html
<template>
  <sl-daterangepicker kwc:external class="daterange-el"
    label="中文格式"
    format="YYYY年MM月DD日"
    style="width: 460px"
  ></sl-daterangepicker>
</template>
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerChineseFormat extends KingdeeElement {}
```

### 欧洲风格格式

```html
<template>
  <sl-daterangepicker kwc:external class="daterange-el"
    label="欧洲格式"
    format="DD.MM.YYYY"
    style="width: 400px"
  ></sl-daterangepicker>
</template>
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerEuropeanFormat extends KingdeeElement {}
```

### datetime 模式自定义格式

在 `type="datetime"` 模式下，`format` 应包含时间部分。

```html
<template>
  <sl-daterangepicker kwc:external class="daterange-el"
    label="自定义 datetime 格式"
    type="datetime"
    format="YYYY/MM/DD HH:mm"
    style="width: 500px"
  ></sl-daterangepicker>
</template>
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerDatetimeFormat extends KingdeeElement {}
```

### 多种格式对比

```html
<template>
  <div class="daterange-group">
    <sl-daterangepicker kwc:external class="dr-default"
      label="默认 (YYYY-MM-DD)"
      value="2025-01-01 ~ 2025-06-30"
      style="width: 400px"
    ></sl-daterangepicker>
    <sl-daterangepicker kwc:external class="dr-slash"
      label="斜杠 (YYYY/MM/DD)"
      format="YYYY/MM/DD"
      value="2025-01-01 ~ 2025-06-30"
      style="width: 400px"
    ></sl-daterangepicker>
    <sl-daterangepicker kwc:external class="dr-cn"
      label="中文 (YYYY年MM月DD日)"
      format="YYYY年MM月DD日"
      value="2025-01-01 ~ 2025-06-30"
      style="width: 460px"
    ></sl-daterangepicker>
    <sl-daterangepicker kwc:external class="dr-eu"
      label="欧洲 (DD.MM.YYYY)"
      format="DD.MM.YYYY"
      value="2025-01-01 ~ 2025-06-30"
      style="width: 400px"
    ></sl-daterangepicker>
  </div>
</template>
```
```css
.daterange-group {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
}
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerFormatComparison extends KingdeeElement {}
```

## 填充样式

添加 `filled` 属性可绘制填充样式的选择器。

```html
<template>
  <sl-daterangepicker kwc:external class="daterange-el" label="填充样式" filled style="width: 400px"></sl-daterangepicker>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerFilled extends KingdeeElement {}
```

## 胶囊样式

使用 `pill` 属性可为选择器设置椭圆圆角样式。

```html
<template>
  <sl-daterangepicker kwc:external class="daterange-el" label="胶囊样式" pill style="width: 400px"></sl-daterangepicker>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerPill extends KingdeeElement {}
```

## 尺寸

使用 `size` 属性更改选择器的尺寸，支持 `small`、`medium`（默认）、`large`。

```html
<template>
  <div class="daterange-group">
    <sl-daterangepicker kwc:external class="daterange-small" label="Small" size="small" style="width: 400px"></sl-daterangepicker>
    <sl-daterangepicker
      kwc:external
      class="daterange-medium"
      label="Medium"
      size="medium"
      style="width: 400px"
    ></sl-daterangepicker>
    <sl-daterangepicker kwc:external class="daterange-large" label="Large" size="large" style="width: 400px"></sl-daterangepicker>
  </div>
</template>
```

```css
.daterange-group {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerSize extends KingdeeElement {}
```

## 禁用

使用 `disabled` 属性禁用选择器，禁用后无法打开面板、无法输入。

```html
<template>
  <sl-daterangepicker
    kwc:external
    class="daterange-el"
    label="禁用状态"
    value="2025-01-01 ~ 2025-06-30"
    disabled
    style="width: 400px"
  ></sl-daterangepicker>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerDisabled extends KingdeeElement {}
```

## 只读

使用 `readonly` 属性设置只读状态，可以看到值但不能修改，面板不会弹出。

```html
<template>
  <sl-daterangepicker
    kwc:external
    class="daterange-el"
    label="只读状态"
    value="2025-01-01 ~ 2025-06-30"
    readonly
    style="width: 400px"
  ></sl-daterangepicker>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerReadonly extends KingdeeElement {}
```

## 最值范围

使用 `min` 和 `max` 属性限制可选日期范围，超出范围的日期将被禁用。

```html
<template>
  <sl-daterangepicker
    kwc:external
    class="daterange-el"
    label="限制范围"
    min="2025-01-01"
    max="2025-12-31"
    style="width: 400px"
  ></sl-daterangepicker>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerMinMax extends KingdeeElement {}
```

## 必填校验

使用 `required` 属性标记为必填，配合表单使用时可进行校验。

```html
<template>
  <form class="daterange-form">
    <sl-daterangepicker
      kwc:external
      class="daterange-el"
      label="项目周期"
      required
      help-text="此字段为必填"
      style="width: 400px"
    ></sl-daterangepicker>
    <sl-button kwc:external class="submit-btn" type="submit" variant="primary">提交</sl-button>
  </form>
</template>
```

```css
.daterange-form {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
  width: 400px;
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class DaterangepickerRequired extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindShoelaceEvents();
  }

  get shoelaceEventBindings() {
    return [['.daterange-form', 'submit', this.handleSubmit]];
  }

  bindShoelaceEvents() {
    this._boundHandlers = this.shoelaceEventBindings
      .map(([selector, event, handler]) => {
        const el = this.template.querySelector(selector);
        if (el) {
          const boundHandler = handler.bind(this);
          el.addEventListener(event, boundHandler);
          return { el, event, boundHandler };
        }
        return null;
      })
      .filter(Boolean);
  }

  handleSubmit(e) {
    e.preventDefault();
    const daterange = this.template.querySelector('.daterange-el');
    if (daterange && daterange.reportValidity()) {
      const [start, end] = daterange.value;
      console.log('提交范围:', start, '~', end);
    }
  }

  disconnectedCallback() {
    if (this._boundHandlers) {
      this._boundHandlers.forEach(({ el, event, boundHandler }) => {
        el.removeEventListener(event, boundHandler);
      });
      this._boundHandlers = [];
    }
    this._eventsBound = false;
  }
}
```

## 监听日期变化事件

通过监听 `sl-change` 和 `sl-input` 事件获取日期范围值变化。

- `sl-change`：用户**确认提交**值的修改时触发（选择完成关闭面板、清除值时）
- `sl-input`：值**实时变化**时触发（用户在面板中点选日期时、在输入框中输入时）

```html
<template>
  <div class="daterange-demo">
    <div class="event-info">
      <p>当前值 (sl-change): <span class="change-value">-</span></p>
      <p>实时值 (sl-input): <span class="input-value">-</span></p>
    </div>
    <sl-daterangepicker kwc:external class="daterange-el" label="选择日期范围" style="width: 400px"></sl-daterangepicker>
  </div>
</template>
```

```css
.daterange-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
  width: 400px;
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
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerEvent extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindShoelaceEvents();
  }

  get shoelaceEventBindings() {
    return [
      ['.daterange-el', 'sl-change', this.handleChange],
      ['.daterange-el', 'sl-input', this.handleInput]
    ];
  }

  bindShoelaceEvents() {
    this._boundHandlers = this.shoelaceEventBindings
      .map(([selector, event, handler]) => {
        const el = this.template.querySelector(selector);
        if (el) {
          const boundHandler = handler.bind(this);
          el.addEventListener(event, boundHandler);
          return { el, event, boundHandler };
        }
        return null;
      })
      .filter(Boolean);
  }

  handleChange(event) {
    const [start, end] = event.target.value;
    const el = this.template.querySelector('.change-value');
    if (el) {
      el.textContent = start && end ? `${start.toLocaleDateString()} ~ ${end.toLocaleDateString()}` : '-';
    }
    console.log('sl-change:', event.target.value);
  }

  handleInput(event) {
    const [start, end] = event.target.value;
    const el = this.template.querySelector('.input-value');
    if (el) {
      el.textContent = start && end ? `${start.toLocaleDateString()} ~ ${end.toLocaleDateString()}` : '-';
    }
  }

  disconnectedCallback() {
    if (this._boundHandlers) {
      this._boundHandlers.forEach(({ el, event, boundHandler }) => {
        el.removeEventListener(event, boundHandler);
      });
      this._boundHandlers = [];
    }
    this._eventsBound = false;
  }
}
```

## 监听焦点与清除事件

```html
<template>
  <div class="daterange-demo">
    <p class="event-log">最近事件: <span class="log-text">无</span></p>
    <sl-daterangepicker kwc:external class="daterange-el" value="2025-01-01 ~ 2025-06-30" style="width: 400px"></sl-daterangepicker>
  </div>
</template>
```

```css
.daterange-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-small);
  width: 400px;
}
.event-log {
  font-size: var(--sl-font-size-small);
  color: var(--sl-color-neutral-600);
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';

export default class DaterangepickerFocusBlur extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindShoelaceEvents();
  }

  get shoelaceEventBindings() {
    return [
      ['.daterange-el', 'sl-focus', () => this.showLog('获得焦点 (sl-focus)')],
      ['.daterange-el', 'sl-blur', () => this.showLog('失去焦点 (sl-blur)')],
      ['.daterange-el', 'sl-clear', () => this.showLog('已清除 (sl-clear)')]
    ];
  }

  bindShoelaceEvents() {
    this._boundHandlers = this.shoelaceEventBindings
      .map(([selector, event, handler]) => {
        const el = this.template.querySelector(selector);
        if (el) {
          const boundHandler = handler;
          el.addEventListener(event, boundHandler);
          return { el, event, boundHandler };
        }
        return null;
      })
      .filter(Boolean);
  }

  showLog(text) {
    const el = this.template.querySelector('.log-text');
    if (el) {
      el.textContent = text;
    }
  }

  disconnectedCallback() {
    if (this._boundHandlers) {
      this._boundHandlers.forEach(({ el, event, boundHandler }) => {
        el.removeEventListener(event, boundHandler);
      });
      this._boundHandlers = [];
    }
    this._eventsBound = false;
  }
}
```

## 通过 JavaScript 动态设置值

通过 JavaScript 动态读取和设置日期范围选择器的值。`value` 属性为 `[Date | null, Date | null]` 元组。

```html
<template>
  <div class="daterange-demo">
    <div class="controls">
      <sl-button kwc:external class="btn-this-month" size="small">本月</sl-button>
      <sl-button kwc:external class="btn-this-quarter" size="small">本季度</sl-button>
      <sl-button kwc:external class="btn-clear" size="small">清空</sl-button>
    </div>
    <sl-daterangepicker kwc:external class="daterange-el" label="日期范围" style="width: 400px"></sl-daterangepicker>
  </div>
</template>
```

```css
.daterange-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
  width: 400px;
}
.controls {
  display: flex;
  gap: var(--sl-spacing-x-small);
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class DaterangepickerDynamic extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindShoelaceEvents();
  }

  get shoelaceEventBindings() {
    return [
      ['.btn-this-month', 'click', this.handleThisMonth],
      ['.btn-this-quarter', 'click', this.handleThisQuarter],
      ['.btn-clear', 'click', this.handleClear]
    ];
  }

  bindShoelaceEvents() {
    this._boundHandlers = this.shoelaceEventBindings
      .map(([selector, event, handler]) => {
        const el = this.template.querySelector(selector);
        if (el) {
          const boundHandler = handler.bind(this);
          el.addEventListener(event, boundHandler);
          return { el, event, boundHandler };
        }
        return null;
      })
      .filter(Boolean);
  }

  handleThisMonth() {
    const picker = this.template.querySelector('.daterange-el');
    if (picker) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      picker.value = [start, end];
    }
  }

  handleThisQuarter() {
    const picker = this.template.querySelector('.daterange-el');
    if (picker) {
      const now = new Date();
      const quarterStart = Math.floor(now.getMonth() / 3) * 3;
      const start = new Date(now.getFullYear(), quarterStart, 1);
      const end = new Date(now.getFullYear(), quarterStart + 3, 0);
      picker.value = [start, end];
    }
  }

  handleClear() {
    const picker = this.template.querySelector('.daterange-el');
    if (picker) {
      picker.value = [null, null];
    }
  }

  disconnectedCallback() {
    if (this._boundHandlers) {
      this._boundHandlers.forEach(({ el, event, boundHandler }) => {
        el.removeEventListener(event, boundHandler);
      });
      this._boundHandlers = [];
    }
    this._eventsBound = false;
  }
}
```

## 自定义校验

使用 `setCustomValidity()` 方法设置自定义校验消息，实现业务逻辑校验。

```html
<template>
  <div class="daterange-demo">
    <sl-daterangepicker
      kwc:external
      class="daterange-el"
      label="项目周期"
      help-text="范围不能超过 30 天"
      style="width: 400px"
    ></sl-daterangepicker>
    <sl-button kwc:external class="btn-validate" variant="primary" size="small">校验</sl-button>
  </div>
</template>
```

```css
.daterange-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-small);
  width: 400px;
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class DaterangepickerValidation extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindShoelaceEvents();
  }

  get shoelaceEventBindings() {
    return [
      [
        '.daterange-el',
        'sl-change',
        () => {
          const picker = this.template.querySelector('.daterange-el');
          if (picker) {
            picker.setCustomValidity('');
          }
        }
      ],
      ['.btn-validate', 'click', this.handleValidateClick]
    ];
  }

  bindShoelaceEvents() {
    this._boundHandlers = this.shoelaceEventBindings
      .map(([selector, event, handler]) => {
        const el = this.template.querySelector(selector);
        if (el) {
          const boundHandler = handler;
          el.addEventListener(event, boundHandler);
          return { el, event, boundHandler };
        }
        return null;
      })
      .filter(Boolean);
  }

  handleValidateClick() {
    const picker = this.template.querySelector('.daterange-el');
    if (!picker) return;

    const [start, end] = picker.value;

    if (!start || !end) {
      picker.setCustomValidity('请选择完整的日期范围');
    } else {
      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 30) {
        picker.setCustomValidity('日期范围不能超过 30 天');
      } else {
        picker.setCustomValidity('');
      }
    }
    picker.reportValidity();
  }

  disconnectedCallback() {
    if (this._boundHandlers) {
      this._boundHandlers.forEach(({ el, event, boundHandler }) => {
        el.removeEventListener(event, boundHandler);
      });
      this._boundHandlers = [];
    }
    this._eventsBound = false;
  }
}
```

## 使用插槽自定义后缀图标

通过 `suffix` 插槽自定义输入框的后缀内容，默认显示日历图标。

```html
<template>
  <sl-daterangepicker kwc:external class="daterange-el" label="自定义后缀" style="width: 400px">
    <sl-icon kwc:external slot="suffix" name="calendar-event"></sl-icon>
  </sl-daterangepicker>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';

export default class DaterangepickerSlot extends KingdeeElement {}
```

## Properties

| 属性         | 描述                                                                                                       | 类型                             | 默认值                     |
| ------------ | ---------------------------------------------------------------------------------------------------------- | -------------------------------- | -------------------------- |
| value        | 当前值。HTML attribute 格式为 `YYYY-MM-DD ~ YYYY-MM-DD`；通过 JS 设置时为 `[Date \| null, Date \| null]`。 | `[Date \| null, Date \| null]`   | `[null, null]`             |
| type         | 选择器类型。`date` 为纯日期，`datetime` 为日期+时间。                                                      | `'date' \| 'datetime'`           | `'date'`                   |
| name         | 表单名称，实际提交为 `${name}-start` 和 `${name}-end` 两项。                                               | `string`                         | `''`                       |
| placeholder  | 两个输入框的占位符。HTML attribute 格式为 `开始,结束`；通过 JS 设置时为 `[string, string]`。               | `[string, string]`               | `['开始日期', '结束日期']` |
| label        | 标签文本。                                                                                                 | `string`                         | `''`                       |
| help-text    | 辅助说明文本。                                                                                             | `string`                         | `''`                       |
| size         | 选择器的尺寸。                                                                                             | `'small' \| 'medium' \| 'large'` | `'medium'`                 |
| filled       | 是否使用填充样式。                                                                                         | `boolean`                        | `false`                    |
| pill         | 是否为圆角胶囊样式。                                                                                       | `boolean`                        | `false`                    |
| clearable    | 是否显示清除按钮（当有值时）。                                                                             | `boolean`                        | `true`                     |
| disabled     | 是否禁用输入。                                                                                             | `boolean`                        | `false`                    |
| readonly     | 是否为只读状态（只读时不弹出面板）。                                                                       | `boolean`                        | `false`                    |
| required     | 是否为必填项。                                                                                             | `boolean`                        | `false`                    |
| min          | 最小允许日期（YYYY-MM-DD 格式）。                                                                          | `string`                         | `'0001-01-01'`             |
| max          | 最大允许日期（YYYY-MM-DD 格式）。                                                                          | `string`                         | `'9999-12-31'`             |
| format       | 日期格式字符串（基于 dayjs）。                                                                             | `string`                         | `'YYYY-MM-DD'`             |
| startDate    | 开始日期（仅通过 JS 设置/读取）。                                                                          | `Date \| null`                   | `null`                     |
| endDate      | 结束日期（仅通过 JS 设置/读取）。                                                                          | `Date \| null`                   | `null`                     |
| disabledDate | 自定义禁用日期的回调函数（仅通过 JS 设置）。                                                               | `(date: Date) => boolean`        | `undefined`                |

## Slots

| 名称      | 描述                                        |
| --------- | ------------------------------------------- |
| label     | 输入框的标签。也可以使用 `label` 属性。     |
| help-text | 辅助说明文字。也可以使用 `help-text` 属性。 |
| suffix    | 后缀图标区域（默认显示日历图标）。          |

## Events

| 事件名称   | 描述                                                             |
| ---------- | ---------------------------------------------------------------- |
| sl-change  | 当用户确认值的修改时触发（选择完成关闭面板、清除值时）。         |
| sl-input   | 当值实时变化时触发（用户在面板中点选日期时、在输入框中输入时）。 |
| sl-focus   | 当控件获得焦点时触发。                                           |
| sl-blur    | 当控件失去焦点时触发。                                           |
| sl-clear   | 当清除按钮被激活时触发。                                         |
| sl-invalid | 当表单控件校验失败时触发。                                       |

### 事件监听示例

**重要**：在 KWC LWC 中，Shoelace 的自定义事件（如 `sl-change`、`sl-input`）**必须**在 JavaScript 的 `renderedCallback` 中绑定，**禁止**在 HTML 模板中使用 `onsl-change` 这样的写法。

```javascript
// 正确方式：在 renderedCallback 中绑定事件
renderedCallback() {
  if (this._eventsBound) return;
  this._eventsBound = true;
  this.bindShoelaceEvents();
}

get shoelaceEventBindings() {
  return [
    ['.daterange-el', 'sl-change', this.handleChange],
    ['.daterange-el', 'sl-input', this.handleInput]
  ];
}

bindShoelaceEvents() {
  this._boundHandlers = this.shoelaceEventBindings.map(([selector, event, handler]) => {
    const el = this.template.querySelector(selector);
    if (el) {
      const boundHandler = handler.bind(this);
      el.addEventListener(event, boundHandler);
      return { el, event, boundHandler };
    }
    return null;
  }).filter(Boolean);
}

handleChange(event) {
  const [start, end] = event.target.value;
  console.log('确认选择的范围:', start, '~', end);
}

handleInput(event) {
  const [start, end] = event.target.value;
  console.log('实时变化的范围:', start, '~', end);
}

disconnectedCallback() {
  if (this._boundHandlers) {
    this._boundHandlers.forEach(({ el, event, boundHandler }) => {
      el.removeEventListener(event, boundHandler);
    });
    this._boundHandlers = [];
  }
  this._eventsBound = false;
}
```

## Methods

| 方法                | 描述                                     | 参数            |
| ------------------- | ---------------------------------------- | --------------- |
| checkValidity()     | 检查有效性但不显示消息。                 | -               |
| getForm()           | 获取关联的表单元素。                     | -               |
| reportValidity()    | 检查有效性并在无效时显示浏览器原生消息。 | -               |
| setCustomValidity() | 设置自定义校验消息。传空字符串清除校验。 | message: string |

## Parts

| 名称                   | 描述                                       |
| ---------------------- | ------------------------------------------ |
| form-control           | 包裹标签、输入框和帮助文本的表单控件容器。 |
| form-control-label     | 标签的包装器。                             |
| form-control-input     | 输入框的包装器。                           |
| form-control-help-text | 帮助文本的包装器。                         |
| base                   | 组件的基础包装器。                         |
| start-input            | 内部的开始日期 `<input>`。                 |
| end-input              | 内部的结束日期 `<input>`。                 |
| separator              | 两个输入框之间的分隔符 `~`。               |
| suffix                 | 包裹后缀图标的容器。                       |
| clear-button           | 清除按钮。                                 |
| popup                  | 包裹日历面板的弹层。                       |
| calendars              | 包裹日历面板的容器。                       |
| calendar-base          | 日历组件的基础包装器。                     |
| calendar-header        | 日历的头部区域。                           |
| calendar-nav-button    | 日历的导航按钮。                           |
| calendar-title         | 日历的标题。                               |
| calendar-title-year    | 日历标题中的年份部分。                     |
| calendar-title-month   | 日历标题中的月份部分。                     |
| calendar-body          | 日历的主体区域。                           |
| calendar-date-panel    | 日历的日期面板。                           |
| calendar-day-header    | 日历的星期标题。                           |
| calendar-day           | 日历中的日期单元格。                       |
| calendar-day-footer    | 日历日期面板的底部区域。                   |
| calendar-month-grid    | 月份选择网格。                             |
| calendar-month-item    | 月份选择项。                               |
| calendar-year-grid     | 年份选择网格。                             |
| calendar-year-item     | 年份选择项。                               |
| calendar-time-footer   | 日历时间选择的底部区域。                   |
| calendar-time-base     | 时间面板基础容器。                         |
| calendar-time-header   | 时间面板头部（显示当前时间）。             |
| calendar-time-columns  | 时间面板滚动列容器。                       |
| calendar-time-column   | 时间面板单列（时/分/秒）。                 |
| calendar-time-item     | 时间面板中的单个时间项。                   |

## 交互行为说明

### 桌面端

- **打开面板**：点击输入框或后缀日历图标打开日历面板（Popup 定位于输入框下方）
- **双日历联动**：`type="date"` 模式下显示左右两个日历面板，分别显示相邻月份，翻页时自动保持左 < 右的约束
- **选择流程**：点击开始日期 → 自动跳到结束日期输入框 → 点击结束日期 → 面板关闭并提交值
- **两步编辑**：当已有完整区间时重新打开面板，进入两步编辑模式，允许用户重新定义起点或终点
- **范围预览**：鼠标悬停日期时，实时预览选中范围的高亮效果
- **手动输入**：在输入框中直接键入 `YYYY-MM-DD` 格式日期，输入合法时实时同步面板
- **确认/取消**：按 `Enter` 确认当前输入，按 `Escape` 关闭面板并回退到上次有效值
- **面板外点击**：点击面板和输入框以外的区域自动关闭面板

### datetime 模式

- 显示单个日历面板 + 时间滚动面板（时/分/秒三列）
- 选择日期后面板不自动关闭，需点击"确定"按钮提交
- 输入框格式为 `YYYY-MM-DD HH:mm:ss`
- 焦点在开始/结束输入框之间切换时，日历面板同步切换显示对应日期

### 值校验

- `type="date"` 要求值匹配 `YYYY-MM-DD` 格式（支持 `-`、`.`、`/` 分隔符）
- `type="datetime"` 要求值匹配 `YYYY-MM-DD HH:mm:ss` 格式
- 非法输入不会更新 `value`，失焦或关闭面板时自动回退到上次有效值
- 起始日期不能晚于结束日期，否则自动清空另一端并引导重新选择
- `[null, null]` 视为合法值（清空状态）

### 日期禁用规则

1. 超出 `min`/`max` 范围的日期始终禁用
2. 已有完整区间且刚打开面板（未切换焦点）时，不禁用任何日期，允许自由重选
3. 选择开始日期时，晚于已选结束日期的日期被禁用
4. 选择结束日期时，早于已选开始日期的日期被禁用

## 最佳实践

### 1. 正确导入组件

```javascript
import '@kdcloudjs/shoelace/dist/components/daterangepicker/daterangepicker.js';
```

### 2. 添加 kwc:external 属性

在 HTML 模板中使用时，**必须**添加 `kwc:external` 属性：

```html
<!-- 正确 -->
<sl-daterangepicker kwc:external class="daterange-el"></sl-daterangepicker>

<!-- 错误：缺少 kwc:external -->
<sl-daterangepicker class="daterange-el"></sl-daterangepicker>
```

### 3. 使用 class 而非 id 选择器

```html
<!-- 正确 -->
<sl-daterangepicker kwc:external class="daterange-el"></sl-daterangepicker>

<!-- 错误 -->
<sl-daterangepicker kwc:external id="daterange-el"></sl-daterangepicker>
```

### 4. 在 renderedCallback 中绑定事件

```javascript
renderedCallback() {
  if (this._eventsBound) return;
  this._eventsBound = true;
  this.bindShoelaceEvents();
}

get shoelaceEventBindings() {
  return [
    ['.daterange-el', 'sl-change', this.handleChange]
  ];
}

bindShoelaceEvents() {
  this._boundHandlers = this.shoelaceEventBindings.map(([selector, event, handler]) => {
    const el = this.template.querySelector(selector);
    if (el) {
      const boundHandler = handler.bind(this);
      el.addEventListener(event, boundHandler);
      return { el, event, boundHandler };
    }
    return null;
  }).filter(Boolean);
}
```

### 5. 在 disconnectedCallback 中移除事件监听

```javascript
disconnectedCallback() {
  if (this._boundHandlers) {
    this._boundHandlers.forEach(({ el, event, boundHandler }) => {
      el.removeEventListener(event, boundHandler);
    });
    this._boundHandlers = [];
  }
  this._eventsBound = false;
}
```

### 6. 禁止在 HTML 模板中使用自闭合标签

```html
<!-- 正确 -->
<sl-daterangepicker kwc:external class="daterange-el"></sl-daterangepicker>

<!-- 错误：自闭合标签 -->
<sl-daterangepicker kwc:external class="daterange-el" />
```

### 7. 值格式说明

HTML attribute 值使用 `~` 分隔的字符串格式，JavaScript 值使用 `[Date | null, Date | null]` 元组：

```javascript
// HTML attribute 设置
// <sl-daterangepicker value="2025-01-01 ~ 2025-06-30"></sl-daterangepicker>

// JavaScript 设置
const picker = this.template.querySelector('.daterange-el');

// 正确
picker.value = [new Date(2025, 0, 1), new Date(2025, 5, 30)];
picker.value = [null, null]; // 清空

// 读取值
const [start, end] = picker.value;
// start: Date | null
// end: Date | null

// 也可以通过便捷属性读取
const startDate = picker.startDate; // Date | null
const endDate = picker.endDate; // Date | null
```

### 8. datetime 模式值格式

```javascript
// HTML attribute 设置（datetime 模式）
// <sl-daterangepicker type="datetime" value="2025-01-01 08:00:00 ~ 2025-06-30 18:00:00"></sl-daterangepicker>

// JavaScript 设置
const picker = this.template.querySelector('.daterange-el');
const start = new Date(2025, 0, 1, 8, 0, 0);
const end = new Date(2025, 5, 30, 18, 0, 0);
picker.value = [start, end];
```

## 常见问题

### Q: 为什么设置 value 后面板没有显示对应月份？

A: 确保 `value` 格式正确。HTML attribute 格式为 `YYYY-MM-DD ~ YYYY-MM-DD`（注意 `~` 两侧有空格）。通过 JavaScript 设置时传入 `[Date, Date]` 数组。非法格式的值会被组件忽略并清空。

### Q: 为什么日期变化事件没有触发？

A: 请确保在 `renderedCallback` 中通过 `addEventListener` 绑定了 `sl-change` 事件，并且添加了防重复绑定检查 (`if (this._eventsBound) return`)。**禁止**在 HTML 模板中绑定 `sl-change` 等 Shoelace 自定义事件。

### Q: sl-change 和 sl-input 有什么区别？

A: `sl-input` 在用户每次点选日期或输入合法日期时即触发（实时变化），适合做预览、联动等；`sl-change` 仅在用户确认提交值时触发（选择完成关闭面板、清除值），适合做最终的数据保存和业务逻辑处理。

### Q: 如何限制可选日期范围？

A: 使用 `min` 和 `max` 属性：`<sl-daterangepicker min="2025-01-01" max="2025-12-31"></sl-daterangepicker>`。超出范围的日期会被自动禁用。

### Q: 如何通过 JavaScript 读取当前选中的日期范围？

A: 直接访问 `value` 属性即可：

```javascript
const picker = this.template.querySelector('.daterange-el');
const [start, end] = picker.value;
// start: Date | null, end: Date | null

// 或使用便捷属性
const startDate = picker.startDate;
const endDate = picker.endDate;
```

### Q: datetime 模式下为什么选择日期后面板没有关闭？

A: 这是预期行为。`datetime` 模式下选择日期后需要继续选择时间，点击面板中的"确定"按钮才会提交选择并关闭面板（或跳转到下一个输入框）。

### Q: 如何自定义禁用特定日期？

A: 通过 JavaScript 设置 `disabledDate` 回调函数：

```javascript
const picker = this.template.querySelector('.daterange-el');
picker.disabledDate = date => {
  // 禁用周末
  const day = date.getDay();
  return day === 0 || day === 6;
};
```
