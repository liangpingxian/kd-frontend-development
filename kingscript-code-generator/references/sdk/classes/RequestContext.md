# RequestContext

## Basic Information

- Name: `RequestContext`
- Java class: `kd.bos.context.RequestContext`
- TS export name: `RequestContext`
- Module: `@cosmic/bos-core`
- Package: `kd/bos`
- Namespace: `kd.bos.context`
- Type: Request context and session context object
- Sources:
  - TS declaration: `@cosmic/bos-core/bos-framework.d.ts`
  - Javadoc: TBD

## Overview

Used to get the current logged-in user, organization, tenant, language, and request context information. It is one of the most core entry points when a script needs to read "who is currently logged in, which tenant and organization they belong to".

## Typical Scenarios

- Get current user ID, current organization, login organization
- Determine tenant, account book, and language environment
- Pass context in new threads or async scenarios that need to replicate context
- Troubleshoot "works locally, but context is empty online" issues

## Common User Phrasings

- How to get the current logged-in user
- How to get the current organization
- How to determine the tenant
- What is the difference between `RequestContext.get()` and `getOrCreate()`

## Common Pairings

- `BusinessDataServiceHelper`
  - Combined with current user or organization for conditional queries
- `AbstractBillPlugIn`
  - Reading context in plugin events
- `AbstractFormPlugin`
  - Reading current login information in form logic

## Common Methods

- `get()`
- `create()`
- `getOrCreate()`
- `copy()`
- `copyAndSet()`
- `set()`
- `getCurrUserId()`
- `getTenantCode()`
- `getOrgId()`
- `getLang()`
- `getLoginOrg()`

## High-Value Rules

- When getting "current user, organization, tenant", prioritize reading from `RequestContext`; do not guess page parameters yourself
- `get()` is better for reading the current thread context, while `getOrCreate()` is better for fallback context retrieval
- `copy()` and `copyAndSet()` are more for low-level context passing and are not high-frequency entry points for ordinary form scripts

## Runtime Notes

- Whether context values are available is closely related to the current plugin type, call timing, and whether it crosses threads
- Even if a declaration exists, you cannot assume that complete login information is readable in every scenario
- If the issue involves permissions, tenants, or organization isolation, also consider the runtime environment and API constraints

## Common Errors

### 1. Context is not null, but fields cannot be retrieved

High-probability causes:
- Wrong timing; login context has not been established yet
- Running in a cross-thread or async scenario, but context was not properly copied
- Mistaking page parameters for request context

## Related Documents

- [AbstractBillPlugIn.md](AbstractBillPlugIn.md)
- [AbstractFormPlugin.md](AbstractFormPlugin.md)
- troubleshooting.md

## Keywords

- Chinese keywords: current user, current organization, login organization, tenant, context, session context
- English keywords: `RequestContext`
- Common error terms: context is null, user is null, organization is null
