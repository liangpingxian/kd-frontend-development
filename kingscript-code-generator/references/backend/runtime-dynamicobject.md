# DynamicObject Read Conventions

## Recommended Pattern

```ts
const statusValue = row.get('billstatus');
const status = statusValue === null || statusValue === undefined ? '' : `${statusValue}`;
```

## Forbidden Default Pattern

```ts
const status = row?.get?.('billstatus');
```

## Date Field Read Constraint

> Do not call `row.getDate(field)` directly. On some field types it throws an uncatchable exception, leading to an empty HTTP 500 body that `catch` cannot intercept.

- Wrong: `const date = row.getDate('bizdate')`
- Correct: use `row.get(field)` first, then convert to string and parse safely

```ts
const dateStr = row.get('bizdate');
const text = dateStr === null || dateStr === undefined ? '' : `${dateStr}`;
```

See `runtime-date-bridge.md` and pitfall 11 in `faq-runtime-pitfalls.md`.

## Field Name Validation Principle

Query field names must strictly match the entity metadata definition:

- A misspelled or non-existent field name causes a server-side exception that the script layer cannot catch, producing an empty HTTP 500 body
- **Before development, confirm the field list against the entity metadata**, distinguishing header fields from entry fields. Do not guess.
- Entry fields must carry the entry identifier prefix (e.g., `entryentity.kdtest_field`); header fields carry no prefix

## Post-Read Processing Principles

1. Read first: `row.get('fieldKey')`
2. Then convert to string
3. Then convert to number (only if needed)
4. Do not access deeply chained properties directly
5. For date fields, never use `getDate()`; uniformly use `getString` followed by safe parsing

## Pre-Output Self-Check

- Is `row.get('fieldKey')` used consistently?
- Does `row?.get?.(...)` appear anywhere?
- Is the value read first and then explicitly converted, rather than chained?
- For date fields, is `row.getDate()` avoided?
- Are all field names confirmed against the entity metadata, with no spelling errors?
