# KWC KS Controller Development Hard Rules

All KWC KingScript Controller development work must strictly comply with the following constraints. Code that violates these rules cannot be deployed or will not run correctly.

## 1. Controller Class Structure Constraints

### 1.1 Class Naming Conventions

- **Class name**: Use PascalCase, preferably with a `Controller` suffix
  - Good: `UserController`, `OrderController`, `ProductController`
  - Bad: `userController`, `user_controller`, `UserCtrl`
- **File name**: Must match the class name
  - Good: `UserController.ts`
  - Bad: `user-controller.ts`, `UserCtrl.ts`

### 1.2 Class Export Convention

You must create a class instance and export it as `kwcController`:

```typescript
class UserController {
  // method definitions
}

// Must export the instance with the fixed name kwcController
let kwcController = new UserController();
export { kwcController };
```

**Forbidden**:
- Exporting the class directly: `export { UserController };`
- Using a different instance name: `export { controller };`
- Using a default export: `export default new UserController();`

### 1.3 Method Signature Convention

- **Method name**: Use camelCase
  - Good: `getUser`, `createOrder`, `updateProduct`, `deleteItem`
- **Method parameters**: Always `(request: any, response: any)`
- **Example**:
  ```typescript
  class UserController {
    getUser(request: any, response: any) {
      // implementation
    }

    createUser(request: any, response: any) {
      // implementation
    }
  }
  ```

## 2. Controller Metadata (.kws) Constraints

> The .kws file uses XML format but has the `.kws` extension. It is the metadata file format for Controllers in the KWC ecosystem (similar to component metadata `.kwc` and page metadata `.kwp`).

### 2.1 Required Fields

The following fields are all required; missing any of them will cause deployment to fail:

| Field | Description | Example |
|------|------|------|
| `name` | Controller name (globally unique) | `UserScriptController` |
| `isv` | ISV (vendor) code | `kingdee` or a custom code |
| `app` | Business application code | `dev`, `bos`, `hr` |
| `version` | Version number (positive integer) | `1`, `2`, `3` |
| `url` | Controller root URL | `/kd/dev/sample/users` |
| `scriptFile` | Script file name | `UserController.ts` |
| `methods` | Method definition set (at least 1) | See below |

### 2.2 isv Rules

- Kingdee in-house uses `kingdee`
- Third-party (secondary development) vendors use their own code (e.g. `myisv`, `partner001`)
- **Must be read from the `isv` field in `.kd/config.json`; guessing or hard-coding is forbidden**

### 2.3 app Rules

- Must match the `app` field in the current project's `.kd/config.json`
- **Must be read from `.kd/config.json`; guessing or hard-coding is forbidden**
- Common values: `dev`, `bos`, `hr`, `fi`, etc. (in-house); secondary-development scenarios may use any custom value

### 2.4 url Rules (Mandatory)

The construction of `<url>` must be based on the real `isv` and `app` values read from `.kd/config.json`:

```
// .kd/config.json example
{ "isv": "kdtest", "app": "kdtest_react", ... }

// Construction rule: read isv → derive vendor prefix → build URL
<isv>kdtest</isv>
<app>kdtest_react</app>
<url>/kdtest/kdtest_react/api/sliconstest</url>
```

**Steps:**
1. Read `.kd/config.json` to get the real values of `isv` and `app`
2. If `isv === 'kingdee'`, the URL prefix is `/kd/{app}/`
3. If `isv` is any other value, the URL prefix is `/{isv}/{app}/`
4. After the prefix, append the custom subdirectory and resource name

### 2.5 version Rules

- Type: positive integer (1, 2, 3...)
- Must be incremented on every deployment
- Overwriting the same version number is **not supported**
- For a new Controller's first deployment, set version to `1`

### 2.6 scriptFile Rules

- Must match the actual script file name
- Must include the file extension (`.ts`)

## 3. URL Path Constraints

### 3.1 URL Format Requirements

```
/{vendor prefix}/{app code}[/custom subdirectory]/{resource (plural)}
```

**At least 3 levels of path**:
- Good: `/kd/dev/sample/users` (in-house example)
- Good: `/kd/bos/usercenter/users` (in-house example)
- Good: `/kdtest/kdtest_react/api/sliconstest` (secondary-development example: isv=kdtest, app=kdtest_react)
- Good: `/myisv/myapp/orders` (secondary-development example: isv=myisv, app=myapp)
- Bad: `/api/sliconstest` (missing vendor prefix and app code)
- Bad: `/kd/dev` (missing resource path)
- Bad: `/dev/sample/users` (missing vendor prefix)

> **Key point**: The first two levels of the URL must strictly correspond to `<isv>` in the .kws file and `app` in `.kd/config.json`. You may not fabricate prefixes.

### 3.2 Vendor Prefix Rules

| isv value | URL prefix | Description |
|--------|---------|------|
| `kingdee` | `/kd/` | Kingdee in-house uniformly uses `kd` |
| any other | `/{isv}/` | Secondary-development vendors use their own code |

### 3.3 Full URL Composition Rules

Final access URL = **class URL** + **method URL**

| Scenario | Class URL | Method URL | Final access URL |
|------|--------|---------|-------------|
| In-house | `/kd/dev/users` | `/{id}` | `/kd/dev/users/{id}` |
| In-house | `/kd/dev/users` | `` (empty) | `/kd/dev/users` |
| In-house | `/kd/dev/users` | `/profile` | `/kd/dev/users/profile` |
| Secondary dev | `/kdtest/kdtest_react/api/icons` | `/{id}` | `/kdtest/kdtest_react/api/icons/{id}` |
| Secondary dev | `/kdtest/kdtest_react/api/icons` | `` (empty) | `/kdtest/kdtest_react/api/icons` |

## 4. Method Configuration Constraints

### 4.1 Required Fields

Every method must include:

| Field | Description | Allowed values |
|------|------|--------|
| `name` | Method name (corresponds to the method in the script) | camelCase string |
| `httpMethod` | HTTP request method | `GET`, `POST`, `PUT`, `DELETE` |
| `permission` | Permission configuration | See below |

### 4.2 httpMethod Restrictions

Only the following values (uppercase) are allowed:
- `GET` — query
- `POST` — create
- `PUT` — update
- `DELETE` — delete

## 5. Permission Configuration Constraints

Every method **must** have a `<permission>` configuration.

### 5.1 Standard Permission Check (Recommended)

```xml
<permission>
    <permission>
        <permitAll>false</permitAll>
        <entityNumber>bos_user</entityNumber>
        <permItemId>47150e89000000ac</permItemId>
        <checkRightApp>dev</checkRightApp>
    </permission>
</permission>
```

### 5.2 Skip the Unified Permission Check

The Controller method handles permission logic itself:

```xml
<permission>
    <permission>
        <permitAll>true</permitAll>
    </permission>
</permission>
```

### 5.3 Allow Anonymous Access

Both `permitAll` and `anonymousUser` must be enabled simultaneously:

```xml
<permission>
    <permission>
        <permitAll>true</permitAll>
        <anonymousUser>true</anonymousUser>
    </permission>
</permission>
```

## 6. Request Handling Constraints

> `request` and `response` are proprietary objects of the KingScript runtime. For the full API, see Chapter 5 (Request Handling API) and Chapter 6 (Response Handling API) of the Script Controller Development Guide in the `kingscript-code-generator` skill package.
>
> **Servlet / Express style APIs are forbidden**: `request.getParameter()` / `.getAttribute()` / `.getSession()` / `.getCookies()` (Servlet); `request.body` / `.params` / `.query` (Express); `response.send()` / `.json()` / `.status()` / `.setHeader()` (Express/Node.js), etc., **do not exist** in the KingScript runtime.

## 7. Response Handling Constraints

### 7.0 Response Data Type Constraint (P0 high-frequency issue)

**Known platform limitation**: When the KS runtime serializes `response.ok(data)`, it **may convert a native JavaScript array `[]` into an empty object `{}`**, causing the data type received by the frontend to differ from what the backend code defines.

**Typical failure chain**:
```
Backend code writes items: ['a', 'b', 'c']
↓ KS runtime serialization
Frontend actually receives items: {}
↓ Frontend calls .map() expecting string[]
↓ Runtime exception → blank screen
```

**Hard rule — complex types must use Java mapping collections**:

When the data returned by `response.ok()` contains **array or object structures**, you **must** use the Java mapping types `ArrayList` and `HashMap`. Using JavaScript native `[]` and `{}` is **forbidden**.

```typescript
import { ArrayList, HashMap } from '@cosmic/bos-script/java/util';
```

> When the return value is only a simple type (string, number, boolean, etc.), it may be passed directly into `response.ok()` without wrapping.

**Comparison example**:

```typescript
import { ArrayList, HashMap } from '@cosmic/bos-script/java/util';

// Bad: directly using JS native objects and arrays
response.ok({
  title: 'Title',
  items: [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]
});

// Good: use HashMap to construct objects, ArrayList to construct lists
const list = new ArrayList();
for (const row of dataRows) {
  const item = new HashMap();
  item.put('id', row.getId());
  item.put('name', row.getString('name'));
  list.add(item);
}

const result = new HashMap();
result.put('title', 'Title');       // simple types: put directly
result.put('items', list);          // lists: use ArrayList
result.put('total', list.size());   // numbers: put directly
response.ok(result);

// Good: simple types can be returned directly
response.ok('Operation succeeded');  // string
response.ok(42);                     // number
```

**Fallback — JSON.stringify (only when ArrayList/HashMap cannot be used)**:

```typescript
// Fallback: JSON-serialize the array to a string, then the frontend calls JSON.parse
response.ok({
  title: 'Title',
  items: JSON.stringify(['a', 'b', 'c'])
});
```

### 7.1 Success Response

```typescript
// Standard success response (HTTP 200)
response.ok(data);

// Specify status code
response.of(201, { message: 'Created successfully', id: 123 });
```

### 7.2 Error Response

Use the `throwException` method:

```typescript
response.throwException(message, httpStatusCode, businessErrorCode);
```

**Parameters**:
- `message`: Exception message
- `httpStatusCode`: HTTP status code
- `businessErrorCode`: Business error code

### 7.3 Common Status Codes

| Status | Meaning | Use case |
|--------|------|---------|
| 200 | Success | Query or update succeeded |
| 201 | Created | POST resource creation succeeded |
| 400 | Bad request | Request parameter validation failed |
| 401 | Unauthorized | Not logged in or session expired |
| 404 | Not found | Resource does not exist |
| 500 | Internal error | Server exception |

### 7.4 Do Not Ignore Error Handling

All exception paths must have an explicit error response:

```typescript
// Good: error handling present
if (!body['username']) {
  response.throwException('Username cannot be empty', 400, 'MISSING_USERNAME');
  return;
}

// Bad: exception swallowed
try {
  // business logic
} catch (e) {
  // no error handling
}
```

## 8. SDK Usage Constraints

### 8.1 Confirm Before Calling

Before calling any SDK class/method, you **must** first confirm its existence in the kingscript-code-generator skill package indexes:
- Class lookup: `../kingscript-code-generator/references/sdk/indexes/class-index.md`
- Method lookup: `../kingscript-code-generator/references/sdk/indexes/method-index.md`
- Scenario lookup: `../kingscript-code-generator/references/sdk/indexes/scenario-index.md`

### 8.2 Type Caveats

- Watch out for precision issues with the Long type
- Monetary calculations **must** use BigDecimal
- Do not assume any given Java open capability is available

## 9. Prohibitions

The following operations are **absolutely forbidden**:

1. **Do not fabricate KingScript APIs**
   - Do not invent non-existent APIs, event names, or context objects
   - All SDK calls must be confirmed to exist in the indexes

2. **Do not run build or deploy commands**
   - Bad: `npm run build:controller`
   - Bad: `kd project build --type controller`
   - Bad: `kd project deploy`
   - Build and deployment are handled by the scaffold workflow
   - Good: **However, running `../scripts/test-controller.mjs` is allowed**: this script only handles "login + Cookie + calling already-deployed /kwc/v1 interfaces", does not modify the project, and does not deploy any artifacts. It is a required self-check after the Controller is written, and does not fall under the prohibition.

3. **Do not modify frontend component code**
   - Bad: modifying `*.tsx` / `*.vue` / `*.js` frontend component files
   - Bad: modifying `*.module.scss` / `*.css` style files

4. **Do not modify metadata files**
   - Bad: modifying `.js-meta.kwc` component metadata
   - Bad: modifying `.page-meta.kwp` page metadata

5. **Do not run code formatting commands**
   - Bad: `eslint --fix`
   - Bad: `prettier --write`

## 10. Mandatory Self-Check Checklist

1. [ ] **Class export**: Is the `kwcController` instance correctly exported?
2. [ ] **Method signature**: Are the parameters `(request: any, response: any)` used?
3. [ ] **.kws metadata required fields**: Are name/isv/app/version/url/scriptFile/methods all present?
4. [ ] **isv/app source**: Are isv and app real values read from `.kd/config.json` (rather than guessed or hard-coded)?
5. [ ] **URL path**: Does the URL prefix strictly correspond to isv/app? Are there at least 3 path levels?
6. [ ] **Permission configuration**: Does every method have a permission block?
7. [ ] **Parameter retrieval**: Are the correct typed methods used (e.g. `getLongPathVariable`)?
8. [ ] **Error handling**: Do all exception paths have `throwException` handling?
9. [ ] **SDK confirmation**: Have the SDK methods called been confirmed to exist in the indexes?
10. [ ] **Response data type**: When returning complex types (arrays/objects), are `ArrayList`/`HashMap` used? Simple types may be returned directly.
11. [ ] **Prohibitions**: Have you avoided running any build/deploy/formatting commands?
12. [ ] **End-to-end self-check**: After deployment, have you run `../scripts/test-controller.mjs` against each method covering "normal value + boundary value + expected error value" — three categories of cases? Have all errors been resolved? "If the self-check has not fully passed → frontend integration is not allowed."
13. [ ] **Retry limit**: Has the "modify → deploy → test" loop after self-check failures exceeded 3 iterations? If more than 3 iterations, have you switched to Mock data mode (frontend uses hard-coded fake data, with the adapterApi call kept in comments) rather than continuing the fix loop?

## 11. Best Practices

### 11.1 Error Handling Best Practices

- Provide try-catch around all operations that may fail
- Use explicit business error codes (e.g. `MISSING_PARAM`, `USER_NOT_FOUND`)
- Provide meaningful error messages that aid frontend display and debugging
- Distinguish client errors (4xx) from server errors (5xx)

### 11.2 Data Validation Best Practices

- Validate required parameters as the first thing in the method
- Prefer strongly typed methods (e.g. `getLongPathVariable` over `getPathVariable`)
- Apply defensive checks for null and undefined
- Validate boundary conditions like string length and numeric range

### 11.3 SDK Usage Best Practices

- Before calling an SDK, confirm the target class/method exists in the SDK indexes
- Use BigDecimal for monetary calculations to avoid floating-point precision issues
- Mind pagination when querying data; avoid loading the entire dataset at once
- Understand the performance implications of long transactions and query caching
