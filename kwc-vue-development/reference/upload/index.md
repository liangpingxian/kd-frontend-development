# Upload 上传组件 Skill

## 组件概述

`sl-upload` 是一个文件选择上传和拖拽上传控件，支持点击上传、拖拽上传、粘贴上传、目录上传等多种模式。提供文件列表展示（文本/图片/卡片/圆形）、上传进度、预览、下载、自定义渲染等完整功能。适用于 KWC Vue 框架。

## 功能列表

| 功能 | 说明 | 详细文档 |
|------|------|----------|
| 基础用法 | action、headers、sl-change 事件监听 | [basic-usage.md](./features/basic-usage.md) |
| 用户头像 | beforeUpload 校验、show-upload-list 隐藏列表、picture-card/circle 模式 | [avatar-upload.md](./features/avatar-upload.md) |
| 已上传文件列表 | defaultFileList 设置初始文件、不同状态展示 | [default-file-list.md](./features/default-file-list.md) |
| 照片墙 | list-type="picture-card" 卡片展示、预览/下载/删除 | [picture-card.md](./features/picture-card.md) |
| 受控文件列表 | fileList 受控管理、sl-change 过滤/限制 | [controlled-file-list.md](./features/controlled-file-list.md) |
| 拖拽上传 | type="drag" 拖放模式、drag-icon/drag-text/drag-hint 插槽 | [drag-upload.md](./features/drag-upload.md) |
| 粘贴上传 | pastable 属性、document paste 事件自动捕获 | [paste-upload.md](./features/paste-upload.md) |
| 目录上传 | directory 属性、上传整个文件夹 | [directory-upload.md](./features/directory-upload.md) |
| 手动上传 | beforeUpload 返回 false、手动发起请求 | [manual-upload.md](./features/manual-upload.md) |
| 上传前校验 | beforeUpload 类型/大小校验 | [before-upload.md](./features/before-upload.md) |
| 图片列表样式 | list-type="picture" 带缩略图列表 | [picture-list.md](./features/picture-list.md) |
| 限制数量 | max-count 限制文件数、max-count=1 替换模式 | [max-count.md](./features/max-count.md) |
| 上传前转换 | beforeUpload 返回 Promise 转换文件 | [transform-file.md](./features/transform-file.md) |
| 自定义文件图标 | iconRender 自定义列表图标 | [custom-icon-render.md](./features/custom-icon-render.md) |
| 自定义交互图标 | showUploadList 对象配置、自定义删除/下载/预览图标 | [custom-interaction-icons.md](./features/custom-interaction-icons.md) |
| 列表拖拽排序 | itemRender 自定义列表项、HTML5 Drag & Drop | [drag-sort.md](./features/drag-sort.md) |
| 自定义进度条 | CSS custom properties 控制进度条样式 | [custom-progress.md](./features/custom-progress.md) |
| 自定义上传 | customRequest 替换默认 XHR 实现 | [custom-request.md](./features/custom-request.md) |
| 多文件上传 | multiple 属性、批量选择 | [multiple-upload.md](./features/multiple-upload.md) |
| 禁用状态 | disabled 禁用上传 | [disabled.md](./features/disabled.md) |

## 核心约束

### 必须遵守的规则

1. **action 必须设置**
   - 使用内置上传时，`action` 为必填的上传目标 URL
   - 若使用 `customRequest`，可不设 `action`

2. **Vue 框架规范**
   - 导入：`import '@kdcloudjs/shoelace/dist/components/upload/upload.js';`
   - **对象/数组类型属性必须使用 `.prop` 修饰符**：`:headers.prop`、`:fileList.prop`、`:defaultFileList.prop`、`:beforeUpload.prop`、`:customRequest.prop` 等
   - 若发现属性在 DOM 上展示为 `[object Object]`，说明缺少 `.prop` 修饰符
   - 事件监听使用 `@sl-change`、`@sl-remove`、`@sl-preview` 等
   - 事件数据通过 `event.detail` 获取
   - 使用 `<script setup>` + Vue3 Composition API

3. **组件标签名**
   - 标签名为 `sl-upload`

4. **受控与非受控模式**
   - 设置 `:fileList.prop` → 受控模式，必须在 `@sl-change` 中手动更新
   - 设置 `:defaultFileList.prop` → 非受控模式，组件自动管理

## 快速开始

### 组件导入

```js
// 必须导入 - Upload 核心组件
import '@kdcloudjs/shoelace/dist/components/upload/upload.js';
```

### 最简示例

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
  const { file } = e.detail;
  if (file.status === 'done') {
    console.log(`${file.name} file uploaded successfully`);
  } else if (file.status === 'error') {
    console.log(`${file.name} file upload failed.`);
  }
};
</script>
```

## API 概览

### Upload 属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `action` | 上传目标 URL | `string` | `''` |
| `method` | HTTP 请求方法 | `'POST' \| 'PUT' \| 'PATCH'` | `'POST'` |
| `name` | FormData 中文件字段名 | `string` | `'file'` |
| `accept` | 接受的文件类型 | `string` | `''` |
| `multiple` | 是否允许多选文件 | `boolean` | `false` |
| `directory` | 是否支持目录上传 | `boolean` | `false` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `type` | 上传模式 | `'select' \| 'drag'` | `'select'` |
| `list-type` | 文件列表展示类型 | `'text' \| 'picture' \| 'picture-card' \| 'picture-circle'` | `'text'` |
| `max-count` | 最大文件数 | `number` | - |
| `show-upload-list` | 是否显示文件列表 | `boolean \| ShowUploadListInterface` | `true` |
| `open-file-dialog-on-click` | 点击触发区域是否打开文件对话框 | `boolean` | `true` |
| `pastable` | 是否支持粘贴上传 | `boolean` | `false` |
| `with-credentials` | 是否携带 Cookie | `boolean` | `false` |
| `headers` | 自定义请求头（需 `.prop`） | `Record<string, string>` | `{}` |
| `data` | 附加表单数据（需 `.prop`） | `Record<string, unknown>` | `{}` |
| `fileList` | 文件列表（受控，需 `.prop`） | `UploadFile[]` | - |
| `defaultFileList` | 默认文件列表（非受控，需 `.prop`） | `UploadFile[]` | `[]` |
| `beforeUpload` | 上传前回调（需 `.prop`） | `(file, fileList) => boolean \| Promise` | - |
| `customRequest` | 自定义上传实现（需 `.prop`） | `(options) => { abort } \| void` | - |
| `isImageUrl` | 自定义图片判断（需 `.prop`） | `(file) => boolean` | - |
| `itemRender` | 自定义列表项渲染（需 `.prop`） | `(file, fileList, actions) => TemplateResult` | - |
| `iconRender` | 自定义文件图标渲染（需 `.prop`） | `(file, listType) => TemplateResult` | - |

### UploadFile 文件对象

| 属性 | 说明 | 类型 |
|------|------|------|
| `uid` | 唯一标识 | `string` |
| `name` | 文件名 | `string` |
| `size` | 文件大小 | `number` |
| `type` | MIME 类型 | `string` |
| `status` | 上传状态 | `'uploading' \| 'done' \| 'error' \| 'removed'` |
| `percent` | 上传进度 | `number` |
| `url` | 文件链接 | `string` |
| `thumbUrl` | 缩略图链接 | `string` |
| `originFileObj` | 原始 File 对象 | `File` |
| `response` | 服务端响应 | `any` |
| `error` | 错误信息 | `any` |

### 主要事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| `sl-change` | 文件状态变更 | `{ file, fileList, event? }` |
| `sl-remove` | 文件被删除（可 preventDefault 取消） | `{ file }` |
| `sl-preview` | 点击预览 | `{ file }` |
| `sl-download` | 点击下载（可 preventDefault 取消） | `{ file }` |
| `sl-drop` | 拖放文件 | `{ event: DragEvent }` |
| `sl-exceed` | 超出 maxCount 限制 | `{ files, maxCount }` |

### 实例方法

| 方法 | 说明 | 参数 |
|------|------|------|
| `openFileDialog()` | 打开文件选择对话框 | - |
| `upload(file)` | 手动触发上传 | `file: File` |
| `abort(uid?)` | 中止上传 | `uid?: string` |

### Slots（插槽）

| Slot | 说明 |
|------|------|
| `(default)` | 触发上传的按钮/内容区域 |
| `drag-icon` | 拖拽区域的图标 |
| `drag-text` | 拖拽区域的文本 |
| `drag-hint` | 拖拽区域的提示文字 |
| `tip` | 上传组件下方的帮助提示 |

### CSS Parts

| Part 名称 | 说明 |
|-----------|------|
| `base` | 根容器 |
| `trigger` | 上传触发区域 |
| `drag-area` | 拖拽区域 |
| `list` | 文件列表容器 |
| `list-item` | 单个文件列表项 |
| `list-item-name` | 文件名 |
| `list-item-actions` | 操作按钮区域 |
| `list-item-extra` | 额外信息区域 |
| `list-item-progress` | 进度条容器 |

### CSS 设计变量

| Token 名称 | 说明 |
|-----------|------|
| `--sl-upload-progress-height` | 进度条高度（默认 2px） |
| `--sl-upload-progress-track-color` | 进度条轨道颜色 |
| `--sl-upload-progress-indicator-color` | 进度条指示器颜色 |
| `--sl-upload-progress-label-color` | 进度条标签颜色 |

## 使用建议

1. **受控 vs 非受控**：简单场景用 `:defaultFileList.prop`（非受控），需要过滤/限制/联动时用 `:fileList.prop`（受控）并在 `@sl-change` 中手动更新
2. **`.prop` 修饰符**：所有对象/数组/函数类型的属性（`headers`、`data`、`fileList`、`beforeUpload` 等）必须使用 `:propName.prop` 传递
3. **文件校验**：通过 `:beforeUpload.prop` 传递校验函数，返回 `false` 阻止上传
4. **响应式数据**：在 Vue 中使用 `ref` 或 `reactive` 包裹 `fileList`，修改后通过 `.prop` 传递即可触发组件更新
5. **照片墙模式**：`list-type` 设为 `picture-card` 或 `picture-circle` 时，组件自动展示上传卡片
6. **大文件上传**：通过 `:customRequest.prop` 实现分片上传、断点续传等自定义逻辑
