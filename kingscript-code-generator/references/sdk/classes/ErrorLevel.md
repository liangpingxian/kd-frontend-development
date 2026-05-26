# ErrorLevel

## Basic Information

- Name: `ErrorLevel`
- Java class: `kd.bos.entity.validate.ErrorLevel`
- Module: `@cosmic/bos-core`
- Package: `kd/bos/entity/validate`
- Type: Error level enum

## Overview

`ErrorLevel` is used to indicate the level of validation or error feedback. It does not handle display logic itself, but it affects how the frontend understands and processes the validation result.

## Common Methods

| Method | Purpose | Typical Scenario |
|------|------|------|
| `getValue()` | Get level value | Serialization or compatibility handling |
| `valueOf(int)` | Get level from numeric value | Deserialization or bridging |
| `name()` / `toString()` | Output enum name | Debugging or logging |

## Runtime Notes

- The level itself does not determine whether to block saving; it depends on how the specific validator and result carrier object use it.
- If you only care about "whether the operation can continue", do not focus solely on the level; you must also check `ValidateResult` or `OperationResult` together.

## Common Pairings

- Validation error: [ValidationErrorInfo.md](ValidationErrorInfo.md)
- Validation result: [ValidateResult.md](ValidateResult.md)

## Keywords

- Chinese: error level, validation level
- English: `ErrorLevel`
