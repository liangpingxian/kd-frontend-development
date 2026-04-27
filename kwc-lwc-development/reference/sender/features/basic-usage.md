# 基础用法

[返回目录](../index.md)

## 功能说明

演示 `sl-sender` 的最小可用配置：`value`、`placeholder`、`sl-submit` 事件，以及 `loading`、`disabled`、`readOnly` 状态。

## 示例代码（LWC）

**index.html**
```html
<template>
  <div class="demo-container">
    <sl-sender kwc:external
      class="sender-main"
      placeholder="请输入消息..."
      value={value}
    ></sl-sender>

    <sl-sender kwc:external
      class="sender-loading"
      value="加载中状态"
      loading
      read-only
    ></sl-sender>

    <sl-sender kwc:external
      class="sender-disabled"
      value="禁用状态"
      disabled
      allow-speech
    ></sl-sender>
  </div>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';

export default class SenderBasicUsage extends KingdeeElement {
  value = 'Hello, this is Shoelace!';
  _eventsBound = false;

  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    const sender = this.template.querySelector('.sender-main');
    sender.addEventListener('sl-change', (e) => {
      this.value = e.detail.value;
    });
    sender.addEventListener('sl-submit', (e) => {
      console.log('提交:', e.detail.value);
      sender.loading = true;
      setTimeout(() => {
        sender.loading = false;
        this.value = '';
      }, 3000);
    });
    sender.addEventListener('sl-cancel', () => {
      sender.loading = false;
    });
  }
}
```

---

## 注意事项

1. **value 受控**：通过 `sl-change` 事件监听值变化并更新属性，实现受控模式
2. **loading 状态**：设置 `sender.loading = true` 后发送按钮变为取消按钮，点击触发 `sl-cancel` 事件
3. **disabled vs readOnly**：`disabled` 完全禁用交互，`read-only` 仅阻止编辑但保持内容可见
4. **事件绑定**：所有 `sl-*` 事件必须在 `renderedCallback()` 中通过 `addEventListener` 绑定，禁止在 HTML 中绑定
5. **布尔属性**：`loading`、`disabled`、`read-only`、`allow-speech` 在 HTML 中直接写属性名即可

[返回目录](../index.md)
