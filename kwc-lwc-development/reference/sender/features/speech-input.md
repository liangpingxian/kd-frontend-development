# 语音输入

[返回目录](../index.md)

## 功能说明

通过 `allow-speech` 启用语音输入功能。支持两种模式：布尔模式（使用浏览器内置语音识别）和受控模式（接入第三方语音服务，需通过 JS 设置对象）。

## 示例代码（LWC）— 内置语音

**index.html**
```html
<template>
  <div>
    <sl-sender kwc:external
      class="sender"
      placeholder="点击麦克风按钮开始语音输入..."
      allow-speech
    ></sl-sender>
    <div class="status">状态: {speechStatus}</div>
  </div>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';

export default class SenderSpeechBuiltin extends KingdeeElement {
  speechStatus = '空闲';
  _eventsBound = false;

  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    const sender = this.template.querySelector('.sender');
    sender.addEventListener('sl-speech-toggle', () => {
      this.speechStatus = sender.speechRecording ? '录音中...' : '空闲';
    });
    sender.addEventListener('sl-submit', (e) => {
      console.log('提交:', e.detail.value);
      sender.loading = true;
      setTimeout(() => {
        sender.value = '';
        sender.loading = false;
      }, 3000);
    });
  }
}
```

## 示例代码（LWC）— 自定义语音服务

**index.html**
```html
<template>
  <div>
    <sl-sender kwc:external
      class="sender"
      placeholder="点击麦克风使用自定义语音..."
    ></sl-sender>
    <div class="status">录音: {recordingText}</div>
  </div>
</template>
```

**index.js**
```js
import { KingdeeElement } from '@kdcloudjs/kwc';
import '@kdcloudjs/shoelace/dist/components/sender/sender.js';

export default class SenderSpeechCustom extends KingdeeElement {
  recordingText = '关闭';
  _eventsBound = false;

  renderedCallback() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    const sender = this.template.querySelector('.sender');

    // 受控语音配置 — 通过 JS 设置对象模式
    sender.allowSpeech = {
      recording: false,
      onRecordingChange: (nextRecording) => {
        // 更新受控配置
        sender.allowSpeech = {
          ...sender.allowSpeech,
          recording: nextRecording
        };
        this.recordingText = nextRecording ? '开启' : '关闭';

        if (nextRecording) {
          // 模拟第三方语音服务
          setTimeout(() => {
            sender.value = sender.value + '来自自定义语音服务的文本 ';
            sender.allowSpeech = {
              ...sender.allowSpeech,
              recording: false
            };
            this.recordingText = '关闭';
          }, 2000);
        }
      }
    };
  }
}
```

---

## 注意事项

1. **布尔模式**：HTML 中直接写 `allow-speech` 使用浏览器内置 `SpeechRecognition` API
2. **受控模式**：通过 JS 设置 `sender.allowSpeech = { recording, onRecordingChange }` 对象，禁用内置语音，由外部控制录音状态
3. **浏览器兼容**：内置语音依赖 `webkitSpeechRecognition`，部分浏览器不支持
4. **权限**：首次使用需要用户授权麦克风权限
5. **受控模式属性设置**：对象模式的 `allowSpeech` 必须在 JS 中通过 `querySelector` 设置，不能在 HTML 中绑定

[返回目录](../index.md)
