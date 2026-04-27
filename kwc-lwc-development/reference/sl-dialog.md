# Dialog 对话框（扩展）

基于 Shoelace Dialog 标准组件，新增了以下扩展属性。

> 标准属性和用法请参考官方文档：https://shoelace.style/components/dialog

## 扩展属性

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| mask-closable | 点击蒙层是否允许关闭 | `boolean` | `true` |

## 使用示例

### 默认行为（点击蒙层可关闭）

**dialogDemo.html**
```html
<template>
  <sl-button kwc:external onclick={handleOpen}>打开对话框</sl-button>
  <sl-dialog kwc:external label="默认对话框" open={isOpen} onsl-hide={handleClose}>
    点击蒙层可以关闭此对话框
  </sl-dialog>
</template>
```

**dialogDemo.js**
```js
import { LightningElement, track } from 'lwc';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import '@kdcloudjs/shoelace/dist/components/dialog/dialog.js';

export default class DialogDemo extends LightningElement {
  @track isOpen = false;

  handleOpen() {
    this.isOpen = true;
  }

  handleClose() {
    this.isOpen = false;
  }
}
```

### 禁止点击蒙层关闭

**dialogDemo.html**
```html
<template>
  <sl-button kwc:external onclick={handleOpen}>打开对话框</sl-button>
  <sl-dialog 
    kwc:external 
    label="禁止蒙层关闭" 
    open={isOpen} 
    mask-closable="false"
    onsl-hide={handleClose}
  >
    点击蒙层不会关闭此对话框，只能点击关闭按钮
  </sl-dialog>
</template>
```

**dialogDemo.js**
```js
import { LightningElement, track } from 'lwc';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import '@kdcloudjs/shoelace/dist/components/dialog/dialog.js';

export default class DialogDemo extends LightningElement {
  @track isOpen = false;

  handleOpen() {
    this.isOpen = true;
  }

  handleClose() {
    this.isOpen = false;
  }
}
```

## 导入

```js
import '@kdcloudjs/shoelace/dist/components/dialog/dialog.js';
```
