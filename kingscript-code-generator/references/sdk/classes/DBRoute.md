# DBRoute

## Basic Information

- Name: `DBRoute`
- Java class: `kd.bos.db.DBRoute`
- Module: `@cosmic/bos-core`
- Package: `kd/bos/db`
- Type: Database route object

## Overview

`DBRoute` is used to describe database access routes. Any scenario involving direct database capabilities, database sharding, or primary key retrieval by route may encounter it.

## Common Methods

| Method | Purpose |
|------|------|
| `of(...)` | Create route |
| `getPrimaryKeys(...)` | Get primary keys on the specified route |

## Runtime Notes

- Direct database access is a high-risk capability; prioritize confirming whether a higher-level service/helper is available.
- A wrong route typically does not just mean "cannot find data"; it may also cause organization boundary or data isolation issues.

## Common Pairings

- Exception system: [KDException.md](KDException.md)

## Keywords

- Chinese: database route, sharding route
- English: `DBRoute`
