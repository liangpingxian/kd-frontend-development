# Metadata Query, Troubleshooting & Reference Navigation

> This document was split from the main SKILL.md and is loaded on demand. Trigger condition: read this file when you need to query or debug metadata, find reference materials, troubleshoot issues, or use the CLI fallback plan.

## Metadata Query

> Metadata queries are used to search forms and retrieve entity field structures in an authenticated environment, providing context for KS script writing, page development, etc.
> All query operations are performed via the `scripts/meta-query-api.mjs` script; for detailed command reference, see [references/meta-query.md](meta-query.md).

### Trigger Conditions

- The user mentions a form name (e.g. "Sales Order") but does not provide a formNumber
- Need to query the field structure of a form
- Need to understand the entity fields of the target form before KS Controller development
- Need to understand the data model of an associated form during page development

### Prerequisites

- The environment is authenticated (via setup-env.mjs or manual authentication)
- appNumber is known (from the `app` field in `.kd/config.json`, or explicitly provided by the user)

### Workflow

#### Step 1: Search Forms

Prefer using `queryFormsByApp` to search within the current application scope:

```bash
node "{meta_query_api}" queryFormsByApp --appNumber {appNumber} --keyword {keyword}
```

- `appNumber` is obtained from the `app` field in `.kd/config.json`
- `keyword` is the form name keyword mentioned by the user (optional; omit to list all forms under the application)

#### Step 2: Confirm the Target Form

Handle based on the number of results returned:

| Scenario | Handling Method |
|------|----------|
| Single result returned | Confirm directly as the target form, extract `formNumber` |
| Multiple results returned | Display candidates as a list (number / form name / form code / model type / application) and pause to ask the user, presenting the candidates as options for selection |
| Empty results returned | Prompt that nothing was found; suggest trying a different keyword |

#### Step 3: Get Entity Fields (On Demand)

After confirming the target form, retrieve the field structure as needed:

```bash
node "{meta_query_api}" getEntityFields --formNumber {formNumber}
```

The returned results display field key, type, and whether the field is required, grouped by header and entry.

#### Flexible Usage

- Users can also execute only Steps 1–2 (just query the form list) without querying fields every time
- If the user already knows the formNumber, they can directly execute Step 3 to get the field structure
- Query results can be used for KS script writing, page development, or simply understanding the form structure

### Integration with Other Workflows

- **KS Controller Development**: Query the target form's field structure before development to understand the header/entry/sub-entry field keys and types
- **Page Development**: Query associated forms to understand the data model and assist with component design
- **Standalone Use**: When a user just wants to understand a form's structure, it can be called independently

## Quick Navigation

Quickly locate reference documents by common scenarios:

- **New project initialization** → `cli-reference.md` (project init) + main SKILL.md "Initialize Project" section
- **Adding components** → `cli-reference.md` (project create) + `component-metadata.md`
- **Creating pages** → `page-metadata.md` + main SKILL.md "Create Component / Controller / Page" section
- **Environment configuration & deployment** → `env-setup.md` + `cli-reference.md` (deploy/open/debug) + `deployment-guide.md`
- **Application menu management** → `app-menu.md` + `deployment-guide.md` "Application Menu Management" section
- **Metadata queries** → `meta-query.md` + this document's "Metadata Query" section
- **Project workflow orchestration** → `workflow-orchestration.md`

## Reference Materials

| Topic | Reference File |
|------|----------|
| CLI command syntax, parameters, examples | `references/cli-reference.md` |
| Component metadata fields and property types | `references/component-metadata.md` |
| Environment info collection and authentication flow | `references/env-setup.md` |
| Page metadata fields, controls rules, naming conventions | `references/page-metadata.md` |
| Application menu management commands and display conventions | `references/app-menu.md` |
| Metadata query commands and response format | `references/meta-query.md` |
| Complete project workflow orchestration | `references/workflow-orchestration.md` |
| Environment configuration, deployment & menu management | `references/deployment-guide.md` |

## Troubleshooting Cheat Sheet

> The commands below are for diagnostic purposes only; do not use them in normal workflows.

| Symptom | Possible Cause | Solution |
|------|----------|----------|
| `kd project deploy` says not authenticated | Environment has not been authenticated | `kd env auth openapi` |
| Page metadata upload fails | Version not incremented | Increment the version and retry |
| Page displays blank | control.type does not match the component name | Check that the case is exactly the same |
| Component properties don't take effect | Property not declared in .js-meta.kwc | Add a `<property>` definition |
| name validation fails | Format mismatch | Must start with a letter; only lowercase + digits + underscores; ≤30 characters |
| isv mismatch | Page ISV does not match the environment ISV | Deploy will automatically replace; no need to fill manually |
| Running commands outside a KWC project directory | Missing .kd directory | Run `kd project init` first |
| Created a page but the component doesn't show | Component not written into `<controls>` | Edit page-meta.kwp to add a control |
| `kd debug` says port is occupied | Port 3333 is in use | Close the occupying process or restart the terminal |
| `kd debug` starts but can't find the target form / opens the wrong form | Did not use the `-f` parameter to specify the page metadata name, or passed the file name instead of the metadata name value | Use `kd debug -f <page_name>`, where `<page_name>` is **the actual value of the `<name>` node in the current local `.page-meta.kwp` file**. Note: after deploy, the scaffold automatically updates the name in the local file (prepending the isv prefix), so use the full post-deploy name, e.g. `kdtest_demo_page` |
| `kd open` opens the page but it's blank | Not deployed or static files not uploaded | Run `kd project deploy` first to ensure metadata and static files are uploaded |
| `kd open` says form doesn't exist | `-f` parameter value is incorrect | Pass the actual value of the page metadata `<name>` node (the full post-deploy name) |

### Form Name & ISV Prefix Explanation

- **Creation phase**: The `<name>` in `.page-meta.kwp` can be a business identifier, e.g. `demo_page`
- **Deploy phase**: The scaffold automatically fetches the isv from the environment (e.g. `kdtest`), concatenates it to form `kdtest_demo_page` for upload, and **simultaneously updates the local file**
- **Debug/Open phase**: Both `kd debug -f` and `kd open -f` should be passed the **current `<name>` value in the local file** (i.e. the full post-deploy name)
- If unsure, simply open `.page-meta.kwp` and check the `<name>` node

---

## Appendix: CLI Manual Fallback Plan

> **🚫 Restricted Area — The AI must not read or execute the following content**
>
> The CLI commands below are for human troubleshooting reference only. The AI must use automation scripts (project-init.mjs / setup-env.mjs) for project initialization and environment configuration, and use `kd project create` commands for creating components/pages/Controllers.

### A. Project Initialization Fallback

When the `project-init.mjs` script fails, you can fall back to the manual flow:

1. Install the CLI.
2. Run `kd project init <project-name>`.
3. During the interactive flow, select framework and language as per the user's request; if the user has not specified, default to `react` + `ts` without asking. If the user explicitly specifies a different framework (Vue/LWC), follow the user's specification.
4. Enter the application code `app` (rules in the main SKILL.md "Inputs the User Must Supply" section).
5. After initialization, enter the project directory and run `npm install --registry=https://registry.npmmirror.com` (China mirror for speed).
6. Only run `npm run dev` when local component preview is needed.

Supplement: `kd project init` relies on `git clone` to download the template; if it fails, check `git` first.

### B. Component Creation Fallback

When component creation fails, you can fall back to manual creation:

1. Run `kd project create <ComponentName> --type kwc`.
2. Use `PascalCase` for the component name.
3. Let the CLI generate the directory and base files.
4. If the user wants to create multiple components at the same time, execute the create command one by one; do not manually copy and infer the directory structure.

### C. Controller Creation Fallback

When Controller creation fails, you can fall back to manual creation:

1. Run `kd project create <ControllerName> --type controller`.
2. Use `PascalCase` for the controller name; it is recommended to end with a `Controller` suffix.
3. Let the CLI generate the directory and base files. The Controller project is generated under `app/ks/controller/<ControllerName>/`.
4. If you need to specify a target environment for pulling the SDK, use the `-e` option: `kd project create <ControllerName> --type controller -e dev`.

### D. Page Metadata Creation Fallback

When page creation fails, you can fall back to manual creation:

1. Run `kd project create <page-name> --type page`.
2. Open `app/pages/<page-name>.page-meta.kwp`.
3. At a minimum, check and fill in `name`, `masterLabel`, `app`, and `version`.
4. In `<controls>`, associate the page instance with the component type.
5. Only manually increment `version` by `1` when this page metadata file has changes and is ready to be re-uploaded.
6. Map the component tree, instance names, and page layout to XML, rather than stopping at "the component has been created."

### E. Environment Configuration Fallback

When the `setup-env.mjs` script fails, you can fall back to the manual flow:

1. Use `kd env create <env-name> --url <url>` to create an environment alias.
2. Use `kd env auth openapi` for interactive authentication.
3. If the user frequently switches environments, use `kd env set target-env <env-name>` to set the default environment.
4. Use `kd env info` to check the current configuration when needed.

Prefer the `openapi` authentication method; the `web` mode is not the default path at this time.
