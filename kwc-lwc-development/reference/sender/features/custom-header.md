# 自定义头部

[返回目录](../index.md)

## 功能说明

通过 `header` 属性在输入区域上方添加内容。支持 HTMLElement、TemplateResult、函数模式。配合 `sl-sender-header` 子组件可实现可折叠的附件面板或引用面板。`header` 是复杂属性，必须通过 JS 设置。

## 示例代码（LWC）— 引用面板

**index.html**
```html
<template>
  <div>
    <sl-switch kwc:external class="ref-switch" checked>带引用</sl-switch>
    <sl-sender kwc:external
      class="sender"
      placeholder="输入回复..."
    ></sl-sender>
  </div>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';
import '@kdcloudjs/shoelace/dist/components/sender-header/sender-header.js';
import '@kdcloudjs/shoelace/dist/components/switch/switch.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';

export default class SenderCustomHeader extends KingdeeElement {
  _eventsBound = false;

  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    const sender = this.template.querySelector('.sender');
    const refSwitch = this.template.querySelector('.ref-switch');

    // 初始化头部
    this._updateHeader(sender, true);

    refSwitch.addEventListener('sl-change', () => {
      this._updateHeader(sender, refSwitch.checked);
    });

    sender.addEventListener('sl-submit', (e) => {
      console.log('提交:', e.detail.value);
    });
  }

  _updateHeader(sender, showRef) {
    if (!showRef) {
      sender.header = false;
      return;
    }

    const header = document.createElement('sl-sender-header');
    header.open = true;
    header.addEventListener('sl-open-change', (e) => {
      const open = e.detail.open;
      if (!open) {
        sender.header = false;
        const refSwitch = this.template.querySelector('.ref-switch');
        refSwitch.checked = false;
      }
    });

    const titleSlot = document.createElement('div');
    titleSlot.slot = 'title';
    titleSlot.style.cssText = 'display: flex; align-items: center; gap: 0.5rem;';
    titleSlot.innerHTML = '<sl-icon name="reply"></sl-icon><span style="color: var(--sl-color-neutral-500);">"请告诉我更多关于 Shoelace 组件的信息"</span>';
    header.appendChild(titleSlot);

    sender.header = header;
  }
}
```

---

## 注意事项

1. **header 属性类型**：支持 HTMLElement（如 `sl-sender-header`）、TemplateResult、函数 `(defaultHeader, { components }) => BaseNode`、`false`（隐藏）
2. **sl-sender-header**：可折叠面板组件，通过 `open` 控制展开，`closable` 控制关闭按钮，`sl-open-change` 监听状态变化
3. **必须通过 JS 设置**：`header` 是复杂属性，需在 `renderedCallback()` 中通过 `querySelector` 设置
4. **DOM 创建**：使用 `document.createElement` 创建 `sl-sender-header` 元素并设置属性
5. **需导入 sender-header**：使用 `sl-sender-header` 时必须导入 `@kdcloudjs/shoelace/dist/components/sender-header/sender-header.js`

[返回目录](../index.md)
