# 事件监听

[返回目录](../index.md)

## 功能说明

`sl-sender` 支持多种事件：`sl-change`（值变化）、`sl-submit`（提交）、`sl-clear`（清空）、`sl-focus`（聚焦）、`sl-blur`（失焦）、`sl-speech-toggle`（语音切换）、`sl-paste`（粘贴）、`sl-paste-file`（粘贴文件）、`sl-cancel`（取消加载）。所有事件必须在 `renderedCallback()` 中通过 `addEventListener` 绑定。

## 示例代码（LWC）

**index.html**
```html
<template>
  <sl-sender kwc:external
    class="sender"
    placeholder="尝试输入、提交、清空..."
    allow-speech
  ></sl-sender>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';

export default class SenderEvents extends KingdeeElement {
  _eventsBound = false;

  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    const sender = this.template.querySelector('.sender');

    sender.addEventListener('sl-change', (e) => {
      console.log('sl-change', { value: e.detail.value });
    });

    sender.addEventListener('sl-submit', (e) => {
      console.log('sl-submit', { value: e.detail.value });
      sender.loading = true;
      setTimeout(() => {
        sender.loading = false;
      }, 2000);
    });

    sender.addEventListener('sl-clear', () => {
      console.log('sl-clear');
    });

    sender.addEventListener('sl-focus', () => {
      console.log('sl-focus');
    });

    sender.addEventListener('sl-blur', () => {
      console.log('sl-blur');
    });

    sender.addEventListener('sl-paste', () => {
      console.log('sl-paste');
    });

    sender.addEventListener('sl-paste-file', (e) => {
      console.log('sl-paste-file', { count: e.detail.files.length });
    });

    sender.addEventListener('sl-speech-toggle', () => {
      console.log('sl-speech-toggle');
    });

    sender.addEventListener('sl-cancel', () => {
      console.log('sl-cancel');
      sender.loading = false;
    });
  }
}
```

---

## 注意事项

1. **事件绑定方式**：所有 `sl-*` 事件必须在 `renderedCallback()` 中通过 `addEventListener` 绑定，禁止在 HTML 模板中绑定
2. **防止重复绑定**：使用 `_eventsBound` 标志位确保事件只绑定一次
3. **事件对象**：通过 `e.detail` 获取事件数据，通过 `e.target` 获取组件实例
4. **sl-change detail**：普通模式返回 `{ value }`，slot 模式返回 `{ value, slotConfig, skill? }`
5. **sl-submit detail**：与 `sl-change` 结构一致，包含提交时的完整值
6. **sl-cancel**：仅在 `loading` 状态下点击取消按钮时触发

[返回目录](../index.md)
