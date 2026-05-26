# EntryType

## Basic Information

- Name: `EntryType`
- Java class: `kd.bos.entity.EntryType`
- Module: `@cosmic/bos-core`
- Package: `kd/bos/entity`
- Type: Entry entity type

## Overview

`EntryType` describes the metadata of entry entities, such as entry fields, entry display names, primary-foreign key relationships, and sub-entry structures. It answers "what does this entry look like", not "what values does this entry currently hold".

## Common User Phrasings

- How to get entry field metadata
- Whether the current entry entity is a specific entry
- How to distinguish between entry and sub-entry types
- How generic entry tools determine field types

## Runtime Notes

- The page-layer `EntryGrid` focuses on interaction; `EntryType` focuses on structure.
- When handling batch imports, entry copying, or generic entry validation, `EntryType` is more stable than control objects.
- If you only want to get the current row value, prioritize using `getEntryEntity(...)`; do not detour to the metadata layer just to read values.

## Common Pairings

- Entry control: [EntryGrid.md](EntryGrid.md)
- Entry collection: [DynamicObjectCollection.md](DynamicObjectCollection.md)
- Sub-entry type: [SubEntryType.md](SubEntryType.md)

## Keywords

- Chinese: entry type, document body type, entry metadata
- English: `EntryType`
