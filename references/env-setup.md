# Env Setup

Read this file on demand. Used to guide users in completing environment binding information when the target environment does not exist or is not yet authenticated.

## Environment Existence Check

When the user provides a specific environment name or alias (e.g. `dev`, `sit`, `uat`), first check whether that environment already exists:

```bash
kd env list
```

### Processing Flow When the Environment Already Exists

If the target environment is already in the list:

1. No need to collect URL, Client ID/Secret, or other environment info from the user
2. Use `kd env list` to confirm the environment's authentication status
3. If the environment is not the current default, switch with `kd env set target-env <name>`
4. Use that environment directly for subsequent operations (deploy, debug, etc.)

### Processing Flow When the Environment Does Not Exist

Only when the environment is not in the list do you enter the full environment creation and authentication flow (see below).

## When You Must Collect Environment Info First

Do not run `deploy` directly if any of the following conditions apply:

1. The target environment is not in `kd env list`
2. The target environment exists but has no authentication info
3. The user says "help me bind a new environment"
4. The user only provided an environment alias, and that environment does not exist in `kd env list`, and no URL or OpenAPI parameters were provided

Note: If the environment alias provided by the user already exists in `kd env list`, there is no need to collect environment info; use it directly.

## Fields That Must Be Provided by the User Manually

These values cannot be guessed or automatically copied from another environment:

- `env name`
- `env url`
- `client id`
- `client secret`
- `username`

`data center` is not among these free-text fields.
The correct flow is to first create the environment, then enter `kd env auth openapi`, where the scaffold reads the data center list for that environment and lets the user select.

## Recommended Interaction Method

The most reliable approach right now is not to rely on pop-ups, but to ask the user for the complete set of fields in one go:

```text
Please provide the following environment info:
1. env name:
2. env url:
3. client id:
4. client secret:
5. username:

Notes: data center does not need to be filled in advance; the scaffold will read the candidates for you to select later.
```

Reasons:

- `client secret`, `username`, and similar are typically free-text values
- `data center` is a candidate list read from the target environment, better suited for selection than free-text entry
- Even if some runtime environments support structured selection, they are not suitable for carrying an entire set of sensitive credential entries

## Command Sequence After Receiving the Fields

1. Create the environment:

```bash
kd env create <env-name> --url <url>
```

2. Authenticate the environment:

```bash
kd env auth openapi -e <env-name>
```

At this point, let the user select from the data center list provided by the scaffold, rather than requiring the user to manually enter a data center code.

3. Set the default environment if needed:

```bash
kd env set target-env <env-name>
```

4. Double-check the environment status:

```bash
kd env info
```

## Notes

- In restricted environments, `kd env create` may display success without actually writing; you must double-check
- If the user has not provided all fields, do not proceed with authentication
- Do not use `client id` / `client secret` saved from old projects as defaults for a new environment
- Do not treat `data center` as a free-text field to collect in advance
