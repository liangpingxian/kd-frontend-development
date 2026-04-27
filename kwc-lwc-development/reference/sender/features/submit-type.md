# 提交模式

[返回目录](../index.md)

## 功能说明

通过 `submit-type` 控制换行与提交的快捷键行为。默认 `'enter'` 模式下 Enter 提交、Shift+Enter 换行；`'shift-enter'` 模式下 Enter 换行、Shift+Enter 提交。

## 示例代码（LWC）

**index.html**
```html
<template>
  <sl-sender kwc:external
    class="sender"
    placeholder="按 Shift + Enter 发送消息"
    submit-type="shift-enter"
  ></sl-sender>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';

export default class SenderSubmitType extends KingdeeElement {
  _eventsBound = false;

  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    const sender = this.template.querySelector('.sender');
    sender.addEventListener('sl-submit', (e) => {
      console.log('提交:', e.detail.value);
      sender.loading = true;
      setTimeout(() => {
        sender.value = '';
        sender.loading = false;
      }, 3000);
    });
  }
}
```

---

## 注意事项

1. **默认模式**：`submit-type="enter"` 时 Enter 直接提交，Shift+Enter 换行
2. **反转模式**：`submit-type="shift-enter"` 时 Enter 换行，Shift+Enter 提交
3. **多行输入**：需要多行输入场景建议使用 `shift-enter` 模式
4. **HTML 属性名**：使用 kebab-case `submit-type`，不是 `submitType`

[返回目录](../index.md)
