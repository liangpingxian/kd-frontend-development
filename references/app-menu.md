# App Menu Management

按需读取本文件，用于在部署后将页面注册到应用菜单，使页面在苍穹环境中可被导航访问。所有操作通过 `menu-api.mjs` 脚本完成。

## 路径推算规则

```
SKILL_DIR = 本参考文档所在目录的上级 (skills/kd-frontend-development/)
menu_api  = SKILL_DIR/scripts/menu-api.mjs
```

AI 运行时根据 SKILL_DIR 动态推算脚本绝对路径，禁止硬编码。

## 核心概念

| 概念 | 说明 |
| --- | --- |
| `bizAppNumber` | 应用编码。对应项目 `.kd/config.json` 的 `app` 字段，或 `.page-meta.kwp` 的 `<app>` 标签值 |
| `formNumber` | 页面编码。对应 `.page-meta.kwp` 的 `<name>` 标签的实际值。**必须取 deploy 后 XML 中 `<name>` 标签的实际值**（已含 ISV 前缀，如 `kdtest_demo_page`），不要自行拼接 ISV 前缀 |
| `menuId` | 菜单 ID。从 `queryTree` 返回结果中获取，或从 `addMenu` 的成功响应中获取 |
| 菜单层级 | 最多支持 **3 级**深度 |

## 命令速查表

### queryTree — 查询应用菜单树

```bash
node "{menu_api}" queryTree --bizAppNumber {bizAppNumber} [--env {envName}]
```

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `--bizAppNumber` | 是 | 应用编码 |
| `--env` | 否 | 目标环境名，不传则使用默认环境 |

返回该应用的完整菜单树结构，包含每个菜单的 `menuId`、`name`、`menuType`、`formNumber`、`linkUrl`、`visible`、子菜单列表等。

示例：

```bash
node "/path/to/menu-api.mjs" queryTree --bizAppNumber kdec_contract
```

### getMenu — 查询单个菜单详情

```bash
node "{menu_api}" getMenu --bizAppNumber {bizAppNumber} --menuId {menuId} [--env {envName}]
```

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `--bizAppNumber` | 是 | 应用编码 |
| `--menuId` | 是 | 菜单 ID |
| `--env` | 否 | 目标环境名 |

返回单个菜单的详细信息。

示例：

```bash
node "/path/to/menu-api.mjs" getMenu --bizAppNumber kdec_contract --menuId abc123
```

### addMenu — 新增菜单

页面菜单：

```bash
node "{menu_api}" addMenu --bizAppNumber {bizAppNumber} --name {name} --formNumber {formNumber} [--parentMenuId {parentMenuId}] [--seq {seq}] [--env {envName}]
```

链接菜单：

```bash
node "{menu_api}" addMenu --bizAppNumber {bizAppNumber} --name {name} --menuType link --linkUrl {url} [--parentMenuId {parentMenuId}] [--seq {seq}] [--env {envName}]
```

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `--bizAppNumber` | 是 | 应用编码 |
| `--name` | 是 | 菜单显示名称 |
| `--formNumber` | 页面菜单时必填 | 页面编码（deploy 后 `<name>` 实际值） |
| `--parentMenuId` | 否 | 父菜单 ID，不传则创建一级菜单 |
| `--menuType` | 否 | 菜单类型，默认 `page` |
| `--linkUrl` | `link` 类型时必填 | 链接地址 |
| `--seq` | 否 | 排序序号（整数，范围 1–32767）。同级菜单按 seq 升序排列，不传则使用服务端默认值。脚本内部已自动转换并校验范围。**必须从小数开始递增（如 1、2、3），禁止使用大数值** |
| `--env` | 否 | 目标环境名 |

成功响应中包含新菜单的 `menuId`。

示例：

```bash
# 创建一级页面菜单
node "/path/to/menu-api.mjs" addMenu --bizAppNumber kdec_contract --name "销售合同" --formNumber kdtest_sal_contract

# 创建子菜单
node "/path/to/menu-api.mjs" addMenu --bizAppNumber kdec_contract --name "采购合同" --formNumber kdtest_pur_contract --parentMenuId parent123

# 创建链接菜单
node "/path/to/menu-api.mjs" addMenu --bizAppNumber kdec_contract --name "帮助文档" --menuType link --linkUrl "https://help.kingdee.com"
```

### updateMenu — 修改菜单

```bash
node "{menu_api}" updateMenu --bizAppNumber {bizAppNumber} --menuId {menuId} [--name {name}] [--formNumber {formNumber}] [--parentMenuId {parentMenuId}] [--visible 0|1] [--seq {seq}] [--env {envName}]
```

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `--bizAppNumber` | 是 | 应用编码 |
| `--menuId` | 是 | 菜单 ID |
| `--name` | 否 | 新的菜单名称 |
| `--formNumber` | 否 | 新的页面编码 |
| `--parentMenuId` | 否 | 新的父菜单 ID；设为 `bizAppNumber` 即移到根级别（一级菜单） |
| `--visible` | 否 | `1` 可见，`0` 隐藏 |
| `--seq` | 否 | 排序序号（整数，范围 1–32767）。脚本内部已自动将字符串转为数字并校验范围。可用于修复序号重复问题 |
| `--env` | 否 | 目标环境名 |

仅传需修改的字段，未传字段保持不变。

示例：

```bash
# 重命名菜单
node "/path/to/menu-api.mjs" updateMenu --bizAppNumber kdec_contract --menuId abc123 --name "新名称"

# 隐藏菜单
node "/path/to/menu-api.mjs" updateMenu --bizAppNumber kdec_contract --menuId abc123 --visible 0

# 移到根级别
node "/path/to/menu-api.mjs" updateMenu --bizAppNumber kdec_contract --menuId abc123 --parentMenuId kdec_contract
```

### deleteMenu — 删除菜单

```bash
node "{menu_api}" deleteMenu --bizAppNumber {bizAppNumber} --menuId {menuId} [--env {envName}]
```

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `--bizAppNumber` | 是 | 应用编码 |
| `--menuId` | 是 | 菜单 ID |
| `--env` | 否 | 目标环境名 |

**级联删除**：删除菜单时同时删除所有子菜单。

**删除后验证**：优先使用 `getMenu` 确认目标菜单返回 `MENU_NOT_FOUND`，而非使用 `queryTree` 验证（菜单树可能存在短暂缓存延迟）。

示例：

```bash
node "/path/to/menu-api.mjs" deleteMenu --bizAppNumber kdec_contract --menuId abc123
```

### moveMenu — 同级移动菜单排序

```bash
node "{menu_api}" moveMenu --bizAppNumber {bizAppNumber} --menuId {menuId} --direction {up|down} [--env {envName}]
```

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `--bizAppNumber` | 是 | 应用编码 |
| `--menuId` | 是 | 菜单 ID |
| `--direction` | 是 | 移动方向：`up` 或 `down` |
| `--env` | 否 | 目标环境名 |

示例：

```bash
node "/path/to/menu-api.mjs" moveMenu --bizAppNumber kdec_contract --menuId abc123 --direction up
```

## 菜单树展示规范

向用户展示菜单树时，使用以下图标约定：

| 条件 | 图标 | 含义 |
| --- | --- | --- |
| `menuType=page` 且有子菜单 | 📁 | 分组 |
| `menuType=page` 且无子菜单 | 📄 | 页面 |
| `menuType=link` | 🔗 | 链接 |

附加规则：

- `visible="0"` 的菜单标注"隐藏"
- 页面菜单展示 `formNumber`，链接菜单展示 `linkUrl`

展示示例：

```
📋 应用「{bizAppNumber}」当前菜单结构：

 1. 📁 合同中心（page，可见）
    1.1 📄 销售合同 → kdec_sal_contract（page，可见）
    1.2 📄 采购合同 → kdec_pur_contract（page，可见）
 2. 🔗 帮助文档 → https://help.kingdee.com（link，可见）
```

## 错误码速查表

| 错误码 | 说明 | 处理建议 |
| --- | --- | --- |
| `PARAM_INVALID` | 参数校验失败 | 检查必填参数和枚举值 |
| `NO_PERMISSION` | 无编辑权限 | 确认开发者权限 |
| `ADD_MENU_FAIL` | 新增失败（如层级超 3 级） | 检查层级，选择其他位置 |
| `UPDATE_MENU_FAIL` | 修改失败（层级/循环引用） | 检查目标位置合法性 |
| `DELETE_MENU_FAIL` | 删除失败（含帮助中心菜单） | HPCE 菜单不可删除 |
| `MENU_NOT_FOUND` | 菜单不存在 | 重新查询菜单树确认 ID |
| `APP_NOT_FOUND` | 应用不存在 | 检查 bizAppNumber |
| `MOVE_MENU_FAIL` | 移动失败（首位/末位/序号一致） | 序号一致时先用 `updateMenu --seq` 修改相邻菜单序号使其不同，再重试移动 |
| `SAVE_FAIL` | 保存失败 | 建议重试 |

## 约束提醒

| 约束 | 说明 | 何时提醒 |
| --- | --- | --- |
| 菜单层级限制 | 最多 3 级深度 | 用户选择放在第 3 级菜单下时 |
| 帮助中心保护 | ID 以 `HPCE` 结尾的菜单不可删除 | 删除前检查 |
| 级联删除 | 删除菜单同时删除所有子菜单 | 删除操作确认时 |
| 级联隐藏 | 隐藏菜单同时级联隐藏子菜单 | 修改 `visible` 为 `0` 时 |
| 循环引用防护 | 不能将菜单移到自身或后代下 | 修改 `parentMenuId` 时 |
| `formNumber` 取值 | 必须从 deploy 后 `.page-meta.kwp` 的 `<name>` 实际值获取 | 新增页面菜单时 |
| 批量新增需显式 seq | 同级批量新增菜单时必须传递从小开始的递增 `--seq` 值（如 1、2、3），禁止使用大数值，否则序号重复或超出范围会导致后续 moveMenu 失败 | 连续新增多个同级菜单时 |

## 枚举值参考

| 参数 | 允许值 | 说明 |
| --- | --- | --- |
| `menuType` | `page`, `link` | 默认 `page` |
| `openType` | `MainNewTabPage`, `NewWindow`, `Modal` | 脚本固定为 `MainNewTabPage` |
| `visible` | `1`, `0` | 默认 `1`（可见） |
| `direction` | `up`, `down` | 移动方向 |
