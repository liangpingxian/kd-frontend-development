# SDK Keyword Index

Reverse-lookup from common colloquial terms / keywords to SDK classes. Only covers KWC controller backend + data CRUD scenarios.

| Keyword | Recommended target | Scenario | Description |
|--------|----------|------|------|
| filter condition | `QFilter` | Query and filter | Commonly used to build in / and / or conditions |
| query bill | `BusinessDataServiceHelper` | Query and filter | Load a bill or master data by entity |
| query service | `QueryServiceHelper` | Query and filter | Query a single value, single record, or multiple records |
| query one | `QueryServiceHelper` | Query and filter | `queryOne` scenario |
| comparator / query operator | `QCP` | Query and filter | Companion to `QFilter` (equals, in, not in, etc.) |
| dynamic entity | `DynamicObject` | Data read/write | Hot data carrier for bill headers, entry rows, and query results |
| entry collection | `DynamicObjectCollection` | Data read/write | Add entries, delete entries, iterate entries (note: for-of is forbidden, see FAQ) |
| entry type | `EntryType` | Metadata | Bill-body entity metadata |
| sub-entry type | `SubEntryType` | Metadata | Sub-bill-body entity metadata |
| entity type | `EntityType` | Metadata | Generic entity metadata definition |
| main entity type | `MainEntityType` | Metadata | Bill-header metadata entry point |
| metadata cache | `EntityMetadataCache` | Metadata | Read metadata definition by entity |
| master data field | `BasedataProp` | Metadata | Master data field metadata |
| master file field | `MasterBasedataProp` | Metadata | Master file master-data field metadata |
| multi-select master data field | `MulBasedataProp` | Metadata | Multi-select master-data field structure |
| flex field | `FlexProp` | Metadata | Flex field metadata |
| flex entity type | `FlexEntityType` | Metadata | Flex composite entity structure |
| flex property | `FlexProperty` | Metadata | Flex dimension property definition |
| database route | `DBRoute` | Data access | Sharded or routed access |
| current user / current organization / current tenant / login organization | `RequestContext` | Context | User, organization, tenant, account book isolation and multi-account-book scenarios |
| serialization / deserialization | `SerializationUtils` | Type bridging | Convert between Java objects and strings |
| long integer / large integer ID | `runtime-number-bridge.md` | Type bridging | Exceeds JS number safe range; must use `BigInt("...")` |
| amount / high precision | `BigDecimal` + `runtime-number-bridge.md` | Type bridging | Amounts, taxes, exchange rates, etc.; `Number()` / `toFixed()` are forbidden |
| date / date comparison | `Date` + `runtime-date-bridge.md` | Type bridging | Runtime Java Date objects; do not treat as JS Date |
| operation result | `OperationResult` | Operation result | Batch results, success primary keys, error info |
| validation error | `ValidationErrorInfo` | Operation result | A single validation-failure entry |
| validation result | `ValidateResult` | Operation result | Overall result returned by a validator |
| error level | `ErrorLevel` | Operation result | Severity classification for validation failures |
| platform exception | `KDException` | Error handling | Platform runtime exception |
| Java bridging | `runtime-number-bridge.md` + `runtime-date-bridge.md` + `runtime-dynamicobject.md` | Type bridging | Rules for using Java objects in KingScript |
