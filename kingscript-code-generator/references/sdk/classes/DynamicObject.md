# DynamicObject

## Basic Information

- Name: `DynamicObject`
- Java class: `kd.bos.dataentity.entity.DynamicObject`
- Module: `@cosmic/bos-core`
- Package: `kd/bos/dataentity/entity`
- Type: Dynamic entity object

## Overview

`DynamicObject` is the most common data carrier in Kingscript secondary development. Document headers, entry rows, base data reference values, and query result rows often ultimately land on it or its collections.

## Common Methods

| Method | Purpose | Typical Scenario |
|------|------|------|
| `get(propertyName)` | Get value by field identifier | Reading header fields or reference fields |
| `set(propertyName, value)` | Set value by field identifier | Filling defaults, changing status, writing results |
| `getDynamicObject(propertyName)` | Get reference field entity | Base data, organization, personnel, etc. |
| `getDynamicObjectCollection(propertyName)` | Get entry collection | Iterating and maintaining entry rows |
| `getPkValue()` | Get primary key | Write-back, logging, association checks |
| `getDataEntityType()` | Get entity type | Metadata or generic type determination |

## Runtime Notes

- `get(...)` typically returns Java objects; do not assume they are native JS objects.
- Values like `Long`, `BigDecimal`, and `Date` must be handled as Java objects; do not process long integers directly with JS number precision.
- Reference fields often yield a child `DynamicObject`, not a plain string.
- Entry fields generally require getting `DynamicObjectCollection` first, then reading/writing row by row.

## Common Pairings

- Entry traversal: [DynamicObjectCollection.md](DynamicObjectCollection.md)
- Field change args: [PropertyChangedArgs.md](PropertyChangedArgs.md)
- Operation result handling: [OperationResult.md](OperationResult.md)

## Keywords

- Chinese: dynamic entity, data package, field value retrieval, field value assignment, entry traversal
- English: `DynamicObject`
