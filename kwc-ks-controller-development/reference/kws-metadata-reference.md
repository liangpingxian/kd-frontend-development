# .kws Metadata Configuration Reference

`.kws` is the Controller metadata file format in the KWC ecosystem, forming a three-way symmetric system with `.js-meta.kwc` (component metadata) and `.page-meta.kwp` (page metadata).

## Overview

A script controller (Script Controller) is a KingScript-based Web API controller running in the KWC framework on the BOS platform. It allows developers to create RESTful APIs quickly using a scripting language without compiling Java code.

**Core features:**
- Rapid development: Written in KingScript, takes effect immediately
- Flexible configuration: URL routing and method binding configured through .kws metadata
- Permission control: Built-in permission validation mechanism
- Hot deployment: Supports runtime updates without restarting the service

Each script controller consists of two core files: a `.kws` metadata file (defining routes, methods, and permissions) and a `.ts` script file (implementing business logic). This document only covers the `.kws` metadata configuration.

---

## Controller Configuration in Detail

### 3.1 Required Fields

The Controller configuration must include the following fields; otherwise deployment will fail:

| Field | Description | Example | Required |
|------|------|------|---------|
| `name` | Controller name (unique identifier) | `UserScriptController` | Yes |
| `isv` | ISV (vendor) code | `kingdee` or a custom code | Yes |
| `app` | Business application code | `dev`, `bos`, etc. | Yes |
| `version` | Version number (positive integer) | `1`, `2`, `3` | Yes |
| `url` | Controller root URL | `/kd/dev/sample/users` | Yes |
| `scriptFile` | Script file name | `UserScriptController.ts` | Yes |
| `methods` | Method definition set (at least 1) | See section 3.2 | Yes |

### 3.2 .kws Metadata Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Controller>
    <!-- Basic information -->
    <name>UserScriptController</name>
    <isv>kingdee</isv>
    <app>dev</app>
    <version>1</version>

    <!-- URL -->
    <url>/kd/dev/sample/users</url>

    <!-- Script file binding -->
    <scriptFile>UserScriptController.ts</scriptFile>

    <!-- Method definitions -->
    <methods>
        <method>
            <name>getUser</name>
            <url>/{id}</url>
            <httpMethod>GET</httpMethod>

            <!-- Permission configuration (required) -->
            <permission>
                <permission>
                    <permitAll>false</permitAll>
                    <anonymousUser>false</anonymousUser>
                    <entityNumber>bos_user</entityNumber>
                    <permItemId>47150e89000000ac</permItemId>
                    <checkRightApp>dev</checkRightApp>
                </permission>
            </permission>
        </method>

        <method>
            <name>createUser</name>
            <url></url>
            <httpMethod>POST</httpMethod>
            <permission>
                <permission>
                    <permitAll>false</permitAll>
                    <anonymousUser>false</anonymousUser>
                    <entityNumber>bos_user</entityNumber>
                    <permItemId>47150e89000000ac</permItemId>
                    <checkRightApp>dev</checkRightApp>
                </permission>
            </permission>
        </method>
    </methods>
</Controller>
```

### 3.3 URL Rules (Important)

#### 3.3.1 URL Format Requirements

```
/{vendor}/{app code}[/custom subdirectory]/{resource (plural)}
```

**Examples:**
- Good: `/kd/dev/sample/users` (recommended)
- Good: `/kd/bos/usercenter/users` (recommended)
- Good: `/myisv/myapp/orders` (custom vendor)
- Bad: `/kd/dev` (missing resource path; at least 3 levels required)
- Bad: `/dev/sample/users` (missing vendor prefix)

#### 3.3.2 Vendor Prefix Rules

| isv value | URL prefix | Description |
|--------|---------|------|
| `kingdee` | `/kd/` | Kingdee in-house uniformly uses `kd` |
| any other | `/{isv}/` | Secondary-development vendors use their own code |

#### 3.3.3 Full URL Composition Rules

Final access URL = **class URL** + **method URL**

| Class URL | Method URL | Final access URL |
|--------|---------|-------------|
| `/kd/dev/users` | `/{id}` | `/kd/dev/users/{id}` |
| `/kd/dev/users` | `` (empty) | `/kd/dev/users` |
| `/kd/dev/users` | `/profile` | `/kd/dev/users/profile` |

**Notes:**
- When the method URL is empty, the class URL is used directly
- A method URL that does not start with `/` will have one prepended automatically
- A trailing `/` on the class URL will be deduplicated automatically

### 3.4 Method Configuration

#### 3.4.1 Required Fields

| Field | Description | Example | Required |
|------|------|------|---------|
| `name` | Method name (corresponds to the method in the script) | `getUser`, `createUser` | Yes |
| `httpMethod` | HTTP request method | `GET`, `POST`, `PUT`, `DELETE` | Yes |
| `permission` | Permission configuration object | See 3.4.2 | Yes |

#### 3.4.2 Permission Configuration

Each method must have a permission check configured:

```xml
            <permission>
                <permission>
                    <permitAll>false</permitAll>
                    <anonymousUser>false</anonymousUser>
                    <entityNumber>bos_user</entityNumber>
                    <permItemId>47150e89000000ac</permItemId>
                    <checkRightApp>dev</checkRightApp>
                </permission>
            </permission>
```

**Field descriptions:**

| Field | Type | Default | Description |
|------|------|--------|------|
| `permitAll` | boolean | `false` | Whether to bypass permission control. When set to `true`, the unified permission check is skipped and the controller method handles permission logic itself |
| `anonymousUser` | boolean | `false` | Whether to allow anonymous user access. `permitAll` must also be set to `true` for anonymous access to take effect |
| `entityNumber` | string | — | Business entity code used for permission check (e.g. `bos_user`) |
| `permItemId` | string | — | Permission item ID used for permission check (defined in permission design) |
| `checkRightApp` | string | — | Business application code used for permission check (usually matches `app`) |

**Common configuration scenarios:**

```xml
<!-- Scenario 1: Standard permission check (recommended) -->
<permission>
    <permission>
        <permitAll>false</permitAll>
        <entityNumber>bos_user</entityNumber>
        <permItemId>47150e89000000ac</permItemId>
        <checkRightApp>dev</checkRightApp>
    </permission>
</permission>

<!-- Scenario 2: Skip the unified permission check; the controller method handles auth itself -->
<permission>
    <permission>
        <permitAll>true</permitAll>
    </permission>
</permission>

<!-- Scenario 3: Allow anonymous user access (permitAll must also be enabled) -->
<permission>
    <permission>
        <permitAll>true</permitAll>
        <anonymousUser>true</anonymousUser>
    </permission>
</permission>
```

### 3.5 Version Management Rules

#### 3.5.1 Version Number Rules

- Type: **positive integer** (1, 2, 3...)
- Comparison: the new version number must be **greater than** the existing one
- Overwrite: overwriting the same version number is not supported

#### 3.5.2 Version Upgrade Example

```
<!-- First deployment -->
<version>1</version>

<!-- Upgrade deployment -->
<version>2</version>  <!-- Succeeds -->

<!-- Error examples -->
<version>2</version>  <!-- Fails: same version -->
<version>1</version>  <!-- Fails: lower version -->
```

### 3.6 Deployment Validation Flow

Deployment validates in the following order:

```
1. Required field checks
   ├─ name is empty?
   ├─ isv is empty?
   ├─ app is empty?
   ├─ url is empty?
   ├─ scriptFile is empty?
   └─ methods is empty?

2. URL format checks
   ├─ contains vendor prefix?
   ├─ contains app code?
   └─ more than 2 path levels (resource path required)?

3. Method configuration checks
   ├─ method.name is empty?
   ├─ method.httpMethod is empty?
   └─ method.permission configured?

4. Version number check
   └─ new version > existing version?
```

---

## Full Script Development API

This document only covers `.kws` metadata configuration. For the complete script development API (request handling, response handling, etc.), see:

> `../kingscript-code-generator/references/docs/custom-development/script-controller-guide.md`
