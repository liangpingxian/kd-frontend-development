# 插槽填充

[返回目录](../index.md)

## 功能说明

通过 `slotConfig` 将 Sender 切换为结构化输入模式，支持 `text`（纯文本）、`input`（输入框）、`select`（下拉选择）、`tag`（标签）、`content`（可编辑内容块）等类型。配合 `skill` 标识当前技能，使用 `insert`、`clear`、`getValue` 等方法控制输入。

## 示例代码（LWC）

**index.html**
```html
<template>
  <div>
    <div class="actions">
      <sl-button kwc:external size="small" onclick={handleClear}>清空</sl-button>
      <sl-button kwc:external size="small" onclick={handleGetValue}>获取值</sl-button>
      <sl-button kwc:external size="small" onclick={handleInsert}>插入内容</sl-button>
    </div>
    <sl-sender kwc:external
      class="sender"
      placeholder="按 Enter 发送"
    ></sl-sender>
  </div>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class SenderSlotConfig extends KingdeeElement {
  _eventsBound = false;

  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    const sender = this.template.querySelector('.sender');

    // 通过 JS 设置复杂属性
    sender.slotConfig = [
      { type: 'text', value: '我想去 ' },
      { type: 'content', key: 'location', props: { defaultValue: '北京', placeholder: '[输入地点]' } },
      { type: 'text', value: ' 乘坐 ' },
      {
        type: 'select',
        key: 'transport',
        props: {
          defaultValue: 'airplane',
          options: [
            { label: '飞机', value: 'airplane' },
            { label: '高铁', value: 'high-speed-rail' },
            { label: '邮轮', value: 'cruise-ship' }
          ],
          placeholder: '选择交通方式'
        }
      },
      { type: 'text', value: '。请 ' },
      { type: 'tag', key: 'tool', props: { label: '@旅行规划师', value: 'travelTool' } },
      { type: 'text', value: ' 帮我规划，使用账号 ' },
      { type: 'input', key: 'account', props: { placeholder: '输入账号' } },
      { type: 'text', value: '。' }
    ];

    sender.skill = { value: 'travelId', title: '旅行规划', closable: true };

    sender.addEventListener('sl-submit', (e) => {
      console.log('提交:', e.detail.value, e.detail.slotConfig);
      sender.clear();
    });
  }

  handleClear() {
    const sender = this.template.querySelector('.sender');
    sender.clear();
  }

  handleGetValue() {
    const sender = this.template.querySelector('.sender');
    const val = sender.getValue();
    console.log('当前值:', val);
  }

  handleInsert() {
    const sender = this.template.querySelector('.sender');
    sender.insert([
      { type: 'text', value: ' 附加文本' },
      { type: 'content', key: 'extra_' + Date.now(), props: { defaultValue: '默认值' } }
    ]);
  }
}
```

---

## 注意事项

1. **slotConfig 通过 JS 设置**：`slotConfig` 是复杂对象数组，必须在 `renderedCallback()` 中通过 `querySelector` 设置，不能在 HTML 中绑定
2. **key 唯一性**：每个非 `text` 类型的 slot 项必须有唯一的 `key`
3. **insert 方法**：支持 `'start'`、`'end'`、`'cursor'` 三种插入位置，默认为 `'cursor'`
4. **getValue 返回值**：返回 `{ value: string, slotConfig: SlotConfigType[], skill?: SkillType }`，其中 `value` 为拼接后的纯文本
5. **动态切换**：可随时更新 `sender.slotConfig` 和 `sender.skill` 属性切换不同的结构化模板
6. **按钮事件**：`onclick` 是原生事件，可以在 HTML 中绑定

[返回目录](../index.md)
