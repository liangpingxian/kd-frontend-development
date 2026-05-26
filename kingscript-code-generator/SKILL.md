---
name: kingscript-code-generator
description: "Use KingScript to develop KWC script controller backend APIs (REST/Web API) and data CRUD (DynamicObject / QueryServiceHelper / QFilter). Prefer reusing the SDK index, runtime constraints, and safe templates in this repository — do not invent APIs."
---

# Kingscript Backend Development Entry Point

This skill focuses on "writing backend APIs + data CRUD in KWC script controllers using KingScript." It does not cover legacy frontend-coupled plugin systems such as forms, lists, operations, or reports.

## When to Trigger

- Writing or modifying KWC script controllers, REST / Web APIs
- Using KingScript to create, update, query, or delete data
- Diagnosing KWC runtime errors, reviewing generated code
- Explaining SDK classes, methods, and Java open-capability mappings

## Task Routing Quick Reference

| What the user asks | Read this first |
|---|---|
| How to configure, write, and deploy a KWC controller | `references/backend/script-controller-guide.md` |
| Starter template / conservative style | `references/backend/controller-safe-template.md` |
| How to write data CRUD | `references/sdk/classes/QueryServiceHelper.md` + `QFilter.md` + `DynamicObject.md` + `BusinessDataServiceHelper.md` |
| Amount / BigDecimal / large integer IDs | `references/backend/runtime-number-bridge.md` |
| Date fields / QFilter date parameters | `references/backend/runtime-date-bridge.md` |
| DynamicObject read conventions | `references/backend/runtime-dynamicobject.md` |
| Runtime errors / empty HTTP 500 body | `references/backend/faq-runtime-pitfalls.md` + `references/sdk/indexes/error-index.md` |
| Don't know which class to use | `references/sdk/indexes/keyword-index.md` or `scenario-index.md` |
| Known class name, need docs | `references/sdk/classes/<ClassName>.md` (if no card exists, locate the module via `indexes/module-index.md`) |
| Known method name, need docs | `references/sdk/indexes/methods-hot.md` (frequently-used backend methods) |
| Syntax / keywords / naming | `references/syntax/` |
| Java ↔ KingScript type bridging | `references/backend/runtime-number-bridge.md` + `runtime-date-bridge.md` + `runtime-dynamicobject.md` |

## Reference Map (Direct Links to Leaf Files)

### Custom Development Topics (Required Reading)

- `references/backend/script-controller-guide.md` — Complete KWC controller development guide (config, URL, permissions, request/response API)
- `references/backend/controller-safe-template.md` — Conservative starter template (includes recursive `toJavaSafe` conversion)
- `references/backend/faq-runtime-pitfalls.md` — P0 hard-constraint master table + 14 common pitfalls
- `references/backend/runtime-number-bridge.md` — BigDecimal / Long / BigInt runtime constraints
- `references/backend/runtime-date-bridge.md` — Java Date ↔ JS Date bridging constraints
- `references/backend/runtime-dynamicobject.md` — DynamicObject read conventions

### SDK Indexes (Reverse Lookup by Known Info)

- `references/sdk/indexes/methods-hot.md` — Frequently-used backend CRUD methods
- `references/sdk/indexes/keyword-index.md` — Reverse lookup by keyword / colloquial term
- `references/sdk/indexes/scenario-index.md` — Reverse lookup by business scenario
- `references/sdk/indexes/error-index.md` — Reverse lookup by error message
- `references/sdk/indexes/deprecated-index.md` — Deprecated / discouraged list
- `references/sdk/indexes/module-index.md` — Reverse lookup by module
- `references/sdk/indexes/microservice-index.md` — Reverse lookup by microservice

### SDK Class Knowledge Cards (CRUD Core)

- **Data access**: `QueryServiceHelper` · `QFilter` · `QCP` · `BusinessDataServiceHelper` · `DBRoute`
- **Data model**: `DynamicObject` · `DynamicObjectCollection`
- **Metadata**: `EntityType` · `MainEntityType` · `EntryType` · `SubEntryType` · `EntityMetadataCache`
- **Base data metadata**: `BasedataProp` · `MulBasedataProp` · `MasterBasedataProp`
- **Flex field metadata**: `FlexEntityType` · `FlexProp` · `FlexProperty`
- **Operation results & validation**: `OperationResult` · `ValidateResult` · `ValidationErrorInfo` · `ErrorLevel`
- **Numbers / dates**: `BigDecimal` · `Date`
- **Request context / exceptions / serialization**: `RequestContext` · `KDException` · `SerializationUtils`

All class files live under `references/sdk/classes/<ClassName>.md`.

### Other SDK

- `references/sdk/strategy.md` — SDK lookup strategy and fallback paths
- `references/sdk/manifests/modules.json` — Statistics for 21 business-domain modules (identifies `@constellation/*` / `@cosmic/*` ownership)
- `references/sdk/manifests/summary.json` — Overall SDK statistics

### Syntax / Keywords / Naming

- `references/syntax/naming-conventions.md`
- `references/syntax/reserved-keywords.md`
- `references/syntax/variables.md`
- `references/syntax/methods.md`
- `references/syntax/classes.md`
- `references/syntax/interfaces.md`
- `references/syntax/conditionals.md`
- `references/syntax/loops.md`
- `references/syntax/exception-handling.md`
- `references/syntax/modules-and-imports.md`
- `references/syntax/syntax-examples.md`

## Runtime Hard Constraints (P0)

The full rules, code examples, and symptom/cause/wrong-pattern breakdowns are in the "P0 master table + self-check list" at the top of `references/backend/faq-runtime-pitfalls.md`. Every constraint must be verified before outputting code; violating any one makes the output unacceptable. Brief recap:

1. No `?.` / `??` / deep destructuring / chained JS calls on Java objects
2. Do not process Java numbers with `Number()/toFixed()/Number.isFinite()`; wrap large integers with `BigInt("...")`
3. Do not treat a Java Date as a JS Date
4. Read DynamicObject uniformly via `row.get('fieldKey')`; entry fields must carry the `entryentity.` prefix
5. The top-level response must be an object (arrays are not allowed as the top level)
6. Response content must be Java collections (`ArrayList` / `HashMap` / `HashSet`); convert recursively with `toJavaSafe`
7. For adapterApi, always check `config.app` / `config.isvId`
8. Do not define `static` methods or `static` variables

## Fallback Lookup Paths

1. User gives only a class name → `sdk/classes/<ClassName>.md` (no card → locate the module via `sdk/indexes/module-index.md`)
2. Only a method name → `sdk/indexes/methods-hot.md`
3. Only a business term → `sdk/indexes/scenario-index.md` or `keyword-index.md`
4. Only an error message → `sdk/indexes/error-index.md` + `backend/faq-runtime-pitfalls.md`
5. Still not enough → local `.d.ts` or online Javadoc; if nothing matches, state assumptions and gaps explicitly — do not fabricate

## Output Rules

Each output follows this structure:

1. **Scenario**: one-sentence statement of the goal
2. **Assumptions**: list the prerequisites being relied on (entity, fields, permissions, runtime version)
3. **Code or plan**: produced per the P0 hard constraints above; all non-global symbols must be explicitly imported
4. **Risks**: unverified points, known runtime pitfalls
5. **Questions to confirm**: information needed from the user before converging

Code hard constraints:

- Before generating code, confirm the real import path of every external class, helper class, and utility class
- Do not rely on IDE auto-import; for any symbol that does not need an import, state the reason (global / locally defined / framework-injected)
- Before calling `obj.method()`, confirm `method` belongs to `obj`'s current type or its declared inheritance chain
- Do not guess methods by "similar name" (e.g., if the declaration is `addItemClickListeners`, do not write `addItemClickService`)
- Event parameter types must not be written as `any`; copy them verbatim from the declaration layer

## Prohibitions

- Do not invent Kingscript APIs, event names, or context object structures
- Do not assume TypeScript declarations guarantee runtime availability
- Do not ignore permission, tenant, organization, account-book, or lifecycle boundaries
- Do not define `static` methods or `static` variables (including `static readonly`)
- When the user points out a problem in generated code, do not just fix the current snippet — also decide whether it should be distilled into a reusable constraint and back-ported to SKILL.md or the relevant runtime document, to prevent recurrence
