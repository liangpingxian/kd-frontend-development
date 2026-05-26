# KWC Controller Runtime Pitfalls FAQ

This document has two parts:

- **P0 runtime hard-constraint master table** (required reading): a final checklist before outputting code; violating any one makes the output unacceptable
- **Pitfall FAQ**: real symptoms, causes, and wrong/correct patterns for each constraint

---

## P0 Runtime Hard-Constraint Master Table

Script controller code defaults to "runtime stability first," not "modern syntax first." The following constraints are mandatory in the KWC Controller scenario unless a working in-project example explicitly validates an exception.

| # | Constraint | Forbidden | Correct approach | Related pitfall |
|---|---|---|---|---|
| 1 | No high-risk modern syntax | `?.` / `??` / deep destructuring / chained JS calls on Java objects | Explicit null checks; conservative ES subset | Pitfall 1 |
| 2 | Do not treat Java numbers as JS number | `Number(v)` / `v.toFixed()` / `Number.isFinite(v)` / `v + 1` | `${v}` → `parseFloat` → `isNaN` fallback; wrap large integers with `BigInt("...")` | Pitfall 2 |
| 3 | Java Date ≠ JS Date | Complex date offsets, `setHours`, timezone arithmetic followed by direct QFilter use | Wide query + in-script aggregation; for date fields, read as string with `row.get` then parse with regex | Pitfall 5 · Pitfall 11 |
| 4 | Uniform DynamicObject read pattern | `row?.get?.(...)` / `getDate` / chained calls | `row.get('fieldKey')` → explicit type conversion; entry fields must carry the `entryentity.` prefix | Pitfall 9 · Pitfall 11 |
| 5 | Top-level response must be an object | `response.ok(items)` returning an array directly | `response.ok({ itemsJson: JSON.stringify(items) })` | Pitfall 3 |
| 6 | Response content must be Java collections | `response.ok({ list: [...] })` using JS-native arrays/objects | Use `ArrayList`/`HashMap`/`HashSet` at every level; recommended: convert recursively with `toJavaSafe(obj)` | Pitfall 7 · Pitfall 8 |
| 7 | Runtime fallback for adapterApi | Calling without checking `config.app`/`config.isvId` | Confirm both are non-empty before the call; provide an explicit fallback | Pitfall 4 |
| 8 | Do not define `static` members | `static method()` / `static field` / `static readonly` | Organize state with instance methods + instance variables | Pitfall 6 |
| 9 | `QueryServiceHelper.query` takes 4 args only | Passing a 5th `limit` argument | `query(entity, fields, qfilters, orderBy)` | Pitfall 10 |
| 10 | Field names must match metadata | Writing field names from memory / guessing | Confirm header/entry field lists against the entity metadata before development | Pitfall 12 |
| 11 | DynamicObjectCollection does not support for-of | `for (const row of rs)` | Index iteration with `size() + get(i)`, or iterate with `iterator()` | Pitfall 13 |
| 12 | `.message` on Java exception objects is unreliable | `e.message` / `e.getMessage()` / `String(e)` | `'' + e` to trigger `toString()` | Pitfall 14 |

**Pre-output self-check** (every item must pass):

- [ ] Does the code use `?.` or `??`?
- [ ] Were `Number()/toFixed()/Number.isFinite()` applied directly to amount/numeric fields?
- [ ] Are large-integer IDs wrapped with `BigInt("...")`?
- [ ] Does DynamicObject reading consistently use `row.get('fieldKey')`?
- [ ] Do entry-field queries carry the `entryentity.` prefix?
- [ ] Is the top-level response an object? Are nested arrays/objects in the response all converted to Java collection types?
- [ ] For adapterApi scenarios, are `config.app`/`config.isvId` confirmed non-empty?
- [ ] Are any `static` methods or `static` variables defined?
- [ ] Is `QueryServiceHelper.query` called with 4 args? Are field names cross-checked against the metadata?
- [ ] Is `for-of` avoided on `DynamicObjectCollection`?
- [ ] Are exception strings consistently built with `'' + e`?

Detailed rules and code examples follow in the FAQ entries below, plus these neighboring documents:

- `runtime-number-bridge.md` (complete BigDecimal / BigInt rules)
- `runtime-date-bridge.md` (date bridging)
- `runtime-dynamicobject.md` (DynamicObject read conventions)
- `controller-safe-template.md` (conservative starter template, includes `toJavaSafe` implementation)

---

## Pitfall 1: Controller uses `?.`, deploys successfully but errors at runtime

- Symptom: the script deploys successfully, but invoking the API reports a syntax incompatibility or a missing method.
- Cause: the target runtime is not guaranteed to support optional chaining / nullish coalescing.
- Wrong: `const x = obj?.a?.b ?? ''`
- Correct: use explicit null checks; stick to a conservative ES subset.

## Pitfall 2: Amount field is BigDecimal — the stats API returns 500

- Symptom: amount calculation or formatting throws a runtime exception.
- Cause: a Java BigDecimal is invoked as if it were a JS number.
- Wrong: `Number(value)`, `value.toFixed(2)`, `Number.isFinite(value)`
- Correct: stringify first, then `parseFloat`, then guard with `isNaN`.

## Pitfall 3: Top-level response is an array, frontend parsing breaks

- Symptom: the frontend adapter layer reports a parsing error, or the field structure does not match the contract.
- Cause: the top-level API response contract is unstable.
- Wrong: `response.ok(items)`
- Correct: `response.ok({ itemsJson: JSON.stringify(items) })`

## Pitfall 4: Frontend `config.app` is empty — adapterApi reports `Invalid config app provided`

- Symptom: the request fails with `Invalid config app provided`.
- Cause: runtime config is empty or no fallback check was performed.
- Wrong: calling without checking `config.app` and `config.isvId`.
- Correct: confirm `config.app`/`config.isvId` are available before the call, and provide a fallback with clearly defined boundaries.

## Pitfall 5: Using JS Date in a QFilter produces wrong results

- Symptom: query range is offset, rows are lost, or the result is empty.
- Cause: incorrectly assuming Java Date and JS Date are fully equivalent.
- Wrong: passing the result of a complex date offset directly as a `QFilter` argument.
- Correct: prefer reusing verified templates; when no template exists, use "wide query + in-script aggregation."

## Pitfall 6: Defining static members in KS code causes compatibility risk

- Symptom: runtime behavior differs from expectation, or differs across environments.
- Cause: in the KS runtime and script-loading mechanism, the compatibility boundary for static members is unstable.
- Wrong: `static loadData() {}`, `static cache = {}`
- Correct: switch fully to instance methods and instance variables; organize state via an object instance.

## Pitfall 7: response.ok input contains JS-native data structures, serialized as `{}`

- Symptom: `response.ok({ list: [{a:1},{a:2}] })` returns JSON in which `list` is the empty object `{}` rather than an array.
- Cause: when the KingScript runtime serializes on the Java side, it only recognizes Java collection types (`ArrayList`, `HashMap`, `HashSet`); native JS `[]` and `{}` are not correctly recognized by the Java serialization layer, and the array structure is lost.
- Wrong: `response.ok({ items: [{id:1}, {id:2}] })`
- Correct: every array field must be wrapped with `new ArrayList()` + `.add(item)`; objects may use `new HashMap()`. Recommended: use the recursive `toJavaSafe(obj)` helper (see `controller-safe-template.md`).

## Pitfall 8: HashMap nesting JS-native data structures fails the same way

- Symptom: the outer layer uses `new HashMap()`, but an inner array field is still a native JS `[]`; after serialization that field still becomes `{}`.
- Cause: Java serialization is recursive — converting only the outer layer to a Java type is not enough; inner layers must also be Java collection types.
- Wrong: `map.put('items', [{id:1}, {id:2}])` (outer HashMap but inner is still a JS array)
- Correct: recursively ensure all levels of JS-native data structures are converted to the corresponding Java collection type: `[]` → `ArrayList`, `{}` → `HashMap`, `Set` → `HashSet`. Recommended: use the recursive `toJavaSafe(obj)` helper.

## Pitfall 9: Entry-field query missing the `entryentity.` prefix → empty HTTP 500 body

- Symptom: `QueryServiceHelper.query(entity, 'kdtest_combofield,kdtest_amountfield1', [], '')` returns an empty HTTP 500 response body.
- Cause: entry fields must carry the entry identifier prefix; without it the server cannot find the field and errors out directly. The prefix depends on the entry identifier — the most common default is `entryentity`, while multi-entry entities may use `entryentity1`, etc.
- Wrong: `'kdtest_combofield,kdtest_amountfield1'`
- Correct: `'entryentity.kdtest_combofield,entryentity.kdtest_amountfield1'` (header fields carry no prefix)

## Pitfall 10: Calling `QueryServiceHelper.query` with 5 arguments

- Symptom: `query(entity, fields, qfilters, orderBy, 0)` returns an empty HTTP 500 response body.
- Cause: the method has only the 4-argument signature `(entity, fields, qfilters, orderBy)` — there is no `limit` parameter slot.
- Wrong: `QueryServiceHelper.query('entity', 'f1,f2', [], '', 0)`
- Correct: `QueryServiceHelper.query('entity', 'f1,f2', [], '')` (4 arguments)

## Pitfall 11: `row.getDate(field)` throws an uncatchable exception → empty HTTP 500 body

- Symptom: `try { row.getDate('kdtest_datefield1') } catch(e) {}` cannot catch the exception — you get an empty 500 response body directly.
- Cause: on certain field types, the exception raised by `getDate()` originates deep in the KS runtime and cannot be caught at the script layer.
- Wrong: `const date = row.getDate('kdtest_datefield1')`
- Correct: read a string first with `row.getString(field)`, then parse safely. The regex is just an example — the actual format depends on the field type and runtime behavior:
```ts
const dateStr = row.get('kdtest_datefield1');
const text = dateStr === null || dateStr === undefined ? '' : `${dateStr}`;
// To extract year/month, parse with a regex matching the actual format
const match = text.match(/(\d{4})-(\d{1,2})/);
const year = match ? match[1] : '';
const month = match ? match[2] : '';
```

## Pitfall 12: Querying a non-existent field also causes an empty 500 body

- Symptom: the header query uses `kdtest_datefield` (the entity only has `kdtest_datefield1`) — empty HTTP 500 response body directly.
- Cause: query field names must strictly match the entity metadata definition; a misspelled or non-existent field name causes a server-side exception that cannot be caught at the script layer.
- Wrong: writing field names from memory or guessing
- Correct: before development, always confirm the field list against the entity metadata, classifying header fields and entry fields explicitly. Never guess.

## Pitfall 13: `DynamicObjectCollection` does not support JS `for-of`

- Symptom: `for (const row of rs)` throws an uncatchable exception — empty HTTP 500 response body.
- Cause: `DynamicObjectCollection` is a Java collection type and does not implement JS's `Symbol.iterator` protocol; the exception raised by `for-of` cannot be caught at the script layer.
- Wrong: `for (const row of rs) { ... }`
- Correct: iterate with `size() + get(i)` indices or with `iterator`:
```ts
// Option 1: index iteration
for (let i = 0; i < rs.size(); i++) {
  const row = rs.get(i);
}
// Option 2: iterator iteration
const iterator = rs.iterator();
while (iterator.hasNext()) {
  const row = iterator.next();
}
```

## Pitfall 14: Accessing `.message` on a Java exception object is unreliable

- Symptom: `catch(e) { ... String(e.message) ... }` re-throws under some runtime conditions, resulting in a 500.
- Cause: accessing the `.message` property of a Java exception object is unstable in the KS runtime and may trigger a new exception distinct from the original.
- Wrong: `e.message`, `e.getMessage()`, `String(e)`
- Correct: consistently use `'' + e` to trigger `toString()` via string concatenation — the most robust approach:
```ts
try {
  // ...
} catch (e) {
  response.throwException('Operation failed: ' + e, 500, 'ERROR');
}
```
