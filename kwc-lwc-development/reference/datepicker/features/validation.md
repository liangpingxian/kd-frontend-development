# 校验

[返回目录](../index.md)

## 功能说明

`sl-datepicker` 支持内置校验（`required`、`min/max` 范围）和自定义校验（`setCustomValidity`）。组件实现了标准的表单校验接口，可与浏览器原生表单校验机制无缝配合。

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

设置 `required` 属性，空值时校验不通过。

**index.html**
```html
<template>
    <form onsubmit={handleSubmit}>
        <div class="form-group">
            <sl-datepicker kwc:external class="datepicker-el"
                name="birthday"
                label="出生日期"
                required="true"
                placeholder="此字段必填"
            ></sl-datepicker>
        </div>
        <sl-button kwc:external type="submit" variant="primary">提交</sl-button>
    </form>
    <div class="message error" kwc:if={errorMsg}>{errorMsg}</div>
    <div class="message success" kwc:if={successMsg}>{successMsg}</div>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class RequiredValidation extends KingdeeElement {
    @track errorMsg = '';
    @track successMsg = '';

    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;
        const datepicker = this.template.querySelector('.datepicker-el');
        if (datepicker) {
            datepicker.addEventListener('sl-invalid', this.handleInvalid.bind(this));
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const picker = this.template.querySelector('.datepicker-el');

        if (picker.reportValidity()) {
            this.errorMsg = '';
            this.successMsg = `提交成功，出生日期: ${picker.value}`;
        }
    }

    handleInvalid() {
        this.successMsg = '';
        this.errorMsg = '请填写出生日期';
    }
}
```

**index.css**
```css
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
```

---

### 示例2：自定义校验消息

使用 `setCustomValidity()` 设置自定义校验消息。

**index.html**
```html
<template>
    <div class="form-group">
        <sl-datepicker kwc:external class="datepicker-el"
            label="项目截止日期"
            placeholder="选择截止日期"
        ></sl-datepicker>
    </div>
    <sl-button kwc:external variant="primary" onclick={validateDate}>校验日期</sl-button>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class CustomValidationMessage extends KingdeeElement {
    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;
        const datepicker = this.template.querySelector('.datepicker-el');
        if (datepicker) {
            datepicker.addEventListener('sl-change', this.handleChange.bind(this));
        }
    }

    get datepicker() {
        return this.template.querySelector('.datepicker-el');
    }

    handleChange() {
        // 值变化时清除之前的校验消息
        this.datepicker.setCustomValidity('');
    }

    validateDate() {
        const picker = this.datepicker;
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
}
```

**index.css**
```css
.form-group {
    margin-bottom: var(--sl-spacing-medium);
    max-width: 300px;
}
```

---

### 示例3：业务规则校验（工作日校验）

自定义校验逻辑：只允许选择工作日（周一至周五）。

**index.html**
```html
<template>
    <div class="form-group">
        <sl-datepicker kwc:external class="datepicker-el"
            label="发货日期"
            placeholder="仅工作日可选"
            help-text="发货仅支持工作日（周一至周五）"
        ></sl-datepicker>
    </div>
    <div class="status" kwc:if={statusText}>
        <span class={statusClass}>{statusText}</span>
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';

export default class WorkdayValidation extends KingdeeElement {
    @track statusText = '';
    @track isValid = false;

    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;
        const datepicker = this.template.querySelector('.datepicker-el');
        if (datepicker) {
            datepicker.addEventListener('sl-change', this.validateWorkday.bind(this));
        }
    }

    get statusClass() {
        return this.isValid ? 'valid' : 'invalid';
    }

    get datepicker() {
        return this.template.querySelector('.datepicker-el');
    }

    validateWorkday(event) {
        const value = event.target.value;
        const picker = this.datepicker;

        if (!value) {
            picker.setCustomValidity('');
            this.statusText = '';
            return;
        }

        const date = new Date(value);
        const dayOfWeek = date.getDay();
        const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            picker.setCustomValidity(`${dayNames[dayOfWeek]}不可发货，请选择工作日`);
            picker.reportValidity();
            this.statusText = `${value} 是${dayNames[dayOfWeek]}，不可发货`;
            this.isValid = false;
        } else {
            picker.setCustomValidity('');
            this.statusText = `${value} 是${dayNames[dayOfWeek]}，可以发货`;
            this.isValid = true;
        }
    }
}
```

**index.css**
```css
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
```

---

### 示例4：多字段联合校验

对表单中多个日期字段进行联合校验。

**index.html**
```html
<template>
    <form onsubmit={handleSubmit}>
        <div class="form-group">
            <sl-datepicker kwc:external class="start-datepicker"
                name="startDate"
                label="开始日期"
                required="true"
                placeholder="选择开始日期"
            ></sl-datepicker>
        </div>
        <div class="form-group">
            <sl-datepicker kwc:external class="end-datepicker"
                name="endDate"
                label="结束日期"
                required="true"
                placeholder="选择结束日期"
            ></sl-datepicker>
        </div>
        <div class="form-group">
            <sl-datepicker kwc:external class="report-datepicker"
                name="reportDate"
                label="报告日期"
                required="true"
                placeholder="选择报告日期"
                help-text="报告日期必须在结束日期之后"
            ></sl-datepicker>
        </div>
        <sl-button kwc:external type="submit" variant="primary">提交</sl-button>
    </form>
    <div class="errors" kwc:if={hasErrors}>
        <h4>校验错误:</h4>
        <template for:each={errors} for:item="error">
            <div key={error} class="error-item">{error}</div>
        </template>
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class MultiFieldValidation extends KingdeeElement {
    @track errors = [];

    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;
        const start_datepicker = this.template.querySelector('.start-datepicker');
        if (start_datepicker) {
            start_datepicker.addEventListener('sl-change', this.handleStartChange.bind(this));
        }
        const end_datepicker = this.template.querySelector('.end-datepicker');
        if (end_datepicker) {
            end_datepicker.addEventListener('sl-change', this.handleEndChange.bind(this));
        }
        const report_datepicker = this.template.querySelector('.report-datepicker');
        if (report_datepicker) {
            report_datepicker.addEventListener('sl-change', this.handleReportChange.bind(this));
        }
    }

    get hasErrors() {
        return this.errors.length > 0;
    }

    getPicker(name) {
        return this.template.querySelector(`sl-datepicker[name="${name}"]`);
    }

    handleStartChange() {
        this.crossValidate();
    }

    handleEndChange() {
        this.crossValidate();
    }

    handleReportChange() {
        this.crossValidate();
    }

    crossValidate() {
        const startPicker = this.getPicker('startDate');
        const endPicker = this.getPicker('endDate');
        const reportPicker = this.getPicker('reportDate');

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

    handleSubmit(event) {
        event.preventDefault();

        this.crossValidate();

        const pickers = this.template.querySelectorAll('sl-datepicker');
        const errorList = [];
        let allValid = true;

        pickers.forEach(picker => {
            if (!picker.reportValidity()) {
                allValid = false;
                errorList.push(`${picker.label}: ${picker.validationMessage}`);
            }
        });

        this.errors = errorList;

        if (allValid) {
            console.log('所有校验通过，提交表单');
        }
    }
}
```

**index.css**
```css
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
```

---

### 示例5：checkValidity 静默校验

使用 `checkValidity()` 进行不显示 UI 提示的静默校验。

**index.html**
```html
<template>
    <div class="form-group">
        <sl-datepicker kwc:external class="datepicker-el"
            label="会议日期"
            required="true"
            placeholder="请选择会议日期"
        ></sl-datepicker>
    </div>
    <div class="actions">
        <sl-button kwc:external variant="primary" onclick={silentCheck}>静默校验 (checkValidity)</sl-button>
        <sl-button kwc:external variant="default" onclick={reportCheck}>UI 校验 (reportValidity)</sl-button>
    </div>
    <div class="result" kwc:if={checkResult}>
        校验结果: {checkResult}
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class SilentValidation extends KingdeeElement {
    @track checkResult = '';

    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;
        const datepicker = this.template.querySelector('.datepicker-el');
        if (datepicker) {
            datepicker.addEventListener('sl-change', this.handleChange.bind(this));
        }
    }

    get datepicker() {
        return this.template.querySelector('.datepicker-el');
    }

    handleChange() {
        this.checkResult = '';
    }

    silentCheck() {
        // checkValidity 不会显示 UI 提示
        const isValid = this.datepicker.checkValidity();
        this.checkResult = isValid
            ? '有效（checkValidity 不会显示提示框）'
            : '无效（checkValidity 不会显示提示框）';
    }

    reportCheck() {
        // reportValidity 会显示 UI 提示
        const isValid = this.datepicker.reportValidity();
        this.checkResult = isValid
            ? '有效（reportValidity 已显示/隐藏提示）'
            : '无效（reportValidity 已显示提示）';
    }
}
```

**index.css**
```css
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
```

---

## 注意事项

1. **required 校验时机**：`required` 校验在调用 `reportValidity()` 或表单 `submit` 时触发，不会在输入过程中实时触发
2. **setCustomValidity 使用**：设置自定义消息后需调用 `reportValidity()` 才会显示；传入空字符串 `''` 清除错误
3. **min/max 是输入级校验**：`min/max` 范围之外的日期在日历面板中被禁用，但通过输入框键入的超范围值会在失焦时回退
4. **清除时的校验**：清除值后再次校验会触发 `required` 的必填校验
5. **validity 属性**：`validity` 是只读的 `ValidityState` 对象，包含 `valid`、`valueMissing` 等标准属性

[返回目录](../index.md)
