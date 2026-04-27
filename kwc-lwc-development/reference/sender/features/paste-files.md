# 粘贴文件

[返回目录](../index.md)

## 功能说明

监听 `sl-paste-file` 事件捕获用户粘贴的文件（如剪贴板中的图片）。`sl-paste` 事件在所有粘贴操作（包括文本）时触发。这些是 Shoelace 自定义事件，必须在 `renderedCallback()` 中通过 `addEventListener` 绑定。

## 示例代码（LWC）

**index.html**
```html
<template>
  <div>
    <sl-sender kwc:external
      class="sender"
      placeholder="尝试粘贴图片或文件 (Ctrl+V / Cmd+V)..."
    ></sl-sender>
    <div class="file-list">
      <template for:each={files} for:item="file">
        <sl-tag kwc:external
          key={file.id}
          size="small"
          removable
          class="file-tag"
        >
          {file.name} ({file.sizeText})
        </sl-tag>
      </template>
    </div>
    <template if:true={log}>
      <div class="log">{log}</div>
    </template>
  </div>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';
import '@kdcloudjs/shoelace/dist/components/tag/tag.js';

export default class SenderPasteFiles extends KingdeeElement {
  files = [];
  log = '';
  _eventsBound = false;

  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    const sender = this.template.querySelector('.sender');

    sender.addEventListener('sl-paste-file', (e) => {
      const pastedFiles = Array.from(e.detail.files);
      const newFiles = pastedFiles.map((f, i) => ({
        id: Date.now() + '_' + i,
        name: f.name,
        sizeText: (f.size / 1024).toFixed(1) + ' KB',
        raw: f
      }));
      this.files = [...this.files, ...newFiles];
      this.log = '粘贴了 ' + pastedFiles.length + ' 个文件: ' + pastedFiles.map(f => f.name).join(', ');
    });

    sender.addEventListener('sl-submit', (e) => {
      console.log('提交:', e.detail.value, '文件:', this.files.map(f => f.name));
      this.files = [];
      sender.value = '';
    });

    // 绑定 tag 的 sl-remove 事件需要事件委托
    this.template.querySelector('.file-list').addEventListener('sl-remove', (e) => {
      const tag = e.target;
      const key = tag.getAttribute('key');
      this.files = this.files.filter(f => f.id !== key);
    });
  }
}
```

---

## 注意事项

1. **sl-paste-file**：仅在粘贴内容包含文件时触发，`e.detail.files` 为 `FileList`
2. **sl-paste**：所有粘贴操作都会触发，`e.detail.event` 为原始 `ClipboardEvent`
3. **文件类型**：支持图片、文档等任意文件类型，需自行处理文件上传逻辑
4. **事件绑定**：`sl-paste-file` 和 `sl-paste` 是 Shoelace 自定义事件，必须在 `renderedCallback()` 中通过 `addEventListener` 绑定
5. **数据更新**：使用不可变模式更新 `files` 数组：`this.files = [...this.files, ...newFiles]`

[返回目录](../index.md)
