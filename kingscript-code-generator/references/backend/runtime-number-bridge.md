# Numeric Type Runtime Conventions (BigDecimal / Long / BigInt)

Numeric objects returned by the Java side (`BigDecimal` / `Long` / `BigInteger`) are not native JS `number` values in the KingScript runtime. Treating them as JS numbers causes two classes of problems:

- Amount / BigDecimal: type checks, formatting, and arithmetic behave differently from native `number`
- Large integer IDs / Long: JS `number` is IEEE 754 double-precision; the safe integer range is ±2⁵³−1 (±9007199254740991), and values beyond that lose precision

This document covers each case with its forbidden and recommended patterns.

---

## 1. BigDecimal / Amount Fields

### Risk

Amount and numeric fields returned by `QueryServiceHelper.query` or `DynamicObject.get` are commonly Java `BigDecimal`, not JS `number`.

### Forbidden Patterns

- `Number(value)`
- `Number.isFinite(value)`
- `value.toFixed(...)`
- Implicit arithmetic like `value + 1`

### Recommended Pattern

```ts
function toSafeNumber(value: any): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  const text = `${value}`;
  const num = parseFloat(text);
  return isNaN(num) ? 0 : num;
}
```

### Applicable Scenarios

- Aggregated amounts, chart amounts, summary-card amounts
- Any BigDecimal field outside the large-integer range

### Self-Check

- Was `Number()` / `toFixed()` / `Number.isFinite()` applied directly to a BigDecimal?
- Is the value stringified first, then `parseFloat`, then guarded with `isNaN`?

---

## 2. Long / BigInteger / Large Integer IDs

### Risk

`Long` / `BigInteger` IDs returned by the Java side (primary key `id`, `PkValue`, etc.) lose precision on assignment, arithmetic, or stringification once they exceed the JS safe-integer range.

### Precision Loss Examples

```ts
// Direct assignment: outside the safe integer range, low digits get truncated
let wrong = 1637034321724565504;       // low digit may drift from the original value

// Direct arithmetic: JS number has insufficient precision
let wrongSum = 1637034321724565504 + 1; // result may not equal 1637034321724565505
```

### Forbidden Patterns

- Assigning a Long/BigInt ID returned from Java directly to a JS `number` variable
- Calling `Number()` on a value outside the safe integer range
- Calling `parseFloat()` / `parseInt()` on a value outside the safe integer range
- Stringifying an **unwrapped** value with `` `${bigintValue}` `` or `String(bigintValue)` (precision is already lost — the string is also wrong)
- Mixing `BigInt` with `number` in arithmetic (e.g., `bigIntVar + 1` throws TypeError)

### BigInt Declaration

```ts
// Option 1: literal suffix n (for known exact literal values)
let id1 = 1637034321724565504n;

// Option 2: BigInt(number) (the input number itself must not exceed the safe integer range)
let id2 = BigInt(1637034321724565505);

// Option 3: BigInt("string") (recommended for external large-integer strings)
let id3 = BigInt("1637034321724565506");
```

> **Recommended: option 3.** For large-integer IDs from the Java side, convert to string first and then `BigInt("...")` to avoid losing precision in an intermediate step.

### BigInt Arithmetic Rules

```ts
let id1 = 1637034321724565504n;
let id2 = BigInt(1637034321724565505);
let id3 = BigInt("1637034321724565506");

// Addition
let v1 = id1 + id2 + id3;               // 4911102965173696515n

// Multiplication: the multiplier must also be BigInt, with the n suffix
let v2 = id1 * 2n;                      // 3274068643449131008n

// Division: the divisor must be BigInt; the result is truncated to an integer
let v3 = id3 / 3n;                      // 545678107241521835n
```

**Rule: BigInt can only operate with BigInt, never with number.**

### Using BigInt in QFilter Queries

Java primary key fields (`id`, `PkValue`) must be passed as `BigInt` in QFilter queries; otherwise precision is lost and no rows match:

```ts
import { BusinessDataServiceHelper } from '@cosmic/bos-core/kd/bos/servicehelper'
import { QFilter } from '@cosmic/bos-core/kd/bos/orm/query'

// Correct: wrap with BigInt and pass as the QFilter value
let id = BigInt("1637034321724565504");
let data = BusinessDataServiceHelper.loadSingle(
  "bos_user",
  "id",
  [new QFilter("id", "=", id)]
);

// When reading the primary key from the return value, wrap with BigInt too
let pk = BigInt(data.getPkValue());
```

### Reading Large Integer IDs from DynamicObject

```ts
// Forbidden: direct conversion to number
// let id = Number(row.get('id'));

// Correct: convert to string first, then wrap with BigInt
const rawId = row.get('id');
const idStr = rawId === null || rawId === undefined ? '' : `${rawId}`;
const id = idStr !== '' ? BigInt(idStr) : 0n;
```

> `` `${rawId}` `` is safe here because `rawId` comes from the Java side and its runtime `toString()` is exact. If you assigned from a JS literal that already lost precision, stringifying cannot recover it.

### Applicable Scenarios

- Querying, comparing, and storing primary key IDs
- Reading and computing on Long-typed fields
- Any integer value exceeding the JS safe integer range (±9007199254740991)

### Self-Check

- Was a Long/BigInt ID returned from Java assigned directly to a JS `number` variable?
- Was a large integer converted via `Number()` / `parseFloat()` / `parseInt()`?
- Are the ID values in QFilter queries wrapped with `BigInt()`?
- Are `DynamicObject.getPkValue()` / `row.get('id')` return values wrapped with `BigInt()`?
- Is `number` mixed into BigInt arithmetic? (Use `BigInt` + the `n` suffix throughout.)
