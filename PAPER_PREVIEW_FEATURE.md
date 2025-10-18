# 试卷管理 - 预览功能

## 📋 功能概述

在试卷管理页面的试卷列表中，每份试卷都新增了一个"预览"按钮（眼睛图标），点击可以查看试卷的完整详情，包括：
- 试卷基本信息
- 题型比例分布
- 知识点比例分布
- 试卷中的所有题目及其详细信息

## 🎯 功能特性

### 1. 预览按钮
- **位置**: 试卷列表操作列的第一个按钮
- **图标**: 眼睛图标 (Eye)
- **样式**: 灰色outline按钮
- **功能**: 点击打开试卷预览对话框

### 2. 预览对话框

#### 对话框样式
- **大小**: 最大宽度1024px (max-w-4xl)
- **高度**: 最大90vh，超出时滚动
- **背景**: 半透明黑色50%
- **卡片**: 圆角白色卡片

#### 对话框内容

##### 试卷基本信息
显示以下字段：
- **试卷类型**: 正式考试卷/练习卷/模拟卷
- **试卷总分**: 数字显示
- **及格分数**: 数字显示
- **考试时长**: 分钟数
- **试卷说明**: 可选，如果有则显示

##### 题型比例
以卡片形式展示三种题型的比例：
- **判断题**: 蓝色背景，显示百分比
- **单选题**: 绿色背景，显示百分比
- **多选题**: 紫色背景，显示百分比

##### 知识点比例
以网格形式展示所有知识点的比例：
- 每个知识点一个卡片
- 显示知识点ID和对应比例
- 灰色背景

##### 试卷题目
显示试卷中的所有题目，每题包含：

**题目头部**:
- 题号 (第1题、第2题等)
- 题型标签 (判断题/单选题/多选题)
- 难度标签 (如果有)

**题干**:
- 完整的题目文本

**选项**:
- 以A、B、C、D等标记的选项列表
- 每个选项占一行

**答案和解析**:
- 标准答案 (蓝色显示)
- 题目解析 (如果有)

### 3. 加载状态

#### 加载中
- 显示加载动画和"加载试卷详情中..."文本
- 禁用关闭按钮

#### 加载完成
- 显示完整的试卷信息和题目列表

#### 加载失败
- 显示红色错误提示
- 显示具体的错误信息

### 4. 数据流程

```
用户点击预览按钮
    ↓
调用 getPaperDetail(paperId) 获取试卷详情
    ↓
解析试卷中的 questionsJson (题目ID数组)
    ↓
逐个调用 getQuestionDetail(questionId) 获取每题详情
    ↓
显示完整的试卷预览
```

## 📊 API 集成

### 获取试卷详情

**端点**: `GET /api/papers/{paperId}`

**响应**:
```typescript
{
  code: 0;
  data: {
    id: number;
    name: string;
    description: string;
    type: string;
    totalScore: number;
    passScore: number;
    duration: number;
    questionCount: number;
    typeRatio: string;        // JSON格式
    knowledgeRatio: string;   // JSON格式
    questionsJson: string;    // 题目ID数组，JSON格式
    status: number;
    // ... 其他字段
  };
}
```

### 获取题目详情

**端点**: `GET /api/questions/{questionId}`

**响应**:
```typescript
{
  code: 0;
  data: {
    question_id: number;
    type: string;             // judge/single/multiple
    stem: string;             // 题干
    options: string;          // JSON格式的选项数组
    answer: string;           // 标准答案
    difficulty: string;       // 难度
    level: string;            // 技能等级
    analysis: string;         // 题目解析
    status: number;
    // ... 其他字段
  };
}
```

## 🎨 UI/UX 设计

### 颜色方案
- **判断题**: 蓝色 (#3B82F6)
- **单选题**: 绿色 (#10B981)
- **多选题**: 紫色 (#A855F7)
- **知识点**: 灰色 (#F3F4F6)
- **错误**: 红色 (#EF4444)

### 响应式设计
- **大屏幕**: 4列网格显示知识点比例
- **中屏幕**: 2列网格显示知识点比例
- **小屏幕**: 自动调整

### 交互反馈
- 按钮悬停时显示提示文本 "预览试卷"
- 加载中显示动画
- 错误时显示红色提示
- 成功加载后显示完整内容

## 🔧 技术实现

### 前端组件
- **PaperManagement.tsx**: 主组件
  - 管理预览对话框状态
  - 处理数据加载
  - 渲染预览UI

### 状态管理
```typescript
// 预览相关状态
showPreviewDialog: boolean;           // 对话框显示状态
previewPaper: PaperDetail | null;     // 试卷详情
previewQuestions: Question[];         // 题目列表
previewLoading: boolean;              // 加载状态
previewError: string | null;          // 错误信息
```

### 关键函数
- `handleOpenPreview(paperId)`: 打开预览，加载数据
- `handleClosePreview()`: 关闭预览，清空数据

### API 调用
```typescript
// 获取试卷详情
const response = await paperApi.getPaperDetail(paperId);

// 获取题目详情
const qResponse = await paperApi.getQuestionDetail(questionId);
```

## 📱 使用流程

### 步骤1: 打开预览
1. 在试卷列表中找到要预览的试卷
2. 点击操作列中的眼睛图标

### 步骤2: 等待加载
1. 对话框打开
2. 显示加载动画
3. 后端返回试卷详情和题目信息

### 步骤3: 查看试卷信息
1. 查看试卷基本信息
2. 查看题型比例分布
3. 查看知识点比例分布

### 步骤4: 查看题目
1. 滚动查看所有题目
2. 每题显示题干、选项、答案、解析
3. 可以逐题查看详细信息

### 步骤5: 关闭预览
1. 点击"关闭"按钮
2. 或点击X按钮
3. 对话框关闭，数据清空

## ✅ 验收清单

- [x] 预览按钮已添加到操作列
- [x] 预览对话框已实现
- [x] 试卷基本信息显示
- [x] 题型比例显示
- [x] 知识点比例显示
- [x] 题目列表显示
- [x] 题目详情显示 (题干、选项、答案、解析)
- [x] 加载状态显示
- [x] 错误处理
- [x] 前端编译成功

## 🚀 后续优化

### 短期优化
- [ ] 添加题目搜索功能
- [ ] 添加题目筛选功能
- [ ] 支持按题型筛选题目

### 中期优化
- [ ] 支持打印试卷
- [ ] 支持导出试卷为PDF
- [ ] 支持题目详情展开/收起

### 长期优化
- [ ] 支持试卷对比
- [ ] 支持试卷统计分析
- [ ] 支持试卷评论

## 📝 相关文档

- [试卷创建功能](./PAPER_CREATION_FEATURE.md)
- [试卷创建测试指南](./PAPER_CREATION_TESTING.md)
- [后端API文档](../zhiyong-backend/doc/PAPER_GENERATION_API.md)

## 🎓 开发者指南

### 修改预览样式
编辑预览对话框的Tailwind CSS类名

### 修改显示字段
编辑预览对话框中的字段显示逻辑

### 修改API调用
编辑 `handleOpenPreview()` 函数中的API调用

### 添加新功能
在预览对话框中添加新的功能按钮或操作

---

**功能完成时间**: 2025-10-18  
**版本**: 1.0  
**状态**: ✅ 完成

