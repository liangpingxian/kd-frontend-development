# SerializationUtils

## Basic Information

- Name: `SerializationUtils`
- Java class: `kd.bos.dataentity.serialization.SerializationUtils`
- TS export name: `SerializationUtils`
- Module: `@cosmic/bos-core`
- Package: `kd/bos/dataentity`
- Namespace: `kd.bos.dataentity.serialization`
- Type: Serialization and deserialization utility class
- Sources:
  - TS declaration: `@cosmic/bos-core/bos-dataentity.d.ts`
  - Javadoc: TBD

## Overview

Used for handling serialization, deserialization, or transport conversion of Java runtime objects, dynamic objects, and structured data in scripts. It is a key utility class for "how objects cross the bridge and land".

## Typical Scenarios

- Converting dynamic objects to strings or structured results
- Restoring strings back to runtime objects
- Format conversion of API input parameters, callback parameters, and cache values
- Troubleshooting "declarations look normal, but serialization causes runtime errors"

## Common User Phrasings

- How to convert an object to JSON
- How to restore a string back to an object
- Why is the type wrong after serialization
- Why does it work before serialization but methods are gone after serialization

## Common Pairings

- `RequestContext`
  - Context object passing or log troubleshooting
- `BusinessDataServiceHelper`
  - Converting query results to displayable or transmittable data
- `Date`
  - Date field serialization often requires attention to type changes

## High-Value Rules

- First distinguish between "serializing for transport" and "converting to string for display"
- Object semantics before and after serialization may be consistent, but runtime types may not be
- Whenever the issue involves dates, large integers, or dynamic object collections, increase vigilance regarding serialization boundaries

## Runtime Notes

- Whether the serialized result retains the original object's methods cannot be taken for granted
- If you pass a serialized result back into plugin logic, prioritize checking field structure and runtime type first
- TS declarations alone cannot fully explain runtime behavior after serialization

## Common Errors

### 1. Continuing to use the serialized result as the original Java object

High-probability causes:
- Mistaking "same value" for "same type"
- Ignoring that bridged object capabilities have already been lost

## Related Documents

- [RequestContext.md](RequestContext.md)
- troubleshooting.md
- Section 4.4 Common Issues

## Keywords

- Chinese keywords: serialization, deserialization, object to string, JSON conversion
- English keywords: `SerializationUtils`
- Common error terms: serialization failed, deserialization failed, type lost
