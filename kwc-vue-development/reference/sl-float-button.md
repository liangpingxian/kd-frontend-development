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
- **禁用状态**：支持整体禁用交互

## 基础用法

最基本的悬浮按钮。

```html
<template>
  <div class="demo-container">
    <sl-float-button icon="question-lg" class="fb-basic"></sl-float-button>
  </div>
</template>

<script setup>
  import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';
</script>

<style scoped>
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
</style>
```

## 类型

通过 `type` 属性切换按钮类型，支持 `default` 和 `primary`。

```html
<template>
  <div class="demo-container">
    <sl-float-button icon="question-lg" type="default" class="fb-default"></sl-float-button>
    <sl-float-button icon="pencil" type="primary" class="fb-primary"></sl-float-button>
  </div>
</template>

<script setup>
  import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';
</script>

<style scoped>
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
</style>
```

## 形状

通过 `shape` 属性设置按钮形状，支持 `circle`（默认）和 `square`。

```html
<template>
  <div class="demo-container">
    <sl-float-button icon="chat-dots" shape="circle" class="fb-circle"></sl-float-button>
    <sl-float-button icon="chat-dots" shape="square" class="fb-square"></sl-float-button>
  </div>
</template>

<script setup>
  import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';
</script>

<style scoped>
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
</style>
```

## 尺寸

通过 `size` 属性设置按钮尺寸，支持 `small`、`medium`（默认）和 `large`。

```html
<template>
  <div class="demo-container">
    <sl-float-button icon="star" size="small" class="fb-small"></sl-float-button>
    <sl-float-button icon="star" size="medium" class="fb-medium"></sl-float-button>
    <sl-float-button icon="star" size="large" class="fb-large"></sl-float-button>
  </div>
</template>

<script setup>
  import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';
</script>

<style scoped>
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
</style>
```

## 带文字描述

当 `shape="square"` 时，可以通过 `content` 插槽添加文字描述。

```html
<template>
  <div class="demo-container">
    <sl-float-button icon="chat-dots" shape="square" class="fb-content">
      <span slot="content">帮助</span>
    </sl-float-button>
  </div>
</template>

<script setup>
  import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';
</script>

<style scoped>
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
</style>
```

## Tooltip

通过 `tooltip` 属性设置悬浮提示文字。

```html
<template>
  <div class="demo-container">
    <sl-float-button icon="question-lg" tooltip="帮助信息" class="fb-tooltip"></sl-float-button>
  </div>
</template>

<script setup>
  import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';
</script>

<style scoped>
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
</style>
```

## 链接按钮

通过 `href` 属性将悬浮按钮渲染为链接。

```html
<template>
  <div class="demo-container">
    <sl-float-button
      icon="github"
      href="https://github.com"
      target="_blank"
      tooltip="GitHub"
      class="fb-link"
    ></sl-float-button>
  </div>
</template>

<script setup>
  import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';
</script>

<style scoped>
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
</style>
```

## 禁用状态

通过 `disabled` 属性禁用按钮。

```html
<template>
  <div class="demo-container">
    <sl-float-button icon="pencil" disabled class="fb-disabled-default"></sl-float-button>
    <sl-float-button icon="pencil" type="primary" disabled class="fb-disabled-primary"></sl-float-button>
  </div>
</template>

<script setup>
  import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';
</script>

<style scoped>
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
</style>
```

## 按钮组

使用 `sl-float-button-group` 将多个悬浮按钮组合在一起。

```html
<template>
  <div class="demo-container">
    <sl-float-button-group class="fb-group">
      <sl-float-button icon="chat-dots" tooltip="评论"></sl-float-button>
      <sl-float-button icon="person" tooltip="用户"></sl-float-button>
      <sl-float-button icon="gear" tooltip="设置"></sl-float-button>
    </sl-float-button-group>
  </div>
</template>

<script setup>
  import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';
  import '@kdcloudjs/shoelace/dist/components/float-button-group/float-button-group.js';
</script>

<style scoped>
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
</style>
```

## 菜单模式

通过 `trigger` 属性开启菜单模式，支持 `click` 和 `hover` 两种触发方式。

```html
<template>
  <div class="demo-container">
    <div class="demo-col">
      <sl-float-button-group trigger="click" class="fb-menu">
        <sl-float-button icon="chat-dots"></sl-float-button>
        <sl-float-button icon="person"></sl-float-button>
        <sl-float-button icon="gear"></sl-float-button>
      </sl-float-button-group>
      <div class="demo-label">click 触发</div>
    </div>
    <div class="demo-col">
      <sl-float-button-group trigger="hover" class="fb-menu">
        <sl-float-button icon="chat-dots"></sl-float-button>
        <sl-float-button icon="person"></sl-float-button>
        <sl-float-button icon="gear"></sl-float-button>
      </sl-float-button-group>
      <div class="demo-label">hover 触发</div>
    </div>
  </div>
</template>

<script setup>
  import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';
  import '@kdcloudjs/shoelace/dist/components/float-button-group/float-button-group.js';
</script>

<style scoped>
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
  .fb-menu {
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
</style>
```

## 展开方向

通过 `placement` 属性设置菜单展开方向，支持 `top`（默认）、`right`、`bottom`、`left`。

```html
<template>
  <div class="demo-container">
    <sl-float-button-group trigger="click" placement="top" class="fb-top">
      <sl-icon slot="trigger-icon" name="chevron-up"></sl-icon>
      <sl-float-button icon="chat-dots"></sl-float-button>
      <sl-float-button icon="person"></sl-float-button>
    </sl-float-button-group>

    <sl-float-button-group trigger="click" placement="bottom" class="fb-bottom">
      <sl-icon slot="trigger-icon" name="chevron-down"></sl-icon>
      <sl-float-button icon="chat-dots"></sl-float-button>
      <sl-float-button icon="person"></sl-float-button>
    </sl-float-button-group>

    <sl-float-button-group trigger="click" placement="left" class="fb-left">
      <sl-icon slot="trigger-icon" name="chevron-left"></sl-icon>
      <sl-float-button icon="chat-dots"></sl-float-button>
      <sl-float-button icon="person"></sl-float-button>
    </sl-float-button-group>

    <sl-float-button-group trigger="click" placement="right" class="fb-right">
      <sl-icon slot="trigger-icon" name="chevron-right"></sl-icon>
      <sl-float-button icon="chat-dots"></sl-float-button>
      <sl-float-button icon="person"></sl-float-button>
    </sl-float-button-group>
  </div>
</template>

<script setup>
  import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';
  import '@kdcloudjs/shoelace/dist/components/float-button-group/float-button-group.js';
  import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
</script>

<style scoped>
  .demo-container {
    position: relative;
    height: 300px;
    border: 1px dashed var(--sl-color-neutral-300);
    border-radius: 8px;
  }
  .fb-top {
    position: absolute;
    left: 50%;
    top: 80px;
    transform: translateX(-50%);
  }
  .fb-bottom {
    position: absolute;
    left: 50%;
    bottom: 80px;
    transform: translateX(-50%);
  }
  .fb-left {
    position: absolute;
    right: 50%;
    top: 50%;
    transform: translate(-24px, -50%);
  }
  .fb-right {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(24px, -50%);
  }
</style>
```

## 返回顶部

利用悬浮按钮实现"返回顶部"功能。滚动下方区域查看效果。

```html
<template>
  <div class="demo-container">
    <div ref="scrollerRef" class="demo-scroller" @scroll="handleScroll">
      <p>向下滚动查看返回顶部按钮 ↓</p>
      <div class="demo-scroll-area">滚动区域</div>
    </div>
    <sl-float-button
      v-show="visible"
      icon="arrow-up"
      type="primary"
      tooltip="返回顶部"
      class="fb-back-top"
      @sl-click="handleBackTop"
    ></sl-float-button>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/float-button/float-button.js';

  const scrollerRef = ref(null);
  const visible = ref(false);

  function handleScroll() {
    visible.value = scrollerRef.value.scrollTop > 100;
  }

  function handleBackTop() {
    scrollerRef.value.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<style scoped>
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
  }
</style>
```
