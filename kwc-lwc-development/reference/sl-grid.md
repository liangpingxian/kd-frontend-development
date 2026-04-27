# Grid 栅格布局

基于 24 栅格系统的布局组件，包含 `sl-row`（行）和 `sl-col`（列）两个组件，用于创建灵活的响应式布局。

## 特性概览

- **24 栅格系统**：将页面划分为 24 等份，通过 `span` 属性控制列宽
- **响应式布局**：支持 `xs`、`sm`、`md`、`lg`、`xl`、`xxl` 六个断点
- **灵活间距**：通过 `gutter` 属性设置水平和垂直间距
- **对齐方式**：支持水平对齐（`justify`）和垂直对齐（`align`）
- **列偏移**：通过 `offset`、`push`、`pull` 控制列的位置
- **Flex 布局**：支持 `flex` 属性实现弹性布局

## 基础用法

最简单的栅格布局，使用 `sl-row` 包裹 `sl-col`，通过 `span` 属性指定列宽。

```html
<template>
  <sl-row kwc:external class="demo-row">
    <sl-col kwc:external class="demo-col" span="12">
      <div class="grid-content bg-blue">col-12</div>
    </sl-col>
    <sl-col kwc:external class="demo-col" span="12">
      <div class="grid-content bg-green">col-12</div>
    </sl-col>
  </sl-row>
</template>
```
```css
.grid-content {
  padding: 16px;
  text-align: center;
  color: white;
  border-radius: 4px;
}
.bg-blue { background: #0092ff; }
.bg-green { background: #00a854; }
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/row/row.js';
import '@kdcloudjs/shoelace/dist/components/col/col.js';

export default class GridBasic extends KingdeeElement {}
```

## 栅格比例

24 栅格系统支持任意比例的列宽组合。

```html
<template>
  <div class="grid-demo">
    <sl-row kwc:external class="demo-row">
      <sl-col kwc:external span="24"><div class="grid-content bg-blue">col-24</div></sl-col>
    </sl-row>
    <sl-row kwc:external class="demo-row">
      <sl-col kwc:external span="12"><div class="grid-content bg-blue">col-12</div></sl-col>
      <sl-col kwc:external span="12"><div class="grid-content bg-green">col-12</div></sl-col>
    </sl-row>
    <sl-row kwc:external class="demo-row">
      <sl-col kwc:external span="8"><div class="grid-content bg-blue">col-8</div></sl-col>
      <sl-col kwc:external span="8"><div class="grid-content bg-green">col-8</div></sl-col>
      <sl-col kwc:external span="8"><div class="grid-content bg-blue">col-8</div></sl-col>
    </sl-row>
    <sl-row kwc:external class="demo-row">
      <sl-col kwc:external span="6"><div class="grid-content bg-blue">col-6</div></sl-col>
      <sl-col kwc:external span="6"><div class="grid-content bg-green">col-6</div></sl-col>
      <sl-col kwc:external span="6"><div class="grid-content bg-blue">col-6</div></sl-col>
      <sl-col kwc:external span="6"><div class="grid-content bg-green">col-6</div></sl-col>
    </sl-row>
  </div>
</template>
```
```css
.grid-demo { display: flex; flex-direction: column; gap: 16px; }
.grid-content { padding: 16px; text-align: center; color: white; border-radius: 4px; }
.bg-blue { background: #0092ff; }
.bg-green { background: #00a854; }
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/row/row.js';
import '@kdcloudjs/shoelace/dist/components/col/col.js';

export default class GridRatio extends KingdeeElement {}
```

## 区块间隔（Gutter）

使用 `gutter` 属性设置列之间的间距。可以是数字（水平间距）或数组 `[水平, 垂直]`。

```html
<template>
  <sl-row kwc:external class="gutter-row" gutter="16">
    <sl-col kwc:external span="6"><div class="grid-content bg-blue">col-6</div></sl-col>
    <sl-col kwc:external span="6"><div class="grid-content bg-blue">col-6</div></sl-col>
    <sl-col kwc:external span="6"><div class="grid-content bg-blue">col-6</div></sl-col>
    <sl-col kwc:external span="6"><div class="grid-content bg-blue">col-6</div></sl-col>
  </sl-row>
</template>
```
```css
.grid-content { padding: 16px; text-align: center; color: white; border-radius: 4px; }
.bg-blue { background: #0092ff; }
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/row/row.js';
import '@kdcloudjs/shoelace/dist/components/col/col.js';

export default class GridGutter extends KingdeeElement {}
```

## 垂直间隔

使用数组格式 `[水平间距, 垂直间距]` 同时设置水平和垂直间距。

```html
<template>
  <sl-row kwc:external class="gutter-row">
    <sl-col kwc:external span="6"><div class="grid-content bg-blue">col-6</div></sl-col>
    <sl-col kwc:external span="6"><div class="grid-content bg-blue">col-6</div></sl-col>
    <sl-col kwc:external span="6"><div class="grid-content bg-blue">col-6</div></sl-col>
    <sl-col kwc:external span="6"><div class="grid-content bg-blue">col-6</div></sl-col>
    <sl-col kwc:external span="6"><div class="grid-content bg-blue">col-6</div></sl-col>
    <sl-col kwc:external span="6"><div class="grid-content bg-blue">col-6</div></sl-col>
    <sl-col kwc:external span="6"><div class="grid-content bg-blue">col-6</div></sl-col>
    <sl-col kwc:external span="6"><div class="grid-content bg-blue">col-6</div></sl-col>
  </sl-row>
</template>
```
```css
.grid-content { padding: 16px; text-align: center; color: white; border-radius: 4px; }
.bg-blue { background: #0092ff; }
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/row/row.js';
import '@kdcloudjs/shoelace/dist/components/col/col.js';

export default class GridVerticalGutter extends KingdeeElement {
  renderedCallback() {
    if (this._rendered) return;
    this._rendered = true;
    const row = this.template.querySelector('.gutter-row');
    if (row) {
      row.gutter = [16, 24];
    }
  }
}
```

## 列偏移（Offset）

使用 `offset` 属性将列向右偏移指定的栅格数。

```html
<template>
  <div class="grid-demo">
    <sl-row kwc:external>
      <sl-col kwc:external span="8"><div class="grid-content bg-blue">col-8</div></sl-col>
      <sl-col kwc:external span="8" offset="8"><div class="grid-content bg-blue">col-8 offset-8</div></sl-col>
    </sl-row>
    <sl-row kwc:external>
      <sl-col kwc:external span="6" offset="6"><div class="grid-content bg-blue">col-6 offset-6</div></sl-col>
      <sl-col kwc:external span="6" offset="6"><div class="grid-content bg-blue">col-6 offset-6</div></sl-col>
    </sl-row>
  </div>
</template>
```
```css
.grid-demo { display: flex; flex-direction: column; gap: 16px; }
.grid-content { padding: 16px; text-align: center; color: white; border-radius: 4px; }
.bg-blue { background: #0092ff; }
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/row/row.js';
import '@kdcloudjs/shoelace/dist/components/col/col.js';

export default class GridOffset extends KingdeeElement {}
```


## 水平对齐

使用 `justify` 属性设置列的水平对齐方式。

```html
<template>
  <div class="grid-demo">
    <p>start</p>
    <sl-row kwc:external justify="start" style="background: rgba(128,128,128,0.08);">
      <sl-col kwc:external span="4"><div class="grid-content bg-blue">col-4</div></sl-col>
      <sl-col kwc:external span="4"><div class="grid-content bg-green">col-4</div></sl-col>
      <sl-col kwc:external span="4"><div class="grid-content bg-blue">col-4</div></sl-col>
    </sl-row>
    <p>center</p>
    <sl-row kwc:external justify="center" style="background: rgba(128,128,128,0.08);">
      <sl-col kwc:external span="4"><div class="grid-content bg-blue">col-4</div></sl-col>
      <sl-col kwc:external span="4"><div class="grid-content bg-green">col-4</div></sl-col>
      <sl-col kwc:external span="4"><div class="grid-content bg-blue">col-4</div></sl-col>
    </sl-row>
    <p>end</p>
    <sl-row kwc:external justify="end" style="background: rgba(128,128,128,0.08);">
      <sl-col kwc:external span="4"><div class="grid-content bg-blue">col-4</div></sl-col>
      <sl-col kwc:external span="4"><div class="grid-content bg-green">col-4</div></sl-col>
      <sl-col kwc:external span="4"><div class="grid-content bg-blue">col-4</div></sl-col>
    </sl-row>
    <p>space-between</p>
    <sl-row kwc:external justify="space-between" style="background: rgba(128,128,128,0.08);">
      <sl-col kwc:external span="4"><div class="grid-content bg-blue">col-4</div></sl-col>
      <sl-col kwc:external span="4"><div class="grid-content bg-green">col-4</div></sl-col>
      <sl-col kwc:external span="4"><div class="grid-content bg-blue">col-4</div></sl-col>
    </sl-row>
  </div>
</template>
```
```css
.grid-demo { display: flex; flex-direction: column; gap: 8px; }
.grid-content { padding: 16px; text-align: center; color: white; border-radius: 4px; }
.bg-blue { background: #0092ff; }
.bg-green { background: #00a854; }
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/row/row.js';
import '@kdcloudjs/shoelace/dist/components/col/col.js';

export default class GridJustify extends KingdeeElement {}
```

## 垂直对齐

使用 `align` 属性设置列的垂直对齐方式。

```html
<template>
  <div class="grid-demo">
    <p>top</p>
    <sl-row kwc:external justify="center" align="top" style="background: rgba(128,128,128,0.08);">
      <sl-col kwc:external span="4"><div class="grid-content bg-blue" style="padding: 40px 16px;">col-4</div></sl-col>
      <sl-col kwc:external span="4"><div class="grid-content bg-green" style="padding: 60px 16px;">col-4</div></sl-col>
      <sl-col kwc:external span="4"><div class="grid-content bg-blue" style="padding: 30px 16px;">col-4</div></sl-col>
    </sl-row>
    <p>middle</p>
    <sl-row kwc:external justify="center" align="middle" style="background: rgba(128,128,128,0.08);">
      <sl-col kwc:external span="4"><div class="grid-content bg-blue" style="padding: 40px 16px;">col-4</div></sl-col>
      <sl-col kwc:external span="4"><div class="grid-content bg-green" style="padding: 60px 16px;">col-4</div></sl-col>
      <sl-col kwc:external span="4"><div class="grid-content bg-blue" style="padding: 30px 16px;">col-4</div></sl-col>
    </sl-row>
    <p>bottom</p>
    <sl-row kwc:external justify="center" align="bottom" style="background: rgba(128,128,128,0.08);">
      <sl-col kwc:external span="4"><div class="grid-content bg-blue" style="padding: 40px 16px;">col-4</div></sl-col>
      <sl-col kwc:external span="4"><div class="grid-content bg-green" style="padding: 60px 16px;">col-4</div></sl-col>
      <sl-col kwc:external span="4"><div class="grid-content bg-blue" style="padding: 30px 16px;">col-4</div></sl-col>
    </sl-row>
  </div>
</template>
```
```css
.grid-demo { display: flex; flex-direction: column; gap: 8px; }
.grid-content { text-align: center; color: white; border-radius: 4px; }
.bg-blue { background: #0092ff; }
.bg-green { background: #00a854; }
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/row/row.js';
import '@kdcloudjs/shoelace/dist/components/col/col.js';

export default class GridAlign extends KingdeeElement {}
```

## 列排序（Order）

使用 `order` 属性改变列的显示顺序。

```html
<template>
  <sl-row kwc:external>
    <sl-col kwc:external span="6" order="4"><div class="grid-content bg-blue">1 order-4</div></sl-col>
    <sl-col kwc:external span="6" order="3"><div class="grid-content bg-green">2 order-3</div></sl-col>
    <sl-col kwc:external span="6" order="2"><div class="grid-content bg-blue">3 order-2</div></sl-col>
    <sl-col kwc:external span="6" order="1"><div class="grid-content bg-green">4 order-1</div></sl-col>
  </sl-row>
</template>
```
```css
.grid-content { padding: 16px; text-align: center; color: white; border-radius: 4px; }
.bg-blue { background: #0092ff; }
.bg-green { background: #00a854; }
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/row/row.js';
import '@kdcloudjs/shoelace/dist/components/col/col.js';

export default class GridOrder extends KingdeeElement {}
```

## Flex 弹性布局

使用 `flex` 属性实现弹性布局。

```html
<template>
  <div class="grid-demo">
    <sl-row kwc:external>
      <sl-col kwc:external flex="100px"><div class="grid-content bg-blue">100px</div></sl-col>
      <sl-col kwc:external flex="auto"><div class="grid-content bg-green">auto</div></sl-col>
    </sl-row>
    <sl-row kwc:external>
      <sl-col kwc:external flex="1"><div class="grid-content bg-blue">1</div></sl-col>
      <sl-col kwc:external flex="2"><div class="grid-content bg-green">2</div></sl-col>
      <sl-col kwc:external flex="1"><div class="grid-content bg-blue">1</div></sl-col>
    </sl-row>
  </div>
</template>
```
```css
.grid-demo { display: flex; flex-direction: column; gap: 16px; }
.grid-content { padding: 16px; text-align: center; color: white; border-radius: 4px; }
.bg-blue { background: #0092ff; }
.bg-green { background: #00a854; }
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/row/row.js';
import '@kdcloudjs/shoelace/dist/components/col/col.js';

export default class GridFlex extends KingdeeElement {}
```

## 响应式布局

使用 `xs`、`sm`、`md`、`lg`、`xl`、`xxl` 属性实现响应式布局。

断点说明：
- `xs`: < 576px
- `sm`: ≥ 576px
- `md`: ≥ 768px
- `lg`: ≥ 992px
- `xl`: ≥ 1200px
- `xxl`: ≥ 1600px

```html
<template>
  <sl-row kwc:external>
    <sl-col kwc:external xs="24" sm="12" md="8" lg="6"><div class="grid-content bg-blue">Col</div></sl-col>
    <sl-col kwc:external xs="24" sm="12" md="8" lg="6"><div class="grid-content bg-green">Col</div></sl-col>
    <sl-col kwc:external xs="24" sm="12" md="8" lg="6"><div class="grid-content bg-blue">Col</div></sl-col>
    <sl-col kwc:external xs="24" sm="12" md="8" lg="6"><div class="grid-content bg-green">Col</div></sl-col>
  </sl-row>
</template>
```
```css
.grid-content { padding: 16px; text-align: center; color: white; border-radius: 4px; }
.bg-blue { background: #0092ff; }
.bg-green { background: #00a854; }
```
```javascript
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/row/row.js';
import '@kdcloudjs/shoelace/dist/components/col/col.js';

export default class GridResponsive extends KingdeeElement {}
```

## Row Properties

| 属性    | 描述                                                                 | 类型                                                                           | 默认值    |
| ------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------ | --------- |
| gutter  | 栅格间隔，可以是数字或数组 `[水平间距, 垂直间距]`，支持响应式对象    | `number \| [number, number] \| object`                                         | `0`       |
| justify | 水平排列方式                                                         | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` |
| align   | 垂直对齐方式                                                         | `'top' \| 'middle' \| 'bottom' \| 'stretch'`                                   | `'top'`   |
| wrap    | 是否自动换行                                                         | `boolean`                                                                      | `true`    |

## Col Properties

| 属性   | 描述                                                       | 类型                        | 默认值      |
| ------ | ---------------------------------------------------------- | --------------------------- | ----------- |
| span   | 栅格占位格数（0-24）                                       | `number`                    | -           |
| offset | 栅格左侧偏移格数                                           | `number`                    | `0`         |
| order  | 栅格顺序                                                   | `number`                    | `0`         |
| push   | 栅格向右移动格数                                           | `number`                    | `0`         |
| pull   | 栅格向左移动格数                                           | `number`                    | `0`         |
| flex   | flex 布局属性                                              | `string \| number`          | -           |
| xs     | `< 576px` 响应式栅格，可为数字或包含其他属性的对象         | `number \| object`          | -           |
| sm     | `≥ 576px` 响应式栅格                                       | `number \| object`          | -           |
| md     | `≥ 768px` 响应式栅格                                       | `number \| object`          | -           |
| lg     | `≥ 992px` 响应式栅格                                       | `number \| object`          | -           |
| xl     | `≥ 1200px` 响应式栅格                                      | `number \| object`          | -           |
| xxl    | `≥ 1600px` 响应式栅格                                      | `number \| object`          | -           |

## 最佳实践

### 1. 正确导入组件

```javascript
import '@kdcloudjs/shoelace/dist/components/row/row.js';
import '@kdcloudjs/shoelace/dist/components/col/col.js';
```

### 2. 添加 kwc:external 属性

在 HTML 模板中使用时，**必须**添加 `kwc:external` 属性：

```html
<!-- 正确 -->
<sl-row kwc:external>
  <sl-col kwc:external span="12"></sl-col>
</sl-row>

<!-- 错误：缺少 kwc:external -->
<sl-row>
  <sl-col span="12"></sl-col>
</sl-row>
```

### 3. 使用 class 而非 id 选择器

```html
<!-- 正确 -->
<sl-row kwc:external class="my-row"></sl-row>

<!-- 错误 -->
<sl-row kwc:external id="my-row"></sl-row>
```

### 4. 禁止在 HTML 模板中使用自闭合标签

```html
<!-- 正确 -->
<sl-col kwc:external span="12"></sl-col>

<!-- 错误：自闭合标签 -->
<sl-col kwc:external span="12" />
```

### 5. 动态设置 gutter 数组

由于 LWC 模板不支持直接传递数组，需要在 JavaScript 中设置：

```javascript
renderedCallback() {
  if (this._rendered) return;
  this._rendered = true;
  const row = this.template.querySelector('.my-row');
  if (row) {
    row.gutter = [16, 24]; // [水平间距, 垂直间距]
  }
}
```

## 常见问题

### Q: 为什么列没有按预期宽度显示？

A: 确保 `span` 属性值正确（0-24），且所有列的 `span` 之和不超过 24。如果超过 24，多余的列会换行显示。

### Q: 如何实现响应式布局？

A: 使用 `xs`、`sm`、`md`、`lg`、`xl`、`xxl` 属性，可以传入数字或对象：
```html
<sl-col kwc:external xs="24" sm="12" md="8" lg="6"></sl-col>
```

### Q: gutter 间距没有生效？

A: 确保 `gutter` 属性设置在 `sl-row` 上，而不是 `sl-col` 上。如果需要设置数组格式的 gutter，需要在 JavaScript 中设置。
