# Date Bridging and Filter Risks

## Risk Overview

`Date` in KingScript wraps a Java `Date` object and should not be assumed to be fully equivalent to a JS `Date`.

### Operator Comparison Does Not Work

`Date` objects in KingScript **cannot be compared with `>` `<` `<=` `>=` `==` operators** — the results are not what you would expect:

```ts
let date1: Date = new Date("2024-12-01");
let date2: Date = new Date("2025-01-01");
console.log(date1 <= date2);
// false — expected true, but operator comparison does not apply to the Java Date wrapper
```

**Correct approach**: use the `compareTo()` method or compare after `getTime()`:

```ts
let date1: Date = new Date("2024-12-01");
let date2: Date = new Date("2025-01-01");

// Option 1: compareTo (recommended)
console.log(date1.compareTo(date2) < 0);  // true

// Option 2: numeric comparison after getTime
console.log(date1.getTime() < date2.getTime());  // true
```

| Intended comparison | Wrong | Correct |
|---------|---------|----------|
| date1 < date2 | `date1 < date2` | `date1.compareTo(date2) < 0` |
| date1 > date2 | `date1 > date2` | `date1.compareTo(date2) > 0` |
| date1 == date2 | `date1 == date2` | `date1.compareTo(date2) == 0` |
| date1 <= date2 | `date1 <= date2` | `date1.compareTo(date2) <= 0` |

### `getDay()` Return Range Differs

In KingScript, `Date.getDay()` maps to Java's `Calendar.get(Calendar.DAY_OF_WEEK)`, returning **1–7** rather than JS's **0–6**.

```ts
// Assume today is Thursday
const date = new Date();

// JS Date.getDay()  → returns 4 (0–6, 0 = Sunday)
// KingScript getDay() → returns 5 (1–7, 1 = Sunday)
```

| Language | Method / mapping | Return range | Sunday | Monday | Thursday | Saturday |
|------|----------|---------|--------|--------|--------|--------|
| JavaScript | `Date.getDay()` | 0–6 | 0 | 1 | 4 | 6 |
| KingScript/Java | `Calendar.DAY_OF_WEEK` | 1–7 | 1 | 2 | 5 | 7 |

**Impact**: if you use `getDay()` with JS semantics (e.g., `getDay() === 0` to test for Sunday), the check will never succeed in KingScript.

**Correct approach**: handle values in the 1–7 range, or offset explicitly:

```ts
const day = date.getDay();  // KingScript returns 1–7

// Test for Sunday:
if (day === 1) { /* Sunday */ }

// Test for weekdays (Monday–Friday):
if (day >= 2 && day <= 6) { /* weekday */ }

// To align with JS 0–6 semantics, offset explicitly:
const jsDay = day - 1;  // convert to 0–6
```

## High-Risk Patterns

- Comparing Date objects with operators `>` `<` `<=` `>=` `==` (results are unexpected — use `compareTo()` or `getTime()`)
- Using the `getDay()` return value with JS 0–6 semantics (KingScript actually returns 1–7)
- Layering complex logic on `setHours` / `setMinutes` / `setSeconds`
- Passing the result of a complex date offset directly to `QFilter`
- Assuming timezone and formatting results are identical at runtime

## Recommended Strategies

- Prefer `SimpleDateFormat` for display and grouping
- For complex filtering, prefer reusing verified templates
- When no mature template exists, query broadly first and aggregate inside the script

## `row.getDate(field)` Uncatchable Exception Risk

> **Do not call `row.getDate(field)` directly.** On some field types it throws an uncatchable exception that produces an empty HTTP 500 body, which `catch` cannot intercept.

- Cause: on certain field types, the exception raised by `getDate()` originates deep in the KS runtime and cannot be caught at the script layer
- Alternative: read the value with `row.get(field)`, then convert to string and parse safely

```ts
// Forbidden
const date = row.getDate('bizdate');

// Correct: read as string first, then parse
const dateStr = row.get('bizdate');
const text = dateStr === null || dateStr === undefined ? '' : `${dateStr}`;
// To extract year/month, parse with a regex matching the actual format
const match = text.match(/(\d{4})-(\d{1,2})/);
const year = match ? match[1] : '';
const month = match ? match[2] : '';
```

See pitfall 11 in `faq-runtime-pitfalls.md`.

## Pre-Output Self-Check

- Are Date objects compared with operators `>` `<`? (Use `compareTo()` or `getTime()` instead.)
- Is the `getDay()` return value used with JS 0–6 semantics? (KingScript returns 1–7, Sunday = 1.)
- Is a Java Date being treated as a JS Date for complex arithmetic?
- Are there unverified assumptions about timezone and formatting?
- Could complex filtering be replaced with "wide query + in-script aggregation"?
- Has `row.getDate()` been avoided in favor of `row.get()` + string parsing?
