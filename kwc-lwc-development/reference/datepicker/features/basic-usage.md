# 基础用法

[返回目录](../index.md)

## 功能说明

Datepicker 组件的基础用法包括：日期选择、设置占位符、默认值、不同尺寸、可清除、禁用、只读等基础功能。

## API 属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `value` | 当前日期值（格式：`yyyy-MM-dd`） | `string` | `''` |
| `placeholder` | 占位提示文本 | `string` | `''` |
| `label` | 标签文本 | `string` | `''` |
| `size` | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `clearable` | 是否可清除 | `boolean` | `true` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `readonly` | 是否只读 | `boolean` | `false` |
| `autofocus` | 自动获取焦点 | `boolean` | `false` |

---

## 代码示例

### 示例1：最简日期选择器

最基础的用法，点击输入框弹出日历面板选择日期。

**index.html**
```html
<template>
    <sl-datepicker kwc:external
        label="选择日期"
        placeholder="请选择日期"
    ></sl-datepicker>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

export default class SimpleDatepicker extends KingdeeElement {}
```

---

### 示例2：设置默认值

通过 `value` 属性设置初始日期值，格式为 `yyyy-MM-dd`。

**index.html**
```html
<template>
    <sl-datepicker kwc:external class="datepicker-el"
        label="入职日期"
        value={defaultDate}
    ></sl-datepicker>
    <div class="result">当前值: {selectedDate}</div>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

export default class DefaultValueDatepicker extends KingdeeElement {
    defaultDate = '2024-06-15';
    @track selectedDate = '2024-06-15';

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
    color: var(--sl-color-neutral-600);
    font-size: var(--sl-font-size-small);
}
```

---

### 示例3：不同尺寸

通过 `size` 属性设置三种尺寸：`small`、`medium`（默认）、`large`。

**index.html**
```html
<template>
    <div class="stack">
        <sl-datepicker kwc:external
            label="Small"
            size="small"
            placeholder="小尺寸"
        ></sl-datepicker>

        <sl-datepicker kwc:external
            label="Medium"
            size="medium"
            placeholder="中尺寸（默认）"
        ></sl-datepicker>

        <sl-datepicker kwc:external
            label="Large"
            size="large"
            placeholder="大尺寸"
        ></sl-datepicker>
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

export default class SizeDatepicker extends KingdeeElement {}
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

### 示例4：可清除

`clearable` 属性默认为 `true`，输入框有值时显示清除按钮。设置 `clearable="false"` 可禁用清除功能。

**index.html**
```html
<template>
    <div class="stack">
        <sl-datepicker kwc:external
            label="可清除（默认）"
            value="2024-01-15"
            placeholder="有清除按钮"
        ></sl-datepicker>

        <sl-datepicker kwc:external
            label="不可清除"
            value="2024-01-15"
            clearable="false"
            placeholder="无清除按钮"
        ></sl-datepicker>
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

export default class ClearableDatepicker extends KingdeeElement {}
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

### 示例5：禁用与只读

`disabled` 禁止所有交互，`readonly` 允许查看值但不允许修改。

**index.html**
```html
<template>
    <div class="stack">
        <sl-datepicker kwc:external
            label="禁用状态"
            value="2024-01-15"
            disabled="true"
        ></sl-datepicker>

        <sl-datepicker kwc:external
            label="只读状态"
            value="2024-01-15"
            readonly="true"
        ></sl-datepicker>

        <sl-datepicker kwc:external
            label="正常状态"
            value="2024-01-15"
        ></sl-datepicker>
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

export default class DisabledReadonlyDatepicker extends KingdeeElement {}
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

### 示例6：带标签和帮助文本

通过 `label` 和 `help-text` 属性为选择器添加标签和帮助提示。

**index.html**
```html
<template>
    <div class="stack">
        <sl-datepicker kwc:external
            label="出生日期"
            help-text="请选择您的出生日期"
            placeholder="yyyy-MM-dd"
        ></sl-datepicker>

        <sl-datepicker kwc:external
            label="项目截止日期"
            help-text="项目需在此日期前完成"
            placeholder="选择截止日期"
            value="2024-12-31"
        ></sl-datepicker>
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

export default class LabelHelpTextDatepicker extends KingdeeElement {}
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

### 示例7：手动输入日期

用户可以直接在输入框中键入日期，支持 `-`、`/`、`.` 分隔符。输入格式正确后会自动同步日历面板。

**index.html**
```html
<template>
    <sl-datepicker kwc:external class="datepicker-el"
        label="手动输入"
        placeholder="支持输入 2024-01-15 或 2024/01/15 或 2024.01.15"
    ></sl-datepicker>
    <div class="log">
        <div>当前值: {currentValue}</div>
        <div>输入事件次数: {inputCount}</div>
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

export default class ManualInputDatepicker extends KingdeeElement {
    @track currentValue = '';
    @track inputCount = 0;

    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;
        const datepicker = this.template.querySelector('.datepicker-el');
        if (datepicker) {
            datepicker.addEventListener('sl-change', this.handleChange.bind(this));
            datepicker.addEventListener('sl-input', this.handleInput.bind(this));
        }
    }

    handleChange(event) {
        this.currentValue = event.target.value;
    }

    handleInput() {
        this.inputCount++;
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
.log {
    margin-top: var(--sl-spacing-small);
    padding: var(--sl-spacing-small);
    background: var(--sl-color-neutral-100);
    border-radius: var(--sl-border-radius-medium);
    font-size: var(--sl-font-size-small);
    color: var(--sl-color-neutral-600);
}
.log div {
    margin-bottom: var(--sl-spacing-2x-small);
}
```

---

### 示例8：动态控制值

通过程序动态设置和清空日期值。

**index.html**
```html
<template>
    <div class="toolbar">
        <sl-button kwc:external variant="primary" onclick={setToday}>设为今天</sl-button>
        <sl-button kwc:external variant="default" onclick={setNewYear}>设为元旦</sl-button>
        <sl-button kwc:external variant="default" onclick={clearValue}>清空</sl-button>
    </div>
    <sl-datepicker kwc:external class="datepicker-el"
        label="动态控制"
        value={dateValue}
    ></sl-datepicker>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class DynamicDatepicker extends KingdeeElement {
    @track dateValue = '';

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

    setToday() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        this.dateValue = `${year}-${month}-${day}`;
    }

    setNewYear() {
        const year = new Date().getFullYear();
        this.dateValue = `${year}-01-01`;
    }

    clearValue() {
        this.dateValue = '';
    }

    handleChange(event) {
        this.dateValue = event.target.value;
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
.toolbar {
    display: flex;
    gap: var(--sl-spacing-x-small);
    margin-bottom: var(--sl-spacing-medium);
}
```

---

## 注意事项

1. **值格式**：`value` 属性的格式必须为 `yyyy-MM-dd`（如 `2024-01-15`），不符合格式的值会被自动清空
2. **自动打开**：在桌面端，聚焦输入框会自动打开日历面板；在移动端需要点击触发
3. **清除默认开启**：`clearable` 默认为 `true`，如不需要请显式设置 `clearable="false"`
4. **响应式更新**：在 LWC 中修改 `value` 需要使用 `@track` 装饰器以触发重新渲染
5. **输入分隔符**：支持 `-`、`/`、`.` 三种分隔符输入，输出统一为 `-` 分隔的标准格式

[返回目录](../index.md)
