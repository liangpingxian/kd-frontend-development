# 功能开关

[返回目录](../index.md)

## 功能说明

`sl-sender-switch` 是一个切换按钮组件，用于在 Sender 中启用/禁用功能（如深度思考、搜索等）。支持默认内容、选中/未选中内容、禁用、加载、受控模式。

## 示例代码（Vue）

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 0.75rem;">
    <!-- 默认用法 -->
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      默认:
      <sl-sender-switch>
        <sl-icon slot="icon" name="search"></sl-icon>
        深度搜索
      </sl-sender-switch>
    </div>

    <!-- 自定义选中/未选中内容 -->
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      自定义内容:
      <sl-sender-switch>
        <sl-icon slot="icon" name="search"></sl-icon>
        <span slot="checked">深度搜索: 开</span>
        <span slot="unchecked">深度搜索: 关</span>
      </sl-sender-switch>
    </div>

    <!-- 禁用 -->
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      禁用:
      <sl-sender-switch disabled>
        <sl-icon slot="icon" name="search"></sl-icon>
        深度搜索
      </sl-sender-switch>
    </div>

    <!-- 加载中 -->
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      加载中:
      <sl-sender-switch loading>
        <sl-icon slot="icon" name="search"></sl-icon>
        深度搜索
      </sl-sender-switch>
    </div>

    <!-- 受控模式 -->
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      受控模式:
      <sl-sender-switch :checked="controlled">
        <sl-icon slot="icon" name="search"></sl-icon>
        深度搜索
      </sl-sender-switch>
      <sl-button size="small" @click="controlled = !controlled">切换</sl-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/sender-switch/sender-switch.js';
import '@kdcloudjs/shoelace/dist/components/icon/icon.js';
import '@kdcloudjs/shoelace/dist/components/button/button.js';

const controlled = ref(false);
</script>
```

---

## 注意事项

1. **导入路径**：`import '@kdcloudjs/shoelace/dist/components/sender-switch/sender-switch.js';`
2. **事件**：使用 `@sl-change` 监听选中状态变化，通过 `e.target.checked` 获取新状态
3. **defaultChecked**：仅在首次渲染时生效，后续需通过 `checked` 属性控制
4. **Slots**：`icon`（图标）、`checked`（选中内容）、`unchecked`（未选中内容）、默认 slot（始终显示）

[返回目录](../index.md)
