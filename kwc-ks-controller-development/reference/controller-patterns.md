# Controller 常见模式和代码示例

本文档提供脚本控制器的常见开发模式和完整代码示例，可作为快速参考。

## 1. 最简 GET 示例

一个最简单的单方法 Controller，用于获取单个资源。

### 1.1 .kws 元数据配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Controller>
    <name>HelloController</name>
    <isv>kingdee</isv>
    <app>dev</app>
    <version>1</version>
    <url>/kd/dev/sample/hello</url>
    <scriptFile>HelloController.ts</scriptFile>
    <methods>
        <method>
            <name>sayHello</name>
            <url>/{name}</url>
            <httpMethod>GET</httpMethod>
            <permission>
                <permission>
                    <permitAll>true</permitAll>
                </permission>
            </permission>
        </method>
    </methods>
</Controller>
```

### 1.2 TypeScript 代码

```typescript
class HelloController {
  sayHello(request: any, response: any) {
    // 获取路径参数
    const name = request.getPathVariable('name');
    
    // 返回响应
    response.ok({
      message: `Hello, ${name}!`,
      timestamp: new Date().toISOString()
    });
  }
}

let kwcController = new HelloController();
export { kwcController };
```

### 1.3 访问示例

```
GET ../kwc/v1/kd/dev/sample/hello/World

Response (200):
{
  "message": "Hello, World!",
  "timestamp": "2026-04-03T10:30:00.000Z"
}
```

## 2. 完整 CRUD 示例

一个包含增删改查四个方法的完整 Controller。

### 2.1 .kws 元数据配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Controller>
    <name>UserController</name>
    <isv>kingdee</isv>
    <app>dev</app>
    <version>1</version>
    <url>/kd/dev/sample/users</url>
    <scriptFile>UserController.ts</scriptFile>
    <methods>
        <!-- 查询单个用户 -->
        <method>
            <name>getUser</name>
            <url>/{id}</url>
            <httpMethod>GET</httpMethod>
            <permission>
                <permission>
                    <permitAll>false</permitAll>
                    <entityNumber>bos_user</entityNumber>
                    <permItemId>47150e89000000ac</permItemId>
                    <checkRightApp>dev</checkRightApp>
                </permission>
            </permission>
        </method>
        
        <!-- 创建用户 -->
        <method>
            <name>createUser</name>
            <url></url>
            <httpMethod>POST</httpMethod>
            <permission>
                <permission>
                    <permitAll>false</permitAll>
                    <entityNumber>bos_user</entityNumber>
                    <permItemId>47150e89000000ac</permItemId>
                    <checkRightApp>dev</checkRightApp>
                </permission>
            </permission>
        </method>
        
        <!-- 更新用户 -->
        <method>
            <name>updateUser</name>
            <url>/{id}</url>
            <httpMethod>PUT</httpMethod>
            <permission>
                <permission>
                    <permitAll>false</permitAll>
                    <entityNumber>bos_user</entityNumber>
                    <permItemId>47150e89000000ac</permItemId>
                    <checkRightApp>dev</checkRightApp>
                </permission>
            </permission>
        </method>
        
        <!-- 删除用户 -->
        <method>
            <name>deleteUser</name>
            <url>/{id}</url>
            <httpMethod>DELETE</httpMethod>
            <permission>
                <permission>
                    <permitAll>false</permitAll>
                    <entityNumber>bos_user</entityNumber>
                    <permItemId>47150e89000000ac</permItemId>
                    <checkRightApp>dev</checkRightApp>
                </permission>
            </permission>
        </method>
    </methods>
</Controller>
```

### 2.2 TypeScript 代码

```typescript
import { ArrayList, HashMap } from '@cosmic/bos-script/java/util';

class UserController {
  // GET /kd/dev/sample/users/{id}
  getUser(request: any, response: any) {
    const userId = request.getLongPathVariable('id');
    
    // 使用 HashMap 构造返回对象
    const user = new HashMap();
    user.put('id', userId);
    user.put('name', '张三');
    user.put('email', 'zhangsan@example.com');
    user.put('department', '研发部');
    
    response.ok(user);
  }
  
  // POST /kd/dev/sample/users
  createUser(request: any, response: any) {
    const body = request.getMapBody();
    
    // 参数验证
    if (!body['name']) {
      response.throwException('用户名不能为空', 400, 'MISSING_NAME');
      return;
    }
    
    if (!body['email']) {
      response.throwException('邮箱不能为空', 400, 'MISSING_EMAIL');
      return;
    }
    
    // 使用 HashMap 构造返回对象
    const newUser = new HashMap();
    newUser.put('id', Date.now());
    newUser.put('name', body['name']);
    newUser.put('email', body['email']);
    newUser.put('department', body['department'] || '默认部门');
    
    response.of(201, newUser);
  }
  
  // PUT /kd/dev/sample/users/{id}
  updateUser(request: any, response: any) {
    const userId = request.getLongPathVariable('id');
    const body = request.getMapBody();
    
    // 使用 HashMap 构造返回对象
    const updatedUser = new HashMap();
    updatedUser.put('id', userId);
    updatedUser.put('name', body['name']);
    updatedUser.put('email', body['email']);
    updatedUser.put('department', body['department']);
    updatedUser.put('updatedAt', new Date().toISOString());
    
    response.ok(updatedUser);
  }
  
  // DELETE /kd/dev/sample/users/{id}
  deleteUser(request: any, response: any) {
    const userId = request.getLongPathVariable('id');
    
    // 简单类型可直接返回；包含多字段时仍使用 HashMap
    const result = new HashMap();
    result.put('message', '删除成功');
    result.put('deletedId', userId);
    response.ok(result);
  }
}

let kwcController = new UserController();
export { kwcController };
```

## 3. 错误处理模式

### 3.1 参数验证失败

```typescript
class ValidationController {
  createOrder(request: any, response: any) {
    const body = request.getMapBody();
    
    // 必填字段验证
    if (!body['productId']) {
      response.throwException('商品ID不能为空', 400, 'MISSING_PRODUCT_ID');
      return;
    }
    
    // 数值范围验证
    const quantity = body['quantity'];
    if (!quantity || quantity <= 0) {
      response.throwException('数量必须大于0', 400, 'INVALID_QUANTITY');
      return;
    }
    
    // 格式验证
    const email = body['email'];
    if (email && !email.includes('@')) {
      response.throwException('邮箱格式不正确', 400, 'INVALID_EMAIL');
      return;
    }
    
    // 验证通过，继续处理
    response.ok({ message: '订单创建成功' });
  }
}

let kwcController = new ValidationController();
export { kwcController };
```

### 3.2 业务异常处理

```typescript
class BusinessController {
  processOrder(request: any, response: any) {
    const orderId = request.getLongPathVariable('id');
    
    // 模拟查询订单
    const order = this.findOrder(orderId);
    
    // 资源不存在
    if (!order) {
      response.throwException('订单不存在', 404, 'ORDER_NOT_FOUND');
      return;
    }
    
    // 状态不允许操作
    if (order.status === 'COMPLETED') {
      response.throwException('已完成的订单不能修改', 400, 'ORDER_COMPLETED');
      return;
    }
    
    // 权限不足
    if (!this.hasPermission(order)) {
      response.throwException('无权操作此订单', 403, 'FORBIDDEN');
      return;
    }
    
    response.ok({ message: '处理成功' });
  }
  
  private findOrder(id: number) {
    // 模拟查询
    return { id: id, status: 'PENDING' };
  }
  
  private hasPermission(order: any) {
    // 模拟权限检查
    return true;
  }
}

let kwcController = new BusinessController();
export { kwcController };
```

### 3.3 try-catch 异常捕获

```typescript
class SafeController {
  riskyOperation(request: any, response: any) {
    try {
      // 可能抛出异常的操作
      const result = this.doSomethingRisky();
      response.ok(result);
    } catch (e: any) {
      // 捕获异常并返回错误响应
      response.throwException(
        e.message || '操作失败',
        500,
        'OPERATION_FAILED'
      );
    }
  }
  
  private doSomethingRisky() {
    // 模拟可能失败的操作
    throw new Error('模拟异常');
  }
}

let kwcController = new SafeController();
export { kwcController };
```

## 4. 综合示例

同时使用路径参数、查询参数、请求头、请求体的完整示例。

### 4.1 .kws 元数据配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Controller>
    <name>OrderController</name>
    <isv>kingdee</isv>
    <app>dev</app>
    <version>1</version>
    <url>/kd/dev/sample/orders</url>
    <scriptFile>OrderController.ts</scriptFile>
    <methods>
        <!-- 查询订单列表（分页 + 过滤） -->
        <method>
            <name>listOrders</name>
            <url></url>
            <httpMethod>GET</httpMethod>
            <permission>
                <permission>
                    <permitAll>false</permitAll>
                    <entityNumber>bos_order</entityNumber>
                    <permItemId>47150e89000000ad</permItemId>
                    <checkRightApp>dev</checkRightApp>
                </permission>
            </permission>
        </method>
        
        <!-- 处理订单 -->
        <method>
            <name>processOrder</name>
            <url>/{id}/process</url>
            <httpMethod>POST</httpMethod>
            <permission>
                <permission>
                    <permitAll>false</permitAll>
                    <entityNumber>bos_order</entityNumber>
                    <permItemId>47150e89000000ad</permItemId>
                    <checkRightApp>dev</checkRightApp>
                </permission>
            </permission>
        </method>
    </methods>
</Controller>
```

### 4.2 TypeScript 代码

```typescript
import { ArrayList, HashMap } from '@cosmic/bos-script/java/util';

class OrderController {
  // GET /kd/dev/sample/orders?page=1&size=10&status=PENDING
  listOrders(request: any, response: any) {
    // 获取查询参数
    const page = request.getIntQueryParam('page') || 1;
    const size = request.getIntQueryParam('size') || 10;
    const status = request.getStringQueryParam('status');
    const startDate = request.getDateQueryParam('startDate');
    const endDate = request.getDateQueryParam('endDate');
    
    // 获取请求头
    const clientVersion = request.getHeader('X-Client-Version');
    
    // 使用 ArrayList + HashMap 构造列表数据
    const orders = new ArrayList();
    const order1 = new HashMap();
    order1.put('id', 1001);
    order1.put('status', 'PENDING');
    order1.put('amount', 100.00);
    orders.add(order1);

    const order2 = new HashMap();
    order2.put('id', 1002);
    order2.put('status', 'PENDING');
    order2.put('amount', 200.00);
    orders.add(order2);
    
    // 构造分页信息
    const pagination = new HashMap();
    pagination.put('page', page);
    pagination.put('size', size);
    pagination.put('total', 100);

    // 构造过滤条件
    const filters = new HashMap();
    filters.put('status', status);
    filters.put('startDate', startDate);
    filters.put('endDate', endDate);

    // 组装最终结果
    const result = new HashMap();
    result.put('data', orders);
    result.put('pagination', pagination);
    result.put('filters', filters);
    result.put('clientVersion', clientVersion);
    response.ok(result);
  }
  
  // POST /kd/dev/sample/orders/{id}/process
  processOrder(request: any, response: any) {
    // 获取路径参数
    const orderId = request.getLongPathVariable('id');
    
    // 获取请求体
    const body = request.getMapBody();
    const action = body['action'];      // 'approve' | 'reject'
    const remark = body['remark'];
    
    // 获取请求头
    const operatorId = request.getHeader('X-Operator-Id');
    
    // 参数验证
    if (!action) {
      response.throwException('操作类型不能为空', 400, 'MISSING_ACTION');
      return;
    }
    
    if (action !== 'approve' && action !== 'reject') {
      response.throwException('操作类型无效，仅支持 approve 或 reject', 400, 'INVALID_ACTION');
      return;
    }
    
    // 使用 HashMap 构造返回对象
    const result = new HashMap();
    result.put('orderId', orderId);
    result.put('status', action === 'approve' ? 'APPROVED' : 'REJECTED');
    result.put('message', action === 'approve' ? '订单已审批通过' : '订单已驳回');
    result.put('operator', operatorId);
    result.put('remark', remark);
    result.put('processedAt', new Date().toISOString());
    response.ok(result);
  }
}

let kwcController = new OrderController();
export { kwcController };
```

## 5. SDK 集成示例（查询 + 保存）

> SDK 的完整文档由 `kingscript-code-generator` 技能包提供，这里仅展示 Controller 中的典型集成用法。

### 5.1 数据库查询（QueryServiceHelper）

#### 查询单条记录

```typescript
import { QueryServiceHelper } from '@cosmic/bos-core/kd/bos/servicehelper';
import { HashMap } from '@cosmic/bos-script/java/util';

class UserController {
  // GET /kd/dev/sample/users/{id}
  getUser(request: any, response: any) {
    const userId = request.getLongPathVariable('id');

    try {
      // 根据 ID 查询单条记录
      const result = QueryServiceHelper.queryDataSet(
        'bos_user',
        'id, name, email, department',
        [{ left: 'id', op: '=', right: userId }]
      );

      if (!result || result.size() === 0) {
        response.throwException('用户不存在', 404, 'USER_NOT_FOUND');
        return;
      }

      result.first();
      // 使用 HashMap 构造返回对象
      const user = new HashMap();
      user.put('id', result.getLong('id'));
      user.put('name', result.getString('name'));
      user.put('email', result.getString('email'));
      user.put('department', result.getString('department'));

      response.ok(user);
    } catch (e: any) {
      response.throwException(e.message || '查询失败', 500, 'QUERY_FAILED');
    }
  }
}

let kwcController = new UserController();
export { kwcController };
```

#### 查询列表（带分页）

```typescript
import { QueryServiceHelper } from '@cosmic/bos-core/kd/bos/servicehelper';
import { ArrayList, HashMap } from '@cosmic/bos-script/java/util';

class UserListController {
  // GET /kd/dev/sample/users?page=1&size=10&department=研发部
  listUsers(request: any, response: any) {
    const page = request.getIntQueryParam('page') || 1;
    const size = request.getIntQueryParam('size') || 10;
    const department = request.getStringQueryParam('department');

    try {
      // 构建过滤条件
      const filters: any[] = [];
      if (department) {
        filters.push({ left: 'department', op: '=', right: department });
      }

      // 分页查询
      const result = QueryServiceHelper.queryDataSet(
        'bos_user',
        'id, name, email, department',
        filters,
        'id asc',
        (page - 1) * size,
        size
      );

      // 使用 ArrayList + HashMap 构造列表
      const users = new ArrayList();
      while (result.next()) {
        const item = new HashMap();
        item.put('id', result.getLong('id'));
        item.put('name', result.getString('name'));
        item.put('email', result.getString('email'));
        item.put('department', result.getString('department'));
        users.add(item);
      }

      const pagination = new HashMap();
      pagination.put('page', page);
      pagination.put('size', size);
      pagination.put('total', users.size());

      const data = new HashMap();
      data.put('data', users);
      data.put('pagination', pagination);
      response.ok(data);
    } catch (e: any) {
      response.throwException(e.message || '查询失败', 500, 'QUERY_FAILED');
    }
  }
}

let kwcController = new UserListController();
export { kwcController };
```

### 5.2 业务数据保存（BusinessDataServiceHelper）

```typescript
import { BusinessDataServiceHelper } from '@cosmic/bos-core/kd/bos/servicehelper';
import { DynamicObject } from '@cosmic/bos-core/kd/bos/dataentity/entity';
import { HashMap } from '@cosmic/bos-script/java/util';

class UserCreateController {
  // POST /kd/dev/sample/users
  createUser(request: any, response: any) {
    const body = request.getMapBody();

    // 参数校验
    if (!body['name']) {
      response.throwException('用户名不能为空', 400, 'MISSING_NAME');
      return;
    }

    try {
      // 创建数据对象
      const userObj = new DynamicObject();
      userObj.set('name', body['name']);
      userObj.set('email', body['email']);
      userObj.set('department', body['department'] || '默认部门');

      // 保存实体
      const savedObj = BusinessDataServiceHelper.save('bos_user', userObj);

      // 使用 HashMap 构造返回对象
      const result = new HashMap();
      result.put('id', savedObj.getLong('id'));
      result.put('name', savedObj.getString('name'));
      result.put('message', '创建成功');
      response.of(201, result);
    } catch (e: any) {
      response.throwException(e.message || '创建失败', 500, 'CREATE_FAILED');
    }
  }
}

let kwcController = new UserCreateController();
export { kwcController };
```

> 更多 SDK 类和方法（DynamicObject、QueryServiceHelper、BusinessDataServiceHelper 等）的完整用法，请查阅 `kingscript-code-generator` 技能包的 SDK 索引。
