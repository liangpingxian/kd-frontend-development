# 表单集成

[返回目录](../index.md)

## 功能说明

`sl-datepicker` 实现了表单控件接口（`ShoelaceFormControl`），可以无缝集成到原生 HTML 表单和 LWC 表单中。支持 `name`、`required`、`form` 等标准表单属性，以及 `checkValidity()`、`reportValidity()` 等表单校验方法。

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

**index.html**
```html
<template>
    <form onsubmit={handleSubmit}>
        <div class="form-group">
            <sl-datepicker kwc:external
                name="birthday"
                label="出生日期"
                required="true"
                placeholder="请选择出生日期"
            ></sl-datepicker>
        </div>
        <div class="form-group">
            <sl-datepicker kwc:external
                name="joinDate"
                label="入职日期"
                placeholder="请选择入职日期"
            ></sl-datepicker>
        </div>
        <div class="form-actions">
            <sl-button kwc:external type="submit" variant="primary">提交</sl-button>
            <sl-button kwc:external type="reset" variant="default">重置</sl-button>
        </div>
    </form>
    <div class="result" kwc:if={submitResult}>
        提交数据: {submitResult}
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class FormDatepicker extends KingdeeElement {
    @track submitResult = '';

    handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        this.submitResult = JSON.stringify(data, null, 2);
    }
}
```

**index.css**
```css
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
```

---

### 示例2：必填校验

设置 `required` 属性后，表单提交时会自动校验。

**index.html**
```html
<template>
    <form onsubmit={handleSubmit}>
        <div class="form-group">
            <sl-datepicker kwc:external
                name="startDate"
                label="项目开始日期"
                required="true"
                placeholder="必填项"
                help-text="此字段为必填"
            ></sl-datepicker>
        </div>
        <div class="form-group">
            <sl-datepicker kwc:external
                name="endDate"
                label="项目结束日期"
                placeholder="选填项"
                help-text="此字段为选填"
            ></sl-datepicker>
        </div>
        <sl-button kwc:external type="submit" variant="primary">提交</sl-button>
    </form>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class RequiredDatepicker extends KingdeeElement {
    handleSubmit(event) {
        event.preventDefault();

        // 获取所有 datepicker 组件
        const datepickers = this.template.querySelectorAll('sl-datepicker');
        let isValid = true;

        datepickers.forEach(picker => {
            if (!picker.reportValidity()) {
                isValid = false;
            }
        });

        if (isValid) {
            console.log('表单校验通过，提交数据');
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
```

---

### 示例3：通过 form 属性关联外部表单

使用 `form` 属性将 Datepicker 关联到不在其 DOM 层级内的表单。

**index.html**
```html
<template>
    <form id="myForm" onsubmit={handleSubmit}>
        <div class="form-group">
            <sl-input kwc:external name="username" label="用户名" placeholder="请输入用户名"></sl-input>
        </div>
        <sl-button kwc:external type="submit" variant="primary">提交</sl-button>
    </form>

    <!-- datepicker 在 form 标签外部，通过 form 属性关联 -->
    <div class="external-field">
        <sl-datepicker kwc:external
            name="eventDate"
            label="活动日期（外部字段）"
            form="myForm"
            placeholder="此字段通过 form 属性关联到上方表单"
        ></sl-datepicker>
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/input/input.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class ExternalFormDatepicker extends KingdeeElement {
    handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        console.log('提交数据:', data);
    }
}
```

**index.css**
```css
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
```

---

### 示例4：程序化校验

通过 JavaScript 调用校验方法进行程序化校验。

**index.html**
```html
<template>
    <div class="form-group">
        <sl-datepicker kwc:external class="datepicker-el"
            label="交付日期"
            required="true"
            placeholder="请选择交付日期"
        ></sl-datepicker>
    </div>
    <div class="actions">
        <sl-button kwc:external variant="primary" onclick={validate}>校验</sl-button>
        <sl-button kwc:external variant="default" onclick={resetValidation}>重置校验</sl-button>
    </div>
    <div class={resultClass} kwc:if={validationMessage}>
        {validationMessage}
    </div>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/datepicker/datepicker.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class ProgrammaticValidation extends KingdeeElement {
    @track validationMessage = '';
    @track isValid = false;

    renderedCallback() {
        if (this._eventsBound) return;
        this._eventsBound = true;
        const datepicker = this.template.querySelector('.datepicker-el');
        if (datepicker) {
            datepicker.addEventListener('sl-change', this.handleDateChange.bind(this));
        }
    }

    get datepicker() {
        return this.template.querySelector('.datepicker-el');
    }

    get resultClass() {
        return this.isValid ? 'result result-success' : 'result result-error';
    }

    handleDateChange(event) {
        const value = event.target.value;
        if (value) {
            this.datepicker.setCustomValidity('');
            this.validationMessage = '';
        }
    }

    validate() {
        const picker = this.datepicker;

        if (!picker.value) {
            picker.setCustomValidity('请选择一个有效的交付日期');
            picker.reportValidity();
            this.validationMessage = '校验失败：请选择交付日期';
            this.isValid = false;
            return;
        }

        // 自定义业务校验：不能选周末
        const date = new Date(picker.value);
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            picker.setCustomValidity('交付日期不能是周末');
            picker.reportValidity();
            this.validationMessage = '校验失败：不能选择周末';
            this.isValid = false;
            return;
        }

        picker.setCustomValidity('');
        this.validationMessage = '校验通过';
        this.isValid = true;
    }

    resetValidation() {
        this.datepicker.setCustomValidity('');
        this.validationMessage = '';
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
```

---

## 注意事项

1. **name 属性**：设置 `name` 后，Datepicker 的值才会包含在 FormData 中
2. **disabled 不提交**：禁用状态的 Datepicker 不参与表单提交
3. **required 校验**：`required` 校验在 `reportValidity()` 或表单提交时触发，空值会提示必填
4. **自定义校验**：使用 `setCustomValidity(message)` 设置自定义错误信息，传入空字符串 `''` 清除校验错误
5. **表单重置**：原生表单的 `reset` 事件会将 Datepicker 恢复到 `defaultValue`

[返回目录](../index.md)
