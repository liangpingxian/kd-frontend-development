# 实例方法

[返回目录](../index.md)

## 功能说明

通过 `this.template.querySelector` 获取 `sl-sender` 实例后，可调用 `focus`、`blur`、`clear`、`insert`、`getValue` 等方法控制输入行为。

## 示例代码（LWC）

**index.html**
```html
<template>
  <div>
    <div class="actions">
      <sl-button kwc:external size="small" onclick={handleInsert}>插入文本</sl-button>
      <sl-button kwc:external size="small" onclick={handleInsertEnd}>插入到末尾</sl-button>
      <sl-button kwc:external size="small" onclick={handleInsertStart}>插入到开头</sl-button>
      <sl-button kwc:external size="small" onclick={handleFocusStart}>聚焦到开头</sl-button>
      <sl-button kwc:external size="small" onclick={handleFocusEnd}>聚焦到末尾</sl-button>
      <sl-button kwc:external size="small" onclick={handleFocusAll}>全选</sl-button>
      <sl-button kwc:external size="small" onclick={handleBlur}>失焦</sl-button>
    </div>
    <sl-sender kwc:external
      class="sender"
      value="你好，欢迎使用 Shoelace！"
      placeholder="输入消息..."
    ></sl-sender>
  </div>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class SenderRefActions extends KingdeeElement {
  handleInsert() {
    const sender = this.template.querySelector('.sender');
    sender.insert([{ type: 'text', value: '插入的文本' }], 'cursor');
  }

  handleInsertEnd() {
    const sender = this.template.querySelector('.sender');
    sender.insert([{ type: 'text', value: '末尾文本' }], 'end');
  }

  handleInsertStart() {
    const sender = this.template.querySelector('.sender');
    sender.insert([{ type: 'text', value: '开头文本' }], 'start');
  }

  handleFocusStart() {
    const sender = this.template.querySelector('.sender');
    sender.focus({ cursor: 'start' });
  }

  handleFocusEnd() {
    const sender = this.template.querySelector('.sender');
    sender.focus({ cursor: 'end' });
  }

  handleFocusAll() {
    const sender = this.template.querySelector('.sender');
    sender.focus({ cursor: 'all' });
  }

  handleBlur() {
    const sender = this.template.querySelector('.sender');
    sender.blur();
  }
}
```

---

## 注意事项

1. **获取实例**：在 LWC 中通过 `this.template.querySelector('.sender')` 获取组件实例
2. **focus 选项**：`cursor` 支持 `'start'`、`'end'`、`'all'`、`'slot'`（聚焦第一个 slot input）
3. **insert 位置**：`'cursor'`（当前光标）、`'start'`（开头）、`'end'`（末尾）
4. **getValue 返回值**：`{ value: string, slotConfig: SlotConfigType[], skill?: SkillType }`
5. **clear 方法**：清空所有输入内容（包括 slot 模式下的结构化内容）
6. **按钮事件**：`onclick` 是原生事件，可以在 HTML 中绑定

[返回目录](../index.md)
