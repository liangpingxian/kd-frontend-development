# SDK Lookup Strategy

Defines the SDK lookup fallback chain for this skill, focused on KWC script controller backend APIs + data CRUD.

## Goals

- Hit knowledge cards first for hot classes.
- Fall back to local `.d.ts` and online Javadoc for long-tail classes.
- Be explicit about "when to continue falling back vs. when to stop and declare assumptions".

## Fallback chain

### Layer 1: Knowledge cards

- `references/sdk/classes/<ClassName>.md` — 27 core classes (data access, metadata, master data / flex fields, runtime context, etc.)
- Java ↔ KingScript type bridging details live in `../backend/runtime-number-bridge.md` / `runtime-date-bridge.md` / `runtime-dynamicobject.md`

Use when: the class name is known and has a knowledge card / hot class / you need purpose + scenario + risks + FAQ.

### Layer 2: Indexes

When no knowledge card matches, enter by question type:

- Method name → `indexes/methods-hot.md`
- Module → `indexes/module-index.md`
- Business scenario → `indexes/scenario-index.md`
- Keyword / colloquial term → `indexes/keyword-index.md`
- Error → `indexes/error-index.md` (paired with `../backend/faq-runtime-pitfalls.md`)
- Deprecated → `indexes/deprecated-index.md`
- Microservice → `indexes/microservice-index.md`

Use when: you need to locate a class/package/module first; the user's wording does not match the SDK's official name; no knowledge card exists yet.

### Layer 3: Module statistics

When the indexes still aren't enough for detailed answers, read the structured manifests:

- `manifests/summary.json` — overall statistics
- `manifests/modules.json` — statistics for 21 business-domain modules (identifies `@constellation/*` / `@cosmic/*` ownership)

Use when: identifying which business domain an unfamiliar type belongs to / whether a module is in SDK scope.

### Layer 4: Local declarations (.d.ts)

When the manifests can't explain semantics or you need finer signatures, read the local `.d.ts` for `@cosmic/bos-core` and `@cosmic/bos-script`.

- Open the single matched `.d.ts` first; do not scan the entire directory.
- Only read files directly related to the target class / package / method.

### Layer 5: Online Javadoc

When local declarations only provide structure but no semantic description, consult [Cosmic V8.0.1 Javadoc](https://dev.kingdee.com/sdk/Cosmic%20V8.0.1/index.html?nav=class).

Use when: you need parameter / return-value semantics, version info, or deprecation notes; local `.d.ts` comments are insufficient.

### Layer 6: Bounded answer

When none of the above can confirm:

- State clearly what you found / what's missing / what is inferred
- Provide a bounded plan; do not fabricate SDK content

## Stop conditions for lookup

Stop falling back as soon as any one of the following holds:

- Class / scenario / boundaries / risks are confirmed
- A sufficiently trustworthy structured answer can be given
- Further reading would only add noise without meaningfully improving certainty

## Disallowed behaviors

- Skipping the index layer and scanning all of `node_modules` directly
- Assuming runtime availability based only on TypeScript declarations
- Confirming only that a method name exists, without confirming it belongs to the current variable's type or its inheritance chain
- Fabricating APIs from similar names (e.g. writing `queryFirst` instead of `queryOne`)
- Mixing methods from event A's parameters with those from event B's parameters
- Using `any` in generated code instead of the concrete type given in the declarations
- Picking one source when local and online sources conflict, without saying so

## Output requirements

When explaining SDK content, state at minimum: matched class or method · source layer (knowledge card / index / manifest / local declaration / online Javadoc) · confirmed facts · runtime boundaries · open items.

## Feedback loop

When the user or runtime logs prove a piece of code is wrong, don't just fix the current snippet — also judge:

1. Is this a one-off typo, or a class of recurring generation risk?
2. If it can be abstracted into a stable rule, write it back to:
   - Entry constraints: `SKILL.md`
   - Lookup rules: `sdk/strategy.md` (this file)
   - Factual notes: the corresponding `sdk/classes/` / `sdk/indexes/`
   - Runtime rules: the top-level P0 table in `backend/faq-runtime-pitfalls.md`

Typical issues to prioritize for distillation: fake APIs from similar names · methods not belonging to the current object's type · event parameters typed as `any` · BigDecimal / large integer / Java Date bridging errors · response bodies not converted with `toJavaSafe`.
