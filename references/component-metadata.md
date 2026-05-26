# Component Metadata

Read this file on demand. Used for generating component metadata `.js-meta.kwc` from user requirements.

## Purpose of Component Metadata

Component metadata is not a duplicate description of the component code; rather, it tells the KWC environment:

- Whether this component should exist as a deployable component
- What name to display when the component is assembled on a page
- What page types this component supports
- What configuration items can be passed to it from a page

If a component is only for internal logic encapsulation and does not need to be directly declared in the page metadata, the corresponding `.js-meta.kwc` can be deleted to avoid it being uploaded as an assembly component during `deploy`.

## Post-Scaffold-Generation Processing Principles

Execute:

```bash
kd project create DemoComponent1 --type kwc
```

The scaffold will generate:

- `app/kwc/DemoComponent1/DemoComponent1.tsx`
- `app/kwc/DemoComponent1/DemoComponent1.module.scss`
- `app/kwc/DemoComponent1/DemoComponent1.js-meta.kwc`

The `.js-meta.kwc` is more of a template by default and should not be used directly as the final metadata.

The Skill needs to check and fill in:

- `version`
- `name`
- `masterLabel`
- `isv`: ISV identifier; can be left empty during development; deploy automatically fetches from the environment and writes it
- `app`
- `framework`
- `targets`
- `targetConfigs`

## How to Generate Key Fields

### Top-Level Fields

| Field | Generation Principle |
| --- | --- |
| `version` | Set to a natural number; new components typically start at `1`; increment only when the `.js-meta.kwc` file content changes and is ready to be re-uploaded |
| `name` | Component type identifier; typically use the component name directly, e.g. `DemoComponent1`; `control.type` in the page metadata must exactly match this |
| `masterLabel` | A human-readable name for the page assembler |
| `isv` | ISV identifier; can be left empty during development; deploy automatically fetches from the environment and writes it into the metadata |
| `app` | Business application code (must be explicitly provided by the user; see SKILL.md "Inputs the User Must Supply") |
| `framework` | Current project framework, e.g. `react` |
| `targets` | KWC page type; currently defaults to `KWCFormModel` |

Notes:

- `control.type` in the page metadata must exactly match the `name` here, including case sensitivity

Example:

```xml
<!-- Component metadata -->
<name>OverviewCard</name>

<!-- Correct usage in page metadata -->
<type>OverviewCard</type>

<!-- Incorrect usage in page metadata -->
<type>kwc_OverviewCard</type>
```

Do not concatenate the directory name `kwc`, folder levels, or your own naming preferences into `type`; the page metadata only recognizes the `name` declared here.

### Property Section `targetConfigs`

Only generate `<property>` for "parameters that the page configurator needs to adjust."
Do not expose internal state, pure presentation details, or temporary variables as metadata properties.

## Property Design Method

First list the "configurable items" from the requirements, then do the type mapping:

| Requirement Form | Metadata Type |
| --- | --- |
| Text, titles, prompts, interface codes | `String` |
| Quantities, row counts, thresholds | `Integer` |
| Toggles, visibility flags, disable flags | `Boolean` |
| Fixed option sets | `Combo` |

### Recommended Judgments

- If different instances of the same component on a page need different copy or different modes, make it a `<property>`
- If all pages are fixed and consistent, hard-code it in the component code; do not make it a `<property>`
- If the page assembler needs to visually select enum values in the backend, prefer `Combo`

## `<property>` Generation Rules

Common fields for all properties:

- `name`: Code reference name; must be stable and unique within the same page type
- `type`: `String` / `Integer` / `Boolean` / `Combo`
- `caption`: Field title displayed to the configurator
- `description`: Explains what this configuration item does
- `default`: Fill in when a reasonable default value exists

Type-specific supplements:

- `String`: can add `length`
- `Integer`: can add `min` / `max`
- `Boolean`: usually only needs `default`
- `Combo`: must add `items`

## How Page Metadata References Component Properties

If the component metadata defines:

```xml
<property
    name="StringValue"
    type="String"
    caption="Title"
    description="Used to display the title"
    default="Default Title"
/>
```

Then the page metadata can write:

```xml
<propertys>
    <property>
        <name>StringValue</name>
        <value>Home Page Title</value>
    </property>
</propertys>
```

In other words:

- Component metadata defines "what can be configured"
- Page metadata fills in "what value the current instance uses"

## Common Mistakes

- Kept `.js-meta.kwc` but the component doesn't actually need to be exposed as a page component
- Wrote `<property>` in the page but no corresponding definition exists in the component metadata
- `version` left empty
- Only changed the component implementation code but mistakenly thought the component metadata `version` also needs to be incremented
- `masterLabel` is still the scaffold's default English name instead of a readable name
- `isv` is automatically written by deploy; generally no need to worry about it
