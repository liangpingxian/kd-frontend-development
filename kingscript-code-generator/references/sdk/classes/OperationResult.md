# OperationResult

## Basic Information

- Name: `OperationResult`
- Java class: `kd.bos.entity.operate.result.OperationResult`
- Module: `@cosmic/bos-core`
- Package: `kd/bos/entity/operate/result`
- Type: Operation result object

## Overview

`OperationResult` carries the result information after a server-side operation executes, including success status, success primary keys, validation results, error information, and feedback messages.

## Common Methods

| Method | Purpose | Typical Scenario |
|------|------|------|
| `isSuccess()` | Check if successful | Determining outcome after submit, approve, or save |
| `getMessage()` / `setMessage()` | Read/write prompt info | Feeding back readable messages to users |
| `getSuccessPkIds()` | Get successful document primary keys | Subsequently opening documents, writing back |
| `getAllErrorInfo()` | Get error information | Aggregating failure reasons |
| `getValidateResult()` | Get validation result | Linking with validators |
| `mergeOperateResult(...)` | Merge results | Batch or sub-process aggregation |

## Runtime Notes

- `isSuccess()` does not just check for exceptions; it is also affected by validation results and error information.
- In batch operations, "partial success" often occurs; do not rely on a single message.
- If you need to give the frontend clearer feedback, you typically need to handle `message`, the error collection, and the success primary keys simultaneously.

## Common Pairings

- Form operation object: [FormOperate.md](FormOperate.md)
- Validation result: [ValidateResult.md](ValidateResult.md)
- Validation error: [ValidationErrorInfo.md](ValidationErrorInfo.md)

## Keywords

- Chinese: operation result, success primary key, error info, validation result
- English: `OperationResult`
