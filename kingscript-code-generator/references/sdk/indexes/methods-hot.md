# SDK Hot Methods (Backend CRUD)

Focused on the hot methods of the KWC script controller backend APIs + data CRUD. Does not cover frontend plugin lifecycles.

## Data query

| Method | Description | Representative class |
|---|---|---|
| `query` | Returns `DynamicObjectCollection`; supports a select field list + QFilter array + sorting + paging | `QueryServiceHelper` |
| `queryOne` | Returns only one record by QFilter; returns null when nothing matches | `QueryServiceHelper` |
| `queryPrimaryKeys` | Returns only the primary-key set; pair with `loadFromCache` afterwards | `QueryServiceHelper` |
| `exists` | Existence check, used for deduplication and pre-validation | `QueryServiceHelper` · `QFilter.exists/notExists` |
| `loadSingle` | Loads a complete `DynamicObject` by ID or QFilter (including entries / master data) | `BusinessDataServiceHelper` |
| `load` | Batch loads structured `DynamicObject[]` by IDs | `BusinessDataServiceHelper` |
| `loadFromCache` | Loads master data via cache to reduce database pressure | `BusinessDataServiceHelper` |

## Condition building (QFilter)

| Method | Description |
|---|---|
| `new QFilter(field, QCP, value)` | Basic condition; comparators come from `QCP.equals` / `QCP.large_than` etc. |
| `and` / `or` | Combine multiple conditions |
| `exists` / `notExists` | Subquery existence |
| `join` | Joined filter; pull fields across entities |

## Data writes and operations

| Method | Description | Representative class |
|---|---|---|
| `save` | Save a single `DynamicObject` or a collection | `BusinessDataServiceHelper` · `SaveServiceHelper` |
| `update` | Update by primary key | `BusinessDataServiceHelper` |
| `delete` | Delete by primary key or QFilter | `BusinessDataServiceHelper` · `DeleteServiceHelper` |
| `executeOperate` | Invoke standard operations (audit / un-audit / submit, etc.); returns `OperationResult` | `OperationServiceHelper` |

## Metadata reading

| Method | Description | Representative class |
|---|---|---|
| `getDataEntityType` | Get `MainEntityType` by entity number | `EntityMetadataCache` |
| `getSubDataEntityType` | Lightweight entry for list / entry scenarios that only read a subset of fields | `EntityMetadataCache` |
| `getProperty` | Get a single field property from an EntityType (`BasedataProp` / `MulBasedataProp` / `FlexProp`, etc.) | `EntityType` |
| `getPkValue` / `getPkFieldName` | Get the primary key value / primary key field name | `DynamicObject` · `EntityType` |

## Request context and serialization

| Method | Description | Representative class |
|---|---|---|
| `get()` | Get the current tenant / account book / user / language context | `RequestContext` |
| `toJsonString` / `fromJsonString` | JSON serialization / deserialization (watch for large integers) | `SerializationUtils` |

## Usage tips

- When the same method name is spread across multiple classes, prefer the "representative class" in the tables above.
- For method signature details, return to `../classes/<ClassName>.md`; if no knowledge card exists, verify against local `.d.ts`.
- For methods that take BigDecimal / large integer / Java Date parameters, read `../../backend/runtime-number-bridge.md` and `runtime-date-bridge.md` first.
