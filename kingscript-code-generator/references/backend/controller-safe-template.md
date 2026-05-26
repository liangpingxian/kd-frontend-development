# KWC Controller Conservative Stable Template

This template is the recommended default starting point for script controllers.

Constraints:

- Use a conservative ES subset — no `?.`, no `??`
- Use conservative numeric conversion for amount fields
- The top-level response returns an object; list fields use JSON strings or `ArrayList`
- **In `response.ok` input, every JS-native data structure must be converted to a Java collection type**: `[]` → `ArrayList`, `{}` → `HashMap`, `Set` → `HashSet`
- Do not define `static` methods or `static` variables
- Do not use `for-of` on `DynamicObjectCollection` — only `size()+get(i)` or `iterator`
- Always build exception strings with `'' + e`; never `e.message` / `e.getMessage()` / `String(e)`
- Entry-field queries must carry the `entryentity.` prefix (the prefix depends on the entry identifier — default is `entryentity`, multi-entry may be `entryentity1`, etc.)
- `QueryServiceHelper.query` has only a 4-argument signature; no `limit` slot

## Utility Functions

### toSafeNumber — Conservative Numeric Conversion

```ts
private toSafeNumber(value: any): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  const text = `${value}`;
  const parsed = parseFloat(text);
  return isNaN(parsed) ? 0 : parsed;
}
```

### toJavaSafe — Recursive Conversion to Java Collection Types

Recursively converts JS-native data structures to Java collection types, ensuring `response.ok` serializes correctly.

- `[]` → `new ArrayList()`
- `{}` → `new HashMap()`
- `Set` → `new HashSet()`
- Primitives (string/number/boolean/null) pass through unchanged

```ts
private toJavaSafe(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  // JS Array → ArrayList
  if (Array.isArray(obj)) {
    const list = new ArrayList();
    for (let i = 0; i < obj.length; i++) {
      list.add(this.toJavaSafe(obj[i]));
    }
    return list;
  }
  // JS Set → HashSet
  if (obj instanceof Set) {
    const set = new HashSet();
    const entries = Array.from(obj);
    for (let i = 0; i < entries.length; i++) {
      set.add(this.toJavaSafe(entries[i]));
    }
    return set;
  }
  // JS Object → HashMap
  if (typeof obj === 'object') {
    const map = new HashMap();
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      map.put(keys[i], this.toJavaSafe(obj[keys[i]]));
    }
    return map;
  }
  return obj;
}
```

### readString — Safely Read a Field as String

```ts
private readString(row: any, fieldKey: string): string {
  const value = row.get(fieldKey);
  return value === null || value === undefined ? '' : `${value}`;
}
```

### readAmount — Safely Read an Amount / Numeric Field

```ts
private readAmount(row: any, fieldKey: string): number {
  return this.toSafeNumber(row.get(fieldKey));
}
```

### readDateStr — Safely Read a Date Field as String

> Do not call `row.getDate(field)` directly — some field types throw uncatchable exceptions that cause a 500.
> The regex is just an example — the actual format depends on the field type and runtime behavior.

```ts
private readDateStr(row: any, fieldKey: string): string {
  return this.readString(row, fieldKey);
}

// To extract year/month, parse with a regex matching the actual format
private readYearMonth(dateStr: string): { year: string; month: string } {
  const match = dateStr.match(/(\d{4})-(\d{1,2})/);
  return {
    year: match ? match[1] : '',
    month: match ? match[2] : ''
  };
}
```

## Complete Template Example

```ts
class DemoController {

  private toSafeNumber(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    const text = `${value}`;
    const parsed = parseFloat(text);
    return isNaN(parsed) ? 0 : parsed;
  }

  private toJavaSafe(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return obj;
    }
    if (Array.isArray(obj)) {
      const list = new ArrayList();
      for (let i = 0; i < obj.length; i++) {
        list.add(this.toJavaSafe(obj[i]));
      }
      return list;
    }
    if (obj instanceof Set) {
      const set = new HashSet();
      const entries = Array.from(obj);
      for (let i = 0; i < entries.length; i++) {
        set.add(this.toJavaSafe(entries[i]));
      }
      return set;
    }
    if (typeof obj === 'object') {
      const map = new HashMap();
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        map.put(keys[i], this.toJavaSafe(obj[keys[i]]));
      }
      return map;
    }
    return obj;
  }

  private readString(row: any, fieldKey: string): string {
    const value = row.get(fieldKey);
    return value === null || value === undefined ? '' : `${value}`;
  }

  private readAmount(row: any, fieldKey: string): number {
    return this.toSafeNumber(row.get(fieldKey));
  }

  private readDateStr(row: any, fieldKey: string): string {
    return this.readString(row, fieldKey);
  }

  // Header field + entry field query example
  // Header fields are plain field names; entry fields must carry the entry identifier prefix
  getData(request: any, response: any) {
    try {
      // Header fields: field1, amountfield, bizdate
      // Entry fields: entryentity.kdtest_combofield, entryentity.kdtest_amountfield1
      const rows = QueryServiceHelper.query(
        'entity_name',
        'field1,amountfield,bizdate,entryentity.kdtest_combofield,entryentity.kdtest_amountfield1',
        [],
        ''
      );

      const items = new ArrayList();
      const iterator = rows.iterator();

      while (iterator.hasNext()) {
        const row = iterator.next();

        const item = new HashMap();
        item.put('name', this.readString(row, 'field1'));
        item.put('amount', this.readAmount(row, 'amountfield'));
        item.put('date', this.readDateStr(row, 'bizdate'));

        items.add(item);
      }

      response.ok(this.toJavaSafe({
        items: items
      }));
    } catch (e) {
      response.throwException('Failed to fetch data: ' + e, 500, 'GET_DATA_ERROR');
    }
  }
}

const kwcController = new DemoController();
export { kwcController };
```

### Iteration Patterns

`DynamicObjectCollection` does not support JS `for-of`. Only the following two patterns are allowed:

```ts
// Option 1: iterator iteration (recommended)
const iterator = rows.iterator();
while (iterator.hasNext()) {
  const row = iterator.next();
}

// Option 2: size() + get(i) index iteration
for (let i = 0; i < rows.size(); i++) {
  const row = rows.get(i);
}

// Forbidden: for-of throws an uncatchable exception → 500
// for (const row of rows) { ... }  // ← forbidden
```
