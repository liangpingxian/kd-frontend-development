# Complete Project Workflow Orchestration

> This document was split from the main SKILL.md and is loaded on demand. Trigger condition: must read when the requirement involves backend data interaction / Controllers / entity identification / frontend-backend joint development.

## Recommended Scaffold Command Orchestration

### Requirement Frontend-Backend Assessment

When facing a complete business requirement, determine whether a Controller is needed according to the following priorities:

**Strong signals (hitting any one directly determines that a Controller is needed, no need to ask the user):**
- The requirement involves list/table data display (e.g. "XX List", "XX Query", "XX Monitor")
- The requirement involves filtering/search/filter conditions
- The requirement involves charts/reports/statistics/dashboards
- The requirement involves data CRUD operations (save, submit, approve, delete, etc.)
- The requirement involves detail view/edit
- The requirement involves business entity names (e.g. materials, warehouses, orders, customers, inventory, etc.)

**Weak signals (need to stop and ask the user for confirmation, providing "Need Controller" and "Frontend-only" as options):**
- The requirement only describes UI style or layout without mentioning data sources
- The requirement may be fulfilled with local mock data or configuration items

**Exclusion signals (no Controller needed):**
- The page only displays static content, documentation, or local calculation results
- Purely display-oriented components (e.g. welcome page, about page)

Default tendency: when any business-data-related term appears in the requirement description, prioritize judging that a Controller is needed, rather than asking the user for additional confirmation.

### Entity Identification and Clarification

After determining that a Controller is needed, you must further identify which business entities the requirement involves, for use in subsequent `meta-query-api.mjs` queries for real fields:

1. **Extract entity keywords from the requirement**: Analyze the user's requirement description and extract all possible business entity names (e.g. "materials", "warehouse", "inventory", "orders", etc.)
2. **Confirm the form code source**: Form/entity codes **must not be guessed**; they can only be obtained through one of the following two methods:
   - **Directly provided by the user**: The user explicitly gives the form code in the requirement (e.g. `bd_material`, `im_inventory`)
   - **Confirmed via query**: Use `queryFormsByApp` to search for forms and confirm the real code from the returned results
3. **Clarify entities with the user**: If the user has not provided a form code and the entity name may be ambiguous (e.g. "inventory" could correspond to inventory ledger, inventory balance, safety stock, etc.), you must stop and ask the user for confirmation:
   - Ask the user: "Which business form does the 'inventory' you mentioned correspond to?" and present possible candidate forms as options for the user to select
   - If the entity name is unambiguous and the user is also unsure of the code, you can first use `queryFormsByApp` to search by keyword and present the results as an option list for the user to select
4. **Only query fields after confirmation**: Only execute `getEntityFields` to query the field structure after the form code is confirmed

### Frontend-Backend Unified Orchestration

When the requirement involves both frontend components and a backend Controller, follow this flow (metadata before code):

1. If there is no project, execute the project-init.mjs script for initialization (parameters in the main SKILL.md "Initialize Project" section); after initialization, prompt the user to manually run `cd <project directory> && npm install --registry=https://registry.npmmirror.com` (China mirror for speed)
2. Create the project structure (this Skill's responsibility):
   a. Use `kd project create <ComponentName> --type kwc` to create the frontend component (usually 1 requirement = 1 component)
   b. Use `kd project create <ControllerName> --type controller` to create the Controller
3. **Query business entity fields** (when the Controller involves entity data operations):
   - When the user provides form names/codes/entity-related information, use `meta-query-api.mjs` to query the real fields
   - First `queryFormsByApp` to search forms, then `getEntityFields` to get the field structure (see `references/metadata-operations.md` "Metadata Query" section)
   - Query results are used to guide subsequent Controller metadata and code writing; **guessing field names is forbidden**
4. Complete all metadata (this Skill's responsibility, metadata first):
   a. Complete the component metadata `.js-meta.kwc`
   b. Complete the Controller metadata `.kws` (define URL, methods, permission configuration)
5. **Implement the frontend component code**: Must read [`kwc-frontend-contract.md`](./kwc-frontend-contract.md) before writing (KWC framework contract); UI implementation details are free to decide
6. **Read the Controller sub-skill documentation and implement the backend code**: Read [kwc-ks-controller-development](../kwc-ks-controller-development/SKILL.md) to write the Controller script (*.ts)
7. Return to the scaffold workflow: create page metadata and complete `<controls>`
8. Build the frontend: `npm run build:frontend`
9. Confirm or create the target environment and complete authentication
10. Execute `kd project deploy`
11. **[Immediately]** After successful deployment, generate and emit the page access link (`:::render:kdform ...:::`) — this is the completion marker of the deployment flow and must not be skipped or delayed (see `references/deployment-guide.md` "Page Access Link" section)

**Key Principles**:
- In step 4 (metadata completion), both component metadata `.kwc` and Controller metadata `.kws` are completed by this Skill
- In step 5 (frontend code), strictly follow the KWC frontend contract; in step 6 (Controller code), follow the controller sub-skill specifications
- From step 7 onward, the scaffold workflow takes the lead again

### Frontend-Only Orchestration

If it is confirmed that no backend is involved and only frontend development is needed, prefer this sequence:

1. If there is no project, execute the project-init.mjs script for initialization (parameters in the main SKILL.md "Initialize Project" section); after initialization, prompt the user to manually run `cd <project directory> && npm install --registry=https://registry.npmmirror.com` (China mirror for speed)
2. Use `kd project create <ComponentName> --type kwc` to create the page component (usually 1 requirement = 1 component; all complex layouts are implemented inside the component)
3. **Complete the component `.js-meta.kwc`** (this Skill's responsibility)
4. **Query associated business entities** (optional, when the component involves form data binding): Use `meta-query-api.mjs` to query the associated form's field structure to assist with component design (see `references/metadata-operations.md` "Metadata Query" section)
5. **Read the KWC frontend contract document**: Must read [`kwc-frontend-contract.md`](./kwc-frontend-contract.md) before writing component code (props shape, adapterApi, config fields, and other KWC framework-specific constraints)
6. **Implement the component code** (*.tsx / *.vue / *.js): UI library selection, layout, CSS, and other implementation details are free to decide; strictly follow the KWC contract from step 5
7. After the code implementation is complete, return to the scaffold workflow: use `kd project create <page_name> --type page` to create page metadata (parameters in the main SKILL.md "Create Component / Controller / Page" section)
8. Complete the page `app/pages/<page-name>.page-meta.kwp`
9. Build the frontend: `npm run build:frontend`
10. **Auto-deploy**: First run `kd env list` to check existing environments. If an authenticated environment exists, run `kd project deploy -e <env name>` directly (no need to ask the user); if no environment exists, collect environment info and configure first, then deploy. See `references/deployment-guide.md` "Deployment Decision (Auto-Deploy by Default)" section
11. **[Immediately]** After all deployments for the current task are complete, generate and emit the page access link (`:::render:kdform ...:::`) — this is the completion marker of the deployment flow and must not be skipped or delayed (see `references/deployment-guide.md` "Page Access Link" section)
12. [Optional] Run `kd open` only when the user explicitly asks to view the result, and `kd debug` only when the user explicitly asks for local integration testing (must use background mode)

**Key Principles**:
- Step 3 (metadata completion) must be done by the scaffold workflow
- Steps 5–6 (code implementation) strictly follow the KWC framework contract in [`kwc-frontend-contract.md`](./kwc-frontend-contract.md); UI implementation is free
- From step 7 onward (page creation and beyond), the scaffold workflow takes the lead again

If modifying an existing page:

1. First identify whether you are modifying the component implementation, component metadata, page metadata, or all three
2. **If component code changes are involved**: You must still follow the KWC framework contract in [`kwc-frontend-contract.md`](./kwc-frontend-contract.md)
3. **Auto-deploy**: First run `kd env list` to check existing environments; if an authenticated environment exists, run `kd project deploy` directly to deploy the changes (no need to ask the user); only skip deployment when the user explicitly says they don't want to deploy

### Backend Controller-Only Orchestration

If it is confirmed that only the backend is involved and no new frontend component is needed:

1. If there is no project, execute the project-init.mjs script for initialization (parameters in the main SKILL.md "Initialize Project" section); after initialization, prompt the user to manually run `cd <project directory> && npm install --registry=https://registry.npmmirror.com` (China mirror for speed)
2. Use `kd project create <ControllerName> --type controller` to create the Controller
3. **Query business entity fields** (when the Controller involves entity data operations): Use `meta-query-api.mjs` to first search for forms then get the field structure (see `references/metadata-operations.md` "Metadata Query" section); **guessing field names is forbidden**
4. **Complete the Controller metadata `.kws`** (this Skill's responsibility)
5. **Read the Controller sub-skill documentation and implement the code**: **Must** read [kwc-ks-controller-development](../kwc-ks-controller-development/SKILL.md) and follow its specifications
6. **Write the script code under the Controller sub-skill specifications** (*.ts)
7. After the code implementation is complete, return to the scaffold workflow: first run `kd env list` to check existing environments; if an authenticated environment exists, run `kd project deploy` directly to deploy to the target environment (no need to ask the user; Controllers do not need to be pre-built); if no environment exists, collect environment info and configure first, then deploy
8. **[Immediately]** After all deployments for the current task are complete, generate and emit the page access link (`:::render:kdform ...:::`) — this is the completion marker of the deployment flow and must not be skipped or delayed (see `references/deployment-guide.md` "Page Access Link" section)
