# 功能开关

[返回目录](../index.md)

## 功能说明

`sl-sender-switch` 是一个切换按钮组件，用于在 Sender 中启用/禁用功能（如深度思考、搜索等）。支持默认内容、选中/未选中内容、禁用、加载、受控模式。

## 示例代码（LWC）

**index.html**
```html
<template>
  <div class="demo-container">
    <!-- 默认用法 -->
    <div class="row">
      <span>默认:</span>
      <sl-sender-switch kwc:external class="switch-default">
        <sl-icon kwc:external slot="icon" name="search"></sl-icon>
        深度搜索
      </sl-sender-switch>
    </div>

    <!-- 自定义选中/未选中内容 -->
    <div class="row">
      <span>自定义内容:</span>
      <sl-sender-switch kwc:external class="switch-custom">
        <sl-icon kwc:external slot="icon" name="search"></sl-icon>
        <span slot="checked">深度搜索: 开</span>
        <span slot="unchecked">深度搜索: 关</span>
      </sl-sender-switch>
    </div>

    <!-- 禁用 -->
    <div class="row">
      <span>禁用:</span>
      <sl-sender-switch kwc:external disabled>
        <sl-icon kwc:external slot="icon" name="search"></sl-icon>
        深度搜索
      </sl-sender-switch>
    </div>

    <!-- 加载中 -->
    <div class="row">
      <span>加载中:</span>
      <sl-sender-switch kwc:external loading>
        <sl-icon kwc:external slot="icon" name="search"></sl-icon>
        深度搜索
      </sl-sender-switch>
    </div>

    <!-- 受控模式 -->
    <div class="row">
      <span>受控模式:</span>
      <sl-sender-switch kwc:external class="switch-controlled" checked={controlled}>
        <sl-icon kwc:external slot="icon" name="search"></sl-icon>
        深度搜索
      </sl-sender-switch>
      <sl-button kwc:external size="small" onclick={handleToggle}>切换</sl-button>
    </div>
  </div>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/sender-switch/sender-switch.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class SenderSwitchDemo extends KingdeeElement {
  controlled = false;
  _eventsBound = false;

  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    const switchDefault = this.template.querySelector('.switch-default');
    switchDefault.addEventListener('sl-change', () => {
      console.log('默认开关状态:', switchDefault.checked);
    });
  }

  handleToggle() {
    this.controlled = !this.controlled;
  }
}
```

---

## 注意事项

1. **导入路径**：`import '@kdcloudjs/shoelace/dist/components/sender-switch/sender-switch.js';`
2. **事件绑定**：`sl-change` 是 Shoelace 自定义事件，必须在 `renderedCallback()` 中通过 `addEventListener` 绑定
3. **读取状态**：通过 `el.checked` 获取当前选中状态
4. **defaultChecked**：仅在首次渲染时生效，后续需通过 `checked` 属性控制
5. **Slots**：`icon`（图标）、`checked`（选中内容）、`unchecked`（未选中内容）、默认 slot（始终显示）
6. **kwc:external**：`sl-sender-switch`、`sl-icon`、`sl-button` 等所有 `sl-*` 标签都必须添加 `kwc:external`

[返回目录](../index.md)
