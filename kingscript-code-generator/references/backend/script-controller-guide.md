# Script Controller Development Guide

## Table of Contents

- [Chapter 1: Overview](#chapter-1-overview)
- [Chapter 2: Quick Start](#chapter-2-quick-start)
- [Chapter 3: Controller Configuration in Detail](#chapter-3-controller-configuration-in-detail)
- [Chapter 4: Script Development Basics](#chapter-4-script-development-basics)
- [Chapter 5: Request Handling API](#chapter-5-request-handling-api)
- [Chapter 6: Response Handling API](#chapter-6-response-handling-api)

---

## Chapter 1: Overview

### 1.1 What is a Script Controller

A Script Controller is a KingScript-based Web API controller that runs within the BOS platform's KWC (Kingdee Web Controller) framework. It allows developers to quickly create RESTful APIs using a scripting language, without the need to compile Java code.

**Core Features:**
- 🚀 **Rapid Development**: Written in KingScript, takes effect immediately
- 🔧 **Flexible Configuration**: URL routing and method binding configured via XML
- 🛡️ **Permission Control**: Built-in permission verification mechanism
- 📊 **Database Integration**: Can access business data entities
- 🔄 **Hot Deployment**: Supports runtime updates without restarting the server

### 1.2 Application Scenarios

✅ **Scenarios suitable for Script Controllers:**
- Rapid prototyping and PoC validation
- Simple CRUD interfaces
- Third-party system integration interfaces
- Temporary business logic processing
- Business rules that require frequent modification

❌ **Scenarios NOT suitable for Script Controllers:**
- Complex business logic (Java Controllers recommended)
- High-performance interfaces
- Scenarios requiring transaction control
- Functionality involving low-level system calls

---

## Chapter 2: Quick Start

### 2.1 Your First Script Controller

#### Step 1: Create the Controller Configuration

Create a `UserController.xml` file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Controller>
    <name>UserScriptController</name>
    <isv>kingdee</isv>
    <app>dev</app>
    <version>1</version>
    <url>/kd/dev/sample/users</url>
    <scriptFile>UserScriptController.ts</scriptFile>
    <methods>
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
    </methods>
</Controller>
```

#### Step 2: Write the Script Code

Create a `UserScriptController.ts` file:

```typescript
class UserScriptController {
  getUser(request: any, response: any) {
    // Get path parameter
    const userId = request.getLongPathVariable('id');

    // Return user information
    const userData = {
      id: userId,
      name: 'Zhang San',
      email: 'zhangsan@example.com'
    };

    response.ok(userData);
  }
}

let kwcController = new UserScriptController();
export { kwcController };
```

#### Step 3: Deploy the Controller

Upload the controller via the scaffold command:

```bash
# Deploy the controller using the scaffold command
bos-cli deploy --config UserController.xml --script UserScriptController.ts
```

The scaffold automatically performs the following operations:
- Reads the XML configuration file
- Packages the script file
- Uploads to the server
- Registers the controller route

#### Step 4: Test the Interface

Access the interface:
```
GET ../kwc/v1/kd/dev/sample/users/123
```

Response (HTTP 200):
```json
{
  "id": 123,
  "name": "Zhang San",
  "email": "zhangsan@example.com"
}
```

---

## Chapter 3: Controller Configuration in Detail

### 3.1 Required Fields List

The controller configuration must contain the following fields, otherwise deployment will fail:

| Field | Description | Example | Required |
|-------|-------------|---------|----------|
| `name` | Controller name (unique identifier) | `UserScriptController` | ✅ Required |
| `isv` | ISV (vendor) code | `kingdee` or custom code | ✅ Required |
| `app` | Business application code | `dev`, `bos`, etc. | ✅ Required |
| `version` | Version number (positive integer) | `1`, `2`, `3` | ✅ Required |
| `url` | Controller root URL address | `/kd/dev/sample/users` | ✅ Required |
| `scriptFile` | Script file name | `UserScriptController.ts` | ✅ Required |
| `methods` | Method definition set (at least 1) | See section 3.2 | ✅ Required |

### 3.2 XML Configuration Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Controller>
    <!-- Basic information -->
    <name>UserScriptController</name>
    <isv>kingdee</isv>
    <app>dev</app>
    <version>1</version>

    <!-- URL address -->
    <url>/kd/dev/sample/users</url>

    <!-- Script file binding -->
    <scriptFile>UserScriptController.ts</scriptFile>

    <!-- Method definitions -->
    <methods>
        <method>
            <name>getUser</name>
            <url>/{id}</url>
            <httpMethod>GET</httpMethod>

            <!-- Permission configuration (required) -->
            <permission>
                <permission>
                    <permitAll>false</permitAll>
                    <anonymousUser>false</anonymousUser>
                    <entityNumber>bos_user</entityNumber>
                    <permItemId>47150e89000000ac</permItemId>
                    <checkRightApp>dev</checkRightApp>
                </permission>
            </permission>
        </method>

        <method>
            <name>createUser</name>
            <url></url>
            <httpMethod>POST</httpMethod>
            <permission>
                <permission>
                    <permitAll>false</permitAll>
                    <anonymousUser>false</anonymousUser>
                    <entityNumber>bos_user</entityNumber>
                    <permItemId>47150e89000000ac</permItemId>
                    <checkRightApp>dev</checkRightApp>
                </permission>
            </permission>
        </method>
    </methods>
</Controller>
```

### 3.3 URL Address Rules (Important)

#### 3.3.1 URL Format Requirements

```
/{vendor prefix}/{app code}[/custom subdirectory]/{resource plural}
```

**Examples:**
- ✅ `/kd/dev/sample/users` (recommended)
- ✅ `/kd/bos/usercenter/users` (recommended)
- ✅ `/myisv/myapp/orders` (custom vendor)
- ❌ `/kd/dev` (missing resource path, at least 3 levels required)
- ❌ `/dev/sample/users` (missing vendor prefix)

#### 3.3.2 Vendor Prefix Rules

| isv value | URL prefix | Description |
|-----------|-----------|-------------|
| `kingdee` | `/kd/` | Kingdee in-house uniformly uses `kd` |
| Other values | `/{isv}/` | Secondary-development vendors use their own code |

#### 3.3.3 Full URL Composition Rules

Final access URL = **Class URL** + **Method URL**

| Class URL | Method URL | Final Access URL |
|-----------|-----------|-----------------|
| `/kd/dev/users` | `/{id}` | `/kd/dev/users/{id}` |
| `/kd/dev/users` | `` (empty) | `/kd/dev/users` |
| `/kd/dev/users` | `/profile` | `/kd/dev/users/profile` |

**Notes:**
- When the method URL is empty, the class URL is used directly
- If the method URL does not start with `/`, it will be added automatically
- If the class URL ends with `/`, the trailing slash will be deduplicated automatically

### 3.4 Method Configuration (Method)

#### 3.4.1 Required Fields

| Field | Description | Example | Required |
|-------|-------------|---------|----------|
| `name` | Method name (corresponds to the method in the script) | `getUser`, `createUser` | ✅ Required |
| `httpMethod` | HTTP request method | `GET`, `POST`, `PUT`, `DELETE` | ✅ Required |
| `permission` | Permission configuration object | See section 3.4.2 | ✅ Required |

#### 3.4.2 Permission Configuration

Every method must have a permission check configured:

```xml
            <permission>
                <permission>
                    <permitAll>false</permitAll>
                    <anonymousUser>false</anonymousUser>
                    <entityNumber>bos_user</entityNumber>
                    <permItemId>47150e89000000ac</permItemId>
                    <checkRightApp>dev</checkRightApp>
                </permission>
            </permission>
```

**Field Descriptions:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `permitAll` | boolean | `false` | Whether to bypass permission control. When set to `true`, the unified permission check is skipped, and the controller method handles permission logic on its own |
| `anonymousUser` | boolean | `false` | Whether to allow anonymous user access. Must also set `permitAll` to `true` for anonymous access to take effect |
| `entityNumber` | string | — | Business entity code used for permission verification (e.g. `bos_user`) |
| `permItemId` | string | — | Permission item ID used for verification (defined in the permission design) |
| `checkRightApp` | string | — | Business application code used for verification (usually the same as `app`) |

**Common Configuration Scenarios:**

```xml
<!-- Scenario 1: Standard permission verification (recommended) -->
<permission>
    <permission>
        <permitAll>false</permitAll>
        <entityNumber>bos_user</entityNumber>
        <permItemId>47150e89000000ac</permItemId>
        <checkRightApp>dev</checkRightApp>
    </permission>
</permission>

<!-- Scenario 2: Skip the unified permission check; the controller method handles its own authentication -->
<permission>
    <permission>
        <permitAll>true</permitAll>
    </permission>
</permission>

<!-- Scenario 3: Allow anonymous user access (permitAll must also be enabled) -->
<permission>
    <permission>
        <permitAll>true</permitAll>
        <anonymousUser>true</anonymousUser>
    </permission>
</permission>
```

### 3.5 Version Management Rules

#### 3.5.1 Version Number Rules

- Type: **positive integer** (1, 2, 3...)
- Comparison: The new version number must be **greater than** the existing version number
- Overwriting: Overwriting the same version number is not supported

#### 3.5.2 Version Upgrade Example

```
<!-- First deployment -->
<version>1</version>

<!-- Upgrade deployment -->
<version>2</version>  <!-- ✅ Success -->

<!-- Incorrect examples -->
<version>2</version>  <!-- ❌ Failure: same version -->
<version>1</version>  <!-- ❌ Failure: lower version -->
```

### 3.6 Deployment Validation Flow

The following validations are performed in order during deployment:

```
1. Required field checks
   ├─ Is name empty
   ├─ Is isv empty
   ├─ Is app empty
   ├─ Is url empty
   ├─ Is scriptFile empty
   └─ Is methods empty

2. URL format checks
   ├─ Does it include the vendor prefix
   ├─ Does it include the app code
   └─ Does it exceed 2 path levels (a resource path is required)

3. Method configuration checks
   ├─ Is method.name empty
   ├─ Is method.httpMethod empty
   └─ Is method.permission configured

4. Version number check
   └─ New version number > existing version number
```

---

## Chapter 4: Script Development Basics

### 4.1 Script File Structure

#### Basic Structure

```typescript
// 1. Define the controller class
class MyController {
  // 2. Define methods
  methodName(request: any, response: any) {
    // Business logic
  }
}

// 3. Create an instance and export it
let kwcController = new MyController();
export { kwcController };
```

#### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Class name | PascalCase (upper camelCase) | `UserScriptController` |
| Method name | camelCase (lower camelCase) | `getUser`, `createOrder` |
| File name | Must match the class name | `UserScriptController.ts` |
| Full class name | `@isv/app/name/ScriptFile.ts` | `@kingdee/dev/UserScriptController.ts` |

### 4.2 KingScript Syntax Specifications

KingScript is an enhanced version based on TypeScript, providing a more powerful type system and runtime optimization.

```typescript
// KingScript — standard approach ✅
class MyController {
  getUser(request: any, response: any) {
    const userId: number = request.getLongPathVariable('id');
    response.ok({ id: userId });
  }
}
```

**KingScript Features:**
- Strong type checking
- Automatic import of system types
- Optimized runtime performance
- Better error messages

### 4.3 Multi-Method Example

```typescript
class UserController {
  // GET /users/{id}
  getUser(request: any, response: any) {
    const userId = request.getLongPathVariable('id');
    // Implementation logic
  }

  // POST /users
  createUser(request: any, response: any) {
    const body = request.getMapBody();
    // Implementation logic
  }

  // PUT /users/{id}
  updateUser(request: any, response: any) {
    const userId = request.getLongPathVariable('id');
    const body = request.getMapBody();
    // Implementation logic
  }

  // DELETE /users/{id}
  deleteUser(request: any, response: any) {
    const userId = request.getLongPathVariable('id');
    // Implementation logic
  }
}

let kwcController = new UserController();
export { kwcController };
```

---

## Chapter 5: Request Handling API

### 5.1 HTTP Method Retrieval

```typescript
const method = request.getHttpMethod();
// Returns: "GET", "POST", "PUT", "DELETE", etc.
```

### 5.2 Path Parameter Retrieval

Path parameters are variables extracted from the URL, such as `id` in `/users/{id}`.

```typescript
// Get as string type
const idStr = request.getPathVariable('id');

// Get as long integer (recommended)
const userId = request.getLongPathVariable('id');
```

**Example:**
```typescript
// URL: /kd/dev/users/123
const userId = request.getLongPathVariable('id');
// userId = 123 (Long type)
```

### 5.3 Query Parameter Retrieval

Query parameters are the parameters after the `?` in the URL, such as `/users?name=ZhangSan&age=25`.

```typescript
// Get all query parameters
const params = request.getQueryParams();

// Get a specific parameter
const nameObj = request.getQueryParam('name');

// Get as string type
const name = request.getStringQueryParam('name');

// Get as integer
const age = request.getIntQueryParam('age');

// Get as long integer
const longId = request.getLongQueryParam('id');

// Get as boolean
const isActive = request.getBooleanQueryParam('active');

// Get as date type
const createDate = request.getDateQueryParam('createDate');
```

**Example:**
```kingscript
// URL: /users?name=ZhangSan&age=25&active=true
const name = request.getStringQueryParam('name');      // "ZhangSan"
const age = request.getIntQueryParam('age');           // 25
const isActive = request.getBooleanQueryParam('active'); // true
```

### 5.4 Request Header Handling

```typescript
// Get all request headers
const headers = request.getHeaders();

// Get a specific request header
const authHeader = request.getHeader('Authorization');
const contentType = request.getHeader('Content-Type');
```

**Example:**
```kingscript
const token = request.getHeader('Authorization');
// Returns: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 5.5 Request Body Handling

```typescript
// Get the raw request body (Object type)
const bodyObj = request.getBody();

// Get the request body as a string
const bodyStr = request.getStringBody();

// Get the request body as a Map (recommended)
const bodyMap = request.getMapBody();
```

**Example:**
```kingscript
// POST /users
// Body: {"username": "admin", "password": "123456"}

const body = request.getMapBody();
const username = body['username'];  // "admin"
const password = body['password'];  // "123456"
```

### 5.6 Comprehensive Example

```typescript
class UserController {
  // Comprehensive use of various parameters
  processUser(request: any, response: any) {
    // Path parameter
    const userId = request.getLongPathVariable('id');

    // Query parameter
    const includeDetails = request.getBooleanQueryParam('includeDetails');
    const lang = request.getStringQueryParam('lang');

    // Request header
    const token = request.getHeader('Authorization');

    // Request body
    const body = request.getMapBody();
    const action = body['action'];

    // Business logic processing
    const result = {
      userId: userId,
      includeDetails: includeDetails,
      lang: lang,
      token: token,
      action: action
    };

    response.ok(result);
  }
}
```

---

## Chapter 6: Response Handling API

### 6.1 Success Response

```typescript
// Return simple data
response.ok('Operation succeeded');

// Return a number
response.ok(100);

// Return an object
response.ok({
  id: 123,
  name: 'Zhang San'
});

// Return list data (must use ArrayList; direct JS arrays are forbidden)
// Native JS [] will be serialized into an empty {} object; you must convert to Java collection types
const items = new ArrayList();
items.add(new HashMap() /* put fields */);
response.ok({ items: items });
```

> **Serialization Constraint**: In `response.ok` parameters, all native JS data structures must be converted to Java collection types, otherwise the serialization result will be abnormal.
> See the `toJavaSafe` utility function in `controller-safe-template.md`.
>
> | JS Type | Java Type |
> |---------|----------|
> | `[]` (Array) | `ArrayList` |
> | `{}` (Object) | `HashMap` |
> | `Set` | `HashSet` |

### 6.2 Error Response

Use the `throwException` method to throw a business exception:

```typescript
// Simple error (uses 400 status code)
response.throwException('Operation failed', 400, 'OPERATION_FAILED');

// With detailed message and business error code
response.throwException('Invalid parameter: username cannot be empty', 400, 'INVALID_PARAM');

// Unauthorized error
response.throwException('Not logged in or session expired', 401, 'UNAUTHORIZED');

// Internal server error
response.throwException('System busy, please try again later', 500, 'SYSTEM_ERROR');
```

**Parameter Descriptions:**
- `message`: Exception message
- `httpStatusCode`: HTTP status code (e.g. 400=Bad Request, 401=Unauthorized, 500=Server Error)
- `businessErrorCode`: Business error code (custom error code defined by the business)

**Common HTTP Status Codes:**
- `400` - Bad Request (request parameter error)
- `401` - Unauthorized (not authorized)
- `403` - Forbidden (access denied)
- `404` - Not Found (resource does not exist)
- `500` - Internal Server Error (server internal error)

### 6.3 Setting HTTP Status Code

Use the `of` method to specify an HTTP status code:

```typescript
// Created successfully (201)
response.of(201, { message: 'Created successfully', id: 123 });

// Delete succeeded (204 No Content)
response.of(204, null);

// Bad request (400)
response.of(400, { error: 'Invalid parameter format' });

// Unauthorized (401)
response.of(401, { error: 'Please log in first' });

// Resource not found (404)
response.of(404, { error: 'User not found' });
```

**Notes:**
- The `ok(data)` method is equivalent to `of(200, data)`
- For error cases, it is recommended to use the `throwException` method instead of the `of` method

### 6.4 Response Data Format

The response follows the RESTful style, returning business data directly and using HTTP status codes to indicate the request result.

**Success Response (HTTP 2xx):**
```json
{
  "id": 123,
  "name": "Zhang San"
}
```

**Error Response (HTTP 4xx / 5xx):**
```json
{
  "message": "Invalid parameter: username cannot be empty",
  "code": "INVALID_PARAM"
}
```

**Response Examples for Different Methods:**

```typescript
// Example 1: Using the ok method (HTTP 200)
response.ok({ id: 1, name: 'Test' });
// HTTP 200, response body: {"id":1,"name":"Test"}

// Example 2: Using the of method (HTTP 201)
response.of(201, { message: 'Created successfully' });
// HTTP 201, response body: {"message":"Created successfully"}

// Example 3: Throwing an exception (HTTP 400)
response.throwException('Username already exists', 400, 'USER_EXISTS');
// HTTP 400, response body: {"message":"Username already exists","code":"USER_EXISTS"}
```

### 6.5 Response Examples

```typescript
class ResponseExample {
  // Example 1: Standard success response
  successExample(request: any, response: any) {
    const data = {
      id: 1,
      name: 'Test data'
    };
    response.ok(data);
    // HTTP 200, response body: {"id":1,"name":"Test data"}
  }

  // Example 2: Response with status code (created successfully)
  createdExample(request: any, response: any) {
    response.of(201, { message: 'Created successfully', id: 123 });
  }

  // Example 3: Error handling
  errorExample(request: any, response: any) {
    try {
      // Business logic
      throw new Error('Business exception');
    } catch (e) {
      response.throwException('Operation failed: ' + e, 500, 'BUSINESS_ERROR');
    }
  }

  // Example 4: Parameter validation failure
  validationExample(request: any, response: any) {
    const body = request.getMapBody();

    if (!body['username']) {
      response.throwException('Username cannot be empty', 400, 'MISSING_USERNAME');
      return;
    }

    if (!body['email'] || !body['email'].includes('@')) {
      response.throwException('Invalid email format', 400, 'INVALID_EMAIL');
      return;
    }

    // Validation passed, continue processing
    response.ok({ message: 'Validation passed' });
  }
}
```

---

## Summary

This guide provides a detailed introduction to script controller development, including:

1. **Basic Concepts**: Understanding the features and application scenarios of script controllers
2. **Quick Start**: Mastering the basic development flow through examples
3. **Configuration in Detail**: Deep understanding of the XML configuration parameters
4. **Script Development**: Mastering KingScript syntax and controller structure
5. **Request Handling**: Proficiently retrieving path parameters, query parameters, request headers, and request bodies
6. **Response Handling**: Learning to use the correct methods for returning success and error responses

Following the best practices in this guide will help you develop high-quality, maintainable script controller code.

## Appendix: DB Query & Runtime Hard Constraints

### QueryServiceHelper.query Signature

```ts
// 4-parameter signature, no limit parameter position
QueryServiceHelper.query(entity, fields, qfilters, orderBy)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `entity` | string | Entity identifier |
| `fields` | string | Query fields, comma-separated |
| `qfilters` | array | Filter condition array; pass `[]` for no conditions |
| `orderBy` | string | Sort field; pass `''` for no sorting |

> **Passing a 5th parameter is forbidden** (e.g. limit), otherwise an HTTP 500 error will be returned.

### Field Name Rules

- **Header fields**: Write the field name directly, e.g. `field1,amountfield,bizdate`
- **Entry fields**: Must carry the entry identifier prefix, e.g. `entryentity.kdtest_combofield`
- The prefix depends on the entry identifier; the most common default entry identifier is `entryentity`; multi-entry entities may use `entryentity1`, etc.
- Field names must strictly match the entity metadata definition; a misspelling will directly result in a 500 response with an empty body

### Exception Handling Convention

```ts
// Forbidden
catch (e) { response.throwException(e.getMessage(), 500, 'ERROR'); }  // .getMessage() is unreliable

// Correct
try {
  // ...
} catch (e) {
  response.throwException('Operation failed: ' + e, 500, 'ERROR');  // Use '' + e
}
```

> The `.message` / `.getMessage()` of Java exception objects is unstable in the KS runtime and may throw a secondary exception. Always use `'' + e` to trigger `toString()` via string concatenation.
