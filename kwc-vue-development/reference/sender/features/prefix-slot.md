# 前缀插槽

[返回目录](../index.md)

## 功能说明

通过 `prefix` 插槽或 `prefixContent` 属性在输入区域左侧添加操作按钮。常用于放置附件按钮、语音按钮等。

## 示例代码（Vue）

```vue
<template>
  <sl-sender
    ref="senderRef"
    placeholder="输入消息..."
    allowSpeech
  ></sl-sender>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { html } from 'lit';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';
import '@kdcloudjs/shoelace/dist/components/icon-button/icon-button.js';

const senderRef = ref(null);

onMounted(() => {
  const sender = senderRef.value;
  if (sender) {
    sender.prefixContent = html`
      <sl-icon-button name="paperclip" label="附件"></sl-icon-button>
    `;
  }
});
</script>
```

---

## 注意事项

1. **prefixContent 属性**：支持 TemplateResult（Lit html 模板）、HTMLElement、函数模式
2. **必须通过 ref 设置**：由于需要 lit html 模板，需在 `onMounted` 中通过 `senderRef.value.prefixContent = ...` 设置
3. **prefix 插槽**：简单场景也可通过 `<sl-icon-button slot="prefix">` 在模板中直接放置
4. **与 suffixContent 配合**：前缀和后缀可同时使用，分别控制输入区域两侧的操作按钮

[返回目录](../index.md)
