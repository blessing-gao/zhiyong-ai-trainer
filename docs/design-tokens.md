# 智涌·人工智能中心 - Design Token 规范文档

## 项目概述

本文档定义了智涌AI教育平台的完整设计系统规范，包括颜色、字体、间距、布局等所有视觉设计标准。

---

## 1. 颜色系统 (Color System)

### 1.1 品牌主色 (Primary Colors)

**AI蓝色系** - 代表科技、智能、专业

```css
--primary-50: hsl(207, 89%, 98%)    /* 极浅蓝 - 背景色 */
--primary-100: hsl(207, 89%, 95%)   /* 浅蓝 - 悬停背景 */
--primary-400: hsl(207, 89%, 64%)   /* 中蓝 - 次要元素 */
--primary-500: hsl(207, 89%, 54%)   /* 主蓝色 - 品牌主色 */
--primary-600: hsl(217, 91%, 60%)   /* 深蓝 - 强调色 */
--primary-700: hsl(217, 91%, 55%)   /* 更深蓝 - 悬停态 */
```

使用场景：
- 主按钮、链接、导航激活态
- 品牌标识、图标
- 重要信息提示

### 1.2 辅助色 (Secondary Colors)

**温暖橙黄色系** - 点缀色，营造温馨感

```css
--secondary-orange: hsl(38, 92%, 70%)  /* 橙色 */
--secondary-yellow: hsl(25, 95%, 73%)  /* 黄色 */
```

使用场景：
- 渐变背景的点缀
- Hero区域的视觉亮点
- 特殊标识和徽章

### 1.3 功能色彩 (Semantic Colors)

```css
/* 成功 - 绿色 */
--success: hsl(142, 76%, 36%)
--success-light: hsl(142, 76%, 96%)
--success-dark: hsl(142, 76%, 30%)

/* 警告 - 橙黄色 */
--warning: hsl(25, 95%, 73%)
--warning-light: hsl(25, 95%, 96%)
--warning-dark: hsl(25, 95%, 60%)

/* 错误 - 红色 */
--error: hsl(0, 84%, 60%)
--error-light: hsl(0, 84%, 96%)
--error-dark: hsl(0, 84%, 50%)

/* 信息 - 蓝色 */
--info: hsl(207, 89%, 54%)
--info-light: hsl(207, 89%, 96%)
--info-dark: hsl(207, 89%, 45%)
```

### 1.4 中性色系 (Neutral Colors)

```css
--gray-50: hsl(210, 40%, 98%)
--gray-100: hsl(210, 40%, 96%)
--gray-200: hsl(210, 40%, 91%)
--gray-300: hsl(210, 40%, 85%)
--gray-400: hsl(210, 40%, 70%)
--gray-500: hsl(210, 40%, 55%)
--gray-600: hsl(210, 40%, 45%)
--gray-700: hsl(210, 40%, 35%)
--gray-800: hsl(210, 40%, 25%)
--gray-900: hsl(210, 40%, 15%)
```

### 1.5 背景色 (Background Colors)

```css
--background: hsl(40, 100%, 95%)           /* 主背景 - 温暖米白色 */
--background-secondary: hsl(214, 100%, 97%) /* 次要背景 */
--card-background: hsl(0, 0%, 100%)        /* 卡片背景 - 纯白 */
```

---

## 2. 渐变系统 (Gradients)

### 2.1 品牌渐变

```css
/* 主渐变 - 蓝色系 */
--gradient-primary: linear-gradient(135deg, hsl(207 89% 54%), hsl(217 91% 60%));

/* 英雄区渐变 - 橙蓝组合 */
--gradient-hero: linear-gradient(135deg, hsl(38 92% 70%) 0%, hsl(25 95% 73%) 50%, hsl(207 89% 54%) 100%);

/* 背景渐变 - 浅色 */
--gradient-background: linear-gradient(135deg, hsl(38 92% 95%) 0%, hsl(25 95% 90%) 50%, hsl(207 89% 95%) 100%);

/* 深色背景渐变 */
--gradient-dark: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%);
```

### 2.2 功能渐变

```css
/* 成功渐变 */
--gradient-success: linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 45%));

/* 警告渐变 */
--gradient-warning: linear-gradient(135deg, hsl(25, 95%, 73%), hsl(25, 95%, 65%));

/* 卡片功能色渐变 */
--gradient-card-blue: linear-gradient(135deg, #3b82f6, #2563eb);
--gradient-card-green: linear-gradient(135deg, #10b981, #059669);
--gradient-card-purple: linear-gradient(135deg, #8b5cf6, #7c3aed);
--gradient-card-orange: linear-gradient(135deg, #f59e0b, #d97706);
```

---

## 3. 字体系统 (Typography)

### 3.1 字体家族 (Font Families)

```css
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
--font-zapfino: 'Zapfino', cursive;  /* 特殊装饰字体 - 用于年份等 */
```

### 3.2 字体大小 (Font Sizes)

```css
--text-xs: 0.75rem;      /* 12px - 辅助文本 */
--text-sm: 0.875rem;     /* 14px - 次要文本 */
--text-base: 1rem;       /* 16px - 正文 */
--text-lg: 1.125rem;     /* 18px - 强调文本 */
--text-xl: 1.25rem;      /* 20px - 小标题 */
--text-2xl: 1.5rem;      /* 24px - 卡片标题 */
--text-3xl: 1.875rem;    /* 30px - 区域标题 */
--text-4xl: 2.25rem;     /* 36px - 页面标题 */
--text-6xl: 3.75rem;     /* 60px - 超大标题 */
```

使用规范：
- **xs**: 时间戳、状态标签、版权信息
- **sm**: 表格内容、说明文字、辅助信息
- **base**: 正文内容、表单输入
- **lg**: 导航菜单、按钮文字
- **xl**: 卡片描述、副标题
- **2xl**: 统计数字、卡片标题
- **3xl**: 模块标题、区域标题
- **4xl**: 页面主标题
- **6xl**: Hero区域超大标题

### 3.3 字重 (Font Weights)

```css
--font-normal: 400;      /* 正文 */
--font-medium: 500;      /* 导航、按钮 */
--font-semibold: 600;    /* 卡片标题、表头 */
--font-bold: 700;        /* 页面标题、重要数字 */
```

### 3.4 行高 (Line Heights)

```css
--leading-tight: 1.2;     /* 标题、数字 */
--leading-normal: 1.5;    /* 正文、段落 */
--leading-relaxed: 1.75;  /* 长文本、说明 */
```

---

## 4. 间距系统 (Spacing System)

基于 **8px** 基础单位的间距系统：

```css
--spacing-0: 0;
--spacing-1: 0.25rem;    /* 4px */
--spacing-2: 0.5rem;     /* 8px */
--spacing-3: 0.75rem;    /* 12px */
--spacing-4: 1rem;       /* 16px */
--spacing-5: 1.25rem;    /* 20px */
--spacing-6: 1.5rem;     /* 24px */
--spacing-8: 2rem;       /* 32px */
--spacing-10: 2.5rem;    /* 40px */
--spacing-12: 3rem;      /* 48px */
--spacing-16: 4rem;      /* 64px */
--spacing-20: 5rem;      /* 80px */
--spacing-24: 6rem;      /* 96px */
```

### 间距使用规范

**组件内间距 (Padding):**
- 小按钮: `spacing-2 spacing-4` (8px 16px)
- 中按钮: `spacing-3 spacing-6` (12px 24px)
- 大按钮: `spacing-4 spacing-8` (16px 32px)
- 小卡片: `spacing-4` (16px)
- 中卡片: `spacing-6` (24px)
- 大卡片: `spacing-8` (32px)

**组件间距 (Margin/Gap):**
- 紧凑间距: `spacing-2` (8px)
- 常规间距: `spacing-4` (16px)
- 舒适间距: `spacing-6` (24px)
- 模块间距: `spacing-8` (32px)
- 区域间距: `spacing-12` (48px)
- 大区域间距: `spacing-16` (64px)

---

## 5. 圆角系统 (Border Radius)

```css
--radius-none: 0;
--radius-sm: 0.375rem;   /* 6px - 小按钮、标签 */
--radius-md: 0.5rem;     /* 8px - 输入框、小卡片 */
--radius-lg: 0.75rem;    /* 12px - 标准卡片、按钮 */
--radius-xl: 1rem;       /* 16px - 大卡片 */
--radius-2xl: 1.5rem;    /* 24px - 特殊容器 */
--radius-full: 9999px;   /* 圆形 - 徽章、头像 */
```

使用规范：
- **sm**: Badge、小标签
- **md**: Input、小按钮
- **lg**: 标准按钮、标准卡片（最常用）
- **xl**: 大卡片、特殊容器
- **full**: 圆形按钮、头像、状态点

---

## 6. 阴影系统 (Shadows)

```css
/* 功能阴影 */
--shadow-soft: 0 4px 20px -2px hsl(217 91% 60% / 0.1);
--shadow-medium: 0 8px 30px -4px hsl(217 91% 60% / 0.15);
--shadow-strong: 0 12px 40px -6px hsl(217 91% 60% / 0.2);

/* 交互阴影 */
--shadow-hover: 0 12px 40px -6px hsl(217 91% 60% / 0.25);
--shadow-focus: 0 0 0 3px hsl(217 91% 60% / 0.2);

/* 深色阴影 */
--shadow-dark: 0 4px 20px -2px rgba(0, 0, 0, 0.25);
```

使用场景：
- **soft**: 卡片默认阴影、导航栏
- **medium**: 重要卡片、弹窗、模态框
- **strong**: 悬浮元素、下拉菜单、提示框
- **hover**: 交互悬停效果
- **focus**: 表单聚焦状态

---

## 7. 布局系统 (Layout System)

### 7.1 断点系统 (Breakpoints)

```css
--breakpoint-sm: 640px;   /* 小屏手机 */
--breakpoint-md: 768px;   /* 平板 */
--breakpoint-lg: 1024px;  /* 小笔记本 */
--breakpoint-xl: 1280px;  /* 桌面 */
--breakpoint-2xl: 1400px; /* 大屏 */
```

### 7.2 容器宽度 (Container)

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1400px;
```

### 7.3 页面布局规范

#### 用户端页面布局

```
结构：
├── Header (固定顶部)
│   ├── 高度: 80px
│   ├── 内边距: 16px 24px
│   └── 背景: 白色 + 边框阴影
├── Main Content
│   ├── 最大宽度: 1280px (container-xl)
│   ├── 左右边距: 24px (spacing-6)
│   ├── 顶部间距: 32px (spacing-8)
│   └── 底部间距: 32px (spacing-8)
└── Footer (可选)
    ├── 高度: auto
    ├── 内边距: 48px 24px
    └── 背景: 白色/浅灰
```

**标准页面边距:**
```css
/* 移动端 */
.page-container {
  padding: 16px;  /* spacing-4 */
}

/* 平板及以上 */
@media (min-width: 768px) {
  .page-container {
    padding: 24px;  /* spacing-6 */
  }
}

/* 桌面端 */
@media (min-width: 1024px) {
  .page-container {
    padding: 32px;  /* spacing-8 */
  }
}
```

#### 管理端页面布局

```
结构：
├── Sidebar (固定左侧)
│   ├── 宽度: 280px (展开) / 80px (收起)
│   ├── 内边距: 24px 16px
│   └── 背景: 白色 + 边框
├── Main Area
│   ├── Header (固定顶部)
│   │   ├── 高度: 72px
│   │   ├── 内边距: 16px 24px
│   │   └── 背景: 白色 + 边框阴影
│   └── Content Area
│       ├── 左右边距: 24px (spacing-6)
│       ├── 顶部间距: 24px (spacing-6)
│       └── 底部间距: 24px (spacing-6)
```

**管理端内容区边距:**
```css
.admin-content {
  padding: 24px;  /* spacing-6 - 固定 */
  max-width: 100%; /* 占满剩余空间 */
}

/* 卡片网格间距 */
.admin-grid {
  gap: 24px;  /* spacing-6 */
}
```

### 7.4 Grid系统

```css
/* 标准Grid间距 */
--grid-gap-sm: 16px;   /* spacing-4 */
--grid-gap-md: 24px;   /* spacing-6 */
--grid-gap-lg: 32px;   /* spacing-8 */

/* 列数配置 */
--grid-cols-1: 1;
--grid-cols-2: 2;
--grid-cols-3: 3;
--grid-cols-4: 4;
--grid-cols-6: 6;
--grid-cols-12: 12;
```

响应式Grid示例：
```css
.grid-responsive {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;              /* 移动端: 1列 */
}

@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr); /* 平板: 2列 */
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(4, 1fr); /* 桌面: 4列 */
  }
}
```

---

## 8. 动画系统 (Animations)

### 8.1 过渡时间 (Transition Duration)

```css
--transition-fast: 150ms;    /* 按钮悬停、小交互 */
--transition-base: 200ms;    /* 标准交互 */
--transition-slow: 300ms;    /* 模态框、抽屉 */
--transition-slower: 500ms;  /* 页面切换 */
```

### 8.2 缓动函数 (Easing)

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### 8.3 常用动画

```css
/* 浮动效果 */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* 淡入 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 滑入 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 9. 组件规范

### 9.1 按钮 (Button)

```css
/* 尺寸 */
--btn-sm: padding: 8px 16px; font-size: 14px;
--btn-md: padding: 12px 24px; font-size: 16px;
--btn-lg: padding: 16px 32px; font-size: 18px;

/* 样式 */
Primary: gradient-primary + 白色文字 + shadow-soft
Secondary: 白色背景 + 边框 + primary文字
Outline: 透明背景 + 边框 + primary文字
Ghost: 透明背景 + primary文字
```

### 9.2 卡片 (Card)

```css
/* 标准卡片 */
background: 白色
border-radius: 12px (radius-lg)
padding: 24px (spacing-6)
box-shadow: shadow-soft
hover: shadow-medium

/* 交互卡片 */
transition: all 300ms ease-in-out
hover: transform: translateY(-4px)
```

### 9.3 输入框 (Input)

```css
height: 40px
padding: 8px 16px
border-radius: 8px (radius-md)
border: 1px solid var(--border)
focus: ring-2 ring-primary/20
```

### 9.4 徽章 (Badge)

```css
/* 状态徽章 */
已完成: bg-green-100 text-green-700 border-green-200
进行中: bg-blue-50 text-primary border-primary/20
未开始: bg-gray-50 text-gray-600 border-gray-200
警告: bg-yellow-50 text-yellow-700 border-yellow-200
错误: bg-red-50 text-red-700 border-red-200
```

---

## 10. 语义化Token

### 10.1 状态色彩

```css
/* 学习进度状态 */
--state-completed: #10b981 (绿色)
--state-in-progress: #3b82f6 (蓝色)
--state-not-started: #6b7280 (灰色)
--state-locked: #9ca3af (浅灰)

/* 考试状态 */
--exam-passed: #10b981 (绿色)
--exam-failed: #ef4444 (红色)
--exam-pending: #f59e0b (橙色)
--exam-ongoing: #3b82f6 (蓝色)
```

### 10.2 优先级

```css
--priority-high: #ef4444 (红色)
--priority-medium: #f59e0b (橙色)
--priority-low: #6b7280 (灰色)
```

---

## 11. 使用指南

### 11.1 颜色使用原则

1. **禁止使用紫色**: 除非用户明确要求，不使用紫色、靛蓝等紫罗兰色调
2. **对比度**: 确保文字与背景对比度至少4.5:1
3. **语义化**: 使用语义化颜色名称，不硬编码具体颜色值
4. **一致性**: 同类元素使用相同的颜色系统

### 11.2 间距使用原则

1. 使用8px基础单位
2. 优先使用预定义的spacing变量
3. 保持组件内部间距一致
4. 响应式调整间距大小

### 11.3 字体使用原则

1. 正文使用16px (text-base)
2. 标题层级清晰，不跳级使用
3. 行高确保阅读舒适
4. 移动端适当减小字号

---

## 12. 检查清单

设计实现时请检查：

- [ ] 使用了预定义的颜色变量
- [ ] 间距符合8px基础单位
- [ ] 圆角使用标准值
- [ ] 阴影应用恰当
- [ ] 响应式断点正确
- [ ] 动画过渡流畅
- [ ] 对比度符合规范
- [ ] 布局边距统一
- [ ] 组件尺寸标准化
- [ ] 无硬编码颜色值

---

**文档版本**: v1.0
**更新日期**: 2025-09-30
**维护团队**: 智涌AI前端团队