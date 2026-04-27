# Component Metadata

按需读取本文件，用于从用户需求生成组件元数据 `.js-meta.kwc`。

## 组件元数据的职责

组件元数据不是组件代码的重复描述，而是告诉 KWC 环境：

- 这个组件是否应作为可部署组件存在
- 这个组件在页面装配时显示什么名字
- 这个组件支持什么页面类型
- 页面可以给它传哪些配置项

如果一个组件只是内部逻辑封装，不需要在页面元数据中直接声明，可以删除对应 `.js-meta.kwc`，避免随 `deploy` 被当作可装配组件上传。

## 脚手架生成后的处理原则

执行：

```bash
kd project create DemoComponent1 --type kwc
```

脚手架会生成：

- `app/kwc/DemoComponent1/DemoComponent1.tsx`
- `app/kwc/DemoComponent1/DemoComponent1.module.scss`
- `app/kwc/DemoComponent1/DemoComponent1.js-meta.kwc`

其中 `.js-meta.kwc` 默认更像模板，不应直接当最终元数据使用。

Skill 需要检查并补齐：

- `version`
- `name`
- `masterLabel`
- `isv`：开发商标识，开发阶段可留空，deploy 时自动从环境拉取写入
- `app`
- `framework`
- `targets`
- `targetConfigs`

## 关键字段如何生成

### 顶层字段

| 字段 | 生成原则 |
| --- | --- |
| `version` | 设为自然数，新增组件通常从 `1` 开始；仅当该 `.js-meta.kwc` 文件内容变更并准备重新上传时递增 |
| `name` | 组件类型标识，通常直接使用组件名，如 `DemoComponent1`；页面元数据中的 `control.type` 必须与它完全一致 |
| `masterLabel` | 给页面装配者看的中文名称 |
| `isv` | 开发商标识，开发阶段可留空，deploy 时自动从环境拉取并写入元数据 |
| `app` | 所属应用编码（必须由用户明确提供，详见 SKILL.md「需要用户提供或确认的输入」一节） |
| `framework` | 当前工程框架，如 `react` |
| `targets` | KWC 页面当前默认填 `KWCFormModel` |

注意：

- 页面元数据中的 `control.type` 必须与这里的 `name` 完全一致，包含大小写也必须一致

例子：

```xml
<!-- 组件元数据 -->
<name>OverviewCard</name>

<!-- 页面元数据中的正确写法 -->
<type>OverviewCard</type>

<!-- 页面元数据中的错误写法 -->
<type>kwc_OverviewCard</type>
```

不要把目录名 `kwc`、文件夹层级或你自己的命名偏好拼到 `type` 里；页面元数据只认这里声明的 `name`。

### 属性区 `targetConfigs`

只为“页面配置者需要调整的参数”生成 `<property>`。
不要把内部状态、纯表现细节、临时变量暴露成元数据属性。

## 属性设计方法

先把需求里的“可配置项”列出来，再做类型映射：

| 需求形态 | 元数据类型 |
| --- | --- |
| 文本、标题、提示语、接口编码 | `String` |
| 数量、行数、阈值 | `Integer` |
| 开关、是否显示、是否禁用 | `Boolean` |
| 固定选项集合 | `Combo` |

### 推荐判断

- 若页面中同一个组件实例需要传不同文案或不同模式，做成 `<property>`
- 若所有页面都固定一致，写在组件代码里，不做成 `<property>`
- 若页面装配者需要在后台可视化选择枚举值，优先用 `Combo`

## `<property>` 生成规则

所有属性共通字段：

- `name`：代码引用名，必须稳定，且在同一个页面类型下唯一
- `type`：`String` / `Integer` / `Boolean` / `Combo`
- `caption`：给配置者看的字段标题
- `description`：解释这个配置项做什么
- `default`：存在合理默认值时填写

类型补充：

- `String`：可加 `length`
- `Integer`：可加 `min` / `max`
- `Boolean`：通常只需 `default`
- `Combo`：必须补 `items`

## 页面元数据如何引用组件属性

组件元数据里定义了：

```xml
<property
    name="StringValue"
    type="String"
    caption="标题"
    description="用于展示标题"
    default="默认标题"
/>
```

则页面元数据中才能这样写：

```xml
<propertys>
    <property>
        <name>StringValue</name>
        <value>首页标题</value>
    </property>
</propertys>
```

也就是说：

- 组件元数据定义“可配什么”
- 页面元数据填写“当前实例用什么值”

## 常见失误

- 保留了 `.js-meta.kwc`，但组件其实不需要作为页面组件暴露
- 页面里写了 `<property>`，组件元数据里却没有对应定义
- `version` 留空
- 只改了组件实现代码，却误以为组件元数据 `version` 也要递增
- `masterLabel` 仍是脚手架默认英文名，没有改成可读名称
- `isv` 由 deploy 自动写入，一般无需关注
