# BasedataProp

## Basic Information

- Name: `BasedataProp`
- Java class: `kd.bos.entity.property.BasedataProp`
- Module: `@cosmic/bos-core`
- Package: `kd/bos/entity/property`
- Type: Base data field metadata

## Overview

`BasedataProp` describes the metadata of base data fields themselves, such as the referenced data type, field structure, and display rules. It is the entry point for "what a base data field looks like", not the entry point for "how the current control pops up F7".

## Typical Scenarios

- Determining whether a field is a base data field
- Identifying field reference types in generic tools
- Confirming metadata definitions when troubleshooting base data field backfill anomalies

## Common Pairings

- Base data control: [BasedataEdit.md](BasedataEdit.md)
- Master data field: [MasterBasedataProp.md](MasterBasedataProp.md)
- Multi-select field: [MulBasedataProp.md](MulBasedataProp.md)

## Keywords

- Chinese: base data field, F7 field metadata
- English: `BasedataProp`
