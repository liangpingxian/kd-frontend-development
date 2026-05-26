# EntityMetadataCache

## Basic Information

- Name: `EntityMetadataCache`
- Java class: `kd.bos.entity.EntityMetadataCache`
- Module: `@cosmic/bos-core`
- Package: `kd/bos/entity`
- Type: Entity metadata cache entry point

## Overview

`EntityMetadataCache` is used to read and reuse metadata by entity identifier, reducing repeated loading and parsing. It is more suitable as a metadata-level tool, debugging aid, or generic framework code, not as a direct business event entry point.

## When to Use

- Need to load by entity code `MainEntityType` / `EntityType`
- Writing generic query, import, or conversion tools
- Making unified judgments such as whether a field exists or what its type is

## High-Value Rules

- It is a cache entry point, not a business data entry point.
- What you get from it is still a metadata object; subsequent use typically requires cooperation with `DynamicObject` or model-layer API.
- When secondary developers ask what fields an entity has, which are entries, which are base data, this cache entry point is more reliable than page events.

## Common Pairings

- Main entity type: [MainEntityType.md](MainEntityType.md)
- Metadata base class: [EntityType.md](EntityType.md)
- Dynamic object: [DynamicObject.md](DynamicObject.md)

## Keywords

- Chinese: metadata cache, entity cache, entity definition cache
- English: `EntityMetadataCache`
