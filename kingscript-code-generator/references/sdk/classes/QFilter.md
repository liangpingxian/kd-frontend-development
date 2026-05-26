# QFilter

## Basic Information

- Name: `QFilter`
- Java class: `kd.bos.orm.query.QFilter`
- TS export name: `QFilter`
- Module: `@cosmic/bos-core`
- Package: `kd/bos/orm`
- Namespace: `kd.bos.orm.query`
- Type: Query filter condition class
- Sources:
  - TS declaration: `@cosmic/bos-core/kd/bos/orm/query.d.ts`
  - Javadoc: TBD

## Overview

Used to construct query filter conditions, commonly paired with `BusinessDataServiceHelper`, `QueryServiceHelper`, and `QCP`.

## Typical Scenarios

- Query business data by primary key, code, or status
- Construct conditions such as `=`, `like`, `in`
- Combine multiple conditions and pass them to the query service
- Dynamically assemble query conditions based on user input in plugins

## Common User Phrasings

- How to write filter conditions
- How to write an `in` query
- Why does `QFilter` throw a type conversion error
- What should be passed as filters to the query service

## Common Pairings

- `QCP`
  - Used to represent comparison operators such as `equals`, `in`
- `BusinessDataServiceHelper`
  - Commonly used to load business objects
- `QueryServiceHelper`
  - Commonly used to query single or multiple records
- `ArrayList`
  - In scenarios like `in`, a single `QFilter` internally often requires Java collection types

## High-Value Rules

- Parameters inside a single `QFilter` should prioritize types as required by the runtime
- When combining multiple `QFilter` objects, the outer layer typically uses a TypeScript array
- For `in` scenarios, do not default to passing JS native arrays; check whether `ArrayList` should be used instead
- Editor type checking passing does not guarantee runtime type compatibility

## Example Code

### Scenario 1: Simple equality query

```kingscript
let filters = [];
filters.push(new QFilter("id", "=", 10001));
let data = BusinessDataServiceHelper.loadSingle("bos_user", "id,name", filters);
```

### Scenario 2: `in` query

```kingscript
let filters = [];
let list = new ArrayList();
list.add("CNY");
list.add("USD");
filters.push(new QFilter("number", QCP.in, list));
let datas = BusinessDataServiceHelper.load("bd_currency", "name", filters);
```

## Runtime Notes

- `QFilter` is a runtime-strongly-related type; the focus is not on "whether it can be written", but on "whether the value type passed in is correct"
- Filter field name, entity name, comparison operator, and value type all need to match simultaneously
- For collection-type parameters, prioritize referencing existing FAQs and examples; do not guess freely

## Common Errors

### 1. `QFilter` type conversion error

Common symptoms:
- Runtime type conversion exception
- Query conditions appear fine, but service execution fails

High-probability causes:
- The `in` condition value was passed as an incompatible JS type
- Mixing up the usage levels of Java containers and TS arrays

Recommended troubleshooting order:
1. Check whether the value inside a single `QFilter` requires a Java type
2. Check whether the outer filters is an array
3. Check whether the operator and parameter type match

## Related Documents

- [BusinessDataServiceHelper.md](BusinessDataServiceHelper.md)
- [QueryServiceHelper.md](QueryServiceHelper.md)
- troubleshooting.md
- 4.4.9 QFilter Type Conversion Error

## Keywords

- Chinese keywords: filter condition, condition construction, query condition, `in` query
- English keywords: `QFilter`, `QCP`, filter
- Common error terms: type conversion error, QFilter conversion failed
