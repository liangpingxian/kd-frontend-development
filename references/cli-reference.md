> **This document provides CLI command reference. During actual execution:**
> - Project initialization → `node scripts/project-init.mjs`
> - Environment configuration → `node scripts/setup-env.mjs`
> - Creating components/pages/Controllers → `kd project create`
>
> **Running the initialization and environment configuration CLI commands directly in the terminal is forbidden (use the corresponding scripts instead). Creating components/pages/Controllers can use `kd project create` directly.**

---

# KWC CLI Reference

Read this file on demand. Used for supplementing command syntax, OpenAPI parameters, and page metadata examples.

## Core Concepts

- `Project`: A local project directory that stores source code, configuration files, and metadata.
- `Env`: A remote Cosmic environment; one local project can connect to multiple environments.

## Install the CLI

```bash
npm i -g @kdcloudjs/cli --registry=https://registry.npmmirror.com
kd -v
```

Update the scaffold to the latest version:

```bash
kd update
```

## Initialize a Project

```bash
kd project init my-demo-project
```

During the interactive process, you typically need to:

- Select a framework, such as React, Vue, LWC
- Select a language, such as TypeScript, JavaScript
- Enter the application code `app` (must be explicitly provided by the user; see SKILL.md "Inputs the User Must Supply")

After initialization, execute:

```bash
cd my-demo-project
npm install --registry=https://registry.npmmirror.com
npm run dev
```

## Create a Component

```bash
kd project create DemoComponent1 --type kwc
kd project create DemoComponent2 --type kwc
```

Recommendations:

- Use `PascalCase` for component names.
- Let the CLI generate the component project first, then supplement the specific implementation code.
- After generation, you should continue to check and complete the `.js-meta.kwc`; do not treat the scaffold template as the final metadata.

## Create a Controller

```bash
kd project create myController --type controller
kd project create myController --type controller -e dev  # Specify the target environment for pulling the SDK
```

Recommendations:

- Use `PascalCase` for the controller name; it is recommended to end with a `Controller` suffix.
- The Controller project is generated under `app/ks/controller/<ControllerName>/`.
- After creation, you should continue to check and complete the .kws metadata file, filling in the required fields such as name, isv, app, version, url, scriptFile, methods, etc.

## Create a Page

```bash
kd project create demo_page --type page
```

Common page metadata example:

```xml
<?xml version="1.0" encoding="UTF-8"?>

<Page>
    <name>demo_page</name>
    <masterLabel>demo_page</masterLabel>
    <template>oneregion</template>
    <isv></isv>  <!-- Automatically fetched from the environment by the scaffold during deploy -->
    <app>your_app_code</app>
    <version>1</version>
    <regions>
        <region>
            <name>region1</name>
            <controls>
                <control>
                    <type>DemoComponent1</type>
                    <name>instance1</name>
                </control>
                <control>
                    <type>DemoComponent1</type>
                    <name>instance2</name>
                </control>
                <control>
                    <type>DemoComponent2</type>
                    <name>instance3</name>
                </control>
            </controls>
        </region>
    </regions>
</Page>
```

Field reminders:

- `name`: Page identifier.
- `masterLabel`: Page display name.
- `template`: Page template.
- `app`: Cosmic application code (must be explicitly provided by the user; see SKILL.md).
- `version`: Positive integer; manually increment by `1` only when this page metadata file has changes and is ready to be re-uploaded.
- `control.type`: Component type name.
- `control.name`: Component instance name within the page.
- In practice, the scaffold does not automatically insert real `<control>` nodes; it only keeps the comment template.
- Property names configured in the page should correspond to the `<property name="...">` defined in the component metadata.

## Environment Management

Create an environment:

```bash
kd env create dev --url https://feature.kingdee.com:1026/feature_dev/
```

OpenAPI authentication:

```bash
kd env auth openapi
```

Common environment commands:

```bash
kd env set target-env dev
kd env info
kd env delete dev
```

OpenAPI authentication typically requires:

- Data center
- Client ID
- Client Secret
- Username

Note: The "data center" here should be read from a list by the scaffold during the authentication process for the user to select; it should not be treated like other credentials that the user enters manually.

If the environment does not exist, first collect the following fields from the user before proceeding:

- env name
- env url
- Client ID
- Client Secret
- Username

Recommended to have the user fill in using this template:

```text
Please provide the following environment info:
1. env name:
2. env url:
3. client id:
4. client secret:
5. username:

Notes: data center does not need to be filled in advance; the scaffold will read the candidates for you to select later.
```

The related OpenAPI application needs these interface authorizations:

1. `updateKwc`
2. `kwcisv`
3. `updatePageMeta`

Additional reminders:

- Environment configuration is written to `~/.kd`.
- After running `kd env create` in a restricted environment, be sure to run `kd env list` again to check whether it was actually saved.
- After deleting an environment, reconfirm whether the default environment was automatically switched by the CLI.

## Build

Full build (frontend + Controller + metadata):

```bash
npm run build
```

Build frontend components only:

```bash
npm run build:frontend
npm run build:frontend -- ExampleComponent      # Build a specific component
npm run build:frontend -- ComponentA ComponentB  # Build multiple components
```

Build Controller only:

```bash
npm run build:controller
npm run build:controller -- --env=dev           # Specify target environment
npm run build:controller -- MyController        # Build a specific Controller
```

You can also use the kd CLI to build:

```bash
kd project build --type frontend              # Build frontend assets
kd project build --type controller            # Build Controller
kd project build --type controller -e dev     # Build Controller for a specific environment
kd project build myComponent --type frontend  # Build a specific component
```

Build notes:

- Frontend build output goes to `dist/kwc/`
- Controller build output goes to `dist/controller/`
- Metadata files are copied to `dist/metadata/`
- Controller build checks that the `app/ks/controller/` directory exists before proceeding

## Deploy

Deploy the entire project:

```bash
kd project deploy
```

Deploy only a specific component to the `sit` environment:

```bash
kd project deploy -d app/kwc/MyComponent -e sit
```

Deploy only specific page metadata to the `sit` environment:

```bash
kd project deploy -d app/pages/my_page -e sit
```

Deploy only a specific Controller to the `sit` environment:

```bash
kd project deploy -d app/ks/controller/MyController -e sit
```

Content included in deployment (a single deploy uploads everything):

1. Component metadata (.js-meta.kwc)
2. Page metadata (.page-meta.kwp)
3. Controller metadata (.kws) and Controller script — during the development phase, deploy handles the Controller directly; no pre-build is needed
4. Frontend static files (dist/kwc/) — need to run `npm run build:frontend` first; the development environment auto-uploads

Notes:

- During deployment, the scaffold automatically replaces the `isv` in component and page metadata.
- If no environment is specified, the default environment is used.
- If the environment is not authenticated, the CLI will block the deployment.
- Starting from version 0.0.13, when deploying to a development environment, deploy also uploads the frontend build artifacts (static files) to that environment.
- Do not treat `deploy` as a required step after every code change; first check whether metadata files were actually modified.

Version management rules:

| Change Type | Need to Increment `version`? | Need to `deploy`? | Recommended Action |
| --- | --- | --- | --- |
| Only changed component implementation code, no metadata changed | No | As needed | Local debug: `npm run build` + `kd debug`; view environment result: `npm run build` + `kd project deploy` (upload static files) + `kd open` |
| Changed component metadata `.js-meta.kwc` | Yes, increment that component metadata `version` | Yes | Deploy that component or the entire project |
| Changed page metadata `.page-meta.kwp` | Yes, increment that page metadata `version` | Yes | Deploy that page metadata or the entire project |
| Changed both component and page metadata | Yes, increment separately | Yes | Deploy the affected paths or the entire project |
| Created new component or page metadata | Initial value set to `1` | Yes | First upload |
| Modified Controller code or .kws metadata | Yes, increment Controller metadata version | Yes | Run `kd project deploy` directly (no build needed during development) |

Decision reminders:

- Whether you need to `deploy` depends on whether metadata files have changed.
- Whether you need to increment `version` also depends on whether the corresponding metadata file has changed.
- If only component code was changed, do not blindly `deploy` just because "something was modified."

Build prerequisites (development phase):

- Changed frontend code → run `npm run build:frontend` first, then deploy
- Changed Controller code or .kws → deploy directly; no build needed (deploy handles the Controller directly during development)
- Only changed metadata files → deploy directly; no build needed
- `npm run build:controller` and `npm run build` are only for production build artifacts

## Open a Form

After deployment, directly open the deployed form page in the browser on the environment, no DNS proxy needed:

```bash
kd open -e dev -f kdtest_demo_page          # Open the form on the dev environment (kdtest_demo_page is taken from the <name> value in .page-meta.kwp)
kd open -e sit -f kdtest_demo_page          # Open the form on the sit environment
```

### Option Descriptions

- `-e, --target-env <name>`: **(Required)** Specify the target environment (e.g. `dev`, `sit`)
- `-f, --formid <name>`: **(Required)** Specify the form. **Must read the value of the `<name>` node in the `.page-meta.kwp` file, not the form file name** (the file name and metadata name may differ; the metadata name already includes the ISV prefix)

### Differences from kd debug

| Comparison | `kd debug` | `kd open` |
|--------|-----------|----------|
| How it works | Connects the local dev server to the environment via DNS proxy | Directly opens the deployed page on the environment; no DNS proxy |
| Use case | Local development debugging, live preview of code changes | Verifying the online result after deployment |
| Requires local server | Yes, the local dev server must be running | No, directly accesses the remote environment |
| `-f` parameter | The value of the `<name>` node in `.page-meta.kwp` (not the file name) | The value of the `<name>` node in `.page-meta.kwp` (not the file name) |

### Prerequisites

- Metadata and frontend static files have been deployed to the target environment via `kd project deploy`

### Form Name Value

Same as `kd debug`, `-f` takes the actual value of the `<name>` node in the current local `.page-meta.kwp`. After deploy, the scaffold automatically updates the local file's name (prepending the isv prefix), so use the full post-deploy name.

## Debug

> Use `kd debug` only when the user explicitly requests local debugging or integration testing. If you only need to view the deployment result on the environment, use `kd open`.

```bash
kd debug                              # Interactively select a form
kd debug -e sit                       # Specify an environment
kd debug -f kdtest_demo_page           # Directly specify a form (value from the <name> node in .page-meta.kwp, not the file name)
kd debug -f kdtest_demo_page -e sit    # Specify both form and environment
```

### Option Descriptions

- `-e, --target-env <name>`: Specify the backend environment to connect for debugging
- `-f, --formid <name>`: Specify the debug form. **Must read the value of the `<name>` node in the `.page-meta.kwp` file, not the form file name** (the file name and metadata name may differ; the metadata name already includes the ISV prefix)

### Form Name and ISV Prefix Mechanism

When understanding the `kd debug -f` parameter, be clear about how the form name changes before and after deploy:

1. **Page creation phase**: The `<name>` you fill in `.page-meta.kwp` can be a business identifier, e.g. `demo_page`
2. **Deploy phase**: When you run `kd project deploy`, the scaffold will:
   - Automatically fetch the isv identifier from the environment (e.g. `kdtest`)
   - Concatenate the isv prefix to the name, forming `kdtest_demo_page` for upload to the remote
   - **Simultaneously update the local `.page-meta.kwp` file**, changing `<name>` to `kdtest_demo_page` and filling in `<isv>kdtest</isv>`
3. **Debug phase**: The `kd debug -f` parameter should be passed the **actual value of the `<name>` node in the current local file**
   - Before the first deploy, the local name might be `demo_page`
   - After deploy, the local name automatically becomes `kdtest_demo_page`
   - Therefore, when debugging, use the full post-deploy name

Example flow:

```bash
# 1. Create the page; at this point .page-meta.kwp has <name>demo_page</name>
kd project create demo_page --type page

# 2. After deploy, the scaffold automatically updates the local file to <name>kdtest_demo_page</name> and <isv>kdtest</isv>
kd project deploy

# 3. When debugging, use the updated full name
kd debug -f kdtest_demo_page
```

If you are unsure of the current name value, you can directly open `.page-meta.kwp` and check the `<name>` node.

### Debug Conventions (Triggered on Demand)

- Only use `kd debug` when the user explicitly requests local debugging or integration testing; prefer `kd open` for viewing environment results
- When running `kd debug`, you **must use background mode** (`is_background: true`), because this is a long-running dev server that does not finish on its own
- If you run `kd debug` in foreground mode, the command will be forcibly terminated after 90 seconds due to timeout, killing the local server
- After `kd debug` starts, it first opens the browser to the target address, but the local server may not be fully started at that point; wait for the server to start before refreshing the browser
- You can view `kd debug`'s status and output via `get_terminal_output`
- Ensure `target-env` is correct before running `kd debug`
- The AI should determine the preview target based on the current task, recently modified pages, and `app/pages/*.page-meta.kwp`
- `kd debug` automatically opens the browser; continue navigating to the target page in the browser to verify

### Pre-Debug Confirmation

- Components or page metadata have been deployed
- The current default environment is correct, or has been specified via the `-e <env>` parameter
- The `app` code in `.kd/config.json` matches the target application
- If `.kd/config.json` is missing `isv/app`, static routes will not be mounted
- `localhost:3333` is not occupied

### Notes

- If you need to switch debugging between different apps, manually modify the `app` code in `.kd/config.json`

On-demand deep reading:

- `component-metadata.md`
- `env-setup.md`
- `page-metadata.md`
