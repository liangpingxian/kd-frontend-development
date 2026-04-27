# 自定义头部

[返回目录](../index.md)

## 功能说明

通过 `header` 属性或 `header` 插槽在输入区域上方添加内容。支持 HTMLElement、TemplateResult、函数模式。配合 `sl-sender-header` 子组件可实现可折叠的附件面板或引用面板。

## 示例代码（Vue）— 引用面板

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 0.75rem;">
    <sl-switch :checked="hasRef" @sl-change="hasRef = !hasRef">
      带引用
    </sl-switch>
    <sl-sender
      ref="senderRef"
      placeholder="输入回复..."
      @sl-submit="handleSubmit"
    ></sl-sender>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';
import '@kdcloudjs/shoelace/dist/components/sender-header/sender-header.js';
import '@kdcloudjs/shoelace/dist/components/switch/switch.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';

const senderRef = ref(null);
const hasRef = ref(true);

const updateHeader = (showRef) => {
  const sender = senderRef.value;
  if (!sender) return;

  if (!showRef) {
    sender.header = false;
    return;
  }

  const header = document.createElement('sl-sender-header');
  header.open = true;
  header.addEventListener('sl-open-change', (e) => {
    const open = e.detail.open;
    if (!open) {
      hasRef.value = false;
      sender.header = false;
    }
  });

  const titleSlot = document.createElement('div');
  titleSlot.slot = 'title';
  titleSlot.style.cssText = 'display: flex; align-items: center; gap: 0.5rem;';
  titleSlot.innerHTML = '<sl-icon name="reply"></sl-icon><span style="color: var(--sl-color-neutral-500);">"请告诉我更多关于 Shoelace 组件的信息"</span>';
  header.appendChild(titleSlot);

  sender.header = header;
};

const handleSubmit = (e) => {
  console.log('提交:', e.detail.value);
};

onMounted(() => {
  updateHeader(hasRef.value);
});

watch(hasRef, (val) => {
  updateHeader(val);
});
</script>
```

---

## 注意事项

1. **header 属性类型**：支持 HTMLElement（如 `sl-sender-header`）、TemplateResult、函数 `(defaultHeader, { components }) => BaseNode`、`false`（隐藏）
2. **必须通过 ref 设置**：由于 `header` 需要 HTMLElement 或 lit 模板，需在 `onMounted` 或 `watch` 中通过 `senderRef.value.header = ...` 设置
3. **SlSenderHeader**：可折叠面板组件，通过 `open` 控制展开，`closable` 控制关闭按钮，`sl-open-change` 监听状态变化
4. **header 插槽**：也可通过 `<div slot="header">` 在模板中直接放置头部内容（简单场景）
5. **DOM 操作**：通过 `document.createElement` 创建 `sl-sender-header` 实例并设置属性

[返回目录](../index.md)
