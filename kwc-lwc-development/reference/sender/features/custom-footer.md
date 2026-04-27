# 自定义尾部

[返回目录](../index.md)

## 功能说明

通过 `footer` 属性在输入区域下方添加工具栏。支持 TemplateResult、函数模式（可访问组件渲染器）。常用于放置功能开关、附件按钮、发送按钮等。`footer` 是复杂属性，必须通过 JS 设置。

## 示例代码（LWC）

**index.html**
```html
<template>
  <sl-sender kwc:external
    class="sender"
    placeholder="按 Enter 发送消息"
  ></sl-sender>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import { html } from 'lit';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';
import '@kdcloudjs/shoelace/dist/components/icon-button/icon-button.js';

export default class SenderCustomFooter extends KingdeeElement {
  _eventsBound = false;
  _loading = false;

  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    const sender = this.template.querySelector('.sender');

    // 隐藏默认后缀按钮
    sender.suffixContent = false;

    // 设置 footer
    this._updateFooter(sender);

    sender.addEventListener('sl-submit', (e) => {
      console.log('提交:', e.detail.value);
      this._loading = true;
      this._updateFooter(sender);
      setTimeout(() => {
        this._loading = false;
        sender.value = '';
        this._updateFooter(sender);
      }, 2000);
    });
  }

  _updateFooter(sender) {
    const loading = this._loading;
    sender.footer = (defaultFooter, { components }) => {
      return html`
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0 0.25rem;">
          <div style="display: flex; align-items: center; gap: 0.25rem;">
            <sl-icon-button name="paperclip" label="附件"></sl-icon-button>
            <sl-icon-button name="search" label="搜索"></sl-icon-button>
          </div>
          <div style="display: flex; align-items: center; gap: 0.25rem;">
            ${loading
              ? components.LoadingButton({ title: '点击取消' })
              : components.SendButton({})}
          </div>
        </div>
      `;
    };
  }
}
```

---

## 注意事项

1. **footer 函数签名**：`(defaultFooter, { components }) => BaseNode`，与 `suffixContent` 函数签名一致
2. **必须通过 JS 设置**：`footer` 需要 lit html 模板，必须在 `renderedCallback()` 中通过 `querySelector` 设置
3. **配合 suffixContent**：使用 footer 工具栏时通常需要设置 `sender.suffixContent = false` 隐藏默认操作按钮
4. **Lit html 模板**：函数模式返回值需使用 `html` 模板字面量（从 `lit` 导入）
5. **动态更新**：状态变化时需重新调用设置函数以更新 footer 内容

[返回目录](../index.md)
