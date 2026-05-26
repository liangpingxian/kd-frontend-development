# BusinessDataServiceHelper

## Basic Information

- Name: `BusinessDataServiceHelper`
- Java class: `kd.bos.servicehelper.BusinessDataServiceHelper`
- TS export name: `BusinessDataServiceHelper`
- Module: `@cosmic/bos-core`
- Package: `kd/bos`
- Namespace: `kd.bos.servicehelper`
- Type: Business data service helper
- Sources:
  - TS declaration: `@cosmic/bos-core/kd/bos/servicehelper.d.ts`
  - Javadoc: TBD

## Overview

Used to load business objects by entity, fields, and filter conditions. It is one of the most common data loading entry points in Kingscript secondary development.

## Typical Scenarios

- Loading documents by primary key or code
- Querying base data in linkage logic
- Retrieving business data by condition in button, form, and document plugins
- Using `QFilter` to execute exact or range queries

## Common User Phrasings

- How to query documents
- How to load business objects by condition
- How to use `load` and `loadSingle`
- Why does the query return no data

## Common Pairings

- `QFilter`
  - Used to construct filter conditions
- `QCP`
  - Used to represent comparison operators
- `DynamicObject`
  - Used to carry returned business objects

## High-Value Rules

- First confirm that the entity identifier, field name, and filter condition are all consistent
- First validate a single condition in a minimal query scenario, then add complex conditions
- Loaded data is typically a runtime business object; do not treat it as a plain JS object

## Example Code

### Scenario 1: Loading a single record by condition

```kingscript
let filters = [];
filters.push(new QFilter("id", "=", 10001));
let data = BusinessDataServiceHelper.loadSingle("bos_user", "id,name", filters);
```

### Scenario 2: Loading multiple records by condition

```kingscript
let filters = [];
filters.push(new QFilter("number", "=", "CNY"));
let datas = BusinessDataServiceHelper.load("bd_currency", "id,name,number", filters);
```

## Runtime Notes

- Returned objects, filter parameters, and value types all carry distinct Java runtime semantics
- If no data is found, it may not be a service issue; the entity name, field name, filter value, or context may be incorrect
- When using long integer primary keys, pay special attention to `BigInt` and numeric precision issues

## Common Errors

### 1. Query conditions compile but throw runtime errors

High-probability causes:
- `QFilter` parameter type is incorrect
- `in` condition value collection type is wrong
- Filter field name does not match the entity field

### 2. Data exists but query returns nothing

High-probability causes:
- Filter value type does not match the actual field type
- Context, organization, tenant, or business scenario causes result isolation

## Related Documents

- [QFilter.md](QFilter.md)
- [QueryServiceHelper.md](QueryServiceHelper.md)
- 4.4.4 Long Integer Precision Loss
- 4.4.9 QFilter Type Conversion Error

## Keywords

- Chinese keywords: query document, query base data, load business object, query by condition
- English keywords: `BusinessDataServiceHelper`, `load`, `loadSingle`
- Common error terms: no query result, type conversion error, primary key precision anomaly
