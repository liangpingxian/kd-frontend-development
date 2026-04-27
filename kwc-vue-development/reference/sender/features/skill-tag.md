# 技能标签

[返回目录](../index.md)

## 功能说明

通过 `skill` 属性为 Sender 添加技能标签，标识当前使用的 AI 技能或代理。支持显示标题、可关闭、关闭回调等配置。

## 示例代码（Vue）

```vue
<template>
  <div>
    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
      <sl-button
        v-for="(s, key) in skills"
        :key="key"
        size="small"
        :variant="currentSkill === key ? 'primary' : 'default'"
        @click="handleSwitch(key)"
      >
        {{ s.title }}
      </sl-button>
    </div>
    <sl-sender
      ref="senderRef"
      placeholder="输入消息..."
      :skill.prop="skills[currentSkill]"
    ></sl-sender>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const senderRef = ref(null);
const currentSkill = ref('search');

const skills = {
  search: { value: 'deepSearch', title: '深度搜索', closable: true },
  code: { value: 'aiCode', title: '代码助手', closable: true },
  writing: {
    value: 'writing',
    title: '写作助手',
    closable: {
      onClose: () => console.log('写作助手已关闭'),
      disabled: false
    }
  }
};

const handleSwitch = (key) => {
  currentSkill.value = key;
};
</script>
```

---

## 注意事项

1. **skill 对象**：`value` 为必填字段，用于标识技能；`title` 为显示文本
2. **skill 传递**：必须使用 `:skill.prop="skillObj"` 传递对象
3. **closable 配置**：布尔值 `true` 显示关闭按钮；对象模式支持 `onClose` 回调和 `disabled` 禁用关闭
4. **动态切换**：直接更新传入的 skill 对象即可切换技能标签
5. **与 slotConfig 配合**：通常 `skill` 和 `slotConfig` 一起使用，切换技能时同步更新结构化模板

[返回目录](../index.md)
