# 语音输入

[返回目录](../index.md)

## 功能说明

通过 `allowSpeech` 启用语音输入功能。支持两种模式：布尔模式（使用浏览器内置语音识别）和受控模式（接入第三方语音服务）。

## 示例代码（Vue）— 内置语音

```vue
<template>
  <div>
    <sl-sender
      ref="senderRef"
      placeholder="点击麦克风按钮开始语音输入..."
      allowSpeech
      @sl-speech-toggle="handleSpeechToggle"
      @sl-submit="handleSubmit"
    ></sl-sender>
    <div style="margin-top: 0.5rem; font-size: 0.875rem;">
      状态: {{ status }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';

const senderRef = ref(null);
const status = ref('空闲');

const handleSpeechToggle = () => {
  const sender = senderRef.value;
  if (sender) {
    status.value = sender.speechRecording ? '录音中...' : '空闲';
  }
};

const handleSubmit = (e) => {
  console.log('提交:', e.detail.value);
  senderRef.value.loading = true;
  setTimeout(() => {
    senderRef.value.value = '';
    senderRef.value.loading = false;
  }, 3000);
};
</script>
```

## 示例代码（Vue）— 自定义语音服务（受控模式）

```vue
<template>
  <div>
    <sl-sender
      ref="senderRef"
      placeholder="点击麦克风使用自定义语音..."
      :allowSpeech.prop="allowSpeechConfig"
    ></sl-sender>
    <div style="margin-top: 0.5rem; font-size: 0.875rem;">
      录音: {{ recording ? '开启' : '关闭' }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';

const senderRef = ref(null);
const recording = ref(false);

const allowSpeechConfig = computed(() => ({
  recording: recording.value,
  onRecordingChange: (nextRecording) => {
    recording.value = nextRecording;
    if (nextRecording) {
      // 模拟第三方语音服务
      setTimeout(() => {
        const sender = senderRef.value;
        if (sender) {
          sender.value = sender.value + '来自自定义语音服务的文本 ';
        }
        recording.value = false;
      }, 2000);
    }
  }
}));
</script>
```

---

## 注意事项

1. **布尔模式**：直接写 `allowSpeech` 属性即可，使用浏览器内置 `SpeechRecognition` API
2. **受控模式**：传入 `{ recording, onRecordingChange }` 对象，需使用 `:allowSpeech.prop="config"` 传递
3. **浏览器兼容**：内置语音依赖 `webkitSpeechRecognition`，部分浏览器不支持
4. **权限**：首次使用需要用户授权麦克风权限

[返回目录](../index.md)
