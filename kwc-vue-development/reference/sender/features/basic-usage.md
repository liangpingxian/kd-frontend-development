# 基础用法

[返回目录](../index.md)

## 功能说明

演示 `sl-sender` 的最小可用配置：`value`、`placeholder`、`@sl-submit`，以及 `loading`、`disabled`、`readOnly` 状态。

## 示例代码（Vue）

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <sl-sender
      ref="senderRef"
      :value="value"
      placeholder="请输入消息..."
      @sl-change="handleChange"
      @sl-submit="handleSubmit"
      @sl-cancel="handleCancel"
    ></sl-sender>

    <sl-sender value="加载中状态" loading readOnly></sl-sender>

    <sl-sender value="禁用状态" disabled allowSpeech></sl-sender>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';

const senderRef = ref(null);
const value = ref('Hello, this is Shoelace!');

const handleChange = (e) => {
  value.value = e.target.value;
};

const handleSubmit = (e) => {
  console.log('提交:', e.detail.value);
  senderRef.value.loading = true;
  setTimeout(() => {
    value.value = '';
    senderRef.value.loading = false;
  }, 3000);
};

const handleCancel = () => {
  senderRef.value.loading = false;
};
</script>
```

---

## 注意事项

1. **value 受控**：通过 `@sl-change` 监听值变化并更新 `ref`，实现受控模式
2. **loading 状态**：设置 `senderRef.value.loading = true` 后发送按钮变为取消按钮，点击触发 `sl-cancel` 事件
3. **disabled vs readOnly**：`disabled` 完全禁用交互，`readOnly` 仅阻止编辑但保持内容可见
4. **布尔属性**：`loading`、`disabled`、`readOnly`、`allowSpeech`（布尔模式）直接写属性名即可，无需 `.prop`
