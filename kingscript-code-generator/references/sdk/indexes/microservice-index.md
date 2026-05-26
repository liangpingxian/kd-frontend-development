# SDK Microservice Index

Used to answer "is a given capability a microservice entry point" and "after locating it by microservice, where to go next".

## Current status

This skill focuses on KWC script controller backend APIs + data CRUD, and has not yet accumulated microservice-invocation knowledge cards. This file is kept as a lookup router for now.

## Recommended lookup order

1. Check [module-index.md](module-index.md) first to narrow the product domain.
2. Then check [keyword-index.md](keyword-index.md) · [scenario-index.md](scenario-index.md) or `../classes/<ClassName>.md` to find the specific class and method.
3. If still no match, fall back to local `.d.ts` declarations and online Javadoc.

## Suggested entry format

When adding entries, include: service responsibility, typical invocation scenarios, mapping between modules and packages, and common boundaries and invocation limits.
