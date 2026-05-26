# ValidationErrorInfo

## Basic Information

- Name: `ValidationErrorInfo`
- Java class: `kd.bos.entity.validate.ValidationErrorInfo`
- Module: `@cosmic/bos-core`
- Package: `kd/bos/entity/validate`
- Type: Validation error info

## Overview

`ValidationErrorInfo` describes a specific validation failure, typically containing a prompt message, entity location, field location, primary key, and error level.

## Common Methods

| Method | Purpose | Typical Scenario |
|------|------|------|
| `getMessage()` / `setMessage()` | Read/write error prompt | Display error to user |
| `getPkValue()` / `setPkValue()` | Associate specific object | Locate failed document or row |
| `setEntityKey()` | Specify entity | Distinguish header/entry |
| `setSubRowIndex()` | Specify entry row | Precisely locate a specific row |
| `getLevel()` / `setLevel()` | Handle error level | Warning or error classification |

## Runtime Notes

- Writing only a message without location info means the frontend can often only see the prompt, making it difficult to highlight the specific field.
- For entry validation, it is recommended to also provide the entity key and row number.
- If your need is to "aggregate multiple validation results", you typically also need to use [ValidateResult.md](ValidateResult.md) or `OperationResult`.

## Common Pairings

- Error level: [ErrorLevel.md](ErrorLevel.md)
- Validation result: [ValidateResult.md](ValidateResult.md)

## Keywords

- Chinese: validation error, validation failure, error level, entry positioning
- English: `ValidationErrorInfo`
