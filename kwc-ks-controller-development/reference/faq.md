# Controller Development FAQ

This document collects common problems and solutions encountered during Controller development and frontend-backend integration debugging.

---

## ⚠️ Interface Still Returns Old Data/Logic After Modifying Controller

**Cause**: Only `kd project build --type controller` (local compilation) was executed, but `kd project deploy` (upload to environment) was not.

The `build` output "Success" is misleading — it only means local compilation succeeded; the server-side code has not changed at all.

**Solution**:
```bash
kd project deploy    # Uploads controller + kwc + page together
```

**Rule**: After every modification to Controller code (.ts) or .kws metadata, you must execute `kd project deploy`. `build` does not need to be run separately during development.

---

## HTTP 500 + Empty Body = Script Loading-Phase Failure

**Cause**: The Controller script failed during the **loading phase** (import resolution / top-level code execution), never entering any method body. In this case:
- HTTP status code = 500
- Response body is empty (not a JSON error, completely empty)
- try/catch and response.throwException() cannot catch it

**Common loading-phase errors**:
- Import path error (module does not exist)
- Using top-level syntax not supported at runtime
- Incompatible Date constructor usage
- Top-level variable initialization throws an exception

**Troubleshooting method** (binary search):
1. Simplify the Controller method body to `this.response.write(JSON.stringify({ ok: true }))`
2. Deploy and test → if 200 → the problem is in the method body logic
3. If still 500 with empty body → the problem is in top-level/import code
4. Gradually comment out imports and top-level code, deploy and test each time, locating the first line that causes 500

**Important**: When encountering 500 + empty body, **your first diagnostic hypothesis should be loading-phase failure** — do not waste time adding try/catch inside method bodies.

---

## Q1: How to Fill in the endpointConfig.source Field?

**Question**: What value should be filled in for the frontend `adapterApi`'s `endpointConfig.source`? How does it correspond to the backend Controller URL?

**Answer**: `source` corresponds to the complete URL path of the backend Controller, **with the `/{isv}/{app}/` prefix removed**, and path parameters replaced with actual values.

```
Controller .kws url:  /<isv>/<app>/sample/users
Method url:           /{id}
Full path:            /<isv>/<app>/sample/users/{id}

source value:         sample/users/123
                      ↑ Remove prefix    ↑ Path parameters replaced with actual values
```

**More examples**:

| Controller `<url>` | Method `<url>` | source value |
|---------------------|-------------|-----------|
| `/kd/dev/sample/hello` | `/{name}` | `sample/hello/World` |
| `/kd/dev/sample/users` | (empty) | `sample/users` |
| `/kd/dev/sample/orders` | `/{id}/process` | `sample/orders/1001/process` |

---

## Q2: What to Do When Deploy Prompts Duplicate Version Number?

**Question**: Executing `kd project deploy` prompts that the version number is duplicated or too low.

**Answer**: The Controller version number (`<version>`) must be an incrementing positive integer; **deploying with the same version number is not supported**.

**Solution steps**:

1. Open the Controller's .kws metadata file
2. Find the `<version>` tag
3. Increment the version number by 1

```xml
<!-- Before -->
<version>3</version>

<!-- After -->
<version>4</version>
```

4. Rebuild and deploy:

```bash
npm run build:controller
kd project deploy
```

---

## Q3: How to Call KS SDK in a Controller?

**Question**: How to use the capabilities provided by the KingScript SDK in a Controller script?

**Answer**: The Controller's TypeScript script runs in the KingScript engine and can call platform-provided SDKs. SDK availability depends on the deployment environment; it is recommended to confirm the SDK exists before using it.

```typescript
class MyController {
  doSomething(request: any, response: any) {
    try {
      // Call SDK capability (refer to the kingscript-code-generator skill package documentation for specific APIs)
      const result = this.callSdk();
      response.ok(result);
    } catch (e: any) {
      response.throwException(
        e.message || 'SDK call failed',
        500,
        'SDK_ERROR'
      );
    }
  }

  private callSdk() {
    // SDK call logic
    // For specific APIs, refer to the references/sdk/ directory in the kingscript-code-generator skill package
    return { success: true };
  }
}

let kwcController = new MyController();
export { kwcController };
```

> 📌 For detailed SDK API documentation and examples, please refer to the `references/sdk/` directory in the `kingscript-code-generator` skill package.

---

## Q4: Where to Get entityNumber and permItemId for Permission Configuration?

**Question**: Where do the values for `<entityNumber>` and `<permItemId>` in the .kws metadata configuration come from?

**Answer**: These two fields are used for standard permission verification:

- **entityNumber**: Business entity code, defined in the business system's entity management, e.g., `bos_user`
- **permItemId**: Permission item ID, the identifier configured in permission management, e.g., `47150e89000000ac`
- **checkRightApp**: Permission-check app code, usually the same as the app the Controller belongs to

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

If permission control is temporarily not needed (e.g., during development and debugging), you can set it to skip permission checks:

```xml
<permission>
    <permission>
        <permitAll>true</permitAll>
    </permission>
</permission>
```

---

## Q5: How to Set the Correct Status Code for Error Responses?

**Question**: How to return an error response with a specific HTTP status code from a Controller?

**Answer**: Use the `response.throwException(message, httpCode, bizCode)` method:

```typescript
// Parameters: error message, HTTP status code, business error code
response.throwException('User not found', 404, 'USER_NOT_FOUND');
response.throwException('Invalid parameters', 400, 'INVALID_PARAMS');
response.throwException('Forbidden', 403, 'FORBIDDEN');
response.throwException('Internal server error', 500, 'INTERNAL_ERROR');
```

**Common status code reference**:

| Status Code | Meaning | Usage Scenarios |
|--------|------|---------|
| 400 | Bad request | Required field missing, format validation failed |
| 401 | Unauthorized | Not logged in or token expired |
| 403 | Forbidden | User lacks permission to perform this operation |
| 404 | Not found | Requested resource does not exist |
| 500 | Internal error | Unexpected server-side exception |

**Note**: After calling `throwException`, it is recommended to `return` immediately to prevent subsequent code from continuing to execute:

```typescript
if (!body['name']) {
  response.throwException('Username cannot be empty', 400, 'MISSING_NAME');
  return;  // ← Must return
}
```

---

## Q6: How to Handle Path Parameter Types?

**Question**: What is the difference between `getPathVariable` and `getLongPathVariable`? Which one should I use?

**Answer**:

| Method | Return Type | Usage Scenarios |
|------|---------|---------|
| `getPathVariable(name)` | string | Path parameter is a string (e.g., name, code) |
| `getLongPathVariable(name)` | long | Path parameter is a numeric ID |

```typescript
// String path parameter — GET /users/{username}
const username = request.getPathVariable('username');  // → 'zhangsan'

// Numeric ID path parameter — GET /users/{id}
const userId = request.getLongPathVariable('id');       // → 12345
```

**Selection principle**: If the path parameter is a numeric ID, use `getLongPathVariable`; if it is a string (name, code, etc.), use `getPathVariable`.

---

## Q7: How to Troubleshoot Frontend 404 When Calling Backend API?

**Question**: Frontend calls backend API via `adapterApi` and gets a 404 error.

**Troubleshooting checklist**:

1. **Check source path**
   - Confirm `endpointConfig.source` correctly removes the `/{isv}/{app}/` prefix
   - Path parameters are replaced with actual values (e.g., `{id}` → `123`)

2. **Check version**
   - `endpointConfig.version` should be `'v1'`

3. **Check deployment status**
   - Has the Controller been built with `npm run build:controller` + `kd project deploy`
   - Has the version in the .kws metadata been incremented

4. **Check HTTP method**
   - Does `doGet` / `doPost` match the `<httpMethod>` in the Controller .kws metadata

5. **Check isv and app**
   - Do `endpointConfig.isv` and `endpointConfig.app` match the deployment environment

---

## Q8: How to Make Controller Code Changes Take Effect?

**Question**: Modified the Controller's .kws metadata or TypeScript code, but the API still returns old results.

**Answer**: After every Controller modification, you must execute the following steps:

```bash
# Step 1: Increment the version in .kws metadata
#   <version>1</version>  →  <version>2</version>

# Step 2: Deploy (automatically builds and uploads)
kd project deploy
```

> ⚠️ `npm run build:controller` only does local compilation and does not upload. `kd project deploy` handles both build + upload; there is no need to run build separately during development.

**Important**: The version number must be incremented, otherwise deployment will fail. Overwriting with the same version number is not supported.

---

## Q9: How Should the Frontend Handle Backend Errors?

**Question**: The backend Controller returns an error via `throwException`; how does the frontend get the error information?

**Answer**: In the `adapterApi` callback function, obtain the error information via the `error` parameter:

```typescript
const adapter = adapterApi.doGet(({ data, error }) => {
  if (error) {
    // error.message contains the first parameter of backend throwException
    console.error('Request failed:', error.message);
    
    // Display error message in UI
    setErrorMessage(error.message);
    return;
  }
  
  // Process data normally
  setData(data);
});
```

**Correspondence between backend throwException and frontend error**:

```typescript
// Backend
response.throwException('User not found', 404, 'USER_NOT_FOUND');

// Frontend callback
({ data, error }) => {
  // error.message === 'User not found'
}
```

---

## Q10: What to Note When Using kd debug for Integration?

**Question**: What should I pay attention to when using `kd debug` for frontend-backend integration debugging?

**Answer**:

### Must Use Background Mode

When executing `kd debug` in an AI programming tool, **you must set `is_background: true`**; otherwise, the foreground mode will be forcefully terminated after a 90-second timeout, killing the local service.

### Wait for Service to Be Ready

After `kd debug` starts, it immediately opens the browser, but the local service may not be ready yet. You need to:
1. Check the process startup status via `get_terminal_output`
2. Wait for the service to finish starting before refreshing the page

### Integration Debugging Checklist

1. **Backend**: Ensure the Controller has been deployed to the target environment (increment version → build → deploy)
2. **Frontend**: Ensure the component's `adapterApi` `endpointConfig` is correctly configured
3. **Startup**: Execute `kd debug` (background mode) to start local debugging
4. **Verification**: Access the corresponding page in the browser, open the developer tools Network panel to confirm request/response

 📌 For more details on local debugging, refer to the scaffold description document in the scaffold workflow.

---

## QueryServiceHelper.query topN Parameter Trap

**Question**: In the 5-argument overload of `QueryServiceHelper.query(entity, fields, filters, orderBy, topN)`, `topN=0` is interpreted by the Cosmic runtime as `LIMIT 0` (i.e., returns no records), not "no limit".

**Correct usage**:
- Query all records: Use the 3-argument overload `QueryServiceHelper.query(entity, fields, filters)` — do not pass orderBy and topN
- Limit the number of records: topN must be > 0 (e.g., `topN=100`)
- **Do not use** `topN=0`

**Incorrect examples**:
```typescript
// ❌ topN=0 = LIMIT 0, returns empty result
const rows = QueryServiceHelper.query('kdtest_feiyongbaoxiao', 'id,billno', '', 'createTime desc', 0);

// ✅ No limit — use 3-argument overload
const rows = QueryServiceHelper.query('kdtest_feiyongbaoxiao', 'id,billno', '');

// ✅ Limit to 100 records
const rows = QueryServiceHelper.query('kdtest_feiyongbaoxiao', 'id,billno', '', 'createTime desc', 100);
```

---

## Diagnostic Pattern for Empty Query Results

When the Controller test passes (HTTP 200) but `--assert-not-empty data` fails, you cannot simply conclude "there is no data." Follow this diagnostic flow:

### Diagnostic Steps

1. **First use meta-query-api.mjs to confirm the entity exists and has data**:
   ```bash
   node $SKILL_DIR/scripts/meta-query-api.mjs queryFormsByApp --env vb --appNumber <app> --keyword <keyword>
   ```

2. **Write a diagnostic method that queries the same entity in parallel using multiple approaches**:
   ```typescript
   // Add a temporary diagnose method in the Controller
   @url('/diagnose')
   @httpMethod('GET')
   diagnose(): void {
     const entity = 'your_entity_number';
     const results: any = { entity };
     
     // Method 1: 3-argument query (most reliable)
     try {
       const rows = QueryServiceHelper.query(entity, 'id,billno', '');
       results.m1_query3 = { count: rows.length, ok: rows.length > 0 };
     } catch(e) { results.m1_query3 = { error: e.message }; }
     
     // Method 2: queryPrimaryKeys
     try {
       const ids = QueryServiceHelper.queryPrimaryKeys(entity, '', 10);
       results.m2_primaryKeys = { count: ids.length, ok: ids.length > 0 };
     } catch(e) { results.m2_primaryKeys = { error: e.message }; }
     
     // Method 3: queryOne
     try {
       const row = QueryServiceHelper.queryOne(entity, 'id,billno', '');
       results.m3_queryOne = { hasRow: row != null, ok: row != null };
     } catch(e) { results.m3_queryOne = { error: e.message }; }
     
     // Method 4: exists
     try {
       const ex = QueryServiceHelper.exists(entity, '');
       results.m4_exists = { exists: ex, ok: ex };
     } catch(e) { results.m4_exists = { error: e.message }; }
     
     this.response.write(JSON.stringify(results));
   }
   ```

3. **Judge based on diagnostic results**:
   - Multiple methods all return data → Original query code has issues (e.g., topN=0, incorrect filter conditions)
   - All methods return no data → The entity genuinely has no data; confirm the entity code and environment
   - Some return data, some don't → filter or orderBy has issues

4. **Remove the diagnose method after fixing** (optional: keep for future debugging)
