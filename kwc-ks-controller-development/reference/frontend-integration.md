# Frontend Controller API Integration Guide via adapterApi

> **Scope**: This guide is the **unified reference document** for frontend calling backend Controller APIs, referenced by the main skill package `references/kwc-frontend-contract.md`. You must read this document before writing API call code in frontend components.

## 1. adapterApi Basics

The frontend calls backend Controller APIs via `adapterApi` provided by `@kdcloudjs/kwc-shared-utils/api`.

```typescript
import { adapterApi } from '@kdcloudjs/kwc-shared-utils/api';
```

`adapterApi` provides the following methods:
- `doGet(callback)` — Sends a GET request
- `doPost(callback)` — Sends a POST request
- `doPut(callback)` — Sends a PUT request
- `doDelete(callback)` — Sends a DELETE request

Each method returns an adapter object. Use `adapter.update()` to configure request parameters and trigger the request, and `adapter.disconnect()` to close the connection.

## 2. GET Request Example

```typescript
import { adapterApi } from '@kdcloudjs/kwc-shared-utils/api';

// Create a GET request adapter, pass in a callback to handle the response
const adapter = adapterApi.doGet(({ data, error }) => {
  if (error) {
    console.error('Request failed:', error.message);
    return;
  }
  console.log('Response data:', data);
});

// Configure and send the request
adapter.update({
  endpointConfig: {
    isv: config.isvId,      // Get vendor ID from config
    app: config.moduleId,   // Get app ID from config
    source: 'myController/user/123',  // Controller path
    version: 'v1'
  },
  params: { lang: 'zh_CN' },  // GET → query parameters
  headers: {}
});

// Disconnect when no longer needed
adapter.disconnect();
```

## 3. POST Request Example

```typescript
import { adapterApi } from '@kdcloudjs/kwc-shared-utils/api';

const adapter = adapterApi.doPost(({ data, error }) => {
  if (error) {
    console.error('Request failed:', error.message);
    return;
  }
  console.log('Created successfully:', data);
});

adapter.update({
  endpointConfig: {
    isv: config.isvId,
    app: config.moduleId,
    source: 'myController/user',
    version: 'v1'
  },
  params: {                   // POST → JSON body
    username: 'testUser',
    email: 'test@example.com'
  },
  headers: {
    'Content-Type': 'application/json'
  }
});
```

## 4. endpointConfig Options

| Field | Type | Required | Description |
|------|------|------|------|
| `isv` | string | Yes | Vendor ID, obtained from `config.isvId` |
| `app` | string | Yes | App ID, obtained from `config.moduleId` |
| `source` | string | Yes | Controller path, i.e., the Controller URL with the `/{isv}/{app}/` prefix removed |
| `version` | string | Yes | API version, fixed as `'v1'` |

### 4.1 source Field Rules

`source` is the most critical field in `endpointConfig`. It corresponds to the URL path configured in the backend Controller XML, **with the `/{isv}/{app}/` prefix removed**.

**Mapping rule**:

```
Controller XML url:  /kdtest/app/myController/user/{id}
                     ↓ Remove /{isv}/{app}/ prefix
endpointConfig.source: myController/user/123
                                         ↑ Path parameters replaced with actual values
```

**More examples**:

| Controller XML `<url>` | Method `<url>` | Full path | source value |
|------------------------|-------------|---------|-----------|
| `/kd/dev/sample/hello` | `/{name}` | `/kd/dev/sample/hello/World` | `sample/hello/World` |
| `/kd/dev/sample/users` | `/{id}` | `/kd/dev/sample/users/123` | `sample/users/123` |
| `/kd/dev/sample/users` | (empty) | `/kd/dev/sample/users` | `sample/users` |
| `/kd/dev/sample/orders` | `/{id}/process` | `/kd/dev/sample/orders/1001/process` | `sample/orders/1001/process` |

## 5. config Object Structure

Frontend components receive context configuration via the `config` prop:

| Field | Description | Example |
|------|------|------|
| `config.isvId` | Vendor ID | `'kdtest'` |
| `config.moduleId` | App ID | `'kdtest_catherine'` |
| `config.pageId` | Page ID | `'root8b3b5a25...'` |
| `config.formId` | Form ID | `'kdtest_myform'` |
| `config.controlId` | Control ID | `'mycomponent'` |
| `config.metaProps` | Metadata properties | `{ Region: 'region1' }` |

## 6. Complete Integration Example in a React Component

The following example shows a complete usage of `adapterApi` in a React component to call backend Controller APIs, including loading/error state management and cleanup handling.

```typescript
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { adapterApi } from '@kdcloudjs/kwc-shared-utils/api';

// This declares the config object type
interface UserListProps {
    isvId: string;
    moduleId: string;
    pageId: string;
    formId: string;
    controlId: string;
    metaProps: Record<string, string>;
}

interface User {
  id: number;
  name: string;
  email: string;
  department: string;
}

const UserList: React.FC<UserListProps> = (config) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const adapterRef = useRef<any>(null);

  // Fetch user list
  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError(null);

    // Disconnect previous request
    if (adapterRef.current) {
      adapterRef.current.disconnect();
    }

    adapterRef.current = adapterApi.doGet(({ data, error: apiError }) => {
      setLoading(false);
      if (apiError) {
        setError(apiError.message || 'Failed to fetch user list');
        return;
      }
      setUsers(data?.data || []);
    });

    adapterRef.current.update({
      endpointConfig: {
        isv: config.isvId,
        app: config.moduleId,
        source: 'sample/users',
        version: 'v1'
      },
      params: { page: 1, size: 10 },
      headers: {}
    });
  }, [config]);

  // Create user
  const createUser = useCallback((userData: Partial<User>) => {
    setLoading(true);
    setError(null);

    const postAdapter = adapterApi.doPost(({ data, error: apiError }) => {
      setLoading(false);
      if (apiError) {
        setError(apiError.message || 'Failed to create user');
        return;
      }
      // Refresh list after successful creation
      fetchUsers();
    });

    postAdapter.update({
      endpointConfig: {
        isv: config.isvId,
        app: config.moduleId,
        source: 'sample/users',
        version: 'v1'
      },
      params: userData,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }, [config, fetchUsers]);

  // Disconnect on component unmount
  useEffect(() => {
    return () => {
      if (adapterRef.current) {
        adapterRef.current.disconnect();
      }
    };
  }, []);

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error} <button onClick={fetchUsers}>Retry</button></div>;
  }

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
```

**Key takeaways**:

1. **useRef to manage adapter**: Hold the adapter reference via ref to ensure disconnection during cleanup
2. **Disconnect old connections before new requests**: Avoid race conditions caused by duplicate requests
3. **useEffect cleanup**: Call `adapter.disconnect()` on component unmount to prevent memory leaks
4. **loading/error state management**: Set loading when a request starts, update state based on the result in the callback

## 7. Common Error Troubleshooting

### 7.1 404 Not Found

| Possible Cause | Troubleshooting |
|---------|---------|
| source path is incorrect | Check if source correctly removes the `/{isv}/{app}/` prefix |
| Controller not deployed | Confirm `kd project deploy` has been executed |
| version mismatch | Confirm the deployed version matches the production version |
| HTTP method mismatch | Confirm doGet/doPost matches the httpMethod in the Controller XML |

### 7.2 401 Unauthorized

| Possible Cause | Troubleshooting |
|---------|---------|
| User not logged in | Check login status and token |
| API not configured for anonymousUser | If anonymous access is needed, set `<anonymousUser>true</anonymousUser>` in the XML |

### 7.3 403 Forbidden

| Possible Cause | Troubleshooting |
|---------|---------|
| User lacks permission | Check entityNumber and permItemId configuration |
| checkRightApp misconfigured | Confirm the permission-check app code |

### 7.4 CORS Error

| Possible Cause | Troubleshooting |
|---------|---------|
| Cross-origin during local debugging | Use `kd debug` to start local debugging, which automatically handles CORS |
| Non-compliant request headers | Check if custom headers are in the allowed list |

### 7.5 Request Parameters Missing

| Possible Cause | Troubleshooting |
|---------|----------|
| GET request params not passed | Confirm the params object keys and values are correct |
| POST request body format error | Confirm headers include `'Content-Type': 'application/json'` |
| Backend parameter retrieval mismatch | GET uses `getStringQueryParam`, POST uses `getMapBody` |

### 7.6 Response Data Type Mismatch (Array Becomes Object)

| Possible Cause | Troubleshooting |
|---------|----------|
| KS runtime serializes array `[]` as object `{}` | Print the actual response to check field types, use `Array.isArray()` for validation |
| Frontend uses `as` type assertion without runtime validation | Never use `as` type assertion directly on API responses; always validate before using |
| Backend did not JSON.stringify the array field | Backend should use `JSON.stringify(array)`, frontend uses `JSON.parse()` to restore |

**Typical failure chain**:
```
Backend code: items: ['a', 'b']  →  KS runtime serialization  →  Frontend receives items: {}
Frontend code: (data as MyType).items.map(...)  →  Runtime exception  →  Blank screen
```

**Defensive parsing example**:
```typescript
adapterRef.current = adapterApi.doGet(({ data: responseData, error: apiError }) => {
  setLoading(false);
  if (apiError) {
    setError(apiError.message || 'API call failed');
    return;
  }

  // ❌ Dangerous: Direct assertion without validation
  // setData(responseData as MyResponse);

  // ✅ Safe: Field-by-field validation + fallback
  const raw = responseData || {};
  setData({
    title: raw.title ?? '',
    summary: raw.summary ?? '',
    items: Array.isArray(raw.items) ? raw.items : [],
  });
});
```
