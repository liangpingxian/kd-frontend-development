# Meta Query

按需读取本文件，用于查询苍穹环境中的表单元数据和实体字段结构。所有操作通过 `meta-query-api.mjs` 脚本完成。

## 路径推算规则

```
SKILL_DIR = 本参考文档所在目录的上级 (skills/kd-frontend-development/)
meta_query_api = SKILL_DIR/scripts/meta-query-api.mjs
```

AI 运行时根据 SKILL_DIR 动态推算脚本绝对路径，禁止硬编码。

## 命令速查表

### queryFormsByApp — 按应用搜索表单

```bash
node "{meta_query_api}" queryFormsByApp --appNumber {appNumber} [--keyword <keyword>] [--env {envName}]
```

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `--appNumber` | 是 | 应用编码，对应 `.kd/config.json` 的 `app` 字段 |
| `--keyword` | 否 | 附加关键词，对名称/编码做模糊过滤 |
| `--env` | 否 | 目标环境名，不传则使用默认环境 |

日常使用的主要命令，KWC 工程始终有 appNumber 上下文。

示例：

```bash
# 列出当前应用下所有表单
node "/path/to/meta-query-api.mjs" queryFormsByApp --appNumber kdec_contract

# 在应用内按关键词过滤
node "/path/to/meta-query-api.mjs" queryFormsByApp --appNumber kdec_contract --keyword 报销
```

### getEntityFields — 获取表单实体字段

```bash
node "{meta_query_api}" getEntityFields --formNumber <formNumber> [--env {envName}]
```

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `--formNumber` | 是 | 表单编码（如 sal_order） |
| `--env` | 否 | 目标环境名 |

根据表单编码查询其关联的实体字段，按单头和单据体分组返回。

示例：

```bash
node "/path/to/meta-query-api.mjs" getEntityFields --formNumber sal_order
```

## 响应格式说明

### queryFormsByApp 响应

返回 `data` 为表单数组，每条包含：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `formId` | String | 表单内部 ID |
| `formNumber` | String | 表单编码（开发标识） |
| `formName` | String | 表单显示名称 |
| `modelType` | String | 模型类型（bill 单据、base 基础资料等） |
| `appNumber` | String | 所属应用编码 |
| `appName` | String | 所属应用名称 |

### getEntityFields 响应

返回 `data` 为 Map，包含两个顶层 key：

- `headerFields`：单头分组，含 headerId、headerName、headerKey 和 fields 列表
- `entryFields`：单据体字段映射，key 为单据体标识（entryKey），value 含 entryId、entryName、entryKey 和 fields 列表

每个字段包含 5 个属性：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | String | 字段内部 ID |
| `name` | String | 字段名称（当前语言环境） |
| `key` | String | 字段标识（如 billno、amount） |
| `type` | String | 字段类型（如 TextField、DecimalField） |
| `mustInput` | boolean | 是否必录 |

## 多结果处理流程

| 场景 | 处理方式 |
| --- | --- |
| 返回单条结果 | 直接确认为目标表单，提取 formNumber 进入下一步 |
| 返回多条结果 | 以列表形式展示（序号 / 表单名称 / 表单编码 / 模型类型 / 所属应用），让用户选择 |
| 返回空结果 | 提示未找到匹配表单，建议尝试换关键词重试 |

展示格式：

```
找到 N 个匹配表单：
  1. 费用报销单（uhyl_custom_expen）— 单据 — AI需求分解
  2. 差旅报销单（uhyl_travel_expen）— 单据 — AI需求分解
请选择目标表单序号：
```

getEntityFields 展示格式：

```
表单「销售订单」实体字段结构：

【单头】销售订单（billhead）
  - 单据编号 (billno) — TextField — 必录
  - 单据日期 (billdate) — DateField

【单据体】明细信息（entryentity）
  - 物料编码 (materialcode) — TextField — 必录
  - 数量 (qty) — DecimalField — 必录

【子分录】批次明细（subentryentity）
  - 批次号 (batchno) — TextField
```

## 使用场景决策表

| 用户给出的信息 | 推荐命令 | 示例 |
| --- | --- | --- |
| 已知应用编码 | queryFormsByApp | `queryFormsByApp --appNumber {app}` |
| 已知应用 + 关键词 | queryFormsByApp | `queryFormsByApp --appNumber {app} --keyword 报销` |
| 已知表单编码，需查字段 | getEntityFields | `getEntityFields --formNumber sal_order` |

## 错误码速查表

| 错误码 | 说明 | 处理建议 |
| --- | --- | --- |
| `PARAM_INVALID` | 参数校验失败 | 检查 formNumber 是否为空、超长或含非法字符 |
| `FORM_NOT_FOUND` | 表单不存在 | 检查 formNumber 是否正确 |
| `500` | 服务器内部错误 | 重试或检查服务端日志 |
