# KDException

## Basic Information

- Name: `KDException`
- Java class: `kd.bos.exception.KDException`
- Module: `@cosmic/bos-core`
- Package: `kd/bos/exception`
- Type: Platform runtime exception

## Overview

`KDException` is the common runtime exception base class on the platform. Many server-side errors are ultimately thrown as it or its subclasses.

## Common Methods

| Method | Purpose |
|------|------|
| `getMessage()` | Get exception message |
| `getErrorCode()` | Get error code |
| `getStackTraceMessage()` | Get stack trace text |
| `getArgs()` | Get error code arguments |

## Runtime Notes

- When providing user prompts, do not expose the full stack trace verbatim.
- If it is only a business validation failure, prioritize using `ValidateResult` / `OperationResult`，instead of throwing exceptions readily.
- For actual troubleshooting, look at error code, message, and stack trace together.

## Common Pairings

- Error index: [../indexes/error-index.md](../indexes/error-index.md)
- Operation result: [OperationResult.md](OperationResult.md)

## Keywords

- Chinese: platform exception, runtime exception, error code
- English: `KDException`
