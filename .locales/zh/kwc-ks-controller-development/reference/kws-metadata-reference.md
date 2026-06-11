# .kws 元数据配置参考

`.kws` 是 KWC 生态中 Controller 的元数据文件格式，与 `.js-meta.kwc`（组件元数据）、`.page-meta.kwp`（页面元数据）构成三元对称体系。

## 概述

脚本控制器（Script Controller）是基于 KingScript 的 Web API 控制器，运行在 BOS 平台的 KWC 框架中。它允许开发者使用脚本语言快速创建 RESTful API，无需编译 Java 代码。

**核心特性：**
- 🚀 **快速开发**：使用 KingScript 编写，即时生效
- 🔧 **灵活配置**：通过 .kws 元数据配置 URL 路由和方法绑定
- 🛡️ **权限控制**：内置权限验证机制
- 🔄 **热部署**：支持运行时更新，无需重启服务

每个脚本控制器由两个核心文件构成：`.kws` 元数据文件（定义路由、方法、权限）和 `.ts` 脚本文件（实现业务逻辑）。本文档仅涵盖 `.kws` 元数据配置部分。

---

## 控制器配置详解

### 3.1 必填字段清单

控制器配置必须包含以下字段，否则部署会失败：

| 字段 | 说明 | 示例 | 是否必填 |
|------|------|------|---------|
| `name` | 控制器名称（唯一标识） | `UserScriptController` | ✅ 必填 |
| `isv` | 开发商编码 | `kingdee` 或自定义编码 | ✅ 必填 |
| `app` | 业务应用编码 | `dev`、`bos` 等 | ✅ 必填 |
| `version` | 版本号（正整数） | `1`、`2`、`3` | ✅ 必填 |
| `url` | 控制器根 URL 地址 | `/kd/dev/sample/users` | ✅ 必填 |
| `scriptFile` | 脚本文件名 | `UserScriptController.ts` | ✅ 必填 |
| `methods` | 方法定义集合（至少 1 个） | 见 3.2 节 | ✅ 必填 |

### 3.2 .kws 元数据模板

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Controller>
    <!-- 基础信息 -->
    <name>UserScriptController</name>
    <isv>kingdee</isv>
    <app>dev</app>
    <version>1</version>

    <!-- URL 地址 -->
    <url>/kd/dev/sample/users</url>

    <!-- 脚本文件绑定 -->
    <scriptFile>UserScriptController.ts</scriptFile>

    <!-- 方法定义 -->
    <methods>
        <method>
            <name>getUser</name>
            <url>/{id}</url>
            <httpMethod>GET</httpMethod>

            <!-- 权限配置（必填） -->
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

### 3.3 URL 地址规则（重要）

#### 3.3.1 URL 格式要求

```
/{开发商}/{应用标识}[/自定义子目录]/{资源复数}
```

**示例：**
- ✅ `/kd/dev/sample/users` （推荐）
- ✅ `/kd/bos/usercenter/users` （推荐）
- ✅ `/myisv/myapp/orders` （自定义开发商）
- ❌ `/kd/dev` （缺少资源路径，至少 3 级）
- ❌ `/dev/sample/users` （缺少开发商前缀）

#### 3.3.2 开发商前缀规则

| isv 值 | URL 前缀 | 说明 |
|--------|---------|------|
| `kingdee` | `/kd/` | 金蝶原厂统一使用 `kd` |
| 其他值 | `/{isv}/` | 二开厂商使用自己的编码 |

#### 3.3.3 完整 URL 拼接规则

最终访问 URL = **类 URL** + **方法 URL**

| 类 URL | 方法 URL | 最终访问 URL |
|--------|---------|-------------|
| `/kd/dev/users` | `/{id}` | `/kd/dev/users/{id}` |
| `/kd/dev/users` | `` (空) | `/kd/dev/users` |
| `/kd/dev/users` | `/profile` | `/kd/dev/users/profile` |

**注意事项：**
- 方法 URL 为空时，直接使用类 URL
- 方法 URL 不以 `/` 开头会自动添加
- 类 URL 以 `/` 结尾会自动去重

### 3.4 方法配置（Method）

#### 3.4.1 必填字段

| 字段 | 说明 | 示例 | 是否必填 |
|------|------|------|---------|
| `name` | 方法名（对应脚本中的方法） | `getUser`、`createUser` | ✅ 必填 |
| `httpMethod` | HTTP 请求方法 | `GET`、`POST`、`PUT`、`DELETE` | ✅ 必填 |
| `permission` | 权限配置对象 | 见 3.4.2 | ✅ 必填 |

#### 3.4.2 权限配置

每个方法必须配置权限检查：

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

**字段说明：**

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `permitAll` | boolean | `false` | 是否不受权限控制。设为 `true` 则跳过统一的权限检查，由控制器方法自行处理权限逻辑 |
| `anonymousUser` | boolean | `false` | 是否允许匿名用户访问。需同时将 `permitAll` 设为 `true`，匿名访问才会生效 |
| `entityNumber` | string | — | 验权使用的业务实体编码（如 `bos_user`） |
| `permItemId` | string | — | 验权使用的权限项 ID（在权限设计中定义） |
| `checkRightApp` | string | — | 验权使用的业务应用编码（通常与 `app` 一致） |

**常见配置场景：**

```xml
<!-- 场景 1：标准权限验证（推荐） -->
<permission>
    <permission>
        <permitAll>false</permitAll>
        <entityNumber>bos_user</entityNumber>
        <permItemId>47150e89000000ac</permItemId>
        <checkRightApp>dev</checkRightApp>
    </permission>
</permission>

<!-- 场景 2：跳过统一权限检查，由控制器方法自行鉴权 -->
<permission>
    <permission>
        <permitAll>true</permitAll>
    </permission>
</permission>

<!-- 场景 3：允许匿名用户访问（需同时开启 permitAll） -->
<permission>
    <permission>
        <permitAll>true</permitAll>
        <anonymousUser>true</anonymousUser>
    </permission>
</permission>
```

### 3.5 版本管理规则

#### 3.5.1 版本号规则

- 类型：**正整数**（1, 2, 3...）
- 比较：新版本号必须 **大于** 已有版本号
- 覆盖：不支持相同版本号覆盖

#### 3.5.2 版本升级示例

```
<!-- 首次部署 -->
<version>1</version>

<!-- 升级部署 -->
<version>2</version>  <!-- ✅ 成功 -->

<!-- 错误示例 -->
<version>2</version>  <!-- ❌ 失败：版本相同 -->
<version>1</version>  <!-- ❌ 失败：版本更低 -->
```

### 3.6 部署验证流程

部署时会按以下顺序验证：

```
1. 必填字段检查
   ├─ name 是否为空
   ├─ isv 是否为空
   ├─ app 是否为空
   ├─ url 是否为空
   ├─ scriptFile 是否为空
   └─ methods 是否为空

2. URL 格式检查
   ├─ 是否包含开发商前缀
   ├─ 是否包含应用编码
   └─ 是否超过 2 级路径（必须有资源路径）

3. 方法配置检查
   ├─ method.name 是否为空
   ├─ method.httpMethod 是否为空
   └─ method.permission 是否配置

4. 版本号检查
   └─ 新版本号 > 已有版本号
```

---

## 完整脚本开发 API

本文档仅涵盖 `.kws` 元数据配置。完整的脚本开发 API（包括请求处理、响应处理等）请参考：

> `../kingscript-code-generator/references/docs/custom-development/脚本控制器开发指南.md`
