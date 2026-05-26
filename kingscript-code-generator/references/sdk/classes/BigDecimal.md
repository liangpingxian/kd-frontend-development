# BigDecimal

## Basic Information

- Name: `BigDecimal`
- Java class: `java.math.BigDecimal`
- TS export name: `BigDecimal`
- Module: `@cosmic/bos-script`
- Package: `java`
- Namespace: `java.math`
- Type: High-precision amount and numeric object
- Sources:
  - TS declaration: `@cosmic/bos-script/index.d.ts`
  - Javadoc: TBD

## Overview

Used to handle high-precision numeric values such as amounts, taxes, exchange rates, and quantities in Kingscript, avoiding precision errors from directly using JavaScript `number`.

## Typical Scenarios

- Adding, subtracting, multiplying, and dividing amounts
- Comparing amount magnitudes
- Controlling decimal places and rounding modes
- Calculating taxes, discount rates, exchange rates and writing back to the model

## Common User Phrasings

- Why can't amounts be added or subtracted directly
- How to use `BigDecimal.ZERO`
- How to compare two amounts for magnitude
- When to use `setScale`

## Common Pairings

- `AbstractBillPlugIn`
  - Handling amounts in document calculation logic
- `AbstractValidator`
  - Validating whether an amount is greater than zero or exceeds a limit
- `Date`
  - Frequently used together with dates for period or validity judgments

## High-Frequency Methods

- `valueOf(...)`
- `add(...)`
- `subtract(...)`
- `multiply(...)`
- `divide(...)`
- `compareTo(...)`
- `setScale(...)`
- `toPlainString()`
- `stripTrailingZeros()`

## Common Constants

- `BigDecimal.ZERO`
- `BigDecimal.ONE`
- `BigDecimal.TEN`

## High-Value Rules

- For amount, tax, and exchange rate fields, prefer `BigDecimal` operations
- For magnitude comparison, prefer `compareTo(...)`; do not compare directly as JS numbers
- Before displaying to users, decide whether to call `setScale(...)` or convert to string

## Runtime Notes

- `BigDecimal` is a Java runtime object, not a native JS number
- When `divide(...)` involves precision and rounding, explicitly specify decimal places or rounding strategy
- It may look like a plain object in the editor, but at runtime it must still be handled as a Java numeric object

## Common Errors

### 1. Directly using `+`, `-` for amount operations

High-probability causes:
- Treating the high-precision object as a JS `number`
- Ignoring the precision requirements of amount fields

## Related Documents

- [AbstractBillPlugIn.md](AbstractBillPlugIn.md)
- [AbstractValidator.md](AbstractValidator.md)
- troubleshooting.md

## Keywords

- Chinese keywords: amount, high-precision, decimal precision, amount comparison, rounding
- English keywords: `BigDecimal`
- Common error terms: precision loss, amount comparison error
