# 日期格式化

[返回目录](../index.md)

## 功能说明

通过 `format` 属性自定义日期在输入框中的显示格式。格式化底层基于 [dayjs](https://day.js.org/docs/en/display/format) 实现，支持 dayjs 的所有格式化符号。`format` 仅影响输入框中的显示文本，组件内部的 `value` 始终保持标准格式（`date` 模式为 `YYYY-MM-DD`，`datetime` 模式为 `YYYY-MM-DD HH:mm:ss`）。

## API 属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `format` | 日期显示格式（dayjs 格式字符串） | `string` | `'YYYY-MM-DD'`（date 模式）/ `'YYYY-MM-DD HH:mm:ss'`（datetime 模式） |

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
| `a` | 上午/下午（小写） | `am`、`pm` |
| `ddd` | 星期缩写 | `Mon`、`Tue` |
| `dddd` | 星期全称 | `Monday`、`Tuesday` |

> **注意**：dayjs 中年份使用大写 `YYYY`，日期使用大写 `DD`，与 Java/moment 的 `yyyy`、`dd` 不同。月份 `MM`、小时 `HH`、分钟 `mm`、秒 `ss` 保持一致。

### 常用格式示例

| 格式字符串 | 显示效果 |
|-----------|---------|
| `YYYY-MM-DD` | `2024-01-15`（默认） |
| `YYYY/MM/DD` | `2024/01/15` |
| `DD.MM.YYYY` | `15.01.2024` |
| `MM-DD-YYYY` | `01-15-2024` |
| `YYYY年MM月DD日` | `2024年01月15日` |
| `YYYY-MM-DD HH:mm:ss` | `2024-01-15 14:30:00`（datetime 默认） |
| `YYYY/MM/DD HH:mm` | `2024/01/15 14:30` |
| `YYYY-MM-DD hh:mm A` | `2024-01-15 02:30 PM` |

---

## 代码示例

### 示例1：基础格式化 - 斜杠分隔

使用 `format="YYYY/MM/DD"` 将日期显示为斜杠分隔格式。

**index.html**
```html
<template>
    <sl-datepicker kwc:external class="datepicker-el"
        label="斜杠格式"
        format="YYYY/MM/DD"
        placeholder="YYYY/MM/DD"
    ></sl-datepicker>
    <div class="result" kwc:if={selectedDate}>
        显示格式: {displayValue} | 实际 value: {selectedDate}
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

export default class SlashFormatDatepicker extends KingdeeElement {
    @track selectedDate = '';
    @track displayValue = '';

    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;
        const datepicker = this.template.querySelector('.datepicker-el');
        if (datepicker) {
            datepicker.addEventListener('sl-change', this.handleChange.bind(this));
        }
    }

    handleChange(event) {
        this.selectedDate = event.target.value;
        // value 始终为 YYYY-MM-DD 格式
        // 显示格式由 format 属性控制
        if (this.selectedDate) {
            const [y, m, d] = this.selectedDate.split('-');
            this.displayValue = `${y}/${m}/${d}`;
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

**index.css**
```css
.result {
    margin-top: var(--sl-spacing-small);
    padding: var(--sl-spacing-small);
    background: var(--sl-color-neutral-100);
    border-radius: var(--sl-border-radius-medium);
    font-size: var(--sl-font-size-small);
    color: var(--sl-color-neutral-600);
}
```

---

### 示例2：中文日期格式

使用 `format="YYYY年MM月DD日"` 将日期显示为中文格式。

**index.html**
```html
<template>
    <sl-datepicker kwc:external
        label="中文格式"
        format="YYYY年MM月DD日"
        placeholder="请选择日期"
    ></sl-datepicker>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

export default class ChineseFormatDatepicker extends KingdeeElement {}
```

---

### 示例3：点号分隔格式（欧洲风格）

使用 `format="DD.MM.YYYY"` 显示为日.月.年的欧洲常用格式。

**index.html**
```html
<template>
    <sl-datepicker kwc:external
        label="欧洲日期格式"
        format="DD.MM.YYYY"
        placeholder="DD.MM.YYYY"
    ></sl-datepicker>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

export default class EuropeanFormatDatepicker extends KingdeeElement {}
```

---

### 示例4：多种格式对比

并排展示不同格式的显示效果。

**index.html**
```html
<template>
    <div class="stack">
        <sl-datepicker kwc:external
            label="默认格式 (YYYY-MM-DD)"
            value="2024-06-15"
        ></sl-datepicker>

        <sl-datepicker kwc:external
            label="斜杠格式 (YYYY/MM/DD)"
            format="YYYY/MM/DD"
            value="2024-06-15"
        ></sl-datepicker>

        <sl-datepicker kwc:external
            label="点号格式 (DD.MM.YYYY)"
            format="DD.MM.YYYY"
            value="2024-06-15"
        ></sl-datepicker>

        <sl-datepicker kwc:external
            label="中文格式 (YYYY年MM月DD日)"
            format="YYYY年MM月DD日"
            value="2024-06-15"
        ></sl-datepicker>

        <sl-datepicker kwc:external
            label="美式格式 (MM-DD-YYYY)"
            format="MM-DD-YYYY"
            value="2024-06-15"
        ></sl-datepicker>
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

export default class FormatComparisonDatepicker extends KingdeeElement {}
```

**index.css**
```css
.stack {
    display: flex;
    flex-direction: column;
    gap: var(--sl-spacing-medium);
    max-width: 300px;
}
```

---

### 示例5：日期时间模式下的格式化

在 `datetime` 模式下，通过 `format` 自定义日期时间的显示格式。

**index.html**
```html
<template>
    <div class="stack">
        <sl-datepicker kwc:external class="datepicker-default"
            label="默认 datetime 格式"
            type="datetime"
            value="2024-06-15 09:30:00"
        ></sl-datepicker>

        <sl-datepicker kwc:external class="datepicker-custom"
            label="自定义 datetime 格式"
            type="datetime"
            format="YYYY/MM/DD HH:mm"
            value="2024-06-15 09:30:00"
        ></sl-datepicker>
    </div>
    <div class="result">
        <div>默认格式值: {defaultValue}</div>
        <div>自定义格式值: {customValue}</div>
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

export default class DatetimeFormatDatepicker extends KingdeeElement {
    @track defaultValue = '2024-06-15 09:30:00';
    @track customValue = '2024-06-15 09:30:00';

    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;
        this.bindShoelaceEvents();
    }

    get shoelaceEventBindings() {
        return [
            ['.datepicker-default', 'sl-change', this.handleDefaultChange],
            ['.datepicker-custom', 'sl-change', this.handleCustomChange]
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

    handleDefaultChange(event) {
        this.defaultValue = event.target.value;
    }

    handleCustomChange(event) {
        this.customValue = event.target.value;
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

**index.css**
```css
.stack {
    display: flex;
    flex-direction: column;
    gap: var(--sl-spacing-medium);
    max-width: 300px;
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
```

---

### 示例6：动态切换格式

通过按钮动态切换日期显示格式。

**index.html**
```html
<template>
    <div class="toolbar">
        <sl-button kwc:external variant={defaultVariant} onclick={setDefaultFormat}>YYYY-MM-DD</sl-button>
        <sl-button kwc:external variant={slashVariant} onclick={setSlashFormat}>YYYY/MM/DD</sl-button>
        <sl-button kwc:external variant={cnVariant} onclick={setCnFormat}>YYYY年MM月DD日</sl-button>
    </div>
    <sl-datepicker kwc:external class="datepicker-el"
        label="动态格式"
        format={currentFormat}
        value="2024-06-15"
    ></sl-datepicker>
    <div class="result">当前格式: {currentFormat}</div>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class DynamicFormatDatepicker extends KingdeeElement {
    @track currentFormat = 'YYYY-MM-DD';

    get defaultVariant() {
        return this.currentFormat === 'YYYY-MM-DD' ? 'primary' : 'default';
    }

    get slashVariant() {
        return this.currentFormat === 'YYYY/MM/DD' ? 'primary' : 'default';
    }

    get cnVariant() {
        return this.currentFormat === 'YYYY年MM月DD日' ? 'primary' : 'default';
    }

    setDefaultFormat() {
        this.currentFormat = 'YYYY-MM-DD';
    }

    setSlashFormat() {
        this.currentFormat = 'YYYY/MM/DD';
    }

    setCnFormat() {
        this.currentFormat = 'YYYY年MM月DD日';
    }
}
```

**index.css**
```css
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
```

---

## 注意事项

1. **基于 dayjs 实现**：`format` 底层使用 dayjs 进行格式化，支持 dayjs 的所有格式化符号，详见 [dayjs format 文档](https://day.js.org/docs/en/display/format)
2. **format 仅影响显示**：`format` 属性只改变输入框中的显示文本，`value` 始终保持标准格式（`YYYY-MM-DD` 或 `YYYY-MM-DD HH:mm:ss`）
3. **默认格式**：`date` 模式默认为 `YYYY-MM-DD`，`datetime` 模式默认为 `YYYY-MM-DD HH:mm:ss`
4. **手动输入**：设置 `format` 后，用户手动输入时也需要按照 `format` 指定的格式输入
5. **dayjs 符号大小写**：年份用大写 `YYYY`，日期用大写 `DD`，月份用大写 `MM`，小时 `HH`（24h）/ `hh`（12h），分钟用小写 `mm`，秒用小写 `ss`。注意与 Java 的 `yyyy`/`dd` 格式不同
6. **与 type 配合**：`datetime` 模式的 `format` 应包含时间部分（如 `HH:mm:ss` 或 `HH:mm`），否则时间信息将不会在输入框中显示

[返回目录](../index.md)
