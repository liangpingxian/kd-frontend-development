# XMarkdown Markdown 渲染器

`sl-x-markdown` 用于渲染 Markdown 内容，支持流式输出、代码高亮、`think` / `sources` 增强块，以及将指定 Markdown 节点映射成自定义元素。

## 特性概览

- **Markdown 渲染**：支持标题、段落、列表、引用、表格、图片、链接、代码块
- **流式输出**：通过 `streaming` 控制未完成节点占位符和 tail
- **聊天增强**：内置 `think` 和 `sources`
- **节点映射**：支持把 language、HTML 标签、tail、incomplete-* 映射为自定义元素
- **安全控制**：`escapeRawHtml` 默认开启
- **主题切换**：支持 `light`、`dark` 和自定义 class 名

## 核心约束

- 组件只读取 `content` 属性，不读取标签体中的 Markdown 文本。
- LWC HTML 里只能传字符串、布尔、数字等简单值；`components`、`plugins`、`streaming` 这类复杂属性必须在 `renderedCallback()` 中通过实例赋值。
- `components` 的 value 必须是合法的自定义元素标签名，不能传 LWC 组件名。
- `sl-x-markdown` 当前没有 Shoelace 自定义事件需要监听，主要通过更新组件实例属性来驱动渲染。
- `escape-raw-html` 默认建议保持开启；只有内容完全可信时才关闭。

## 基础用法

**index.html**
```html
<template>
  <sl-x-markdown
    kwc:external
    class="markdown-el"
    content={content}
  ></sl-x-markdown>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/x-markdown/x-markdown.js';

export default class XMarkdownBasic extends KingdeeElement {
    content = `# Hello

这是 **XMarkdown** 的基础示例。`;
}
```

## 深色主题

**index.html**
```html
<template>
  <sl-x-markdown
    kwc:external
    class="markdown-el"
    theme="dark"
    content={content}
  ></sl-x-markdown>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/x-markdown/x-markdown.js';

export default class XMarkdownDark extends KingdeeElement {
    content = `## Dark Theme

> 使用内置 dark 主题渲染 Markdown。`;
}
```

## 流式输出

复杂对象属性要在 JS 中回写给组件实例。

**index.html**
```html
<template>
  <sl-x-markdown
    kwc:external
    class="markdown-el"
    content={content}
  ></sl-x-markdown>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/x-markdown/x-markdown.js';

export default class XMarkdownStreaming extends KingdeeElement {
    content = '[Shoelace 官网](https://shoelace.style';
    _initialized = false;

    renderedCallback() {
        if (this._initialized) return;
        this._initialized = true;

        const el = this.template.querySelector('.markdown-el');
        if (el) {
            el.streaming = {
                hasNextChunk: true,
                tail: {
                    content: '正在生成中...'
                },
                animationConfig: {
                    fadeDuration: 480,
                    easing: 'ease-out'
                }
            };
        }
    }
}
```

## think 和 sources

**index.html**
```html
<template>
  <sl-x-markdown
    kwc:external
    class="markdown-el"
    content={content}
  ></sl-x-markdown>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/x-markdown/x-markdown.js';

export default class XMarkdownChatBlocks extends KingdeeElement {
    content = `\`\`\`think
先比较两个方案的复杂度，再决定最终实现。
\`\`\`

\`\`\`sources
https://shoelace.style
https://x.ant.design/x-markdowns/introduce
\`\`\``;
}
```

## 自定义节点映射

`components` 的 key 通常有这些来源：

- fenced code language，例如 `mermaid`
- 自定义 HTML 标签名，例如 `agent-card`
- 特殊节点，例如 `tail`、`incomplete-link`

被映射的自定义元素会收到这些 property 和 `data-*`：

- `nodeType`
- `streamStatus`
- `textContent`
- `attrs`
- `meta`
- `raw`

**index.html**
```html
<template>
  <sl-x-markdown
    kwc:external
    class="markdown-el"
    content={content}
  ></sl-x-markdown>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/x-markdown/x-markdown.js';

export default class XMarkdownMermaid extends KingdeeElement {
    content = `\`\`\`mermaid
graph TD;
A-->B;
\`\`\``;
    _initialized = false;

    renderedCallback() {
        if (!customElements.get('md-mermaid-viewer')) {
            customElements.define('md-mermaid-viewer', class extends HTMLElement {
                connectedCallback() {
                    const source = this.textContent || this.dataset.textContent || '';
                    this.innerHTML = `<pre>${source}</pre>`;
                }
            });
        }

        if (this._initialized) return;
        this._initialized = true;

        const el = this.template.querySelector('.markdown-el');
        if (el) {
            el.components = {
                mermaid: 'md-mermaid-viewer'
            };
        }
    }
}
```

## 自定义未完成节点

**index.html**
```html
<template>
  <sl-x-markdown
    kwc:external
    class="markdown-el"
    content={content}
  ></sl-x-markdown>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/x-markdown/x-markdown.js';

export default class XMarkdownIncompleteImage extends KingdeeElement {
    content = '![preview](https://static.example.com/demo';
    _initialized = false;

    renderedCallback() {
        if (!customElements.get('md-incomplete-image')) {
            customElements.define('md-incomplete-image', class extends HTMLElement {
                connectedCallback() {
                    this.textContent = '图片内容尚未生成完成';
                }
            });
        }

        if (this._initialized) return;
        this._initialized = true;

        const el = this.template.querySelector('.markdown-el');
        if (el) {
            el.streaming = {
                hasNextChunk: true,
                incompleteMarkdownComponentMap: {
                    image: 'md-incomplete-image'
                }
            };
        }
    }
}
```

## 插件管线

**index.html**
```html
<template>
  <sl-x-markdown
    kwc:external
    class="markdown-el"
    content={content}
  ></sl-x-markdown>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/x-markdown/x-markdown.js';

export default class XMarkdownPlugins extends KingdeeElement {
    content = '这里有一个 [doc:nav] 占位标记。';
    _initialized = false;

    renderedCallback() {
        if (this._initialized) return;
        this._initialized = true;

        const el = this.template.querySelector('.markdown-el');
        if (el) {
            el.plugins = [
                {
                    name: 'doc-link-replacer',
                    preprocess(source) {
                        return source.replaceAll('[doc:nav]', '[Nav 组件文档](/components/nav)');
                    }
                }
            ];
        }
    }
}
```

## 原始 HTML 安全控制

**index.html**
```html
<template>
  <sl-x-markdown
    kwc:external
    class="markdown-el"
    content={content}
    escape-raw-html={escapeRawHtml}
  ></sl-x-markdown>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/x-markdown/x-markdown.js';

export default class XMarkdownTrustedHtml extends KingdeeElement {
    content = `<sl-tag variant="success">可信 HTML</sl-tag>`;
    escapeRawHtml = false;
}
```

## API 概览

### sl-x-markdown

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `content` | 要渲染的 Markdown 内容 | `string` | `''` |
| `components` | 节点映射表，value 必须是自定义元素标签名 | `Record<string, string>` | `{}` |
| `plugins` | Markdown 管线插件 | `SlXMarkdownPlugin[]` | `[]` |
| `theme` | 主题名，支持 `light`、`dark` 或自定义 class 名 | `string` | `'light'` |
| `open-links-in-new-tab` | 链接是否新开标签页 | `boolean` | `false` |
| `escape-raw-html` | 是否转义原始 HTML | `boolean` | `true` |
| `debug` | 本地开发环境下输出调试信息 | `boolean` | `false` |
| `streaming` | 流式渲染配置，传 `false` 表示关闭 | `SlXMarkdownStreamingConfig \| false` | `false` |

### streaming 配置

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| `hasNextChunk` | 后续是否还有流式内容 | `boolean` |
| `incompleteMarkdownComponentMap` | 未完成节点映射，仅支持 `link`、`image`、`heading`、`table`、`xml` | `Partial<Record<...>>` |
| `enableAnimation` | 预留动画开关 | `boolean` |
| `animationConfig` | tail 动画配置 | `{ fadeDuration?: number; easing?: string }` |
| `tail` | tail 展示配置，`true` 使用默认文案，`false` 不展示 | `boolean \| { content?: string; component?: string }` |

## 使用建议

- 在 LWC 中，`components`、`plugins`、`streaming` 一律在 `renderedCallback()` 里通过实例赋值，不要尝试在 HTML 上写对象字面量。
- 自定义节点映射时，优先定义 custom element，再把标签名写进 `components`，不要直接传 LWC 组件。
- 流式结束后记得把 `el.streaming = { hasNextChunk: false }` 或 `false`，否则 incomplete placeholder 和 tail 不会消失。
- 只有可信 HTML 才关闭 `escape-raw-html`；普通富文本需求优先走 Markdown 和 `components`。
- `debug` 只会在 localhost 这类开发域名下显示。
