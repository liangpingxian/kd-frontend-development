# SDK Scenario Index

SDK entry points organized by backend development task scenario. This index only covers KWC script controller + data CRUD scenarios; it does not include frontend-coupled plugins for forms / lists / operations / reports.

| Scenario | Start with | Description |
|------|----------|------|
| Query and filter | `BusinessDataServiceHelper`, `QueryServiceHelper`, `QFilter`, `QCP` | Start from querying data and building filter conditions |
| Data read/write | `DynamicObject`, `DynamicObjectCollection` | Determine whether you have an entity object or an entity collection, then decide to read/write by field or iterate by row |
| Entry entities and metadata | `EntryType`, `SubEntryType`, `EntityType`, `MainEntityType`, `EntityMetadataCache` | Separate entry-structure issues, bill-header-structure issues, and field metadata queries |
| Master data fields | `BasedataProp`, `MulBasedataProp`, `MasterBasedataProp` | Distinguish single-select, multi-select, and master-data field underlying structures |
| Flex field values | `FlexProp`, `FlexProperty`, `FlexEntityType` | Three layers: value object, field attribute, dimension structure |
| Database routing | `DBRoute` | Cross-database queries and custom data-source routing |
| Context and user info | `RequestContext` | User, organization, tenant, account book |
| Validators and operation results | `ValidateResult`, `ValidationErrorInfo`, `OperationResult`, `ErrorLevel` | Distinguish single error, overall validation result, and final operation result |
| Type and runtime bridging | `BigDecimal`, `Date`, `SerializationUtils` | Differences between Java objects and JS native objects; for large integers see `runtime-number-bridge.md` |
| Exception handling | `KDException` | Catching and throwing backend exceptions |
