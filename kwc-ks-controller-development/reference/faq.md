# Controller 开发常见问题 FAQ

本文档收录 Controller 开发和前后端联调过程中的常见问题及解决方案。

---

## Q1: endpointConfig.source 字段如何填写？

**问题**：前端 `adapterApi` 的 `endpointConfig.source` 应该填什么值？如何与后端 Controller URL 对应？

**回答**：`source` 对应后端 Controller 的完整 URL 路径，**去掉 `/{isv}/{app}/` 前缀**，路径参数替换为实际值。

```
Controller .kws url:  /<isv>/<app>/sample/users
方法 url:            /{id}
完整路径:            /<isv>/<app>/sample/users/{id}

source 值:           sample/users/123
                     ↑ 去掉前缀        ↑ 路径参数替换为实际值
```

**更多示例**：

| Controller `<url>` | 方法 `<url>` | source 值 |
|---------------------|-------------|-----------|
| `/kd/dev/sample/hello` | `/{name}` | `sample/hello/World` |
| `/kd/dev/sample/users` | （空） | `sample/users` |
| `/kd/dev/sample/orders` | `/{id}/process` | `sample/orders/1001/process` |

---

## Q2: 部署时提示 version 版本号重复怎么办？

**问题**：执行 `kd project deploy` 时提示版本号重复或版本号过低。

**回答**：Controller 的版本号（`<version>`）必须是递增的正整数，**不支持相同版本号覆盖部署**。

**解决步骤**：

1. 打开 Controller 的 .kws 元数据文件
2. 找到 `<version>` 标签
3. 将版本号加 1

```xml
<!-- 原来 -->
<version>3</version>

<!-- 修改为 -->
<version>4</version>
```

4. 重新构建并部署：

```bash
npm run build:controller
kd project deploy
```

---

## Q3: 如何在 Controller 中调用 KS SDK？

**问题**：Controller 脚本中如何使用 KingScript SDK 提供的能力？

**回答**：Controller 的 TypeScript 脚本运行在 KingScript 引擎中，可以调用平台提供的 SDK。SDK 的可用性取决于部署环境，使用前建议确认 SDK 是否存在。

```typescript
class MyController {
  doSomething(request: any, response: any) {
    try {
      // 调用 SDK 能力（具体 API 参考 kingscript-code-generator 技能包文档）
      const result = this.callSdk();
      response.ok(result);
    } catch (e: any) {
      response.throwException(
        e.message || 'SDK 调用失败',
        500,
        'SDK_ERROR'
      );
    }
  }

  private callSdk() {
    // SDK 调用逻辑
    // 具体 API 参考 kingscript-code-generator 技能包的 references/sdk/ 目录
    return { success: true };
  }
}

let kwcController = new MyController();
export { kwcController };
```

> 📌 SDK 的详细 API 文档和示例请参考 `kingscript-code-generator` 技能包中的 `references/sdk/` 目录。

---

## Q4: 权限配置中 entityNumber 和 permItemId 从何处获取？

**问题**：.kws 元数据配置中 `<entityNumber>` 和 `<permItemId>` 的值从哪里来？

**回答**：这两个字段用于标准权限验证：

- **entityNumber**：业务实体编码，在业务系统的实体管理中定义，如 `bos_user`
- **permItemId**：权限项 ID，在权限管理中配置的权限项标识，如 `47150e89000000ac`
- **checkRightApp**：验权应用编码，通常与 Controller 所属的 app 一致

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

如果暂时不需要权限控制（如开发调试阶段），可以设置为跳过权限检查：

```xml
<permission>
    <permission>
        <permitAll>true</permitAll>
    </permission>
</permission>
```

---

## Q5: 错误响应时如何设置正确的状态码？

**问题**：Controller 中如何返回带有特定 HTTP 状态码的错误响应？

**回答**：使用 `response.throwException(message, httpCode, bizCode)` 方法：

```typescript
// 参数：错误消息、HTTP 状态码、业务错误码
response.throwException('用户不存在', 404, 'USER_NOT_FOUND');
response.throwException('参数不合法', 400, 'INVALID_PARAMS');
response.throwException('无权操作', 403, 'FORBIDDEN');
response.throwException('服务内部错误', 500, 'INTERNAL_ERROR');
```

**常用状态码对照**：

| 状态码 | 含义 | 使用场景 |
|--------|------|---------|
| 400 | 参数错误 | 必填字段缺失、格式校验失败 |
| 401 | 未授权 | 未登录或 token 失效 |
| 403 | 禁止访问 | 用户无权限执行此操作 |
| 404 | 不存在 | 请求的资源不存在 |
| 500 | 内部错误 | 服务端未预期的异常 |

**注意**：调用 `throwException` 后建议立即 `return`，避免后续代码继续执行：

```typescript
if (!body['name']) {
  response.throwException('用户名不能为空', 400, 'MISSING_NAME');
  return;  // ← 必须 return
}
```

---

## Q6: 如何处理路径参数类型？

**问题**：`getPathVariable` 和 `getLongPathVariable` 有什么区别？该用哪个？

**回答**：

| 方法 | 返回类型 | 使用场景 |
|------|---------|---------|
| `getPathVariable(name)` | string | 路径参数为字符串（如名称、编码） |
| `getLongPathVariable(name)` | long | 路径参数为数字 ID |

```typescript
// 字符串路径参数 — GET /users/{username}
const username = request.getPathVariable('username');  // → 'zhangsan'

// 数字 ID 路径参数 — GET /users/{id}
const userId = request.getLongPathVariable('id');       // → 12345
```

**选用原则**：如果路径参数是数字 ID，使用 `getLongPathVariable`；如果是字符串（名称、编码等），使用 `getPathVariable`。

---

## Q7: 前端调用后端 API 返回 404 怎么排查？

**问题**：前端通过 `adapterApi` 调用后端接口，返回 404 错误。

**排查清单**：

1. **检查 source 路径**
   - 确认 `endpointConfig.source` 是否正确去掉了 `/{isv}/{app}/` 前缀
   - 路径参数是否替换为实际值（如 `{id}` → `123`）

2. **检查 version**
   - `endpointConfig.version` 应为 `'v1'`

3. **检查部署状态**
   - Controller 是否已执行 `npm run build:controller` + `kd project deploy`
   - .kws 元数据中的 version 是否已递增

4. **检查 HTTP 方法**
   - `doGet` / `doPost` 是否与 Controller .kws 元数据中的 `<httpMethod>` 一致

5. **检查 isv 和 app**
   - `endpointConfig.isv` 和 `endpointConfig.app` 是否与部署环境一致

---

## Q8: 修改 Controller 代码后如何生效？

**问题**：修改了 Controller 的 .kws 元数据或 TypeScript 代码，但调用接口仍返回旧结果。

**回答**：每次修改 Controller 后，必须执行以下三个步骤：

```bash
# 步骤 1: 递增 .kws 元数据中的 version
#   <version>1</version>  →  <version>2</version>

# 步骤 2: 重新构建
npm run build:controller

# 步骤 3: 重新部署
kd project deploy
```

**重要**：版本号必须递增，否则部署会失败。不支持相同版本号覆盖。

---

## Q9: 前端如何处理后端返回的错误？

**问题**：后端 Controller 通过 `throwException` 返回了错误，前端如何获取错误信息？

**回答**：在 `adapterApi` 的回调函数中，通过 `error` 参数获取错误信息：

```typescript
const adapter = adapterApi.doGet(({ data, error }) => {
  if (error) {
    // error.message 包含后端 throwException 的第一个参数
    console.error('请求失败:', error.message);
    
    // 根据错误信息进行 UI 提示
    setErrorMessage(error.message);
    return;
  }
  
  // 正常处理数据
  setData(data);
});
```

**后端 throwException 与前端 error 的对应关系**：

```typescript
// 后端
response.throwException('用户不存在', 404, 'USER_NOT_FOUND');

// 前端回调
({ data, error }) => {
  // error.message === '用户不存在'
}
```

---

## Q10: kd debug 联调时有什么注意事项？

**问题**：使用 `kd debug` 进行前后端联调时需要注意什么？

**回答**：

### 必须使用后台模式

在 AI 编程工具中执行 `kd debug` 时，**必须设置 `is_background: true`**，否则前台模式会因 90 秒超时被强制终止，导致本地服务被 kill。

### 等待服务就绪

`kd debug` 启动后会立即打开浏览器，但本地服务可能尚未就绪。需要：
1. 通过 `get_terminal_output` 查看进程启动状态
2. 等待服务启动完成后再刷新页面

### 联调检查清单

1. **后端**：确保 Controller 已部署到目标环境（version 递增 → build → deploy）
2. **前端**：确保组件中 `adapterApi` 的 `endpointConfig` 配置正确
3. **启动**：执行 `kd debug`（后台模式）启动本地调试
4. **验证**：在浏览器中访问对应页面，打开开发者工具 Network 面板确认请求/响应

> 📌 本地调试的更多细节请参考脚手架工作流的脚手架说明文档。
