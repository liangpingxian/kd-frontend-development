# Script Controller Pitfalls Guide

> Runtime traps to know about before generating KingScript Controller backend scripts.
> Applies to Skill: `kwc-ks-controller-development`

---

## 1. KingScript Runtime API

### 1.1 Unknown identifier: getParameter

**Error**: `Unknown identifier: getParameter`

**Root cause**: The KS runtime's `request` (`ScriptRequestImpl`) does not expose Java Servlet-style methods.

```typescript
// Good
const status = request.getStringQueryParam('status');
const page = request.getIntQueryParam('page') || 1;

// Bad — Servlet style
const status = request.getParameter('status');
// Bad — Express style
const status = request.query.status;
```

> **Rule**: Use `getStringQueryParam()` for string parameters and `getIntQueryParam()` for integer parameters. For the full API, see Chapter 5 of the Script Controller Development Guide.

### 1.2 Java is not defined

**Error**: `Java is not defined`

**Root cause**: The `Java` global object does not exist in the KingScript runtime; you cannot use GraalJS / Nashorn-style `Java.type()`.

```typescript
// Good — import explicitly
import { ArrayList, HashMap } from '@cosmic/bos-script/java/util';
import { QFilter } from '@cosmic/bos-core/kd/bos/orm/query';

// Bad — GraalJS style
const ArrayList = Java.type('java.util.ArrayList');
```

> **Rule**: All Java types must be brought in via `import` statements from the corresponding package paths.

---

## 2. Data Handling

### 2.1 ArrayList Serialization Trap

**Symptom**: After putting an `ArrayList` into `response.ok()`, the frontend receives an empty object or missing fields.

**Root cause**: The JSON serializer in the KS runtime cannot automatically handle Java collection types like `ArrayList<HashMap>`.

```typescript
// Good — call toArray() to convert to a native array
response.ok({
  orders: orders.toArray(),
  total: orders.size(),
});

// Bad — passing ArrayList directly
response.ok({
  orders: orders,
  total: orders.size(),
});
```

**Frontend fallback**:
```typescript
function safeParseArray(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch { return []; }
  }
  return [];
}
```

### 2.2 QueryServiceHelper.query Result Is Not a JS Array

**Symptom**: Calling `.length` or `.map()` on the return value of `query()` throws.

**Root cause**: The return value is a Java `DynamicObjectCollection`, which does not support JS array methods.

```typescript
// Good — iterate with for-of, build ArrayList + HashMap
const result = QueryServiceHelper.query('entity', 'f1, f2', [], '', 0);
const list = new ArrayList();
for (let row of result) {
  let item = new HashMap();
  item.put('f1', row.getString('f1'));
  item.put('f2', row.getString('f2'));
  list.add(item);
}

// Bad — treating it as a JS array
const count = result.length;       // undefined
const mapped = result.map(r => r); // TypeError
```

### 2.3 QFilter Field Names Are Entity Identifiers, Not Database Column Names

**Symptom**: Query results are empty or report that the field does not exist.

```typescript
// Good — Cosmic entity identifier
filters.push(new QFilter('billstatus', '=', status));

// Bad — database column name
filters.push(new QFilter('FBILLSTATUS', '=', status));
```

### 2.4 response.throwException Parameters and the catch Declaration

**Convention**: `response.throwException(message, httpStatusCode, businessErrorCode)`

```typescript
// Good — declare e as any
} catch (e: any) {
  response.throwException(e.message || 'Query failed', 500, 'QUERY_FAILED');
  return;
}

// Bad — not declared as any, TS compile error
} catch (e) {
  response.throwException(e.message, 500, 'QUERY_FAILED');
}
```

> After calling `throwException`, you must `return`, otherwise subsequent code will still execute.

---

## 3. .kws Permission Configuration

### 3.1 Controller 401 — Contradictory Permission Configuration

**Root cause**: `<permitAll>true</permitAll>` and `<anonymousUser>false</anonymousUser>` exist at the same time, forming a logical contradiction.

```xml
<!-- Good — for a public interface, keep only permitAll -->
<permission><permission>
    <permitAll>true</permitAll>
</permission></permission>

<!-- Bad — permitAll contradicts anonymousUser=false -->
<permission><permission>
    <permitAll>true</permitAll>
    <anonymousUser>false</anonymousUser>
    <entityNumber>sal_salorder</entityNumber>
</permission></permission>
```

---

## Quick Checklist

- [ ] request API: use `getStringQueryParam()` / `getIntQueryParam()`, not `getParameter()` or `request.query`
- [ ] Java types: bring in via `import`, not `Java.type()`
- [ ] import path: `QueryServiceHelper` → `@cosmic/bos-core/kd/bos/servicehelper`
- [ ] Query method: `QueryServiceHelper.query()`, not `queryDataSet()`
- [ ] QFilter: `@cosmic/bos-core/kd/bos/orm/query`; field names use entity identifiers
- [ ] ArrayList/HashMap: `@cosmic/bos-script/java/util`; call `toArray()` before responding
- [ ] catch block: declare `e` as `e: any`
- [ ] `return` after `throwException`
- [ ] For public interfaces, keep only `<permitAll>true</permitAll>` in permission
