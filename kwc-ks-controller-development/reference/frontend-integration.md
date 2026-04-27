# 前端通过 adapterApi 调用 Controller API 集成指南

> **职责说明**：本指南是前端调用后端 Controller API 的**统一参考文档**，被 `kwc-react-development`、`kwc-vue-development`、`kwc-lwc-development` 三个前端技能包交叉引用。编写前端组件中的 API 调用代码前，必须阅读本文档。

## 1. adapterApi 基础用法

前端通过 `@kdcloudjs/kwc-shared-utils/api` 提供的 `adapterApi` 调用后端 Controller API。

```typescript
import { adapterApi } from '@kdcloudjs/kwc-shared-utils/api';
```

`adapterApi` 提供以下方法：
- `doGet(callback)` — 发起 GET 请求
- `doPost(callback)` — 发起 POST 请求
- `doPut(callback)` — 发起 PUT 请求
- `doDelete(callback)` — 发起 DELETE 请求

每个方法返回一个 adapter 对象，通过 `adapter.update()` 配置请求参数并触发请求，通过 `adapter.disconnect()` 断开连接。

## 2. GET 请求示例

```typescript
import { adapterApi } from '@kdcloudjs/kwc-shared-utils/api';

// 创建 GET 请求 adapter，传入回调处理响应
const adapter = adapterApi.doGet(({ data, error }) => {
  if (error) {
    console.error('请求失败:', error.message);
    return;
  }
  console.log('响应数据:', data);
});

// 配置并发起请求
adapter.update({
  endpointConfig: {
    isv: config.isvId,      // 从 config 获取开发商 ID
    app: config.moduleId,   // 从 config 获取应用 ID
    source: 'myController/user/123',  // 控制器路径
    version: 'v1'
  },
  params: { lang: 'zh_CN' },  // GET → 查询参数
  headers: {}
});

// 不再需要时断开连接
adapter.disconnect();
```

## 3. POST 请求示例

```typescript
import { adapterApi } from '@kdcloudjs/kwc-shared-utils/api';

const adapter = adapterApi.doPost(({ data, error }) => {
  if (error) {
    console.error('请求失败:', error.message);
    return;
  }
  console.log('创建成功:', data);
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

## 4. endpointConfig 配置项

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `isv` | string | 是 | 开发商 ID，从 `config.isvId` 获取 |
| `app` | string | 是 | 应用 ID，从 `config.moduleId` 获取 |
| `source` | string | 是 | 控制器路径，即 Controller URL 去掉 `/{isv}/{app}/` 前缀后的路径 |
| `version` | string | 是 | API 版本，固定为 `'v1'` |

### 4.1 source 字段填写规则

`source` 是 `endpointConfig` 中最关键的字段。它对应后端 Controller XML 中配置的 URL 路径，**去掉 `/{isv}/{app}/` 前缀**。

**映射规则**：

```
Controller XML url:  /kdtest/app/myController/user/{id}
                     ↓ 去掉 /{isv}/{app}/ 前缀
endpointConfig.source: myController/user/123
                                         ↑ 路径参数替换为实际值
```

**更多示例**：

| Controller XML `<url>` | 方法 `<url>` | 完整路径 | source 值 |
|------------------------|-------------|---------|-----------|
| `/kd/dev/sample/hello` | `/{name}` | `/kd/dev/sample/hello/World` | `sample/hello/World` |
| `/kd/dev/sample/users` | `/{id}` | `/kd/dev/sample/users/123` | `sample/users/123` |
| `/kd/dev/sample/users` | （空） | `/kd/dev/sample/users` | `sample/users` |
| `/kd/dev/sample/orders` | `/{id}/process` | `/kd/dev/sample/orders/1001/process` | `sample/orders/1001/process` |

## 5. config 对象结构

前端组件通过 `config` 属性接收上下文配置信息：

| 字段 | 说明 | 示例 |
|------|------|------|
| `config.isvId` | 开发商 ID | `'kdtest'` |
| `config.moduleId` | 应用 ID | `'kdtest_catherine'` |
| `config.pageId` | 页面 ID | `'root8b3b5a25...'` |
| `config.formId` | 表单 ID | `'kdtest_myform'` |
| `config.controlId` | 控件 ID | `'mycomponent'` |
| `config.metaProps` | 元数据属性 | `{ Region: 'region1' }` |

## 6. React 组件中完整集成示例

以下示例展示在 React 组件中完整使用 `adapterApi` 调用后端 Controller API，包含 loading/error 状态管理和 cleanup 处理。

```typescript
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { adapterApi } from '@kdcloudjs/kwc-shared-utils/api';

// 这里声明的就是config对象类型
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

  // 获取用户列表
  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError(null);

    // 断开之前的请求
    if (adapterRef.current) {
      adapterRef.current.disconnect();
    }

    adapterRef.current = adapterApi.doGet(({ data, error: apiError }) => {
      setLoading(false);
      if (apiError) {
        setError(apiError.message || '获取用户列表失败');
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

  // 创建用户
  const createUser = useCallback((userData: Partial<User>) => {
    setLoading(true);
    setError(null);

    const postAdapter = adapterApi.doPost(({ data, error: apiError }) => {
      setLoading(false);
      if (apiError) {
        setError(apiError.message || '创建用户失败');
        return;
      }
      // 创建成功后刷新列表
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

  // 组件卸载时断开连接
  useEffect(() => {
    return () => {
      if (adapterRef.current) {
        adapterRef.current.disconnect();
      }
    };
  }, []);

  // 初始加载
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>错误: {error} <button onClick={fetchUsers}>重试</button></div>;
  }

  return (
    <div>
      <h2>用户列表</h2>
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

**关键要点**：

1. **useRef 管理 adapter**：通过 ref 持有 adapter 引用，确保可以在 cleanup 时断开连接
2. **请求前断开旧连接**：避免重复请求导致的竞态条件
3. **useEffect cleanup**：组件卸载时调用 `adapter.disconnect()` 防止内存泄漏
4. **loading/error 状态管理**：请求开始时设置 loading，回调中根据结果更新状态

## 7. 常见错误排查

### 7.1 404 Not Found

| 可能原因 | 排查方式 |
|---------|---------|
| source 路径填写错误 | 检查 source 是否正确去掉了 `/{isv}/{app}/` 前缀 |
| Controller 未部署 | 确认已执行 `kd project deploy` |
| version 不匹配 | 确认部署的 version 与线上一致 |
| HTTP 方法不匹配 | 确认 doGet/doPost 与 Controller XML 中的 httpMethod 一致 |

### 7.2 401 Unauthorized

| 可能原因 | 排查方式 |
|---------|---------|
| 用户未登录 | 检查登录状态和 token |
| 接口未配置 anonymousUser | 如需匿名访问，在 XML 中设置 `<anonymousUser>true</anonymousUser>` |

### 7.3 403 Forbidden

| 可能原因 | 排查方式 |
|---------|---------|
| 用户无权限 | 检查 entityNumber 和 permItemId 配置是否正确 |
| checkRightApp 配置错误 | 确认验权应用编码 |

### 7.4 CORS 跨域错误

| 可能原因 | 排查方式 |
|---------|---------|
| 本地调试跨域 | 使用 `kd debug` 启动本地调试，自动处理跨域 |
| 请求头不合规 | 检查自定义 headers 是否在允许列表内 |

### 7.5 请求参数丢失

| 可能原因 | 排查方式 |
|---------|----------|
| GET 请求 params 未传递 | 确认 params 对象键值正确 |
| POST 请求体格式错误 | 确认 headers 中包含 `'Content-Type': 'application/json'` |
| 后端取参方式不对 | GET 用 `getStringQueryParam`，POST 用 `getMapBody` |

### 7.6 响应数据类型不符合预期（数组变对象）

| 可能原因 | 排查方式 |
|---------|----------|
| KS 运行时将数组 `[]` 序列化为对象 `{}` | 打印实际响应检查字段类型，使用 `Array.isArray()` 校验 |
| 前端用 `as` 强转而未做运行时校验 | 禁止对 API 响应直接使用 `as` 类型断言，必须先校验再使用 |
| 后端未将数组字段做 JSON.stringify | 后端调整为 `JSON.stringify(array)`，前端用 `JSON.parse()` 还原 |

**典型故障链路**：
```
后端代码：items: ['a', 'b']  →  KS 运行时序列化  →  前端收到 items: {}
前端代码：(data as MyType).items.map(...)  →  运行时异常  →  白屏
```

**前端防御性解析示例**：
```typescript
adapterRef.current = adapterApi.doGet(({ data: responseData, error: apiError }) => {
  setLoading(false);
  if (apiError) {
    setError(apiError.message || '接口调用失败');
    return;
  }

  // ❌ 危险：直接强转，不做校验
  // setData(responseData as MyResponse);

  // ✅ 安全：逐字段校验 + 容错
  const raw = responseData || {};
  setData({
    title: raw.title ?? '',
    summary: raw.summary ?? '',
    items: Array.isArray(raw.items) ? raw.items : [],
  });
});
```
