# Space 间距

用于设置组件之间的间距，避免组件紧贴在一起，适合行内元素的水平或垂直间距布局。

## 特性概览

- **灵活间距**：支持 `small`、`medium`、`large` 预设大小或自定义数值
- **方向控制**：支持水平（`horizontal`）和垂直（`vertical`）两种排列方向
- **对齐方式**：支持 `start`、`end`、`center`、`baseline` 四种对齐方式
- **自动换行**：支持 `wrap` 属性实现空间不足时自动换行
- **分隔符**：支持通过 `separator` 属性在子元素之间插入分隔内容
- **CSS 变量**：支持通过 `--gap` 自定义间距

## 基础用法

最简单的用法，在一行内排列多个元素并设置间距。

```html
<template>
  <sl-space kwc:external class="space-basic">
    <sl-button kwc:external>按钮1</sl-button>
    <sl-button kwc:external>按钮2</sl-button>
    <sl-button kwc:external>按钮3</sl-button>
  </sl-space>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class SpaceBasic extends KingdeeElement {}
```

## 垂直间距

使用 `orientation="vertical"` 可以设置垂直方向排列。

```html
<template>
  <sl-space kwc:external class="space-vertical" orientation="vertical">
    <sl-button kwc:external>按钮1</sl-button>
    <sl-button kwc:external>按钮2</sl-button>
    <sl-button kwc:external>按钮3</sl-button>
  </sl-space>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class SpaceVertical extends KingdeeElement {}
```

## 间距大小

通过 `size` 属性设置间距大小，可选值为 `small`、`medium`、`large`，默认为 `small`。

```html
<template>
  <div class="space-demo">
    <sl-space kwc:external class="space-small" size="small">
      <sl-button kwc:external>Small</sl-button>
      <sl-button kwc:external>Small</sl-button>
      <sl-button kwc:external>Small</sl-button>
    </sl-space>

    <sl-space kwc:external class="space-medium" size="medium">
      <sl-button kwc:external>Medium</sl-button>
      <sl-button kwc:external>Medium</sl-button>
      <sl-button kwc:external>Medium</sl-button>
    </sl-space>

    <sl-space kwc:external class="space-large" size="large">
      <sl-button kwc:external>Large</sl-button>
      <sl-button kwc:external>Large</sl-button>
      <sl-button kwc:external>Large</sl-button>
    </sl-space>
  </div>
</template>
```

```css
.space-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class SpaceSize extends KingdeeElement {}
```

## 自定义间距

`size` 也可以设置为具体的数值（单位为 px）。通过 JavaScript 动态设置 `size` 属性。

```html
<template>
  <sl-space kwc:external class="space-custom">
    <sl-button kwc:external>按钮1</sl-button>
    <sl-button kwc:external>按钮2</sl-button>
    <sl-button kwc:external>按钮3</sl-button>
  </sl-space>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class SpaceCustomSize extends KingdeeElement {
  renderedCallback() {
    if (this._initialized) return;
    this._initialized = true;
    const space = this.template.querySelector('.space-custom');
    if (space) {
      space.size = 24;
    }
  }
}
```

## 数组形式间距

`size` 可以传入数组 `[水平间距, 垂直间距]` 分别设置水平和垂直方向的间距。

```html
<template>
  <sl-space kwc:external class="space-array" wrap>
    <sl-button kwc:external>按钮1</sl-button>
    <sl-button kwc:external>按钮2</sl-button>
    <sl-button kwc:external>按钮3</sl-button>
    <sl-button kwc:external>按钮4</sl-button>
    <sl-button kwc:external>按钮5</sl-button>
  </sl-space>
</template>
```

```css
.space-array {
  width: 300px;
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class SpaceArraySize extends KingdeeElement {
  renderedCallback() {
    if (this._initialized) return;
    this._initialized = true;
    const space = this.template.querySelector('.space-array');
    if (space) {
      space.size = [16, 24];
    }
  }
}
```

## 对齐方式

通过 `align` 属性设置对齐方式，可选值为 `start`、`end`、`center`、`baseline`。

```html
<template>
  <div class="space-demo">
    <sl-space kwc:external align="start">
      <span class="demo-box">Start</span>
      <sl-button kwc:external size="small">小按钮</sl-button>
      <sl-button kwc:external size="large">大按钮</sl-button>
    </sl-space>

    <sl-space kwc:external align="center">
      <span class="demo-box">Center</span>
      <sl-button kwc:external size="small">小按钮</sl-button>
      <sl-button kwc:external size="large">大按钮</sl-button>
    </sl-space>

    <sl-space kwc:external align="end">
      <span class="demo-box">End</span>
      <sl-button kwc:external size="small">小按钮</sl-button>
      <sl-button kwc:external size="large">大按钮</sl-button>
    </sl-space>

    <sl-space kwc:external align="baseline">
      <span class="demo-box">Baseline</span>
      <sl-button kwc:external size="small">小按钮</sl-button>
      <sl-button kwc:external size="large">大按钮</sl-button>
    </sl-space>
  </div>
</template>
```

```css
.space-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.demo-box {
  padding: 16px;
  background: var(--sl-color-neutral-100);
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class SpaceAlign extends KingdeeElement {}
```

## 自动换行

使用 `wrap` 属性可以让元素在空间不足时自动换行。

```html
<template>
  <sl-space kwc:external class="wrap-container" wrap>
    <sl-button kwc:external>按钮1</sl-button>
    <sl-button kwc:external>按钮2</sl-button>
    <sl-button kwc:external>按钮3</sl-button>
    <sl-button kwc:external>按钮4</sl-button>
    <sl-button kwc:external>按钮5</sl-button>
    <sl-button kwc:external>按钮6</sl-button>
    <sl-button kwc:external>按钮7</sl-button>
    <sl-button kwc:external>按钮8</sl-button>
  </sl-space>
</template>
```

```css
.wrap-container {
  width: 300px;
  border: 1px dashed var(--sl-color-neutral-300);
  padding: 8px;
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class SpaceWrap extends KingdeeElement {}
```

## 分隔符

通过 `separator` 属性在子元素之间插入分隔内容。

```html
<template>
  <sl-space kwc:external class="space-separator">
    <sl-button kwc:external>按钮1</sl-button>
    <sl-button kwc:external>按钮2</sl-button>
    <sl-button kwc:external>按钮3</sl-button>
  </sl-space>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class SpaceSeparator extends KingdeeElement {
  renderedCallback() {
    if (this._initialized) return;
    this._initialized = true;
    const space = this.template.querySelector('.space-separator');
    if (space) {
      space.separator = '|';
    }
  }
}
```

## 使用 CSS 变量自定义间距

可以通过 `--gap` CSS 变量来自定义间距。

```html
<template>
  <sl-space kwc:external class="space-css-var">
    <sl-button kwc:external>按钮1</sl-button>
    <sl-button kwc:external>按钮2</sl-button>
    <sl-button kwc:external>按钮3</sl-button>
  </sl-space>
</template>
```

```css
.space-css-var {
  --gap: 32px;
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class SpaceCssVar extends KingdeeElement {}
```

## 动态切换间距大小

通过 JavaScript 动态控制间距大小。

```html
<template>
  <div class="space-demo">
    <div class="controls">
      <sl-button kwc:external class="btn-small" size="small">Small</sl-button>
      <sl-button kwc:external class="btn-medium" size="small">Medium</sl-button>
      <sl-button kwc:external class="btn-large" size="small">Large</sl-button>
      <sl-button kwc:external class="btn-custom" size="small">Custom (32px)</sl-button>
    </div>
    <sl-space kwc:external class="space-dynamic">
      <sl-button kwc:external>按钮1</sl-button>
      <sl-button kwc:external>按钮2</sl-button>
      <sl-button kwc:external>按钮3</sl-button>
    </sl-space>
  </div>
</template>
```

```css
.space-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
}
.controls {
  display: flex;
  gap: var(--sl-spacing-x-small);
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class SpaceDynamic extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindEvents();
  }

  bindEvents() {
    const btnSmall = this.template.querySelector('.btn-small');
    const btnMedium = this.template.querySelector('.btn-medium');
    const btnLarge = this.template.querySelector('.btn-large');
    const btnCustom = this.template.querySelector('.btn-custom');

    this._handlers = [];

    const bind = (el, size) => {
      const handler = () => {
        const space = this.template.querySelector('.space-dynamic');
        if (space) space.size = size;
      };
      el.addEventListener('click', handler);
      this._handlers.push({ el, handler });
    };

    if (btnSmall) bind(btnSmall, 'small');
    if (btnMedium) bind(btnMedium, 'medium');
    if (btnLarge) bind(btnLarge, 'large');
    if (btnCustom) bind(btnCustom, 32);
  }

  disconnectedCallback() {
    if (this._handlers) {
      this._handlers.forEach(({ el, handler }) => {
        el.removeEventListener('click', handler);
      });
      this._handlers = [];
    }
    this._eventsBound = false;
  }
}
```

## Properties

| 属性        | 描述                                                                 | 类型                                                    | 默认值         |
| ----------- | -------------------------------------------------------------------- | ------------------------------------------------------- | -------------- |
| orientation | 间距方向                                                             | `'horizontal' \| 'vertical'`                            | `'horizontal'` |
| size        | 间距大小，可选预设值或自定义数值（px），支持数组形式 `[水平, 垂直]` | `'small' \| 'medium' \| 'large' \| number \| [SpaceSize, SpaceSize]` | `'small'`      |
| align       | 对齐方式                                                             | `'start' \| 'end' \| 'center' \| 'baseline'`            | -              |
| wrap        | 是否自动换行，仅在 horizontal 方向时有效                             | `boolean`                                               | `false`        |
| separator   | 分隔符内容                                                           | `string`                                                | -              |

## CSS Parts

| Part      | 描述               |
| --------- | ------------------ |
| base      | 组件的基础容器     |
| item      | 每个子元素的包装容器 |
| separator | 分隔符容器         |

## CSS Custom Properties

| 属性   | 描述           | 默认值                    |
| ------ | -------------- | ------------------------- |
| --gap  | 自定义间距大小 | `var(--sl-spacing-small)` |

## 最佳实践

### 1. 正确导入组件

```javascript
import '@kdcloudjs/shoelace/dist/components/space/space.js';
```

### 2. 添加 kwc:external 属性

在 HTML 模板中使用时，**必须**添加 `kwc:external` 属性：

```html
<sl-space kwc:external class="my-space">
  <sl-button kwc:external>按钮</sl-button>
</sl-space>
```

### 3. 使用 class 而非 id 选择器

```html
<!-- 正确 -->
<sl-space kwc:external class="my-space"></sl-space>

<!-- 错误 -->
<sl-space kwc:external id="my-space"></sl-space>
```

### 4. 动态设置复杂属性

对于 `size` 为数值或数组时，需要通过 JavaScript 动态设置：

```javascript
renderedCallback() {
  if (this._initialized) return;
  this._initialized = true;
  const space = this.template.querySelector('.my-space');
  if (space) {
    space.size = [16, 24]; // 数组形式
    // 或 space.size = 24; // 数值形式
  }
}
```

## 常见问题

### Q: 如何设置不同方向的间距？

A: 通过 JavaScript 设置数组形式的 `size` 属性：
```javascript
const space = this.template.querySelector('.my-space');
space.size = [16, 24]; // 水平间距 16px，垂直间距 24px
```

### Q: wrap 属性不生效？

A: 确保 `orientation` 为 `horizontal`（默认值），`wrap` 仅在水平方向时有效。同时需要给容器设置一个固定宽度。

### Q: 如何让 Space 组件占满整行？

A: Space 组件默认是 `inline-block`，可以通过 CSS 设置为 `block`：
```css
.my-space {
  display: block;
  width: 100%;
}
```
