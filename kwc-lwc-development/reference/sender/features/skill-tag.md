# 技能标签

[返回目录](../index.md)

## 功能说明

通过 `skill` 属性为 Sender 添加技能标签，标识当前使用的 AI 技能或代理。支持显示标题、可关闭、关闭回调等配置。`skill` 是复杂对象属性，必须通过 JS 设置。

## 示例代码（LWC）

**index.html**
```html
<template>
  <div>
    <div class="actions">
      <sl-button kwc:external size="small" onclick={switchSearch}>深度搜索</sl-button>
      <sl-button kwc:external size="small" onclick={switchCode}>代码助手</sl-button>
      <sl-button kwc:external size="small" onclick={switchWriting}>写作助手</sl-button>
    </div>
    <sl-sender kwc:external
      class="sender"
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

const skills = {
  search: { value: 'deepSearch', title: '深度搜索', closable: true },
  code: { value: 'aiCode', title: '代码助手', closable: true },
  writing: {
    value: 'writing',
    title: '写作助手',
    closable: {
      onClose: () => console.log('写作助手已关闭'),
      disabled: false
    }
  }
};

export default class SenderSkillTag extends KingdeeElement {
  _eventsBound = false;

  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    const sender = this.template.querySelector('.sender');
    // 设置默认技能
    sender.skill = { ...skills.search };
  }

  switchSearch() {
    const sender = this.template.querySelector('.sender');
    sender.skill = { ...skills.search };
  }

  switchCode() {
    const sender = this.template.querySelector('.sender');
    sender.skill = { ...skills.code };
  }

  switchWriting() {
    const sender = this.template.querySelector('.sender');
    sender.skill = { ...skills.writing };
  }
}
```

---

## 注意事项

1. **skill 对象**：`value` 为必填字段，用于标识技能；`title` 为显示文本
2. **closable 配置**：布尔值 `true` 显示关闭按钮；对象模式支持 `onClose` 回调和 `disabled` 禁用关闭
3. **通过 JS 设置**：`skill` 是复杂对象，必须在 JS 中通过 `querySelector` 设置
4. **动态切换**：直接更新 `sender.skill` 属性即可切换技能标签
5. **与 slotConfig 配合**：通常 `skill` 和 `slotConfig` 一起使用，切换技能时同步更新结构化模板

[返回目录](../index.md)
