# TreeSelect 树选择

允许用户从树形结构的数据中选择一个或多个节点，支持搜索、勾选、懒加载等功能。

## 特性概览

- **单选/多选**：支持单选和多选模式（`multiple`），多选可显示标签
- **搜索过滤**：支持输入关键词搜索树节点（`showSearch`）
- **勾选模式**：支持父子联动勾选（`treeCheckable`）
- **懒加载**：支持异步加载子节点（`lazy` + `sl-lazy-load`）
- **展示策略**：多选模式下支持 `all` / `parent` / `child` 三种标签展示策略
- **表单集成**：支持 `name`、`required`、`form` 属性参与表单提交和验证
- **丰富插槽**：支持前缀/后缀图标、自定义标签、自定义树节点图标等
- **自定义样式**：支持 `filled`、`pill`、`size` 等外观属性

## TreeSelectNodeData 数据结构

`treeData` 中每个节点的数据结构如下：

| 属性         | 说明                                                                           | 类型                                      | 默认值  |
| ------------ | ------------------------------------------------------------------------------ | ----------------------------------------- | ------- |
| `title`      | 节点标题，支持字符串、HTMLElement 或 Lit TemplateResult                        | `string \| HTMLElement \| TemplateResult` | -       |
| `value`      | 节点值，唯一标识                                                               | `string`                                  | -       |
| `key`        | 节点 key                                                                       | `string`                                  | -       |
| `children`   | 子节点数组                                                                     | `TreeSelectNodeData[]`                    | -       |
| `disabled`   | 是否禁用                                                                       | `boolean`                                 | `false` |
| `selectable` | 是否可选                                                                       | `boolean`                                 | -       |
| `checkable`  | 是否可勾选                                                                     | `boolean`                                 | -       |
| `isLeaf`     | 是否为叶子节点                                                                 | `boolean`                                 | -       |
| `icon`       | 节点图标，支持 `sl-icon` 图标名称（字符串）、HTMLElement 或 Lit TemplateResult | `string \| HTMLElement \| TemplateResult` | -       |
| `lazy`       | 是否启用懒加载，展开时触发 `sl-lazy-load` 事件                                 | `boolean`                                 | -       |

## 基础用法

最简单的用法，从树形数据中选择一个节点。

```html
<template>
  <sl-tree-select kwc:external class="tree-select-el" placeholder="请选择" style="width: 300px;"></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectBasic extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-0' },
            { title: 'Child Node2', value: '0-0-1' },
            { title: 'Child Node3', value: '0-0-2' }
          ]
        },
        {
          title: 'Node2',
          value: '0-1',
          children: [
            { title: 'Child Node4', value: '0-1-0' },
            { title: 'Child Node5', value: '0-1-1' }
          ]
        }
      ];
    }
  }
}
```

## 多选模式

设置 `multiple` 属性启用多选模式，选中的节点以标签形式展示。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="请选择"
    multiple
    clearable
    style="width: 400px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectMultiple extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-0' },
            { title: 'Child Node2', value: '0-0-1' },
            { title: 'Child Node3', value: '0-0-2' }
          ]
        },
        {
          title: 'Node2',
          value: '0-1',
          children: [
            { title: 'Child Node4', value: '0-1-0' },
            { title: 'Child Node5', value: '0-1-1' }
          ]
        }
      ];
    }
  }
}
```

## 可勾选（Checkable）

通过 `tree-checkable` 属性启用勾选模式，父子节点联动选中。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="请选择"
    multiple
    tree-checkable
    clearable
    style="width: 400px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectCheckable extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-0' },
            { title: 'Child Node2', value: '0-0-1' },
            { title: 'Child Node3', value: '0-0-2' }
          ]
        },
        {
          title: 'Node2',
          value: '0-1',
          children: [
            { title: 'Child Node4', value: '0-1-0' },
            { title: 'Child Node5', value: '0-1-1' }
          ]
        }
      ];
    }
  }
}
```

## 带搜索

设置 `show-search` 属性启用搜索功能，可以在输入框中输入关键词筛选树节点。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="请搜索并选择"
    show-search
    style="width: 300px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectSearch extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-0' },
            { title: 'Child Node2', value: '0-0-1' }
          ]
        },
        {
          title: 'Node2',
          value: '0-1',
          children: [
            { title: 'Child Node3', value: '0-1-0' },
            { title: 'Child Node4', value: '0-1-1' }
          ]
        },
        { title: 'Leaf Node', value: '0-2' }
      ];
    }
  }
}
```

## 自定义搜索过滤（filterTreeNode）

通过 `showSearch` 对象配置自定义过滤函数，实现按标题搜索等需求。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="输入 title 搜索"
    style="width: 300px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectCustomFilter extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: '技术部',
          value: 'tech',
          children: [
            { title: '前端组', value: 'frontend' },
            { title: '后端组', value: 'backend' },
            { title: '测试组', value: 'qa' }
          ]
        },
        {
          title: '产品部',
          value: 'product',
          children: [
            { title: '产品设计', value: 'design' },
            { title: '产品运营', value: 'operation' }
          ]
        }
      ];
      el.showSearch = {
        filterTreeNode: (inputValue, treeNode) => {
          const title = typeof treeNode.title === 'string' ? treeNode.title : '';
          return title.toLowerCase().includes(inputValue.toLowerCase());
        }
      };
    }
  }
}
```

## 搜索过滤字段（treeNodeFilterProp）

通过 `showSearch.treeNodeFilterProp` 指定默认过滤匹配的字段，默认为 `value`，设为 `title` 可按标题搜索。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="输入 title 搜索"
    style="width: 300px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectFilterProp extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: '技术部',
          value: 'tech',
          children: [
            { title: '前端组', value: 'frontend' },
            { title: '后端组', value: 'backend' }
          ]
        },
        {
          title: '产品部',
          value: 'product',
          children: [
            { title: '产品设计', value: 'design' },
            { title: '产品运营', value: 'operation' }
          ]
        }
      ];
      el.showSearch = { treeNodeFilterProp: 'title' };
    }
  }
}
```

## 受控搜索值（searchValue）

通过 `showSearch.searchValue` 设置受控搜索值，配合 `sl-search` 事件实现防抖搜索等场景。

```html
<template>
  <div class="demo">
    <sl-tree-select
      kwc:external
      class="tree-select-el"
      placeholder="输入搜索（带防抖）"
      style="width: 300px;"
    ></sl-tree-select>
    <p class="output" style="font-size: 12px; color: #999; margin-top: 8px;"></p>
  </div>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectControlledSearch extends KingdeeElement {
  _debounceTimer = null;

  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-0' },
            { title: 'Child Node2', value: '0-0-1' }
          ]
        },
        {
          title: 'Node2',
          value: '0-1',
          children: [
            { title: 'Child Node3', value: '0-1-0' },
            { title: 'Child Node4', value: '0-1-1' }
          ]
        }
      ];
      el.showSearch = { treeNodeFilterProp: 'title' };
      el.addEventListener('sl-search', this.handleSearch.bind(this));
    }
  }

  handleSearch(event) {
    const output = this.template.querySelector('.output');
    if (output) output.textContent = '输入中: ' + event.detail.value;
    clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => {
      const el = this.template.querySelector('.tree-select-el');
      if (el) {
        el.showSearch = { ...el.showSearch, searchValue: event.detail.value };
      }
      if (output) output.textContent = '已搜索: ' + event.detail.value;
    }, 300);
  }

  disconnectedCallback() {
    clearTimeout(this._debounceTimer);
  }
}
```

## 选中后自动清空搜索（autoClearSearchValue）

多选模式下，`showSearch.autoClearSearchValue` 默认为 `true`，选中节点后自动清空搜索框。设为 `false` 可保留搜索内容继续选择。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="选中后保留搜索"
    multiple
    clearable
    style="width: 300px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectAutoClear extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-0' },
            { title: 'Child Node2', value: '0-0-1' },
            { title: 'Child Node3', value: '0-0-2' }
          ]
        },
        {
          title: 'Node2',
          value: '0-1',
          children: [
            { title: 'Child Node4', value: '0-1-0' },
            { title: 'Child Node5', value: '0-1-1' }
          ]
        }
      ];
      el.showSearch = { treeNodeFilterProp: 'title', autoClearSearchValue: false };
    }
  }
}
```

## 默认展开所有节点

设置 `tree-default-expand-all` 属性，默认展开所有树节点。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="请选择"
    tree-default-expand-all
    style="width: 300px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectExpandAll extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-0',
              children: [
                { title: 'Grandchild 1', value: '0-0-0-0' },
                { title: 'Grandchild 2', value: '0-0-0-1' }
              ]
            },
            { title: 'Child Node2', value: '0-0-1' }
          ]
        },
        {
          title: 'Node2',
          value: '0-1',
          children: [{ title: 'Child Node3', value: '0-1-0' }]
        }
      ];
    }
  }
}
```

## 可清除

设置 `clearable` 属性，当有选中值时显示清除按钮。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="请选择"
    clearable
    style="width: 300px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectClearable extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-0' },
            { title: 'Child Node2', value: '0-0-1' }
          ]
        },
        { title: 'Node2', value: '0-1' }
      ];
    }
  }
}
```

## 禁用状态

设置 `disabled` 属性禁用整个组件。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="已禁用"
    disabled
    style="width: 300px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectDisabled extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        { title: 'Node1', value: '0-0' },
        { title: 'Node2', value: '0-1' }
      ];
      el.value = '0-0';
    }
  }
}
```

## 禁用节点

通过节点数据中的 `disabled` 属性禁用特定的树节点。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="请选择"
    tree-default-expand-all
    style="width: 300px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectDisabledNode extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-0' },
            { title: 'Child Node2 (disabled)', value: '0-0-1', disabled: true },
            { title: 'Child Node3', value: '0-0-2' }
          ]
        },
        {
          title: 'Node2 (disabled)',
          value: '0-1',
          disabled: true,
          children: [{ title: 'Child Node4', value: '0-1-0' }]
        }
      ];
    }
  }
}
```

## 尺寸

使用 `size` 属性设置组件尺寸，支持 `small`、`medium`（默认）和 `large`。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-small"
    placeholder="Small"
    size="small"
    style="width: 300px; margin-bottom: 8px;"
  ></sl-tree-select>
  <br />
  <sl-tree-select
    kwc:external
    class="tree-select-medium"
    placeholder="Medium"
    size="medium"
    style="width: 300px; margin-bottom: 8px;"
  ></sl-tree-select>
  <br />
  <sl-tree-select
    kwc:external
    class="tree-select-large"
    placeholder="Large"
    size="large"
    style="width: 300px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectSize extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const data = [
      {
        title: 'Node1',
        value: '0-0',
        children: [
          { title: 'Child Node1', value: '0-0-0' },
          { title: 'Child Node2', value: '0-0-1' }
        ]
      },
      { title: 'Node2', value: '0-1' }
    ];
    this.template.querySelector('.tree-select-small').treeData = data;
    this.template.querySelector('.tree-select-medium').treeData = data;
    this.template.querySelector('.tree-select-large').treeData = data;
  }
}
```

## Label 和 Help Text

使用 `label` 和 `help-text` 属性为组件添加标签和帮助文本。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    label="部门"
    help-text="请选择您所在的部门"
    placeholder="请选择部门"
    style="width: 300px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectLabel extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: '技术部',
          value: 'tech',
          children: [
            { title: '前端组', value: 'frontend' },
            { title: '后端组', value: 'backend' },
            { title: '测试组', value: 'qa' }
          ]
        },
        {
          title: '产品部',
          value: 'product',
          children: [
            { title: '产品设计', value: 'design' },
            { title: '产品运营', value: 'operation' }
          ]
        },
        { title: '行政部', value: 'admin' }
      ];
    }
  }
}
```

## 设置默认值

通过 `value` 属性设置默认选中值。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="请选择"
    value="0-0-1"
    tree-default-expand-all
    style="width: 300px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectDefaultValue extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-0' },
            { title: 'Child Node2', value: '0-0-1' },
            { title: 'Child Node3', value: '0-0-2' }
          ]
        },
        { title: 'Node2', value: '0-1' }
      ];
    }
  }
}
```

## showCheckedStrategy

`show-checked-strategy` 属性控制多选模式下标签的展示策略：

- `all`（默认）：显示所有选中的节点
- `parent`：当父节点下所有子节点都选中时，只显示父节点
- `child`：只显示叶子节点

```html
<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap;">
    <div>
      <p style="margin: 0 0 4px; font-size: 12px; color: #999;">strategy="all"</p>
      <sl-tree-select
        kwc:external
        class="tree-select-all"
        placeholder="all"
        multiple
        tree-checkable
        clearable
        show-checked-strategy="all"
        tree-default-expand-all
        style="width: 280px;"
      ></sl-tree-select>
    </div>
    <div>
      <p style="margin: 0 0 4px; font-size: 12px; color: #999;">strategy="parent"</p>
      <sl-tree-select
        kwc:external
        class="tree-select-parent"
        placeholder="parent"
        multiple
        tree-checkable
        clearable
        show-checked-strategy="parent"
        tree-default-expand-all
        style="width: 280px;"
      ></sl-tree-select>
    </div>
    <div>
      <p style="margin: 0 0 4px; font-size: 12px; color: #999;">strategy="child"</p>
      <sl-tree-select
        kwc:external
        class="tree-select-child"
        placeholder="child"
        multiple
        tree-checkable
        clearable
        show-checked-strategy="child"
        tree-default-expand-all
        style="width: 280px;"
      ></sl-tree-select>
    </div>
  </div>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectStrategy extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const data = [
      {
        title: 'Node1',
        value: '0-0',
        children: [
          { title: 'Child Node1', value: '0-0-0' },
          { title: 'Child Node2', value: '0-0-1' }
        ]
      },
      {
        title: 'Node2',
        value: '0-1',
        children: [
          { title: 'Child Node3', value: '0-1-0' },
          { title: 'Child Node4', value: '0-1-1' }
        ]
      }
    ];
    this.template.querySelector('.tree-select-all').treeData = data;
    this.template.querySelector('.tree-select-parent').treeData = data;
    this.template.querySelector('.tree-select-child').treeData = data;
  }
}
```

## 最大显示标签数

多选模式下，通过 `max-options-visible` 属性控制最多显示的标签数量，超出部分以 `+n` 形式展示。设为 `0` 则不限制。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="请选择"
    multiple
    clearable
    max-options-visible="2"
    tree-default-expand-all
    style="width: 400px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectMaxVisible extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-0' },
            { title: 'Child Node2', value: '0-0-1' },
            { title: 'Child Node3', value: '0-0-2' }
          ]
        },
        {
          title: 'Node2',
          value: '0-1',
          children: [
            { title: 'Child Node4', value: '0-1-0' },
            { title: 'Child Node5', value: '0-1-1' }
          ]
        }
      ];
    }
  }
}
```

## 连接线（Tree Line）

设置 `tree-line` 属性，在父节点之间显示连接线。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="请选择"
    tree-line
    tree-default-expand-all
    clearable
    style="width: 300px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectTreeLine extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-0',
              children: [
                { title: 'Grandchild 1', value: '0-0-0-0' },
                { title: 'Grandchild 2', value: '0-0-0-1' }
              ]
            },
            { title: 'Child Node2', value: '0-0-1' },
            { title: 'Child Node3', value: '0-0-2' }
          ]
        },
        {
          title: 'Node2',
          value: '0-1',
          children: [
            { title: 'Child Node4', value: '0-1-0' },
            { title: 'Child Node5', value: '0-1-1' }
          ]
        }
      ];
    }
  }
}
```

## 节点图标

通过 `treeData` 中的 `icon` 字段为节点添加图标。支持 `sl-icon` 的图标名称（字符串）。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="请选择"
    tree-default-expand-all
    clearable
    style="width: 350px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectNodeIcon extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: '技术部',
          value: 'tech',
          icon: 'gear',
          children: [
            { title: '前端组', value: 'frontend', icon: 'code-slash' },
            { title: '后端组', value: 'backend', icon: 'hdd-stack' },
            { title: '测试组', value: 'qa', icon: 'bug' }
          ]
        },
        {
          title: '产品部',
          value: 'product',
          icon: 'lightbulb',
          children: [
            { title: '产品设计', value: 'design', icon: 'palette' },
            { title: '产品运营', value: 'operation', icon: 'graph-up' }
          ]
        },
        { title: '行政部', value: 'admin', icon: 'building' }
      ];
    }
  }
}
```

## Filled 样式

使用 `filled` 属性绘制填充样式的选择器。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="Filled style"
    filled
    style="width: 300px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectFilled extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-0' },
            { title: 'Child Node2', value: '0-0-1' }
          ]
        },
        { title: 'Node2', value: '0-1' }
      ];
    }
  }
}
```

## Pill 样式

使用 `pill` 属性绘制圆角药丸样式。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="Pill style"
    pill
    style="width: 300px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectPill extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-0' },
            { title: 'Child Node2', value: '0-0-1' }
          ]
        },
        { title: 'Node2', value: '0-1' }
      ];
    }
  }
}
```

## Hoist

设置 `hoist` 属性使下拉面板使用 `fixed` 定位策略，可以突破 `overflow: hidden` 的容器限制。

```html
<template>
  <div style="overflow: hidden; border: 1px dashed var(--sl-color-neutral-300); padding: 16px; height: 120px;">
    <p style="margin: 0 0 8px; font-size: 12px; color: #999;">overflow: hidden 容器</p>
    <sl-tree-select
      kwc:external
      class="tree-select-el"
      placeholder="请选择"
      hoist
      style="width: 260px;"
    ></sl-tree-select>
  </div>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectHoist extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-0' },
            { title: 'Child Node2', value: '0-0-1' }
          ]
        },
        { title: 'Node2', value: '0-1' }
      ];
    }
  }
}
```

## 弹出位置

通过 `placement` 属性手动指定弹出的位置。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="请选择"
    placement="top-start"
    style="width: 300px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectPlacement extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-0' },
            { title: 'Child Node2', value: '0-0-1' }
          ]
        },
        { title: 'Node2', value: '0-1' }
      ];
    }
  }
}
```

## 前缀和后缀图标（Prefix & Suffix）

通过 `prefix` 和 `suffix` 插槽在输入框前后添加图标。

```html
<template>
  <sl-tree-select kwc:external class="tree-select-el" placeholder="带前缀图标" clearable style="width: 300px;">
    <sl-icon name="search" slot="prefix"></sl-icon>
  </sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';

export default class TreeSelectPrefix extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: '技术部',
          value: 'tech',
          children: [
            { title: '前端组', value: 'frontend' },
            { title: '后端组', value: 'backend' }
          ]
        },
        { title: '产品部', value: 'product' },
        { title: '行政部', value: 'admin' }
      ];
    }
  }
}
```

## 自定义树节点展开/收起图标

通过 `tree-expand-icon` 和 `tree-collapse-icon` 插槽自定义树节点的展开和收起图标。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="请选择"
    tree-default-expand-all
    clearable
    style="width: 300px;"
  >
    <sl-icon name="plus-square" slot="tree-expand-icon"></sl-icon>
    <sl-icon name="dash-square" slot="tree-collapse-icon"></sl-icon>
  </sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';

export default class TreeSelectCustomTreeIcon extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-0',
              children: [
                { title: 'Grandchild 1', value: '0-0-0-0' },
                { title: 'Grandchild 2', value: '0-0-0-1' }
              ]
            },
            { title: 'Child Node2', value: '0-0-1' }
          ]
        },
        {
          title: 'Node2',
          value: '0-1',
          children: [
            { title: 'Child Node3', value: '0-1-0' },
            { title: 'Child Node4', value: '0-1-1' }
          ]
        }
      ];
    }
  }
}
```

## 自定义下拉箭头图标（Expand Icon）

通过 `expand-icon` 插槽替换默认的下拉箭头图标。

```html
<template>
  <sl-tree-select kwc:external class="tree-select-el" placeholder="自定义箭头" style="width: 300px;">
    <sl-icon name="caret-down-fill" slot="expand-icon"></sl-icon>
  </sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';

export default class TreeSelectExpandIcon extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-0' },
            { title: 'Child Node2', value: '0-0-1' }
          ]
        },
        { title: 'Node2', value: '0-1' }
      ];
    }
  }
}
```

## 自定义标签渲染（getTag）

通过 `getTag` 属性自定义多选模式下标签的渲染方式。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="请选择"
    multiple
    clearable
    tree-default-expand-all
    style="width: 400px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectCustomTag extends KingdeeElement {
  renderedCallback() {
    if (this._init) return;
    this._init = true;
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Fruits',
          value: 'fruits',
          children: [
            { title: '🍎 Apple', value: 'apple' },
            { title: '🍊 Orange', value: 'orange' },
            { title: '🍇 Grape', value: 'grape' }
          ]
        },
        {
          title: 'Vegetables',
          value: 'vegetables',
          children: [
            { title: '🥕 Carrot', value: 'carrot' },
            { title: '🥦 Broccoli', value: 'broccoli' }
          ]
        }
      ];
      const colors = ['#e6f7ff', '#fff7e6', '#f6ffed', '#fff1f0', '#f9f0ff'];
      el.getTag = (node, index) => {
        const tag = document.createElement('sl-tag');
        tag.size = el.size;
        tag.removable = true;
        tag.setAttribute('part', 'tag');
        tag.style.setProperty('--sl-color-neutral-0', colors[index % colors.length]);
        tag.textContent = typeof node.title === 'string' ? node.title : node.value;
        return tag;
      };
    }
  }
}
```

## 异步加载（Lazy Load）

在 `treeData` 中设置 `lazy: true` 标记需要懒加载的节点。展开时触发 `sl-lazy-load` 事件，在回调中调用 `loadChildren(parentValue, children)` 方法完成加载。

```html
<template>
  <sl-tree-select
    kwc:external
    class="tree-select-el"
    placeholder="请选择"
    clearable
    style="width: 300px;"
  ></sl-tree-select>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectLazy extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindShoelaceEvents();
    this.initData();
  }

  get shoelaceEventBindings() {
    return [['.tree-select-el', 'sl-lazy-load', this.handleLazyLoad]];
  }

  bindShoelaceEvents() {
    this._boundHandlers = this.shoelaceEventBindings
      .map(([selector, event, handler]) => {
        const el = this.template.querySelector(selector);
        if (el) {
          const boundHandler = handler.bind(this);
          el.addEventListener(event, boundHandler);
          return { el, event, boundHandler };
        }
        return null;
      })
      .filter(Boolean);
  }

  initData() {
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        { title: 'Expand to load', value: 'parent-0', lazy: true },
        { title: 'Expand to load', value: 'parent-1', lazy: true },
        { title: 'Leaf Node', value: 'leaf-0' }
      ];
    }
  }

  async handleLazyLoad(event) {
    const nodeValue = event.detail.value;
    // 模拟异步请求
    const children = await new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { title: nodeValue + ' - Child 1', value: nodeValue + '-0' },
          { title: nodeValue + ' - Child 2', value: nodeValue + '-1' },
          { title: nodeValue + ' - Child 3 (lazy)', value: nodeValue + '-2', lazy: true }
        ]);
      }, 1000);
    });
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.loadChildren(nodeValue, children);
    }
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
}
```

## 表单集成

`sl-tree-select` 支持表单集成，可通过 `name`、`required`、`form` 属性参与表单提交和验证。

```html
<template>
  <form class="demo-form" style="width: 300px;">
    <sl-tree-select
      kwc:external
      class="tree-select-el"
      name="department"
      label="部门"
      placeholder="请选择部门"
      required
      help-text="必填项"
      clearable
    ></sl-tree-select>
    <br />
    <sl-button kwc:external class="submit-btn" type="submit" variant="primary" style="margin-top: 8px;">提交</sl-button>
    <p class="output" style="font-size: 12px; color: #999; margin-top: 8px;"></p>
  </form>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class TreeSelectForm extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.initData();
    this.bindShoelaceEvents();
  }

  get shoelaceEventBindings() {
    return [['.demo-form', 'submit', this.handleSubmit]];
  }

  bindShoelaceEvents() {
    this._boundHandlers = this.shoelaceEventBindings
      .map(([selector, event, handler]) => {
        const el = this.template.querySelector(selector);
        if (el) {
          const boundHandler = handler.bind(this);
          el.addEventListener(event, boundHandler);
          return { el, event, boundHandler };
        }
        return null;
      })
      .filter(Boolean);
  }

  initData() {
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: '技术部',
          value: 'tech',
          children: [
            { title: '前端组', value: 'frontend' },
            { title: '后端组', value: 'backend' }
          ]
        },
        { title: '产品部', value: 'product' },
        { title: '行政部', value: 'admin' }
      ];
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = this.template.querySelector('.demo-form');
    const output = this.template.querySelector('.output');
    const data = new FormData(form);
    if (output) {
      output.textContent = '提交值: ' + (data.get('department') || '(空)');
    }
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
}
```

## 监听事件

通过监听 `sl-change`、`sl-input`、`sl-focus`、`sl-blur` 等事件获取组件状态变化。

```html
<template>
  <div class="demo">
    <div
      class="event-info"
      style="padding: 8px; background: var(--sl-color-neutral-100); border-radius: 4px; margin-bottom: 8px;"
    >
      <p class="event-output" style="margin: 4px 0; font-size: 12px;">等待事件...</p>
    </div>
    <sl-tree-select
      kwc:external
      class="tree-select-el"
      placeholder="请选择"
      clearable
      style="width: 300px;"
    ></sl-tree-select>
  </div>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

export default class TreeSelectEvents extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.initData();
    this.bindShoelaceEvents();
  }

  get shoelaceEventBindings() {
    return [
      ['.tree-select-el', 'sl-change', this.handleChange],
      ['.tree-select-el', 'sl-focus', this.handleFocus],
      ['.tree-select-el', 'sl-blur', this.handleBlur],
      ['.tree-select-el', 'sl-clear', this.handleClear],
      ['.tree-select-el', 'sl-show', this.handleShow],
      ['.tree-select-el', 'sl-hide', this.handleHide]
    ];
  }

  bindShoelaceEvents() {
    this._boundHandlers = this.shoelaceEventBindings
      .map(([selector, event, handler]) => {
        const el = this.template.querySelector(selector);
        if (el) {
          const boundHandler = handler.bind(this);
          el.addEventListener(event, boundHandler);
          return { el, event, boundHandler };
        }
        return null;
      })
      .filter(Boolean);
  }

  initData() {
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-0' },
            { title: 'Child Node2', value: '0-0-1' }
          ]
        },
        { title: 'Node2', value: '0-1' }
      ];
    }
  }

  log(msg) {
    const output = this.template.querySelector('.event-output');
    if (output) output.textContent = msg;
  }

  handleChange() {
    const el = this.template.querySelector('.tree-select-el');
    this.log('sl-change: value=' + (el ? el.value : ''));
  }
  handleFocus() {
    this.log('sl-focus');
  }
  handleBlur() {
    this.log('sl-blur');
  }
  handleClear() {
    this.log('sl-clear');
  }
  handleShow() {
    this.log('sl-show');
  }
  handleHide() {
    this.log('sl-hide');
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
}
```

## 动态更新数据

通过 JavaScript 动态更新 `treeData` 和 `value` 属性。

```html
<template>
  <div class="demo">
    <div class="controls" style="display: flex; gap: 8px; margin-bottom: 8px;">
      <sl-button kwc:external class="btn-set-value" size="small">选中 frontend</sl-button>
      <sl-button kwc:external class="btn-update-data" size="small">更新数据</sl-button>
      <sl-button kwc:external class="btn-reset" size="small">重置</sl-button>
    </div>
    <sl-tree-select
      kwc:external
      class="tree-select-el"
      placeholder="请选择"
      clearable
      style="width: 300px;"
    ></sl-tree-select>
  </div>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class TreeSelectDynamic extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.initData();
    this.bindShoelaceEvents();
  }

  get shoelaceEventBindings() {
    return [
      ['.btn-set-value', 'click', this.handleSetValue],
      ['.btn-update-data', 'click', this.handleUpdateData],
      ['.btn-reset', 'click', this.handleReset]
    ];
  }

  bindShoelaceEvents() {
    this._boundHandlers = this.shoelaceEventBindings
      .map(([selector, event, handler]) => {
        const el = this.template.querySelector(selector);
        if (el) {
          const boundHandler = handler.bind(this);
          el.addEventListener(event, boundHandler);
          return { el, event, boundHandler };
        }
        return null;
      })
      .filter(Boolean);
  }

  get defaultData() {
    return [
      {
        title: '技术部',
        value: 'tech',
        children: [
          { title: '前端组', value: 'frontend' },
          { title: '后端组', value: 'backend' }
        ]
      },
      { title: '产品部', value: 'product' }
    ];
  }

  initData() {
    const el = this.template.querySelector('.tree-select-el');
    if (el) el.treeData = this.defaultData;
  }

  handleSetValue() {
    const el = this.template.querySelector('.tree-select-el');
    if (el) el.value = 'frontend';
  }

  handleUpdateData() {
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: '新部门A',
          value: 'new-a',
          children: [
            { title: '子部门1', value: 'new-a-1' },
            { title: '子部门2', value: 'new-a-2' }
          ]
        },
        { title: '新部门B', value: 'new-b' }
      ];
    }
  }

  handleReset() {
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = this.defaultData;
      el.value = '';
    }
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
}
```

## 编程式控制（show / hide / focus / blur）

通过 `show()`、`hide()`、`focus()`、`blur()` 方法编程式控制下拉面板和焦点。

```html
<template>
  <div class="demo">
    <div class="controls" style="display: flex; gap: 8px; margin-bottom: 8px;">
      <sl-button kwc:external class="btn-show" size="small">show()</sl-button>
      <sl-button kwc:external class="btn-hide" size="small">hide()</sl-button>
      <sl-button kwc:external class="btn-focus" size="small">focus()</sl-button>
      <sl-button kwc:external class="btn-blur" size="small">blur()</sl-button>
    </div>
    <sl-tree-select kwc:external class="tree-select-el" placeholder="请选择" style="width: 300px;"></sl-tree-select>
  </div>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class TreeSelectMethods extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.initData();
    this.bindShoelaceEvents();
  }

  get shoelaceEventBindings() {
    return [
      ['.btn-show', 'click', this.handleShow],
      ['.btn-hide', 'click', this.handleHide],
      ['.btn-focus', 'click', this.handleFocus],
      ['.btn-blur', 'click', this.handleBlur]
    ];
  }

  bindShoelaceEvents() {
    this._boundHandlers = this.shoelaceEventBindings
      .map(([selector, event, handler]) => {
        const el = this.template.querySelector(selector);
        if (el) {
          const boundHandler = handler.bind(this);
          el.addEventListener(event, boundHandler);
          return { el, event, boundHandler };
        }
        return null;
      })
      .filter(Boolean);
  }

  initData() {
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-0' },
            { title: 'Child Node2', value: '0-0-1' }
          ]
        },
        { title: 'Node2', value: '0-1' }
      ];
    }
  }

  handleShow() {
    const el = this.template.querySelector('.tree-select-el');
    if (el) el.show();
  }
  handleHide() {
    const el = this.template.querySelector('.tree-select-el');
    if (el) el.hide();
  }
  handleFocus() {
    const el = this.template.querySelector('.tree-select-el');
    if (el) el.focus();
  }
  handleBlur() {
    const el = this.template.querySelector('.tree-select-el');
    if (el) el.blur();
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
}
```

## 表单验证（checkValidity / reportValidity / setCustomValidity）

通过 `checkValidity()`、`reportValidity()`、`setCustomValidity()` 方法进行表单验证。

```html
<template>
  <div class="demo">
    <sl-tree-select
      kwc:external
      class="tree-select-el"
      name="dept"
      label="部门"
      placeholder="请选择"
      required
      clearable
      style="width: 300px;"
    ></sl-tree-select>
    <div class="controls" style="display: flex; gap: 8px; margin-top: 8px;">
      <sl-button kwc:external class="btn-check" size="small">checkValidity()</sl-button>
      <sl-button kwc:external class="btn-report" size="small">reportValidity()</sl-button>
      <sl-button kwc:external class="btn-custom" size="small">setCustomValidity()</sl-button>
      <sl-button kwc:external class="btn-clear-validity" size="small">清除自定义验证</sl-button>
    </div>
    <p class="output" style="font-size: 12px; color: #999; margin-top: 8px;"></p>
  </div>
</template>
```

```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class TreeSelectValidation extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.initData();
    this.bindShoelaceEvents();
  }

  get shoelaceEventBindings() {
    return [
      ['.btn-check', 'click', this.handleCheck],
      ['.btn-report', 'click', this.handleReport],
      ['.btn-custom', 'click', this.handleCustom],
      ['.btn-clear-validity', 'click', this.handleClearValidity]
    ];
  }

  bindShoelaceEvents() {
    this._boundHandlers = this.shoelaceEventBindings
      .map(([selector, event, handler]) => {
        const el = this.template.querySelector(selector);
        if (el) {
          const boundHandler = handler.bind(this);
          el.addEventListener(event, boundHandler);
          return { el, event, boundHandler };
        }
        return null;
      })
      .filter(Boolean);
  }

  initData() {
    const el = this.template.querySelector('.tree-select-el');
    if (el) {
      el.treeData = [
        {
          title: '技术部',
          value: 'tech',
          children: [
            { title: '前端组', value: 'frontend' },
            { title: '后端组', value: 'backend' }
          ]
        },
        { title: '产品部', value: 'product' }
      ];
    }
  }

  handleCheck() {
    const el = this.template.querySelector('.tree-select-el');
    const output = this.template.querySelector('.output');
    if (el && output) {
      output.textContent = 'checkValidity: ' + el.checkValidity();
    }
  }

  handleReport() {
    const el = this.template.querySelector('.tree-select-el');
    if (el) el.reportValidity();
  }

  handleCustom() {
    const el = this.template.querySelector('.tree-select-el');
    if (el) el.setCustomValidity('请选择一个有效的部门');
  }

  handleClearValidity() {
    const el = this.template.querySelector('.tree-select-el');
    if (el) el.setCustomValidity('');
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
}
```

## Properties

| 属性                    | 描述                                               | 类型                              | 默认值      |
| ----------------------- | -------------------------------------------------- | --------------------------------- | ----------- |
| name                    | 表单提交时的字段名                                 | `string`                          | `''`        |
| value                   | 当前选中值。多选时为 `string[]`，单选时为 `string` | `string \| string[]`              | `''`        |
| size                    | 组件尺寸                                           | `'small' \| 'medium' \| 'large'`  | `'medium'`  |
| placeholder             | 占位文本                                           | `string`                          | `''`        |
| multiple                | 是否多选                                           | `boolean`                         | `false`     |
| max-options-visible     | 多选时最多显示的标签数量，0 表示不限制             | `number`                          | `3`         |
| disabled                | 是否禁用                                           | `boolean`                         | `false`     |
| clearable               | 是否显示清除按钮                                   | `boolean`                         | `false`     |
| open                    | 下拉面板是否打开                                   | `boolean`                         | `false`     |
| hoist                   | 是否使用 fixed 定位策略                            | `boolean`                         | `false`     |
| filled                  | 是否使用填充样式                                   | `boolean`                         | `false`     |
| pill                    | 是否使用药丸样式                                   | `boolean`                         | `false`     |
| label                   | 标签文本                                           | `string`                          | `''`        |
| placement               | 下拉面板弹出位置                                   | `string`                          | `'bottom'`  |
| help-text               | 帮助文本                                           | `string`                          | `''`        |
| required                | 是否必填                                           | `boolean`                         | `false`     |
| form                    | 关联的表单 ID                                      | `string`                          | `''`        |
| treeData                | 树形数据（通过 JS 属性设置）                       | `TreeSelectNodeData[]`            | `[]`        |
| show-search             | 是否启用搜索，支持布尔值或配置对象                 | `boolean \| ShowSearchConfig`     | `false`     |
| tree-default-expand-all | 是否默认展开所有节点                               | `boolean`                         | `false`     |
| tree-checkable          | 是否启用勾选模式（多选时父子联动）                 | `boolean`                         | `false`     |
| show-checked-strategy   | 多选标签展示策略                                   | `'all' \| 'parent' \| 'child'`    | `'all'`     |
| tree-line               | 是否显示连接线                                     | `boolean`                         | `false`     |
| getTag                  | 自定义标签渲染函数（通过 JS 属性设置）             | `(node, index) => TemplateResult` | 默认 sl-tag |

### ShowSearchConfig

| 属性                 | 说明                                     | 类型                                             | 默认值    |
| -------------------- | ---------------------------------------- | ------------------------------------------------ | --------- |
| autoClearSearchValue | 多选模式下选中后是否自动清空搜索框       | `boolean`                                        | `true`    |
| filterTreeNode       | 是否根据输入项进行筛选，或自定义过滤函数 | `boolean \| ((inputValue, treeNode) => boolean)` | `true`    |
| searchValue          | 受控搜索值                               | `string`                                         | -         |
| treeNodeFilterProp   | 输入项过滤对应的 treeNode 属性           | `string`                                         | `'value'` |

## Events

| 事件名称      | 描述                       | 事件详情                              |
| ------------- | -------------------------- | ------------------------------------- |
| sl-change     | 选中值变化时触发           | -                                     |
| sl-clear      | 清除按钮点击时触发         | -                                     |
| sl-input      | 输入值变化时触发           | -                                     |
| sl-focus      | 获得焦点时触发             | -                                     |
| sl-blur       | 失去焦点时触发             | -                                     |
| sl-show       | 下拉面板打开时触发         | -                                     |
| sl-after-show | 下拉面板打开动画完成后触发 | -                                     |
| sl-hide       | 下拉面板关闭时触发         | -                                     |
| sl-after-hide | 下拉面板关闭动画完成后触发 | -                                     |
| sl-invalid    | 表单验证不通过时触发       | -                                     |
| sl-search     | 搜索值变化时触发           | `{ value: string }`                   |
| sl-lazy-load  | 懒加载节点展开时触发       | `{ value: string, item: SlTreeItem }` |

## Methods

| 方法名              | 描述                               | 参数                                                  | 返回值                    |
| ------------------- | ---------------------------------- | ----------------------------------------------------- | ------------------------- |
| show()              | 打开下拉面板                       | -                                                     | `Promise<void>`           |
| hide()              | 关闭下拉面板                       | -                                                     | `Promise<void>`           |
| focus(options?)     | 聚焦到输入框                       | `FocusOptions?`                                       | `void`                    |
| blur()              | 移除焦点                           | -                                                     | `void`                    |
| checkValidity()     | 检查有效性（不显示提示）           | -                                                     | `boolean`                 |
| reportValidity()    | 检查有效性并显示浏览器提示         | -                                                     | `boolean`                 |
| setCustomValidity() | 设置自定义验证消息，传空字符串恢复 | `message: string`                                     | `void`                    |
| getForm()           | 获取关联的表单元素                 | -                                                     | `HTMLFormElement \| null` |
| loadChildren()      | 为懒加载节点加载子节点             | `parentValue: string, children: TreeSelectNodeData[]` | `void`                    |

## Slots

| 插槽名             | 描述                                                    |
| ------------------ | ------------------------------------------------------- |
| label              | 标签内容，替代 `label` 属性                             |
| help-text          | 帮助文本，替代 `help-text` 属性                         |
| prefix             | 输入框前缀图标或元素                                    |
| suffix             | 输入框后缀图标或元素                                    |
| clear-icon         | 自定义清除图标                                          |
| expand-icon        | 自定义下拉箭头图标                                      |
| tree-expand-icon   | 自定义树节点展开图标（转发到 sl-tree 的 expand-icon）   |
| tree-collapse-icon | 自定义树节点收起图标（转发到 sl-tree 的 collapse-icon） |

## CSS Parts

| Part 名称              | 描述                                     |
| ---------------------- | ---------------------------------------- |
| form-control           | 表单控件外层容器                         |
| form-control-label     | 标签容器                                 |
| form-control-input     | 输入区域容器                             |
| form-control-help-text | 帮助文本容器                             |
| combobox               | 组合框容器（包含前缀、输入、清除、箭头） |
| prefix                 | 前缀容器                                 |
| suffix                 | 后缀容器                                 |
| display-input          | 显示输入框                               |
| tags                   | 标签容器（多选模式）                     |
| tag                    | 单个标签                                 |
| clear-button           | 清除按钮                                 |
| expand-icon            | 下拉箭头容器                             |
| dropdown               | 下拉面板                                 |
| tree                   | 树组件                                   |

## 最佳实践

### 1. 正确导入组件

```javascript
import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';
```

### 2. 添加 kwc:external 属性

在 HTML 模板中使用时，**必须**添加 `kwc:external` 属性：

```html
<sl-tree-select kwc:external class="my-tree-select"></sl-tree-select>
```

### 3. 使用 class 而非 id 选择器

```html
<!-- 正确 -->
<sl-tree-select kwc:external class="tree-select-el"></sl-tree-select>

<!-- 错误 -->
<sl-tree-select kwc:external id="tree-select-el"></sl-tree-select>
```

### 4. 在 renderedCallback 中绑定事件和设置数据

```javascript
renderedCallback() {
  if (this._eventsBound) return;
  this._eventsBound = true;
  this.bindShoelaceEvents();
  this.initData();
}

get shoelaceEventBindings() {
  return [
    ['.tree-select-el', 'sl-change', this.handleChange],
    ['.tree-select-el', 'sl-lazy-load', this.handleLazyLoad]
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

### 6. treeData 通过 JS 属性设置

`treeData` 是复杂对象数组，不能通过 HTML 属性传递，必须在 JavaScript 中设置：

```javascript
const el = this.template.querySelector('.tree-select-el');
el.treeData = [
  { title: 'Node1', value: '0-0', children: [...] }
];
```

### 7. showSearch 配置对象通过 JS 属性设置

当需要自定义搜索配置时，通过 JS 属性设置：

```javascript
el.showSearch = {
  filterTreeNode: (inputValue, treeNode) => {
    return treeNode.title.includes(inputValue);
  },
  treeNodeFilterProp: 'title',
  autoClearSearchValue: false
};
```

## 常见问题

### Q: 为什么设置了 treeData 但下拉面板没有数据？

A: 请确保在 `renderedCallback` 中设置 `treeData`，并且添加了防重复初始化的检查。`treeData` 必须通过 JS 属性设置，不能通过 HTML 属性传递。

### Q: 多选模式下如何获取选中的值？

A: 监听 `sl-change` 事件，通过 `el.value` 获取选中值数组。多选模式下 `value` 是 `string[]` 类型。

### Q: 如何实现远程搜索？

A: 使用 `showSearch` 配置对象，设置 `filterTreeNode: false` 禁用本地过滤，监听 `sl-search` 事件获取搜索关键词，在回调中请求远程数据并更新 `treeData`。

### Q: 懒加载节点如何使用？

A: 在 `treeData` 中设置 `lazy: true`，监听 `sl-lazy-load` 事件，在回调中异步获取子节点数据后调用 `el.loadChildren(parentValue, children)` 完成加载。
