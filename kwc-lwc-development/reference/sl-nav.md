# Nav 导航组件 Skill

## 组件概述

`sl-nav` 现在以 **Ant Design Menu API 兼容** 为主线，核心状态从旧版 `value` 切换到了 `key / selectedKeys / openKeys`。核心标签包括：

- `sl-nav`
- `sl-nav-item`
- `sl-nav-group`
- `sl-nav-submenu`

## 功能列表

| 功能 | 说明 |
|------|------|
| Antd 兼容 API | 支持 `items`、`selectedKeys`、`defaultSelectedKeys`、`openKeys`、`defaultOpenKeys` |
| 三种模式 | `inline`、`vertical`、`horizontal` |
| 折叠菜单 | `inlineCollapsed` |
| 子菜单交互 | `triggerSubMenuAction`、`subMenuOpenDelay`、`subMenuCloseDelay` |
| 多选与禁选 | `multiple`、`selectable` |
| 数据驱动渲染 | `items` API |

## 核心约束

### 必须遵守的规则

1. **所有 Shoelace 标签必须加 `kwc:external`**
   ```html
   <sl-nav kwc:external></sl-nav>
   <sl-nav-item kwc:external></sl-nav-item>
   <sl-nav-group kwc:external></sl-nav-group>
   <sl-nav-submenu kwc:external></sl-nav-submenu>
   ```

2. **必须导入所有实际使用的组件定义**
   ```js
   import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
   import '@kdcloudjs/shoelace/dist/components/nav/nav.js';
   import '@kdcloudjs/shoelace/dist/components/nav-item/nav-item.js';
   import '@kdcloudjs/shoelace/dist/components/nav-group/nav-group.js';
   import '@kdcloudjs/shoelace/dist/components/nav-submenu/nav-submenu.js';
   ```

3. **LWC 中复杂属性不能直接靠 HTML 传**
   - `items`、`selectedKeys`、`openKeys`、`defaultSelectedKeys`、`defaultOpenKeys`
   - `popupOffset`
   - `onClick`、`onSelect`、`onDeselect`、`onOpenChange`
   - 这些都应在 JS 中拿到元素实例后直接赋值

4. **事件读取方式已变更**
   - `sl-change`：使用 `event.detail.selectedKeys`
   - `sl-nav-open-change`：使用 `event.detail.openKeys`
   - `sl-nav-select`：使用 `event.detail.item`
   - 不要继续按旧版 `event.target.value` 读取

5. **状态体系已经改为 `key`**
   - `sl-nav-item` / `sl-nav-submenu` 使用 `key`
   - `itemKey` 是 React 包装层的兼容别名，LWC 中继续使用 `key`
   - 选中状态走 `selectedKeys`
   - 展开状态走 `openKeys`
   - `inlineCollapsed` 或 `mode` 切换时，组件会主动清空当前展开的 submenu

6. **`sl-nav-group` 标题不能写成属性**
   - 模板结构用 `<span slot="title">基础设置</span>`
   - `items` API 下用 `label`

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

**index.html**
```html
<template>
    <sl-nav kwc:external class="nav-el">
        <sl-nav-item kwc:external key="home">
            <sl-icon kwc:external slot="prefix" name="house"></sl-icon>
            首页
        </sl-nav-item>
        <sl-nav-item kwc:external key="profile">
            <sl-icon kwc:external slot="prefix" name="person"></sl-icon>
            个人中心
        </sl-nav-item>
    </sl-nav>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
import '@kdcloudjs/shoelace/dist/components/nav/nav.js';
import '@kdcloudjs/shoelace/dist/components/nav-item/nav-item.js';

export default class BasicNav extends KingdeeElement {
    renderedCallback() {
        if (this._initialized) return;
        this._initialized = true;

        const nav = this.template.querySelector('.nav-el');
        if (!nav) return;

        nav.defaultSelectedKeys = ['home'];
        nav.addEventListener('sl-change', this.handleChange.bind(this));
    }

    handleChange(event) {
        console.log('当前选中 keys:', event.detail.selectedKeys);
    }
}
```

### 受控侧边导航示例

**index.html**
```html
<template>
    <sl-nav kwc:external class="sidebar-nav" mode="inline" style="max-width: 256px;">
        <sl-nav-submenu kwc:external key="system" title="系统设置">
            <sl-icon kwc:external slot="prefix" name="gear"></sl-icon>
            <sl-nav-group kwc:external>
                <span slot="title">基础设置</span>
                <sl-nav-item kwc:external key="profile">个人资料</sl-nav-item>
                <sl-nav-item kwc:external key="security">安全设置</sl-nav-item>
            </sl-nav-group>
        </sl-nav-submenu>
    </sl-nav>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
import '@kdcloudjs/shoelace/dist/components/nav/nav.js';
import '@kdcloudjs/shoelace/dist/components/nav-item/nav-item.js';
import '@kdcloudjs/shoelace/dist/components/nav-group/nav-group.js';
import '@kdcloudjs/shoelace/dist/components/nav-submenu/nav-submenu.js';

export default class SidebarNav extends KingdeeElement {
    selectedKeys = ['security'];
    openKeys = ['system'];

    renderedCallback() {
        if (this._initialized) return;
        this._initialized = true;

        const nav = this.template.querySelector('.sidebar-nav');
        if (!nav) return;

        nav.selectedKeys = [...this.selectedKeys];
        nav.openKeys = [...this.openKeys];

        nav.addEventListener('sl-change', this.handleChange.bind(this));
        nav.addEventListener('sl-nav-open-change', this.handleOpenChange.bind(this));
    }

    handleChange(event) {
        this.selectedKeys = [...event.detail.selectedKeys];
        const nav = this.template.querySelector('.sidebar-nav');
        if (nav) {
            nav.selectedKeys = [...this.selectedKeys];
        }
    }

    handleOpenChange(event) {
        this.openKeys = [...event.detail.openKeys];
        const nav = this.template.querySelector('.sidebar-nav');
        if (nav) {
            nav.openKeys = [...this.openKeys];
        }
    }
}
```

### `items` API 示例

**index.html**
```html
<template>
    <sl-nav kwc:external class="nav-el" mode="inline" style="max-width: 256px;"></sl-nav>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/nav/nav.js';

export default class DataDrivenNav extends KingdeeElement {
    renderedCallback() {
        if (this._initialized) return;
        this._initialized = true;

        const nav = this.template.querySelector('.nav-el');
        if (!nav) return;

        nav.items = [
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

        nav.selectedKeys = ['logs'];
        nav.openKeys = ['system'];
        nav.onOpenChange = (keys) => {
            nav.openKeys = [...keys];
        };
    }
}
```

### 只展开当前父级菜单示例

**index.html**
```html
<template>
    <sl-nav kwc:external class="accordion-nav" mode="inline" style="max-width: 256px;">
        <sl-nav-submenu kwc:external key="system" title="系统设置">
            <sl-nav-item kwc:external key="profile">个人资料</sl-nav-item>
            <sl-nav-item kwc:external key="security">安全设置</sl-nav-item>
        </sl-nav-submenu>

        <sl-nav-submenu kwc:external key="workspace" title="工作台">
            <sl-nav-item kwc:external key="todo">待办任务</sl-nav-item>
            <sl-nav-item kwc:external key="report">报表中心</sl-nav-item>
        </sl-nav-submenu>
    </sl-nav>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/nav/nav.js';
import '@kdcloudjs/shoelace/dist/components/nav-item/nav-item.js';
import '@kdcloudjs/shoelace/dist/components/nav-submenu/nav-submenu.js';

export default class AccordionNav extends KingdeeElement {
    rootSubmenuKeys = ['system', 'workspace'];
    selectedKeys = ['security'];
    openKeys = ['system'];

    renderedCallback() {
        if (this._initialized) return;
        this._initialized = true;

        const nav = this.template.querySelector('.accordion-nav');
        if (!nav) return;

        nav.selectedKeys = [...this.selectedKeys];
        nav.openKeys = [...this.openKeys];
        nav.addEventListener('sl-change', this.handleChange.bind(this));
        nav.addEventListener('sl-nav-open-change', this.handleOpenChange.bind(this));
    }

    handleChange(event) {
        this.selectedKeys = [...event.detail.selectedKeys];
        const nav = this.template.querySelector('.accordion-nav');
        if (nav) {
            nav.selectedKeys = [...this.selectedKeys];
        }
    }

    handleOpenChange(event) {
        const nextOpenKeys = [...event.detail.openKeys];
        const latestRootKey = nextOpenKeys.find(key => !this.openKeys.includes(key));

        this.openKeys = !latestRootKey
            ? nextOpenKeys
            : this.rootSubmenuKeys.includes(latestRootKey)
                ? [latestRootKey]
                : nextOpenKeys;

        const nav = this.template.querySelector('.accordion-nav');
        if (nav) {
            nav.openKeys = [...this.openKeys];
        }
    }
}
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
| `title` | 提示文案 | `string` | `''` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `active` | 是否激活 | `boolean` | `false` |
| `collapsed` | 是否处于折叠侧栏状态，由父级 nav 同步 | `boolean` | `false` |
| `href` | 跳转链接 | `string` | `''` |

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

### 回调属性

| 属性 | 说明 |
|------|------|
| `onClick` | 点击菜单项时触发 |
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

1. **LWC 遇到数组、对象、函数属性，一律在 JS 中设置到元素实例上。**
2. **业务菜单 key 建议直接复用路由 name 或权限编码。**
3. **折叠侧栏优先走 `mode="inline" + inlineCollapsed`。**
4. **需要受控状态时，监听 `sl-change` 与 `sl-nav-open-change` 后回写组件实例。**
5. **动态菜单和权限菜单优先使用 `items` API，不要在 HTML 模板里硬拼复杂层级。**
6. **切换 `inlineCollapsed` 或 `mode` 后，要把外部维护的 `openKeys` 一并清空重设。**
7. **如果要做手风琴侧栏**，在 `sl-nav-open-change` 里把 `openKeys` 限制为当前一级父菜单即可。
