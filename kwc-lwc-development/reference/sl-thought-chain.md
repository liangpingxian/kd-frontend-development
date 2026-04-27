# sl-thought-chain 思维链组件 KWC/LWC 使用指南

## 概述

ThoughtChain（思维链）用于可视化和追踪 Agent 的调用链路，以垂直连接的节点列表展示 AI 推理或执行过程中的每一步。

组件套件包含三个元素：

- `<sl-thought-chain>` — 容器，管理链路布局、连接线和展开/折叠状态
- `<sl-thought-chain-node>` — 链路中的单个节点，包含图标、标题、描述、可折叠内容和底部区域
- `<sl-thought-chain-item>` — 独立的标签/徽章，用于在完整链路之外展示单个动作条目

---

## 基础用法

最简单的思维链，展示几个步骤节点。

```html
<template kwc:external>
  <sl-thought-chain class="basic-chain">
    <sl-thought-chain-node title="分析用户意图" description="解析用户输入的自然语言"></sl-thought-chain-node>
    <sl-thought-chain-node title="检索知识库" description="从向量数据库中查找相关文档"></sl-thought-chain-node>
    <sl-thought-chain-node title="生成回答" description="基于检索结果生成最终回答"></sl-thought-chain-node>
  </sl-thought-chain>
</template>
```

```js
import { KingdeeElement } from '@anthropic/anthropic-sdk';

export default class BasicThoughtChain extends KingdeeElement {
  // 无需额外逻辑
}
```

---

## 节点状态

通过 `status` 属性设置节点的状态：`loading`、`success`、`error`、`abort`。

```html
<template kwc:external>
  <sl-thought-chain class="status-chain">
    <sl-thought-chain-node title="解析输入" status="success" description="已完成"></sl-thought-chain-node>
    <sl-thought-chain-node title="调用工具" status="loading" description="正在执行中..."></sl-thought-chain-node>
    <sl-thought-chain-node title="生成结果" status="error" description="执行失败"></sl-thought-chain-node>
    <sl-thought-chain-node title="已中止" status="abort" description="用户取消了操作"></sl-thought-chain-node>
  </sl-thought-chain>
</template>
```

```js
import { KingdeeElement } from '@anthropic/anthropic-sdk';

export default class StatusThoughtChain extends KingdeeElement {
  // 状态通过 HTML 属性声明，无需额外逻辑
}
```

---

## 可折叠内容

设置 `collapsible` 属性使节点内容可折叠，需要配合 `node-key` 使用。通过 `default-expanded-keys` 设置默认展开的节点。

```html
<template kwc:external>
  <sl-thought-chain class="collapsible-chain" default-expanded-keys='["step1"]'>
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
```

```js
import { KingdeeElement } from '@anthropic/anthropic-sdk';

export default class CollapsibleThoughtChain extends KingdeeElement {
  // default-expanded-keys 通过 HTML 属性声明
}
```

---

## 受控展开

通过 `expanded-keys` 属性控制展开状态，监听 `sl-expand` 事件更新。

```html
<template kwc:external>
  <sl-thought-chain class="controlled-chain" expanded-keys='["step1"]'>
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
  <div class="expand-info" style="margin-top: 8px; font-size: 13px; color: var(--sl-color-neutral-600);"></div>
</template>
```

```js
import { KingdeeElement } from '@anthropic/anthropic-sdk';

export default class ControlledThoughtChain extends KingdeeElement {
  get shoelaceEventBindings() {
    return [
      {
        selector: '.controlled-chain',
        event: 'sl-expand',
        handler: this.handleExpand
      }
    ];
  }

  renderedCallback() {
    this._bindShoelaceEvents();
  }

  disconnectedCallback() {
    this._unbindShoelaceEvents();
  }

  handleExpand(event) {
    const chain = this.template.querySelector('.controlled-chain');
    const info = this.template.querySelector('.expand-info');
    const { expandedKeys } = event.detail;

    // 受控模式：手动更新 expanded-keys
    chain.expandedKeys = expandedKeys;
    info.textContent = '当前展开: ' + (expandedKeys.length > 0 ? expandedKeys.join(', ') : '无');
  }
}
```

---

## 闪烁动画

设置 `blink` 属性使节点标题产生闪烁/脉冲动画，通常用于表示正在活跃的步骤。

```html
<template kwc:external>
  <sl-thought-chain class="blink-chain">
    <sl-thought-chain-node title="已完成" status="success"></sl-thought-chain-node>
    <sl-thought-chain-node title="正在思考..." blink status="loading"></sl-thought-chain-node>
    <sl-thought-chain-node title="等待中"></sl-thought-chain-node>
  </sl-thought-chain>
</template>
```

```js
import { KingdeeElement } from '@anthropic/anthropic-sdk';

export default class BlinkThoughtChain extends KingdeeElement {
  // blink 通过 HTML 属性声明
}
```

---

## 自定义图标

通过 `icon` 插槽自定义节点图标，或使用 `no-icon` 属性隐藏图标区域。

```html
<template kwc:external>
  <sl-thought-chain class="custom-icon-chain">
    <sl-thought-chain-node title="搜索">
      <sl-icon slot="icon" name="search"></sl-icon>
    </sl-thought-chain-node>
    <sl-thought-chain-node title="代码生成">
      <sl-icon slot="icon" name="code-slash"></sl-icon>
    </sl-thought-chain-node>
    <sl-thought-chain-node title="无图标节点" no-icon></sl-thought-chain-node>
  </sl-thought-chain>
</template>
```

```js
import { KingdeeElement } from '@anthropic/anthropic-sdk';

export default class CustomIconThoughtChain extends KingdeeElement {
  // 图标通过 slot 声明
}
```

---

## 自定义插槽内容

使用 `title`、`description`、`footer` 插槽自定义富文本内容。

```html
<template kwc:external>
  <sl-thought-chain class="slot-chain">
    <sl-thought-chain-node collapsible node-key="rich">
      <span slot="title" style="color: var(--sl-color-primary-600); font-weight: 600;">自定义标题</span>
      <span slot="description">带有 <strong>富文本</strong> 的描述</span>
      <div>这是可折叠的主体内容区域。</div>
      <div slot="footer" style="font-size: 12px; color: var(--sl-color-neutral-500);">底部信息 · 耗时 1.2s</div>
    </sl-thought-chain-node>
  </sl-thought-chain>
</template>
```

```js
import { KingdeeElement } from '@anthropic/anthropic-sdk';

export default class SlotThoughtChain extends KingdeeElement {
  // 插槽内容通过 HTML 声明
}
```

---

## 连接线样式

通过 `line` 属性控制节点之间的连接线样式，支持 `solid`（默认）、`dashed`、`dotted` 和 `none`（无连接线）。

```html
<template kwc:external>
  <div style="display: flex; gap: 40px;">
    <div>
      <div style="margin-bottom: 8px; font-size: 13px; color: var(--sl-color-neutral-600);">solid（默认）</div>
      <sl-thought-chain line="solid">
        <sl-thought-chain-node title="步骤 1"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 2"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 3"></sl-thought-chain-node>
      </sl-thought-chain>
    </div>
    <div>
      <div style="margin-bottom: 8px; font-size: 13px; color: var(--sl-color-neutral-600);">dashed</div>
      <sl-thought-chain line="dashed">
        <sl-thought-chain-node title="步骤 1"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 2"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 3"></sl-thought-chain-node>
      </sl-thought-chain>
    </div>
    <div>
      <div style="margin-bottom: 8px; font-size: 13px; color: var(--sl-color-neutral-600);">dotted</div>
      <sl-thought-chain line="dotted">
        <sl-thought-chain-node title="步骤 1"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 2"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 3"></sl-thought-chain-node>
      </sl-thought-chain>
    </div>
    <div>
      <div style="margin-bottom: 8px; font-size: 13px; color: var(--sl-color-neutral-600);">无连接线</div>
      <sl-thought-chain line="none">
        <sl-thought-chain-node title="步骤 1"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 2"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 3"></sl-thought-chain-node>
      </sl-thought-chain>
    </div>
  </div>
</template>
```

```js
import { KingdeeElement } from '@anthropic/anthropic-sdk';

export default class LineStyleThoughtChain extends KingdeeElement {
  // line 样式通过 HTML 属性声明
}
```

---

## 尺寸

通过 `size` 属性调整思维链的尺寸，支持 `small`、`middle`（默认）、`large`。

```html
<template kwc:external>
  <div style="display: flex; gap: 40px;">
    <div>
      <div style="margin-bottom: 8px; font-size: 13px; color: var(--sl-color-neutral-600);">small</div>
      <sl-thought-chain size="small">
        <sl-thought-chain-node title="步骤 1" description="描述"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 2" description="描述"></sl-thought-chain-node>
      </sl-thought-chain>
    </div>
    <div>
      <div style="margin-bottom: 8px; font-size: 13px; color: var(--sl-color-neutral-600);">middle</div>
      <sl-thought-chain size="middle">
        <sl-thought-chain-node title="步骤 1" description="描述"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 2" description="描述"></sl-thought-chain-node>
      </sl-thought-chain>
    </div>
    <div>
      <div style="margin-bottom: 8px; font-size: 13px; color: var(--sl-color-neutral-600);">large</div>
      <sl-thought-chain size="large">
        <sl-thought-chain-node title="步骤 1" description="描述"></sl-thought-chain-node>
        <sl-thought-chain-node title="步骤 2" description="描述"></sl-thought-chain-node>
      </sl-thought-chain>
    </div>
  </div>
</template>
```

```js
import { KingdeeElement } from '@anthropic/anthropic-sdk';

export default class SizeThoughtChain extends KingdeeElement {
  // size 通过 HTML 属性声明
}
```

---

## ThoughtChainItem 独立标签

`<sl-thought-chain-item>` 可以独立使用，作为标签/徽章展示单个动作条目。

```html
<template kwc:external>
  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
    <sl-thought-chain-item title="默认"></sl-thought-chain-item>
    <sl-thought-chain-item title="成功" status="success"></sl-thought-chain-item>
    <sl-thought-chain-item title="加载中" status="loading"></sl-thought-chain-item>
    <sl-thought-chain-item title="错误" status="error"></sl-thought-chain-item>
    <sl-thought-chain-item title="已中止" status="abort"></sl-thought-chain-item>
  </div>
</template>
```

```js
import { KingdeeElement } from '@anthropic/anthropic-sdk';

export default class ItemStatusThoughtChain extends KingdeeElement {
  // 状态通过 HTML 属性声明
}
```

---

## ThoughtChainItem 变体

通过 `variant` 属性设置不同的视觉变体：`solid`（默认）、`outlined`、`text`。

```html
<template kwc:external>
  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
    <sl-thought-chain-item title="Solid" variant="solid"></sl-thought-chain-item>
    <sl-thought-chain-item title="Outlined" variant="outlined"></sl-thought-chain-item>
    <sl-thought-chain-item title="Text" variant="text"></sl-thought-chain-item>
  </div>
</template>
```

```js
import { KingdeeElement } from '@anthropic/anthropic-sdk';

export default class ItemVariantThoughtChain extends KingdeeElement {
  // variant 通过 HTML 属性声明
}
```

---

## 可点击的 ThoughtChainItem

设置 `clickable` 属性使 Item 可点击，监听 `sl-click` 事件。

```html
<template kwc:external>
  <div style="display: flex; gap: 8px;">
    <sl-thought-chain-item class="clickable-item" title="可点击" clickable></sl-thought-chain-item>
    <sl-thought-chain-item class="disabled-item" title="禁用" clickable disabled></sl-thought-chain-item>
  </div>
  <div class="click-log" style="margin-top: 8px; font-size: 13px; color: var(--sl-color-neutral-600);">
    点击上方标签试试
  </div>
</template>
```

```js
import { KingdeeElement } from '@anthropic/anthropic-sdk';

export default class ClickableItemThoughtChain extends KingdeeElement {
  get shoelaceEventBindings() {
    return [
      {
        selector: '.clickable-item',
        event: 'sl-click',
        handler: this.handleItemClick
      }
    ];
  }

  renderedCallback() {
    this._bindShoelaceEvents();
  }

  disconnectedCallback() {
    this._unbindShoelaceEvents();
  }

  handleItemClick() {
    const log = this.template.querySelector('.click-log');
    log.textContent = '点击了「可点击」';
  }
}
```

---

## 完整示例

模拟一个 AI Agent 的完整调用链路，综合使用自定义图标、可折叠内容、状态、底部信息等功能。

```html
<template kwc:external>
  <sl-thought-chain class="full-chain" default-expanded-keys='["search", "generate"]'>
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
      <div slot="footer" style="font-size: 12px; color: var(--sl-color-neutral-500);">总耗时 2.3s · Token 消耗 156</div>
    </sl-thought-chain-node>
  </sl-thought-chain>
</template>
```

```js
import { KingdeeElement } from '@anthropic/anthropic-sdk';

export default class FullThoughtChain extends KingdeeElement {
  // 完整示例通过 HTML 属性和插槽声明
}
```

---

## 动态添加节点

通过 JavaScript 动态创建和添加思维链节点。

```html
<template kwc:external>
  <button class="add-btn" style="margin-bottom: 12px;">添加节点</button>
  <sl-thought-chain class="dynamic-chain">
    <sl-thought-chain-node title="初始节点" status="success" description="已完成"></sl-thought-chain-node>
  </sl-thought-chain>
</template>
```

```js
import { KingdeeElement } from '@anthropic/anthropic-sdk';

export default class DynamicThoughtChain extends KingdeeElement {
  _stepCount = 1;

  renderedCallback() {
    const btn = this.template.querySelector('.add-btn');
    this._addHandler = () => this.addNode();
    btn.addEventListener('click', this._addHandler);
  }

  disconnectedCallback() {
    const btn = this.template.querySelector('.add-btn');
    if (btn && this._addHandler) {
      btn.removeEventListener('click', this._addHandler);
    }
  }

  addNode() {
    this._stepCount++;
    const chain = this.template.querySelector('.dynamic-chain');
    const node = document.createElement('sl-thought-chain-node');
    node.title = '动态节点 ' + this._stepCount;
    node.description = '通过 JS 动态添加';
    node.status = 'loading';
    chain.appendChild(node);

    // 模拟异步完成
    setTimeout(() => {
      node.status = 'success';
      node.description = '已完成';
    }, 2000);
  }
}
```

---

## 程序化控制展开/折叠

通过 JavaScript 程序化控制节点的展开和折叠状态。

```html
<template kwc:external>
  <div style="margin-bottom: 12px; display: flex; gap: 8px;">
    <button class="expand-all-btn">全部展开</button>
    <button class="collapse-all-btn">全部折叠</button>
  </div>
  <sl-thought-chain class="programmatic-chain">
    <sl-thought-chain-node node-key="s1" title="步骤一" collapsible>
      <div>步骤一的详细内容</div>
    </sl-thought-chain-node>
    <sl-thought-chain-node node-key="s2" title="步骤二" collapsible>
      <div>步骤二的详细内容</div>
    </sl-thought-chain-node>
    <sl-thought-chain-node node-key="s3" title="步骤三" collapsible>
      <div>步骤三的详细内容</div>
    </sl-thought-chain-node>
  </sl-thought-chain>
</template>
```

```js
import { KingdeeElement } from '@anthropic/anthropic-sdk';

export default class ProgrammaticThoughtChain extends KingdeeElement {
  renderedCallback() {
    const expandBtn = this.template.querySelector('.expand-all-btn');
    const collapseBtn = this.template.querySelector('.collapse-all-btn');

    this._expandHandler = () => this.expandAll();
    this._collapseHandler = () => this.collapseAll();

    expandBtn.addEventListener('click', this._expandHandler);
    collapseBtn.addEventListener('click', this._collapseHandler);
  }

  disconnectedCallback() {
    const expandBtn = this.template.querySelector('.expand-all-btn');
    const collapseBtn = this.template.querySelector('.collapse-all-btn');

    if (expandBtn && this._expandHandler) {
      expandBtn.removeEventListener('click', this._expandHandler);
    }
    if (collapseBtn && this._collapseHandler) {
      collapseBtn.removeEventListener('click', this._collapseHandler);
    }
  }

  expandAll() {
    const chain = this.template.querySelector('.programmatic-chain');
    chain.expandedKeys = ['s1', 's2', 's3'];
  }

  collapseAll() {
    const chain = this.template.querySelector('.programmatic-chain');
    chain.expandedKeys = [];
  }
}
```

---

## CSS 自定义样式

通过 CSS 自定义属性和 `::part()` 选择器自定义思维链样式。

```html
<template kwc:external>
  <style>
    .styled-chain {
      --sl-thought-chain-gap: var(--sl-spacing-medium);
      --sl-thought-chain-connector-color: var(--sl-color-primary-300);
      --sl-thought-chain-icon-size: var(--sl-font-size-large);
    }
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
  <sl-thought-chain class="styled-chain" default-expanded-keys='["s1"]'>
    <sl-thought-chain-node node-key="s1" title="自定义样式" description="通过 CSS 变量和 ::part 自定义" collapsible>
      <div>自定义背景和间距的内容区域。</div>
    </sl-thought-chain-node>
    <sl-thought-chain-node title="第二步" description="继承自定义样式"></sl-thought-chain-node>
  </sl-thought-chain>
</template>
```

```js
import { KingdeeElement } from '@anthropic/anthropic-sdk';

export default class StyledThoughtChain extends KingdeeElement {
  // 样式通过 CSS 声明
}
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

### `<sl-thought-chain>` 插槽

| 插槽     | 说明                                  |
| -------- | ------------------------------------- |
| _(默认)_ | 放置 `<sl-thought-chain-node>` 子元素 |

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
   - 非受控模式：使用 `default-expanded-keys` 设置初始展开状态，组件内部管理后续状态变化。
   - 受控模式：使用 `expanded-keys` 属性，需在 `sl-expand` 事件回调中手动更新该属性。
4. **状态图标**：`loading` 状态显示旋转加载器（`<sl-spinner>`），`success`/`error`/`abort` 显示对应的图标。无状态时显示序号。
5. **闪烁动画**：`blink` 属性在标题上产生脉冲动画效果，适合标记当前活跃步骤。
6. **ThoughtChainItem 点击**：设置 `clickable` 后，Item 会显示悬停样式和指针光标。`disabled` 状态下点击事件不会触发。

---

## 最佳实践

1. **始终为可折叠节点设置 `node-key`**：`node-key` 是折叠功能的必要标识，确保每个可折叠节点有唯一的 key。
2. **合理使用状态**：用 `loading` 表示进行中，`success` 表示完成，`error` 表示失败，`abort` 表示中止。
3. **使用 `blink` 标记活跃步骤**：配合 `loading` 状态使用 `blink` 可以更明显地指示当前正在执行的步骤。
4. **连接线样式选择**：默认实线适合大多数场景；虚线（`dashed`）适合表示可选或条件步骤；点线（`dotted`）适合表示弱关联。
5. **事件清理**：在 `disconnectedCallback` 中清理事件监听器，避免内存泄漏。
6. **使用 class 选择器**：在 KWC/LWC 中使用 class 选择器（而非 id）查询 DOM 元素。
7. **避免自闭合标签**：Web Components 不支持自闭合标签，始终使用 `<sl-thought-chain-node></sl-thought-chain-node>` 而非 `<sl-thought-chain-node />`。

---

## 常见问题

### Q: 折叠动画不生效？

确保节点设置了 `collapsible` 属性和 `node-key` 属性，且节点有默认插槽内容（即有子元素）。

### Q: `default-expanded-keys` 在 HTML 中如何设置？

使用 JSON 数组字符串格式：`default-expanded-keys='["key1", "key2"]'`。

### Q: 如何在受控模式下更新展开状态？

监听 `sl-expand` 事件，在回调中通过 `event.detail.expandedKeys` 获取新的展开 key 列表，然后设置到组件的 `expandedKeys` 属性上：

```js
handleExpand(event) {
  const chain = this.template.querySelector('.my-chain');
  chain.expandedKeys = event.detail.expandedKeys;
}
```

### Q: 如何动态添加节点？

使用 `document.createElement('sl-thought-chain-node')` 创建节点，设置属性后 `appendChild` 到 `<sl-thought-chain>` 中。组件会自动检测子元素变化并更新布局。

### Q: ThoughtChainItem 和 ThoughtChainNode 的区别？

- `<sl-thought-chain-node>` 是链路中的节点，必须放在 `<sl-thought-chain>` 内部使用，有连接线、序号图标等链路特性。
- `<sl-thought-chain-item>` 是独立的标签/徽章组件，可以在任何地方独立使用，适合展示单个动作条目。
