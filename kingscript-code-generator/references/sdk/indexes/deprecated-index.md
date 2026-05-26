# SDK Deprecated Index

Used to answer "is a given class/method/pattern already deprecated" and "when migrating an older pattern to current Cosmic V8.0.1, where should I look".

## Current status

The repo has not yet accumulated a systematic deprecated-API list. This file is kept as a lookup router for now.

## Recommended lookup order

1. Check [keyword-index.md](keyword-index.md) · [methods-hot.md](methods-hot.md) or `../classes/<ClassName>.md` first to confirm whether the target name still exists.
2. Then check the corresponding `../classes/<ClassName>.md` knowledge card to see whether a replacement entry point is already noted.
3. If still inconclusive, fall back to local `.d.ts` declarations and online Javadoc to verify `@deprecated` markers.

## Suggested entry format

When adding entries, include: the deprecated object, deprecation reason, recommended replacement, scope of impact, and version info.
