# Image 图片

展示图片，支持预览、缩放、旋转、翻转等功能。配合 `sl-image-preview-group` 可实现多图切换预览和相册模式。

## 特性概览

- **图片展示**：通过 `src`、`width`、`height`、`alt` 控制图片基本展示
- **预览功能**：点击图片打开全屏预览，支持缩放、旋转、翻转、拖拽移动
- **渐进加载**：通过 `placeholder` 属性显示占位内容，加载完成后自动淡出
- **容错处理**：通过 `fallback` 属性设置加载失败时的回退图片
- **多图预览**：使用 `sl-image-preview-group` 包裹多个 `sl-image`，支持切换预览
- **相册模式**：通过 `items` 属性传入图片列表，单缩略图预览所有图片
- **遮罩层定制**：通过 `preview.mask` 配置遮罩效果，`cover` slot 自定义遮罩内容
- **自定义工具栏**：通过 `preview.actionsRender` 自定义预览工具栏
- **自定义预览内容**：通过 `preview.imageRender` 自定义预览区域（如视频播放器）

## SlImagePreviewConfig 预览配置

`preview` 属性的配置结构如下：

| 属性             | 说明                               | 类型                                         | 默认值     |
| ---------------- | ---------------------------------- | -------------------------------------------- | ---------- |
| `open`           | 是否显示预览（受控）               | `boolean`                                    | -          |
| `src`            | 预览图片 src（可与缩略图不同）     | `string`                                     | -          |
| `scaleStep`      | 缩放步长                           | `number`                                     | `0.5`      |
| `minScale`       | 最小缩放倍数                       | `number`                                     | `1`        |
| `maxScale`       | 最大缩放倍数                       | `number`                                     | `50`       |
| `mask`           | 遮罩层配置；`false` 隐藏遮罩       | `boolean \| { blur?: boolean }`              | `true`     |
| `cover`          | 自定义 cover 内容                  | `string`                                     | -          |
| `coverPlacement` | cover 位置                         | `'center' \| 'top' \| 'bottom'`              | `'center'` |
| `movable`        | 是否可移动                         | `boolean`                                    | `true`     |
| `closeIcon`      | 自定义关闭图标                     | `TemplateResult`                             | -          |
| `onOpenChange`   | open 状态变化回调                  | `(open: boolean) => void`                    | -          |
| `onTransform`    | 预览变换变化回调                   | `(info: { transform, action }) => void`      | -          |
| `actionsRender`  | 自定义预览工具栏渲染               | `(originalNode, info) => TemplateResult`     | -          |
| `imageRender`    | 自定义预览内容渲染                 | `(originalNode, info) => TemplateResult`     | -          |

## SlPreviewGroupConfig 群组预览配置

`sl-image-preview-group` 的 `preview` 属性配置：

| 属性             | 说明                               | 类型                                         | 默认值     |
| ---------------- | ---------------------------------- | -------------------------------------------- | ---------- |
| `open`           | 是否显示预览（受控）               | `boolean`                                    | -          |
| `current`        | 当前预览图索引（受控）             | `number`                                     | -          |
| `scaleStep`      | 缩放步长                           | `number`                                     | `0.5`      |
| `minScale`       | 最小缩放倍数                       | `number`                                     | `1`        |
| `maxScale`       | 最大缩放倍数                       | `number`                                     | `50`       |
| `mask`           | 遮罩效果                           | `boolean \| { enabled?, blur? }`             | `true`     |
| `movable`        | 是否可移动                         | `boolean`                                    | `true`     |
| `closeIcon`      | 自定义关闭图标                     | `TemplateResult`                             | -          |
| `onOpenChange`   | open 状态变化回调                  | `(visible, { current }) => void`             | -          |
| `onChange`        | 切换图片回调                       | `(current, prev) => void`                    | -          |
| `onTransform`    | 变换变化回调                       | `(info: { transform, action }) => void`      | -          |
| `countRender`    | 自定义计数内容                     | `(current, total) => string \| TemplateResult` | -        |
| `actionsRender`  | 自定义工具栏渲染                   | `(originalNode, info) => TemplateResult`     | -          |
| `imageRender`    | 自定义预览内容渲染                 | `(originalNode, info) => TemplateResult`     | -          |

## 基础用法

最简单的用法，点击图片可预览。

**index.html**

```html
<template>
  <sl-image kwc:external class="image-el" width="200" alt="示例图片"
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
  ></sl-image>
</template>
```

**index.js**

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/image/image.js';

export default class ImageBasic extends KingdeeElement {}
```

## 容错处理

加载失败时显示回退图片。

**index.html**

```html
<template>
  <sl-image kwc:external class="image-el" width="200" height="200" alt="容错图片"
    src="error"
    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7..."
  ></sl-image>
</template>
```

**index.js**

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/image/image.js';

export default class ImageFallback extends KingdeeElement {}
```

## 渐进加载

大图加载时，可通过 `placeholder` 属性显示占位内容。

**index.html**

```html
<template>
  <div style="display: flex; gap: 16px;">
    <!-- 默认占位符 -->
    <sl-image kwc:external class="img-default" width="200" alt="默认占位符"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      placeholder="true"
    ></sl-image>

    <!-- 模糊缩略图占位 -->
    <sl-image kwc:external class="img-blur" width="200" alt="模糊缩略图占位"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      placeholder="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
    ></sl-image>

    <!-- 自定义 Slot 占位 -->
    <sl-image kwc:external class="img-slot" width="200" alt="自定义占位"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      placeholder="true"
    >
      <sl-image kwc:external slot="placeholder" width="200" no-preview="true" alt="占位图"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
      ></sl-image>
    </sl-image>
  </div>
</template>
```

**index.js**

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/image/image.js';

export default class ImagePlaceholder extends KingdeeElement {}
```

## 多张图片预览

使用 `sl-image-preview-group` 包裹多个 `sl-image`，支持多图切换预览。

**index.html**

```html
<template>
  <sl-image-preview-group kwc:external>
    <sl-image kwc:external width="200" alt="图片1"
      src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
    ></sl-image>
    <sl-image kwc:external width="200" alt="图片2"
      src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
    ></sl-image>
  </sl-image-preview-group>
</template>
```

**index.js**

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/image/image.js';
import '@kdcloudjs/shoelace/dist/components/image-preview-group/image-preview-group.js';

export default class ImagePreviewGroup extends KingdeeElement {}
```

## 相册模式

使用 `items` 属性传入图片列表，只展示一张缩略图，预览时可切换所有图片。

**index.html**

```html
<template>
  <sl-image-preview-group kwc:external class="group-el">
    <sl-image kwc:external width="200" alt="图片预览" class="thumb-el"></sl-image>
  </sl-image-preview-group>
</template>
```

**index.js**

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/image/image.js';
import '@kdcloudjs/shoelace/dist/components/image-preview-group/image-preview-group.js';

const imageItems = [
  'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
  'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
  'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
];

export default class ImageAlbum extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const group = this.template.querySelector('.group-el');
    const thumb = this.template.querySelector('.thumb-el');
    if (group) group.items = imageItems;
    if (thumb) thumb.src = imageItems[0];
  }
}
```

## 禁用预览

设置 `no-preview` 属性禁用图片预览功能。

**index.html**

```html
<template>
  <sl-image kwc:external width="200" alt="禁用预览" no-preview="true"
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
  ></sl-image>
</template>
```

## 自定义预览图片

通过 JS 设置 `preview` 对象属性，指定与缩略图不同的预览大图。

**index.html**

```html
<template>
  <sl-image kwc:external class="preview-src-el" width="200" alt="预览大图"
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
  ></sl-image>
</template>
```

**index.js**

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/image/image.js';

export default class ImagePreviewSrc extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.preview-src-el');
    if (el) {
      el.preview = {
        src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      };
    }
  }
}
```

## 遮罩层模糊效果

通过 `preview.mask` 配置遮罩层效果。

**index.html**

```html
<template>
  <div style="display: flex; gap: 16px;">
    <sl-image kwc:external class="mask-blur-el" width="100" alt="模糊遮罩"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    >
      <span slot="cover">模糊遮罩</span>
    </sl-image>
    <sl-image kwc:external width="100" alt="普通遮罩"
      src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
    >
      <span slot="cover">普通遮罩</span>
    </sl-image>
    <sl-image kwc:external class="mask-none-el" width="100" alt="无遮罩"
      src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
    >
      <span slot="cover">无遮罩</span>
    </sl-image>
  </div>
</template>
```

**index.js**

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/image/image.js';

export default class ImageMask extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const blur = this.template.querySelector('.mask-blur-el');
    const none = this.template.querySelector('.mask-none-el');
    if (blur) blur.preview = { mask: { blur: true } };
    if (none) none.preview = { mask: false };
  }
}
```

## 自定义遮罩文本

通过 `cover` slot 自定义遮罩层显示的内容。

**index.html**

```html
<template>
  <sl-image kwc:external width="96" alt="自定义遮罩"
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
  >
    <span slot="cover">🔍 示例</span>
  </sl-image>
</template>
```

## 自定义遮罩位置

通过 `preview.coverPlacement` 设置遮罩层位置。

**index.html**

```html
<template>
  <div style="display: flex; gap: 16px;">
    <sl-image kwc:external class="cover-center" width="96" alt="居中"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    >
      <span slot="cover">居中</span>
    </sl-image>
    <sl-image kwc:external class="cover-top" width="96" alt="顶部"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    >
      <span slot="cover">顶部</span>
    </sl-image>
    <sl-image kwc:external class="cover-bottom" width="96" alt="底部"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    >
      <span slot="cover">底部</span>
    </sl-image>
  </div>
</template>
```

**index.js**

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/image/image.js';

export default class ImageCoverPlacement extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const center = this.template.querySelector('.cover-center');
    const top = this.template.querySelector('.cover-top');
    const bottom = this.template.querySelector('.cover-bottom');
    if (center) center.preview = { coverPlacement: 'center' };
    if (top) top.preview = { coverPlacement: 'top' };
    if (bottom) bottom.preview = { coverPlacement: 'bottom' };
  }
}
```

## 自定义工具栏

通过 `preview.actionsRender` 自定义预览工具栏。回调需使用 Lit `html` 模板。

**index.html**

```html
<template>
  <sl-image kwc:external class="actions-el" width="200" alt="自定义工具栏"
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
  ></sl-image>
</template>
```

**index.js**

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import { html } from 'lit';
import '@kdcloudjs/shoelace/dist/components/image/image.js';

export default class ImageActionsRender extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.actions-el');
    if (el) {
      el.preview = {
        actionsRender: (originalNode, { actions, transform, icons }) => html`
          <sl-space size="12" align="center" class="preview__actions">
            <button class="preview__action" @click=${actions.onFlipX}>${icons.flipXIcon}</button>
            <button class="preview__action" @click=${actions.onFlipY}>${icons.flipYIcon}</button>
            <button class="preview__action" @click=${actions.onRotateLeft}>${icons.rotateLeftIcon}</button>
            <button class="preview__action" @click=${actions.onRotateRight}>${icons.rotateRightIcon}</button>
            <button class="preview__action" @click=${actions.onZoomOut}>${icons.zoomOutIcon}</button>
            <button class="preview__action" @click=${actions.onZoomIn}>${icons.zoomInIcon}</button>
            <span style="color: rgba(255,255,255,0.65); font-size: 14px;">${Math.round(transform.scale * 100)}%</span>
          </sl-space>
        `,
      };
    }
  }
}
```

## 自定义预览内容

通过 `preview.imageRender` 自定义预览区域内容，例如替换为视频播放器。

**index.html**

```html
<template>
  <sl-image kwc:external class="render-el" width="200" alt="自定义预览内容"
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
  ></sl-image>
</template>
```

**index.js**

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import { html } from 'lit';
import '@kdcloudjs/shoelace/dist/components/image/image.js';

export default class ImageRender extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.render-el');
    if (el) {
      el.preview = {
        imageRender: () => html`
          <video muted width="100%" controls
            src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*uYT7SZwhJnUAAAAAAAAAAAAADgCCAQ"
            style="max-height: 70vh;"
          ></video>
        `,
      };
    }
  }
}
```

## 嵌套使用

`sl-image` 可以嵌套在其他组件中使用。

**index.html**

```html
<template>
  <sl-card kwc:external style="max-width: 300px;">
    <sl-image kwc:external slot="image" alt="嵌套在卡片中"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    ></sl-image>
    <span>卡片中的图片</span>
  </sl-card>
</template>
```

**index.js**

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/image/image.js';
import '@kdcloudjs/shoelace/dist/components/card/card.js';

export default class ImageNested extends KingdeeElement {}
```

## 监听事件

在 `renderedCallback()` 中使用 `addEventListener` 绑定事件，并在 `disconnectedCallback()` 中移除。

**index.html**

```html
<template>
  <sl-image kwc:external class="event-el" width="200" alt="事件监听"
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
  ></sl-image>
</template>
```

**index.js**

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/image/image.js';

export default class ImageEvents extends KingdeeElement {
  _handleLoad = () => console.log('图片加载成功');
  _handleError = () => console.log('图片加载失败');
  _handlePreviewOpen = () => console.log('预览已打开');
  _handlePreviewClose = () => console.log('预览已关闭');

  renderedCallback() {
    if (this._init) return;
    this._init = true;
    this._el = this.template.querySelector('.event-el');
    if (this._el) {
      this._el.addEventListener('sl-load', this._handleLoad);
      this._el.addEventListener('sl-error', this._handleError);
      this._el.addEventListener('sl-preview-open', this._handlePreviewOpen);
      this._el.addEventListener('sl-preview-close', this._handlePreviewClose);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._el) {
      this._el.removeEventListener('sl-load', this._handleLoad);
      this._el.removeEventListener('sl-error', this._handleError);
      this._el.removeEventListener('sl-preview-open', this._handlePreviewOpen);
      this._el.removeEventListener('sl-preview-close', this._handlePreviewClose);
    }
  }
}
```

## Properties

### sl-image 属性

| 属性          | 描述                                                     | 类型                     | 默认值  |
| ------------- | -------------------------------------------------------- | ------------------------ | ------- |
| src           | 图片地址                                                 | `string`                 | `''`    |
| alt           | 图片替代文本                                             | `string`                 | `''`    |
| width         | 图片宽度                                                 | `string`                 | -       |
| height        | 图片高度                                                 | `string`                 | -       |
| fallback      | 加载失败时的回退图片地址                                 | `string`                 | -       |
| placeholder   | 加载占位图；`"true"` 显示默认占位符，字符串作为占位图 src | `boolean \| string`     | -       |
| no-preview    | 是否禁用预览                                             | `boolean`                | `false` |
| preview       | 预览配置对象（**通过 JS 属性设置**）                     | `SlImagePreviewConfig`   | -       |
| in-group      | 是否在 group 中（由 group 自动设置）                     | `boolean`                | `false` |

### sl-image-preview-group 属性

| 属性          | 描述                                                     | 类型                                          | 默认值  |
| ------------- | -------------------------------------------------------- | --------------------------------------------- | ------- |
| preview       | 预览配置（**通过 JS 属性设置**），`false` 禁用           | `false \| SlPreviewGroupConfig`               | -       |
| items         | 预览图片数组（**通过 JS 属性设置**）                     | `(string \| { src, alt?, crossOrigin? })[]`   | -       |
| fallback      | 加载失败容错地址                                         | `string`                                      | -       |

## Events

### sl-image 事件

| 事件名称         | 描述             | 事件详情   |
| ---------------- | ---------------- | ---------- |
| sl-load          | 图片加载成功     | -          |
| sl-error         | 图片加载失败     | -          |
| sl-preview-open  | 预览打开         | -          |
| sl-preview-close | 预览关闭         | -          |
| sl-image-click   | group 中图片被点击 | `{ src }` |

### sl-image-preview-group 事件

| 事件名称           | 描述               | 事件详情            |
| ------------------ | ------------------ | ------------------- |
| sl-preview-open    | 预览打开           | -                   |
| sl-preview-close   | 预览关闭           | -                   |
| sl-preview-change  | 预览图片切换       | `{ current, prev }` |

## Slots

### sl-image 插槽

| 插槽名        | 描述                           |
| ------------- | ------------------------------ |
| placeholder   | 自定义加载占位内容             |
| cover         | 自定义遮罩层内容               |

### sl-image-preview-group 插槽

| 插槽名        | 描述                           |
| ------------- | ------------------------------ |
| (default)     | 放置 sl-image 组件             |

## CSS Parts

### sl-image

| Part 名称     | 描述           |
| ------------- | -------------- |
| base          | 根容器         |
| img           | 图片元素       |
| placeholder   | 占位符容器     |
| cover         | 遮罩层容器     |

### 预览层（sl-image 和 sl-image-preview-group 共享）

| Part 名称       | 描述           |
| --------------- | -------------- |
| preview-mask    | 预览遮罩背景   |
| preview-body    | 预览主体       |
| preview-img     | 预览图片       |
| preview-actions | 预览工具栏     |
| preview-close   | 预览关闭按钮   |
| preview-counter | 预览计数器（仅 group） |

## 最佳实践

### 1. 正确导入组件

```javascript
import '@kdcloudjs/shoelace/dist/components/image/image.js';
import '@kdcloudjs/shoelace/dist/components/image-preview-group/image-preview-group.js';
```

### 2. 所有 Shoelace 组件必须添加 `kwc:external` 属性

```html
<sl-image kwc:external></sl-image>
<sl-image-preview-group kwc:external></sl-image-preview-group>
```

### 3. 对象/数组属性通过 JS 设置

`preview` 和 `items` 是对象/数组类型，不能作为 HTML attribute，需要通过 JS 属性赋值：

```javascript
renderedCallback() {
  const el = this.template.querySelector('.image-el');
  el.preview = { src: 'large.png', mask: { blur: true } };
  el.items = ['img1.png', 'img2.png'];
}
```

### 4. 布尔属性必须显式赋值

```html
<!-- 正确 -->
<sl-image kwc:external no-preview="true"></sl-image>
<sl-image kwc:external placeholder="true"></sl-image>

<!-- 错误：LWC 中不能省略值 -->
<sl-image kwc:external no-preview></sl-image>
```

### 5. 事件在 renderedCallback 中绑定，disconnectedCallback 中移除

```javascript
renderedCallback() {
  this._el = this.template.querySelector('.image-el');
  this._el.addEventListener('sl-load', this._handleLoad);
}

disconnectedCallback() {
  super.disconnectedCallback();
  this._el?.removeEventListener('sl-load', this._handleLoad);
}
```

### 6. actionsRender 和 imageRender 使用 Lit html 模板

```javascript
import { html } from 'lit';

el.preview = {
  actionsRender: (_, { actions, icons }) => html`
    <button @click=${actions.onZoomIn}>${icons.zoomInIcon}</button>
  `,
};
```

## 常见问题

### Q: 为什么通过 HTML 设置 preview 无效？

A: `preview` 是对象类型，不能作为 HTML attribute 传递。必须在 `renderedCallback()` 中通过 JS 属性赋值：`el.preview = { ... }`。

### Q: 如何实现缩略图和预览大图不同？

A: 通过 JS 设置 `el.preview = { src: '大图URL' }`，缩略图使用 `src` attribute 的压缩图。

### Q: actionsRender 的回调模板怎么写？

A: 必须使用 Lit 的 `html` 模板字面量（`import { html } from 'lit'`），预览层通过 Portal 渲染，不支持 LWC 模板。

### Q: sl-image-preview-group 的 items 和 slot 内子组件有什么区别？

A: 设置 `items` 后预览列表由 `items` 决定，slot 中的 `sl-image` 仅作为缩略图。未设置 `items` 时，由 slot 中的 `sl-image` 子组件自动收集。

### Q: 预览支持哪些交互？

A: 支持鼠标滚轮缩放、拖拽移动、双击复位、Escape 关闭。在 group 模式下还支持 ArrowLeft/ArrowRight 键盘切换图片。
