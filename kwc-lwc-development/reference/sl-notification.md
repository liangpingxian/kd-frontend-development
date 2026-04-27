# Notification 通知

用于全局展示操作反馈信息的通知提醒框。

## 特性概览

- **四种类型**：success（成功）、info（信息）、warning（警告）、error（错误）
- **六种位置**：支持屏幕六个方位的定位
- **自动关闭**：支持设置持续时间，可禁用自动关闭
- **进度条**：可选显示剩余时间进度条
- **悬停暂停**：鼠标悬停时暂停自动关闭计时
- **静态方法**：支持快捷调用方式
- **全局配置**：支持设置全局默认值
- **按 key 管理**：支持通过 key 标识销毁特定通知

## 基础用法

最简单的用法，直接调用静态方法显示通知。

```html
<template>
  <sl-button kwc:external class="show-btn">显示通知</sl-button>
</template>
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';

export default class NotificationBasic extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindEvents();
  }

  bindEvents() {
    const btn = this.template.querySelector('.show-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        SlNotification.open({
          title: '通知标题',
          description: '这是一条通知消息'
        });
      });
    }
  }
}
```

## 不同类型

使用 `type` 属性或快捷方法设置不同类型的通知。

```html
<template>
  <div class="btn-group">
    <sl-button kwc:external class="btn-success">成功</sl-button>
    <sl-button kwc:external class="btn-info">信息</sl-button>
    <sl-button kwc:external class="btn-warning">警告</sl-button>
    <sl-button kwc:external class="btn-error">错误</sl-button>
  </div>
</template>
```
```css
.btn-group {
  display: flex;
  gap: var(--sl-spacing-x-small);
}
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';

export default class NotificationTypes extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindEvents();
  }

  bindEvents() {
    this.template.querySelector('.btn-success')?.addEventListener('click', () => {
      SlNotification.success('操作成功');
    });
    this.template.querySelector('.btn-info')?.addEventListener('click', () => {
      SlNotification.info('提示信息');
    });
    this.template.querySelector('.btn-warning')?.addEventListener('click', () => {
      SlNotification.warning('警告信息');
    });
    this.template.querySelector('.btn-error')?.addEventListener('click', () => {
      SlNotification.error('错误信息');
    });
  }
}
```

## 带标题和描述

同时设置标题和描述内容。

```html
<template>
  <sl-button kwc:external class="show-btn">显示通知</sl-button>
</template>
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';

export default class NotificationTitleDesc extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindEvents();
  }

  bindEvents() {
    this.template.querySelector('.show-btn')?.addEventListener('click', () => {
      SlNotification.success({
        title: '提交成功',
        description: '您的表单已成功提交，我们会尽快处理。'
      });
    });
  }
}
```

## 自定义位置

使用 `placement` 属性设置通知出现的位置。

```html
<template>
  <div class="btn-group">
    <sl-button kwc:external class="btn-top">top</sl-button>
    <sl-button kwc:external class="btn-topLeft">topLeft</sl-button>
    <sl-button kwc:external class="btn-topRight">topRight</sl-button>
    <sl-button kwc:external class="btn-bottom">bottom</sl-button>
    <sl-button kwc:external class="btn-bottomLeft">bottomLeft</sl-button>
    <sl-button kwc:external class="btn-bottomRight">bottomRight</sl-button>
  </div>
</template>
```
```css
.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sl-spacing-x-small);
}
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';

export default class NotificationPlacement extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindEvents();
  }

  bindEvents() {
    const placements = ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight'];
    placements.forEach(placement => {
      this.template.querySelector(`.btn-${placement}`)?.addEventListener('click', () => {
        SlNotification.info({
          title: placement,
          description: `通知出现在 ${placement} 位置`,
          placement
        });
      });
    });
  }
}
```


## 自定义持续时间

使用 `duration` 属性设置自动关闭时间，设为 `false` 或 `0` 则不自动关闭。

```html
<template>
  <div class="btn-group">
    <sl-button kwc:external class="btn-2s">2秒</sl-button>
    <sl-button kwc:external class="btn-no-auto">不自动关闭</sl-button>
  </div>
</template>
```
```css
.btn-group {
  display: flex;
  gap: var(--sl-spacing-x-small);
}
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';

export default class NotificationDuration extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindEvents();
  }

  bindEvents() {
    this.template.querySelector('.btn-2s')?.addEventListener('click', () => {
      SlNotification.info({
        title: '2秒后关闭',
        description: '这条通知将在2秒后自动关闭',
        duration: 2000
      });
    });
    this.template.querySelector('.btn-no-auto')?.addEventListener('click', () => {
      SlNotification.info({
        title: '不自动关闭',
        description: '这条通知需要手动关闭',
        duration: false
      });
    });
  }
}
```

## 显示进度条

使用 `showProgress` 属性显示剩余时间进度条。

```html
<template>
  <sl-button kwc:external class="show-btn">显示进度条</sl-button>
</template>
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';

export default class NotificationProgress extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindEvents();
  }

  bindEvents() {
    this.template.querySelector('.show-btn')?.addEventListener('click', () => {
      SlNotification.info({
        title: '带进度条的通知',
        description: '进度条显示剩余时间',
        duration: 5000,
        showProgress: true
      });
    });
  }
}
```

## 使用 key 管理通知

通过 `key` 属性标识通知，可以销毁指定的通知。

```html
<template>
  <div class="btn-group">
    <sl-button kwc:external class="btn-show">显示通知</sl-button>
    <sl-button kwc:external class="btn-destroy">销毁指定通知</sl-button>
    <sl-button kwc:external class="btn-destroy-all">销毁所有</sl-button>
  </div>
</template>
```
```css
.btn-group {
  display: flex;
  gap: var(--sl-spacing-x-small);
}
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';

export default class NotificationKey extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindEvents();
  }

  bindEvents() {
    this.template.querySelector('.btn-show')?.addEventListener('click', () => {
      SlNotification.info({
        title: '可销毁的通知',
        description: '点击下方按钮销毁此通知',
        key: 'my-notification',
        duration: false
      });
    });
    this.template.querySelector('.btn-destroy')?.addEventListener('click', () => {
      SlNotification.destroy('my-notification');
    });
    this.template.querySelector('.btn-destroy-all')?.addEventListener('click', () => {
      SlNotification.destroy();
    });
  }
}
```


## 全局配置

使用 `SlNotification.config()` 设置全局默认配置。

```html
<template>
  <sl-button kwc:external class="show-btn">显示5条通知</sl-button>
</template>
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';

export default class NotificationGlobalConfig extends KingdeeElement {
  connectedCallback() {
    super.connectedCallback();
    // 设置全局配置
    SlNotification.config({
      placement: 'bottomRight',
      duration: 3000,
      maxCount: 3,
      showProgress: true
    });
  }

  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindEvents();
  }

  bindEvents() {
    this.template.querySelector('.show-btn')?.addEventListener('click', () => {
      for (let i = 1; i <= 5; i++) {
        setTimeout(() => {
          SlNotification.info({
            title: `通知 ${i}`,
            description: '最多显示3条，超出的会替换最早的'
          });
        }, i * 200);
      }
    });
  }
}
```

## 声明式用法

除了静态方法，也可以在模板中声明式使用组件。

```html
<template>
  <sl-button kwc:external class="show-btn">显示通知</sl-button>
  <sl-notification
    kwc:external
    class="notification-el"
    type="success"
    duration="3000"
    closable
  >
    <span slot="title">声明式通知</span>
    这是通过声明式方式创建的通知
  </sl-notification>
</template>
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import '@kdcloudjs/shoelace/dist/components/notification/notification.js';

export default class NotificationDeclarative extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindEvents();
  }

  bindEvents() {
    const notification = this.template.querySelector('.notification-el');
    
    this.template.querySelector('.show-btn')?.addEventListener('click', () => {
      notification?.show();
    });

    notification?.addEventListener('sl-show', () => {
      console.log('显示');
    });

    notification?.addEventListener('sl-after-hide', () => {
      console.log('隐藏完成');
    });
  }
}
```

## Properties

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否显示通知 | `boolean` | `false` |
| type | 通知类型 | `'success' \| 'info' \| 'warning' \| 'error'` | `'info'` |
| duration | 自动关闭时间（毫秒），设为 `false` 或 `0` 不自动关闭 | `number \| false` | `4500` |
| closable | 是否显示关闭按钮 | `boolean` | `true` |
| close-icon | 自定义关闭图标，设为 `null` 或 `false` 隐藏 | `string \| null \| false` | - |
| placement | 通知位置 | `'top' \| 'topLeft' \| 'topRight' \| 'bottom' \| 'bottomLeft' \| 'bottomRight'` | `'topRight'` |
| show-progress | 是否显示进度条 | `boolean` | `false` |
| pause-on-hover | 鼠标悬停时是否暂停自动关闭 | `boolean` | `true` |
| key | 通知的唯一标识 | `string` | - |

## Events

| 事件名称 | 描述 |
| --- | --- |
| sl-show | 通知开始显示时触发 |
| sl-after-show | 通知显示动画完成后触发 |
| sl-hide | 通知开始隐藏时触发 |
| sl-after-hide | 通知隐藏动画完成后触发 |


### 事件监听示例

**重要**：在 KWC LWC 中，Shoelace 的自定义事件（如 `sl-show`）**必须**在 JavaScript 的 `renderedCallback` 中绑定，**禁止**在 HTML 模板中使用 `onsl-show` 这样的写法。

```javascript
renderedCallback() {
  if (this._eventsBound) return;
  this._eventsBound = true;
  
  const notification = this.template.querySelector('.notification-el');
  notification?.addEventListener('sl-show', () => {
    console.log('通知显示');
  });
  notification?.addEventListener('sl-after-hide', () => {
    console.log('通知隐藏完成');
  });
}
```

## Slots

| 插槽名称 | 描述 |
| --- | --- |
| (default) | 通知的描述内容 |
| title | 通知的标题 |
| icon | 自定义图标 |
| actions | 操作按钮区域 |

## CSS Parts

| Part 名称 | 描述 |
| --- | --- |
| base | 组件的基础容器 |
| icon | 图标容器 |
| content | 内容容器 |
| title | 标题元素 |
| description | 描述元素 |
| actions | 操作按钮容器 |
| close-button | 关闭按钮 |
| progress | 进度条容器 |
| progress-bar | 进度条 |

## Static Methods

| 方法 | 描述 | 参数 |
| --- | --- | --- |
| `SlNotification.open(config)` | 打开一个通知 | `NotificationConfig` |
| `SlNotification.success(config \| string)` | 打开成功类型通知 | `NotificationConfig \| string` |
| `SlNotification.info(config \| string)` | 打开信息类型通知 | `NotificationConfig \| string` |
| `SlNotification.warning(config \| string)` | 打开警告类型通知 | `NotificationConfig \| string` |
| `SlNotification.error(config \| string)` | 打开错误类型通知 | `NotificationConfig \| string` |
| `SlNotification.destroy(key?)` | 销毁通知，不传 key 则销毁所有 | `string?` |
| `SlNotification.config(config)` | 设置全局配置 | `NotificationGlobalConfig` |

## NotificationConfig

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | `string` | - |
| description | 描述内容 | `string` | - |
| icon | 自定义图标名称 | `string` | - |
| type | 通知类型 | `'success' \| 'info' \| 'warning' \| 'error'` | `'info'` |
| duration | 自动关闭时间（毫秒） | `number \| false` | `4500` |
| closable | 是否显示关闭按钮 | `boolean` | `true` |
| closeIcon | 自定义关闭图标 | `string \| null \| false` | - |
| placement | 通知位置 | `NotificationPlacement` | `'topRight'` |
| showProgress | 是否显示进度条 | `boolean` | `false` |
| pauseOnHover | 悬停时是否暂停 | `boolean` | `true` |
| key | 唯一标识 | `string` | - |
| onClose | 关闭回调 | `() => void` | - |
| onClick | 点击回调 | `() => void` | - |

## NotificationGlobalConfig

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| placement | 默认位置 | `NotificationPlacement` | `'topRight'` |
| duration | 默认持续时间（毫秒） | `number \| false` | `4500` |
| maxCount | 最大同时显示数量 | `number` | - |
| top | 顶部距离（px） | `number` | `24` |
| bottom | 底部距离（px） | `number` | `24` |
| showProgress | 是否显示进度条 | `boolean` | `false` |
| pauseOnHover | 悬停时是否暂停 | `boolean` | `true` |
| closeIcon | 默认关闭图标 | `string \| null \| false` | - |

## 最佳实践

### 1. 正确导入组件

```javascript
import '@kdcloudjs/shoelace/dist/components/notification/notification.js';
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';
```

### 2. 添加 kwc:external 属性

在 HTML 模板中使用时，**必须**添加 `kwc:external` 属性：

```html
<sl-notification kwc:external class="my-notification"></sl-notification>
```

### 3. 使用 class 而非 id 选择器

```html
<!-- 正确 -->
<sl-notification kwc:external class="notification-el"></sl-notification>

<!-- 错误 -->
<sl-notification kwc:external id="notification-el"></sl-notification>
```

### 4. 在 renderedCallback 中绑定事件

```javascript
renderedCallback() {
  if (this._eventsBound) return;
  this._eventsBound = true;
  
  const notification = this.template.querySelector('.notification-el');
  notification?.addEventListener('sl-show', this.handleShow.bind(this));
}
```

## 常见问题

### Q: 为什么静态方法调用没有效果？

A: 确保正确导入了组件类：
```javascript
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';
```

### Q: 如何在应用启动时设置全局配置？

A: 在组件的 `connectedCallback` 中调用：
```javascript
connectedCallback() {
  super.connectedCallback();
  SlNotification.config({
    placement: 'topRight',
    duration: 3000,
    maxCount: 5
  });
}
```

### Q: 如何让通知不自动关闭？

A: 设置 `duration` 为 `false` 或 `0`：
```javascript
SlNotification.info({
  title: '手动关闭',
  description: '需要用户手动关闭',
  duration: false
});
```
