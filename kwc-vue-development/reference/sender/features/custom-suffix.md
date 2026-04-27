# 自定义后缀

[返回目录](../index.md)

## 功能说明

通过 `suffixContent` 属性自定义操作按钮区域。支持 TemplateResult（Lit html 模板）、函数模式（可访问 `SendButton`、`ClearButton`、`LoadingButton`、`SpeechButton` 组件渲染器），或设为 `false` 隐藏默认操作按钮。由于需要使用 lit html 模板，必须通过 ref 设置。

## 示例代码（Vue）— 函数模式（字符计数器）

```vue
<template>
  <sl-sender
    ref="senderRef"
    :value="value"
    placeholder="输入消息（最多 100 字符）..."
    @sl-change="handleChange"
    @sl-submit="handleSubmit"
  ></sl-sender>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { html } from 'lit';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';

const MAX_LENGTH = 100;
const senderRef = ref(null);
const value = ref('');

const updateSuffix = (currentValue) => {
  const sender = senderRef.value;
  if (!sender) return;
  const len = currentValue.length;
  const overLimit = len > MAX_LENGTH;

  sender.suffixContent = (defaultActions, { components }) => {
    const { SendButton } = components;
    return html`
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span style="font-size: 0.75rem; white-space: nowrap; color: ${overLimit ? 'var(--sl-color-danger-600)' : 'var(--sl-color-neutral-400)'};">
          ${len} / ${MAX_LENGTH}
        </span>
        ${SendButton({ disabled: overLimit || len === 0 })}
      </div>
    `;
  };
};

const handleChange = (e) => {
  value.value = e.target.value;
  updateSuffix(value.value);
};

const handleSubmit = (e) => {
  console.log('提交:', e.detail.value);
};

onMounted(() => {
  updateSuffix('');
});
</script>
```

## 示例代码（Vue）— 隐藏后缀

```vue
<template>
  <sl-sender
    ref="senderRef"
    value="隐藏所有操作按钮"
    placeholder="无后缀按钮..."
  ></sl-sender>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';

const senderRef = ref(null);

onMounted(() => {
  const sender = senderRef.value;
  if (sender) {
    sender.suffixContent = false;
  }
});
</script>
```

---

## 注意事项

1. **函数签名**：`(defaultActions, { components }) => BaseNode`，其中 `components` 包含 `SendButton`、`ClearButton`、`LoadingButton`、`SpeechButton`
2. **组件渲染器参数**：每个渲染器接受 `{ disabled?, loading?, label?, title?, onClick? }` 等属性
3. **Lit html 模板**：函数模式返回值需使用 `html` 模板字面量（从 `lit` 导入）
4. **必须通过 ref 设置**：由于 `suffixContent` 需要函数或 lit 模板，无法通过模板属性传递，需在 `onMounted` 或 `watch` 中通过 `senderRef.value.suffixContent = ...` 设置
5. **设为 false**：`sender.suffixContent = false` 完全隐藏默认操作按钮区域
6. **动态更新**：值变化时需重新设置 `suffixContent` 以反映最新状态

[返回目录](../index.md)
