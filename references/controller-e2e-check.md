# Controller 端到端自检（🔴 硬性门槛）

> 主 SKILL.md 和 [`kwc-ks-controller-development/SKILL.md`](../kwc-ks-controller-development/SKILL.md) 都引用本文档。修改请只改这一处。

写完 Controller 脚本 + .kws 元数据并部署成功后，**必须**通过 [`scripts/test-controller.mjs`](../scripts/test-controller.mjs) 进行端到端自检，保证接口真的调得通、返回期望的 JSON。

**所有报错解决之前，禁止开始编写前端对接代码（adapterApi 调用 / KWC 组件里的业务逻辑）。**

## 1. 为什么需要这步

- /kapi OpenAPI 网关只支持注册在 ISV 允许列表的接口；Controller 正常暴露在 `/kwc/v1/{isv}/{app}/...`
- `/kwc/v1` 物理上 **仅支持 session Cookie 鉴权**（access_token 无效，会返回「会话缓存丢失」或 302 跳转登录页）
- 所以必须用「账号密码登录 → 解析租户化 Cookie → 调 /kwc/v1」的方式验证，与浏览器实际调用路径一致

## 2. 账号/密码配置

脚本会从 `~/.kd/config.json` 的对应环境读取 `login_account.{fname,password}`（由 `kd env auth` 等工具写入），形如：

```json
{
  "env": {
    "vb": {
      "url": "https://feature.kingdee.com:1026/feature_vb",
      "accountId": "2453077976581943296",
      "isv": "kdtest",
      "login_account": { "fname": "<手机号>", "password": "<密码>" }
    }
  }
}
```

读取到的账号密码会用网关返回的 RSA 公钥 PKCS1v15 加密后提交 /auth/yzjlogin.do，不会出现在命令行历史中。也可以通过 `--user`/`--password` 临时覆盖配置文件中的值。

## 3. 使用方式

在当前 KWC 工程根目录执行：

```bash
# 方式 A：直接指定完整接口路径
node $SKILL_DIR/scripts/test-controller.mjs \
  --env vb \
  --path /kwc/v1/kdtest/kdtest_kwc_test/demo/hello \
  --method GET --query "name=World"

# 方式 B：三段式（isv/app 从 .kd/config.json 自动读取）
node $SKILL_DIR/scripts/test-controller.mjs \
  --env vb --sub demo --endpoint hello --query "name=World"

# 方式 C：POST + JSON body
node $SKILL_DIR/scripts/test-controller.mjs \
  --env vb --path /kwc/v1/kdtest/kdtest_kwc_test/demo/create \
  --method POST --body '{"title":"t1","amount":100}'

# 方式 D：带数据断言（推荐）
node $SKILL_DIR/scripts/test-controller.mjs \
  --env vb --path /kwc/v1/kdtest/kdtest_kwc_test/expense/list \
  --method GET --assert-not-empty data --assert-field data[0].id
```

## 4. 验证通过标准

同时满足才算通过，任何一项不满足都不得进入前端对接：

1. HTTP 状态码 2xx
2. 响应为合法 JSON，`success` 不为 `false`
3. 返回结构和字段类型与 Controller 设计一致（特别注意数组/对象字段需使用 ArrayList/HashMap，否则前端可能拿到 `{}` 而非 `[]`，见 controller rule.md 第 7.0 节）
4. 每个要对接的方法都至少跑一轮：正常值 + 边界值 + 期望错误值（验证参数校验和 throwException 路径）
5. **必须使用 `--assert-*` 参数验证返回数据**，仅验证连通性（HTTP 200）不够。至少要：
   - `--assert-not-empty data`（确认有数据返回）
   - 或 `--assert-field <关键字段>`（确认关键字段存在）
6. 如果测试返回空数据，应检查 Controller 代码中的查询条件、参数传递是否正确
7. 若 `--assert-not-empty` 断言失败，**不要直接判定为无数据**。按 Controller 技能中的诊断模式排查（多方式探测），区分"代码逻辑错误"和"环境确实无数据"（参考 [`../kwc-ks-controller-development/reference/faq.md`](../kwc-ks-controller-development/reference/faq.md) 「数据查询结果为空时的诊断模式」）

## 5. 就地循环（最多 3 次，超限停下来交还用户）

如果自检失败：

1. 仔细读脚本给出的 HTTP 状态 / `error_desc`，或 `--verbose` 重跑看细节
2. 回到 [`../kwc-ks-controller-development/SKILL.md`](../kwc-ks-controller-development/SKILL.md) 修改脚本 / .kws / .kd 配置
3. 重新构建并部署（scaffold）
4. 再次跑 test-controller.mjs
5. **重试上限**：上述「修改 → 部署 → 自检」循环**最多执行 3 次**
6. **超限处理**：3 次仍失败时，**禁止继续循环、禁止改前端写假数据掩盖问题**。必须停下来，向用户输出诊断报告：
   - 最近一次的具体错误（HTTP 状态、`error_desc`、响应体）
   - 已尝试过的修改思路与各自结果
   - 当前推测的可能原因（环境、字段、权限、SDK 限制等）
   - 建议用户介入的下一步（例如：确认环境是否有数据、确认实体字段、提供权限信息等）
   把判断与决策交还用户，不要让 AI 自行降级"交付质量"
7. 自检通过后才能进入 adapterApi / 前端组件代码编写-<!---->
