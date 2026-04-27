# RTL 方向

[返回目录](../index.md)

## 功能说明

通过 `direction="rtl"` 开启从右到左布局。

## 示例代码（LWC）

根据语言设置动态切换表格方向。

**index.html**
```html
<template>
    <div class="toolbar">
        <sl-button-group kwc:external>
            <sl-button kwc:external 
                variant={ltrVariant}
                onclick={setLtr}
            >
                LTR (English)
            </sl-button>
            <sl-button kwc:external 
                variant={rtlVariant}
                onclick={setRtl}
            >
                RTL (العربية)
            </sl-button>
        </sl-button-group>
    </div>
    <sl-table kwc:external
        row-key="id"
        direction={direction}
        bordered="true"
        columns={columns}
        data-source={dataSource}
    ></sl-table>
</template>
```

**index.js**
```js
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/table/table.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import '@kdcloudjs/shoelace/dist/components/button-group/button-group.js';

export default class DynamicDirectionTable extends KingdeeElement {
    @track direction = 'ltr';

    get ltrVariant() {
        return this.direction === 'ltr' ? 'primary' : 'default';
    }

    get rtlVariant() {
        return this.direction === 'rtl' ? 'primary' : 'default';
    }

    get columns() {
        if (this.direction === 'rtl') {
            return [
                { title: 'الاسم', dataIndex: 'name', width: 150 },
                { title: 'العمر', dataIndex: 'age', width: 100 },
                { title: 'المدينة', dataIndex: 'city' }
            ];
        }
        return [
            { title: 'Name', dataIndex: 'name', width: 150 },
            { title: 'Age', dataIndex: 'age', width: 100 },
            { title: 'City', dataIndex: 'city' }
        ];
    }

    get dataSource() {
        if (this.direction === 'rtl') {
            return [
                { id: '1', name: 'أحمد', age: 28, city: 'القاهرة' },
                { id: '2', name: 'محمد', age: 35, city: 'الإسكندرية' },
                { id: '3', name: 'فاطمة', age: 30, city: 'الجيزة' }
            ];
        }
        return [
            { id: '1', name: 'John', age: 28, city: 'New York' },
            { id: '2', name: 'Jane', age: 35, city: 'Los Angeles' },
            { id: '3', name: 'Bob', age: 30, city: 'Chicago' }
        ];
    }

    setLtr() {
        this.direction = 'ltr';
    }

    setRtl() {
        this.direction = 'rtl';
    }
}
```
