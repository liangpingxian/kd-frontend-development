# KWC KS Controller Development Expert

When the project requires developing a KingScript script controller (backend REST API), this Skill is responsible for the Controller's .kws metadata configuration and script code implementation.

**You must strictly comply with the hard rules defined in `rule.md` under this Skill's directory.**

## Preconditions

**All of the following must be satisfied before using this Skill:**
1. A `.kd/config.json` file already exists in the current directory
2. An `app/ks/controller/` directory already exists in the project
3. The project has been initialized via the scaffold workflow

**The following scenarios must be delegated to the scaffold workflow:**
- Project initialization, creating component/page/Controller directories (`kd project init` / `kd project create`)
- Generating or modifying `.js-meta.kwc` / `.page-meta.kwp` metadata
- Environment configuration, build, deployment, debugging (`kd env` / `npm run build` / `kd project deploy` / `kd debug`)

If the above preconditions are not currently met, stop immediately and return to the scaffold workflow (main entry).

## Standard Workflow

1. **Confirm directory exists**: The Controller directory has been created by scaffold (`app/ks/controller/<Name>/`)
2. **Read project configuration** (mandatory): Read `.kd/config.json` to get the real values of fields like `isv` and `app`. The subsequent `<isv>`, `<app>`, and `<url>` in .kws must be assembled based on these values; **guessing or hard-coding is forbidden**
3. **Query entity fields** (when operating on business entities): Use `meta-query-api.mjs` to get the real field structure; **never guess field names**
4. **Write the .kws metadata**: Build the URL based on the configuration read in step 2 (`/{isv}/{app}/...`) and define HTTP methods and permissions
5. **Write the script code**: Before starting to write code, you **must first read** `./reference/script-controller-pitfalls.md` to make sure you do not use APIs that don't exist or hit known runtime traps; confirm SDK calls in the indexes before using them
6. **Deploy**: After completion, run `kd project deploy` to upload the Controller to the environment

> Fatal pitfall: `kd project build --type controller` does NOT upload the code!
>
> `build` only compiles locally. It outputs "Success" but the server still runs the old code. **After every change to a Controller (.ts code or .kws version), you must run `kd project deploy` for the change to take effect.**
>
> Symptom: after changing the code, the interface still returns the old logic/old response/500. It looks like a business bug but is actually a missed deployment.
7. **End-to-end self-check (hard gate)**: After successful deployment, you **must** run `../scripts/test-controller.mjs` (login → Cookie → /kwc/v1) at least once against every method to be integrated. This is not covered by the "do not run deployments" rule; it is a read-only API call. **Until the self-check fully passes, writing KWC frontend integration code (adapterApi / frontend components) is forbidden**; see the "Controller End-to-End Self-Check" section in the main SKILL.md.
   - **You must use `--assert-*` parameters to validate returned data correctness**; verifying only connectivity (HTTP 200) is insufficient. At minimum:
     - `--assert-not-empty data` (confirm data is returned)
     - Or `--assert-field <key field>` (confirm a key field is present)
   - If the test returns empty data, check the query conditions and parameter passing in the Controller code
   - When a data assertion fails (empty data returned), **it is forbidden to immediately conclude "the environment has no data"**. First follow the "Diagnostic pattern for empty query results" in `reference/faq.md` to determine whether it is a code-logic issue or really no data
   - `QueryServiceHelper.query` must not use `topN=0` (equivalent to LIMIT 0); for full queries use the 3-arg overload
   - **Retry limit**: The "modify → deploy → test" loop after a failed self-check may run at most 3 times. If it still fails after 3 attempts, **give up fixing the Controller and switch to Mock data mode** (frontend component uses hard-coded fake data, with the adapterApi call kept commented out for later restoration). See the "Mock data mode" section in the main SKILL.md.

## Reference Resources

| Category | Resource | Path |
|------|------|------|
| **This Skill** | .kws metadata configuration reference | `./reference/kws-metadata-reference.md` |
| | Controller integration workflow | `./reference/controller-scaffold-workflow.md` |
| | Common patterns and code examples | `./reference/controller-patterns.md` |
| | Frontend adapterApi calling guide | `./reference/frontend-integration.md` |
| | Controller end-to-end self-check script | `../scripts/test-controller.mjs` |
| **KingScript** | Script Controller Development Guide | `../kingscript-code-generator/references/docs/custom-development/script-controller-guide.md` |
| | Script Controller Pitfalls Guide | `./reference/script-controller-pitfalls.md` |
| | Language basics | `../kingscript-code-generator/references/language/kingscript/README.md` |
| | SDK class index | `../kingscript-code-generator/references/sdk/indexes/class-index.md` |
| | SDK method index | `../kingscript-code-generator/references/sdk/indexes/method-index.md` |
| | SDK scenario index | `../kingscript-code-generator/references/sdk/indexes/scenario-index.md` |
| | SDK strategy and fallback chain | `../kingscript-code-generator/references/sdk/strategy.md` |
| | Java–KS type bridge | `../kingscript-code-generator/references/sdk/docs/java-kingscript-bridge.md` |
| **Scaffold** | Entity field query tool | `../references/meta-query.md` |
