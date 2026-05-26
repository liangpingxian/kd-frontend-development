# DynamicObjectCollection

## Basic Information

- Name: `DynamicObjectCollection`
- Java class: `kd.bos.dataentity.entity.DynamicObjectCollection`
- Module: `@cosmic/bos-core`
- Package: `kd/bos/dataentity/entity`
- Type: Dynamic entity collection

## Overview

`DynamicObjectCollection` typically carries entry rows, sub-entity collections, or batch query results. In secondary development, operations like "iterating entries", "adding a row", or "deleting a row" almost always involve it.

## Common Methods

| Method | Purpose | Typical Scenario |
|------|------|------|
| `size()` / `isEmpty()` | Check row count | Validate whether entries exist |
| `get(index)` | Get a specific row | Iterate entries to read fields |
| `addNew()` | Append a new row | Add a new entry |
| `add(index, item)` | Insert a row | Insert at a specific position |
| `remove(index)` | Delete a row | Remove an entry |
| `clear()` | Clear the collection | Rebuild entries |

## Runtime Notes

- This is a Java collection; do not use it as a native JS `Array`.
- When iterating, prefer `size() + get(index)` for the best compatibility.
- `addNew()` also returns a `DynamicObject`; after adding, you typically need to continue assigning field values.
- Entry deletion and rebuilding should be aware of triggered linkages, validations, and UI refreshes.

## Common Pairings

- Entity object: [DynamicObject.md](DynamicObject.md)
- Field change listener: [PropertyChangedArgs.md](PropertyChangedArgs.md)

## Keywords

- Chinese: entry collection, entry rows, add entry, delete entry
- English: `DynamicObjectCollection`
