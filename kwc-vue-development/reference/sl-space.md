# Space 间距

用于设置组件之间的间距，避免组件紧贴在一起，适合行内元素的水平或垂直间距布局。

## 特性概览

- **灵活间距**：支持 `small`、`medium`、`large` 预设大小或自定义数值
- **方向控制**：支持水平（`horizontal`）和垂直（`vertical`）两种排列方向
- **对齐方式**：支持 `start`、`end`、`center`、`baseline` 四种对齐方式
- **自动换行**：支持 `wrap` 属性实现空间不足时自动换行
- **CSS 变量**：支持通过 `--gap` 自定义间距

## 基础用法

最简单的用法，在一行内排列多个元素并设置间距。

```vue
<template>
  <sl-space>
    <sl-button>按钮1</sl-button>
    <sl-button>按钮2</sl-button>
    <sl-button>按钮3</sl-button>
  </sl-space>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
</script>
```

## 垂直间距

使用 `orientation="vertical"` 可以设置垂直方向排列。

```vue
<template>
  <sl-space orientation="vertical">
    <sl-button>按钮1</sl-button>
    <sl-button>按钮2</sl-button>
    <sl-button>按钮3</sl-button>
  </sl-space>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
</script>
```

## 间距大小

通过 `size` 属性设置间距大小，可选值为 `small`、`medium`、`large`，默认为 `small`。

```vue
<template>
  <div class="space-demo">
    <sl-space size="small">
      <sl-button>Small</sl-button>
      <sl-button>Small</sl-button>
      <sl-button>Small</sl-button>
    </sl-space>
    
    <sl-space size="medium">
      <sl-button>Medium</sl-button>
      <sl-button>Medium</sl-button>
      <sl-button>Medium</sl-button>
    </sl-space>
    
    <sl-space size="large">
      <sl-button>Large</sl-button>
      <sl-button>Large</sl-button>
      <sl-button>Large</sl-button>
    </sl-space>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
</script>

<style scoped>
.space-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
```

## 自定义间距

`size` 也可以设置为具体的数值（单位为 px）。

```vue
<template>
  <sl-space :size="24">
    <sl-button>按钮1</sl-button>
    <sl-button>按钮2</sl-button>
    <sl-button>按钮3</sl-button>
  </sl-space>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
</script>
```

## 数组形式间距

`size` 可以传入数组 `[水平间距, 垂直间距]` 分别设置水平和垂直方向的间距。

```vue
<template>
  <sl-space :size="[16, 24]" wrap style="width: 300px;">
    <sl-button>按钮1</sl-button>
    <sl-button>按钮2</sl-button>
    <sl-button>按钮3</sl-button>
    <sl-button>按钮4</sl-button>
    <sl-button>按钮5</sl-button>
  </sl-space>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
</script>
```

## 对齐方式

通过 `align` 属性设置对齐方式，可选值为 `start`、`end`、`center`、`baseline`。

```vue
<template>
  <div class="space-demo">
    <sl-space align="start">
      <span class="demo-box">Start</span>
      <sl-button size="small">小按钮</sl-button>
      <sl-button size="large">大按钮</sl-button>
    </sl-space>
    
    <sl-space align="center">
      <span class="demo-box">Center</span>
      <sl-button size="small">小按钮</sl-button>
      <sl-button size="large">大按钮</sl-button>
    </sl-space>
    
    <sl-space align="end">
      <span class="demo-box">End</span>
      <sl-button size="small">小按钮</sl-button>
      <sl-button size="large">大按钮</sl-button>
    </sl-space>
    
    <sl-space align="baseline">
      <span class="demo-box">Baseline</span>
      <sl-button size="small">小按钮</sl-button>
      <sl-button size="large">大按钮</sl-button>
    </sl-space>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
</script>

<style scoped>
.space-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.demo-box {
  padding: 16px;
  background: var(--sl-color-neutral-100);
}
</style>
```

## 自动换行

使用 `wrap` 属性可以让元素在空间不足时自动换行。

```vue
<template>
  <sl-space wrap class="wrap-container">
    <sl-button>按钮1</sl-button>
    <sl-button>按钮2</sl-button>
    <sl-button>按钮3</sl-button>
    <sl-button>按钮4</sl-button>
    <sl-button>按钮5</sl-button>
    <sl-button>按钮6</sl-button>
    <sl-button>按钮7</sl-button>
    <sl-button>按钮8</sl-button>
  </sl-space>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
</script>

<style scoped>
.wrap-container {
  width: 300px;
  border: 1px dashed var(--sl-color-neutral-300);
  padding: 8px;
}
</style>
```

## 使用 CSS 变量自定义间距

可以通过 `--gap` CSS 变量来自定义间距。

```vue
<template>
  <sl-space style="--gap: 32px;">
    <sl-button>按钮1</sl-button>
    <sl-button>按钮2</sl-button>
    <sl-button>按钮3</sl-button>
  </sl-space>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';
</script>
```

## 通过响应式数据动态控制间距

通过 `ref` 响应式数据动态控制间距大小，符合 Vue 3 数据驱动视图的开发理念。

```vue
<template>
  <div class="space-demo">
    <div class="controls">
      <sl-button size="small" @click="setSmall">Small</sl-button>
      <sl-button size="small" @click="setMedium">Medium</sl-button>
      <sl-button size="small" @click="setLarge">Large</sl-button>
      <sl-button size="small" @click="setCustom">Custom (32px)</sl-button>
    </div>
    <sl-space :size="currentSize">
      <sl-button>按钮1</sl-button>
      <sl-button>按钮2</sl-button>
      <sl-button>按钮3</sl-button>
    </sl-space>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/space/space.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const currentSize = ref('small');

function setSmall() {
  currentSize.value = 'small';
}

function setMedium() {
  currentSize.value = 'medium';
}

function setLarge() {
  currentSize.value = 'large';
}

function setCustom() {
  currentSize.value = 32;
}
</script>

<style scoped>
.space-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
}
.controls {
  display: flex;
  gap: var(--sl-spacing-x-small);
}
</style>
```

## Properties

| 属性        | 描述                                                                 | 类型                                                    | 默认值         |
| ----------- | -------------------------------------------------------------------- | ------------------------------------------------------- | -------------- |
| orientation | 间距方向                                                             | `'horizontal' \| 'vertical'`                            | `'horizontal'` |
| size        | 间距大小，可选预设值或自定义数值（px），支持数组形式 `[水平, 垂直]` | `'small' \| 'medium' \| 'large' \| number \| [SpaceSize, SpaceSize]` | `'small'`      |
| align       | 对齐方式                                                             | `'start' \| 'end' \| 'center' \| 'baseline'`            | -              |
| wrap        | 是否自动换行，仅在 horizontal 方向时有效                             | `boolean`                                               | `false`        |

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

## 常见问题

### Q: 如何设置不同方向的间距？

A: 使用数组形式的 `size` 属性：
```vue
<sl-space :size="[16, 24]" wrap>
  <!-- 水平间距 16px，垂直间距 24px -->
</sl-space>
```

### Q: wrap 属性不生效？

A: 确保 `orientation` 为 `horizontal`（默认值），`wrap` 仅在水平方向时有效。同时需要给容器设置一个固定宽度。

### Q: 如何让 Space 组件占满整行？

A: Space 组件默认是 `inline-block`，可以通过样式设置为 `block`：
```vue
<sl-space style="display: block; width: 100%;">
  <!-- 内容 -->
</sl-space>
```

### Q: Vue 中如何动态绑定属性？

A: 使用 `:` 前缀进行动态绑定：
```vue
<sl-space :size="spaceSize" :align="alignment" />
```
