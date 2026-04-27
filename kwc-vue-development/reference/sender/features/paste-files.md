# 粘贴文件

[返回目录](../index.md)

## 功能说明

监听 `sl-paste-file` 事件捕获用户粘贴的文件（如剪贴板中的图片）。`sl-paste` 事件在所有粘贴操作（包括文本）时触发。

## 示例代码（Vue）

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <sl-sender
      ref="senderRef"
      placeholder="尝试粘贴图片或文件 (Ctrl+V / Cmd+V)..."
      @sl-paste-file="handlePasteFile"
      @sl-submit="handleSubmit"
    ></sl-sender>
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
      <sl-tag
        v-for="(file, index) in files"
        :key="index"
        size="small"
        removable
        @sl-remove="handleRemoveFile(index)"
      >
        {{ file.name }} ({{ (file.size / 1024).toFixed(1) }} KB)
      </sl-tag>
    </div>
    <div v-if="log" style="font-size: 0.8rem; color: var(--sl-color-neutral-500);">
      {{ log }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';
import '@kdcloudjs/shoelace/dist/components/tag/tag.js';

const senderRef = ref(null);
const files = ref([]);
const log = ref('');

const handlePasteFile = (e) => {
  const pastedFiles = Array.from(e.detail.files);
  files.value = [...files.value, ...pastedFiles];
  log.value = `粘贴了 ${pastedFiles.length} 个文件: ${pastedFiles.map(f => f.name).join(', ')}`;
};

const handleRemoveFile = (index) => {
  files.value = files.value.filter((_, i) => i !== index);
};

const handleSubmit = (e) => {
  console.log('提交:', e.detail.value, '文件:', files.value.map(f => f.name));
  files.value = [];
  senderRef.value.value = '';
};
</script>
```

---

## 注意事项

1. **sl-paste-file**：仅在粘贴内容包含文件时触发，`detail.files` 为 `FileList`
2. **sl-paste**：所有粘贴操作都会触发，`detail.event` 为原始 `ClipboardEvent`
3. **文件类型**：支持图片、文档等任意文件类型，需自行处理文件上传逻辑
4. **不可变更新**：更新文件列表时使用 `files.value = [...files.value, ...newFiles]`，不要使用 `push`

[返回目录](../index.md)
