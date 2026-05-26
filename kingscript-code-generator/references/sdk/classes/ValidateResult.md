# ValidateResult

## Basic Information

- Name: `ValidateResult`
- Java class: `kd.bos.entity.validate.ValidateResult`
- Module: `@cosmic/bos-core`
- Package: `kd/bos/entity/validate`
- Type: Validation result object

## Overview

`ValidateResult` aggregates the overall result after a validation execution, including success status, message, validator identifier, and error collection.

## Common Methods

| Method | Purpose | Typical Scenario |
|------|------|------|
| `isSuccess()` / `setSuccess()` | Check or set validation result | Validator returns result |
| `getMessage()` / `setMessage()` | Read/write overall prompt | Aggregate prompt message |
| `getAllErrorInfo()` / `addErrorInfo()` | Handle error collection | Aggregate multiple errors |
| `getValidatorKey()` / `setValidatorKey()` | Identify validator | Multi-validator chain |

## Runtime Notes

- A single failure item is typically placed in `ValidationErrorInfo`, while the overall result goes in `ValidateResult`.
- If you only add a message without filling in the error collection, complex form field-level pinpointing will be much weaker.
- In some pipelines, the result may be further wrapped in [OperationResult.md](OperationResult.md).

## Common Pairings

- Validation error: [ValidationErrorInfo.md](ValidationErrorInfo.md)
- Error level: [ErrorLevel.md](ErrorLevel.md)

## Keywords

- Chinese: validation result, validator result, validation error collection
- English: `ValidateResult`
