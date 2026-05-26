# Controller End-to-End Self-Check (🔴 Hard Gate)

> Both the main SKILL.md and [`kwc-ks-controller-development/SKILL.md`](../kwc-ks-controller-development/SKILL.md) reference this document. Please modify only this one copy.

After writing the Controller script + .kws metadata and deploying successfully, you **must** perform an end-to-end self-check via [`scripts/test-controller.mjs`](../scripts/test-controller.mjs) to ensure the API is actually callable and returns the expected JSON.

**Until all errors are resolved, writing frontend integration code (adapterApi calls / business logic in KWC components) is forbidden.**

## 1. Why This Step Is Needed

- The /kapi OpenAPI gateway only supports interfaces registered in the ISV allow list; Controllers are normally exposed at `/kwc/v1/{isv}/{app}/...`
- `/kwc/v1` physically **only supports session Cookie authentication** (access_token is invalid and will return "Session cache lost" or a 302 redirect to the login page)
- Therefore, you must verify using the "account/password login → parse tenant-specific Cookie → call /kwc/v1" approach, which is consistent with the actual browser call path

## 2. Account/Password Configuration

The script reads `login_account.{fname,password}` from the corresponding environment in `~/.kd/config.json` (written by tools such as `kd env auth`), like:

```json
{
  "env": {
    "vb": {
      "url": "https://feature.kingdee.com:1026/feature_vb",
      "accountId": "2453077976581943296",
      "isv": "kdtest",
      "login_account": { "fname": "<phone>", "password": "<password>" }
    }
  }
}
```

The read account and password are encrypted using the gateway's returned RSA public key PKCS1v15 before being submitted to /auth/yzjlogin.do; they will not appear in the command line history. You can also override the values in the config file temporarily via `--user`/`--password`.

## 3. Usage

Execute in the current KWC project root directory:

```bash
# Method A: Specify the full API path directly
node $SKILL_DIR/scripts/test-controller.mjs \
  --env vb \
  --path /kwc/v1/kdtest/kdtest_kwc_test/demo/hello \
  --method GET --query "name=World"

# Method B: Three-segment style (isv/app is automatically read from .kd/config.json)
node $SKILL_DIR/scripts/test-controller.mjs \
  --env vb --sub demo --endpoint hello --query "name=World"

# Method C: POST + JSON body
node $SKILL_DIR/scripts/test-controller.mjs \
  --env vb --path /kwc/v1/kdtest/kdtest_kwc_test/demo/create \
  --method POST --body '{"title":"t1","amount":100}'

# Method D: With data assertions (recommended)
node $SKILL_DIR/scripts/test-controller.mjs \
  --env vb --path /kwc/v1/kdtest/kdtest_kwc_test/expense/list \
  --method GET --assert-not-empty data --assert-field data[0].id
```

## 4. Validation Passing Criteria

All of the following must be satisfied to be considered passed; if any one is not met, frontend integration must not proceed:

1. HTTP status code 2xx
2. The response is valid JSON, and `success` is not `false`
3. The returned structure and field types are consistent with the Controller design (pay special attention to array/object fields that must use ArrayList/HashMap, otherwise the frontend may receive `{}` instead of `[]`; see controller rule.md section 7.0)
4. Each method to be integrated must run at least one round: normal value + boundary value + expected error value (verify parameter validation and throwException paths)
5. **You must use `--assert-*` parameters to validate returned data**; verifying only connectivity (HTTP 200) is insufficient. At minimum:
   - `--assert-not-empty data` (confirm data is returned)
   - Or `--assert-field <key field>` (confirm a key field is present)
6. If the test returns empty data, check the query conditions and parameter passing in the Controller code
7. If the `--assert-not-empty` assertion fails, **do not immediately conclude "there is no data"**. Follow the diagnostic pattern in the Controller skill (multi-method probing) to distinguish between "code logic error" and "the environment truly has no data" (refer to [`../kwc-ks-controller-development/reference/faq.md`](../kwc-ks-controller-development/reference/faq.md) "Diagnostic Pattern for Empty Query Results")

## 5. In-Place Loop (Max 3 Times; Hand Back to the User If Exceeded)

If the self-check fails:

1. Carefully read the HTTP status / `error_desc` given by the script, or re-run with `--verbose` to see details
2. Go back to [`../kwc-ks-controller-development/SKILL.md`](../kwc-ks-controller-development/SKILL.md) to modify the script / .kws / .kd config
3. Rebuild and deploy (scaffold)
4. Run test-controller.mjs again
5. **Retry limit**: The above "modify → deploy → self-check" loop may execute **at most 3 times**
6. **Exceeded handling**: If it still fails after 3 attempts, **continuing the loop is forbidden, and using fake frontend data to cover up the problem is forbidden**. You must stop and output a diagnostic report to the user:
   - The specific error from the most recent attempt (HTTP status, `error_desc`, response body)
   - The modification approaches already tried and their respective results
   - Current suspected possible causes (environment, fields, permissions, SDK limitations, etc.)
   - Suggested next steps for the user to intervene (e.g.: confirm whether the environment has data, confirm entity fields, provide permission info, etc.)
   Hand the judgment and decision back to the user; do not let the AI unilaterally downgrade "delivery quality"
7. Only after the self-check passes may you proceed to write adapterApi / frontend component code
