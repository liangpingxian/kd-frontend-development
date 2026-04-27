# 基础用法

[返回目录](../index.md)

## 功能说明

最简单的用法，点击按钮选择文件上传。通过 `action` 指定上传地址，监听 `@sl-change` 获取上传状态。

## 示例代码（Vue）

```vue
<template>
  <sl-upload
    action="https://httpbin.org/post"
    :headers.prop="headers"
    @sl-change="handleChange"
  >
    <sl-button>
      <sl-icon slot="prefix" name="upload"></sl-icon>
      Click to Upload
    </sl-button>
  </sl-upload>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/upload/upload.js';

const headers = { authorization: 'authorization-text' };

const handleChange = (e) => {
  const { file, fileList } = e.detail;
  if (file.status === 'done') {
    console.log(`${file.name} file uploaded successfully`);
  } else if (file.status === 'error') {
    console.log(`${file.name} file upload failed.`);
  }
};
</script>
```

---

## 注意事项

1. **action 必须有效**：`action` 为上传目标 URL，若服务端不可用文件状态将变为 `error`
2. **headers 必须用 `.prop`**：`headers` 是对象类型，必须使用 `:headers.prop` 传递，否则渲染为 `[object Object]`
3. **事件数据在 detail 中**：`@sl-change` 的回调通过 `e.detail` 获取 `{ file, fileList }`
4. **文件状态流转**：文件状态依次为 `uploading` → `done`（成功）或 `error`（失败）
5. **响应式数据**：在 Vue 中使用 `ref` 包裹 `fileList` 可实现受控模式的响应式更新
