# 实例方法

[返回目录](../index.md)

## 功能说明

通过 `ref` 模板引用获取 `sl-sender` 实例后，可调用 `focus`、`blur`、`clear`、`insert`、`getValue` 等方法控制输入行为。

## 示例代码（Vue）

```vue
<template>
  <div>
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
      <sl-button size="small" @click="handleInsert">插入文本</sl-button>
      <sl-button size="small" @click="handleInsertEnd">插入到末尾</sl-button>
      <sl-button size="small" @click="handleInsertStart">插入到开头</sl-button>
      <sl-button size="small" @click="handleFocusStart">聚焦到开头</sl-button>
      <sl-button size="small" @click="handleFocusEnd">聚焦到末尾</sl-button>
      <sl-button size="small" @click="handleFocusAll">全选</sl-button>
      <sl-button size="small" @click="handleBlur">失焦</sl-button>
    </div>
    <sl-sender
      ref="senderRef"
      value="你好，欢迎使用 Shoelace！"
      placeholder="输入消息..."
    ></sl-sender>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const senderRef = ref(null);

const handleInsert = () => {
  senderRef.value?.insert([{ type: 'text', value: '插入的文本' }], 'cursor');
};

const handleInsertEnd = () => {
  senderRef.value?.insert([{ type: 'text', value: '末尾文本' }], 'end');
};

const handleInsertStart = () => {
  senderRef.value?.insert([{ type: 'text', value: '开头文本' }], 'start');
};

const handleFocusStart = () => {
  senderRef.value?.focus({ cursor: 'start' });
};

const handleFocusEnd = () => {
  senderRef.value?.focus({ cursor: 'end' });
};

const handleFocusAll = () => {
  senderRef.value?.focus({ cursor: 'all' });
};

const handleBlur = () => {
  senderRef.value?.blur();
};
</script>
```

---

## 注意事项

1. **Ref 获取**：使用 `ref(null)` 声明模板引用，通过 `senderRef.value` 访问组件实例
2. **focus 选项**：`cursor` 支持 `'start'`、`'end'`、`'all'`、`'slot'`（聚焦第一个 slot input）
3. **insert 位置**：`'cursor'`（当前光标）、`'start'`（开头）、`'end'`（末尾）
4. **getValue 返回值**：`{ value: string, slotConfig: SlotConfigType[], skill?: SkillType }`
5. **clear 方法**：清空所有输入内容（包括 slot 模式下的结构化内容）

[返回目录](../index.md)
