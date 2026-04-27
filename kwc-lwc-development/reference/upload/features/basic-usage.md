# 基础用法

[返回目录](../index.md)

## 功能说明

最简单的用法，点击按钮选择文件上传。通过 `action` 指定上传地址，监听 `sl-change` 获取上传状态。

## 示例代码（LWC）

**index.html**
```html
<template>
  <sl-upload kwc:external action="https://httpbin.org/post">
    <sl-button kwc:external>
      <sl-icon kwc:external slot="prefix" name="upload"></sl-icon>
      Click to Upload
    </sl-button>
  </sl-upload>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/upload/upload.js';

export default class UploadBasicUsage extends KingdeeElement {
  renderedCallback() {
    const upload = this.template.querySelector('sl-upload');
    upload.headers = { authorization: 'authorization-text' };
    upload.addEventListener('sl-change', this.handleChange);
  }

  disconnectedCallback() {
    const upload = this.template.querySelector('sl-upload');
    upload?.removeEventListener('sl-change', this.handleChange);
  }

  handleChange = (e) => {
    const { file, fileList } = e.detail;
    if (file.status === 'done') {
      console.log(`${file.name} file uploaded successfully`);
    } else if (file.status === 'error') {
      console.log(`${file.name} file upload failed.`);
    }
  };
}
```

---

## 注意事项

1. **action 必须有效**：`action` 为上传目标 URL，若服务端不可用文件状态将变为 `error`
2. **headers 通过 JS 属性设置**：`headers` 是对象类型，必须在 `renderedCallback()` 中通过 JS 属性设置，不能作为 HTML 属性传递
3. **事件绑定规范**：在 `renderedCallback()` 中使用 `addEventListener('sl-change', ...)` 绑定事件，在 `disconnectedCallback()` 中移除
4. **kwc:external 必须添加**：所有 Shoelace 组件（`sl-upload`、`sl-button`、`sl-icon`）必须添加 `kwc:external` 属性
5. **文件状态流转**：文件状态依次为 `uploading` → `done`（成功）或 `error`（失败）
