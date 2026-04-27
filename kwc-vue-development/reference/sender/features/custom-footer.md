# 自定义尾部

[返回目录](../index.md)

## 功能说明

通过 `footer` 属性或 `footer` 插槽在输入区域下方添加工具栏。支持 TemplateResult、函数模式（可访问组件渲染器）。常用于放置功能开关、附件按钮、发送按钮等。

## 示例代码（Vue）

```vue
<template>
  <sl-sender
    ref="senderRef"
    placeholder="按 Enter 发送消息"
    @sl-submit="handleSubmit"
  ></sl-sender>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { html } from 'lit';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';
import '@kdcloudjs/shoelace/dist/components/icon-button/icon-button.js';

const senderRef = ref(null);
const loading = ref(false);

const updateFooter = () => {
  const sender = senderRef.value;
  if (!sender) return;

  // 隐藏默认后缀按钮
  sender.suffixContent = false;

  sender.footer = (defaultFooter, { components }) => {
    return html`
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0 0.25rem;">
        <div style="display: flex; align-items: center; gap: 0.25rem;">
          <sl-icon-button name="paperclip" label="附件"></sl-icon-button>
          <sl-icon-button name="search" label="搜索"></sl-icon-button>
        </div>
        <div style="display: flex; align-items: center; gap: 0.25rem;">
          ${loading.value
            ? components.LoadingButton({ title: '点击取消' })
            : components.SendButton({})}
        </div>
      </div>
    `;
  };
};

const handleSubmit = (e) => {
  console.log('提交:', e.detail.value);
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    const sender = senderRef.value;
    if (sender) sender.value = '';
  }, 2000);
};

onMounted(() => {
  updateFooter();
});

watch(loading, () => {
  updateFooter();
});
</script>
```

---

## 注意事项

1. **footer 函数签名**：`(defaultFooter, { components }) => BaseNode`，与 `suffixContent` 函数签名一致
2. **必须通过 ref 设置**：由于 `footer` 需要 lit html 模板，需在 `onMounted` 或 `watch` 中通过 `senderRef.value.footer = ...` 设置
3. **配合 suffixContent**：使用 footer 工具栏时通常需要设置 `sender.suffixContent = false` 隐藏默认操作按钮
4. **footer 插槽**：也可通过 `<div slot="footer">` 在模板中直接放置尾部内容（简单场景）
5. **Lit html 模板**：函数模式返回值需使用 `html` 模板字面量（从 `lit` 导入）
6. **动态更新**：状态变化时需重新调用设置函数以更新 footer 内容

[返回目录](../index.md)
