# KWC 前端契约（Claude 猜不出来的部分）

本文档**只**记录 KWC 框架特有的、Claude 凭通用前端知识无法推导的契约。
组件用什么 UI 库、布局怎么排、CSS 怎么写、用 div 还是 Shoelace，**全部由 Claude 自由发挥**，不在此约束。

适用于 React / Vue / LWC 三种框架。框架特有语法差异（hooks vs composition vs class）按各自习惯写即可。

---

## 1. 组件入参形状（高频踩坑）

KWC 运行时**直接将 KwcConfig 的字段作为 props 展开传入**，不会用 `{ config }` 包裹。

```tsx
// ✅ 正确：直接解构
function MyComponent(props: KwcConfig) {
  const { pageId, isvId, moduleId } = props;
}

// ❌ 错误：会导致 Cannot read properties of undefined
function MyComponent(props: { config: KwcConfig }) {
  const { pageId } = props.config;  // props.config 是 undefined
}
```

原因：框架渲染时是 `<MyComponent {...kwcConfig} />`，不是 `<MyComponent config={kwcConfig} />`。

## 2. config 对象结构

组件 props 上可用的 KWC 上下文字段：

| 字段 | 说明 |
|------|------|
| `isvId` | 开发商 ID（调 Controller 时作为 `endpointConfig.isv`） |
| `moduleId` | 应用 ID（调 Controller 时作为 `endpointConfig.app`） |
| `pageId` | 页面 ID |
| `formId` | 表单 ID |
| `controlId` | 控件 ID |
| `metaProps` | 页面元数据中为该实例配置的属性（来自 `<propertys>`） |

## 3. 调用后端 Controller：必须走 adapterApi

**禁止在组件里直接 `fetch` / `axios` 调用 `/kwc/v1`**——会撞鉴权和 CORS。

统一使用 `@kdcloudjs/kwc-shared-utils/api` 提供的 `adapterApi`。完整调用规范、`endpointConfig.source` 拼装规则、错误排查、防御性响应解析，详见：

→ [`../kwc-ks-controller-development/reference/frontend-integration.md`](../kwc-ks-controller-development/reference/frontend-integration.md)

**写 adapterApi 调用代码前必须读这一份**。

## 4. 类型声明同步（declarations.d.ts）

每使用一个新的 `@kdcloudjs/*` 包或无类型定义的第三方库，必须在工程根的 `declarations.d.ts` 中追加：

```ts
declare module '@kdcloudjs/some-package';
declare module 'echarts-for-react';
```

否则 TS 编译会报"找不到模块"。

## 5. 交付路径与本地预览的区别

- `main.tsx` + `npm run dev` **只用于本地辅助预览**，不是交付路径
- 最终页面渲染依赖部署到环境的 `.page-meta.kwp` + 组件元数据 `.js-meta.kwc`
- 不要把"main.tsx 里挂上了组件"误判为"功能完成"

## 6. 组件元数据契约（与代码强耦合）

- `.js-meta.kwc` 中的组件 `name` 必须与页面元数据 `<control type="...">` **完全一致（含大小写）**
- 组件代码里读到的 props 字段，对应 `.js-meta.kwc` 中 `<property>` 声明 + 页面元数据中 `<propertys>` 配置的值
- 详见 [`./component-metadata.md`](./component-metadata.md) 和 [`./page-metadata.md`](./page-metadata.md)
