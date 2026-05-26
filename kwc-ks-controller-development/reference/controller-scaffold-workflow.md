# Controller Integration Workflow in KWC Projects

This document describes the position, creation, build, and deployment workflow of script controllers (Script Controller) in KWC projects.

## 1. Controller Position in KWC Projects

### 1.1 Directory Structure

Controllers are located in the `app/ks/controller/` directory of the KWC project:

```
my-kwc-project/
├── .kd/
│   └── config.json          # Project configuration
├── app/
│   ├── kwc/                  # Frontend component directory
│   │   └── MyComponent/
│   ├── pages/                # Page metadata directory
│   │   └── myPage.page-meta.kwp
│   └── ks/
│       └── controller/       # Controller directory
│           └── UserController/
│               ├── UserController.kws    # .kws metadata file
│               └── UserController.ts     # Script file
├── dist/
│   ├── kwc/                  # Frontend build output
│   └── controller/           # Controller build output
└── package.json
```

### 1.2 File Composition

Each Controller consists of two files:

| File | Description | Example |
|------|------|------|
| .kws metadata file | Defines routes, methods, permissions | `UserController.kws` |
| TypeScript script file | Implements business logic | `UserController.ts` |

## 2. Creating a Controller

### 2.1 Creating via CLI

Create a Controller using the `kd project create` command:

```bash
# Basic usage
kd project create <ControllerName> --type controller

# Specify target environment (for pulling SDK)
kd project create <ControllerName> --type controller -e dev
```

**Examples**:

```bash
# Create UserController
kd project create UserController --type controller

# Create OrderController, specifying dev environment
kd project create OrderController --type controller -e dev
```

### 2.2 Directory Structure After Creation

After executing the command, files are generated under `app/ks/controller/`:

```
app/ks/controller/
└── UserController/
    ├── UserController.kws    # Template metadata file
    └── UserController.ts     # Template script file
```

### 2.3 Notes

- Controller directory names use PascalCase
- File names must match the directory name
- The first creation automatically creates the `app/ks/controller/` parent directory

## 3. Building a Controller

### 3.1 Build Commands

There are multiple ways to build a Controller:

```bash
# Method 1: Using npm scripts (recommended)
npm run build:controller                    # Build all Controllers
npm run build:controller -- MyController    # Build a specific Controller
npm run build:controller -- --env=dev       # Specify environment

# Method 2: Using kd CLI
kd project build --type controller          # Build all Controllers
kd project build MyController --type controller  # Build a specific Controller
kd project build --type controller -e dev   # Specify environment
```

### 3.2 Build Output

Build artifacts are output to the `dist/controller/` directory:

```
dist/
└── controller/
    ├── UserController/
    │   ├── UserController.kws
    │   └── UserController.js
    └── OrderController/
        ├── OrderController.kws
        └── OrderController.js
```

### 3.3 Pre-Build Checks

The build command checks:
- Whether the `app/ks/controller/` directory exists
- Whether .kws metadata files are valid
- Whether script file syntax is correct

## 4. Deploying a Controller

### 4.1 Deploy Command

Controllers are uploaded via the unified deploy command:

```bash
# Deploy the entire project (including frontend components and Controllers)
kd project deploy

# Deploy to a specific environment
kd project deploy -e sit

# Deploy only a specific Controller
kd project deploy -d dist/controller/UserController
```

### 4.2 Automatic Processing During Deployment

Deployment automatically:
- Pulls the isv value from the environment and writes it to .kws metadata
- Validates the version number (must be greater than the deployed version)
- Registers the Controller route

### 4.3 Deployment Prerequisites

- Environment authentication completed via `kd env auth`
- Build command executed to generate deployment artifacts
- Version in .kws metadata is greater than the existing server-side version

## 5. Version Management

### 5.1 Version Number Rules

- Type: Positive integer (1, 2, 3...)
- New Controller first deployment is set to `1`
- Each update deployment must increment the version number
- **Overwriting** with the same version number is **not supported**

### 5.2 Version Update Example

```xml
<!-- First deployment -->
<version>1</version>

<!-- First update -->
<version>2</version>

<!-- Second update -->
<version>3</version>
```

### 5.3 Version Error Handling

| Error | Cause | Solution |
|------|------|---------|
| Duplicate version number | Version number matches the server | Increment the version number |
| Version number too low | Version number is less than the server's | Use a larger version number |

## 6. Complete Workflow Orchestration

### 6.1 New Controller Workflow

```
1. kd project create UserController --type controller
   └── Generate template files
   
2. Write .kws metadata
   └── Define url, methods, permission
   
3. Write script code
   └── Implement business logic
   
4. npm run build:controller
   └── Build to dist/controller/
   
5. kd project deploy
   └── Deploy to cloud environment
```

### 6.2 Update Controller Workflow

```
1. Modify .kws metadata or script code

2. Increment the version in .kws metadata
   └── <version>2</version>
   
3. npm run build:controller
   └── Rebuild
   
4. kd project deploy
   └── Deploy update
```

### 6.3 Debugging Workflow

```
1. Modify code

2. npm run build:controller

3. kd project deploy

4. Test the API using an API tool
   └── GET ../kwc/v1/kd/dev/users/123
```

## 7. Responsibility Boundaries

### 7.1 kwc-ks-controller-development Responsibilities

- ✅ Write/modify Controller metadata (.kws)
- ✅ Write/modify Controller script code
- ✅ Consult SDK documentation and indexes

### 7.2 Scaffold Workflow Responsibilities

- ✅ Create Controller (`kd project create --type controller`)
- ✅ Build Controller (`npm run build:controller`)
- ✅ Deploy Controller (`kd project deploy`)
- ✅ Environment management (`kd env` related commands)

### 7.3 Collaboration Flow

```
Scaffold Workflow          kwc-ks-controller-development
       │                                   │
       │  kd project create               │
       │────────────────────────────►     │
       │                                   │
       │                          Write .kws metadata
       │                          Write script code
       │                                   │
       │  Return for build/deploy          │
       │◄────────────────────────────     │
       │                                   │
       │  npm run build:controller         │
       │  kd project deploy                │
       │                                   │
```

## 8. Debugging and Testing

### 8.1 Local Debugging

- Debugging is handled by the scaffold workflow, using `kd debug` to start
- **Must use background mode** (`is_background: true`), otherwise the 90-second timeout will kill the process
- After starting, the browser may open before the service is ready; wait and then refresh
- Check the debug process status via `get_terminal_output`

### 8.2 Frontend-Backend Integration Debugging Flow

1. Ensure the backend Controller is deployed (increment version → build → deploy)
2. Ensure the frontend component uses the correct adapterApi configuration
3. Start `kd debug` for local integration debugging
4. Access the corresponding page in the browser to trigger the frontend component calling the backend API
5. Check the browser developer tools Network panel to confirm request/response

### 8.3 Common Debugging Scenarios

- **API returns 404**: Check source path, version match, and Controller deployment status
- **API returns 401/403**: Check permission configuration (permitAll/needall/entityNumber)
- **Request parameters missing**: Confirm GET uses params (query parameters), POST uses params (request body)
- **Response data format mismatch**: Confirm `response.ok()` receives the correct data structure
