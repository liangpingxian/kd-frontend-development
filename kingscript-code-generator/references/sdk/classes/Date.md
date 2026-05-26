# Date

## Basic Information

- Name: `Date`
- Java class: `java.util.Date`
- TS export name: `Date`
- Module: `@cosmic/bos-script`
- Package: `java`
- Namespace: `java.util`
- Type: Runtime date-time object
- Sources:
  - TS declaration: `@cosmic/bos-script/index.d.ts`
  - Javadoc: TBD

## Overview

Used to carry date or date-time values at runtime. Although it shares the same name as the native JS `Date`, in Kingscript scenarios it should be understood and handled as a Java date object.

## Typical Scenarios

- Document date comparison
- Validity period, expiration date, and period determination
- Minimum and maximum constraints on date fields
- Used with `DateEdit` and `DateRangeEdit` controls

## Common User Phrasings

- Is `Date` in Kingscript the same as JS `Date`
- How to compare two dates
- Why does a date field look correct in type but behave differently at runtime

## Common Pairings

- `FormShowParameter`
  - Carrying date-type parameters when opening a page
- `BasedataEdit`
  - Appearing together with business date conditions during queries or assignments
- `BigDecimal`
  - Frequently appearing together in period amount, depreciation, and amortization scenarios

## High-Value Rules

- Treat it as a Java date object first, not a native JS object
- When comparing dates, prefer runtime-stable methods such as `compareTo(...)` or `getTime()`
- The display format and runtime object of a date field are at different levels and should not be conflated

## Runtime Notes

- Having the same name does not mean its behavior is fully consistent with JS `Date`
- During date comparison, serialization, and field write-back, first confirm whether you have a runtime date object or a string
- The existence of a declaration does not mean all JS-style date patterns can be used directly

## Common Errors

### 1. Treating the runtime date object as a plain string or JS date

High-probability causes:
- Ignoring the Java object bridging
- Only looking at editor hints without checking the actual runtime type

## Related Documents

- troubleshooting.md
- 4.4 Common Issues

## Keywords

- Chinese keywords: date, date comparison, timestamp, date object
- English keywords: `Date`
- Common error terms: date comparison error, date type mismatch
