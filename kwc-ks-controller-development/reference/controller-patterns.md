# Controller Common Patterns and Code Examples

This document provides common development patterns and complete code examples for script controllers, which can be used as a quick reference.

## 1. Simplest GET Example

The simplest single-method Controller for retrieving a single resource.

### 1.1 .kws Metadata Configuration

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

### 1.2 TypeScript Code

```typescript
class HelloController {
  sayHello(request: any, response: any) {
    // Get path parameter
    const name = request.getPathVariable('name');
    
    // Return response
    response.ok({
      message: `Hello, ${name}!`,
      timestamp: new Date().toISOString()
    });
  }
}

let kwcController = new HelloController();
export { kwcController };
```

### 1.3 Access Example

```
GET ../kwc/v1/kd/dev/sample/hello/World

Response (200):
{
  "message": "Hello, World!",
  "timestamp": "2026-04-03T10:30:00.000Z"
}
```

## 2. Complete CRUD Example

A complete Controller with four CRUD methods.

### 2.1 .kws Metadata Configuration

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
        <!-- Query a single user -->
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
        
        <!-- Create user -->
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
        
        <!-- Update user -->
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
        
        <!-- Delete user -->
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

### 2.2 TypeScript Code

```typescript
import { ArrayList, HashMap } from '@cosmic/bos-script/java/util';

class UserController {
  // GET /kd/dev/sample/users/{id}
  getUser(request: any, response: any) {
    const userId = request.getLongPathVariable('id');
    
    // Build return object using HashMap
    const user = new HashMap();
    user.put('id', userId);
    user.put('name', 'Zhang San');
    user.put('email', 'zhangsan@example.com');
    user.put('department', 'R&D');
    
    response.ok(user);
  }
  
  // POST /kd/dev/sample/users
  createUser(request: any, response: any) {
    const body = request.getMapBody();
    
    // Parameter validation
    if (!body['name']) {
      response.throwException('Username cannot be empty', 400, 'MISSING_NAME');
      return;
    }
    
    if (!body['email']) {
      response.throwException('Email cannot be empty', 400, 'MISSING_EMAIL');
      return;
    }
    
    // Build return object using HashMap
    const newUser = new HashMap();
    newUser.put('id', Date.now());
    newUser.put('name', body['name']);
    newUser.put('email', body['email']);
    newUser.put('department', body['department'] || 'Default Department');
    
    response.of(201, newUser);
  }
  
  // PUT /kd/dev/sample/users/{id}
  updateUser(request: any, response: any) {
    const userId = request.getLongPathVariable('id');
    const body = request.getMapBody();
    
    // Build return object using HashMap
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
    
    // Simple types can be returned directly; use HashMap for multi-field objects
    const result = new HashMap();
    result.put('message', 'Deleted successfully');
    result.put('deletedId', userId);
    response.ok(result);
  }
}

let kwcController = new UserController();
export { kwcController };
```

## 3. Error Handling Patterns

### 3.1 Parameter Validation Failure

```typescript
class ValidationController {
  createOrder(request: any, response: any) {
    const body = request.getMapBody();
    
    // Required field validation
    if (!body['productId']) {
      response.throwException('Product ID cannot be empty', 400, 'MISSING_PRODUCT_ID');
      return;
    }
    
    // Numeric range validation
    const quantity = body['quantity'];
    if (!quantity || quantity <= 0) {
      response.throwException('Quantity must be greater than 0', 400, 'INVALID_QUANTITY');
      return;
    }
    
    // Format validation
    const email = body['email'];
    if (email && !email.includes('@')) {
      response.throwException('Invalid email format', 400, 'INVALID_EMAIL');
      return;
    }
    
    // Validation passed, continue processing
    response.ok({ message: 'Order created successfully' });
  }
}

let kwcController = new ValidationController();
export { kwcController };
```

### 3.2 Business Exception Handling

```typescript
class BusinessController {
  processOrder(request: any, response: any) {
    const orderId = request.getLongPathVariable('id');
    
    // Simulate querying an order
    const order = this.findOrder(orderId);
    
    // Resource not found
    if (!order) {
      response.throwException('Order not found', 404, 'ORDER_NOT_FOUND');
      return;
    }
    
    // Status does not allow operation
    if (order.status === 'COMPLETED') {
      response.throwException('Completed orders cannot be modified', 400, 'ORDER_COMPLETED');
      return;
    }
    
    // Insufficient permissions
    if (!this.hasPermission(order)) {
      response.throwException('No permission to operate this order', 403, 'FORBIDDEN');
      return;
    }
    
    response.ok({ message: 'Processed successfully' });
  }
  
  private findOrder(id: number) {
    // Simulate query
    return { id: id, status: 'PENDING' };
  }
  
  private hasPermission(order: any) {
    // Simulate permission check
    return true;
  }
}

let kwcController = new BusinessController();
export { kwcController };
```

### 3.3 try-catch Exception Catching

```typescript
class SafeController {
  riskyOperation(request: any, response: any) {
    try {
      // Operation that may throw an exception
      const result = this.doSomethingRisky();
      response.ok(result);
    } catch (e: any) {
      // Catch exception and return error response
      response.throwException(
        e.message || 'Operation failed',
        500,
        'OPERATION_FAILED'
      );
    }
  }
  
  private doSomethingRisky() {
    // Simulate an operation that may fail
    throw new Error('Simulated exception');
  }
}

let kwcController = new SafeController();
export { kwcController };
```

## 4. Comprehensive Example

A complete example using path parameters, query parameters, request headers, and request body together.

### 4.1 .kws Metadata Configuration

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
        <!-- Query order list (pagination + filtering) -->
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
        
        <!-- Process order -->
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

### 4.2 TypeScript Code

```typescript
import { ArrayList, HashMap } from '@cosmic/bos-script/java/util';

class OrderController {
  // GET /kd/dev/sample/orders?page=1&size=10&status=PENDING
  listOrders(request: any, response: any) {
    // Get query parameters
    const page = request.getIntQueryParam('page') || 1;
    const size = request.getIntQueryParam('size') || 10;
    const status = request.getStringQueryParam('status');
    const startDate = request.getDateQueryParam('startDate');
    const endDate = request.getDateQueryParam('endDate');
    
    // Get request headers
    const clientVersion = request.getHeader('X-Client-Version');
    
    // Build list data using ArrayList + HashMap
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
    
    // Build pagination info
    const pagination = new HashMap();
    pagination.put('page', page);
    pagination.put('size', size);
    pagination.put('total', 100);

    // Build filter conditions
    const filters = new HashMap();
    filters.put('status', status);
    filters.put('startDate', startDate);
    filters.put('endDate', endDate);

    // Assemble final result
    const result = new HashMap();
    result.put('data', orders);
    result.put('pagination', pagination);
    result.put('filters', filters);
    result.put('clientVersion', clientVersion);
    response.ok(result);
  }
  
  // POST /kd/dev/sample/orders/{id}/process
  processOrder(request: any, response: any) {
    // Get path parameter
    const orderId = request.getLongPathVariable('id');
    
    // Get request body
    const body = request.getMapBody();
    const action = body['action'];      // 'approve' | 'reject'
    const remark = body['remark'];
    
    // Get request header
    const operatorId = request.getHeader('X-Operator-Id');
    
    // Parameter validation
    if (!action) {
      response.throwException('Action type cannot be empty', 400, 'MISSING_ACTION');
      return;
    }
    
    if (action !== 'approve' && action !== 'reject') {
      response.throwException('Invalid action type, only approve or reject is supported', 400, 'INVALID_ACTION');
      return;
    }
    
    // Build return object using HashMap
    const result = new HashMap();
    result.put('orderId', orderId);
    result.put('status', action === 'approve' ? 'APPROVED' : 'REJECTED');
    result.put('message', action === 'approve' ? 'Order approved' : 'Order rejected');
    result.put('operator', operatorId);
    result.put('remark', remark);
    result.put('processedAt', new Date().toISOString());
    response.ok(result);
  }
}

let kwcController = new OrderController();
export { kwcController };
```

## 5. SDK Integration Examples (Query + Save)

> Complete SDK documentation is provided by the `kingscript-code-generator` skill package; this section only shows typical integration patterns in Controllers.

### 5.1 Database Queries (QueryServiceHelper)

#### Query a Single Record

```typescript
import { QueryServiceHelper } from '@cosmic/bos-core/kd/bos/servicehelper';
import { HashMap } from '@cosmic/bos-script/java/util';

class UserController {
  // GET /kd/dev/sample/users/{id}
  getUser(request: any, response: any) {
    const userId = request.getLongPathVariable('id');

    try {
      // Query a single record by ID
      const result = QueryServiceHelper.queryDataSet(
        'bos_user',
        'id, name, email, department',
        [{ left: 'id', op: '=', right: userId }]
      );

      if (!result || result.size() === 0) {
        response.throwException('User not found', 404, 'USER_NOT_FOUND');
        return;
      }

      result.first();
      // Build return object using HashMap
      const user = new HashMap();
      user.put('id', result.getLong('id'));
      user.put('name', result.getString('name'));
      user.put('email', result.getString('email'));
      user.put('department', result.getString('department'));

      response.ok(user);
    } catch (e: any) {
      response.throwException(e.message || 'Query failed', 500, 'QUERY_FAILED');
    }
  }
}

let kwcController = new UserController();
export { kwcController };
```

#### Query a List (with Pagination)

```typescript
import { QueryServiceHelper } from '@cosmic/bos-core/kd/bos/servicehelper';
import { ArrayList, HashMap } from '@cosmic/bos-script/java/util';

class UserListController {
  // GET /kd/dev/sample/users?page=1&size=10&department=R&D
  listUsers(request: any, response: any) {
    const page = request.getIntQueryParam('page') || 1;
    const size = request.getIntQueryParam('size') || 10;
    const department = request.getStringQueryParam('department');

    try {
      // Build filter conditions
      const filters: any[] = [];
      if (department) {
        filters.push({ left: 'department', op: '=', right: department });
      }

      // Paginated query
      const result = QueryServiceHelper.queryDataSet(
        'bos_user',
        'id, name, email, department',
        filters,
        'id asc',
        (page - 1) * size,
        size
      );

      // Build list using ArrayList + HashMap
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
      response.throwException(e.message || 'Query failed', 500, 'QUERY_FAILED');
    }
  }
}

let kwcController = new UserListController();
export { kwcController };
```

### 5.2 Business Data Save (BusinessDataServiceHelper)

```typescript
import { BusinessDataServiceHelper } from '@cosmic/bos-core/kd/bos/servicehelper';
import { DynamicObject } from '@cosmic/bos-core/kd/bos/dataentity/entity';
import { HashMap } from '@cosmic/bos-script/java/util';

class UserCreateController {
  // POST /kd/dev/sample/users
  createUser(request: any, response: any) {
    const body = request.getMapBody();

    // Parameter validation
    if (!body['name']) {
      response.throwException('Username cannot be empty', 400, 'MISSING_NAME');
      return;
    }

    try {
      // Create data object
      const userObj = new DynamicObject();
      userObj.set('name', body['name']);
      userObj.set('email', body['email']);
      userObj.set('department', body['department'] || 'Default Department');

      // Save entity
      const savedObj = BusinessDataServiceHelper.save('bos_user', userObj);

      // Build return object using HashMap
      const result = new HashMap();
      result.put('id', savedObj.getLong('id'));
      result.put('name', savedObj.getString('name'));
      result.put('message', 'Created successfully');
      response.of(201, result);
    } catch (e: any) {
      response.throwException(e.message || 'Creation failed', 500, 'CREATE_FAILED');
    }
  }
}

let kwcController = new UserCreateController();
export { kwcController };
```

> For complete usage of more SDK classes and methods (DynamicObject, QueryServiceHelper, BusinessDataServiceHelper, etc.), please refer to the SDK indexes in the `kingscript-code-generator` skill package.
