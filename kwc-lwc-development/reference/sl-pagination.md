# Pagination 分页器

用于数据分页展示的控件，支持页码跳转和每页条数设置。

## 特性概览

- **双模式切换**：支持标准模式和简洁模式 (`simpleMode`)
- **页码跳转**：支持输入页码快速跳转（标准模式）
- **每页条数**：支持自定义每页显示条数选项
- **受控/非受控**：支持受控模式 (`currentPage`) 和非受控模式 (`defaultCurrentPage`)
- **禁用状态**：支持整体禁用交互
- **自定义样式**：丰富的 CSS 自定义属性

## 基础用法

最简单的分页器用法，使用默认配置。

```html
<template>
  <sl-pagination kwc:external class="pagination-el"></sl-pagination>
</template>
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';

export default class PaginationBasic extends KingdeeElement {}
```

## 设置总数据量

使用 `total` 属性设置总数据量，组件会自动计算总页数。

```html
<template>
  <sl-pagination kwc:external class="pagination-el" total="1000"></sl-pagination>
</template>
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';

export default class PaginationTotal extends KingdeeElement {}
```

## 设置每页条数

使用 `page-size` 属性设置每页显示的条数，默认为 20。

```html
<template>
  <sl-pagination kwc:external class="pagination-el" total="500" page-size="50"></sl-pagination>
</template>
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';

export default class PaginationPageSize extends KingdeeElement {}
```

## 自定义每页条数选项

使用 `page-size-opts` 属性（传入 JSON 数组字符串）自定义下拉菜单中的每页条数选项。

```html
<template>
  <sl-pagination 
    kwc:external 
    class="pagination-el" 
    total="1000" 
    page-size="25"
    page-size-opts="[25, 50, 100, 200]"
  ></sl-pagination>
</template>
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';

export default class PaginationPageSizeOpts extends KingdeeElement {}
```

## 设置默认页码

使用 `default-current-page` 属性设置默认显示的页码（非受控模式）。

```html
<template>
  <sl-pagination 
    kwc:external 
    class="pagination-el" 
    total="500" 
    default-current-page="5"
  ></sl-pagination>
</template>
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';

export default class PaginationDefaultPage extends KingdeeElement {}
```

## 受控模式

使用 `current-page` 属性进行受控模式，页码由外部状态管理。此模式下需要监听 `sl-page-change` 事件并更新 `current-page`。

```html
<template>
  <div class="pagination-demo">
    <p class="page-info">当前页码: <span class="current-page"></span></p>
    <sl-pagination 
      kwc:external 
      class="pagination-el" 
      total="500"
    ></sl-pagination>
  </div>
</template>
```
```css
.pagination-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
}
.page-info {
  font-size: var(--sl-font-size-small);
  color: var(--sl-color-neutral-600);
}
```
```javascript
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';

export default class PaginationControlled extends KingdeeElement {
  @track currentPage = 1;

  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindShoelaceEvents();
    this.updateDisplay();
  }

  get shoelaceEventBindings() {
    return [
      ['.pagination-el', 'sl-page-change', this.handlePageChange]
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

  handlePageChange(event) {
    this.currentPage = event.detail.pageNumber;
    // 更新分页器的 currentPage 属性
    const pagination = this.template.querySelector('.pagination-el');
    if (pagination) {
      pagination.currentPage = this.currentPage;
    }
    this.updateDisplay();
  }

  updateDisplay() {
    const span = this.template.querySelector('.current-page');
    if (span) {
      span.textContent = this.currentPage;
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

## 简洁模式

使用 `simple-mode` 属性启用简洁模式，只显示上一页/下一页按钮和每页条数选择器，不显示页码输入框和总页数信息。

```html
<template>
  <sl-pagination 
    kwc:external 
    class="pagination-el" 
    total="500" 
    simple-mode
  ></sl-pagination>
</template>
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';

export default class PaginationSimple extends KingdeeElement {}
```

## 禁用状态

使用 `disabled` 属性禁用分页器的所有交互。

```html
<template>
  <sl-pagination 
    kwc:external 
    class="pagination-el" 
    total="500" 
    disabled
  ></sl-pagination>
</template>
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';

export default class PaginationDisabled extends KingdeeElement {}
```

## 监听分页事件

通过监听 `sl-page-change` 事件获取页码变化和每页条数变化。事件的 `detail` 对象包含 `pageNumber`（当前页码）和 `pageSize`（每页条数）。

```html
<template>
  <div class="pagination-demo">
    <div class="event-info">
      <p>当前页码: <span class="page-number">1</span></p>
      <p>每页条数: <span class="page-size">20</span></p>
    </div>
    <sl-pagination 
      kwc:external 
      class="pagination-el" 
      total="1000"
    ></sl-pagination>
  </div>
</template>
```
```css
.pagination-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
}
.event-info {
  padding: var(--sl-spacing-small);
  background: var(--sl-color-neutral-100);
  border-radius: var(--sl-border-radius-medium);
}
.event-info p {
  margin: var(--sl-spacing-2x-small) 0;
  font-size: var(--sl-font-size-small);
}
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';

export default class PaginationEvent extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindShoelaceEvents();
  }

  get shoelaceEventBindings() {
    return [
      ['.pagination-el', 'sl-page-change', this.handlePageChange]
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

  handlePageChange(event) {
    const { pageNumber, pageSize } = event.detail;
    
    // 更新显示
    const pageNumberEl = this.template.querySelector('.page-number');
    const pageSizeEl = this.template.querySelector('.page-size');
    
    if (pageNumberEl) {
      pageNumberEl.textContent = pageNumber;
    }
    if (pageSizeEl) {
      pageSizeEl.textContent = pageSize;
    }

    // 在实际应用中，这里通常会触发数据请求
    console.log(`请求第 ${pageNumber} 页数据，每页 ${pageSize} 条`);
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

## 与表格配合使用

分页器通常与数据表格配合使用，以下是一个完整的示例。

```html
<template>
  <div class="table-with-pagination">
    <sl-table kwc:external class="data-table"></sl-table>
    <div class="pagination-wrapper">
      <sl-pagination 
        kwc:external 
        class="pagination-el"
      ></sl-pagination>
    </div>
  </div>
</template>
```
```css
.table-with-pagination {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
}
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: var(--sl-spacing-x-small) 0;
}
```
```javascript
import { KingdeeElement, track } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';
import '@kdcloudjs/shoelace/dist/components/table/table.js';

export default class TableWithPagination extends KingdeeElement {
  @track tableData = [];
  @track total = 0;
  @track currentPage = 1;
  @track pageSize = 20;

  connectedCallback() {
    super.connectedCallback();
    this.fetchData();
  }

  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindShoelaceEvents();
    this.updateTable();
    this.updatePagination();
  }

  get shoelaceEventBindings() {
    return [
      ['.pagination-el', 'sl-page-change', this.handlePageChange]
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

  async fetchData() {
    // 模拟 API 请求
    // const response = await fetch(`/api/data?page=${this.currentPage}&size=${this.pageSize}`);
    // const result = await response.json();
    
    // 模拟数据
    this.total = 256;
    this.tableData = this.generateMockData();
    
    this.updateTable();
    this.updatePagination();
  }

  generateMockData() {
    const start = (this.currentPage - 1) * this.pageSize;
    return Array.from({ length: this.pageSize }, (_, i) => ({
      id: start + i + 1,
      name: `Item ${start + i + 1}`,
      status: i % 2 === 0 ? 'Active' : 'Inactive'
    }));
  }

  handlePageChange(event) {
    const { pageNumber, pageSize } = event.detail;
    this.currentPage = pageNumber;
    this.pageSize = pageSize;
    this.fetchData();
  }

  updateTable() {
    const table = this.template.querySelector('.data-table');
    if (table) {
      table.columns = [
        { key: 'id', title: 'ID', width: 80 },
        { key: 'name', title: '名称', width: 200 },
        { key: 'status', title: '状态', width: 100 }
      ];
      table.data = this.tableData;
    }
  }

  updatePagination() {
    const pagination = this.template.querySelector('.pagination-el');
    if (pagination) {
      pagination.total = this.total;
      pagination.currentPage = this.currentPage;
      pagination.pageSize = this.pageSize;
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

## 自定义样式

使用 CSS 自定义属性调整分页器的外观。

```html
<template>
  <sl-pagination 
    kwc:external 
    class="custom-pagination" 
    total="500"
  ></sl-pagination>
</template>
```
```css
.custom-pagination {
  --sl-pagination-text-color: var(--sl-color-neutral-700);
  --sl-pagination-current-page-color: var(--sl-color-primary-600);
  --sl-pagination-font-size: var(--sl-font-size-small);
  --sl-pagination-icon-font-size: 18px;
  --sl-pagination-icon-font: var(--sl-color-neutral-600);
  --sl-pagination-icon-font-hover: var(--sl-color-primary-600);
  --sl-pagination-current-page-border-radius: 6px;
  --sl-pagination-current-page-sizing-width: 4rem;
}
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';

export default class PaginationCustomStyle extends KingdeeElement {}
```

## 动态更新分页器

通过 JavaScript 动态更新分页器的属性。

```html
<template>
  <div class="pagination-demo">
    <div class="controls">
      <sl-button kwc:external class="btn-set-page" size="small">跳转到第5页</sl-button>
      <sl-button kwc:external class="btn-set-size" size="small">设置每页50条</sl-button>
      <sl-button kwc:external class="btn-reset" size="small">重置</sl-button>
    </div>
    <sl-pagination 
      kwc:external 
      class="pagination-el" 
      total="500"
    ></sl-pagination>
  </div>
</template>
```
```css
.pagination-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sl-spacing-medium);
}
.controls {
  display: flex;
  gap: var(--sl-spacing-x-small);
}
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

export default class PaginationDynamic extends KingdeeElement {
  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;
    this.bindShoelaceEvents();
  }

  get shoelaceEventBindings() {
    return [
      ['.btn-set-page', 'click', this.handleSetPageClick],
      ['.btn-set-size', 'click', this.handleSetSizeClick],
      ['.btn-reset', 'click', this.handleResetClick]
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

  handleSetPageClick() {
    const pagination = this.template.querySelector('.pagination-el');
    if (pagination) {
      pagination.currentPage = 5;
    }
  }

  handleSetSizeClick() {
    const pagination = this.template.querySelector('.pagination-el');
    if (pagination) {
      pagination.pageSize = 50;
    }
  }

  handleResetClick() {
    const pagination = this.template.querySelector('.pagination-el');
    if (pagination) {
      pagination.currentPage = 1;
      pagination.pageSize = 20;
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

## Properties

| 属性                 | 描述                                     | 类型       | 默认值            |
| -------------------- | ---------------------------------------- | ---------- | ----------------- |
| current-page         | 当前页码（受控模式）                     | `number`   | -                 |
| default-current-page | 默认页码（非受控模式）                   | `number`   | `1`               |
| page-size            | 每页显示条数                             | `number`   | `20`              |
| page-size-opts       | 每页条数选项                             | `number[]` | `[10, 20, 50, 100]` |
| total                | 数据总条数                               | `number`   | `5000`            |
| disabled             | 是否禁用分页器                           | `boolean`  | `false`           |
| simple-mode          | 是否使用简洁模式（隐藏页码输入和总页数） | `boolean`  | `false`           |
| class-name           | 自定义 CSS 类名                          | `string`   | `''`              |

## Events

| 事件名称       | 描述                       | 事件详情                                        |
| -------------- | -------------------------- | ----------------------------------------------- |
| sl-page-change | 页码或每页条数变化时触发   | `{ pageNumber: number, pageSize: number }`      |

### 事件监听示例

**重要**：在 KWC LWC 中，Shoelace 的自定义事件（如 `sl-page-change`）**必须**在 JavaScript 的 `renderedCallback` 中绑定，**禁止**在 HTML 模板中使用 `onsl-page-change` 这样的写法。

```javascript
// 正确方式：在 renderedCallback 中绑定事件
renderedCallback() {
  if (this._eventsBound) return;
  this._eventsBound = true;
  this.bindShoelaceEvents();
}

get shoelaceEventBindings() {
  return [
    ['.pagination-el', 'sl-page-change', this.handlePageChange]
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

handlePageChange(event) {
  const { pageNumber, pageSize } = event.detail;
  console.log('当前页:', pageNumber);
  console.log('每页条数:', pageSize);
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
```

## CSS Custom Properties

| CSS 属性                                      | 描述                   | 默认值                                 |
| --------------------------------------------- | ---------------------- | -------------------------------------- |
| --sl-pagination-text-color                    | 文字颜色               | `var(--sl-color-neutral-600)`          |
| --sl-pagination-current-page-color            | 当前页码颜色           | `var(--sl-color-neutral-900)`          |
| --sl-pagination-font-size                     | 字体大小               | `var(--sl-font-size-small)`            |
| --sl-pagination-current-page-border-width     | 页码输入框边框宽度     | `var(--sl-input-border-width)`         |
| --sl-pagination-current-page-border-radius    | 页码输入框圆角         | `var(--sl-input-border-radius-small)`  |
| --sl-pagination-current-page-sizing-width     | 页码输入框宽度         | `3rem`                                 |
| --sl-pagination-current-page-background       | 页码输入框背景色       | `var(--sl-input-background-color)`     |
| --sl-pagination-current-page-background-disabled | 禁用时背景色        | `var(--sl-input-background-color-disabled)` |
| --sl-pagination-current-page-border           | 页码输入框边框颜色     | `var(--sl-input-border-color)`         |
| --sl-pagination-current-page-border-hover     | 悬停时边框颜色         | `var(--sl-input-border-color-focus)`   |
| --sl-pagination-current-page-border-active    | 激活时边框颜色         | `var(--sl-input-border-color-focus)`   |
| --sl-pagination-icon-font-size                | 图标大小               | `1rem`                                 |
| --sl-pagination-icon-font                     | 图标颜色               | `var(--sl-color-neutral-600)`          |
| --sl-pagination-icon-font-hover               | 悬停时图标颜色         | `var(--sl-color-primary-600)`          |
| --sl-pagination-icon-font-disabled            | 禁用时图标颜色         | `var(--sl-color-neutral-400)`          |

## 内部状态

| 状态      | 描述                                       | 类型     |
| --------- | ------------------------------------------ | -------- |
| totalPage | 总页数（根据 total 和 pageSize 自动计算）  | `number` |

## 最佳实践

### 1. 正确导入组件

```javascript
import '@kdcloudjs/shoelace/dist/components/pagination/pagination.js';
```

### 2. 添加 kwc:external 属性

在 HTML 模板中使用时，**必须**添加 `kwc:external` 属性：

```html
<sl-pagination kwc:external class="my-pagination"></sl-pagination>
```

### 3. 使用 class 而非 id 选择器

```html
<!-- 正确 -->
<sl-pagination kwc:external class="pagination-el"></sl-pagination>

<!-- 错误 -->
<sl-pagination kwc:external id="pagination-el"></sl-pagination>
```

### 4. 在 renderedCallback 中绑定事件

```javascript
renderedCallback() {
  if (this._eventsBound) return;
  this._eventsBound = true;
  this.bindShoelaceEvents();
}

get shoelaceEventBindings() {
  return [
    ['.pagination-el', 'sl-page-change', this.handlePageChange]
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

### 6. 受控模式 vs 非受控模式

- **非受控模式**：使用 `default-current-page`，组件内部管理状态
- **受控模式**：使用 `current-page`，需要在事件回调中手动更新该属性

```javascript
// 受控模式示例
handlePageChange(event) {
  const pagination = this.template.querySelector('.pagination-el');
  if (pagination) {
    pagination.currentPage = event.detail.pageNumber;
  }
  // 触发数据刷新...
}
```

## 常见问题

### Q: 为什么页码切换后没有触发事件？

A: 请确保在 `renderedCallback` 中正确绑定了 `sl-page-change` 事件，并且添加了防重复绑定的检查 (`if (this._eventsBound) return`)。

### Q: 如何在简洁模式下显示当前页码？

A: 简洁模式不显示页码输入框，如需显示当前页码，可以监听 `sl-page-change` 事件并在自定义元素中显示。

### Q: 如何动态更新总数据量？

A: 直接设置 `pagination.total = newTotal`，组件会自动重新计算总页数。如果当前页码超出新的总页数，会自动调整到最后一页。