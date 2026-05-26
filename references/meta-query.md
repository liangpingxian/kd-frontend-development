# Meta Query

Read this file on demand. Used for querying form metadata and entity field structures in the Cosmic environment. All operations are performed via the `meta-query-api.mjs` script.

## Script Location

`meta-query-api.mjs` is located in the `scripts/` subdirectory under the Skill root (i.e. `scripts/meta-query-api.mjs` next to `SKILL.md`). The AI knows the SKILL.md path when this Skill is loaded; join the path directly to call it, no runtime probing needed.

## Command Cheat Sheet

### queryFormsByApp — Search Forms by Application

```bash
node "{meta_query_api}" queryFormsByApp --appNumber {appNumber} [--keyword <keyword>] [--env {envName}]
```

| Parameter | Required | Description |
| --- | --- | --- |
| `--appNumber` | Yes | Application code, corresponding to the `app` field in `.kd/config.json` |
| `--keyword` | No | Additional keyword for fuzzy filtering by name/code |
| `--env` | No | Target environment name; omit to use the default environment |

The primary command for daily use; KWC projects always have an appNumber context.

Example:

```bash
# List all forms under the current application
node "/path/to/meta-query-api.mjs" queryFormsByApp --appNumber kdec_contract

# Filter by keyword within the application
node "/path/to/meta-query-api.mjs" queryFormsByApp --appNumber kdec_contract --keyword expense
```

### getEntityFields — Get Form Entity Fields

```bash
node "{meta_query_api}" getEntityFields --formNumber <formNumber> [--env {envName}]
```

| Parameter | Required | Description |
| --- | --- | --- |
| `--formNumber` | Yes | Form code (e.g. sal_order) |
| `--env` | No | Target environment name |

Queries the entity fields associated with a form by its code, returning results grouped by header and entry.

Example:

```bash
node "/path/to/meta-query-api.mjs" getEntityFields --formNumber sal_order
```

## Response Format

### queryFormsByApp Response

Returns `data` as a form array, each entry containing:

| Field | Type | Description |
| --- | --- | --- |
| `formId` | String | Form internal ID |
| `formNumber` | String | Form code (development identifier) |
| `formName` | String | Form display name |
| `modelType` | String | Model type (bill = business document, base = base data, etc.) |
| `appNumber` | String | Application code it belongs to |
| `appName` | String | Application name it belongs to |

### getEntityFields Response

Returns `data` as a Map with two top-level keys:

- `headerFields`: Header group, containing headerId, headerName, headerKey, and a fields list
- `entryFields`: Entry field mapping, where the key is the entry identifier (entryKey), and the value contains entryId, entryName, entryKey, and a fields list

Each field contains 5 attributes:

| Field | Type | Description |
| --- | --- | --- |
| `id` | String | Field internal ID |
| `name` | String | Field name (in the current locale) |
| `key` | String | Field identifier (e.g. billno, amount) |
| `type` | String | Field type (e.g. TextField, DecimalField) |
| `mustInput` | boolean | Whether the field is required |

## Multiple Results Handling

| Scenario | Handling Method |
| --- | --- |
| Single result returned | Confirm directly as the target form, extract formNumber and proceed to the next step |
| Multiple results returned | Display as a list (number / form name / form code / model type / application) and let the user choose |
| Empty results returned | Prompt that no matching form was found; suggest trying a different keyword |

Display format:

```
Found N matching forms:
  1. Expense Report (uhyl_custom_expen) — Bill — AI Requirements Decomposition
  2. Travel Expense Report (uhyl_travel_expen) — Bill — AI Requirements Decomposition
Please select the target form number:
```

getEntityFields display format:

```
Entity field structure for form "Sales Order":

[Header] Sales Order (billhead)
  - Bill Number (billno) — TextField — Required
  - Bill Date (billdate) — DateField

[Entry] Detail Information (entryentity)
  - Material Code (materialcode) — TextField — Required
  - Quantity (qty) — DecimalField — Required

[Sub-entry] Batch Detail (subentryentity)
  - Batch Number (batchno) — TextField
```

## Use Case Decision Table

| Information Provided by User | Recommended Command | Example |
| --- | --- | --- |
| Application code known | queryFormsByApp | `queryFormsByApp --appNumber {app}` |
| Application + keyword known | queryFormsByApp | `queryFormsByApp --appNumber {app} --keyword expense` |
| Form code known, need to query fields | getEntityFields | `getEntityFields --formNumber sal_order` |

## Error Code Cheat Sheet

| Error Code | Description | Suggested Action |
| --- | --- | --- |
| `PARAM_INVALID` | Parameter validation failed | Check if formNumber is empty, too long, or contains invalid characters |
| `FORM_NOT_FOUND` | Form does not exist | Check if formNumber is correct |
| `500` | Internal server error | Retry or check server logs |
