# QueryServiceHelper

## Basic Information

- Name: `QueryServiceHelper`
- Java class: `kd.bos.servicehelper.QueryServiceHelper`
- TS export name: `QueryServiceHelper`
- Module: `@cosmic/bos-core`
- Package: `kd/bos`
- Namespace: `kd.bos.servicehelper`
- Type: Query service helper class
- Source:
  - TS declaration: `@cosmic/bos-core/kd/bos/servicehelper.d.ts`
  - Javadoc: TBD

## Overview

Used to perform query operations, commonly for fetching a single value, a single record, multiple records, or for read-only checks in business logic.

## Typical Scenarios

- Query a single record by primary key
- Query basic information such as suppliers, users, status
- Read-only queries when opening a bill, in field linkage, or in pre-save validation

## Common User Phrasings

- How do I query one record
- How do I use `queryOne`
- Why is the query result empty
- What is the difference between the query helper and the business data helper

## Common Combinations

- `QFilter`
- `QCP`
- `DynamicObject`

## High-Value Rules

- Before querying, decide whether it is a "read-only query" or a "business object load"
- Narrow the field list and filter conditions to the minimum verifiable set first
- When the result is empty, check the context and filter conditions first

## Example Code

### Scenario 1: Query a user record

```kingscript
let user = QueryServiceHelper.queryOne(
  "bos_user",
  "id,name,enable",
  [new QFilter("id", "=", 10001)]
);
```

### Scenario 2: Query supplier credit status after a bill is loaded

```kingscript
let creditObj = QueryServiceHelper.queryOne(
  "bd_supplier",
  "creditstatus,creditlimit",
  [new QFilter("id", QCP.equals, supplierId)]
);
```

## Runtime Notes

- The query service is suitable for reads; do not treat it as a general-purpose object operation entry
- Query result objects usually still carry platform object semantics
- If field precision, dates, or collection types are involved in subsequent processing, continue to follow Kingscript runtime rules

## Common Errors

### 1. Query result is empty

Likely causes:
- Filter conditions do not match
- Query field names are misspelled
- Organization, tenant, account set, or context affects the result

### 2. Type exception in subsequent processing after query

Likely causes:
- Treating the returned object as a native JS object
- Mixing with types related to `BigInt`, `Date`, or serialization

## Related Documents

- [QFilter.md](QFilter.md)
- [BusinessDataServiceHelper.md](BusinessDataServiceHelper.md)
- troubleshooting.md

## Keywords

- Chinese keywords: query service, query one, query single value, read-only query
- English keywords: `QueryServiceHelper`, `queryOne`
- Common error terms: not found, empty object, wrong filter condition
