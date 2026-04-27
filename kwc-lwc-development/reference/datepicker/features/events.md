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
handleChange(event) {
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

监听 `sl-change` 事件获取用户最终选择的日期。

**index.html**
```html
<template>
    <sl-datepicker kwc:external class="datepicker-el"
        label="选择日期"
        placeholder="请选择日期"
    ></sl-datepicker>
    <div class="event-log" kwc:if={lastChangeValue}>
        sl-change 触发，值: {lastChangeValue}
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

export default class BasicEventDatepicker extends KingdeeElement {
    @track lastChangeValue = '';

    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;
        this.bindShoelaceEvents();
    }

    get shoelaceEventBindings() {
        return [
            ['.datepicker-el', 'sl-change', this.handleChange]
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
        this.lastChangeValue = event.target.value || '（已清空）';
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
.event-log {
    margin-top: var(--sl-spacing-small);
    padding: var(--sl-spacing-small);
    background: var(--sl-color-primary-100);
    border-radius: var(--sl-border-radius-medium);
    font-size: var(--sl-font-size-small);
    font-family: monospace;
}
```

---

### 示例2：区分 sl-change 和 sl-input

对比两个事件的触发时机和频率。

**index.html**
```html
<template>
    <sl-datepicker kwc:external class="datepicker-el"
        label="输入或选择日期"
        placeholder="请操作查看事件触发"
    ></sl-datepicker>
    <div class="event-panel">
        <div class="event-section">
            <h4>sl-input 事件（实时触发）</h4>
            <div class="count">触发次数: {inputCount}</div>
            <div class="value">最新值: {lastInputValue}</div>
        </div>
        <div class="event-section">
            <h4>sl-change 事件（确认时触发）</h4>
            <div class="count">触发次数: {changeCount}</div>
            <div class="value">最新值: {lastChangeValue}</div>
        </div>
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

export default class EventComparisonDatepicker extends KingdeeElement {
    @track inputCount = 0;
    @track changeCount = 0;
    @track lastInputValue = '（无）';
    @track lastChangeValue = '（无）';

    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;
        this.bindShoelaceEvents();
    }

    get shoelaceEventBindings() {
        return [
            ['.datepicker-el', 'sl-change', this.handleChange],
            ['.datepicker-el', 'sl-input', this.handleInput]
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

    handleInput(event) {
        this.inputCount++;
        this.lastInputValue = event.target.value || '（空）';
    }

    handleChange(event) {
        this.changeCount++;
        this.lastChangeValue = event.target.value || '（空）';
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
```

---

### 示例3：实时预览与确认保存

利用 `sl-input` 做实时预览，`sl-change` 做最终保存。

**index.html**
```html
<template>
    <sl-datepicker kwc:external class="datepicker-el"
        label="选择日期"
        type="datetime"
        placeholder="实时预览 + 确认保存"
    ></sl-datepicker>
    <div class="panels">
        <div class="panel preview">
            <h4>实时预览（sl-input）</h4>
            <div class="display">{previewValue}</div>
        </div>
        <div class="panel saved">
            <h4>已保存（sl-change）</h4>
            <div class="display">{savedValue}</div>
        </div>
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

export default class PreviewSaveDatepicker extends KingdeeElement {
    @track previewValue = '等待输入...';
    @track savedValue = '等待确认...';

    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;
        this.bindShoelaceEvents();
    }

    get shoelaceEventBindings() {
        return [
            ['.datepicker-el', 'sl-input', this.handleInput],
            ['.datepicker-el', 'sl-change', this.handleChange]
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

    handleInput(event) {
        const value = event.target.value;
        this.previewValue = value || '（空）';
    }

    handleChange(event) {
        const value = event.target.value;
        this.savedValue = value || '（已清空）';

        // 模拟保存到服务器
        console.log('保存到服务器:', value);
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
```

---

### 示例4：监听校验失败事件

通过 `sl-invalid` 事件捕获校验失败。

**index.html**
```html
<template>
    <form onsubmit={handleSubmit}>
        <div class="form-group">
            <sl-datepicker kwc:external class="datepicker-el"
                name="deadline"
                label="截止日期"
                required="true"
                placeholder="必填字段"
            ></sl-datepicker>
        </div>
        <sl-button kwc:external type="submit" variant="primary">提交</sl-button>
    </form>
    <div class="error-message" kwc:if={errorMessage}>
        {errorMessage}
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class InvalidEventDatepicker extends KingdeeElement {
    @track errorMessage = '';

    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;
        this.bindShoelaceEvents();
    }

    get shoelaceEventBindings() {
        return [
            ['.datepicker-el', 'sl-invalid', this.handleInvalid],
            ['.datepicker-el', 'sl-change', this.handleChange]
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

    handleSubmit(event) {
        event.preventDefault();
        const datepicker = this.template.querySelector('.datepicker-el');
        if (datepicker.reportValidity()) {
            this.errorMessage = '';
            console.log('提交成功:', datepicker.value);
        }
    }

    handleInvalid() {
        this.errorMessage = '请选择截止日期后再提交';
    }

    handleChange() {
        this.errorMessage = '';
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
```

---

### 示例5：联动多个日期选择器

通过事件实现多个日期选择器的联动逻辑。

**index.html**
```html
<template>
    <div class="form-row">
        <sl-datepicker kwc:external class="join-datepicker"
            label="入职日期"
            placeholder="先选择入职日期"
        ></sl-datepicker>

        <sl-datepicker kwc:external class="probation-datepicker"
            label="试用期结束"
            min={joinDate}
            placeholder={probationPlaceholder}
            disabled={noProbationDate}
            value={probationEndDate}
        ></sl-datepicker>

        <sl-datepicker kwc:external class="regular-datepicker"
            label="转正日期"
            min={probationEndDate}
            placeholder={regularPlaceholder}
            disabled={noRegularDate}
            value={regularDate}
        ></sl-datepicker>
    </div>
    <div class="summary" kwc:if={summaryText}>
        {summaryText}
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

export default class LinkedDatepickers extends KingdeeElement {
    @track joinDate = '';
    @track probationEndDate = '';
    @track regularDate = '';

    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;
        this.bindShoelaceEvents();
    }

    get shoelaceEventBindings() {
        return [
            ['.join-datepicker', 'sl-change', this.handleJoinDateChange],
            ['.probation-datepicker', 'sl-change', this.handleProbationChange],
            ['.regular-datepicker', 'sl-change', this.handleRegularChange]
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

    get noProbationDate() {
        return !this.joinDate;
    }

    get noRegularDate() {
        return !this.probationEndDate;
    }

    get probationPlaceholder() {
        return this.joinDate ? '选择试用期结束日期' : '请先选择入职日期';
    }

    get regularPlaceholder() {
        return this.probationEndDate ? '选择转正日期' : '请先选择试用期结束日期';
    }

    get summaryText() {
        if (this.joinDate && this.probationEndDate && this.regularDate) {
            return `入职: ${this.joinDate} -> 试用期结束: ${this.probationEndDate} -> 转正: ${this.regularDate}`;
        }
        return '';
    }

    handleJoinDateChange(event) {
        this.joinDate = event.target.value;
        // 自动设置 3 个月后为试用期结束日期
        if (this.joinDate) {
            const date = new Date(this.joinDate);
            date.setMonth(date.getMonth() + 3);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            this.probationEndDate = `${year}-${month}-${day}`;
        } else {
            this.probationEndDate = '';
            this.regularDate = '';
        }
    }

    handleProbationChange(event) {
        this.probationEndDate = event.target.value;
        if (!this.probationEndDate) {
            this.regularDate = '';
        }
    }

    handleRegularChange(event) {
        this.regularDate = event.target.value;
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
```

---

## 注意事项

1. **事件绑定方式**：Shoelace 自定义事件（`sl-change`、`sl-input`、`sl-invalid`）**不能**在 HTML 模板中用 `onsl-*` 格式绑定，必须在 `renderedCallback()` 中通过 `addEventListener` 绑定
2. **获取值**：统一通过 `event.target.value` 获取当前值，而非 `event.detail`
3. **sl-change 不频繁触发**：`sl-change` 仅在值最终确认时触发，适合做数据保存；`sl-input` 实时触发，适合做预览
4. **datetime 模式差异**：在 `datetime` 模式下，选择日期/时间过程中只触发 `sl-input`，点击确定后才触发 `sl-change`
5. **清除触发**：清除按钮会同时触发 `sl-input` 和 `sl-change`，值为空字符串 `''`

[返回目录](../index.md)
