# XMarkdown Markdown 渲染器

`sl-x-markdown` 用于渲染 Markdown 内容，支持流式输出、代码高亮、`think` / `sources` 聊天增强块，以及把指定 Markdown 节点映射成自定义元素。

## 特性概览

- **Markdown 渲染**：支持标题、段落、列表、引用、表格、图片、链接、代码块等常见语法
- **流式渲染**：通过 `streaming` 配置处理增量输出、未闭合节点占位符和尾部提示
- **聊天增强块**：内置 `think` 和 `sources` 两类内容块的默认展示
- **节点映射**：可将 fenced code language、HTML 自定义标签、tail、incomplete-* 映射到自定义元素
- **安全控制**：`escapeRawHtml` 默认开启，避免直接渲染原始 HTML
- **主题切换**：内置 `light` / `dark`，也支持传入自定义 class 名

## 核心约束

- 组件**只读取 `content` 属性**，默认插槽不参与渲染，不要把 Markdown 内容写到标签体中。
- `components`、`plugins`、`streaming` 都是对象/数组类型，在 Vue 中必须使用 **camelCase + `.prop`** 传值。
- `components` 的 value 必须是合法的 **自定义元素标签名**，例如 `md-mermaid-viewer`，不能传普通 Vue 组件名。
- `escapeRawHtml` 默认是 `true`。只有内容完全可信时，才允许关闭。
- `sl-x-markdown` 当前**没有组件级自定义事件**，通常通过更新 `content` / `streaming` 这些属性驱动重渲染。

## 基础用法

```vue
<template>
  <sl-x-markdown :content="content"></sl-x-markdown>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/x-markdown/x-markdown.js';

const content = `# Hello

这是 **XMarkdown** 的基础示例。

- 支持列表
- 支持引用
- 支持表格`;
</script>
```

## 深色主题

```vue
<template>
  <sl-x-markdown
    theme="dark"
    :content="content"
  ></sl-x-markdown>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/x-markdown/x-markdown.js';

const content = `## Dark Theme

> 使用内置 dark 主题渲染 Markdown。`;
</script>
```

## 流式输出

当消息还在生成时，将 `streaming.hasNextChunk` 设为 `true`。组件会自动检查未闭合的链接、图片、标题、表格、XML 标签，并渲染占位节点和 tail。

```vue
<template>
  <sl-x-markdown
    :content="content"
    :streaming.prop="streaming"
  ></sl-x-markdown>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/x-markdown/x-markdown.js';

const content = `[Shoelace 官网](https://shoelace.style`;

const streaming = {
  hasNextChunk: true,
  tail: {
    content: '正在生成中...'
  },
  animationConfig: {
    fadeDuration: 480,
    easing: 'ease-out'
  }
};
</script>
```

## 使用 think 和 sources

`think` 与 `sources` 不需要额外配置，组件内置了默认样式壳。

```vue
<template>
  <sl-x-markdown :content="content"></sl-x-markdown>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/x-markdown/x-markdown.js';

const content = `\`\`\`think
先比较两个方案的复杂度，再决定最终实现。
\`\`\`

\`\`\`sources
https://shoelace.style
https://x.ant.design/x-markdowns/introduce
\`\`\``;
</script>
```

## 自定义节点映射

`components` 支持两类常见映射：

- fenced code language，例如 `mermaid`、`think`
- 自定义 HTML 标签，例如 `<agent-card></agent-card>`

映射后的自定义元素会收到这些 property / `data-*`：

- `nodeType`
- `streamStatus`
- `textContent`
- `attrs`
- `meta`
- `raw`

```vue
<template>
  <sl-x-markdown
    :content="content"
    :components.prop="components"
  ></sl-x-markdown>
</template>

<script setup>
import { onMounted } from 'vue';
import '@kdcloudjs/shoelace/dist/components/x-markdown/x-markdown.js';

const content = `\`\`\`mermaid
graph TD;
A-->B;
\`\`\``;

const components = {
  mermaid: 'md-mermaid-viewer'
};

onMounted(() => {
  if (!customElements.get('md-mermaid-viewer')) {
    customElements.define(
      'md-mermaid-viewer',
      class extends HTMLElement {
        connectedCallback() {
          const source = this.textContent || this.dataset.textContent || '';
          this.innerHTML = `<pre>${source}</pre>`;
        }
      }
    );
  }
});
</script>
```

## 自定义流式占位节点

如果要把未完成的 link / image / heading / table / xml 换成业务组件，优先使用 `streaming.incompleteMarkdownComponentMap`。

```vue
<template>
  <sl-x-markdown
    :content="content"
    :streaming.prop="streaming"
  ></sl-x-markdown>
</template>

<script setup>
import { onMounted } from 'vue';
import '@kdcloudjs/shoelace/dist/components/x-markdown/x-markdown.js';

const content = '![preview](https://static.example.com/demo';

const streaming = {
  hasNextChunk: true,
  incompleteMarkdownComponentMap: {
    image: 'md-incomplete-image'
  }
};

onMounted(() => {
  if (!customElements.get('md-incomplete-image')) {
    customElements.define(
      'md-incomplete-image',
      class extends HTMLElement {
        connectedCallback() {
          this.textContent = '图片内容尚未生成完成';
        }
      }
    );
  }
});
</script>
```

## 插件管线

`plugins` 允许在解析前后处理 Markdown 内容：

- `preprocess(content, context)`：处理原始字符串
- `postprocessTokens(tokens, context)`：处理 `marked` 解析结果

```vue
<template>
  <sl-x-markdown
    :content="content"
    :plugins.prop="plugins"
  ></sl-x-markdown>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/x-markdown/x-markdown.js';

const content = '这里有一个 [doc:nav] 占位标记。';

const plugins = [
  {
    name: 'doc-link-replacer',
    preprocess(source) {
      return source.replaceAll('[doc:nav]', '[Nav 组件文档](/components/nav)');
    }
  }
];
</script>
```

## 原始 HTML 安全控制

默认会转义原始 HTML。只有内容可信时才关闭 `escapeRawHtml`。

```vue
<template>
  <sl-x-markdown
    :content="content"
    :escapeRawHtml="false"
  ></sl-x-markdown>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/x-markdown/x-markdown.js';

const content = `<sl-tag variant="success">可信 HTML</sl-tag>`;
</script>
```

## API 概览

### SlXMarkdown

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `content` | 要渲染的 Markdown 内容 | `string` | `''` |
| `components` | 节点映射表，value 必须是自定义元素标签名 | `Record<string, string>` | `{}` |
| `plugins` | Markdown 管线插件 | `SlXMarkdownPlugin[]` | `[]` |
| `theme` | 主题名，支持 `light`、`dark` 或自定义 class 名 | `string` | `'light'` |
| `openLinksInNewTab` | 链接是否以新标签页打开 | `boolean` | `false` |
| `escapeRawHtml` | 是否转义原始 HTML | `boolean` | `true` |
| `debug` | 本地开发环境下输出调试信息 | `boolean` | `false` |
| `streaming` | 流式渲染配置，传 `false` 表示关闭 | `SlXMarkdownStreamingConfig \| false` | `false` |

### SlXMarkdownStreamingConfig

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| `hasNextChunk` | 后续是否还有流式内容 | `boolean` |
| `incompleteMarkdownComponentMap` | 未完成节点的组件映射，仅支持 `link`、`image`、`heading`、`table`、`xml` | `Partial<Record<...>>` |
| `enableAnimation` | 预留动画开关，当前版本无需依赖它判断是否渲染 | `boolean` |
| `animationConfig` | tail 动画配置 | `{ fadeDuration?: number; easing?: string }` |
| `tail` | tail 展示配置，`true` 使用默认文案，`false` 不展示 | `boolean \| { content?: string; component?: string }` |

## 使用建议

- Vue 中只要遇到 `components`、`plugins`、`streaming`，就固定使用 `:xxx.prop="..."`，不要写成普通 attribute。
- 如果要接 Mermaid、流程图、业务卡片渲染，优先走 `components` 映射，不要直接关闭 `escapeRawHtml` 拼接大段 HTML。
- 流式聊天场景里，推荐同时维护 `content` 和 `streaming.hasNextChunk`；当流结束时，记得把 `hasNextChunk` 切回 `false`。
- 需要自定义 tail 时，优先用 `streaming.tail.component` 或 `components.tail`，这样不会影响主体 Markdown 解析。
- `debug` 只有在本地开发域名下才会显示，不要把它当成生产态功能。
