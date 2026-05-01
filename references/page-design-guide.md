# 页面设计指南 — AI 视觉设计标准

> 本文档是 AI 的**默认审美标准**。当用户只描述功能需求而不提供设计规格时，AI 必须主动应用以下视觉方案，确保生成的页面**默认就好看**。
> 代码骨架为框架无关的 Web Components 标签形式，具体框架语法由各框架 rule.md 控制。

---

## 1 核心设计理念

- **默认就好看**：用户不提设计要求时，AI 应主动应用本文档的视觉标准，而非生成毫无样式的骨架页面。
- **单组件原则**：一个页面 = 一个组件，所有布局在组件内部完成。禁止将统计区、图表区、列表区拆成独立组件。
- **组件优先**：必须使用 `@kdcloudjs/shoelace` 的 `sl-*` 组件，禁止用原生 HTML 重造已有组件功能。业务级组件从 `@kdcloudjs/shoelace-biz` 导入。
- **Token 优先**：所有颜色、间距、字号、圆角必须使用 CSS 变量，参见 `reference/css-design-tokens.md`。

---

## 2 视觉体系标准

### 2.1 配色方案

| 用途 | Token | 说明 |
|------|-------|------|
| 页面底色 | `--sl-color-neutral-0` | 白色，页面主体背景 |
| 区域底色 | `--sl-color-neutral-50` / `--sl-color-neutral-100` | 浅灰，用于区分区域层次（如筛选栏背景） |
| 强调/链接 | `--sl-color-primary-600` | 品牌蓝，关键操作和数据高亮，**不超过页面视觉面积 10%** |
| 成功 | `--sl-color-success-600` | 仅用于成功状态、正增长指标 |
| 危险 | `--sl-color-danger-600` | 仅用于错误状态、负增长指标、删除操作 |
| 警告 | `--sl-color-warning-600` | 仅用于警告状态 |
| 标题文字 | `--sl-color-neutral-700` | 最深文字色，用于页面标题和卡片标题 |
| 正文文字 | `--sl-color-neutral-600` | 次深，用于正文内容 |
| 辅助文字 | `--sl-color-neutral-500` | 用于描述性文字、标签说明 |
| 边框 | `--sl-color-neutral-300` | 卡片/输入框边框 |
| 分割线 | `--sl-color-neutral-200` | 同一卡片内的区域分隔 |

**配色禁忌**：
- 禁止大面积使用鲜艳色（如整个卡片背景用 primary-600）
- 同一页面最多 1 种强调色 + 2 种语义色，禁止超过 3 种强调色同时出现
- 语义色各有 50~950 色阶：浅色背景用 50/100，边框用 200/300，文字/图标用 600

### 2.2 间距与留白

| 场景 | Token | 值 |
|------|-------|-----|
| 页面级边距（容器 padding） | `--sl-spacing-large` | 20px |
| 不同功能区之间 | `--sl-spacing-large` | 20px |
| 卡片内边距 | `--sl-spacing-medium` | 16px |
| 同一区域内元素间距 | `--sl-spacing-small` ~ `--sl-spacing-medium` | 12px ~ 16px |
| 紧凑元素间距（如标签与数值） | `--sl-spacing-x-small` | 8px |

**留白原则**：宁多勿少。留白让页面更专业、更易阅读。两个功能区之间的间距应 >= 区域内元素间距的 1.5 倍。

### 2.3 字号层级

| 角色 | Token | 建议 weight |
|------|-------|-------------|
| 页面标题 | `--sl-font-size-medium`（16px） | 600 |
| 卡片/区域标题 | `--sl-font-size-small`（14px） | 600 |
| 统计大数字 | `--sl-font-size-2x-large` 或更大（需查阅完整 Token） | 700 |
| 正文 | `--sl-font-size-small`（14px） | 400 |
| 辅助说明 | `--sl-font-size-x-small`（12px），配合 neutral-500 色 | 400 |

**层级原则**：一个视图区域内最多 3 级字号，避免字号过多导致杂乱。

### 2.4 圆角与阴影

| 场景 | 值 |
|------|-----|
| 卡片/容器 | `--sl-border-radius-large`（8px） |
| 按钮/输入框 | `--sl-border-radius-medium`（4px） |
| 卡片阴影 | `box-shadow: 0 1px 3px rgba(0,0,0,0.08)` — 轻微阴影增加层次感 |
| 分割线 | `1px solid var(--sl-color-neutral-200)` |

### 2.5 图表配色（ECharts）

```js
// 默认调色盘 — 所有图表统一使用
const colorPalette = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'];

// 单指标图表：使用品牌色
const singleColor = 'var(--sl-color-primary-600)';

// 通用图表样式
const chartDefaults = {
  grid: { top: 40, right: 20, bottom: 30, left: 50, containLabel: true },
  // 背景网格线：极浅灰，不要用黑线
  yAxis: { splitLine: { lineStyle: { color: '#f0f0f0' } } },
  tooltip: { trigger: 'axis' },
};
```

---

## 3 页面模板与默认布局

以下是各页面类型的**默认视觉方案**。用户没有指定设计时，直接应用。

### 3.1 工作台 Dashboard

默认结构：顶部标题栏 → 统计卡片行 → 图表区 → 可选摘要区。

```html
<div class="page-container">
  <div class="page-header">
    <h2 class="page-title">项目工作台</h2>
    <sl-space>
      <sl-datepicker type="daterange" placeholder="日期范围" clearable></sl-datepicker>
      <sl-button variant="primary">导出</sl-button>
    </sl-space>
  </div>
  <!-- 统计卡片行：4 列等宽 -->
  <sl-row gutter="16">
    <sl-col span="6">
      <div class="stat-card">
        <div class="stat-label">总项目数</div>
        <div class="stat-value">128</div>
        <div class="stat-trend trend-up">↑ 12.5%</div>
      </div>
    </sl-col>
    <sl-col span="6">
      <div class="stat-card">
        <div class="stat-label">进行中</div>
        <div class="stat-value" style="color:var(--sl-color-primary-600)">42</div>
        <div class="stat-trend trend-up">↑ 8.3%</div>
      </div>
    </sl-col>
    <sl-col span="6">
      <div class="stat-card">
        <div class="stat-label">已逾期</div>
        <div class="stat-value" style="color:var(--sl-color-danger-600)">7</div>
        <div class="stat-trend trend-down">↑ 2 项</div>
      </div>
    </sl-col>
    <sl-col span="6">
      <div class="stat-card">
        <div class="stat-label">完成率</div>
        <div class="stat-value">86%</div>
        <div class="stat-trend trend-up">↑ 3.2%</div>
      </div>
    </sl-col>
  </sl-row>
  <!-- 图表区 -->
  <sl-row gutter="16" style="margin-top:var(--sl-spacing-large)">
    <sl-col span="14">
      <sl-card class="chart-card">
        <div class="card-title">趋势分析</div>
        <div id="trendChart" style="width:100%;height:340px"></div>
      </sl-card>
    </sl-col>
    <sl-col span="10">
      <sl-card class="chart-card">
        <div class="card-title">分类占比</div>
        <div id="pieChart" style="width:100%;height:340px"></div>
      </sl-card>
    </sl-col>
  </sl-row>
  <!-- 底部摘要区（可选） -->
  <sl-row gutter="16" style="margin-top:var(--sl-spacing-large)">
    <sl-col span="12"><sl-card><!-- 最近动态 --></sl-card></sl-col>
    <sl-col span="12"><sl-card><!-- 待办事项 --></sl-card></sl-col>
  </sl-row>
</div>
```

```css
/* 通用页面样式 — 所有模板共用 */
.page-container { padding: var(--sl-spacing-large); background: var(--sl-color-neutral-100); min-height: 100vh; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sl-spacing-large); }
.page-title { margin: 0; font-size: var(--sl-font-size-medium); font-weight: 600; color: var(--sl-color-neutral-700); }
/* 统计卡片 */
.stat-card { background: var(--sl-color-neutral-0); border-radius: var(--sl-border-radius-large); padding: var(--sl-spacing-medium); box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.stat-label { font-size: var(--sl-font-size-x-small); color: var(--sl-color-neutral-500); }
.stat-value { font-size: 28px; font-weight: 700; color: var(--sl-color-neutral-700); margin: var(--sl-spacing-x-small) 0; }
.stat-trend { font-size: var(--sl-font-size-x-small); }
.trend-up { color: var(--sl-color-success-600); }
.trend-down { color: var(--sl-color-danger-600); }
/* 图表卡片 */
.chart-card { border-radius: var(--sl-border-radius-large); }
.card-title { font-size: var(--sl-font-size-small); font-weight: 600; color: var(--sl-color-neutral-700); margin-bottom: var(--sl-spacing-small); }
```

**ECharts 集成**：
```js
const chart = echarts.init(document.getElementById('trendChart'));
chart.setOption({ /* 使用 2.5 节的 chartDefaults + colorPalette */ });
const ro = new ResizeObserver(() => chart.resize());
ro.observe(document.getElementById('trendChart'));
// 卸载时：chart.dispose(); ro.disconnect();
```

### 3.2 图表分析页

默认结构：顶部筛选栏（浅灰背景区分）→ 图表网格。

```html
<div class="page-container">
  <!-- 筛选栏 -->
  <div class="filter-bar">
    <sl-space size="medium" wrap>
      <sl-select placeholder="维度" clearable style="width:160px"></sl-select>
      <sl-datepicker type="daterange" placeholder="时间范围" clearable></sl-datepicker>
      <sl-button variant="primary">查询</sl-button>
      <sl-button>重置</sl-button>
    </sl-space>
  </div>

  <!-- 图表网格：2 列等高 -->
  <sl-row gutter="16" style="margin-top:var(--sl-spacing-large)">
    <sl-col span="12">
      <sl-card class="chart-card"><div id="chart1" style="width:100%;height:340px"></div></sl-card>
    </sl-col>
    <sl-col span="12">
      <sl-card class="chart-card"><div id="chart2" style="width:100%;height:340px"></div></sl-card>
    </sl-col>
  </sl-row>
  <sl-row gutter="16" style="margin-top:var(--sl-spacing-medium)">
    <sl-col span="24">
      <sl-card class="chart-card"><div id="chart3" style="width:100%;height:340px"></div></sl-card>
    </sl-col>
  </sl-row>
</div>
```

```css
.filter-bar {
  background: var(--sl-color-neutral-50);
  padding: var(--sl-spacing-medium);
  border-radius: var(--sl-border-radius-large);
}
```

### 3.3 个性化定制页

#### 3.3.1 卡片流

等宽卡片网格，hover 提升，统一卡片高度。

```html
<div class="page-container">
  <div class="page-header">
    <h2 class="page-title">模板中心</h2>
  </div>
  <sl-row gutter="16">
    <sl-col xs="24" sm="12" lg="8" xl="6">
      <div class="card-item">
        <sl-image src="/img/tpl1.png" style="width:100%;border-radius:var(--sl-border-radius-medium) var(--sl-border-radius-medium) 0 0"></sl-image>
        <div class="card-item-body">
          <div class="card-item-title">数据概览模板</div>
          <div class="card-item-desc">适用于多指标汇总展示场景</div>
          <sl-button variant="primary" size="small" style="margin-top:var(--sl-spacing-small)">使用</sl-button>
        </div>
      </div>
    </sl-col>
    <!-- 更多卡片同结构 -->
  </sl-row>
</div>
```

```css
.card-item { background: var(--sl-color-neutral-0); border-radius: var(--sl-border-radius-large); box-shadow: 0 1px 3px rgba(0,0,0,0.08); transition: box-shadow 0.2s, transform 0.2s; overflow: hidden; }
.card-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); transform: translateY(-2px); }
.card-item-body { padding: var(--sl-spacing-medium); }
.card-item-title { font-size: var(--sl-font-size-small); font-weight: 600; color: var(--sl-color-neutral-700); }
.card-item-desc { font-size: var(--sl-font-size-x-small); color: var(--sl-color-neutral-500); margin-top: var(--sl-spacing-2x-small); }
```

#### 3.3.2 分步引导

```html
<sl-steps current="1" type="default">
  <!-- items={[{title:'基本信息'},{title:'高级设置'},{title:'确认提交'}]} -->
</sl-steps>
<div class="step-content"><!-- 根据 current 切换内容 --></div>
<div class="step-actions">
  <sl-button>上一步</sl-button>
  <sl-button variant="primary">下一步</sl-button>
</div>
```
```css
.step-content { margin-top: var(--sl-spacing-large); background: var(--sl-color-neutral-0); border-radius: var(--sl-border-radius-large); padding: var(--sl-spacing-large); min-height: 300px; }
.step-actions { display: flex; gap: var(--sl-spacing-small); justify-content: flex-end; margin-top: var(--sl-spacing-medium); }
```

#### 3.3.3 数据概览（统计 + 图表 + 表格混合）

复用 3.1 的统计卡片行 + 图表行，底部追加表格区。使用 `sl-segmented` 实现视图切换：

```html
<sl-segmented value="overview">
  <!-- options={[{label:'概览',value:'overview'},{label:'详情',value:'detail'}]} -->
</sl-segmented>
<div style="margin-top:var(--sl-spacing-medium)"><!-- 概览=卡片+图表 / 详情=表格 --></div>
```

### 3.4 表单页面

默认方案：1-2 列布局，标签上方对齐，底部操作栏。

```html
<sl-card>
  <form>
    <sl-row gutter="16">
      <sl-col span="12"><sl-input label="项目名称" placeholder="请输入" required></sl-input></sl-col>
      <sl-col span="12"><sl-select label="项目类型" placeholder="请选择" required></sl-select></sl-col>
    </sl-row>
    <sl-row gutter="16" style="margin-top:var(--sl-spacing-medium)">
      <sl-col span="12"><sl-datepicker label="开始日期" type="date" clearable></sl-datepicker></sl-col>
      <sl-col span="12"><sl-datepicker label="截止日期" type="date" clearable></sl-datepicker></sl-col>
    </sl-row>
    <div class="form-actions">
      <sl-button variant="primary" type="submit">提交</sl-button>
      <sl-button>取消</sl-button>
    </div>
  </form>
</sl-card>
```
```css
.form-actions { display: flex; gap: var(--sl-spacing-small); justify-content: flex-end; margin-top: var(--sl-spacing-large); padding-top: var(--sl-spacing-medium); border-top: 1px solid var(--sl-color-neutral-200); }
```

### 3.5 列表/表格页面

默认方案：顶部筛选栏 + 表格 + 底部分页。

```html
<div class="page-container">
  <div class="page-header">
    <h2 class="page-title">项目列表</h2>
    <sl-button variant="primary">新建</sl-button>
  </div>
  <div class="filter-bar">
    <sl-space size="medium" wrap>
      <sl-input placeholder="搜索" clearable style="width:220px"><sl-icon name="search" slot="prefix"></sl-icon></sl-input>
      <sl-select placeholder="状态" clearable style="width:160px"></sl-select>
      <sl-button variant="primary">查询</sl-button><sl-button>重置</sl-button>
    </sl-space>
  </div>
  <sl-card style="margin-top:var(--sl-spacing-medium)">
    <sl-table row-key="id" bordered><!-- columns + dataSource 通过属性传入 --></sl-table>
    <div style="display:flex;justify-content:flex-end;margin-top:var(--sl-spacing-medium)">
      <sl-pagination total="100" page-size="10" current-page="1"></sl-pagination>
    </div>
  </sl-card>
</div>
```

---

## 4 通用视觉模式

- **页面头部**：标题左对齐 + 右侧操作区，底部通过 margin 间距分隔。参见 3.1 中 `.page-header`。
- **统计卡片**：大数字（neutral-700 或语义色）+ 上方标签（neutral-500，12px）+ 下方趋势（绿涨红跌）。参见 3.1 中 `.stat-card`。

### 4.1 空态
```html
<div class="empty-state">
  <sl-icon name="inbox" style="font-size:3rem"></sl-icon>
  <p>暂无数据</p>
</div>
```
```css
.empty-state {
  text-align: center;
  padding: 60px 0;
  color: var(--sl-color-neutral-500);
}
.empty-state p { margin-top: var(--sl-spacing-small); font-size: var(--sl-font-size-small); }
```

### 4.2 加载态 / 错误态
```html
<!-- 加载 -->
<div style="display:flex;justify-content:center;padding:60px 0"><sl-spinner style="font-size:2rem"></sl-spinner></div>
<!-- 错误 -->
<sl-alert variant="danger" open><sl-icon slot="icon" name="exclamation-octagon"></sl-icon>加载失败，请稍后重试。</sl-alert>
```

### 4.3 弹窗与通知
```html
<sl-dialog label="编辑信息">
  <sl-input label="名称" placeholder="请输入"></sl-input>
  <sl-space slot="footer"><sl-button>取消</sl-button><sl-button variant="primary">确定</sl-button></sl-space>
</sl-dialog>
```
```js
SlNotification.success({ title: '操作成功', description: '数据已保存', duration: 3000 });
```

### 4.4 可交互元素
所有可点击元素必须有 hover 反馈（颜色变化、阴影提升或 `transform` 位移），且设置 `cursor: pointer`。

---

## 5 样式硬性约束

1. **禁止**硬编码颜色值（`#333`、`rgb()`）→ 必须使用 `--sl-color-*` Token。
2. **禁止**硬编码间距/圆角/字号 → 必须使用对应 Token。（布局固定尺寸、行高、边框宽度、无对应 Token 的大数字字号除外）
3. **禁止**原生 HTML 替代已有 `sl-*` 组件（如用 `<table>` 替代 `<sl-table>`）。
4. **禁止**同一页面出现超过 3 种强调色。
5. 所有可点击元素需有 hover 状态反馈。
6. 页面背景统一使用 `--sl-color-neutral-100`（浅灰），卡片/容器使用 `--sl-color-neutral-0`（白色）形成层次。

---

## 6 组件参考索引

按场景查找，详细 API 见对应 reference 文档。

| 场景 | 组件 | 参考文档 |
|------|------|----------|
| 布局 | `sl-row` + `sl-col`，`sl-space`，`sl-card` | `sl-grid.md`、`sl-space.md` |
| 表格 | `sl-table`（row-key 必填）、`sl-pagination` | `table/index.md`、`sl-pagination.md` |
| 表单 | `sl-input`、`sl-select`、`sl-datepicker`、`sl-cascader`、`sl-lookup`、`sl-radio-group`、`sl-transfer`、`sl-tree-select` | 各组件同名 md |
| 弹窗/提示 | `sl-dialog`、`sl-popconfirm`、`SlNotification`（JS）、`sl-alert` | 各组件同名 md |
| 导航 | `sl-nav`、`sl-float-button` | 各组件同名 md |
| 展示 | `sl-image`、`sl-steps`、`sl-segmented` | 各组件同名 md |
| 图表 | ECharts（`echarts.init()` + ResizeObserver，配色见 2.5 节） | — |
| AI | `sl-bubble`、`sl-thought-chain`、`sl-xmarkdown`、`sl-sender` | 各组件同名 md |
