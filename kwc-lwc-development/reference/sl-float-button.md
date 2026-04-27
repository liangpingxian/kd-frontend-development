# FloatButton 悬浮按钮

悬浮按钮固定在页面上，用于全局性的常用操作。

## 特性概览

- **双类型切换**：支持 `default` 和 `primary` 两种按钮类型
- **多形状**：支持 `circle` 圆形和 `square` 方形
- **多尺寸**：支持 `small`、`medium`、`large` 三种尺寸
- **按钮组**：通过 `sl-float-button-group` 组合多个悬浮按钮
- **菜单模式**：支持 `click` 和 `hover` 触发展开菜单
- **受控模式**：通过 `open` 属性手动控制菜单展开/收起
- **链接按钮**：设置 `href` 后渲染为 `<a>` 标签
- **Tooltip**：支持悬浮提示文字

## 基础用法

最基本的悬浮按钮。

```html
<template>
  <div class="demo-container">
    <sl-float-button kwc:external class="fb-basic" icon="question-lg"></sl-float-button>
  </div>
</template>
```

```css
.demo-container {
  position: relative;
  height: 100px;
  border: 1px dashed var(--sl-color-neutral-300);
  border-radius: 8px;
  overflow: hidden;
}
.fb-basic {
  position: absolute;
  right: 24px;
  bottom: 24px;
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';

export default class FloatButtonBasic extends KingdeeElement {}
```

## 类型

通过 `type` 属性切换按钮类型，支持 `default` 和 `primary`。

```html
<template>
  <div class="demo-container">
    <sl-float-button kwc:external class="fb-default" icon="question-lg" type="default"></sl-float-button>
    <sl-float-button kwc:external class="fb-primary" icon="pencil" type="primary"></sl-float-button>
  </div>
</template>
```

```css
.demo-container {
  position: relative;
  height: 100px;
  border: 1px dashed var(--sl-color-neutral-300);
  border-radius: 8px;
  overflow: hidden;
}
.fb-default {
  position: absolute;
  right: 80px;
  bottom: 24px;
}
.fb-primary {
  position: absolute;
  right: 24px;
  bottom: 24px;
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';

export default class FloatButtonType extends KingdeeElement {}
```

## 形状

通过 `shape` 属性设置按钮形状，支持 `circle`（默认）和 `square`。

```html
<template>
  <div class="demo-container">
    <sl-float-button kwc:external class="fb-circle" icon="chat-dots" shape="circle"></sl-float-button>
    <sl-float-button kwc:external class="fb-square" icon="chat-dots" shape="square"></sl-float-button>
  </div>
</template>
```

```css
.demo-container {
  position: relative;
  height: 100px;
  border: 1px dashed var(--sl-color-neutral-300);
  border-radius: 8px;
  overflow: hidden;
}
.fb-circle {
  position: absolute;
  right: 80px;
  bottom: 24px;
}
.fb-square {
  position: absolute;
  right: 24px;
  bottom: 24px;
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';

export default class FloatButtonShape extends KingdeeElement {}
```

## 尺寸

通过 `size` 属性设置按钮尺寸，支持 `small`、`medium`（默认）和 `large`。

```html
<template>
  <div class="demo-container">
    <sl-float-button kwc:external class="fb-small" icon="star" size="small"></sl-float-button>
    <sl-float-button kwc:external class="fb-medium" icon="star" size="medium"></sl-float-button>
    <sl-float-button kwc:external class="fb-large" icon="star" size="large"></sl-float-button>
  </div>
</template>
```

```css
.demo-container {
  position: relative;
  height: 120px;
  border: 1px dashed var(--sl-color-neutral-300);
  border-radius: 8px;
  overflow: hidden;
}
.fb-small {
  position: absolute;
  right: 140px;
  bottom: 24px;
}
.fb-medium {
  position: absolute;
  right: 80px;
  bottom: 24px;
}
.fb-large {
  position: absolute;
  right: 12px;
  bottom: 24px;
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';

export default class FloatButtonSize extends KingdeeElement {}
```

## 带文字描述

当 `shape="square"` 时，可以通过 `content` 插槽添加文字描述。

```html
<template>
  <div class="demo-container">
    <sl-float-button kwc:external class="fb-content" icon="chat-dots" shape="square">
      <span slot="content">帮助</span>
    </sl-float-button>
  </div>
</template>
```

```css
.demo-container {
  position: relative;
  height: 100px;
  border: 1px dashed var(--sl-color-neutral-300);
  border-radius: 8px;
  overflow: hidden;
}
.fb-content {
  position: absolute;
  right: 24px;
  bottom: 24px;
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';

export default class FloatButtonContent extends KingdeeElement {}
```

## Tooltip

通过 `tooltip` 属性设置悬浮提示文字。

```html
<template>
  <div class="demo-container">
    <sl-float-button kwc:external class="fb-tooltip" icon="question-lg" tooltip="帮助信息"></sl-float-button>
  </div>
</template>
```

```css
.demo-container {
  position: relative;
  height: 100px;
  border: 1px dashed var(--sl-color-neutral-300);
  border-radius: 8px;
  overflow: hidden;
}
.fb-tooltip {
  position: absolute;
  right: 24px;
  bottom: 24px;
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';

export default class FloatButtonTooltip extends KingdeeElement {}
```

## 链接按钮

通过 `href` 属性将悬浮按钮渲染为链接。

```html
<template>
  <div class="demo-container">
    <sl-float-button
      kwc:external
      class="fb-link"
      icon="github"
      href="https://github.com"
      target="_blank"
      tooltip="GitHub"
    ></sl-float-button>
  </div>
</template>
```

```css
.demo-container {
  position: relative;
  height: 100px;
  border: 1px dashed var(--sl-color-neutral-300);
  border-radius: 8px;
  overflow: hidden;
}
.fb-link {
  position: absolute;
  right: 24px;
  bottom: 24px;
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';

export default class FloatButtonLink extends KingdeeElement {}
```

## 禁用状态

通过 `disabled` 属性禁用按钮。

```html
<template>
  <div class="demo-container">
    <sl-float-button kwc:external class="fb-disabled-default" icon="pencil" disabled></sl-float-button>
    <sl-float-button kwc:external class="fb-disabled-primary" icon="pencil" type="primary" disabled></sl-float-button>
  </div>
</template>
```

```css
.demo-container {
  position: relative;
  height: 100px;
  border: 1px dashed var(--sl-color-neutral-300);
  border-radius: 8px;
  overflow: hidden;
}
.fb-disabled-default {
  position: absolute;
  right: 80px;
  bottom: 24px;
}
.fb-disabled-primary {
  position: absolute;
  right: 24px;
  bottom: 24px;
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';

export default class FloatButtonDisabled extends KingdeeElement {}
```

## 按钮组

使用 `sl-float-button-group` 将多个悬浮按钮组合在一起。

```html
<template>
  <div class="demo-container">
    <sl-float-button-group kwc:external class="fb-group">
      <sl-float-button kwc:external icon="chat-dots" tooltip="评论"></sl-float-button>
      <sl-float-button kwc:external icon="person" tooltip="用户"></sl-float-button>
      <sl-float-button kwc:external icon="gear" tooltip="设置"></sl-float-button>
    </sl-float-button-group>
  </div>
</template>
```

```css
.demo-container {
  position: relative;
  height: 200px;
  border: 1px dashed var(--sl-color-neutral-300);
  border-radius: 8px;
  overflow: hidden;
}
.fb-group {
  position: absolute;
  right: 24px;
  top: 24px;
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';
import '@kdcloudjs/shoelace/dist/components/float-button-group/float-button-group.js';

export default class FloatButtonGroup extends KingdeeElement {}
```

## 菜单模式

通过 `trigger` 属性开启菜单模式，支持 `click` 和 `hover` 两种触发方式。

```html
<template>
  <div class="demo-container">
    <div class="demo-col">
      <sl-float-button-group kwc:external class="fb-menu-click" trigger="click">
        <sl-float-button kwc:external icon="chat-dots"></sl-float-button>
        <sl-float-button kwc:external icon="person"></sl-float-button>
        <sl-float-button kwc:external icon="gear"></sl-float-button>
      </sl-float-button-group>
      <div class="demo-label">click 触发</div>
    </div>
    <div class="demo-col">
      <sl-float-button-group kwc:external class="fb-menu-hover" trigger="hover">
        <sl-float-button kwc:external icon="chat-dots"></sl-float-button>
        <sl-float-button kwc:external icon="person"></sl-float-button>
        <sl-float-button kwc:external icon="gear"></sl-float-button>
      </sl-float-button-group>
      <div class="demo-label">hover 触发</div>
    </div>
  </div>
</template>
```

```css
.demo-container {
  position: relative;
  height: 260px;
  border: 1px dashed var(--sl-color-neutral-300);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  gap: 200px;
}
.demo-col {
  position: relative;
  flex: 1;
}
.fb-menu-click,
.fb-menu-hover {
  position: absolute;
  right: 24px;
  bottom: 24px;
}
.demo-label {
  position: absolute;
  bottom: 4px;
  right: 16px;
  font-size: 12px;
  color: var(--sl-color-neutral-500);
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';
import '@kdcloudjs/shoelace/dist/components/float-button-group/float-button-group.js';

export default class FloatButtonMenu extends KingdeeElement {}
```

## 展开方向

通过 `placement` 属性设置菜单展开方向，支持 `top`（默认）、`right`、`bottom`、`left`。

```html
<template>
  <div class="demo-container">
    <sl-float-button-group kwc:external class="fb-placement-top" trigger="click" placement="top">
      <sl-icon slot="trigger-icon" name="chevron-up"></sl-icon>
      <sl-float-button kwc:external icon="chat-dots"></sl-float-button>
      <sl-float-button kwc:external icon="person"></sl-float-button>
    </sl-float-button-group>

    <sl-float-button-group kwc:external class="fb-placement-bottom" trigger="click" placement="bottom">
      <sl-icon slot="trigger-icon" name="chevron-down"></sl-icon>
      <sl-float-button kwc:external icon="chat-dots"></sl-float-button>
      <sl-float-button kwc:external icon="person"></sl-float-button>
    </sl-float-button-group>

    <sl-float-button-group kwc:external class="fb-placement-left" trigger="click" placement="left">
      <sl-icon slot="trigger-icon" name="chevron-left"></sl-icon>
      <sl-float-button kwc:external icon="chat-dots"></sl-float-button>
      <sl-float-button kwc:external icon="person"></sl-float-button>
    </sl-float-button-group>

    <sl-float-button-group kwc:external class="fb-placement-right" trigger="click" placement="right">
      <sl-icon slot="trigger-icon" name="chevron-right"></sl-icon>
      <sl-float-button kwc:external icon="chat-dots"></sl-float-button>
      <sl-float-button kwc:external icon="person"></sl-float-button>
    </sl-float-button-group>
  </div>
</template>
```

```css
.demo-container {
  position: relative;
  height: 300px;
  border: 1px dashed var(--sl-color-neutral-300);
  border-radius: 8px;
}
.fb-placement-top {
  position: absolute;
  left: 50%;
  top: 80px;
  transform: translateX(-50%);
}
.fb-placement-bottom {
  position: absolute;
  left: 50%;
  bottom: 80px;
  transform: translateX(-50%);
}
.fb-placement-left {
  position: absolute;
  right: 50%;
  top: 50%;
  transform: translate(-24px, -50%);
}
.fb-placement-right {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(24px, -50%);
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';
import '@kdcloudjs/shoelace/dist/components/float-button-group/float-button-group.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';

export default class FloatButtonPlacement extends KingdeeElement {}
```

## 返回顶部

利用悬浮按钮实现"返回顶部"功能。滚动下方区域查看效果。

```html
<template>
  <div class="demo-container">
    <div class="demo-scroller">
      <p>向下滚动查看返回顶部按钮 ↓</p>
      <div class="demo-scroll-area">滚动区域</div>
    </div>
    <sl-float-button
      kwc:external
      class="fb-back-top"
      icon="arrow-up"
      type="primary"
      tooltip="返回顶部"
    ></sl-float-button>
  </div>
</template>
```

```css
.demo-container {
  position: relative;
  height: 200px;
  border: 1px dashed var(--sl-color-neutral-300);
  border-radius: 8px;
  overflow: hidden;
}
.demo-scroller {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
}
.demo-scroll-area {
  height: 600px;
  background: linear-gradient(to bottom, var(--sl-color-neutral-100), var(--sl-color-neutral-300));
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sl-color-neutral-500);
}
.fb-back-top {
  position: absolute;
  right: 24px;
  bottom: 24px;
  display: none;
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';

export default class FloatButtonBackTop extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindEvents();
  }

  bindEvents() {
    const scroller = this.template.querySelector('.demo-scroller');
    const btn = this.template.querySelector('.fb-back-top');

    this._scrollHandler = () => {
      btn.style.display = scroller.scrollTop > 100 ? '' : 'none';
    };
    scroller.addEventListener('scroll', this._scrollHandler);

    this._clickHandler = () => {
      scroller.scrollTo({ top: 0, behavior: 'smooth' });
    };
    btn.addEventListener('sl-click', this._clickHandler);

    this._scroller = scroller;
    this._btn = btn;
  }

  disconnectedCallback() {
    if (this._scroller) {
      this._scroller.removeEventListener('scroll', this._scrollHandler);
    }
    if (this._btn) {
      this._btn.removeEventListener('sl-click', this._clickHandler);
    }
    this._eventsBound = false;
  }
}
```

## 受控模式

通过 `open` 属性手动控制菜单的展开与收起。

```html
<template>
  <div class="demo-container">
    <sl-float-button-group kwc:external class="fb-controlled" trigger="click">
      <sl-float-button kwc:external icon="chat-dots"></sl-float-button>
      <sl-float-button kwc:external icon="person"></sl-float-button>
      <sl-float-button kwc:external icon="gear"></sl-float-button>
    </sl-float-button-group>
  </div>
  <div class="demo-controls">
    <sl-button kwc:external class="btn-open" size="small">展开</sl-button>
    <sl-button kwc:external class="btn-close" size="small">收起</sl-button>
    <sl-button kwc:external class="btn-toggle" size="small" variant="primary">切换</sl-button>
  </div>
</template>
```

```css
.demo-container {
  position: relative;
  height: 200px;
  border: 1px dashed var(--sl-color-neutral-300);
  border-radius: 8px;
  overflow: hidden;
}
.fb-controlled {
  position: absolute;
  right: 24px;
  bottom: 24px;
}
.demo-controls {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';
import '@kdcloudjs/shoelace/dist/components/float-button-group/float-button-group.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class FloatButtonControlled extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindShoelaceEvents();
  }

  get shoelaceEventBindings() {
    return [
      ['.btn-open', 'click', this.handleOpen],
      ['.btn-close', 'click', this.handleClose],
      ['.btn-toggle', 'click', this.handleToggle]
    ];
  }

  bindShoelaceEvents() {
    this._boundHandlers = this.shoelaceEventBindings
      .map(([selector, event, handler]) => {
        const el = this.template.querySelector(selector);
        if (el) {
          const boundHandler = handler.bind(this);
          el.addEventListener(event, boundHandler);
          return { el, event, boundHandler };
        }
        return null;
      })
      .filter(Boolean);
  }

  handleOpen() {
    const group = this.template.querySelector('.fb-controlled');
    if (group) group.open = true;
  }

  handleClose() {
    const group = this.template.querySelector('.fb-controlled');
    if (group) group.open = false;
  }

  handleToggle() {
    const group = this.template.querySelector('.fb-controlled');
    if (group) group.open = !group.open;
  }

  disconnectedCallback() {
    if (this._boundHandlers) {
      this._boundHandlers.forEach(({ el, event, boundHandler }) => {
        el.removeEventListener(event, boundHandler);
      });
      this._boundHandlers = [];
    }
    this._eventsBound = false;
  }
}
```

## 监听点击事件

通过监听 `sl-click` 事件响应按钮点击。

```html
<template>
  <div class="demo-container">
    <sl-float-button kwc:external class="fb-click" icon="bell" type="primary"></sl-float-button>
  </div>
  <div class="demo-log">点击悬浮按钮试试</div>
</template>
```

```css
.demo-container {
  position: relative;
  height: 100px;
  border: 1px dashed var(--sl-color-neutral-300);
  border-radius: 8px;
  overflow: hidden;
}
.fb-click {
  position: absolute;
  right: 24px;
  bottom: 24px;
}
.demo-log {
  margin-top: 8px;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 4px;
  background: var(--sl-color-neutral-100);
  color: var(--sl-color-neutral-700);
}
```

```javascript
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';

export default class FloatButtonClick extends KingdeeElement {
  @track count = 0;

  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindShoelaceEvents();
    this.updateLog();
  }

  get shoelaceEventBindings() {
    return [['.fb-click', 'sl-click', this.handleClick]];
  }

  bindShoelaceEvents() {
    this._boundHandlers = this.shoelaceEventBindings
      .map(([selector, event, handler]) => {
        const el = this.template.querySelector(selector);
        if (el) {
          const boundHandler = handler.bind(this);
          el.addEventListener(event, boundHandler);
          return { el, event, boundHandler };
        }
        return null;
      })
      .filter(Boolean);
  }

  handleClick() {
    this.count++;
    this.updateLog();
  }

  updateLog() {
    const log = this.template.querySelector('.demo-log');
    if (log) {
      log.textContent =
        this.count > 0
          ? '🔔 sl-click 触发 (' + this.count + '次) — ' + new Date().toLocaleTimeString()
          : '点击悬浮按钮试试';
    }
  }

  disconnectedCallback() {
    if (this._boundHandlers) {
      this._boundHandlers.forEach(({ el, event, boundHandler }) => {
        el.removeEventListener(event, boundHandler);
      });
      this._boundHandlers = [];
    }
    this._eventsBound = false;
  }
}
```

## Properties

### sl-float-button

| 属性              | 描述                                | 类型                                     | 默认值      |
| ----------------- | ----------------------------------- | ---------------------------------------- | ----------- |
| type              | 按钮类型                            | `'default' \| 'primary'`                 | `'default'` |
| shape             | 按钮形状                            | `'circle' \| 'square'`                   | `'circle'`  |
| size              | 按钮尺寸                            | `'small' \| 'medium' \| 'large'`         | `'medium'`  |
| icon              | 图标名称                            | `string`                                 | `''`        |
| tooltip           | 悬浮提示文字                        | `string`                                 | `''`        |
| tooltip-placement | 提示文字方向                        | `'top' \| 'right' \| 'bottom' \| 'left'` | `'left'`    |
| disabled          | 是否禁用                            | `boolean`                                | `false`     |
| href              | 链接地址（设置后渲染为 `<a>` 标签） | `string`                                 | `''`        |
| target            | 链接打开方式                        | `string`                                 | `''`        |

````

### sl-float-button-group

| 属性      | 描述                               | 类型                                     | 默认值     |
| --------- | ---------------------------------- | ---------------------------------------- | ---------- |
| shape     | 子按钮形状                         | `'circle' \| 'square'`                   | `'circle'` |
| trigger   | 菜单触发方式（设置后启用菜单模式） | `'click' \| 'hover' \| ''`               | `''`       |
| open      | 菜单是否展开（受控模式）           | `boolean`                                | `false`    |
| placement | 菜单展开方向                       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`    |

## Events

### sl-float-button

| 事件名称 | 描述             | 事件详情 |
| -------- | ---------------- | -------- |
| sl-click | 按钮被点击时触发 | -        |

### sl-float-button-group

| 事件名称 | 描述           | 事件详情 |
| -------- | -------------- | -------- |
| sl-show  | 菜单展开时触发 | -        |
| sl-hide  | 菜单收起时触发 | -        |

## Slots

### sl-float-button

| 插槽名    | 描述                                   |
| --------- | -------------------------------------- |
| (default) | 按钮图标内容                           |
| content   | 文字描述（仅 `shape="square"` 时可见） |

### sl-float-button-group

| 插槽名       | 描述               |
| ------------ | ------------------ |
| (default)    | 悬浮按钮列表       |
| trigger-icon | 自定义触发按钮图标 |
| close-icon   | 自定义关闭图标     |

## CSS Parts

### sl-float-button

| Part    | 描述           |
| ------- | -------------- |
| base    | 按钮的基础容器 |
| icon    | 图标容器       |
| content | 文字内容容器   |

### sl-float-button-group

| Part         | 描述                 |
| ------------ | -------------------- |
| base         | 组的基础容器         |
| list         | 按钮列表容器         |
| trigger      | 触发按钮（菜单模式） |
| trigger-icon | 触发按钮图标         |

## 最佳实践

### 1. 正确导入组件

```javascript
import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';
import '@kdcloudjs/shoelace/dist/components/float-button-group/float-button-group.js';
````

### 2. 添加 kwc:external 属性

在 HTML 模板中使用时，**必须**添加 `kwc:external` 属性：

```html
<sl-float-button kwc:external class="my-float-button" icon="plus"></sl-float-button>
```

### 3. 使用 class 而非 id 选择器

```html
<!-- 正确 -->
<sl-float-button kwc:external class="fb-el"></sl-float-button>

<!-- 错误 -->
<sl-float-button kwc:external id="fb-el"></sl-float-button>
```

### 4. 在 renderedCallback 中绑定事件

```javascript
renderedCallback() {
  if (this._eventsBound) return;
  this._eventsBound = true;
  this.bindShoelaceEvents();
}

get shoelaceEventBindings() {
  return [
    ['.fb-el', 'sl-click', this.handleClick]
  ];
}

bindShoelaceEvents() {
  this._boundHandlers = this.shoelaceEventBindings.map(([selector, event, handler]) => {
    const el = this.template.querySelector(selector);
    if (el) {
      const boundHandler = handler.bind(this);
      el.addEventListener(event, boundHandler);
      return { el, event, boundHandler };
    }
    return null;
  }).filter(Boolean);
}
```

### 5. 在 disconnectedCallback 中移除事件监听

```javascript
disconnectedCallback() {
  if (this._boundHandlers) {
    this._boundHandlers.forEach(({ el, event, boundHandler }) => {
      el.removeEventListener(event, boundHandler);
    });
    this._boundHandlers = [];
  }
  this._eventsBound = false;
}
```

### 6. 受控模式 vs 非受控模式

- **非受控模式**：不设置 `open` 属性，组件内部管理菜单展开状态
- **受控模式**：使用 `open` 属性，需要在事件回调中手动更新该属性

```javascript
// 受控模式示例
handleToggle() {
  const group = this.template.querySelector('.fb-group');
  if (group) {
    group.open = !group.open;
  }
}
```
