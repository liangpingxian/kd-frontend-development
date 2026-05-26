Complete environment configuration before deployment.

### Environment existence check

When the user provides a specific environment name or alias (e.g. `dev`, `sit`, `uat`), first run an environment existence check:

1. Run `kd env list` to view the currently configured environments
2. If the target environment already exists in the list:
   - Do not collect URL, Client ID/Secret, or any other environment info from the user
   - Use that environment directly for subsequent operations (deploy, debug, etc.)
   - If it is not the current default environment, switch with `kd env set target-env <name>`
   - Use `kd env list` to confirm the environment's authentication status
3. Only when the environment does not exist do you enter the full environment creation and authentication flow

### New environment flow

> **⚠️ Must be executed via the script. Do NOT run any interactive kd CLI commands directly in the terminal.**

When the environment does not exist, follow this flow:

#### Must use the automation script

**You must use the `setup-env.mjs` script to complete environment configuration; running interactive CLI commands directly is forbidden.**

Use `setup-env.mjs` to create and authenticate the environment in one shot. The script automatically detects whether the environment already exists and decides whether creation is needed.

The AI **must** first collect the following authentication info from the user; if the user has not provided it, **stop and ask**:

**Always required:**
- Environment name (envName)
- Client ID (clientId)
- Client Secret (clientSecret)
- Username (username)

**Conditionally required:**
- Environment URL (envUrl): required when the environment does not exist; can be omitted when it does

> If the environment already exists (e.g. it was created earlier with `kd env create`), you only need to provide the authentication parameters (clientId, clientSecret, username); the script will skip environment creation and authenticate directly.

Once collected, execute:

> The script lives in the `scripts/` subdirectory under this Skill's install directory, not in the user's project. Determine the absolute path to this SKILL.md first, then execute:

```bash
# When the environment does not exist (needs creation):
node $SKILL_DIR/setup-env.mjs --envName <env name> --envUrl <URL> --clientId <ID> --clientSecret <Secret> --username <username>

# When the environment already exists (auth only; the script reads url from ~/.kd/config.json):
node $SKILL_DIR/setup-env.mjs --envName <env name> --clientId <ID> --clientSecret <Secret> --username <username>

# Multi-datacenter (first call exits with code 2 and prints the candidate list; re-run with --datacenter as instructed):
node $SKILL_DIR/setup-env.mjs --envName <env name> --envUrl <URL> --clientId <ID> --clientSecret <Secret> --username <username> --datacenter <accountId>
```

**Script execution flow (zero-interaction, cross-platform):**
1. Parameter validation
2. Determine `envUrl` (prefer `--envUrl`; when the environment exists, may be read from `~/.kd/config.json`)
3. Probe the datacenter list with a side-effect-free call to `<envUrl>/auth/getAllDatacenters.do` (a failure does not pollute local config)
4. Decide based on the number of datacenters:
   - **1** → use it automatically and continue
   - **Multiple + `--datacenter` provided** → if the `accountId` exists, use it
   - **Multiple + `--datacenter` not provided** → print the candidate list + **exit code 2**, asking the caller to re-run with `--datacenter <accountId>` (no createEnv has happened yet, so no orphan environments are left behind)
5. Only after the datacenter is confirmed is createEnv called (if it does not exist)
6. Authenticate using the native parameters `kd env auth openapi -e <env> --datacenter <id> --client-id <cid> --client-secret <secret> --username <user>`
7. Verify from `~/.kd/config.json` that `client_id / access_token / username` have indeed been persisted

**Exit code convention:**
- `0`: success
- `1`: parameter error / auth failure / other error
- `2`: multi-datacenter with `--datacenter` not specified; stderr contains the candidate list in the format `accountName<TAB>(accountId=xxx)`

**AI handling strategy:**
When the script returns exit code `2`, extract the candidate list from stderr and present it as options to the user (display the `accountName` field). After the user selects, re-run the script with `--datacenter <accountId>`.

### When to collect environment info

If the target environment does not exist, or it exists but is not yet authenticated, stop and collect these fields first:

**Always required:**
- Environment alias
- Client ID
- Client Secret
- Username

**Additionally required when the environment does not exist:**
- Environment URL

`data center` is not a pre-filled field; it is a "read-then-select" field:

- The environment URL must exist first
- Before authenticating, setup-env.mjs calls `<envUrl>/auth/getAllDatacenters.do` to read the available datacenter list
- **Single datacenter**: the script auto-selects it (accountId); no user intervention needed
- **Multiple datacenters**: the script terminates with **exit code 2** and prints the candidate list (`accountName <TAB> accountId=...`); the AI should present the candidates as options to the user (display field: `accountName`; input field: `accountId`), then re-run the script with `--datacenter <accountId>`

Collection rules:

- The environment alias, environment URL, Client ID, Client Secret, and Username must be provided by the user manually
- Do not let the user freely input `data center`; have the scaffold read the candidates first, then choose
- Do not guess credentials for a new environment from historical ones
- Do not auto-infer which environment to bind just because aliases like `dev`, `sit`, `base` exist

Interaction rules:

- Do not assume that pop-ups or form-style input are necessarily supported in the current mode
- In normal mode, have the user fill the manual fields first; data center is handled by setup-env.mjs (single auto-selected; multiple via exit code 2 + AI interaction)
- If the runtime explicitly supports a structured selection tool, after the script returns exit code 2 you may show the candidate list as options to the user
- Even so, free-form values like Client Secret should still be entered by the user manually

Recommended template for asking the user for environment info (when the environment does not exist):

```text
Please provide the following environment info:
1. env name:
2. env url: (may be omitted if the environment already exists)
3. client id:
4. client secret:
5. username:

Notes:
- If the environment already exists, only fill in 1, 3, 4, 5; the script will skip creation and authenticate directly
- data center does not need to be filled in advance; the scaffold will read the candidates for you to choose from later
```

Additional notes: environment configuration is saved to `~/.kd` rather than the project directory; after creation, you must double-check persistence with `kd env list`; environment authentication will fail outright if the URL is unreachable.

## Deployment and Debugging

### Build commands

In development, you only need to build the frontend; the Controller is handled directly by deploy:

| Scenario | Build command | Description |
|------|---------|------|
| Changed frontend code (.tsx/.vue/.js) | `npm run build:frontend` | Builds frontend static assets, output to dist/kwc/ |
| Changed Controller code (.ts) or .kws | No build needed | In development, deploy handles the Controller directly |
| Only metadata files changed (.kwc/.kwp/.kws) | No build needed | Metadata is uploaded directly by deploy |

Additional usage:
- `npm run build:frontend -- MyComponent`: build a specific frontend component
- `npm run build:controller`: only used to build Controller artifacts for production; not needed in development
- `npm run build`: full build (frontend + Controller); only for production

### Deployment decision (auto-deploy by default)

After creating/modifying a component, page, or Controller, **deployment must be executed automatically**:

#### Default flow: deploy directly

```bash
kd project deploy
```

The CLI uses the configured default environment automatically; **no `kd env list`, no `-e <env>`, no need to ask the user**.

#### Exception handling: only when deploy errors out saying there is no environment

Collect environment info from the user and create the environment via setup-env.mjs, then run `kd project deploy` again.

#### Summary

| Scenario | Action |
|------|------|
| Configured environment present (default case) | **Run `kd project deploy` directly; do not ask the user, do not specify `-e`** |
| Deploy errors out saying no environment | Collect full environment info, create + authenticate, then deploy |
| User explicitly says "do not deploy" | Skip deployment |
| User explicitly named an environment | `kd project deploy -e <specified env>` |

#### Deployment content decision tree

```
What was changed?
├── Only frontend code (.tsx/.vue/.js/.html/.scss)
│   ├── User explicitly wants only local debug → npm run build:frontend → kd debug (no deploy needed)
│   └── Default → npm run build:frontend → kd project deploy
├── Only Controller code (.ts) or .kws metadata
│   → .kws version + 1 → kd project deploy directly (no build needed)
├── Both frontend and Controller changed
│   → Bump relevant versions → npm run build:frontend → kd project deploy
├── Only metadata changed (.js-meta.kwc / .page-meta.kwp)
│   → version + 1 → kd project deploy directly (no build needed)
└── New component/page/Controller
    → version = 1 → if frontend code is present, npm run build:frontend → kd project deploy
```

### Common commands

1. `kd project deploy`: deploy all metadata (.js-meta.kwc + .page-meta.kwp + .kws) and frontend static files of the entire project in one go to the default environment; in development, the Controller is handled directly by deploy with no prior build
2. `kd project deploy -d app/kwc/MyComponent -e sit`: deploy only the specified component to `sit`
3. `kd project deploy -d app/pages/my_page -e sit`: deploy only the specified page metadata to `sit`
4. `kd project deploy -d app/ks/controller/MyController -e sit`: deploy only the specified Controller to `sit`
5. `kd open -e dev -f kdtest_demo_page`: after deploy, directly open the form on the environment to view the result (no DNS proxy). The `-f` value must come from the `<name>` field in `.page-meta.kwp` (already includes the ISV prefix), not the file name
6. `kd debug`: enter local debugging via DNS proxy connecting to the environment (**must be run with `is_background: true`**, only when the user explicitly requests debugging). The `-f` value likewise comes from the `<name>` field in `.page-meta.kwp`

## Page Access Link

After a successful deploy, generate a page access link for the user to click and view the result. This is the last execution step of the deployment flow, **not a task summary**.

### Timing

> **⚠️ Mandatory: the render card (`:::render:kdform ...:::`) is the completion marker of the deployment flow. Do not defer render card generation until the user asks for `kd open` or some other follow-up. The timing of emission depends on whether the task involves a backend Controller.**

- **Frontend-only task** (no Controller): generate and emit the render card **immediately** after a successful deploy; do not wait for the user's next instruction
- **Task with backend** (with Controller): **do not emit the render card before the Controller self-check passes**. The render card may only be generated and emitted after the Controller end-to-end self-check passes (or the 3-retry limit triggers a mock fallback) and the frontend adapterApi integration code has been completed and deployed
- **New conversation modifying an existing page**: if the user modifies a deployed page in a new conversation, after redeployment **you must re-emit** the render card (even if it was emitted before)
- **No duplicates within a single body of work**: if a single body of work involves multiple deploys, emit once after the entire batch is deployed and the timing condition is met
- Applies to any deploy form: full deploy (`kd project deploy`), path-scoped deploy (`-d app/kwc/...`, `-d app/pages/...`, `-d app/ks/controller/...`)

### Page access link

After a successful deploy, **you must use the script to generate** the page access link; manually assembling JSON is forbidden:

```bash
node $SKILL_DIR/scripts/form-link.mjs generate --pageMeta <.page-meta.kwp file path> [--formNumber <entity code>] [--env <environment name>]
```

| Parameter | Required | Description |
|------|------|------|
| `--pageMeta` | ✅ | Path to the `.page-meta.kwp` file; the script extracts `<name>` and `<masterLabel>` from it |
| `--formNumber` | Optional | Pass when the page binds to a Cosmic backend entity (e.g. business data fetched via a Controller); the script additionally writes a `metadata` URL into the payload pointing to that entity's field-query endpoint |
| `--env` | Optional | Omit to use the default environment |

**Example output** (frontend-only, no entity bound):
```
:::render:kdform {"title":"Flock Inventory Entry Workbench","url":"https://xktest.kingdee.com:1026/xkmcp_test/?formId=yx_flock_inventory"}:::
```

**Example output** (with `--formNumber`, includes the entity field-query URL):
```
:::render:kdform {"title":"Sales Contract Entry","url":"https://feature.kingdee.com:1026/feature_vb/?formId=kdtest_sal_contract","metadata":"https://feature.kingdee.com:1026/feature_vb/kapi/v2/devportal/ai-meta/getEntityFields?formNumber=kdtest_sal_contract"}:::
```

**URL assembly rules:**
- Environment URL: read the current environment's url from `kd env info` or `~/.kd/config.json` (e.g. `https://feature.kingdee.com:1026/feature_vb`)
- formId: directly use the `<name>` value from `.page-meta.kwp` (already includes the ISV prefix), e.g. `kdtest_inv_dashboard`
- Final url = `{env URL}/?formId={page name}`, e.g. `https://feature.kingdee.com:1026/feature_vb/?formId=kdtest_inv_dashboard`

---

**🚫 Forbidden formats (common mistakes; all of the following are wrong and must not be used):**

| Wrong example | Reason it is wrong |
|----------|----------|
| ❌ `{"formId":"xxx","env":"vb"}` | Missing `title` and full `url`; `formId`/`env` are not valid fields |
| ❌ `{"title":"xxx","formId":"xxx"}` | `url` must be a full URL; you cannot just pass `formId` |
| ❌ `{"title":"xxx","url":"xxx","metadata":{...}}` | `metadata` must be the string URL assembled by the script from `--formNumber`; do not manually stuff in an object/array/etc. |
| ❌ `{"title":"xxx","url":"xxx","formId":"xxx"}` | `formId` is already inside `url`; do not pass it separately |
| ❌ `{"title":"xxx","url":"kdtest_opsmonitor"}` | `url` must be a full HTTP/HTTPS URL; you cannot write only the formId value |

---

> ❗ **You must generate the render card via the `form-link.mjs` script**; manually assembling JSON is forbidden. The script automatically handles title / url extraction and assembly, avoiding format errors.

### Execution order

```
Frontend only: all deploys complete → emit the page access link (:::render:kdform ...:::) → ask the user whether menu publishing is needed (optional)
With backend: Controller self-check passes + frontend integration deployed → emit the page access link (:::render:kdform ...:::) → ask the user whether menu publishing is needed (optional)
```

### Mandatory constraints

- After each body of work's deploy completes, you **must** generate and emit the render card via the `form-link.mjs` script; it cannot be omitted or skipped
- **Emission timing follows the rules above**: frontend-only tasks emit immediately after deploy; tasks with backend wait for Controller self-check passing + frontend integration done; re-emit after modifications in a new conversation
- **The render card is the completion marker of the deployment flow**—when the conditions for emission are met but the render card has not been emitted, the deployment flow counts as incomplete
- **Do not manually assemble the render card JSON; you must use the `form-link.mjs` script**
- **Do not defer the render card to `kd open` time**—the render card and `kd open` are two independent actions
- In multi-turn conversations, every completed body of work should emit; do not wait to emit only at the very end
- Do not duplicate within a single body of work (when several deploy commands belong to the same body of work, wait until they all finish and the timing condition is met, then emit once)
- All values are read by the script from the actual files and environment; do not guess
- Any task summary (if present) should be written as **separate text** after the link card

## View Environment Result (kd open)

> The render card (`:::render:kdform ...:::`) has already been generated and emitted once its conditions were met; the user can click the link in the card to view the result directly.
> The `kd open` command below is an **optional** supplementary action, used only when the user explicitly asks to open the page in the browser.

After deploy, use `kd open` to view the form's effect on the environment:

- `kd open -e <env> -f <page_name>`: directly open the deployed form page on the environment in the browser
- `-e` specifies the target environment (required); `-f` takes the page metadata `<name>` value (required). **You must read the value of the `<name>` field inside the `.page-meta.kwp` file, not the file name** (the file name and the metadata name may differ; the metadata name already includes the ISV prefix, e.g. `kdtest_inv_dashboard`)
- No local dev server required, no DNS proxy
- Precondition: the metadata and static files have been deployed to the target environment via `kd project deploy`

Use case: the user says "let me see the result", "open the page", "view the form on the environment", "see the deploy result", etc.

### Local debug (kd debug)

Use `kd debug` only when the user explicitly says "debug", "local debug", "integration", or "live preview code changes":

- When running `kd debug`, you **must use background mode** (`is_background: true`), because this is a long-running dev server that does not finish on its own
- Running `kd debug` in foreground mode causes the command to be forcibly terminated after 90 seconds due to timeout, killing the local server
- After `kd debug` starts, it first opens the browser to the target address, but the local dev server may not be fully started at that point and the page may temporarily be unreachable. Wait for the server to start before refreshing the browser
- You can view `kd debug`'s status and output via `get_terminal_output`
- If the target environment is not the current default environment, first run `kd env set target-env <env-name>`
- Do not manually assemble a debug URL; the AI determines the preview target based on the task and page metadata
- After the browser opens automatically, continue to navigate to the target page

### Trigger decision

Preconditions (must be done before triggering open/debug):
- Code has been written
- The necessary build command has been executed (if code was modified)
- `kd project deploy` has been executed (if deployment is needed)
- **The conditions for sending the render card have been met and the card has been sent** (`:::render:kdform ...:::`)—for frontend-only tasks, emit immediately after deploy; for tasks with backend, emit after Controller self-check passes + frontend integration is done. This is a precondition for open/debug
- The environment is authenticated

**Full decision tree after deploy:**

```
kd project deploy succeeds
  ↓
Does the task involve a backend Controller?
├── Frontend only → [Required] generate and emit the render card immediately
└── With backend → wait for Controller self-check to pass (or mock fallback) + frontend integration done → [Required] generate and emit the render card
  ↓
User intent:
├── User clicks the link directly → no scaffold action needed
├── User asks "open page / view result / see deploy result" → kd open
├── User asks "debug / integration / local debug / live preview changes" → kd debug
└── User did not explicitly ask → done, wait for follow-up instructions
```

Additional note: `kd project deploy` will outright block deployment when the environment is not authenticated.

## Application Menu Management

> Menu management registers deployed pages into the application's navigation menu so they can be navigated to by users in the Cosmic environment.
> All menu operations are performed via the `scripts/menu-api.mjs` script; detailed command reference in [references/app-menu.md](app-menu.md).

### Triggers

- After `kd project deploy` succeeds, guide the user on whether to publish the page to the app menu
- The user directly says "publish menu", "add menu", "menu management", "view menu", "modify menu", "delete menu", "move menu"

### Preconditions

- The environment is authenticated (via setup-env.mjs or manual authentication)
- bizAppNumber is known (from the `app` field of `.kd/config.json`, or explicitly provided by the user)

### Interface dependencies (mandatory constraints)

**All menu operations must follow the "query before write" principle; you must not skip the query and execute a write operation directly.**

```
queryTree (required) → obtain menuId / menu structure → execute write operation → verify result with getMenu or queryTree
```

| Constraint | Description |
|------|------|
| **menuId may only come from interfaces** | `menuId` may only come from `queryTree`'s returned menu tree, `addMenu`'s newly created menu, or `getMenu`'s details. Do not fabricate a menuId from memory or guesswork |
| **Modify/delete/move must be preceded by a query** | Before executing `updateMenu`, `deleteMenu`, or `moveMenu`, you must run `queryTree` to fetch the current menu tree and confirm from the response that the target menuId exists and is in the right state |
| **Capture menuId after adding** | After `addMenu` succeeds, you must extract the new menu's `menuId` from the response and record it for subsequent modifications/moves |
| **Verify after writes** | After any write operation (add/update/delete/move) completes, you must run `getMenu` or `queryTree` to verify the actual state; do not rely solely on the returned success flag |
| **parentMenuId must come from a query** | When adding a child menu, `parentMenuId` must be the menuId of an existing menu fetched from `queryTree`; do not guess |

### Step 1: Context preparation

- Read the `app` field of `.kd/config.json` as bizAppNumber
- If entering from the deployment flow: formNumber = the actual value of the `<name>` tag in `.page-meta.kwp` after deploy (already including the ISV prefix)
- If the user directly triggers menu management: only bizAppNumber is known; go to Step 2 to query the menu tree

> ⚠ formNumber must be read from the actual value of the `<name>` tag in the post-deploy `.page-meta.kwp` file; do not prepend the ISV prefix yourself.

### Step 2: Query and display the menu tree (a prerequisite for any operation)

**Whatever menu operation the user requests, you must first execute this step to fetch the current menu state.**

```bash
node "{menu_api}" queryTree --bizAppNumber {bizAppNumber}
```

- Display with hierarchical indentation, use icons to distinguish types (📁 group / 📄 page / 🔗 link); display convention in [references/app-menu.md](app-menu.md)
- **Record every menu's menuId**; subsequent operations must use the menuIds fetched here
- After display, guide the next step based on the entry point:
  - **Entered from deployment** → based on the form name and the existing menu structure, recommend a placement (analyze semantic relevance and suggest grouping with similar items; if the menu tree is empty, suggest creating a top-level menu). Check that the target position's depth does not exceed 3 levels before recommending
  - **Entered directly by the user** → after displaying the menu tree, wait for the user's instruction

### Step 3: Execute menu operations

Execute the corresponding operation based on user intent (every menuId must come from the Step 2 query result):

| Operation | Command | Pre-execution checks |
|------|------|------------|
| Add | `addMenu --bizAppNumber {app} --name {name} --formNumber {form} [--parentMenuId {pid}] [--seq {n}]` | Confirm menu name and position; check depth does not exceed 3 levels; parentMenuId must come from the queryTree result; **when bulk-adding sibling menus, you must pass ascending `--seq` values starting from a small number (e.g. 1, 2, 3); do not use large values; range 1–32767** |
| Modify | `updateMenu --bizAppNumber {app} --menuId {id} [--name ...] [--visible ...] [--seq {n}]` | menuId must come from the queryTree result; when changing visible to 0, warn about cascade hide; when changing parentMenuId, check for circular references and depth |
| Delete | `deleteMenu --bizAppNumber {app} --menuId {id}` | menuId must come from the queryTree result; check HPCE protection; warn about cascade delete of children; stop and ask the user for second confirmation (provide "Confirm delete"/"Cancel" options) |
| Move | `moveMenu --bizAppNumber {app} --menuId {id} --direction {up/down}` | menuId must come from the queryTree result; display the current sort position; if the error "identical sequence" appears, first use updateMenu --seq to change adjacent menus' sequences, then retry |

> Before each operation, present the configuration plan to the user and stop to ask for confirmation before executing.

### Step 4: Verify and display the result

- After any write operation completes, you **must** verify the actual result:
  - **Delete**: prefer `getMenu` to confirm the target menu returns `MENU_NOT_FOUND` (the menu tree may have a brief cache delay)
  - **Other writes**: run `getMenu` (single menu) or `queryTree` (global) to verify
- After addMenu succeeds, extract and record the new menu's menuId from the response
- Display the completion info and offer follow-up options:
  1. Modify this menu
  2. Move the menu's position
  3. Delete this menu
  4. Continue adding more menus
  5. View the full menu tree
  6. Done

### Integration with the deployment flow

After `kd project deploy` succeeds:

1. **First emit the page access link**: generate and emit `:::render:kdform ...:::` (see the "Page access link" section)
2. **Then guide menu publishing**: ask the user whether to publish the page to the app menu (offer "Publish to menu"/"Skip" options)

> Ask via a pop-up: "Deployment succeeded. Do you want to publish the page to the app menu?", with options "Publish to menu" and "Skip".

If the user agrees → automatically enter Step 1 (both bizAppNumber and formNumber are already available from the current context).

### Constraint cheat sheet

| Constraint | When to remind |
|------|----------|
| Menu depth ≤ 3 levels | When adding or moving menus |
| HPCE menus cannot be deleted | Before deleting, check whether menuId ends with HPCE |
| Cascade hide | Warn when changing visible from 1→0 |
| Cascade delete | Warn when deleting a menu with children |
| formNumber must use the actual value | When adding a page menu |
