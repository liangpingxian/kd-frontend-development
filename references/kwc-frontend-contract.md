# KWC Frontend Contract (What General Frontend Knowledge Cannot Infer)

This document **only** records KWC-framework-specific contracts that cannot be deduced from general frontend knowledge.
Which UI library to use, how to lay things out, how to write CSS, whether to use div or Shoelace — **all are free for you to decide** and are not constrained here.

Applies to React / Vue / LWC frameworks. Framework-specific syntax differences (hooks vs composition vs class) follow their respective conventions.

---

## 1. Component Props Shape (High-Frequency Pitfall)

The KWC runtime **directly spreads the KwcConfig fields as props**, without wrapping them in `{ config }`.

```tsx
// ✅ Correct: Destructure directly
function MyComponent(props: KwcConfig) {
  const { pageId, isvId, moduleId } = props;
}

// ❌ Wrong: Causes "Cannot read properties of undefined"
function MyComponent(props: { config: KwcConfig }) {
  const { pageId } = props.config;  // props.config is undefined
}
```

Reason: the framework renders as `<MyComponent {...kwcConfig} />`, not `<MyComponent config={kwcConfig} />`.

## 2. config Object Structure

KWC context fields available on the component props:

| Field | Description |
|------|------|
| `isvId` | ISV (vendor) ID (used as `endpointConfig.isv` when calling a Controller) |
| `moduleId` | Application ID (used as `endpointConfig.app` when calling a Controller) |
| `pageId` | Page ID |
| `formId` | Form ID |
| `controlId` | Control ID |
| `metaProps` | Properties configured for this instance in the page metadata (from `<propertys>`) |

## 3. Calling Backend Controllers: Must Use adapterApi

**Using `fetch` / `axios` directly in the component to call `/kwc/v1` is forbidden** — it will hit authentication and CORS issues.

Always use the `adapterApi` provided by `@kdcloudjs/kwc-shared-utils/api`. For the complete calling specification, `endpointConfig.source` assembly rules, error troubleshooting, and defensive response parsing, see:

→ [`../kwc-ks-controller-development/reference/frontend-integration.md`](../kwc-ks-controller-development/reference/frontend-integration.md)

**You must read this document before writing adapterApi call code**.

## 4. Type Declaration Synchronization (declarations.d.ts)

Every time you use a new `@kdcloudjs/*` package or a third-party library without type definitions, you must append to the project root's `declarations.d.ts`:

```ts
declare module '@kdcloudjs/some-package';
declare module 'echarts-for-react';
```

Otherwise, TS compilation will report "Cannot find module."

## 5. Delivery Path vs Local Preview

- `main.tsx` + `npm run dev` **are only for local auxiliary preview**, not the delivery path
- The final page rendering depends on the `.page-meta.kwp` deployed to the environment + the component metadata `.js-meta.kwc`
- Do not mistake "the component is mounted in main.tsx" for "the feature is complete"

## 6. Component Metadata Contract (Tightly Coupled with Code)

- The component `name` in `.js-meta.kwc` must **exactly match** the page metadata `<control type="...">` (case-sensitive)
- The props fields read in the component code correspond to the `<property>` declarations in `.js-meta.kwc` + the values configured in `<propertys>` in the page metadata
- For details, see [`./component-metadata.md`](./component-metadata.md) and [`./page-metadata.md`](./page-metadata.md)
