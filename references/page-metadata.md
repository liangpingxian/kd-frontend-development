# Page Metadata

Read this file on demand. Used for generating page metadata `.page-meta.kwp` from user requirements.

## Purpose of Page Metadata

Page metadata determines how the environment ultimately assembles a page.

It answers at least four questions:

1. What is this page called
2. Which application and ISV does it belong to
3. What component instances are on the page
4. What configuration values does each component instance receive

So page metadata is not "supplementary information" — it is the core description of the final rendering pipeline.

## How to Generate Top-Level Fields

| Field | Generation Principle |
| --- | --- |
| `name` | Page unique identifier; all lowercase; starts with a letter; only lowercase letters, digits, and underscores; **must not exceed 20 characters** (the system will automatically prepend the ISV prefix such as `kdtest_`, and the total length is limited). During creation, you can fill in a business identifier (e.g. `demo_page`); deploy will automatically prepend the isv prefix and update the local file |
| `masterLabel` | Page title; the name displayed to business users |
| `template` | Currently defaults to `oneregion` |
| `isv` | ISV identifier; can be left empty during development; deploy automatically fetches from the environment and writes to the local file |
| `app` | Business application code (must be explicitly provided by the user; see SKILL.md "Inputs the User Must Supply") |
| `bizUnit` | Fill in only when the user explicitly requests placing it under a specific business unit |
| `version` | New pages start at `1`; increment only when the `.page-meta.kwp` file content changes and is ready to be re-uploaded |
| `enableExtend` | Fill in only when the requirement explicitly allows extension |
| `enablePermissionControl` | Fill in only when the requirement explicitly requests permission control |

Recommended page naming:

- `[isv_]{business_app_}page_identifier`
- Keep it as short as possible; avoid exceeding 30 characters

## Generating `<controls>` from Requirements

First break down the page requirements into "component instances that actually appear on the page."

Each instance corresponds to one:

```xml
<control>
    <type>ComponentType</type>
    <name>instance_name</name>
    <label>Component Title</label>
    <propertys>...</propertys>
</control>
```

Field rules:

- `type`: Component type name; must exactly match the component `name` in the component metadata, including case sensitivity
- `name`: Unique instance name within the page; all lowercase; starts with a letter; only lowercase letters, digits, and underscores
- `label`: Display name for the current instance
- `propertys`: Only fill in properties that have already been defined in the component metadata

Correct and Incorrect Examples:

Suppose the component metadata says:

```xml
<name>OverviewCard</name>
```

Then in the page metadata:

```xml
<!-- Correct -->
<type>OverviewCard</type>

<!-- Incorrect: arbitrarily added directory prefix -->
<type>kwc_OverviewCard</type>

<!-- Incorrect: case mismatch -->
<type>overviewcard</type>

<!-- Incorrect: arbitrarily changed the type name -->
<type>OverviewCardKwc</type>
```

The principle is simple: `control.type` directly copies the `name` from the component metadata; do not add prefixes, suffixes, or change the case on your own.

## How to Map User Requirements to Control Instances

### One Page with Multiple Different Functional Blocks

If the user says:

- Top area is a filter section
- Middle area is a statistics card section
- Bottom area is a detail table

Then you should generate multiple `<control>` elements, not one monolithic component.

### Reusing the Same Component Type Multiple Times

If the page needs two instances of the same component:

- `type` can be the same
- `name` must be different
- Each instance's `<propertys>` can be different

Example:

```xml
<control>
    <type>SummaryCard</type>
    <name>sales_summary</name>
    <label>Sales Summary</label>
</control>
<control>
    <type>SummaryCard</type>
    <name>refund_summary</name>
    <label>Refund Summary</label>
</control>
```

## Coordination Between Page Metadata and Component Metadata

Before generating page metadata, first confirm:

1. Does the component have a corresponding `.js-meta.kwc`
2. Does `control.type` exactly match the component metadata `name`
3. Are the property names used in the page already declared in the component metadata

If any of these three conditions are not met, the page will very likely not assemble correctly after deployment.

## Pre-Upload Checks

### Upload Entry Validation

Security access and basic legality checks performed by the scaffold when uploading page metadata (*.kwp):

1. Production environments are strictly forbidden from calling the scaffold upload interface
2. The operating account must have development platform usage authorization
3. The page metadata XML content must not be empty
4. The XML structure must be correct and parseable to successfully obtain a Page object
5. The `name` attribute is required
6. The `isv` attribute is required
7. The `isv` identifier must be consistent with the current environment's ISV information
8. If the page is not a Kingdee in-house page, the `name` attribute prefix must include the `isv` identifier (ISV naming isolation)

### Content Validation

Internal logic, business specification, and version consistency checks for page metadata:

1. The system must verify that no other user is simultaneously uploading or deploying the same page metadata (concurrency check)
2. The XML text content must not be empty
3. The XML must be successfully deserializable to ensure the program can read the Page structure
4. The `name` attribute must not be empty
5. The `name` character length must not exceed **30** characters (the user-filled portion must not exceed **20** characters, because the system will automatically prepend the ISV prefix such as `kdtest_`)
6. `name` must start with a letter and only contain lowercase letters, digits, and underscores
7. `name` naming convention: ensure uniqueness; recommended format: `[isv_]{business_app_}page_identifier`. ISV is optional; business app is required
8. `masterLabel` must not be empty
9. `app` (business application) must not be empty
10. `app` must be a real business application code that exists in the system
11. The ISV of the `app` must be consistent with the page's ISV information
12. The `name` attribute at every level (`Page`, `Region`, `Control`) must not be empty
13. The `name` at every level must conform to the identifier specification (starts with a letter, only lowercase letters, digits, and underscores)
14. If modifying an existing page, the current uploader's ISV must be the same as the original page's ISV
15. The current upload `version` number must be strictly greater than the system's existing page version
16. Every `control.type` can be found with an exactly matching `name` in the component metadata
17. Every `property` name has been defined in the component metadata

## Common Mistakes

- Page `name` contains uppercase letters or hyphens
- Page identifier exceeds 30 characters
- `<controls>` is still the scaffold's default comment template
- `control.type` is written as an instance name instead of a component type name
- `control.type` is semantically similar to the component metadata `name` but the string is not exactly the same
- Component property names are inconsistent with the component metadata definitions
- Forgot to increment `version` after modifying metadata
- Only changed the component implementation code but mistakenly thought the page `version` also needs to be incremented
