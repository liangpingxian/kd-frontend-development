# sl-thought-chain 思维链组件 Vue 使用指南

## 概述

ThoughtChain（思维链）用于可视化和追踪 Agent 的调用链路，以垂直连接的节点列表展示 AI 推理或执行过程中的每一步。

组件套件包含三个元素：

- `<sl-thought-chain>` — 容器，管理链路布局、连接线和展开/折叠状态
- `<sl-thought-chain-node>` — 链路中的单个节点，包含图标、标题、描述、可折叠内容和底部区域
- `<sl-thought-chain-item>` — 独立的标签/徽章，用于在完整链路之外展示单个动作条目

> Vue 中直接使用 Web Component 标签名（kebab-case），需确保已注册自定义元素。在 `vite.config.ts` 或 `vue.config.js` 中配置 `compilerOptions.isCustomElement` 以识别 `sl-` 前缀标签。

---

## 基础用法

最简单的思维链，展示几个步骤节点。

```vue
<template>
  <sl-thought-chain>
    <sl-thought-chain-node title="分析用户意图" description="解析用户输入的自然语言"></sl-thought-chain-node>
    <sl-thought-chain-node title="检索知识库" description="从向量数据库中查找相关文档"></sl-thought-chain-node>
    <sl-thought-chain-node title="生成回答" description="基于检索结果生成最终回答"></sl-thought-chain-node>
  </sl-thought-chain>
</template>

<script setup>
import '@shoelace-style/shoelace/dist/components/thought-chain/thought-chain.js';
import '@shoelace-style/shoelace/dist/components/thought-chain-node/thought-chain-node.js';
</script>
```

---

## 节点状态

通过 `status` 属性设置节点的状态：`loading`、`success`、`error`、`abort`。

```vue
<template>
  <sl-thought-chain>
    <sl-thought-chain-node title="解析输入" status="success" description="已完成"></sl-thought-chain-node>
    <sl-thought-chain-node title="调用工具" status="loading" description="正在执行中..."></sl-thought-chain-node>
    <sl-thought-chain-node title="生成结果" status="error" description="执行失败"></sl-thought-chain-node>
    <sl-thought-chain-node title="已中止" status="abort" description="用户取消了操作"></sl-thought-chain-node>
  </sl-thought-chain>
</template>

<script setup>
import '@shoelace-style/shoelace/dist/components/thought-chain/thought-chain.js';
import '@shoelace-style/shoelace/dist/components/thought-chain-node/thought-chain-node.js';
</script>
```

---

## 可折叠内容

设置 `collapsible` 属性使节点内容可折叠，需要配合 `node-key` 使用。通过 `default-expanded-keys` 设置默认展开的节点。

```vue
<template>
  <sl-thought-chain :default-expanded-keys="['step1']">
    <sl-thought-chain-node node-key="step1" title="第一步：分析" collapsible description="点击展开查看详情">
      <div>这里是第一步的详细分析内容，包括对用户输入的语义解析结果。</div>
    </sl-thought-chain-node>
    <sl-thought-chain-node node-key="step2" title="第二步：检索" collapsible description="点击展开查看详情">
      <div>检索到 3 条相关文档，相似度分别为 0.95、0.87、0.82。</div>
    </sl-thought-chain-node>
    <sl-thought-chain-node node-key="step3" title="第三步：生成" collapsible description="点击展开查看详情">
      <div>基于检索结果，使用 LLM 生成最终回答。</div>
    </sl-thought-chain-node>
  </sl-thought-chain>
</template>

<script setup>
import '@shoelace-style/shoelace/dist/components/thought-chain/thought-chain.js';
import '@shoelace-style/shoelace/dist/components/thought-chain-node/thought-chain-node.js';
</script>
```

---

## 受控展开

通过 `expanded-keys` 属性控制展开状态，监听 `sl-expand` 事件更新。

```vue
<template>
  <sl-thought-chain :expanded-keys="expandedKeys" @sl-expand="handleExpand">
    <sl-thought-chain-node node-key="step1" title="意图识别" collapsible>
      <div>识别到用户意图：查询天气信息</div>
    </sl-thought-chain-node>
    <sl-thought-chain-node node-key="step2" title="API 调用" collapsible>
      <div>调用天气 API 获取数据</div>
    </sl-thought-chain-node>
    <sl-thought-chain-node node-key="step3" title="结果整理" collapsible>
      <div>将 API 返回的数据格式化为自然语言</div>
    </sl-thought-chain-node>
  </sl-thought-chain>
  <div style="margin-top: 8px; font-size: 13px; color: var(--sl-color-neutral-600)">
    当前展开: {{ expandedKeys.length > 0 ? expandedKeys.join(', ') : '无' }}
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@shoelace-style/shoelace/dist/components/thought-chain/thought-chain.js';
import '@shoelace-style/shoelace/dist/components/thought-chain-node/thought-chain-node.js';

const expandedKeys = ref(['step1']);

function handleExpand(event) {
  expandedKeys.value = event.detail.expandedKeys;
}
</script>
```

---

## 闪烁动画

设置 `blink` 属性使节点标题产生闪烁/脉冲动画，通常用于表示正在活跃的步骤。

```vue
<template>
  <sl-thought-chain>
    <sl-thought-chain-node title="已完成" status="success"></sl-thought-chain-node>
    <sl-thought-chain-node title="正在思考..." blink status="loading"></sl-thought-chain-node>
    <sl-thought-chain-node title="等待中"></sl-thought-chain-node>
  </sl-thought-chain>
</template>

<script setup>
import '@shoelace-style/shoelace/dist/components/thought-chain/thought-chain.js';
import '@shoelace-style/shoelace/dist/components/thought-chain-node/thought-chain-node.js';
</script>
```

---

## 自定义图标

通过 `icon` 插槽自定义节点图标，或使用 `no-icon` 属性隐藏图标区域。

```vue
<template>
  <sl-thought-chain>
    <sl-thought-chain-node title="搜索">
      <sl-icon slot="icon" name="search"></sl-icon>
    </sl-thought-chain-node>
    <sl-thought-chain-node title="代码生成">
      <sl-icon slot="icon" name="code-slash"></sl-icon>
    </sl-thought-chain-node>
    <sl-thought-chain-node title="无图标节点" no-icon></sl-thought-chain-node>
  </sl-thought-chain>
</template>

<script setup>
import '@shoelace-style/shoelace/dist/components/thought-chain/thought-chain.js';
import '@shoelace-style/shoelace/dist/components/thought-chain-node/thought-chain-node.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
</script>
```

---

## 自定义插槽内容

使用 `title`、`description`、`footer` 插槽自定义富文本内容。

```vue
<template>
  <sl-thought-chain>
    <sl-thought-chain-node collapsible node-key="rich">
      <span slot="title" style="color: var(--sl-color-primary-600); font-weight: 600">自定义标题</span>
      <span slot="description">带有 <strong>富文本</strong> 的描述</span>
      <div>这是可折叠的主体内容区域。</div>
      <div slot="footer" style="font-size: 12px; color: var(--sl-color-neutral-500)">底部信息 · 耗时 1.2s</div>
    </sl-thought-chain-node>
  </sl-thought-chain>
</template>

<script setup>
import '@shoelace-style/shoelace/dist/components/thought-chain/thought-chain.js';
import '@shoelace-style/shoelace/dist/components/thought-chain-node/thought-chain-node.js';
</script>
```

---

## 连接线样式

通过 `line` 属性控制节点之间的连接线样式，支持 `solid`（默认）、`dashed`、`dotted` 和 `none`（无连接线）。

```vue
<template>
  <div style="display: flex; gap: 40px">
    <div>
      <div style="margin-bottom: 8px; font-size: 13px; color: var(--sl-color-neutral-600)">solid（默认）</div>
      <sl-thought-chain line="solid">
        <sl-thought-chain-node title="步骤 1"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 2"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 3"></sl-thought-chain-node>
      </sl-thought-chain>
    </div>
    <div>
      <div style="margin-bottom: 8px; font-size: 13px; color: var(--sl-color-neutral-600)">dashed</div>
      <sl-thought-chain line="dashed">
        <sl-thought-chain-node title="步骤 1"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 2"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 3"></sl-thought-chain-node>
      </sl-thought-chain>
    </div>
    <div>
      <div style="margin-bottom: 8px; font-size: 13px; color: var(--sl-color-neutral-600)">dotted</div>
      <sl-thought-chain line="dotted">
        <sl-thought-chain-node title="步骤 1"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 2"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 3"></sl-thought-chain-node>
      </sl-thought-chain>
    </div>
    <div>
      <div style="margin-bottom: 8px; font-size: 13px; color: var(--sl-color-neutral-600)">无连接线</div>
      <sl-thought-chain line="none">
        <sl-thought-chain-node title="步骤 1"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 2"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 3"></sl-thought-chain-node>
      </sl-thought-chain>
    </div>
  </div>
</template>

<script setup>
import '@shoelace-style/shoelace/dist/components/thought-chain/thought-chain.js';
import '@shoelace-style/shoelace/dist/components/thought-chain-node/thought-chain-node.js';
</script>
```

---

## 尺寸

通过 `size` 属性调整思维链的尺寸，支持 `small`、`middle`（默认）、`large`。

```vue
<template>
  <div style="display: flex; gap: 40px">
    <div>
      <div style="margin-bottom: 8px; font-size: 13px; color: var(--sl-color-neutral-600)">small</div>
      <sl-thought-chain size="small">
        <sl-thought-chain-node title="步骤 1" description="描述"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 2" description="描述"></sl-thought-chain-node>
      </sl-thought-chain>
    </div>
    <div>
      <div style="margin-bottom: 8px; font-size: 13px; color: var(--sl-color-neutral-600)">middle</div>
      <sl-thought-chain size="middle">
        <sl-thought-chain-node title="步骤 1" description="描述"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 2" description="描述"></sl-thought-chain-node>
      </sl-thought-chain>
    </div>
    <div>
      <div style="margin-bottom: 8px; font-size: 13px; color: var(--sl-color-neutral-600)">large</div>
      <sl-thought-chain size="large">
        <sl-thought-chain-node title="步骤 1" description="描述"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 2" description="描述"></sl-thought-chain-node>
      </sl-thought-chain>
    </div>
  </div>
</template>

<script setup>
import '@shoelace-style/shoelace/dist/components/thought-chain/thought-chain.js';
import '@shoelace-style/shoelace/dist/components/thought-chain-node/thought-chain-node.js';
</script>
```

---

## ThoughtChainItem 独立标签

`<sl-thought-chain-item>` 可以独立使用，作为标签/徽章展示单个动作条目。

```vue
<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap">
    <sl-thought-chain-item title="默认"></sl-thought-chain-item>
    <sl-thought-chain-item title="成功" status="success"></sl-thought-chain-item>
    <sl-thought-chain-item title="加载中" status="loading"></sl-thought-chain-item>
    <sl-thought-chain-item title="错误" status="error"></sl-thought-chain-item>
    <sl-thought-chain-item title="已中止" status="abort"></sl-thought-chain-item>
  </div>
</template>

<script setup>
import '@shoelace-style/shoelace/dist/components/thought-chain-item/thought-chain-item.js';
</script>
```

---

## ThoughtChainItem 变体

通过 `variant` 属性设置不同的视觉变体：`solid`（默认）、`outlined`、`text`。

```vue
<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap">
    <sl-thought-chain-item title="Solid" variant="solid"></sl-thought-chain-item>
    <sl-thought-chain-item title="Outlined" variant="outlined"></sl-thought-chain-item>
    <sl-thought-chain-item title="Text" variant="text"></sl-thought-chain-item>
  </div>
</template>

<script setup>
import '@shoelace-style/shoelace/dist/components/thought-chain-item/thought-chain-item.js';
</script>
```

---

## 可点击的 ThoughtChainItem

设置 `clickable` 属性使 Item 可点击，监听 `sl-click` 事件。

```vue
<template>
  <div style="display: flex; gap: 8px">
    <sl-thought-chain-item title="可点击" clickable @sl-click="handleClick"></sl-thought-chain-item>
    <sl-thought-chain-item title="禁用" clickable disabled @sl-click="handleDisabledClick"></sl-thought-chain-item>
  </div>
  <div style="margin-top: 8px; font-size: 13px; color: var(--sl-color-neutral-600)">
    {{ log || '点击上方标签试试' }}
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@shoelace-style/shoelace/dist/components/thought-chain-item/thought-chain-item.js';

const log = ref('');

function handleClick() {
  log.value = '点击了「可点击」';
}

function handleDisabledClick() {
  log.value = '不应触发';
}
</script>
```

---

## 动态添加节点

通过响应式数据动态添加思维链节点。

```vue
<template>
  <button @click="addNode" style="margin-bottom: 12px">添加节点</button>
  <sl-thought-chain>
    <sl-thought-chain-node
      v-for="node in nodes"
      :key="node.key"
      :title="node.title"
      :description="node.description"
      :status="node.status"
    ></sl-thought-chain-node>
  </sl-thought-chain>
</template>

<script setup>
import { ref } from 'vue';
import '@shoelace-style/shoelace/dist/components/thought-chain/thought-chain.js';
import '@shoelace-style/shoelace/dist/components/thought-chain-node/thought-chain-node.js';

const nodes = ref([{ key: 's1', title: '初始节点', description: '已完成', status: 'success' }]);

function addNode() {
  const idx = nodes.value.length + 1;
  const newNode = {
    key: `s${idx}`,
    title: `动态节点 ${idx}`,
    description: '正在执行...',
    status: 'loading'
  };
  nodes.value.push(newNode);

  // 模拟异步完成
  setTimeout(() => {
    const target = nodes.value.find(n => n.key === newNode.key);
    if (target) {
      target.status = 'success';
      target.description = '已完成';
    }
  }, 2000);
}
</script>
```

---

## 完整示例

模拟一个 AI Agent 的完整调用链路，综合使用自定义图标、可折叠内容、状态、底部信息等功能。

```vue
<template>
  <sl-thought-chain :default-expanded-keys="['search', 'generate']">
    <sl-thought-chain-node node-key="parse" title="解析用户意图" status="success" description="耗时 0.3s" collapsible>
      <sl-icon slot="icon" name="chat-dots"></sl-icon>
      <div>用户输入: "帮我查一下北京明天的天气"</div>
      <div>识别意图: 天气查询</div>
      <div>提取实体: 城市=北京, 时间=明天</div>
    </sl-thought-chain-node>

    <sl-thought-chain-node node-key="search" title="调用天气 API" status="success" description="耗时 1.2s" collapsible>
      <sl-icon slot="icon" name="cloud"></sl-icon>
      <div>请求: GET /api/weather?city=beijing&amp;date=tomorrow</div>
      <div>响应: 200 OK</div>
      <div>数据: 晴, 最高 28°C, 最低 18°C</div>
    </sl-thought-chain-node>

    <sl-thought-chain-node node-key="generate" title="生成回答" status="success" description="耗时 0.8s" collapsible>
      <sl-icon slot="icon" name="stars"></sl-icon>
      <div>北京明天天气晴朗，最高温度 28°C，最低温度 18°C，适合户外活动。</div>
      <div slot="footer" style="font-size: 12px; color: var(--sl-color-neutral-500)">总耗时 2.3s · Token 消耗 156</div>
    </sl-thought-chain-node>
  </sl-thought-chain>
</template>

<script setup>
import '@shoelace-style/shoelace/dist/components/thought-chain/thought-chain.js';
import '@shoelace-style/shoelace/dist/components/thought-chain-node/thought-chain-node.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
</script>
```

---

## CSS 自定义样式

通过 CSS 自定义属性和 `::part()` 选择器自定义思维链样式。

```vue
<template>
  <sl-thought-chain class="styled-chain" :default-expanded-keys="['s1']">
    <sl-thought-chain-node node-key="s1" title="自定义样式" description="通过 CSS 变量和 ::part 自定义" collapsible>
      <div>自定义背景和间距的内容区域。</div>
    </sl-thought-chain-node>
    <sl-thought-chain-node title="第二步" description="继承自定义样式"></sl-thought-chain-node>
  </sl-thought-chain>
</template>

<script setup>
import '@shoelace-style/shoelace/dist/components/thought-chain/thought-chain.js';
import '@shoelace-style/shoelace/dist/components/thought-chain-node/thought-chain-node.js';
</script>

<style scoped>
.styled-chain {
  --sl-thought-chain-gap: var(--sl-spacing-medium);
  --sl-thought-chain-connector-color: var(--sl-color-primary-300);
  --sl-thought-chain-icon-size: var(--sl-font-size-large);
}

/* 注意：scoped 样式中 ::part() 需要使用 :deep() 或移到全局样式 */
</style>

<style>
.styled-chain sl-thought-chain-node::part(title) {
  color: var(--sl-color-primary-700);
  font-weight: 600;
}
.styled-chain sl-thought-chain-node::part(description) {
  font-style: italic;
}
.styled-chain sl-thought-chain-node::part(content) {
  background: var(--sl-color-neutral-50);
  border-radius: var(--sl-border-radius-medium);
  padding: var(--sl-spacing-small);
}
</style>
```

---

## Vue 配置说明

在 Vue 3 项目中使用 Shoelace Web Components，需要配置 Vue 编译器识别自定义元素标签：

### Vite 配置

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('sl-')
        }
      }
    })
  ]
});
```

### Vue CLI 配置

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('sl-')
        }
      }));
  }
};
```

---

## API 参考

### `<sl-thought-chain>` 属性

| 属性                  | HTML 属性               | 类型                                         | 默认值      | 说明                         |
| --------------------- | ----------------------- | -------------------------------------------- | ----------- | ---------------------------- |
| `size`                | `size`                  | `'small' \| 'middle' \| 'large'`             | `'middle'`  | 节点尺寸                     |
| `line`                | `line`                  | `boolean \| 'solid' \| 'dashed' \| 'dotted'` | `true`      | 连接线样式                   |
| `defaultExpandedKeys` | `default-expanded-keys` | `string[]`                                   | `[]`        | 默认展开的节点 key（非受控） |
| `expandedKeys`        | `expanded-keys`         | `string[]`                                   | `undefined` | 当前展开的节点 key（受控）   |

### `<sl-thought-chain>` 事件

| 事件        | 详情                                      | 说明                |
| ----------- | ----------------------------------------- | ------------------- |
| `sl-expand` | `{ key: string, expandedKeys: string[] }` | 折叠/展开节点时触发 |

### `<sl-thought-chain>` CSS Parts

| Part   | 说明           |
| ------ | -------------- |
| `base` | 组件基础包装器 |

### `<sl-thought-chain>` CSS 自定义属性

| 属性                                 | 说明                 | 默认值                        |
| ------------------------------------ | -------------------- | ----------------------------- |
| `--sl-thought-chain-gap`             | 图标与节点主体的间距 | `var(--sl-spacing-small)`     |
| `--sl-thought-chain-connector-color` | 连接线颜色           | `var(--sl-color-neutral-300)` |
| `--sl-thought-chain-icon-size`       | 节点图标尺寸         | `var(--sl-font-size-medium)`  |

---

### `<sl-thought-chain-node>` 属性

| 属性          | HTML 属性     | 类型                                                 | 默认值  | 说明                                  |
| ------------- | ------------- | ---------------------------------------------------- | ------- | ------------------------------------- |
| `nodeKey`     | `node-key`    | `string`                                             | `''`    | 唯一标识（折叠功能必需）              |
| `title`       | `title`       | `string`                                             | `''`    | 标题文本（或使用 `title` 插槽）       |
| `description` | `description` | `string`                                             | `''`    | 描述文本（或使用 `description` 插槽） |
| `status`      | `status`      | `'loading' \| 'success' \| 'error' \| 'abort' \| ''` | `''`    | 状态指示                              |
| `collapsible` | `collapsible` | `boolean`                                            | `false` | 内容是否可折叠                        |
| `blink`       | `blink`       | `boolean`                                            | `false` | 标题闪烁动画                          |
| `noIcon`      | `no-icon`     | `boolean`                                            | `false` | 隐藏图标区域                          |

### `<sl-thought-chain-node>` 插槽

| 插槽          | 说明                       |
| ------------- | -------------------------- |
| _(默认)_      | 节点主体内容（可折叠区域） |
| `icon`        | 自定义图标                 |
| `title`       | 富文本标题                 |
| `description` | 富文本描述                 |
| `footer`      | 底部内容                   |

### `<sl-thought-chain-node>` CSS Parts

| Part            | 说明                    |
| --------------- | ----------------------- |
| `base`          | 节点基础包装器          |
| `icon`          | 图标容器                |
| `header`        | 头部区域（标题 + 描述） |
| `title`         | 标题区域                |
| `description`   | 描述区域                |
| `content`       | 可折叠内容包装器        |
| `content-inner` | 内容内层包装器          |
| `footer`        | 底部区域                |
| `collapse-icon` | 折叠箭头图标            |

---

### `<sl-thought-chain-item>` 属性

| 属性          | HTML 属性     | 类型                                                 | 默认值    | 说明                                  |
| ------------- | ------------- | ---------------------------------------------------- | --------- | ------------------------------------- |
| `title`       | `title`       | `string`                                             | `''`      | 标题文本（或使用 `title` 插槽）       |
| `description` | `description` | `string`                                             | `''`      | 描述文本（或使用 `description` 插槽） |
| `status`      | `status`      | `'loading' \| 'success' \| 'error' \| 'abort' \| ''` | `''`      | 状态指示                              |
| `variant`     | `variant`     | `'solid' \| 'outlined' \| 'text'`                    | `'solid'` | 视觉变体                              |
| `blink`       | `blink`       | `boolean`                                            | `false`   | 闪烁动画                              |
| `disabled`    | `disabled`    | `boolean`                                            | `false`   | 禁用状态                              |
| `clickable`   | `clickable`   | `boolean`                                            | `false`   | 是否可点击                            |

### `<sl-thought-chain-item>` 插槽

| 插槽          | 说明       |
| ------------- | ---------- |
| `icon`        | 自定义图标 |
| `title`       | 富文本标题 |
| `description` | 富文本描述 |

### `<sl-thought-chain-item>` 事件

| 事件       | 说明                                         |
| ---------- | -------------------------------------------- |
| `sl-click` | 点击时触发（需 `clickable` 且非 `disabled`） |

### `<sl-thought-chain-item>` CSS Parts

| Part          | 说明       |
| ------------- | ---------- |
| `base`        | 基础包装器 |
| `icon`        | 图标容器   |
| `content`     | 内容包装器 |
| `title`       | 标题区域   |
| `description` | 描述区域   |

---

## 交互行为说明

1. **折叠/展开**：点击设置了 `collapsible` 属性的节点标题区域可切换内容的展开/折叠状态，带有平滑的高度过渡动画（250ms ease）。
2. **键盘支持**：可折叠节点的标题支持 `Enter` 和 `Space` 键触发展开/折叠。
3. **受控 vs 非受控**：
   - 非受控模式：使用 `:default-expanded-keys` 绑定初始展开状态，组件内部管理后续状态变化。
   - 受控模式：使用 `:expanded-keys` 绑定响应式数据，需在 `@sl-expand` 事件回调中更新。
4. **状态图标**：`loading` 状态显示旋转加载器，`success`/`error`/`abort` 显示对应的图标。无状态时显示序号。
5. **闪烁动画**：`blink` 属性在标题上产生脉冲动画效果，适合标记当前活跃步骤。
6. **ThoughtChainItem 点击**：设置 `clickable` 后，Item 会显示悬停样式和指针光标。`disabled` 状态下点击事件不会触发。

---

## 最佳实践

1. **始终为可折叠节点设置 `node-key`**：`node-key` 是折叠功能的必要标识，确保每个可折叠节点有唯一的 key。
2. **配置 `isCustomElement`**：确保 Vue 编译器识别 `sl-` 前缀标签为自定义元素，避免组件解析警告。
3. **使用按需引入**：在 `<script setup>` 中按需导入组件 JS 文件，如 `import '@shoelace-style/shoelace/dist/components/thought-chain/thought-chain.js'`。
4. **属性绑定**：数组/对象类型属性使用 `:` 绑定（如 `:default-expanded-keys="['a']"`），字符串属性直接写（如 `size="small"`）。
5. **事件监听**：使用 `@sl-expand`、`@sl-click` 格式监听 Shoelace 自定义事件，通过 `event.detail` 获取事件数据。
6. **`::part()` 样式**：Web Component 的 `::part()` 选择器无法在 Vue `scoped` 样式中使用，需放在非 scoped 的 `<style>` 块中。
7. **避免自闭合标签**：Vue 模板中 Web Components 不支持自闭合标签，始终使用 `<sl-thought-chain-node></sl-thought-chain-node>`。

---

## 常见问题

### Q: Vue 控制台出现 "Failed to resolve component" 警告？

需要配置 `isCustomElement`，告诉 Vue 编译器 `sl-` 前缀标签是自定义元素而非 Vue 组件。参见上方「Vue 配置说明」。

### Q: 折叠动画不生效？

确保节点设置了 `collapsible` 属性和 `node-key` 属性，且节点有子元素内容。

### Q: `::part()` 样式在 scoped 中不生效？

Vue 的 `scoped` 样式会添加属性选择器，无法穿透 Shadow DOM。将 `::part()` 相关样式放在非 scoped 的 `<style>` 块中，或使用 CSS 自定义属性来自定义样式。

### Q: 如何在受控模式下更新展开状态？

```vue
<sl-thought-chain :expanded-keys="expandedKeys" @sl-expand="handleExpand">
  ...
</sl-thought-chain>

<script setup>
const expandedKeys = ref(['step1']);
function handleExpand(event) {
  expandedKeys.value = event.detail.expandedKeys;
}
</script>
```

### Q: ThoughtChainItem 和 ThoughtChainNode 的区别？

- `<sl-thought-chain-node>` 是链路中的节点，必须放在 `<sl-thought-chain>` 内部使用，有连接线、序号图标等链路特性。
- `<sl-thought-chain-item>` 是独立的标签/徽章组件，可以在任何地方独立使用，适合展示单个动作条目。
