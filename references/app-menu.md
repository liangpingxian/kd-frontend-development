# App Menu Management

Read this file on demand. Used after deployment to register a page into the application menu so the page can be navigated to in the Cosmic environment. All operations are performed via the `menu-api.mjs` script.

## Script Location

`menu-api.mjs` is located in the `scripts/` subdirectory under the Skill root (i.e. `scripts/menu-api.mjs` next to `SKILL.md`). The AI knows the SKILL.md path when this Skill is loaded; join the path directly to call it, no runtime probing needed.

## Core Concepts

| Concept | Description |
| --- | --- |
| `bizAppNumber` | Application code. Corresponds to the `app` field in the project's `.kd/config.json`, or the value of the `<app>` tag in `.page-meta.kwp` |
| `formNumber` | Page code. Corresponds to the actual value of the `<name>` tag in `.page-meta.kwp`. **Must take the actual value of the `<name>` tag in the XML after deploy** (already including the ISV prefix, e.g. `kdtest_demo_page`); do not prepend the ISV prefix yourself |
| `menuId` | Menu ID. Obtained from the `queryTree` response, or from a successful `addMenu` response |
| Menu depth | At most **3 levels** supported |

## Command Cheat Sheet

### queryTree — Query the application menu tree

```bash
node "{menu_api}" queryTree --bizAppNumber {bizAppNumber} [--env {envName}]
```

| Parameter | Required | Description |
| --- | --- | --- |
| `--bizAppNumber` | Yes | Application code |
| `--env` | No | Target environment name; omit to use the default environment |

Returns the full menu tree of the application, including each menu's `menuId`, `name`, `menuType`, `formNumber`, `linkUrl`, `visible`, and child menu list.

Example:

```bash
node "/path/to/menu-api.mjs" queryTree --bizAppNumber kdec_contract
```

### getMenu — Query a single menu's details

```bash
node "{menu_api}" getMenu --bizAppNumber {bizAppNumber} --menuId {menuId} [--env {envName}]
```

| Parameter | Required | Description |
| --- | --- | --- |
| `--bizAppNumber` | Yes | Application code |
| `--menuId` | Yes | Menu ID |
| `--env` | No | Target environment name |

Returns the details of a single menu.

Example:

```bash
node "/path/to/menu-api.mjs" getMenu --bizAppNumber kdec_contract --menuId abc123
```

### addMenu — Add a menu

Page menu:

```bash
node "{menu_api}" addMenu --bizAppNumber {bizAppNumber} --name {name} --formNumber {formNumber} [--parentMenuId {parentMenuId}] [--seq {seq}] [--env {envName}]
```

Link menu:

```bash
node "{menu_api}" addMenu --bizAppNumber {bizAppNumber} --name {name} --menuType link --linkUrl {url} [--parentMenuId {parentMenuId}] [--seq {seq}] [--env {envName}]
```

| Parameter | Required | Description |
| --- | --- | --- |
| `--bizAppNumber` | Yes | Application code |
| `--name` | Yes | Menu display name |
| `--formNumber` | Required for page menu | Page code (the actual `<name>` value after deploy) |
| `--parentMenuId` | No | Parent menu ID; omit to create a top-level menu |
| `--menuType` | No | Menu type; default `page` |
| `--linkUrl` | Required for `link` type | Link URL |
| `--seq` | No | Sort sequence (integer, range 1–32767). Sibling menus are sorted by ascending seq; omit to use the server default. The script internally converts and validates the range. **Must start from small numbers and increment (e.g. 1, 2, 3); do not use large values** |
| `--env` | No | Target environment name |

A successful response contains the `menuId` of the new menu.

Example:

```bash
# Create a top-level page menu
node "/path/to/menu-api.mjs" addMenu --bizAppNumber kdec_contract --name "Sales Contract" --formNumber kdtest_sal_contract

# Create a child menu
node "/path/to/menu-api.mjs" addMenu --bizAppNumber kdec_contract --name "Purchase Contract" --formNumber kdtest_pur_contract --parentMenuId parent123

# Create a link menu
node "/path/to/menu-api.mjs" addMenu --bizAppNumber kdec_contract --name "Help Docs" --menuType link --linkUrl "https://help.kingdee.com"
```

### updateMenu — Update a menu

```bash
node "{menu_api}" updateMenu --bizAppNumber {bizAppNumber} --menuId {menuId} [--name {name}] [--formNumber {formNumber}] [--parentMenuId {parentMenuId}] [--visible 0|1] [--seq {seq}] [--env {envName}]
```

| Parameter | Required | Description |
| --- | --- | --- |
| `--bizAppNumber` | Yes | Application code |
| `--menuId` | Yes | Menu ID |
| `--name` | No | New menu name |
| `--formNumber` | No | New page code |
| `--parentMenuId` | No | New parent menu ID; set to `bizAppNumber` to move to the root level (top-level menu) |
| `--visible` | No | `1` visible, `0` hidden |
| `--seq` | No | Sort sequence (integer, range 1–32767). The script internally converts the string to a number and validates the range. Useful for fixing duplicate sequence numbers |
| `--env` | No | Target environment name |

Only pass the fields to be modified; unspecified fields remain unchanged.

Example:

```bash
# Rename a menu
node "/path/to/menu-api.mjs" updateMenu --bizAppNumber kdec_contract --menuId abc123 --name "New Name"

# Hide a menu
node "/path/to/menu-api.mjs" updateMenu --bizAppNumber kdec_contract --menuId abc123 --visible 0

# Move to the root level
node "/path/to/menu-api.mjs" updateMenu --bizAppNumber kdec_contract --menuId abc123 --parentMenuId kdec_contract
```

### deleteMenu — Delete a menu

```bash
node "{menu_api}" deleteMenu --bizAppNumber {bizAppNumber} --menuId {menuId} [--env {envName}]
```

| Parameter | Required | Description |
| --- | --- | --- |
| `--bizAppNumber` | Yes | Application code |
| `--menuId` | Yes | Menu ID |
| `--env` | No | Target environment name |

**Cascade delete**: deleting a menu also deletes all its child menus.

**Post-delete verification**: prefer `getMenu` to confirm the target menu returns `MENU_NOT_FOUND`, rather than verifying with `queryTree` (the menu tree may have a brief cache delay).

Example:

```bash
node "/path/to/menu-api.mjs" deleteMenu --bizAppNumber kdec_contract --menuId abc123
```

### moveMenu — Move a menu among siblings

```bash
node "{menu_api}" moveMenu --bizAppNumber {bizAppNumber} --menuId {menuId} --direction {up|down} [--env {envName}]
```

| Parameter | Required | Description |
| --- | --- | --- |
| `--bizAppNumber` | Yes | Application code |
| `--menuId` | Yes | Menu ID |
| `--direction` | Yes | Move direction: `up` or `down` |
| `--env` | No | Target environment name |

Example:

```bash
node "/path/to/menu-api.mjs" moveMenu --bizAppNumber kdec_contract --menuId abc123 --direction up
```

## Menu Tree Display Convention

When showing the menu tree to the user, use the following icon convention:

| Condition | Icon | Meaning |
| --- | --- | --- |
| `menuType=page` with children | 📁 | Group |
| `menuType=page` without children | 📄 | Page |
| `menuType=link` | 🔗 | Link |

Additional rules:

- Mark menus with `visible="0"` as "hidden"
- Page menus display `formNumber`, link menus display `linkUrl`

Display example:

```
📋 Current menu structure of app "{bizAppNumber}":

 1. 📁 Contract Center (page, visible)
    1.1 📄 Sales Contract → kdec_sal_contract (page, visible)
    1.2 📄 Purchase Contract → kdec_pur_contract (page, visible)
 2. 🔗 Help Docs → https://help.kingdee.com (link, visible)
```

## Error Code Cheat Sheet

| Error code | Description | Suggestion |
| --- | --- | --- |
| `PARAM_INVALID` | Parameter validation failed | Check required parameters and enum values |
| `NO_PERMISSION` | No edit permission | Confirm developer permissions |
| `ADD_MENU_FAIL` | Add failed (e.g. depth exceeds 3 levels) | Check the depth, pick another position |
| `UPDATE_MENU_FAIL` | Update failed (depth / circular reference) | Check the target position is legal |
| `DELETE_MENU_FAIL` | Delete failed (includes Help Center menus) | HPCE menus cannot be deleted |
| `MENU_NOT_FOUND` | Menu does not exist | Re-query the menu tree to confirm the ID |
| `APP_NOT_FOUND` | Application does not exist | Check bizAppNumber |
| `MOVE_MENU_FAIL` | Move failed (first/last/identical sequence) | If sequences are identical, first use `updateMenu --seq` to give adjacent menus different sequences, then retry the move |
| `SAVE_FAIL` | Save failed | Retry |

## Constraint Reminders

| Constraint | Description | When to remind |
| --- | --- | --- |
| Menu depth limit | At most 3 levels | When the user chooses to place under a 3rd-level menu |
| Help Center protection | Menus whose ID ends with `HPCE` cannot be deleted | Check before deletion |
| Cascade delete | Deleting a menu also deletes all its children | When confirming a delete operation |
| Cascade hide | Hiding a menu also cascades to hide child menus | When changing `visible` to `0` |
| Circular reference protection | A menu cannot be moved under itself or its descendants | When changing `parentMenuId` |
| `formNumber` source | Must come from the actual `<name>` value of `.page-meta.kwp` after deploy | When adding a page menu |
| Bulk add requires explicit seq | When bulk-adding sibling menus, you must pass ascending `--seq` values starting from a small number (e.g. 1, 2, 3); do not use large values, otherwise sequence collisions or out-of-range will cause subsequent moveMenu failures | When adding multiple sibling menus in a row |

## Enum Reference

| Parameter | Allowed values | Description |
| --- | --- | --- |
| `menuType` | `page`, `link` | Default `page` |
| `openType` | `MainNewTabPage`, `NewWindow`, `Modal` | Script hard-codes `MainNewTabPage` |
| `visible` | `1`, `0` | Default `1` (visible) |
| `direction` | `up`, `down` | Move direction |
