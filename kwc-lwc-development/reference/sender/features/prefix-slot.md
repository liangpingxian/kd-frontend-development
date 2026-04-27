# 前缀插槽

[返回目录](../index.md)

## 功能说明

通过 `prefix` 插槽或 `prefixContent` 属性在输入区域左侧添加操作按钮。常用于放置附件按钮、语音按钮等。`prefixContent` 需要 lit html 模板，必须通过 JS 设置。

## 示例代码（LWC）

**index.html**
```html
<template>
  <sl-sender kwc:external
    class="sender"
    placeholder="输入消息..."
    allow-speech
  ></sl-sender>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import { html } from 'lit';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';
import '@kdcloudjs/shoelace/dist/components/icon-button/icon-button.js';

export default class SenderPrefixSlot extends KingdeeElement {
  _eventsBound = false;

  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    const sender = this.template.querySelector('.sender');
    sender.prefixContent = html`
      <sl-icon-button name="paperclip" label="附件"></sl-icon-button>
    `;
  }
}
```

---

## 注意事项

1. **prefixContent 属性**：支持 TemplateResult（Lit html 模板）、HTMLElement、函数模式
2. **必须通过 JS 设置**：`prefixContent` 需要 lit html 模板，必须在 `renderedCallback()` 中通过 `querySelector` 设置
3. **与 suffixContent 配合**：前缀和后缀可同时使用，分别控制输入区域两侧的操作按钮

[返回目录](../index.md)
