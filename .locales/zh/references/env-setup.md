# Env Setup

按需读取本文件，用于在目标环境不存在或尚未认证时，指导用户补齐环境绑定信息。

## 环境存在性检查

当用户提供了具体的环境名称或别名（如 `dev`、`sit`、`uat` 等）时，应先检查该环境是否已存在：

```bash
kd env list
```

### 环境已存在的处理流程

若目标环境已在列表中：

1. 不需要再向用户收集 URL、Client ID/Secret 等环境信息
2. 使用 `kd env list` 确认环境认证状态
3. 若该环境不是当前默认环境，通过 `kd env set target-env <name>` 切换
4. 直接使用该环境进行后续操作（deploy、debug 等）

### 环境不存在的处理流程

若目标环境不在列表中，才进入完整的环境创建和认证流程（见下文）。

## 什么时候必须先收集环境信息

出现下面任一情况时，不要直接 `deploy`：

1. `kd env list` 中没有目标环境
2. 目标环境存在，但没有认证信息
3. 用户说“帮我绑定一个新环境”
4. 用户只给了环境别名，且该环境在 `kd env list` 中不存在，同时没有提供 URL 或 OpenAPI 参数

注意：若用户提供的环境别名已存在于 `kd env list`，则无需收集环境信息，直接使用即可。

## 必须由用户手工提供的字段

这些值不能猜，也不能从别的环境自动套用：

- `env name`
- `env url`
- `client id`
- `client secret`
- `username`

其中 `data center` 不在这批自由文本里。
正确流程是先创建环境，再进入 `kd env auth openapi`，由脚手架读取该环境的数据中心列表，然后让用户选择。

## 推荐交互方式

当前最稳妥的方式不是依赖弹窗，而是一次性向用户索要完整字段块：

```text
请补充以下环境信息：
1. env name:
2. env url:
3. client id:
4. client secret:
5. username:

说明：data center 不需要先手填，后续由脚手架读取候选项供选择。
```

原因：

- `client secret`、`username` 这类通常是自由文本
- `data center` 属于从目标环境读取出的候选项，更适合做选择而不是自由填写
- 即使某些运行环境支持结构化选择，也不适合承载一整套敏感凭据填写

## 收到字段后的命令顺序

1. 创建环境：

```bash
kd env create <env-name> --url <url>
```

2. 认证环境：

```bash
kd env auth openapi -e <env-name>
```

此时应让用户从脚手架提供的数据中心列表中选择，而不是要求用户手动输入数据中心编码。

3. 必要时设置默认环境：

```bash
kd env set target-env <env-name>
```

4. 复核环境状态：

```bash
kd env info
```

## 注意事项

- 在受限环境里，`kd env create` 可能显示成功但没有真正写入，必须复核
- 若用户没有给全字段，就不要继续执行认证
- 不要把旧项目里保存过的 `client id` / `client secret` 当成新环境默认值
- 不要把 `data center` 当成自由文本字段预先索要
