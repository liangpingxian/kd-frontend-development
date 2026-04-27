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
  <sl-tree-select :treeData.prop="treeData" placeholder="请选择" style="width: 300px"></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
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
  ]);
</script>
```

## 多选模式

设置 `multiple` 属性启用多选模式，选中的节点以标签形式展示。

```html
<template>
  <sl-tree-select
    :treeData.prop="treeData"
    placeholder="请选择"
    multiple
    clearable
    style="width: 400px"
  ></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
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
  ]);
</script>
```

## 可勾选（Checkable）

通过 `tree-checkable` 属性启用勾选模式，父子节点联动选中。

```html
<template>
  <sl-tree-select
    :treeData.prop="treeData"
    placeholder="请选择"
    multiple
    tree-checkable
    clearable
    style="width: 400px"
  ></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
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
  ]);
</script>
```

## 带搜索

设置 `show-search` 属性启用搜索功能，可以在输入框中输入关键词筛选树节点。

```html
<template>
  <sl-tree-select
    :treeData.prop="treeData"
    placeholder="请搜索并选择"
    show-search
    style="width: 300px"
  ></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
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
  ]);
</script>
```

## 自定义搜索过滤（filterTreeNode）

通过 `showSearch` 对象配置自定义过滤函数，实现按标题搜索等需求。

```html
<template>
  <sl-tree-select
    :treeData.prop="treeData"
    :showSearch.prop="searchConfig"
    placeholder="输入 title 搜索"
    style="width: 300px"
  ></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
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
  ]);

  const searchConfig = {
    filterTreeNode: (inputValue, treeNode) => {
      const title = typeof treeNode.title === 'string' ? treeNode.title : '';
      return title.toLowerCase().includes(inputValue.toLowerCase());
    }
  };
</script>
```

## 搜索过滤字段（treeNodeFilterProp）

通过 `showSearch.treeNodeFilterProp` 指定默认过滤匹配的字段，默认为 `value`，设为 `title` 可按标题搜索。

```html
<template>
  <sl-tree-select
    :treeData.prop="treeData"
    :showSearch.prop="{ treeNodeFilterProp: 'title' }"
    placeholder="输入 title 搜索"
    style="width: 300px"
  ></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
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
  ]);
</script>
```

## 受控搜索值（searchValue）

通过 `showSearch.searchValue` 设置受控搜索值，配合 `@sl-search` 事件实现防抖搜索等场景。

```html
<template>
  <div>
    <sl-tree-select
      :treeData.prop="treeData"
      :showSearch.prop="searchConfig"
      placeholder="输入搜索（带防抖）"
      @sl-search="handleSearch"
      style="width: 300px"
    ></sl-tree-select>
    <p style="font-size: 12px; color: #999; margin-top: 8px">{{ searchInfo }}</p>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
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
  ]);

  const searchInfo = ref('');
  const searchValue = ref(undefined);
  let debounceTimer = null;

  const searchConfig = computed(() => ({
    treeNodeFilterProp: 'title',
    searchValue: searchValue.value
  }));

  function handleSearch(event) {
    searchInfo.value = '输入中: ' + event.detail.value;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchValue.value = event.detail.value;
      searchInfo.value = '已搜索: ' + event.detail.value;
    }, 300);
  }
</script>
```

## 选中后自动清空搜索（autoClearSearchValue）

多选模式下，`showSearch.autoClearSearchValue` 默认为 `true`，选中节点后自动清空搜索框。设为 `false` 可保留搜索内容继续选择。

```html
<template>
  <sl-tree-select
    :treeData.prop="treeData"
    :showSearch.prop="{ treeNodeFilterProp: 'title', autoClearSearchValue: false }"
    placeholder="选中后保留搜索"
    multiple
    clearable
    style="width: 300px"
  ></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
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
  ]);
</script>
```

## 默认展开所有节点

设置 `tree-default-expand-all` 属性，默认展开所有树节点。

```html
<template>
  <sl-tree-select
    :treeData.prop="treeData"
    placeholder="请选择"
    tree-default-expand-all
    style="width: 300px"
  ></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
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
  ]);
</script>
```

## 可清除

设置 `clearable` 属性，当有选中值时显示清除按钮。

```html
<template>
  <sl-tree-select :treeData.prop="treeData" placeholder="请选择" clearable style="width: 300px"></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
    {
      title: 'Node1',
      value: '0-0',
      children: [
        { title: 'Child Node1', value: '0-0-0' },
        { title: 'Child Node2', value: '0-0-1' }
      ]
    },
    { title: 'Node2', value: '0-1' }
  ]);
</script>
```

## 禁用状态

设置 `disabled` 属性禁用整个组件。

```html
<template>
  <sl-tree-select
    :treeData.prop="treeData"
    placeholder="已禁用"
    value="0-0"
    disabled
    style="width: 300px"
  ></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
    { title: 'Node1', value: '0-0' },
    { title: 'Node2', value: '0-1' }
  ]);
</script>
```

## 禁用节点

通过节点数据中的 `disabled` 属性禁用特定的树节点。

```html
<template>
  <sl-tree-select
    :treeData.prop="treeData"
    placeholder="请选择"
    tree-default-expand-all
    style="width: 300px"
  ></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
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
  ]);
</script>
```

## 尺寸

使用 `size` 属性设置组件尺寸，支持 `small`、`medium`（默认）和 `large`。

```html
<template>
  <div style="display: flex; flex-direction: column; gap: 8px">
    <sl-tree-select :treeData.prop="treeData" placeholder="Small" size="small" style="width: 300px"></sl-tree-select>
    <sl-tree-select :treeData.prop="treeData" placeholder="Medium" size="medium" style="width: 300px"></sl-tree-select>
    <sl-tree-select :treeData.prop="treeData" placeholder="Large" size="large" style="width: 300px"></sl-tree-select>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
    {
      title: 'Node1',
      value: '0-0',
      children: [
        { title: 'Child Node1', value: '0-0-0' },
        { title: 'Child Node2', value: '0-0-1' }
      ]
    },
    { title: 'Node2', value: '0-1' }
  ]);
</script>
```

## Label 和 Help Text

使用 `label` 和 `help-text` 属性为组件添加标签和帮助文本。

```html
<template>
  <sl-tree-select
    :treeData.prop="treeData"
    label="部门"
    help-text="请选择您所在的部门"
    placeholder="请选择部门"
    style="width: 300px"
  ></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
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
  ]);
</script>
```

## 设置默认值

通过 `value` 属性设置默认选中值。

```html
<template>
  <sl-tree-select
    :treeData.prop="treeData"
    placeholder="请选择"
    value="0-0-1"
    tree-default-expand-all
    style="width: 300px"
  ></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
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
  ]);
</script>
```

## showCheckedStrategy

`show-checked-strategy` 属性控制多选模式下标签的展示策略：

- `all`（默认）：显示所有选中的节点
- `parent`：当父节点下所有子节点都选中时，只显示父节点
- `child`：只显示叶子节点

```html
<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap">
    <div>
      <p style="margin: 0 0 4px; font-size: 12px; color: #999">strategy="all"</p>
      <sl-tree-select
        :treeData.prop="treeData"
        placeholder="all"
        multiple
        tree-checkable
        clearable
        show-checked-strategy="all"
        tree-default-expand-all
        style="width: 280px"
      ></sl-tree-select>
    </div>
    <div>
      <p style="margin: 0 0 4px; font-size: 12px; color: #999">strategy="parent"</p>
      <sl-tree-select
        :treeData.prop="treeData"
        placeholder="parent"
        multiple
        tree-checkable
        clearable
        show-checked-strategy="parent"
        tree-default-expand-all
        style="width: 280px"
      ></sl-tree-select>
    </div>
    <div>
      <p style="margin: 0 0 4px; font-size: 12px; color: #999">strategy="child"</p>
      <sl-tree-select
        :treeData.prop="treeData"
        placeholder="child"
        multiple
        tree-checkable
        clearable
        show-checked-strategy="child"
        tree-default-expand-all
        style="width: 280px"
      ></sl-tree-select>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
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
  ]);
</script>
```

## 最大显示标签数

多选模式下，通过 `max-options-visible` 属性控制最多显示的标签数量，超出部分以 `+n` 形式展示。设为 `0` 则不限制。

```html
<template>
  <sl-tree-select
    :treeData.prop="treeData"
    placeholder="请选择"
    multiple
    clearable
    max-options-visible="2"
    tree-default-expand-all
    style="width: 400px"
  ></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
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
  ]);
</script>
```

## 连接线（Tree Line）

设置 `tree-line` 属性，在父节点之间显示连接线。

```html
<template>
  <sl-tree-select
    :treeData.prop="treeData"
    placeholder="请选择"
    tree-line
    tree-default-expand-all
    clearable
    style="width: 300px"
  ></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
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
  ]);
</script>
```

## 节点图标

通过 `treeData` 中的 `icon` 字段为节点添加图标。

```html
<template>
  <sl-tree-select
    :treeData.prop="treeData"
    placeholder="请选择"
    tree-default-expand-all
    clearable
    style="width: 350px"
  ></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
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
  ]);
</script>
```

## Filled 样式

使用 `filled` 属性绘制填充样式的选择器。

```html
<template>
  <sl-tree-select :treeData.prop="treeData" placeholder="Filled style" filled style="width: 300px"></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
    {
      title: 'Node1',
      value: '0-0',
      children: [
        { title: 'Child Node1', value: '0-0-0' },
        { title: 'Child Node2', value: '0-0-1' }
      ]
    },
    { title: 'Node2', value: '0-1' }
  ]);
</script>
```

## Pill 样式

使用 `pill` 属性绘制圆角药丸样式。

```html
<template>
  <sl-tree-select :treeData.prop="treeData" placeholder="Pill style" pill style="width: 300px"></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
    {
      title: 'Node1',
      value: '0-0',
      children: [
        { title: 'Child Node1', value: '0-0-0' },
        { title: 'Child Node2', value: '0-0-1' }
      ]
    },
    { title: 'Node2', value: '0-1' }
  ]);
</script>
```

## Hoist

设置 `hoist` 属性使下拉面板使用 `fixed` 定位策略，可以突破 `overflow: hidden` 的容器限制。

```html
<template>
  <div style="overflow: hidden; border: 1px dashed var(--sl-color-neutral-300); padding: 16px; height: 120px">
    <p style="margin: 0 0 8px; font-size: 12px; color: #999">overflow: hidden 容器</p>
    <sl-tree-select :treeData.prop="treeData" placeholder="请选择" hoist style="width: 260px"></sl-tree-select>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
    {
      title: 'Node1',
      value: '0-0',
      children: [
        { title: 'Child Node1', value: '0-0-0' },
        { title: 'Child Node2', value: '0-0-1' }
      ]
    },
    { title: 'Node2', value: '0-1' }
  ]);
</script>
```

## 弹出位置

通过 `placement` 属性手动指定弹出的位置。

```html
<template>
  <sl-tree-select
    :treeData.prop="treeData"
    placeholder="请选择"
    placement="top-start"
    style="width: 300px"
  ></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
    {
      title: 'Node1',
      value: '0-0',
      children: [
        { title: 'Child Node1', value: '0-0-0' },
        { title: 'Child Node2', value: '0-0-1' }
      ]
    },
    { title: 'Node2', value: '0-1' }
  ]);
</script>
```

## 前缀和后缀图标（Prefix & Suffix）

通过 `prefix` 和 `suffix` 插槽在输入框前后添加图标。

```html
<template>
  <sl-tree-select :treeData.prop="treeData" placeholder="带前缀图标" clearable style="width: 300px">
    <sl-icon name="search" slot="prefix"></sl-icon>
  </sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';
  import '@kdcloudjs/shoelace/dist/components/icon/icon.js';

  const treeData = ref([
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
  ]);
</script>
```

## 自定义树节点展开/收起图标

通过 `tree-expand-icon` 和 `tree-collapse-icon` 插槽自定义树节点的展开和收起图标。

```html
<template>
  <sl-tree-select :treeData.prop="treeData" placeholder="请选择" tree-default-expand-all clearable style="width: 300px">
    <sl-icon name="plus-square" slot="tree-expand-icon"></sl-icon>
    <sl-icon name="dash-square" slot="tree-collapse-icon"></sl-icon>
  </sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';
  import '@kdcloudjs/shoelace/dist/components/icon/icon.js';

  const treeData = ref([
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
  ]);
</script>
```

## 自定义下拉箭头图标（Expand Icon）

通过 `expand-icon` 插槽替换默认的下拉箭头图标。

```html
<template>
  <sl-tree-select :treeData.prop="treeData" placeholder="自定义箭头" style="width: 300px">
    <sl-icon name="caret-down-fill" slot="expand-icon"></sl-icon>
  </sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';
  import '@kdcloudjs/shoelace/dist/components/icon/icon.js';

  const treeData = ref([
    {
      title: 'Node1',
      value: '0-0',
      children: [
        { title: 'Child Node1', value: '0-0-0' },
        { title: 'Child Node2', value: '0-0-1' }
      ]
    },
    { title: 'Node2', value: '0-1' }
  ]);
</script>
```

## 自定义标签渲染（getTag）

通过 `.prop` 修饰符设置 `getTag` 属性自定义多选模式下标签的渲染方式。

```html
<template>
  <sl-tree-select
    :treeData.prop="treeData"
    :getTag.prop="customGetTag"
    placeholder="请选择"
    multiple
    clearable
    tree-default-expand-all
    style="width: 400px"
  ></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeData = ref([
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
  ]);

  const colors = ['#e6f7ff', '#fff7e6', '#f6ffed', '#fff1f0', '#f9f0ff'];

  function customGetTag(node, index) {
    const tag = document.createElement('sl-tag');
    tag.size = 'medium';
    tag.removable = true;
    tag.setAttribute('part', 'tag');
    tag.style.setProperty('--sl-color-neutral-0', colors[index % colors.length]);
    tag.textContent = typeof node.title === 'string' ? node.title : node.value;
    return tag;
  }
</script>
```

## 异步加载（Lazy Load）

在 `treeData` 中设置 `lazy: true` 标记需要懒加载的节点。展开时触发 `sl-lazy-load` 事件，在回调中调用 `loadChildren(parentValue, children)` 方法完成加载。

```html
<template>
  <sl-tree-select
    ref="treeSelectRef"
    :treeData.prop="treeData"
    placeholder="请选择"
    clearable
    @sl-lazy-load="handleLazyLoad"
    style="width: 300px"
  ></sl-tree-select>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeSelectRef = ref(null);

  const treeData = ref([
    { title: 'Expand to load', value: 'parent-0', lazy: true },
    { title: 'Expand to load', value: 'parent-1', lazy: true },
    { title: 'Leaf Node', value: 'leaf-0' }
  ]);

  async function handleLazyLoad(event) {
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
    treeSelectRef.value?.loadChildren(nodeValue, children);
  }
</script>
```

## 表单集成

`sl-tree-select` 支持表单集成，可通过 `name`、`required` 属性参与表单提交和验证。

```html
<template>
  <form ref="formRef" @submit.prevent="handleSubmit" style="width: 300px">
    <sl-tree-select
      :treeData.prop="treeData"
      name="department"
      label="部门"
      placeholder="请选择部门"
      required
      help-text="必填项"
      clearable
    ></sl-tree-select>
    <br />
    <sl-button type="submit" variant="primary" style="margin-top: 8px">提交</sl-button>
    <p style="font-size: 12px; color: #999; margin-top: 8px">{{ output }}</p>
  </form>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';
  import '@kdcloudjs/shoelace/dist/components/button/button.js';

  const formRef = ref(null);
  const output = ref('');

  const treeData = ref([
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
  ]);

  function handleSubmit() {
    const data = new FormData(formRef.value);
    output.value = '提交值: ' + (data.get('department') || '(空)');
  }
</script>
```

## 监听事件

通过 `@sl-change`、`@sl-focus`、`@sl-blur`、`@sl-clear`、`@sl-show`、`@sl-hide` 等监听组件状态变化。

```html
<template>
  <div>
    <div style="padding: 8px; background: var(--sl-color-neutral-100); border-radius: 4px; margin-bottom: 8px">
      <p style="margin: 4px 0; font-size: 12px">{{ eventMsg }}</p>
    </div>
    <sl-tree-select
      ref="treeSelectRef"
      :treeData.prop="treeData"
      placeholder="请选择"
      clearable
      @sl-change="handleChange"
      @sl-focus="eventMsg = 'sl-focus'"
      @sl-blur="eventMsg = 'sl-blur'"
      @sl-clear="eventMsg = 'sl-clear'"
      @sl-show="eventMsg = 'sl-show'"
      @sl-hide="eventMsg = 'sl-hide'"
      style="width: 300px"
    ></sl-tree-select>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';

  const treeSelectRef = ref(null);
  const eventMsg = ref('等待事件...');

  const treeData = ref([
    {
      title: 'Node1',
      value: '0-0',
      children: [
        { title: 'Child Node1', value: '0-0-0' },
        { title: 'Child Node2', value: '0-0-1' }
      ]
    },
    { title: 'Node2', value: '0-1' }
  ]);

  function handleChange() {
    eventMsg.value = 'sl-change: value=' + (treeSelectRef.value?.value ?? '');
  }
</script>
```

## 动态更新数据

通过 `ref` 动态更新 `treeData` 和 `value` 属性。

```html
<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex; gap: 8px">
      <sl-button size="small" @click="handleSetValue">选中 frontend</sl-button>
      <sl-button size="small" @click="handleUpdateData">更新数据</sl-button>
      <sl-button size="small" @click="handleReset">重置</sl-button>
    </div>
    <sl-tree-select
      ref="treeSelectRef"
      :treeData.prop="treeData"
      placeholder="请选择"
      clearable
      style="width: 300px"
    ></sl-tree-select>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';
  import '@kdcloudjs/shoelace/dist/components/button/button.js';

  const treeSelectRef = ref(null);

  const defaultData = [
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

  const treeData = ref([...defaultData]);

  function handleSetValue() {
    if (treeSelectRef.value) treeSelectRef.value.value = 'frontend';
  }

  function handleUpdateData() {
    treeData.value = [
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

  function handleReset() {
    treeData.value = [...defaultData];
    if (treeSelectRef.value) treeSelectRef.value.value = '';
  }
</script>
```

## 编程式控制（show / hide / focus / blur）

通过 `ref` 调用 `show()`、`hide()`、`focus()`、`blur()` 方法编程式控制下拉面板和焦点。

```html
<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex; gap: 8px">
      <sl-button size="small" @click="treeSelectRef?.show()">show()</sl-button>
      <sl-button size="small" @click="treeSelectRef?.hide()">hide()</sl-button>
      <sl-button size="small" @click="treeSelectRef?.focus()">focus()</sl-button>
      <sl-button size="small" @click="treeSelectRef?.blur()">blur()</sl-button>
    </div>
    <sl-tree-select
      ref="treeSelectRef"
      :treeData.prop="treeData"
      placeholder="请选择"
      style="width: 300px"
    ></sl-tree-select>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';
  import '@kdcloudjs/shoelace/dist/components/button/button.js';

  const treeSelectRef = ref(null);

  const treeData = ref([
    {
      title: 'Node1',
      value: '0-0',
      children: [
        { title: 'Child Node1', value: '0-0-0' },
        { title: 'Child Node2', value: '0-0-1' }
      ]
    },
    { title: 'Node2', value: '0-1' }
  ]);
</script>
```

## 表单验证（checkValidity / reportValidity / setCustomValidity）

通过 `ref` 调用 `checkValidity()`、`reportValidity()`、`setCustomValidity()` 方法进行表单验证。

```html
<template>
  <div>
    <sl-tree-select
      ref="treeSelectRef"
      :treeData.prop="treeData"
      name="dept"
      label="部门"
      placeholder="请选择"
      required
      clearable
      style="width: 300px"
    ></sl-tree-select>
    <div style="display: flex; gap: 8px; margin-top: 8px">
      <sl-button size="small" @click="output = 'checkValidity: ' + treeSelectRef?.checkValidity()"
        >checkValidity()</sl-button
      >
      <sl-button size="small" @click="treeSelectRef?.reportValidity()">reportValidity()</sl-button>
      <sl-button size="small" @click="treeSelectRef?.setCustomValidity('请选择一个有效的部门')"
        >setCustomValidity()</sl-button
      >
      <sl-button size="small" @click="treeSelectRef?.setCustomValidity('')">清除自定义验证</sl-button>
    </div>
    <p style="font-size: 12px; color: #999; margin-top: 8px">{{ output }}</p>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/tree-select/tree-select.js';
  import '@kdcloudjs/shoelace/dist/components/button/button.js';

  const treeSelectRef = ref(null);
  const output = ref('');

  const treeData = ref([
    {
      title: '技术部',
      value: 'tech',
      children: [
        { title: '前端组', value: 'frontend' },
        { title: '后端组', value: 'backend' }
      ]
    },
    { title: '产品部', value: 'product' }
  ]);
</script>
```

## Properties

| 属性                    | 描述                                                 | 类型                              | 默认值      |
| ----------------------- | ---------------------------------------------------- | --------------------------------- | ----------- |
| name                    | 表单提交时的字段名                                   | `string`                          | `''`        |
| value                   | 当前选中值。多选时为 `string[]`，单选时为 `string`   | `string \| string[]`              | `''`        |
| size                    | 组件尺寸                                             | `'small' \| 'medium' \| 'large'`  | `'medium'`  |
| placeholder             | 占位文本                                             | `string`                          | `''`        |
| multiple                | 是否多选                                             | `boolean`                         | `false`     |
| max-options-visible     | 多选时最多显示的标签数量，0 表示不限制               | `number`                          | `3`         |
| disabled                | 是否禁用                                             | `boolean`                         | `false`     |
| clearable               | 是否显示清除按钮                                     | `boolean`                         | `false`     |
| open                    | 下拉面板是否打开                                     | `boolean`                         | `false`     |
| hoist                   | 是否使用 fixed 定位策略                              | `boolean`                         | `false`     |
| filled                  | 是否使用填充样式                                     | `boolean`                         | `false`     |
| pill                    | 是否使用药丸样式                                     | `boolean`                         | `false`     |
| label                   | 标签文本                                             | `string`                          | `''`        |
| placement               | 下拉面板弹出位置                                     | `string`                          | `'bottom'`  |
| help-text               | 帮助文本                                             | `string`                          | `''`        |
| required                | 是否必填                                             | `boolean`                         | `false`     |
| form                    | 关联的表单 ID                                        | `string`                          | `''`        |
| treeData                | 树形数据（需使用 `.prop` 修饰符绑定）                | `TreeSelectNodeData[]`            | `[]`        |
| show-search             | 是否启用搜索，支持布尔值或配置对象（对象需 `.prop`） | `boolean \| ShowSearchConfig`     | `false`     |
| tree-default-expand-all | 是否默认展开所有节点                                 | `boolean`                         | `false`     |
| tree-checkable          | 是否启用勾选模式（多选时父子联动）                   | `boolean`                         | `false`     |
| show-checked-strategy   | 多选标签展示策略                                     | `'all' \| 'parent' \| 'child'`    | `'all'`     |
| tree-line               | 是否显示连接线                                       | `boolean`                         | `false`     |
| getTag                  | 自定义标签渲染函数（需使用 `.prop` 修饰符绑定）      | `(node, index) => TemplateResult` | 默认 sl-tag |

### ShowSearchConfig

| 属性                 | 说明                                     | 类型                                             | 默认值    |
| -------------------- | ---------------------------------------- | ------------------------------------------------ | --------- |
| autoClearSearchValue | 多选模式下选中后是否自动清空搜索框       | `boolean`                                        | `true`    |
| filterTreeNode       | 是否根据输入项进行筛选，或自定义过滤函数 | `boolean \| ((inputValue, treeNode) => boolean)` | `true`    |
| searchValue          | 受控搜索值                               | `string`                                         | -         |
| treeNodeFilterProp   | 输入项过滤对应的 treeNode 属性           | `string`                                         | `'value'` |

## Events

| 事件名称      | Vue 绑定         | 描述                       | 事件详情                              |
| ------------- | ---------------- | -------------------------- | ------------------------------------- |
| sl-change     | `@sl-change`     | 选中值变化时触发           | -                                     |
| sl-clear      | `@sl-clear`      | 清除按钮点击时触发         | -                                     |
| sl-input      | `@sl-input`      | 输入值变化时触发           | -                                     |
| sl-focus      | `@sl-focus`      | 获得焦点时触发             | -                                     |
| sl-blur       | `@sl-blur`       | 失去焦点时触发             | -                                     |
| sl-show       | `@sl-show`       | 下拉面板打开时触发         | -                                     |
| sl-after-show | `@sl-after-show` | 下拉面板打开动画完成后触发 | -                                     |
| sl-hide       | `@sl-hide`       | 下拉面板关闭时触发         | -                                     |
| sl-after-hide | `@sl-after-hide` | 下拉面板关闭动画完成后触发 | -                                     |
| sl-invalid    | `@sl-invalid`    | 表单验证不通过时触发       | -                                     |
| sl-search     | `@sl-search`     | 搜索值变化时触发           | `{ value: string }`                   |
| sl-lazy-load  | `@sl-lazy-load`  | 懒加载节点展开时触发       | `{ value: string, item: SlTreeItem }` |

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

### 2. 复杂数据使用 `.prop` 修饰符绑定

Vue 默认将绑定值作为 HTML attribute 设置，对于对象和数组类型的属性（如 `treeData`、`showSearch`、`getTag`），必须使用 `.prop` 修饰符让 Vue 将其作为 DOM property 设置：

```html
<!-- ✅ 正确：使用 .prop 修饰符 -->
<sl-tree-select :treeData.prop="treeData" :showSearch.prop="searchConfig" />

<!-- ❌ 错误：不使用 .prop，Vue 会尝试序列化为 attribute -->
<sl-tree-select :treeData="treeData" />
```

### 3. 布尔和字符串属性直接绑定

简单类型的属性可以直接使用 HTML attribute 方式：

```html
<sl-tree-select
  placeholder="请选择"
  show-search
  multiple
  clearable
  tree-default-expand-all
  size="small"
  show-checked-strategy="parent"
/>
```

### 4. 事件使用 `@sl-*` 语法

```html
<sl-tree-select @sl-change="handleChange" @sl-lazy-load="handleLazyLoad" @sl-search="handleSearch" />
```

### 5. 通过 ref 调用组件方法

```html
<sl-tree-select ref="treeSelectRef" />

<script setup>
  import { ref } from 'vue';
  const treeSelectRef = ref(null);

  // 调用方法
  treeSelectRef.value?.show();
  treeSelectRef.value?.loadChildren(parentValue, children);
</script>
```

## 常见问题

### Q: 为什么 treeData 绑定后没有数据？

A: 在 Vue 中绑定复杂数据（对象、数组）到 Web Component 时，必须使用 `.prop` 修饰符：`:treeData.prop="data"`。不加 `.prop` 时 Vue 会尝试将数据序列化为 HTML attribute 字符串，导致数据丢失。

### Q: 多选模式下如何获取选中的值？

A: 监听 `@sl-change` 事件，通过 `ref` 获取 `treeSelectRef.value.value`。多选模式下 `value` 是 `string[]` 类型。

### Q: 如何实现远程搜索？

A: 将 `showSearch` 设为 `{ filterTreeNode: false }` 禁用本地过滤，监听 `@sl-search` 事件获取搜索关键词，在回调中请求远程数据并更新 `treeData`。

### Q: 懒加载节点如何使用？

A: 在 `treeData` 中设置 `lazy: true`，监听 `@sl-lazy-load` 事件，在回调中异步获取子节点数据后调用 `treeSelectRef.value.loadChildren(parentValue, children)` 完成加载。

### Q: Vue 中如何实现双向绑定？

A: Vue 对自定义元素不支持 `v-model`，需要手动实现：

```html
<sl-tree-select :value="selectedValue" @sl-change="selectedValue = $event.target.value" />
```
