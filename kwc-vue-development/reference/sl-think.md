# sl-think 思考组件

Think 组件用于展示 AI 模型的思考过程，支持可展开/折叠的内容区域，适用于展示推理、分析等思维链内容。

## 特性概览

| 特性 | 说明 |
|------|------|
| **可展开/折叠** | 点击状态栏可展开或收起内容区域，支持平滑动画过渡 |
| **加载状态** | 支持 `loading` 属性，状态图标替换为加载动画 |
| **闪烁效果** | 支持 `blink` 属性，标题文字添加脉冲动画效果 |
| **受控/非受控** | 支持 `expanded` 属性控制展开状态，或通过事件监听实现受控模式 |
| **自定义图标** | 通过 `icon` 和 `loading-icon` 插槽自定义状态栏图标 |
| **自定义标题** | 通过 `title` 插槽实现富文本标题内容 |
| **CSS 自定义** | 支持 CSS Parts 和 Design Token 自定义样式 |

---

## 基础用法

最简单的思考组件，显示一个可展开/折叠的内容区域。

```vue
<template>
  <sl-think class="basic-think" title="深度思考">
    让我分析一下这个问题... 首先，我们需要考虑几个关键因素。
    基于以上分析，我认为最佳方案是...
  </sl-think>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/think/think.js';
</script>
```

---

## 加载状态

使用 `loading` 属性来显示加载状态，状态图标会替换为加载动画。

```vue
<template>
  <sl-think class="loading-think" title="正在思考中..." loading>
    AI 正在分析您的问题...
  </sl-think>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/think/think.js';
</script>
```

---

## 闪烁效果

使用 `blink` 属性为标题文字添加闪烁动画效果，用于表示正在进行中的状态。

```vue
<template>
  <sl-think class="blink-think" title="思考中" loading blink>
    正在进行深度分析...
  </sl-think>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/think/think.js';
</script>
```

---

## 默认折叠

通过设置 `expanded` 属性为 `false`，可以让内容默认处于折叠状态。

```vue
<template>
  <sl-think
    class="collapsed-think"
    title="点击展开查看思考过程"
    :expanded="isExpanded"
  >
    这是折叠状态下的内容，点击状态栏可以展开。
  </sl-think>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/think/think.js';

const isExpanded = ref(false);
</script>
```

---

## 受控模式

通过监听 `sl-expand` 和 `sl-collapse` 事件来控制展开/折叠状态。

```vue
<template>
  <div>
    <sl-think
      class="controlled-think"
      title="受控模式示例"
      :expanded="isExpanded"
      @sl-expand="handleExpand"
      @sl-collapse="handleCollapse"
    >
      这是一个受控模式的示例，展开状态由父组件管理。
    </sl-think>
    <div class="status-info">
      当前状态: {{ statusText }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import '@kdcloudjs/shoelace/dist/components/think/think.js';

const isExpanded = ref(true);

const statusText = computed(() => {
  return isExpanded.value ? '已展开' : '已折叠';
});

function handleExpand() {
  isExpanded.value = true;
}

function handleCollapse() {
  isExpanded.value = false;
}
</script>

<style scoped>
.status-info {
  margin-top: var(--sl-spacing-medium);
  font-size: var(--sl-font-size-small);
  color: var(--sl-color-neutral-600);
}
</style>
```

---

## 自定义图标

使用 `icon` 插槽来自定义状态栏图标，使用 `loading-icon` 插槽来自定义加载图标。

```vue
<template>
  <div class="icon-demo">
    <sl-think class="custom-icon-think" title="自定义图标">
      <sl-icon slot="icon" name="lightbulb"></sl-icon>
      使用灯泡图标表示思考...
    </sl-think>

    <sl-think
      class="custom-loading-think"
      title="自定义加载图标"
      loading
    >
      <sl-spinner slot="loading-icon" style="font-size: var(--sl-font-size-medium);"></sl-spinner>
      正在加载中...
    </sl-think>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/think/think.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
import '@kdcloudjs/shoelace/dist/components/spinner/spinner.js';
</script>

<style scoped>
.icon-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
}
</style>
```

---

## 自定义标题

使用 `title` 插槽来自定义富文本标题内容。

```vue
<template>
  <sl-think class="custom-title-think">
    <span slot="title" class="custom-title">
      深度分析
      <sl-badge variant="primary" pill>AI</sl-badge>
    </span>
    这是使用富文本标题的示例。
  </sl-think>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/think/think.js';
import '@kdcloudjs/shoelace/dist/components/badge/badge.js';
</script>

<style scoped>
.custom-title {
  display: flex;
  align-items: center;
  gap: var(--sl-spacing-small);
}
</style>
```

---

## 自定义样式

通过 CSS 自定义属性来定制闪烁动画的颜色。

```vue
<template>
  <sl-think class="custom-blink-think" title="自定义闪烁颜色" loading blink>
    使用主题色的闪烁效果。
  </sl-think>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/think/think.js';
</script>

<style scoped>
.custom-blink-think {
  --sl-c-think-TitleTextBlink-color-default: var(--sl-color-primary-500);
  --sl-c-think-TitleTextBlink-color: var(--sl-color-primary-700);
}
</style>
```

---

## 程序化控制展开/折叠

通过响应式数据程序化控制展开和折叠状态。

```vue
<template>
  <div>
    <div class="button-group">
      <sl-button size="small" @click="handleExpand">展开</sl-button>
      <sl-button size="small" @click="handleCollapse">折叠</sl-button>
    </div>
    <sl-think
      class="programmatic-think"
      title="程序化控制示例"
      :expanded="isExpanded"
    >
      通过按钮修改 isExpanded 变量来控制展开/折叠状态。
    </sl-think>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/think/think.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const isExpanded = ref(true);

function handleExpand() {
  isExpanded.value = true;
}

function handleCollapse() {
  isExpanded.value = false;
}
</script>

<style scoped>
.button-group {
  margin-bottom: var(--sl-spacing-medium);
  display: flex;
  gap: var(--sl-spacing-small);
}
</style>
```

---

## 完整示例

综合使用各种功能的完整示例。

```vue
<template>
  <div class="think-examples">
    <!-- 基础用法 -->
    <sl-think class="think-basic" title="基础思考">
      这是一个基础的思考过程展示。
    </sl-think>

    <!-- 加载中 -->
    <sl-think class="think-loading" title="AI 正在思考..." loading blink>
      正在分析您的问题，请稍候...
    </sl-think>

    <!-- 带自定义图标 -->
    <sl-think class="think-custom" title="深度推理">
      <sl-icon slot="icon" name="cpu"></sl-icon>
      使用自定义图标展示思考过程。
    </sl-think>
  </div>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/think/think.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
</script>

<style scoped>
.think-examples {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
}
</style>
```

---

## API 参考

### `sl-think` 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | `''` | 状态栏中显示的标题文本。如需显示 HTML 内容，请使用 `title` 插槽。 |
| `loading` | `boolean` | `false` | 为 `true` 时，状态图标替换为加载动画（或 `loading-icon` 插槽中的自定义内容）。 |
| `expanded` | `boolean` | `true` | 内容区域是否展开。可通过此属性控制展开/折叠状态。 |
| `defaultExpanded` | `boolean` | `true` | 组件首次渲染时的初始展开状态。仅当 `expanded` 属性未设置时生效。 |
| `blink` | `boolean` | `false` | 为 `true` 时，标题文字应用闪烁动画效果，用于表示正在进行中的活动状态。 |

### `sl-think` 插槽

| 插槽 | 说明 |
|------|------|
| _(默认)_ | 思考内容的主体区域。 |
| `title` | 状态栏的标题内容（富文本）。如果只需要纯文本，可使用 `title` 属性。 |
| `icon` | 未加载时显示的自定义图标，默认为思考图标。 |
| `loading-icon` | 加载状态时显示的自定义图标，默认为 Spinner 加载动画。 |

### `sl-think` 事件

| 事件 | 说明 | 事件详情 |
|------|------|----------|
| `sl-expand` | 当内容区域开始展开时触发（动画前）。 | - |
| `sl-collapse` | 当内容区域开始折叠时触发（动画前）。 | - |

### 事件绑定方式

在 Vue 模板中，使用 `@sl-expand` 和 `@sl-collapse` 绑定事件：

```vue
<sl-think
  :expanded="isExpanded"
  @sl-expand="handleExpand"
  @sl-collapse="handleCollapse"
>
  内容...
</sl-think>
```

```js
function handleExpand() {
  isExpanded.value = true;
}

function handleCollapse() {
  isExpanded.value = false;
}
```

### `sl-think` CSS Parts

| Part | 说明 |
|------|------|
| `base` | 组件的基础包装器。 |
| `status` | 可点击的状态栏（图标 + 标题 + 箭头）。 |
| `status-icon` | 状态栏中的图标容器。 |
| `status-text` | 状态栏中的标题文本区域。 |
| `chevron` | 展开/折叠的箭头指示器。 |
| `body` | 可折叠的内容容器。 |
| `content` | body 内部的内容区域。 |

### `sl-think` CSS 自定义属性

| 属性 | 说明 | 默认值 |
|------|------|--------|
| `--sl-c-think-TitleTextBlink-color-default` | 闪烁动画期间的基础文本颜色。 | `rgba(0, 0, 0, 0.45)` |
| `--sl-c-think-TitleTextBlink-color` | 闪烁高亮（光束）颜色。 | `#000` |

---

## 交互行为说明

1. **展开/折叠**：点击状态栏可切换内容的展开/折叠状态，带有平滑的高度过渡动画。
2. **受控 vs 非受控**：
   - 非受控模式：使用 `defaultExpanded` 设置初始展开状态，组件内部管理后续状态变化。
   - 受控模式：使用 `:expanded` 属性，需在 `@sl-expand` 和 `@sl-collapse` 事件回调中手动更新该属性。
3. **加载状态**：`loading` 为 `true` 时，状态图标替换为加载动画（或 `loading-icon` 插槽中的自定义内容）。
4. **闪烁动画**：`blink` 属性在标题上产生脉冲动画效果，适合标记正在进行的思考过程。

---

## 最佳实践

1. **合理使用加载状态**：用 `loading` 表示思考进行中，配合 `blink` 可以更明显地指示当前状态。
2. **响应式数据驱动**：使用 `ref()` 管理展开状态，通过 `:expanded` 绑定实现数据驱动视图。
3. **事件处理**：在受控模式下，通过 `@sl-expand` 和 `@sl-collapse` 事件同步状态。
4. **避免自闭合标签**：Web Components 不支持自闭合标签，始终使用 `<sl-think></sl-think>`。
5. **CSS 使用 Design Token**：样式必须使用 Shoelace Design Token，禁止硬编码 hex 色值或 px 数值。

---

## 常见问题

### Q: 如何自定义闪烁动画颜色？

通过 CSS 自定义属性设置：

```vue
<template>
  <sl-think class="my-think" title="思考中" loading blink>
    内容...
  </sl-think>
</template>

<style scoped>
.my-think {
  --sl-c-think-TitleTextBlink-color-default: var(--sl-color-primary-500);
  --sl-c-think-TitleTextBlink-color: var(--sl-color-primary-700);
}
</style>
```