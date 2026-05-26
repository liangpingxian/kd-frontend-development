# QCP

## Basic Information

- Name: `QCP`
- Java class: `kd.bos.orm.query.QCP`
- TS export name: `QCP`
- Module: `@cosmic/bos-core`
- Package: `kd/bos/orm`
- Namespace: `kd.bos.orm.query`
- Type: Query comparison operator constant collection
- Sources:
  - TS declaration: `@cosmic/bos-core/bos-ormengine.d.ts`
  - Javadoc: TBD

## Overview

Used to provide comparison operators for `QFilter`. It is a high-frequency companion object when constructing query conditions.

## Typical Scenarios

- Equality, non-equality, contains, not-contains conditions
- `in`, `not in` queries
- Greater than, less than, greater than or equal, less than or equal comparisons
- Combining with `QFilter` to construct complex filter conditions

## Common User Phrasings

- What is `QCP.in`
- What is the difference between `equals` and writing `=` directly
- Should comparison operators be written as strings or as `QCP`

## Common Pairings

- `QFilter`
  - Responsible for carrying the field, comparison operator, and value
- `BusinessDataServiceHelper`
  - Loading business objects by condition
- `QueryServiceHelper`
  - Querying single or multiple records by condition

## Common Constants

- `equals`
- `not_equals`
- `large_than`
- `large_equals`
- `less_than`
- `less_equals`
- `in`
- `not_in`

## High-Value Rules

- Prioritize using `QCP` as the comparison operator entry point, rather than writing strings ad hoc
- For `in` and `not in` scenarios, not only must the comparison operator be correct, but the value type must also be correct
- Writing the correct comparison operator does not guarantee the parameter type is also correct

## Runtime Notes

- Whether a query succeeds depends not only on the comparison operator but also on the field type and the type of the value passed
- `QCP` solves "how to compare", not "how to construct parameters"

## Common Errors

### 1. `QCP.in` paired with a JS array causes a direct runtime error

High-probability cause:
- Only looked at the comparison operator and ignored `QFilter`'s requirements for parameter types

## Related Documents

- [QFilter.md](QFilter.md)
- [BusinessDataServiceHelper.md](BusinessDataServiceHelper.md)
- [QueryServiceHelper.md](QueryServiceHelper.md)

## Keywords

- Chinese keywords: comparison operator, query operator, equals, not equals, in, not in
- English keywords: `QCP`
- Common error terms: operator mismatch, wrong comparison operator
