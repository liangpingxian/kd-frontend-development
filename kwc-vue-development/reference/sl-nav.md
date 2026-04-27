# Nav 导航组件 Skill

## 组件概述

`sl-nav` 现在以 **Ant Design Menu API 兼容** 为核心设计目标，保留 Shoelace 的视觉风格，同时尽量对齐 Antd 的配置方式。核心标签包括：

- `sl-nav`：导航容器，管理选中状态、展开状态和渲染模式
- `sl-nav-item`：单个菜单项，使用 `key` 标识
- `sl-nav-group`：分组容器，支持 `label` 或 `slot="title"`
- `sl-nav-submenu`：子菜单，支持 `key`、`open`、`label`、`title`、`popupOffset`

## 功能列表

| 功能 | 说明 |
|------|------|
| Antd 兼容 API | 支持 `items`、`selectedKeys`、`openKeys`、`defaultSelectedKeys`、`defaultOpenKeys` |
| 三种模式 | 支持 `inline`、`vertical`、`horizontal` |
| 折叠内联导航 | `inlineCollapsed` 可将 `inline` 侧栏切换为弹出式行为 |
| 多选与禁选 | 支持 `multiple`、`selectable` |
| 子菜单交互 | 支持 `triggerSubMenuAction`、`subMenuOpenDelay`、`subMenuCloseDelay` |
| 事件与回调 | 支持 `sl-change`、`sl-nav-open-change`、`sl-nav-select` 以及 `onClick` / `onSelect` / `onDeselect` / `onOpenChange` |
| 数据驱动渲染 | 可直接通过 `items` 数组生成完整导航结构 |

## 核心约束

### 必须遵守的规则

1. **选中与展开状态使用 `key` 体系，不再使用旧版 `value`**
   - `sl-nav-item` 和 `sl-nav-submenu` 都以 `key` 作为唯一标识
   - `itemKey` 是 React 专用别名，Vue 模板里继续使用 `key`
   - 选中状态使用 `selectedKeys`
   - 展开状态使用 `openKeys`

2. **Vue 中对象、数组、函数必须使用 camelCase + `.prop`**
   - `items`、`selectedKeys`、`openKeys`、`defaultSelectedKeys`、`defaultOpenKeys`
   - `onClick`、`onSelect`、`onDeselect`、`onOpenChange`
   - `popupOffset`、`expandIcon`、`overflowedIndicator`
   ```vue
   <sl-nav
     :items.prop="items"
     :selectedKeys.prop="selectedKeys"
     :openKeys.prop="openKeys"
     :onOpenChange.prop="handleOpenChange"
   ></sl-nav>
   ```

3. **模式语义已变化**
   - `inline`：默认侧边导航，子菜单内联展开
   - `vertical`：弹出式垂直菜单
   - `horizontal`：顶部菜单
   - `inlineCollapsed` 只对 `inline` 有意义，会把内联侧栏切成弹出式体验
   - 当 `inlineCollapsed` 或 `mode` 发生切换时，组件会主动清空已展开的 submenu

4. **事件读取方式已变化**
   - `sl-change`：从 `event.detail.selectedKeys` 取值
   - `sl-nav-open-change`：从 `event.detail.openKeys` 取值
   - `sl-nav-select`：从 `event.detail.item`、`event.detail.domEvent` 取值
   - 不要再按旧版 `event.target.value` 读取

5. **`sl-nav-group` 标题有两种来源**
   - 模板写法：`<span slot="title">基础设置</span>`
   - `items` API：使用 `label`
   - 不要写成 `<sl-nav-group title="基础设置">`

6. **`items` API 和手写 slot 结构二选一更稳妥**
   - 简单静态菜单可直接写标签
   - 后端返回菜单树、权限菜单、动态路由更适合 `items`

## 快速开始

### 组件导入

```js
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
import '@kdcloudjs/shoelace/dist/components/nav/nav.js';
import '@kdcloudjs/shoelace/dist/components/nav-item/nav-item.js';
import '@kdcloudjs/shoelace/dist/components/nav-group/nav-group.js';
import '@kdcloudjs/shoelace/dist/components/nav-submenu/nav-submenu.js';
```

### 最简示例

```vue
<template>
  <sl-nav :defaultSelectedKeys.prop="['home']" @sl-change="handleChange">
    <sl-nav-item key="home">
      <sl-icon slot="prefix" name="house"></sl-icon>
      首页
    </sl-nav-item>
    <sl-nav-item key="profile">
      <sl-icon slot="prefix" name="person"></sl-icon>
      个人中心
    </sl-nav-item>
  </sl-nav>
</template>

<script setup>
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
import '@kdcloudjs/shoelace/dist/components/nav/nav.js';
import '@kdcloudjs/shoelace/dist/components/nav-item/nav-item.js';

function handleChange(event) {
  console.log('当前选中 keys:', event.detail.selectedKeys);
}
</script>
```

### 受控侧边导航示例

```vue
<template>
  <sl-nav
    mode="inline"
    style="max-width: 256px;"
    :selectedKeys.prop="selectedKeys"
    :openKeys.prop="openKeys"
    @sl-change="handleChange"
    @sl-nav-open-change="handleOpenChange"
  >
    <sl-nav-submenu key="system" title="系统设置">
      <sl-icon slot="prefix" name="gear"></sl-icon>
      <sl-nav-group>
        <span slot="title">基础设置</span>
        <sl-nav-item key="profile">个人资料</sl-nav-item>
        <sl-nav-item key="security">安全设置</sl-nav-item>
      </sl-nav-group>
    </sl-nav-submenu>

    <sl-nav-item key="message">
      <sl-icon slot="prefix" name="envelope"></sl-icon>
      消息中心
    </sl-nav-item>
  </sl-nav>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
import '@kdcloudjs/shoelace/dist/components/nav/nav.js';
import '@kdcloudjs/shoelace/dist/components/nav-item/nav-item.js';
import '@kdcloudjs/shoelace/dist/components/nav-group/nav-group.js';
import '@kdcloudjs/shoelace/dist/components/nav-submenu/nav-submenu.js';

const selectedKeys = ref(['security']);
const openKeys = ref(['system']);

function handleChange(event) {
  selectedKeys.value = [...event.detail.selectedKeys];
}

function handleOpenChange(event) {
  openKeys.value = [...event.detail.openKeys];
}
</script>
```

### `items` 数据驱动示例

```vue
<template>
  <sl-nav
    mode="inline"
    style="max-width: 256px;"
    :items.prop="items"
    :selectedKeys.prop="selectedKeys"
    :openKeys.prop="openKeys"
    :onSelect.prop="handleSelect"
    :onOpenChange.prop="handleOpenChange"
  ></sl-nav>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/nav/nav.js';

const selectedKeys = ref(['logs']);
const openKeys = ref(['system']);

const items = [
  { key: 'dashboard', label: 'Dashboard' },
  {
    key: 'system',
    label: 'System',
    children: [
      { key: 'logs', label: 'Logs' },
      { key: 'alerts', label: 'Alerts', danger: true }
    ]
  }
];

function handleSelect(info) {
  selectedKeys.value = [...info.selectedKeys];
}

function handleOpenChange(nextOpenKeys) {
  openKeys.value = [...nextOpenKeys];
}
</script>
```

### 只展开当前父级菜单示例

```vue
<template>
  <sl-nav
    mode="inline"
    style="max-width: 256px;"
    :selectedKeys.prop="selectedKeys"
    :openKeys.prop="openKeys"
    @sl-change="handleChange"
    @sl-nav-open-change="handleOpenChange"
  >
    <sl-nav-submenu key="system" title="系统设置">
      <sl-nav-item key="profile">个人资料</sl-nav-item>
      <sl-nav-item key="security">安全设置</sl-nav-item>
    </sl-nav-submenu>

    <sl-nav-submenu key="workspace" title="工作台">
      <sl-nav-item key="todo">待办任务</sl-nav-item>
      <sl-nav-item key="report">报表中心</sl-nav-item>
    </sl-nav-submenu>
  </sl-nav>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/nav/nav.js';
import '@kdcloudjs/shoelace/dist/components/nav-item/nav-item.js';
import '@kdcloudjs/shoelace/dist/components/nav-submenu/nav-submenu.js';

const rootSubmenuKeys = ['system', 'workspace'];
const selectedKeys = ref(['security']);
const openKeys = ref(['system']);

function handleChange(event) {
  selectedKeys.value = [...event.detail.selectedKeys];
}

function handleOpenChange(event) {
  const nextOpenKeys = [...event.detail.openKeys];
  const latestRootKey = nextOpenKeys.find(key => !openKeys.value.includes(key));

  if (!latestRootKey) {
    openKeys.value = nextOpenKeys;
    return;
  }

  openKeys.value = rootSubmenuKeys.includes(latestRootKey) ? [latestRootKey] : nextOpenKeys;
}
</script>
```

## API 概览

### `sl-nav` 主要属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `items` | Antd 风格菜单数据 | `SlNavItemType[]` | `[]` |
| `selectedKeys` | 受控选中项 | `string[]` | `[]` |
| `defaultSelectedKeys` | 非受控默认选中项 | `string[]` | `[]` |
| `openKeys` | 受控展开子菜单 | `string[]` | `[]` |
| `defaultOpenKeys` | 非受控默认展开子菜单 | `string[]` | `[]` |
| `mode` | 菜单模式 | `'inline' \| 'vertical' \| 'horizontal'` | `'inline'` |
| `multiple` | 是否允许多选 | `boolean` | `false` |
| `selectable` | 是否允许选中 | `boolean` | `true` |
| `inlineCollapsed` | 是否折叠内联菜单 | `boolean` | `false` |
| `inlineIndent` | inline 模式缩进宽度 | `number` | `16` |
| `subMenuOpenDelay` | 子菜单展开延迟，单位秒 | `number` | `0` |
| `subMenuCloseDelay` | 子菜单收起延迟，单位秒 | `number` | `0.1` |
| `triggerSubMenuAction` | 子菜单触发方式 | `'hover' \| 'click'` | `'hover'` |
| `theme` | 主题兼容字段 | `'light' \| 'dark'` | `'light'` |
| `expandIcon` | 自定义展开图标 | `unknown` | - |
| `forceSubMenuRender` | 是否强制渲染子菜单内容 | `boolean` | `false` |
| `overflowedIndicator` | 溢出指示器兼容字段 | `unknown` | - |
| `disabledOverflow` | 是否禁用溢出处理 | `boolean` | `false` |

### `sl-nav-item` 主要属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `key` | 菜单项唯一标识 | `string` | `''` |
| `label` | `items` API 下的标签内容 | `unknown` | - |
| `icon` | `items` API 下的图标内容 | `unknown` | - |
| `extra` | 右侧额外内容 | `unknown` | - |
| `danger` | 危险态菜单项 | `boolean` | `false` |
| `title` | 提示文案，折叠时常用 | `string` | `''` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `active` | 是否激活 | `boolean` | `false` |
| `collapsed` | 是否处于折叠侧栏状态，由父级 nav 同步 | `boolean` | `false` |
| `href` | 跳转链接 | `string` | `''` |
| `target` | 链接打开方式 | `'_blank' \| '_parent' \| '_self' \| '_top'` | - |
| `download` | 下载文件名 | `string` | - |
| `rel` | 链接 rel 属性 | `string` | `'noreferrer noopener'` |

### `sl-nav-group` 主要属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `label` | `items` API 下的分组标题 | `unknown` | - |
| `active` | 组内是否存在激活项 | `boolean` | `false` |

### `sl-nav-submenu` 主要属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `key` | 子菜单唯一标识 | `string` | `''` |
| `open` | 是否展开 | `boolean` | `false` |
| `nested` | 是否为嵌套子菜单 | `boolean` | `false` |
| `title` | 标题字符串 | `string` | `''` |
| `label` | `items` API 下的标题内容 | `unknown` | - |
| `icon` | `items` API 下的图标内容 | `unknown` | - |
| `theme` | 子菜单主题 | `'light' \| 'dark'` | `'light'` |
| `popupClassName` | 弹层类名 | `string` | `''` |
| `popupOffset` | 弹层偏移 | `[number, number]` | - |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `active` | 是否包含激活项 | `boolean` | `false` |
| `collapsed` | 是否处于折叠侧栏状态，由父级 nav 同步 | `boolean` | `false` |

### 主要事件

| 事件 | 说明 | 获取方式 |
|------|------|----------|
| `sl-change` | 选中项变化 | `event.detail.selectedKeys` |
| `sl-nav-open-change` | 展开子菜单变化 | `event.detail.openKeys` |
| `sl-nav-select` | 点击具体菜单项 | `event.detail.item`、`event.detail.domEvent` |
| `sl-show` | 子菜单展开 | 监听 `sl-nav-submenu` |
| `sl-hide` | 子菜单收起 | 监听 `sl-nav-submenu` |

### 回调属性

| 属性 | 说明 |
|------|------|
| `onClick` | 点击菜单项时触发，返回 `key`、`keyPath`、`item`、`domEvent` |
| `onSelect` | 选中时触发 |
| `onDeselect` | 多选取消时触发 |
| `onOpenChange` | 展开项变化时触发 |

### 主要 Slots

| 组件 | Slot | 说明 |
|------|------|------|
| `sl-nav-item` | `prefix` / `suffix` | 导航项前后缀 |
| `sl-nav-group` | `title` | 分组标题插槽 |
| `sl-nav-submenu` | `title` / `prefix` / `suffix` / `expand-icon` / `collapse-icon` | 子菜单标题与图标区域 |

### 主要方法

| 组件 | 方法 | 说明 |
|------|------|------|
| `sl-nav-submenu` | `show(source?)` | 展开子菜单 |
| `sl-nav-submenu` | `hide(source?)` | 收起子菜单 |

## 使用建议

1. **业务菜单优先用 `key` 对齐路由 name 或权限编码**，不要再把展示文案当状态值。
2. **静态结构用 slot，动态结构用 `items`**，不要在一个菜单里混用得过于复杂。
3. **受控场景优先监听 `sl-change` 和 `sl-nav-open-change`**，用 `event.detail` 回写本地状态。
4. **Vue 里复杂属性全部走 `.prop`**，否则数组和函数会被字符串化。
5. **折叠侧栏优先使用 `mode="inline" + inlineCollapsed`**，不要再用旧版 `vertical-popup` 思路。
6. **切换 `inlineCollapsed` 或 `mode` 时要同步业务状态**，因为组件会清空当前展开的 `openKeys`。
7. **如果要做手风琴侧栏**，在 `sl-nav-open-change` 里把 `openKeys` 限制为当前一级父菜单即可。
