# Sender 消息发送组件 Skill

## 组件概述

`SlSender` 是一个复合消息输入组件，支持文本输入、语音识别、结构化插槽填充、技能标签、自定义头部/尾部/前缀/后缀等丰富功能。适用于 AI 对话、智能助手、聊天界面等场景。组件包含三个子组件：`SlSender`（主体）、`SlSenderHeader`（可折叠头部面板）、`SlSenderSwitch`（功能开关按钮）。

## 功能列表

| 功能 | 说明 | 详细文档 |
|------|------|----------|
| 基础用法 | value、placeholder、loading、disabled、readOnly | [basic-usage.md](./features/basic-usage.md) |
| 提交模式 | submit-type 控制 Enter/Shift+Enter 提交 | [submit-type.md](./features/submit-type.md) |
| 语音输入 | allow-speech 内置浏览器语音、自定义语音服务 | [speech-input.md](./features/speech-input.md) |
| 插槽填充 | slotConfig 结构化输入（text/input/select/tag/content） | [slot-config.md](./features/slot-config.md) |
| 技能标签 | skill 标签显示、可关闭、切换 | [skill-tag.md](./features/skill-tag.md) |
| 自定义后缀 | suffixContent 自定义操作按钮区域 | [custom-suffix.md](./features/custom-suffix.md) |
| 自定义头部 | header 属性/插槽、sl-sender-header 可折叠面板 | [custom-header.md](./features/custom-header.md) |
| 自定义尾部 | footer 属性/插槽、底部工具栏 | [custom-footer.md](./features/custom-footer.md) |
| 前缀插槽 | prefix 插槽、prefixContent 属性 | [prefix-slot.md](./features/prefix-slot.md) |
| 实例方法 | focus/blur/clear/insert/getValue 方法控制 | [ref-actions.md](./features/ref-actions.md) |
| 粘贴文件 | sl-paste-file 捕获粘贴的文件 | [paste-files.md](./features/paste-files.md) |
| 功能开关 | sl-sender-switch 切换按钮组件 | [sender-switch.md](./features/sender-switch.md) |
| 事件监听 | sl-change/sl-submit/sl-clear/sl-focus/sl-blur 等 | [events.md](./features/events.md) |

## 核心约束

### 必须遵守的规则

1. **Vue 导入路径**
   - 组件：`import '@kdcloudjs/shoelace/dist/components/sender/sender.js';`
   - 子组件：`import '@kdcloudjs/shoelace/dist/components/sender-header/sender-header.js';`
   - 子组件：`import '@kdcloudjs/shoelace/dist/components/sender-switch/sender-switch.js';`
   - 导入即注册 Web Component，无需 `components: {}` 注册

2. **模板标签**
   - 必须使用 kebab-case：`<sl-sender>`、`<sl-sender-header>`、`<sl-sender-switch>`
   - 禁止 PascalCase（`<SlSender>`）

3. **事件绑定**
   - 使用 `@sl-*` 前缀绑定事件：
   - `@sl-change`、`@sl-submit`、`@sl-clear`、`@sl-focus`、`@sl-blur`
   - `@sl-speech-toggle`、`@sl-paste-file`、`@sl-paste`、`@sl-cancel`
   - 禁止使用 `@change`、`@input` 等原生事件名

4. **属性传递**
   - **对象/数组属性**：必须使用 camelCase + `.prop` 修饰符，如 `:slotConfig.prop="config"`、`:skill.prop="skill"`
   - **字符串/布尔属性**：使用 camelCase 无需 `.prop`，如 `placeholder="..."`、`loading`、`disabled`、`readOnly`、`allowSpeech`（布尔模式）
   - **复杂属性（函数/lit 模板）**：通过 ref 在 `onMounted` 中设置，如 `senderRef.value.suffixContent = ...`

5. **Ref 方法调用**
   - 使用 `ref()` 声明模板引用获取组件实例
   - 可调用 `focus()`、`blur()`、`clear()`、`insert()`、`getValue()` 等方法

## 快速开始

### 组件导入

```js
// 主组件
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';
// 可折叠头部面板
import '@kdcloudjs/shoelace/dist/components/sender-header/sender-header.js';
// 功能开关按钮
import '@kdcloudjs/shoelace/dist/components/sender-switch/sender-switch.js';
```

### 最简示例

```vue
<template>
  <sl-sender
    ref="senderRef"
    placeholder="请输入消息..."
    :value="value"
    @sl-change="handleChange"
    @sl-submit="handleSubmit"
  ></sl-sender>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';

const senderRef = ref(null);
const value = ref('');

const handleChange = (e) => {
  value.value = e.target.value;
};

const handleSubmit = (e) => {
  console.log('提交内容:', e.detail.value);
  senderRef.value.loading = true;
  setTimeout(() => {
    senderRef.value.loading = false;
    value.value = '';
  }, 3000);
};
</script>
```



## API 概览

### Sender 属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `value` | 输入框的值 | `string` | `''` |
| `placeholder` | 占位文本 | `string` | `''` |
| `loading` | 是否处于加载状态（显示取消按钮） | `boolean` | `false` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `readOnly` | 是否只读 | `boolean` | `false` |
| `rows` | 文本框行数 | `number` | `1` |
| `submitType` | 提交模式 | `'enter' \| 'shift-enter'` | `'enter'` |
| `slotConfig` | 结构化插槽配置（需 `.prop`） | `SlotConfigType[]` | `undefined` |
| `skill` | 技能标签配置（需 `.prop`） | `SkillType` | `undefined` |
| `header` | 头部内容（通过 ref 设置） | `BaseNode \| NodeRender` | `undefined` |
| `footer` | 尾部内容（通过 ref 设置） | `BaseNode \| NodeRender` | `undefined` |
| `prefixContent` | 前缀内容（通过 ref 设置） | `BaseNode \| NodeRender` | `undefined` |
| `suffixContent` | 后缀内容（设为 `false` 隐藏默认操作按钮，通过 ref 设置） | `BaseNode \| NodeRender \| false` | `undefined` |
| `allowSpeech` | 是否启用语音输入（布尔直接传，对象需 `.prop` 或 ref） | `boolean \| ControlledSpeechConfig` | `false` |
| `speechRecording` | 内置语音录音状态（非受控模式） | `boolean` | `false` |

### SlotConfig 插槽配置类型

| type | 说明 | 必填字段 | props |
|------|------|----------|-------|
| `text` | 纯文本片段 | `value` | - |
| `input` | 输入框 | `key` | `{ placeholder?, defaultValue? }` |
| `select` | 下拉选择 | `key` | `{ placeholder?, defaultValue?, options: {label, value}[] }` |
| `tag` | 标签（不可编辑） | `key` | `{ label, value? }` |
| `content` | 可编辑内容块 | `key` | `{ placeholder?, defaultValue? }` |
| `custom` | 自定义渲染 | `key`, `customRender` | `{ defaultValue?, placeholder? }` |

### Skill 技能配置

| 属性 | 说明 | 类型 | 必填 |
|------|------|------|------|
| `value` | 技能标识值 | `string` | 是 |
| `title` | 技能显示标题 | `BaseNode` | 否 |
| `closable` | 是否可关闭 | `boolean \| { closeIcon?, onClose?, disabled? }` | 否 |

### SenderFocusOptions

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `preventScroll` | 是否阻止滚动 | `boolean` | `false` |
| `cursor` | 光标位置 | `'start' \| 'end' \| 'all' \| 'slot'` | `'end'` |

### 实例方法

| 方法 | 说明 | 参数 |
|------|------|------|
| `focus(options?)` | 聚焦输入区域 | `SenderFocusOptions` |
| `blur()` | 失焦 | - |
| `clear()` | 清空输入内容 | - |
| `getValue()` | 获取当前值（含 slotConfig 和 skill） | 返回 `{ value, slotConfig, skill? }` |
| `insert(items, position?)` | 插入内容 | `items: SlotConfigType[]`, `position: 'start' \| 'end' \| 'cursor'` |

### 主要事件

| 事件名 | Vue 绑定 | 说明 | detail |
|--------|---------|------|--------|
| `sl-change` | `@sl-change` | 输入值变化 | `{ value, slotConfig?, skill? }` |
| `sl-submit` | `@sl-submit` | 提交 | `{ value, slotConfig?, skill? }` |
| `sl-clear` | `@sl-clear` | 清空 | - |
| `sl-focus` | `@sl-focus` | 获得焦点 | - |
| `sl-blur` | `@sl-blur` | 失去焦点 | - |
| `sl-speech-toggle` | `@sl-speech-toggle` | 语音录制状态切换 | - |
| `sl-paste` | `@sl-paste` | 粘贴事件 | `{ event: ClipboardEvent }` |
| `sl-paste-file` | `@sl-paste-file` | 粘贴文件 | `{ files: FileList }` |
| `sl-cancel` | `@sl-cancel` | 取消加载 | - |

### SenderHeader 属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `open` | 面板是否展开 | `boolean` | `true` |
| `closable` | 是否显示关闭按钮 | `boolean` | `true` |
| `title` | 纯文本标题 | `string` | `''` |
| `forceRender` | 折叠时是否保留 DOM | `boolean` | `false` |

### SenderHeader 事件

| 事件名 | Vue 绑定 | 说明 | detail |
|--------|---------|------|--------|
| `sl-open-change` | `@sl-open-change` | 展开/折叠状态变化 | `{ open: boolean }` |

### SenderHeader Slots

| Slot | 说明 |
|------|------|
| `(default)` | 面板内容 |
| `title` | 标题区域（富文本） |

### SenderSwitch 属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `checked` | 是否选中 | `boolean` | `false` |
| `defaultChecked` | 初始选中状态（非受控） | `boolean` | `false` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `loading` | 是否加载中 | `boolean` | `false` |

### SenderSwitch 事件

| 事件名 | Vue 绑定 | 说明 |
|--------|---------|------|
| `sl-change` | `@sl-change` | 选中状态变化 |

### SenderSwitch Slots

| Slot | 说明 |
|------|------|
| `(default)` | 默认内容（始终显示） |
| `icon` | 图标 |
| `checked` | 选中时显示的内容 |
| `unchecked` | 未选中时显示的内容 |

### Sender CSS 设计变量

| Token 名称 | 说明 |
|-----------|------|
| `--sl-sender-border-width` | 边框宽度 |
| `--sl-sender-border-color` | 边框颜色 |
| `--sl-sender-border-color-hover` | 悬停边框颜色 |
| `--sl-sender-border-color-focus` | 聚焦边框颜色 |
| `--sl-sender-border-color-disabled` | 禁用边框颜色 |
| `--sl-sender-background-color` | 背景色 |
| `--sl-sender-background-color-disabled` | 禁用背景色 |
| `--sl-sender-shadow` | 阴影 |
| `--sl-sender-shadow-focus` | 聚焦阴影 |
| `--sl-sender-input-color` | 输入文字颜色 |
| `--sl-sender-input-color-disabled` | 禁用输入文字颜色 |
| `--sl-sender-input-placeholder-color` | 占位文字颜色 |
| `--sl-sender-input-placeholder-color-disabled` | 禁用占位文字颜色 |
| `--sl-sender-action-color` | 操作按钮颜色 |
| `--sl-sender-action-color-hover` | 操作按钮悬停颜色 |
| `--sl-sender-action-color-active` | 操作按钮激活颜色 |
| `--sl-sender-action-color-disabled` | 操作按钮禁用颜色 |
| `--sl-sender-action-background-hover` | 操作按钮悬停背景 |
| `--sl-sender-action-background-active` | 操作按钮激活背景 |
| `--sl-sender-action-border-radius` | 操作按钮圆角 |
| `--sl-sender-submit-color` | 提交按钮颜色 |
| `--sl-sender-submit-color-active` | 提交按钮激活颜色 |
| `--sl-sender-submit-background` | 提交按钮背景 |
| `--sl-sender-submit-background-hover` | 提交按钮悬停背景 |
| `--sl-sender-submit-background-active` | 提交按钮激活背景 |
| `--sl-sender-submit-background-disabled` | 提交按钮禁用背景 |
| `--sl-sender-submit-border-radius` | 提交按钮圆角 |
| `--sl-sender-voice-recording-background` | 录音按钮背景 |
| `--sl-sender-voice-waveform-color` | 录音波形颜色 |

## 使用建议

1. **基础场景**：仅需 `value`、`placeholder`、`@sl-submit` 即可完成基本消息发送
2. **加载状态**：提交后设置 `senderRef.value.loading = true`，完成后重置为 `false` 并清空 `value`
3. **结构化输入**：通过 `:slotConfig.prop` 定义模板化输入，配合 `:skill.prop` 标识当前技能
4. **自定义操作区**：使用 `suffixContent` 函数模式可访问 `SendButton`、`ClearButton`、`LoadingButton`、`SpeechButton` 组件渲染器，需通过 ref 设置
5. **文件上传**：监听 `@sl-paste-file` 事件捕获粘贴的文件，配合 `sl-sender-header` 展示附件列表
6. **Ref 操作**：通过 `ref()` 获取实例后可调用 `focus()`、`blur()`、`clear()`、`insert()`、`getValue()` 等方法
7. **复杂属性设置**：`header`、`footer`、`suffixContent`、`prefixContent` 等需要 lit html 模板的属性，统一通过 ref 在 `onMounted` 或 `watch` 中设置
