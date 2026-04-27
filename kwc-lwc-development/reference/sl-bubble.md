# Bubble 气泡对话

聊天气泡组件，常用于对话式 UI，支持打字动画、流式输出、编辑模式等特性。

## 特性概览

- **位置控制**：支持 `start`（左对齐）和 `end`（右对齐）两种位置（`placement`）
- **外观变体**：支持 `filled`、`outlined`、`shadow`、`borderless` 四种视觉风格（`variant`）
- **形状样式**：支持 `default`、`round`、`corner` 三种气泡形状（`shape`）
- **加载状态**：支持 `loading` 属性显示加载动画
- **打字动画**：支持逐字显示内容的打字动画效果（`typing`）
- **流式输出**：支持内容流式到达时的持续打字动画（`streaming`）
- **编辑模式**：支持对气泡内容进行编辑（`editable`）
- **丰富插槽**：支持头像、头部、底部、额外内容和自定义加载指示器
- **底部位置**：支持自定义 footer 在内容区域内外的不同位置（`footer-placement`）
- **CSS 自定义属性**：支持通过 CSS 变量自定义各变体的颜色和样式

## 基础用法

最简单的用法，显示一条聊天气泡消息。

```html
<template>
  <sl-bubble kwc:external class="bubble-el" content="你好，有什么可以帮助你的吗？"></sl-bubble>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/bubble/bubble.js';

export default class BubbleBasic extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
  }
}
```

## 位置

设置 `placement` 属性控制气泡位置，`start` 为左对齐（他人消息），`end` 为右对齐（自己消息）。

```html
<template>
  <sl-bubble kwc:external class="bubble-start" content="你好，我是助手" placement="start"></sl-bubble>
  <sl-bubble kwc:external class="bubble-end" content="你好！" placement="end"></sl-bubble>
</template>
```

## 外观变体

通过 `variant` 属性设置气泡外观，支持 `filled`（默认）、`outlined`、`shadow`、`borderless`。

```html
<template>
  <sl-bubble kwc:external content="Filled（默认）" variant="filled"></sl-bubble>
  <sl-bubble kwc:external content="Outlined" variant="outlined"></sl-bubble>
  <sl-bubble kwc:external content="Shadow" variant="shadow"></sl-bubble>
  <sl-bubble kwc:external content="Borderless" variant="borderless"></sl-bubble>
</template>
```

## 形状

通过 `shape` 属性设置气泡形状，支持 `default`（默认圆角）、`round`（药丸形）、`corner`（聊天缺角）。

```html
<template>
  <sl-bubble kwc:external content="Default" shape="default"></sl-bubble>
  <sl-bubble kwc:external content="Round" shape="round"></sl-bubble>
  <sl-bubble kwc:external content="Corner" shape="corner"></sl-bubble>
</template>
```

## 加载状态

设置 `loading` 属性显示加载指示器（三个跳动的点），常用于等待回复。

```html
<template>
  <sl-bubble kwc:external class="bubble-el" loading></sl-bubble>
</template>
```

## 打字动画

设置 `typing` 属性启用逐字打字动画，可通过 `typing-step` 和 `typing-interval` 控制速度。

```html
<template>
  <sl-bubble kwc:external class="bubble-el" typing typing-step="2" typing-interval="50"></sl-bubble>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/bubble/bubble.js';

export default class BubbleTyping extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.bubble-el');
    if (el) {
      el.content = '这是一段带有打字动画效果的文本内容，逐字显示给用户看。';
    }
  }
}
```

## 流式输出

结合 `typing` 和 `streaming` 属性，支持内容流式到达时的持续打字动画。当 `streaming` 为 `true` 时，打字动画不会结束；设置为 `false` 后，剩余内容输出完毕触发 `sl-typing-complete` 事件。

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/bubble/bubble.js';

export default class BubbleStreaming extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.bubble-el');
    if (el) {
      el.typing = true;
      el.streaming = true;
      el.content = '';

      // 模拟流式数据到达
      const chunks = ['你好，', '我正在', '思考你的', '问题...', '这是答案。'];
      let i = 0;
      const timer = setInterval(() => {
        if (i < chunks.length) {
          el.content += chunks[i];
          i++;
        } else {
          el.streaming = false;
          clearInterval(timer);
        }
      }, 500);
    }
  }
}
```

## 头像插槽

通过 `avatar` 插槽在气泡旁边显示头像，常与 `<sl-avatar>` 组件配合使用。

```html
<template>
  <sl-bubble kwc:external class="bubble-el" content="你好，我是助手">
    <sl-avatar kwc:external slot="avatar" initials="AI" shape="circle"></sl-avatar>
  </sl-bubble>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/bubble/bubble.js';
import '@kdcloudjs/shoelace/dist/components/avatar/avatar.js';
```

## 头部和底部插槽

通过 `header` 和 `footer` 插槽添加头部和底部内容。

```html
<template>
  <sl-bubble kwc:external class="bubble-el" content="这是消息内容">
    <span slot="header">助手 · 10:30</span>
    <span slot="footer">已读</span>
  </sl-bubble>
</template>
```

## 底部位置

通过 `footer-placement` 属性控制底部内容在气泡内外的位置。

```html
<template>
  <sl-bubble kwc:external content="外部底部（左对齐）" footer-placement="outer-start">
    <span slot="footer">底部内容</span>
  </sl-bubble>
  <sl-bubble kwc:external content="内部底部（右对齐）" footer-placement="inner-end">
    <span slot="footer">底部内容</span>
  </sl-bubble>
</template>
```

## 编辑模式

设置 `editable` 属性进入编辑模式，内容区域变为可编辑区域，显示确认和取消按钮。

```html
<template>
  <sl-bubble kwc:external class="bubble-el" editable ok-text="确认" cancel-text="取消"></sl-bubble>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/bubble/bubble.js';

export default class BubbleEditable extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    this.bindShoelaceEvents();
    const el = this.template.querySelector('.bubble-el');
    if (el) {
      el.content = '这段内容可以编辑';
    }
  }

  get shoelaceEventBindings() {
    return [
      ['.bubble-el', 'sl-edit-confirm', this.handleEditConfirm],
      ['.bubble-el', 'sl-edit-cancel', this.handleEditCancel]
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

  disconnectedCallback() {
    if (this._boundHandlers) {
      this._boundHandlers.forEach(({ el, event, boundHandler }) => {
        el.removeEventListener(event, boundHandler);
      });
      this._boundHandlers = [];
    }
  }

  handleEditConfirm(event) {
    console.log('编辑确认:', event.detail.content);
  }

  handleEditCancel() {
    console.log('编辑取消');
  }
}
```

## 监听事件

在 `renderedCallback` 中绑定事件监听。

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/bubble/bubble.js';

export default class BubbleEvents extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindShoelaceEvents();
  }

  get shoelaceEventBindings() {
    return [
      ['.bubble-el', 'sl-typing-complete', this.handleTypingComplete],
      ['.bubble-el', 'sl-edit-confirm', this.handleEditConfirm],
      ['.bubble-el', 'sl-edit-cancel', this.handleEditCancel]
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

  disconnectedCallback() {
    if (this._boundHandlers) {
      this._boundHandlers.forEach(({ el, event, boundHandler }) => {
        el.removeEventListener(event, boundHandler);
      });
      this._boundHandlers = [];
    }
    this._eventsBound = false;
  }

  handleTypingComplete() {
    console.log('打字动画完成');
  }

  handleEditConfirm(event) {
    console.log('编辑确认:', event.detail.content);
  }

  handleEditCancel() {
    console.log('编辑取消');
  }
}
```

## Properties

| 属性             | 描述                                             | 类型                                                           | 默认值      |
| ---------------- | ------------------------------------------------ | -------------------------------------------------------------- | ----------- |
| placement        | 气泡位置，`start` 左对齐，`end` 右对齐          | `'start' \| 'end'`                                            | `'start'`   |
| content          | 气泡文本内容                                     | `string`                                                       | `''`        |
| variant          | 外观变体                                         | `'filled' \| 'outlined' \| 'shadow' \| 'borderless'`          | `'filled'`  |
| shape            | 气泡形状                                         | `'default' \| 'round' \| 'corner'`                            | `'default'` |
| loading          | 是否显示加载状态                                 | `boolean`                                                      | `false`     |
| typing           | 是否启用打字动画                                 | `boolean`                                                      | `false`     |
| typing-step      | 每步打字显示的字符数                             | `number`                                                       | `2`         |
| typing-interval  | 打字动画每步间隔（毫秒）                         | `number`                                                       | `50`        |
| streaming        | 是否正在流式输出                                 | `boolean`                                                      | `false`     |
| footer-placement | 底部内容位置                                     | `'outer-start' \| 'outer-end' \| 'inner-start' \| 'inner-end'` | -           |
| editable         | 是否启用编辑模式                                 | `boolean`                                                      | `false`     |
| ok-text          | 编辑确认按钮文本                                 | `string`                                                       | `'OK'`      |
| cancel-text      | 编辑取消按钮文本                                 | `string`                                                       | `'Cancel'`  |

## Events

| 事件名称           | 描述                     | 事件详情                  |
| ------------------ | ------------------------ | ------------------------- |
| sl-typing-complete | 打字动画完成时触发       | -                         |
| sl-edit-confirm    | 用户确认编辑时触发       | `{ content: string }`     |
| sl-edit-cancel     | 用户取消编辑时触发       | -                         |

## Slots

| 插槽名   | 描述                                              |
| -------- | ------------------------------------------------- |
| (默认)   | 气泡内容的默认插槽，当未设置 `content` 属性时使用 |
| avatar   | 头像区域，配合 `<sl-avatar>` 使用                |
| header   | 头部内容，显示在气泡内容上方                      |
| footer   | 底部内容，显示在气泡内容下方                      |
| extra    | 额外内容，显示在头像对侧                          |
| loading  | 自定义加载指示器，覆盖默认加载动画                |

## CSS Parts

| Part 名称 | 描述                   |
| --------- | ---------------------- |
| base      | 组件最外层包装器       |
| avatar    | 头像容器               |
| body      | 主体包装器（头部+内容+底部） |
| header    | 头部容器               |
| content   | 主内容气泡区域         |
| footer    | 底部容器               |
| extra     | 额外内容容器           |
| loading   | 默认加载指示器容器     |

## CSS 自定义属性

| 属性名                              | 描述                                     |
| ------------------------------------ | ---------------------------------------- |
| --sl-bubble-filled-background        | `filled` 变体背景色（start 位置）        |
| --sl-bubble-filled-color             | `filled` 变体文字色                      |
| --sl-bubble-filled-background-end    | `filled` 变体背景色（end 位置）          |
| --sl-bubble-filled-color-end         | `filled` 变体文字色（end 位置）          |
| --sl-bubble-outlined-background      | `outlined` 变体背景色                    |
| --sl-bubble-outlined-border-color    | `outlined` 变体边框色                    |
| --sl-bubble-outlined-color           | `outlined` 变体文字色                    |
| --sl-bubble-shadow-background        | `shadow` 变体背景色                      |
| --sl-bubble-shadow-box-shadow        | `shadow` 变体阴影                        |
| --sl-bubble-shadow-color             | `shadow` 变体文字色                      |
| --sl-bubble-borderless-color         | `borderless` 变体文字色                  |
| --sl-bubble-loading-dot-color        | 加载指示器圆点颜色                       |
| --sl-bubble-cursor-color             | 打字光标颜色                             |

## 最佳实践

### 1. 正确导入组件

```javascript
import '@kdcloudjs/shoelace/dist/components/bubble/bubble.js';
```

### 2. 添加 kwc:external 属性

在 HTML 模板中使用时，**必须**添加 `kwc:external` 属性：

```html
<sl-bubble kwc:external class="my-bubble"></sl-bubble>
```

### 3. 使用 class 而非 id 选择器

```html
<!-- 正确 -->
<sl-bubble kwc:external class="bubble-el"></sl-bubble>

<!-- 错误 -->
<sl-bubble kwc:external id="bubble-el"></sl-bubble>
```

### 4. 在 renderedCallback 中绑定事件和设置数据

```javascript
renderedCallback() {
  if (this._eventsBound) return;
  this._eventsBound = true;
  this.bindShoelaceEvents();
}

get shoelaceEventBindings() {
  return [
    ['.bubble-el', 'sl-typing-complete', this.handleTypingComplete],
    ['.bubble-el', 'sl-edit-confirm', this.handleEditConfirm]
  ];
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

## 常见问题

### Q: 为什么打字动画没有效果？

A: 打字动画只在通过 `content` 属性设置文本内容时生效，不支持默认插槽内容。请确保同时设置了 `typing` 属性和 `content` 属性。

### Q: 流式输出时何时触发 sl-typing-complete？

A: 当 `streaming` 属性为 `true` 时，即使内容已全部打完，打字动画也会持续等待新内容。只有在 `streaming` 设为 `false` 后，剩余内容输出完毕才会触发 `sl-typing-complete` 事件。

### Q: footer-placement 的默认值是什么？

A: `footer-placement` 未设置时，默认根据 `placement` 决定：`placement="start"` 时为 `outer-start`，`placement="end"` 时为 `outer-end`。

### Q: 编辑模式如何获取编辑后的内容？

A: 监听 `sl-edit-confirm` 事件，通过 `event.detail.content` 获取编辑后的文本内容。
