import { KingdeeElement, api, track } from '@kdcloudjs/kwc';

// API 属性：对外暴露
export default class ControlName extends KingdeeElement {
  @api label = '';
  @api variant = 'primary';

  // 内部状态
  count = 0; // 基本类型无需 @track
  @track items = []; // LWC 中如果对象/数组需要响应式，必须加 @track
  @track pagination = {
    pageSize: 10,
    currentPage: 1
  };

  // 生命周期：插入 DOM 时
  connectedCallback() {
    // 数据获取或订阅事件通常在这里进行
    console.log('Component connected');
  }

  // 生命周期：渲染后绑定事件
  renderedCallback() {
    // ⚠️ 禁止调用 super.renderedCallback()

    // 防止重复绑定
    if (this._eventsBound) return;
    this._eventsBound = true;

    this.bindShoelaceEvents();
  }

  // 生命周期：销毁时解绑事件
  disconnectedCallback() {
    this.unbindShoelaceEvents();
    this._eventsBound = false;
  }

  // 集中管理 Shoelace 事件绑定配置
  get shoelaceEventBindings() {
    return [
      ['.inputEl', 'sl-input', this.handleInput],
      ['.selectEl', 'sl-change', this.handleChange]
    ];
  }

  bindShoelaceEvents() {
    // 存储绑定的函数引用，确保解绑时能正确移除
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

  unbindShoelaceEvents() {
    if (this._boundHandlers) {
      // 正确移除事件监听器，避免内存泄漏
      this._boundHandlers.forEach(({ el, event, boundHandler }) => {
        el.removeEventListener(event, boundHandler);
      });
      this._boundHandlers = [];
    }
  }

  // ===== 计算逻辑必须在 JS 中完成，禁止在 HTML 中使用表达式 =====
  get isPrimary() {
    return this.variant === 'primary';
  }

  get buttonClass() {
    // 在 HTML 中直接使用 {buttonClass}，禁止 {isPrimary ? 'btn-primary' : 'btn-default'}
    return this.isPrimary ? 'btn-primary' : 'btn-default';
  }

  get displayItems() {
    // 若有列表渲染，必须在 JS 中生成 HTML 字符串或处理数据
    return this.items.map(item => ({
      ...item,
      displayName: item.name.toUpperCase() // 数据处理在这里完成
    }));
  }

  // ===== 事件处理 =====
  handleInput(event) {
    // 使用 event.target.value 获取值
    this.value = event.target.value;
  }

  handleChange(event) {
    console.log('Changed:', event.target.value);
  }

  handleClick(event) {
    this.count++;
    this.dispatchEvent(new CustomEvent('change', {
      detail: { count: this.count }
    }));
  }
}
