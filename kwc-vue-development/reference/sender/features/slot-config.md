# 插槽填充

[返回目录](../index.md)

## 功能说明

通过 `slotConfig` 将 Sender 切换为结构化输入模式，支持 `text`（纯文本）、`input`（输入框）、`select`（下拉选择）、`tag`（标签）、`content`（可编辑内容块）等类型。配合 `skill` 标识当前技能，使用 `insert`、`clear`、`getValue` 等方法控制输入。

## 示例代码（Vue）

```vue
<template>
  <div>
    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
      <sl-button size="small" @click="handleClear">清空</sl-button>
      <sl-button size="small" @click="handleGetValue">获取值</sl-button>
      <sl-button size="small" @click="handleInsert">插入内容</sl-button>
    </div>
    <sl-sender
      ref="senderRef"
      placeholder="按 Enter 发送"
      :slotConfig.prop="slotConfig"
      :skill.prop="skill"
      @sl-submit="handleSubmit"
    ></sl-sender>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const senderRef = ref(null);

const slotConfig = ref([
  { type: 'text', value: '我想去 ' },
  { type: 'content', key: 'location', props: { defaultValue: '北京', placeholder: '[输入地点]' } },
  { type: 'text', value: ' 乘坐 ' },
  {
    type: 'select',
    key: 'transport',
    props: {
      defaultValue: 'airplane',
      options: [
        { label: '飞机', value: 'airplane' },
        { label: '高铁', value: 'high-speed-rail' },
        { label: '邮轮', value: 'cruise-ship' }
      ],
      placeholder: '选择交通方式'
    }
  },
  { type: 'text', value: '。请 ' },
  { type: 'tag', key: 'tool', props: { label: '@旅行规划师', value: 'travelTool' } },
  { type: 'text', value: ' 帮我规划，使用账号 ' },
  { type: 'input', key: 'account', props: { placeholder: '输入账号' } },
  { type: 'text', value: '。' }
]);

const skill = ref({ value: 'travelId', title: '旅行规划', closable: true });

const handleClear = () => {
  senderRef.value?.clear();
};

const handleGetValue = () => {
  const val = senderRef.value?.getValue();
  console.log('当前值:', val);
};

const handleInsert = () => {
  senderRef.value?.insert([
    { type: 'text', value: ' 附加文本' },
    { type: 'content', key: 'extra_' + Date.now(), props: { defaultValue: '默认值' } }
  ]);
};

const handleSubmit = (e) => {
  console.log('提交:', e.detail.value, e.detail.slotConfig);
  senderRef.value?.clear();
};
</script>
```

---

## 注意事项

1. **slotConfig 传递**：必须使用 `:slotConfig.prop="config"` 传递数组，不可使用 kebab-case
2. **skill 传递**：同样使用 `:skill.prop="skill"` 传递对象
3. **key 唯一性**：每个非 `text` 类型的 slot 项必须有唯一的 `key`
4. **insert 方法**：支持 `'start'`、`'end'`、`'cursor'` 三种插入位置，默认为 `'cursor'`
5. **getValue 返回值**：返回 `{ value: string, slotConfig: SlotConfigType[], skill?: SkillType }`，其中 `value` 为拼接后的纯文本
6. **动态切换**：可随时更新 `slotConfig` 和 `skill` 的 ref 值切换不同的结构化模板，注意使用不可变方式更新（重新赋值整个数组/对象）

[返回目录](../index.md)
