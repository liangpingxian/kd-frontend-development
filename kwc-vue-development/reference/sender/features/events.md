# 事件监听

[返回目录](../index.md)

## 功能说明

`sl-sender` 支持多种事件：`sl-change`（值变化）、`sl-submit`（提交）、`sl-clear`（清空）、`sl-focus`（聚焦）、`sl-blur`（失焦）、`sl-speech-toggle`（语音切换）、`sl-paste`（粘贴）、`sl-paste-file`（粘贴文件）。

## 示例代码（Vue）

```vue
<template>
  <sl-sender
    ref="senderRef"
    placeholder="尝试输入、提交、清空..."
    allowSpeech
    @sl-change="handleChange"
    @sl-submit="handleSubmit"
    @sl-clear="handleClear"
    @sl-focus="handleFocus"
    @sl-blur="handleBlur"
    @sl-paste="handlePaste"
    @sl-paste-file="handlePasteFile"
    @sl-speech-toggle="handleSpeechToggle"
  ></sl-sender>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';

const senderRef = ref(null);

const handleChange = (e) => {
  console.log('sl-change', { value: e.detail.value });
};

const handleSubmit = (e) => {
  console.log('sl-submit', { value: e.detail.value });
  senderRef.value.loading = true;
  setTimeout(() => {
    senderRef.value.loading = false;
  }, 2000);
};

const handleClear = () => {
  console.log('sl-clear');
};

const handleFocus = () => {
  console.log('sl-focus');
};

const handleBlur = () => {
  console.log('sl-blur');
};

const handlePaste = () => {
  console.log('sl-paste');
};

const handlePasteFile = (e) => {
  console.log('sl-paste-file', { count: e.detail.files.length });
};

const handleSpeechToggle = () => {
  console.log('sl-speech-toggle');
};
</script>
```

---

## 注意事项

1. **事件绑定**：所有事件使用 `@sl-*` 前缀绑定，如 `@sl-change`、`@sl-submit`、`@sl-paste-file`
2. **事件对象**：通过 `e.detail` 获取事件数据，通过 `e.target` 获取组件实例
3. **sl-change detail**：普通模式返回 `{ value }`，slot 模式返回 `{ value, slotConfig, skill? }`
4. **sl-submit detail**：与 `sl-change` 结构一致，包含提交时的完整值
5. **禁止原生事件**：不要使用 `@change`、`@input` 等原生事件名监听 Shoelace 组件

[返回目录](../index.md)
