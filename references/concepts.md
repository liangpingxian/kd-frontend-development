# KWC Core Concepts

> The main SKILL.md has been consolidated into an execution manual. Content about "why" and mental models is unified in this document. **Read once on first encounter with a KWC project**; afterwards you can execute directly.

## 1. Component-Page Relationship Constraints

- Components within a page can only be arranged vertically from top to bottom; free layout is not supported
- In general, 1 requirement = 1 component + 1 page (the page contains only this 1 component)
- All complex layouts (grids, cards, multi-region, etc.) are implemented inside the component; do not split them into multiple components
- Splitting different areas of a page (e.g. statistics card area, chart area, list area) into independent components is forbidden

## 2. Correct Understanding of Deliverables

Do not think of the KWC workflow as "rendering a component locally."
The core deliverables of KWC are:

1. The component project itself (frontend code + component metadata `.js-meta.kwc`)
2. Page metadata `*.page-meta.kwp`
3. KS Controller metadata `*.kws` and script code (when the functionality involves backend data interaction)
4. Target environment configuration and authentication
5. The environment rendering result after uploading via `kd project deploy`

The final page display depends on the `<controls>` in the page metadata and the component type mapping, not on whether `main.tsx` has mounted a certain component. `main.tsx` and `npm run dev` are only for local auxiliary preview and **are not the final delivery path**.

KWC is not just a frontend development framework. When a page needs to read or manipulate business data, KS Controllers provide backend REST API capabilities, accessing the Cosmic platform's data query, business operations, and other services through KingScript scripts. A complete business function typically includes both a frontend component (display and interaction) and a backend Controller (data retrieval and business logic).

Controllers also follow the "metadata + code" dual model:
- Controller metadata (.kws): defines declarative configuration such as route URLs, HTTP methods, and permission policies
- Controller script code (.ts): implements the specific business logic

This is completely symmetrical to the frontend's "component metadata .kwc + component code" pattern.

## 3. Metadata-Driven Full-Stack Development Model

A complete KWC feature covers up to the following layers:

**Frontend (Display & Interaction):**
1. Component code (*.tsx / *.vue / *.js): responsible for rendering and interaction logic
2. Component metadata `.js-meta.kwc`: declares "how this component can be referenced by pages, and which configurable properties it can expose"
3. Page metadata `.page-meta.kwp`: declares "which component instances this page consists of, and what property values are passed to each instance"

**Backend (Data & Business Logic):**
4. Controller metadata `.kws`: declares "which API endpoints this Controller exposes, what HTTP methods it uses, and what permissions are required"
5. Controller script code (*.ts): implements specific data queries, business operations, and other backend logic

Both frontend and backend follow the "metadata first, code implementation follows" pattern — first declare the structure and contract, then fill in the implementation.

When facing a requirement, do not just ask "how many components to write"; also continue to determine:

- Which parameters are hard-coded in the component code
- Which parameters need to be exposed to the page configurator and defined as `<property>` in the component metadata
- Which component instances will appear in the page metadata's `<controls>`
- Whether the component needs to call a backend API to fetch data or submit operations
- If needed, what API endpoints the Controller metadata (.kws) should define (URL, HTTP method, permissions)
- Which SDK capabilities the Controller script needs to call (data queries, business operations, etc.)

Default principles:

- Implementation details that can be fixed inside the component should not be exposed to metadata
- Only parameters that need to be assembled, reused, and configured by pages enter the component metadata and page metadata

## 4. Translating Requirements into Engineering Targets

When facing a request like "help me develop a KWC page/feature", first translate the requirement into the following items:

1. Whether a new project is needed, or whether to continue development in an existing project
2. Whether a component is needed (usually 1 requirement = 1 component), and what responsibilities the component should assume
3. Whether the component needs backend data support; if so, plan the corresponding KS Controller and API methods
4. How many page metadata files are needed (usually 1 page contains 1 component)
5. Which environment to deploy to in the end (if a default environment exists, use it directly without confirmation)

Only after these items are filled in will the scaffold commands have clear targets.
