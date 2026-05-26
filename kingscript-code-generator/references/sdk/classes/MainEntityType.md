# MainEntityType

## Basic Information

- Name: `MainEntityType`
- Java class: `kd.bos.entity.MainEntityType`
- Module: `@cosmic/bos-core`
- Package: `kd/bos/entity`
- Type: Document header main entity type

## Overview

`MainEntityType` is the entity type corresponding to the document header or main business object. It is typically `getDataEntity().getDataEntityType()` the first-level metadata entry point obtained, suitable for confirming document header fields, entry relationships, and entity aliases.

## Typical Scenarios

- Determining which fields the current document header has in generic tools
- Dynamically deciding whether to fill default values based on main entity metadata
- Troubleshooting metadata issues where a field clearly exists but runtime reports it as not found

## Common Pairings

- Metadata base class: [EntityType.md](EntityType.md)
- Dynamic data object: [DynamicObject.md](DynamicObject.md)
- Metadata cache: [EntityMetadataCache.md](EntityMetadataCache.md)

## Keywords

- Chinese: main entity, document header type, main table metadata
- English: `MainEntityType`
