# Cascader 级联选择

允许用户从一组层级选项中进行级联选择，适用于省市区、组织架构、分类目录等场景。

## 特性概览

- **级联选择**：从层级数据中逐级选择，支持多层级
- **多选模式**：支持多选（`multiple`），选中项以标签形式展示
- **展开触发**：支持点击或鼠标悬浮展开子级（`expand-trigger`）
- **选择即改变**：支持选中非叶子节点即改变值（`change-on-select`）
- **路径显示**：支持显示完整路径或仅显示最后一级（`show-full-path`）
- **自定义字段**：支持自定义数据字段名（`fieldNames`）
- **自定义分隔符**：支持自定义路径分隔符（`separator`）
- **表单集成**：支持 `name`、`required`、`form` 属性参与表单提交和验证
- **丰富插槽**：支持前缀/后缀图标、自定义清除图标、自定义展开图标等
- **外观变体**：支持 `variant`（outlined/borderless/filled/underlined）和 `size` 等外观属性
- **搜索过滤**：支持搜索过滤选项（`showSearch`），可自定义过滤、排序和数量限制
- **异步加载**：支持数据懒加载（`loadData`）
- **自定义渲染**：支持自定义选项渲染（`optionRender`）和显示渲染（`displayRender`）
- **标签控制**：多选模式支持最大标签数（`max-tag-count`）和标签文本长度限制（`max-tag-text-length`）
- **验证状态**：支持 `status` 属性设置 error/warning 状态
- **选中策略**：多选模式支持 `show-checked-strategy` 控制显示父节点或子节点
- **面板禁用**：支持禁用面板选项交互（`panel-disabled`），面板可正常打开但选项不可点击

## CascaderOption 数据结构

`options` 中每个选项的数据结构如下：

| 属性       | 说明                   | 类型               | 默认值  |
| ---------- | ---------------------- | ------------------ | ------- |
| `value`    | 选项值，唯一标识       | `string`           | -       |
| `label`    | 选项标签，显示文本     | `string`           | -       |
| `disabled` | 是否禁用               | `boolean`          | `false` |
| `children` | 子选项数组             | `CascaderOption[]` | -       |
| `isLeaf`   | 是否为叶子节点         | `boolean`          | -       |
| `loading`  | 是否正在加载子节点     | `boolean`          | -       |

## FieldNames 自定义字段

可通过 `fieldNames` 自定义数据中的字段名映射：

| 属性       | 说明               | 类型     | 默认值       |
| ---------- | ------------------ | -------- | ------------ |
| `label`    | 标签字段名         | `string` | `'label'`    |
| `value`    | 值字段名           | `string` | `'value'`    |
| `children` | 子选项字段名       | `string` | `'children'` |

## 基础用法

最简单的用法，从层级数据中逐级选择。

```html
<template>
  <sl-cascader :options.prop="options" placeholder="请选择" style="width: 300px"></sl-cascader>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/cascader/cascader.js';

  const options = ref([
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          children: [
            { value: 'xihu', label: '西湖区' },
            { value: 'binjiang', label: '滨江区' }
          ]
        },
        {
          value: 'ningbo',
          label: '宁波',
          children: [
            { value: 'haishu', label: '海曙区' }
          ]
        }
      ]
    },
    {
      value: 'jiangsu',
      label: '江苏',
      children: [
        {
          value: 'nanjing',
          label: '南京',
          children: [
            { value: 'xuanwu', label: '玄武区' },
            { value: 'jianye', label: '建邺区' }
          ]
        }
      ]
    }
  ]);
</script>
```

## 多选模式

设置 `multiple` 属性启用多选模式，选中的路径以标签形式展示。

```html
<template>
  <sl-cascader
    :options.prop="options"
    placeholder="请选择"
    multiple
    allow-clear
    style="width: 400px"
  ></sl-cascader>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/cascader/cascader.js';

  const options = ref([
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          children: [
            { value: 'xihu', label: '西湖区' },
            { value: 'binjiang', label: '滨江区' }
          ]
        }
      ]
    },
    {
      value: 'jiangsu',
      label: '江苏',
      children: [
        {
          value: 'nanjing',
          label: '南京',
          children: [
            { value: 'xuanwu', label: '玄武区' },
            { value: 'jianye', label: '建邺区' }
          ]
        }
      ]
    }
  ]);
</script>
```

## 悬浮展开

设置 `expand-trigger="hover"` 属性，鼠标悬浮时自动展开子级菜单。

```html
<template>
  <sl-cascader
    :options.prop="options"
    placeholder="请选择"
    expand-trigger="hover"
    style="width: 300px"
  ></sl-cascader>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/cascader/cascader.js';

  const options = ref([
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          children: [
            { value: 'xihu', label: '西湖区' }
          ]
        }
      ]
    }
  ]);
</script>
```

## 选择即改变

设置 `change-on-select` 属性，选中任意层级的选项即可改变值，不必选到叶子节点。

```html
<template>
  <sl-cascader
    :options.prop="options"
    placeholder="请选择"
    change-on-select
    style="width: 300px"
  ></sl-cascader>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/cascader/cascader.js';

  const options = ref([
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          children: [
            { value: 'xihu', label: '西湖区' }
          ]
        }
      ]
    }
  ]);
</script>
```

## 仅显示最后一级

设置 `show-full-path` 为 `false`（通过 `.prop` 修饰符），输入框中仅显示最后一级选项的标签。

```html
<template>
  <sl-cascader
    :options.prop="options"
    :showFullPath.prop="false"
    placeholder="请选择"
    style="width: 300px"
  ></sl-cascader>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/cascader/cascader.js';

  const options = ref([
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          children: [
            { value: 'xihu', label: '西湖区' }
          ]
        }
      ]
    }
  ]);
</script>
```

## 自定义分隔符

通过 `separator` 属性自定义路径分隔符，默认为 ` / `。

```html
<sl-cascader :options.prop="options" placeholder="请选择" separator=" > " style="width: 300px"></sl-cascader>
```

## 自定义字段名

通过 `fieldNames` 属性（使用 `.prop` 修饰符）自定义数据中的字段名映射。

```html
<template>
  <sl-cascader
    :options.prop="options"
    :fieldNames.prop="fieldNames"
    placeholder="请选择"
    style="width: 300px"
  ></sl-cascader>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/cascader/cascader.js';

  const fieldNames = ref({ label: 'name', value: 'code', children: 'items' });
  const options = ref([
    {
      code: 'zhejiang',
      name: '浙江',
      items: [
        {
          code: 'hangzhou',
          name: '杭州',
          items: [
            { code: 'xihu', name: '西湖区' }
          ]
        }
      ]
    }
  ]);
</script>
```

## 可清除

设置 `allow-clear` 属性（默认已启用），当有选中值时显示清除按钮。

```html
<sl-cascader :options.prop="options" placeholder="请选择" allow-clear style="width: 300px"></sl-cascader>
```

## 禁用状态

设置 `disabled` 属性禁用整个级联选择器。

```html
<sl-cascader :options.prop="options" placeholder="请选择" disabled style="width: 300px"></sl-cascader>
```

## 禁用选项

在选项数据中设置 `disabled: true` 禁用特定选项。

```javascript
const options = ref([
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      { value: 'hangzhou', label: '杭州', disabled: true },
      { value: 'ningbo', label: '宁波' }
    ]
  }
]);
```

## 尺寸

通过 `size` 属性设置组件尺寸，支持 `small`、`medium`（默认）、`large`。

```html
<sl-cascader :options.prop="options" placeholder="Small" size="small" style="width: 300px"></sl-cascader>
<sl-cascader :options.prop="options" placeholder="Medium" style="width: 300px"></sl-cascader>
<sl-cascader :options.prop="options" placeholder="Large" size="large" style="width: 300px"></sl-cascader>
```

## Label 和 Help Text

通过 `label` 和 `help-text` 属性设置标签和帮助文本。

```html
<sl-cascader :options.prop="options" label="所在地区" help-text="请选择省/市/区" placeholder="请选择" style="width: 300px"></sl-cascader>
```

## 外观变体

通过 `variant` 属性设置组件外观变体，支持 `outlined`（默认）、`borderless`、`filled`、`underlined`。

```html
<sl-cascader :options.prop="options" placeholder="Outlined（默认）" style="width: 300px"></sl-cascader>
<sl-cascader :options.prop="options" placeholder="Borderless" variant="borderless" style="width: 300px"></sl-cascader>
<sl-cascader :options.prop="options" placeholder="Filled" variant="filled" style="width: 300px"></sl-cascader>
<sl-cascader :options.prop="options" placeholder="Underlined" variant="underlined" style="width: 300px"></sl-cascader>
```

## 验证状态

通过 `status` 属性设置验证状态，支持 `error` 和 `warning`。

```html
<sl-cascader :options.prop="options" placeholder="Error" status="error" style="width: 300px"></sl-cascader>
<sl-cascader :options.prop="options" placeholder="Warning" status="warning" style="width: 300px"></sl-cascader>
```

## Hoist

设置 `hoist` 属性使用 fixed 定位策略，防止菜单被容器的 `overflow` 裁切。默认已启用。

```html
<sl-cascader :options.prop="options" placeholder="请选择" hoist style="width: 300px"></sl-cascader>
```

## 弹出位置

通过 `placement` 属性设置菜单弹出位置，支持 `bottomLeft`（默认）、`bottomRight`、`topLeft`、`topRight`。

```html
<sl-cascader :options.prop="options" placeholder="请选择" placement="topLeft" style="width: 300px"></sl-cascader>
```

## 前缀和后缀图标

通过 `prefix` 和 `suffix` 插槽添加自定义前缀和后缀图标。

```html
<template>
  <sl-cascader :options.prop="options" placeholder="请选择" style="width: 300px">
    <sl-icon name="geo-alt" slot="prefix"></sl-icon>
  </sl-cascader>
</template>

<script setup>
  import '@kdcloudjs/shoelace/dist/components/cascader/cascader.js';
  import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
</script>
```

## 设置默认值

通过 `value` 属性设置默认选中值，值为选中路径的 value 数组。

```html
<template>
  <sl-cascader :options.prop="options" :value.prop="selectedValue" style="width: 300px"></sl-cascader>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/cascader/cascader.js';

  const selectedValue = ref(['zhejiang', 'hangzhou', 'xihu']);
  const options = ref([
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          children: [
            { value: 'xihu', label: '西湖区' },
            { value: 'binjiang', label: '滨江区' }
          ]
        }
      ]
    }
  ]);
</script>
```

## 监听事件

使用 `@sl-*` 语法绑定事件。

```html
<template>
  <sl-cascader
    :options.prop="options"
    placeholder="请选择"
    clearable
    @sl-change="handleChange"
    @sl-clear="handleClear"
    style="width: 300px"
  ></sl-cascader>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/cascader/cascader.js';

  const options = ref([
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          children: [
            { value: 'xihu', label: '西湖区' }
          ]
        }
      ]
    }
  ]);

  const handleChange = (event) => {
    console.log('选中值变化:', event.target.value);
  };

  const handleClear = () => {
    console.log('已清除');
  };
</script>
```

## 编程式控制

通过 `ref` 调用组件方法。

```html
<template>
  <button @click="handleShow">打开</button>
  <button @click="handleHide">关闭</button>
  <button @click="handleReset">重置</button>
  <sl-cascader ref="cascaderRef" :options.prop="options" placeholder="请选择" style="width: 300px"></sl-cascader>
</template>

<script setup>
  import { ref } from 'vue';
  import '@kdcloudjs/shoelace/dist/components/cascader/cascader.js';

  const cascaderRef = ref(null);
  const options = ref([...]);

  const handleShow = () => {
    cascaderRef.value?.show();
  };

  const handleHide = () => {
    cascaderRef.value?.hide();
  };

  const handleReset = () => {
    if (cascaderRef.value) {
      cascaderRef.value.value = [];
    }
  };
</script>
```

## 表单集成

级联选择器支持表单集成，可通过 `name` 和 `required` 属性参与表单提交和验证。

```html
<template>
  <form>
    <sl-cascader
      :options.prop="options"
      name="region"
      label="所在地区"
      placeholder="请选择"
      required
      style="width: 300px"
    ></sl-cascader>
    <button type="submit">提交</button>
  </form>
</template>
```

## 表单验证

```javascript
const cascaderRef = ref(null);

// 检查有效性（不显示提示）
const isValid = cascaderRef.value?.checkValidity();

// 检查有效性并显示浏览器提示
cascaderRef.value?.reportValidity();

// 设置自定义验证消息
cascaderRef.value?.setCustomValidity('请选择地区');

// 清除自定义验证消息
cascaderRef.value?.setCustomValidity('');
```

## Properties

| 属性                  | 描述                                                        | 类型                                                                               | 默认值           |
| --------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------- |
| name                  | 表单提交时的字段名                                          | `string`                                                                           | `''`             |
| value                 | 当前选中路径值数组（需使用 `.prop` 修饰符绑定）             | `(string \| number)[] \| (string \| number)[][]`                                    | `[]`             |
| size                  | 组件尺寸                                                    | `'small' \| 'medium' \| 'large'`                                                   | `'medium'`       |
| placeholder           | 占位文本                                                    | `string`                                                                           | `''`             |
| multiple              | 是否多选                                                    | `boolean`                                                                          | `false`          |
| disabled              | 是否禁用                                                    | `boolean`                                                                          | `false`          |
| panel-disabled        | 是否禁用面板选项交互（面板可打开但选项不可操作）           | `boolean`                                                                          | `false`          |
| allow-clear           | 是否显示清除按钮                                            | `boolean`                                                                          | `true`           |
| open                  | 下拉面板是否打开                                            | `boolean`                                                                          | `false`          |
| default-open          | 初始是否展开下拉面板                                        | `boolean`                                                                          | `false`          |
| hoist                 | 是否使用 fixed 定位策略                                     | `boolean`                                                                          | `true`           |
| label                 | 标签文本                                                    | `string`                                                                           | `''`             |
| placement             | 下拉面板弹出位置                                            | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'`                         | `'bottomLeft'`   |
| help-text             | 帮助文本                                                    | `string`                                                                           | `''`             |
| required              | 是否必填                                                    | `boolean`                                                                          | `false`          |
| form                  | 关联的表单 ID                                               | `string`                                                                           | `''`             |
| options               | 级联选项数据（需使用 `.prop` 修饰符绑定）                   | `CascaderOption[]`                                                                 | `[]`             |
| fieldNames            | 自定义字段名映射（需使用 `.prop` 修饰符绑定）               | `FieldNames`                                                                       | `{ label: 'label', value: 'value', children: 'children' }` |
| separator             | 路径分隔符                                                  | `string`                                                                           | `' / '`          |
| expand-trigger        | 子级展开触发方式                                            | `'click' \| 'hover'`                                                               | `'click'`        |
| change-on-select      | 是否选中非叶子节点即改变值                                  | `boolean`                                                                          | `false`          |
| show-full-path        | 是否在输入框中显示完整路径                                  | `boolean`                                                                          | `true`           |
| variant               | 外观变体                                                    | `'outlined' \| 'borderless' \| 'filled' \| 'underlined'`                           | `'outlined'`     |
| status                | 验证状态                                                    | `'error' \| 'warning' \| ''`                                                       | `''`             |
| showSearch            | 是否显示搜索输入框（需使用 `.prop` 修饰符绑定）             | `boolean \| ShowSearchConfig`                                                      | `false`          |
| not-found-content     | 无匹配结果时显示的内容                                      | `string`                                                                           | `'Not Found'`    |
| loadData              | 异步加载数据函数（需使用 `.prop` 修饰符绑定）               | `(selectedOptions: CascaderOption[]) => void`                                      | `null`           |
| displayRender         | 自定义已选项显示渲染（需使用 `.prop` 修饰符绑定）           | `(labels: string[], selectedOptions: CascaderOption[]) => string`                  | `null`           |
| optionRender          | 自定义选项渲染（需使用 `.prop` 修饰符绑定）                 | `(option: CascaderOption) => string \| HTMLElement`                                | `null`           |
| max-tag-count         | 多选模式下最多显示的标签数                                  | `number`                                                                           | -                |
| max-tag-placeholder   | 超出最大标签数时的占位文本                                  | `string`                                                                           | `''`             |
| max-tag-text-length   | 标签文本最大显示长度                                        | `number`                                                                           | -                |
| show-checked-strategy | 多选模式选中项展示策略                                      | `'show-parent' \| 'show-child'`                                                    | `'show-parent'`  |

## Events

| 事件名称      | Vue 绑定         | 描述                       | 事件详情 |
| ------------- | ---------------- | -------------------------- | -------- |
| sl-change     | `@sl-change`     | 选中值变化时触发           | -        |
| sl-clear      | `@sl-clear`      | 清除按钮点击时触发         | -        |
| sl-input      | `@sl-input`      | 输入值变化时触发           | -        |
| sl-focus      | `@sl-focus`      | 获得焦点时触发             | -        |
| sl-blur       | `@sl-blur`       | 失去焦点时触发             | -        |
| sl-show       | `@sl-show`       | 下拉面板打开时触发         | -        |
| sl-after-show | `@sl-after-show` | 下拉面板打开动画完成后触发 | -        |
| sl-hide       | `@sl-hide`       | 下拉面板关闭时触发         | -        |
| sl-after-hide | `@sl-after-hide` | 下拉面板关闭动画完成后触发 | -        |

## Methods

| 方法名              | 描述                               | 参数              | 返回值                    |
| ------------------- | ---------------------------------- | ----------------- | ------------------------- |
| show()              | 打开下拉面板                       | -                 | `Promise<void>`           |
| hide()              | 关闭下拉面板                       | -                 | `Promise<void>`           |
| focus(options?)     | 聚焦到输入框                       | `FocusOptions?`   | `void`                    |
| blur()              | 移除焦点                           | -                 | `void`                    |
| checkValidity()     | 检查有效性（不显示提示）           | -                 | `boolean`                 |
| reportValidity()    | 检查有效性并显示浏览器提示         | -                 | `boolean`                 |
| setCustomValidity() | 设置自定义验证消息，传空字符串恢复 | `message: string` | `void`                    |
| getForm()           | 获取关联的表单元素                 | -                 | `HTMLFormElement \| null` |

## Slots

| 插槽名      | 描述                                |
| ----------- | ----------------------------------- |
| label       | 标签内容，替代 `label` 属性        |
| help-text   | 帮助文本，替代 `help-text` 属性    |
| prefix      | 输入框前缀图标或元素               |
| suffix      | 输入框后缀图标或元素               |
| clear-icon  | 自定义清除图标                     |
| expand-icon | 自定义展开/收起图标                |
| not-found   | 无匹配结果时显示的自定义内容       |

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
| menu                   | 级联菜单容器                             |
| menu-column            | 级联菜单列                               |
| menu-item              | 级联菜单项                               |
| tags                   | 标签容器（多选模式）                     |
| tag                    | 单个标签                                 |
| clear-button           | 清除按钮                                 |
| expand-icon            | 展开图标容器                             |
| search-input           | 搜索输入框（showSearch 启用时）          |
| not-found              | 无匹配结果容器                           |

## 最佳实践

### 1. 正确导入组件

```javascript
import '@kdcloudjs/shoelace/dist/components/cascader/cascader.js';
```

### 2. 复杂数据使用 `.prop` 修饰符绑定

Vue 默认将绑定值作为 HTML attribute 设置，对于对象和数组类型的属性（如 `options`、`fieldNames`、`value`），必须使用 `.prop` 修饰符让 Vue 将其作为 DOM property 设置：

```html
<!-- ✅ 正确：使用 .prop 修饰符 -->
<sl-cascader :options.prop="options" :fieldNames.prop="fieldNames" :value.prop="selectedValue" />

<!-- ❌ 错误：不使用 .prop，Vue 会尝试序列化为 attribute -->
<sl-cascader :options="options" />
```

### 3. 布尔和字符串属性直接绑定

简单类型的属性可以直接使用 HTML attribute 方式：

```html
<sl-cascader
  placeholder="请选择"
  multiple
  change-on-select
  size="small"
  expand-trigger="hover"
  separator=" > "
/>
```

### 4. 事件使用 `@sl-*` 语法

```html
<sl-cascader @sl-change="handleChange" @sl-clear="handleClear" />
```

### 5. 通过 ref 调用组件方法

```html
<sl-cascader ref="cascaderRef" />

<script setup>
  import { ref } from 'vue';
  const cascaderRef = ref(null);

  // 调用方法
  cascaderRef.value?.show();
  cascaderRef.value?.hide();
</script>
```

## 常见问题

### Q: 为什么 options 绑定后没有数据？

A: 在 Vue 中绑定复杂数据（对象、数组）到 Web Component 时，必须使用 `.prop` 修饰符：`:options.prop="data"`。不加 `.prop` 时 Vue 会尝试将数据序列化为 HTML attribute 字符串，导致数据丢失。

### Q: 如何获取选中的完整路径值？

A: 监听 `@sl-change` 事件，通过 `ref` 获取 `cascaderRef.value.value`。`value` 是一个字符串数组，例如 `['zhejiang', 'hangzhou', 'xihu']`。

### Q: 如何仅显示最后一级标签？

A: 使用 `.prop` 修饰符设置 `showFullPath` 为 `false`：`:showFullPath.prop="false"`。

### Q: value 的格式是什么？

A: `value` 是一个字符串数组（`string[]`），表示从根到选中节点的路径。例如 `['zhejiang', 'hangzhou', 'xihu']`。

### Q: Vue 中如何实现双向绑定？

A: Vue 对自定义元素不支持 `v-model`，需要手动实现：

```html
<sl-cascader :value.prop="selectedValue" @sl-change="selectedValue = $event.target.value" />
```
