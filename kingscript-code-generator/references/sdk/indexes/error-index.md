# SDK Error Index

Reverse-lookup from "error symptom" to the most likely related SDK class, runtime topic, and first investigation entry point.

## How to use

- When the user pastes a concrete error text, match this index by keyword first.
- When the user only describes "package not found" / "wrong type" / "500 empty response", also start here to narrow the scope.
- This index focuses on KWC script controller backend APIs + data CRUD scenarios.

## Hot errors

### 1. Dependency package not recognized / module not found

- Symptoms: `Cannot find module '@cosmic/bos-core/...'`, "package kd/bos/... not found"
- Investigate: whether the import path matches the SDK class card; whether a deprecated / frontend-only package was imported by mistake
- Start with: [module-index.md](module-index.md) · [keyword-index.md](keyword-index.md)

### 2. Controller 500 / empty response body / frontend receives no data

- Symptoms: calling a KWC controller returns 500; the response body is empty; frontend `JSON.parse` fails
- Common root causes:
  - The top-level return is an array instead of an object
  - The response object contains JS native `Array` / `Object` / `Map` / `Set` etc. instead of Java collections
  - The response object contains unconverted native Java handles such as `BigDecimal` / Java Date / DynamicObject
- Start with: [../../backend/faq-runtime-pitfalls.md](../../backend/faq-runtime-pitfalls.md) · [../../backend/controller-safe-template.md](../../backend/controller-safe-template.md)

### 3. QFilter type-cast error / filter conditions ineffective

- Symptoms: `ClassCastException`, "type cast error", query results clearly do not match expectations
- Investigate: whether the comparison value's type matches the field's real type; whether master data / organization / enum values are mistakenly passed as strings; whether date inputs are `java.util.Date`; whether large integers are passed as `BigInt`
- Start with: [../classes/QFilter.md](../classes/QFilter.md) · [../classes/QCP.md](../classes/QCP.md) · [../../backend/runtime-date-bridge.md](../../backend/runtime-date-bridge.md) · [../../backend/runtime-number-bridge.md](../../backend/runtime-number-bridge.md)

### 4. Long-integer precision loss / bill numbers or IDs are mangled

- Symptoms: low-order digits of large integers get rewritten; bill IDs and master data IDs become scientific notation; primary-key comparisons fail
- Investigate: whether long integers are treated as plain `number`; whether string protection is applied before JSON serialization; whether `Number()` is used to force-cast a Java Long
- Start with: [../../backend/runtime-number-bridge.md](../../backend/runtime-number-bridge.md) · [../classes/BigDecimal.md](../classes/BigDecimal.md) · [../classes/SerializationUtils.md](../classes/SerializationUtils.md)

### 5. Amount computation drift / BigDecimal comparison anomalies

- Symptoms: addition/subtraction yields odd trailing digits; `toFixed()` / `Number()` on amounts errors or loses precision; two BigDecimals are never equal
- Investigate: forbid `Number(v)` / `v.toFixed()`; BigDecimal must go through `toSafeNumber` or stay on the Java side; comparison must use `compareTo`
- Start with: [../../backend/runtime-number-bridge.md](../../backend/runtime-number-bridge.md) · [../classes/BigDecimal.md](../classes/BigDecimal.md)

### 6. Date field read/write anomalies / QFilter date input errors

- Symptoms: date fields read out as NaN; `new Date(javaDate)` throws; QFilter returns no data after passing a date
- Investigate: a Java Date cannot be used directly as a JS Date; date inputs must be `java.util.Date` instances
- Start with: [../../backend/runtime-date-bridge.md](../../backend/runtime-date-bridge.md) · [../classes/Date.md](../classes/Date.md)

### 7. Serialization / deserialization failure

- Symptoms: `NotSerializableException`, "deserialization failed", cache or message recovery failures
- Investigate: whether the object contains non-serializable handles such as RequestContext, view context, or DynamicObject; serialization boundaries should be changed to pass primary keys or DTOs
- Start with: [../classes/SerializationUtils.md](../classes/SerializationUtils.md) · [../classes/RequestContext.md](../classes/RequestContext.md)

### 8. DynamicObject field access errors / value is null

- Symptoms: `row.get('xxx')` throws "field does not exist"; entry fields read out as null; master data id cannot be read
- Investigate: whether the field key is correct (entry fields must carry the `entryentity.` prefix); master-data fields require `row.getDynamicObject('field').getPkValue()`; whether the `select` field list was omitted
- Start with: [../../backend/runtime-dynamicobject.md](../../backend/runtime-dynamicobject.md) · [../classes/DynamicObject.md](../classes/DynamicObject.md) · [../classes/EntityMetadataCache.md](../classes/EntityMetadataCache.md)

### 9. OperationResult / ValidateResult validation fails but the response is misaligned

- Symptoms: write clearly succeeded but `isSuccess()` returns false; `allErrorInfo` is empty; frontend receives no error
- Investigate: whether both `getSuccessPkIds` and `getValidateResult` were checked; whether `ErrorLevel` on `ValidationErrorInfo` inside `ValidateResult` is propagated correctly
- Start with: [../classes/OperationResult.md](../classes/OperationResult.md) · [../classes/ValidateResult.md](../classes/ValidateResult.md) · [../classes/ValidationErrorInfo.md](../classes/ValidationErrorInfo.md)

### 10. KDException / business exception not propagated to the frontend

- Symptoms: after throwing, the frontend only sees 500; `ErrorCode` is lost; the stack is swallowed
- Investigate: whether KDException is swallowed in try/catch; whether it is thrown per the ErrorCode spec; whether `toJavaSafe` is applied at the controller exit
- Start with: [../classes/KDException.md](../classes/KDException.md) · [../../backend/controller-safe-template.md](../../backend/controller-safe-template.md)

## Usage tips

- Narrow the scope by error symptom first, then jump to the class card or runtime topic to confirm boundaries.
- When this index doesn't match, continue with [keyword-index.md](keyword-index.md) · [scenario-index.md](scenario-index.md) · [methods-hot.md](methods-hot.md).
- If still insufficient, read local `.d.ts` or online Javadoc.
