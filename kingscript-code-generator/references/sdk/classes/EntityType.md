# EntityType

## Basic Information

- Name: `EntityType`
- Java class: `kd.bos.entity.EntityType`
- Module: `@cosmic/bos-core`
- Package: `kd/bos/entity`
- Type: Entity metadata base class

## Overview

`EntityType` represents the metadata definition of a business entity. Capabilities such as field lists, primary keys, display names, parent-child relationships, and sub-entity slicing are all at this level. It is more about "metadata" and "structural description", not actual data objects.

## Common Methods

| Method | Purpose | Typical Scenario |
|------|------|------|
| `getName()` | Get entity name | Logging, metadata debugging |
| `getFields()` | Get field dictionary | Checking if a field exists |
| `findProperty(name)` | Look up field metadata | Dynamically determining field type |
| `getPrimaryKey()` | Get primary key field | Primary key handling, generic tools |
| `getSubEntityType(props)` | Derive sub-entity type | Trimming fields, partial processing |

## High-Value Rules

- `EntityType` is "structure", `DynamicObject` is "data"; do not conflate the two.
- When writing generic tools, bridging code, or complex debugging, `EntityType` provides more value than page events.
- If the question is "is this field a base data / flex / entry field", prioritize confirming at the metadata layer.

## Common Pairings

- Main entity type: [MainEntityType.md](MainEntityType.md)
- Entry type: [EntryType.md](EntryType.md)
- Metadata cache: [EntityMetadataCache.md](EntityMetadataCache.md)

## Keywords

- Chinese: entity type, metadata, field definition
- English: `EntityType`
