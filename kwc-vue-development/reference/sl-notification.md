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

```vue
<template>
  <sl-button @click="showNotification">显示通知</sl-button>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';

const showNotification = () => {
  SlNotification.open({
    title: '通知标题',
    description: '这是一条通知消息'
  });
};
</script>
```

## 不同类型

使用 `type` 属性或快捷方法设置不同类型的通知。

```vue
<template>
  <div style="display: flex; gap: 8px">
    <sl-button @click="() => SlNotification.success('操作成功')">成功</sl-button>
    <sl-button @click="() => SlNotification.info('提示信息')">信息</sl-button>
    <sl-button @click="() => SlNotification.warning('警告信息')">警告</sl-button>
    <sl-button @click="() => SlNotification.error('错误信息')">错误</sl-button>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';
</script>
```


## 带标题和描述

同时设置标题和描述内容。

```vue
<template>
  <sl-button @click="showNotification">显示通知</sl-button>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';

const showNotification = () => {
  SlNotification.success({
    title: '提交成功',
    description: '您的表单已成功提交，我们会尽快处理。'
  });
};
</script>
```

## 自定义位置

使用 `placement` 属性设置通知出现的位置。

```vue
<template>
  <div style="display: flex; flex-wrap: wrap; gap: 8px">
    <sl-button
      v-for="placement in placements"
      :key="placement"
      @click="showAtPlacement(placement)"
    >
      {{ placement }}
    </sl-button>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';

const placements = ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight'];

const showAtPlacement = (placement) => {
  SlNotification.info({
    title: placement,
    description: `通知出现在 ${placement} 位置`,
    placement
  });
};
</script>
```

## 自定义持续时间

使用 `duration` 属性设置自动关闭时间，设为 `false` 或 `0` 则不自动关闭。

```vue
<template>
  <div style="display: flex; gap: 8px">
    <sl-button @click="show2s">2秒</sl-button>
    <sl-button @click="showNoAuto">不自动关闭</sl-button>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';

const show2s = () => {
  SlNotification.info({
    title: '2秒后关闭',
    description: '这条通知将在2秒后自动关闭',
    duration: 2000
  });
};

const showNoAuto = () => {
  SlNotification.info({
    title: '不自动关闭',
    description: '这条通知需要手动关闭',
    duration: false
  });
};
</script>
```

## 显示进度条

使用 `showProgress` 属性显示剩余时间进度条。

```vue
<template>
  <sl-button @click="showNotification">显示进度条</sl-button>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';

const showNotification = () => {
  SlNotification.info({
    title: '带进度条的通知',
    description: '进度条显示剩余时间',
    duration: 5000,
    showProgress: true
  });
};
</script>
```


## 使用 key 管理通知

通过 `key` 属性标识通知，可以销毁指定的通知。

```vue
<template>
  <div style="display: flex; gap: 8px">
    <sl-button @click="showNotification">显示通知</sl-button>
    <sl-button @click="destroyNotification">销毁指定通知</sl-button>
    <sl-button @click="destroyAll">销毁所有</sl-button>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';

const showNotification = () => {
  SlNotification.info({
    title: '可销毁的通知',
    description: '点击下方按钮销毁此通知',
    key: 'my-notification',
    duration: false
  });
};

const destroyNotification = () => {
  SlNotification.destroy('my-notification');
};

const destroyAll = () => {
  SlNotification.destroy();
};
</script>
```

## 全局配置

使用 `SlNotification.config()` 设置全局默认配置。

```vue
<template>
  <sl-button @click="showNotifications">显示5条通知</sl-button>
</template>

<script setup>
import { onMounted } from 'vue';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';

onMounted(() => {
  SlNotification.config({
    placement: 'bottomRight',
    duration: 3000,
    maxCount: 3,
    showProgress: true
  });
});

const showNotifications = () => {
  for (let i = 1; i <= 5; i++) {
    setTimeout(() => {
      SlNotification.info({
        title: `通知 ${i}`,
        description: '最多显示3条，超出的会替换最早的'
      });
    }, i * 200);
  }
};
</script>
```

## 声明式用法

除了静态方法，也可以在模板中声明式使用组件。

```vue
<template>
  <sl-button @click="showNotification">显示通知</sl-button>
  <sl-notification
    ref="notificationRef"
    type="success"
    :duration="3000"
    closable
    @sl-show="handleShow"
    @sl-after-hide="handleAfterHide"
  >
    <span slot="title">声明式通知</span>
    这是通过声明式方式创建的通知
  </sl-notification>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
import '@kdcloudjs/shoelace/dist/components/notification/notification.js';

const notificationRef = ref(null);

const showNotification = () => {
  notificationRef.value?.show();
};

const handleShow = () => {
  console.log('显示');
};

const handleAfterHide = () => {
  console.log('隐藏完成');
};
</script>
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

| 事件名称 | Vue 绑定 | 描述 |
| --- | --- | --- |
| sl-show | `@sl-show` | 通知开始显示时触发 |
| sl-after-show | `@sl-after-show` | 通知显示动画完成后触发 |
| sl-hide | `@sl-hide` | 通知开始隐藏时触发 |
| sl-after-hide | `@sl-after-hide` | 通知隐藏动画完成后触发 |

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

## 导入说明

```js
// 组件导入（用于声明式使用）
import '@kdcloudjs/shoelace/dist/components/notification/notification.js';

// 类导入（用于静态方法调用）
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';
```

## 常见问题

### Q: 如何在应用启动时设置全局配置？

A: 在 main.js 或 App.vue 的 onMounted 中调用：
```js
import SlNotification from '@kdcloudjs/shoelace/dist/components/notification/notification.js';

SlNotification.config({
  placement: 'topRight',
  duration: 3000,
  maxCount: 5
});
```

### Q: 如何让通知不自动关闭？

A: 设置 `duration` 为 `false` 或 `0`：
```js
SlNotification.info({
  title: '手动关闭',
  description: '需要用户手动关闭',
  duration: false
});
```
