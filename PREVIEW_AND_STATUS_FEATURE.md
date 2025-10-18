# 📋 预览功能和状态显示说明

## 功能概述

在题库管理模块中添加了两个重要功能：
1. **题目预览功能** - 点击预览按钮查看题目完整信息
2. **题目状态显示** - 在列表中显示题目的启用/禁用状态

## 功能特性

### 1️⃣ 预览功能

#### 功能说明
- 点击题目列表中的"预览"按钮
- 弹出模态框显示题目的完整信息
- 支持关闭预览

#### 显示内容
- **题目基本信息**
  - 题目ID
  - 题型（单选、多选、判断、填空）
  - 难度（简单、中等、困难）
  - 级别
  - 状态（已启用/已禁用）

- **完整题干**
  - 显示题目的完整内容
  - 支持换行显示

- **选项**
  - 显示所有选项
  - 按 A、B、C、D 标记

- **答案**
  - 显示题目的正确答案
  - 蓝色背景突出显示

- **题目解析**
  - 显示题目的详细解析
  - 绿色背景突出显示

#### 使用方法
1. 在题目列表中找到要预览的题目
2. 点击该行的"预览"按钮
3. 弹出模态框显示题目详细信息
4. 点击"关闭"按钮或右上角的 X 关闭预览

### 2️⃣ 状态显示

#### 功能说明
- 在题目列表中新增"状态"列
- 显示题目的启用/禁用状态
- 使用颜色编码区分状态

#### 状态值
| 值 | 显示 | 颜色 |
|----|------|------|
| 1 | 已启用 | 🟢 绿色 |
| 0 | 已禁用 | 🔴 红色 |

#### 使用方法
- 在题目列表中查看"状态"列
- 绿色表示题目已启用
- 红色表示题目已禁用

## 技术实现

### 状态管理

```typescript
// 预览相关状态
const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
const [showPreview, setShowPreview] = useState(false);
```

### 核心函数

#### 1. handlePreview() - 打开预览

```typescript
const handlePreview = (question: Question) => {
  setPreviewQuestion(question);
  setShowPreview(true);
};
```

#### 2. handleClosePreview() - 关闭预览

```typescript
const handleClosePreview = () => {
  setShowPreview(false);
  setPreviewQuestion(null);
};
```

#### 3. getStatusLabel() - 获取状态标签

```typescript
const getStatusLabel = (status: number) => {
  return status === 1 ? '已启用' : '已禁用';
};
```

#### 4. getStatusColor() - 获取状态颜色

```typescript
const getStatusColor = (status: number) => {
  return status === 1 ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200';
};
```

#### 5. parseOptions() - 解析选项

```typescript
const parseOptions = (optionsStr: string | undefined) => {
  if (!optionsStr) return [];
  try {
    return JSON.parse(optionsStr);
  } catch {
    return [];
  }
};
```

### UI 组件

#### 预览模态框

```typescript
{showPreview && previewQuestion && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      {/* 模态框内容 */}
    </Card>
  </div>
)}
```

**特点：**
- 固定定位，覆盖整个屏幕
- 半透明黑色背景
- 最大宽度 2xl，最大高度 90vh
- 支持滚动

#### 状态列

```typescript
<td className="px-6 py-4">
  <Badge variant="outline" className={getStatusColor(question.status)}>
    {getStatusLabel(question.status)}
  </Badge>
</td>
```

## 数据结构

### Question 接口

```typescript
interface Question {
  question_id: string;      // 题目ID
  type: string;             // 题型
  stem: string;             // 题干
  difficulty: string;       // 难度
  level: string;            // 级别
  answer: string;           // 答案
  status: number;           // 状态（1=启用，0=禁用）
  options?: string;         // 选项（JSON字符串）
  analysis?: string;        // 解析
}
```

## 集成位置

### 文件位置
```
zhiyong-fronted/src/components/QuestionBankManagement.tsx
```

### 代码位置
- **导入** - 第 1-19 行（添加 X、Eye 图标）
- **接口定义** - 第 21-31 行（添加 options、analysis 字段）
- **状态定义** - 第 46-56 行（添加预览状态）
- **处理函数** - 第 116-153 行（预览和状态处理函数）
- **表格头部** - 第 258-268 行（添加状态列）
- **表格行** - 第 285-328 行（添加状态显示和预览按钮）
- **预览模态框** - 第 397-501 行（完整的预览模态框）

## 用户体验

### 优势

1. **完整信息展示** - 一次性查看题目的所有信息
2. **清晰的状态标识** - 快速了解题目的启用状态
3. **友好的界面** - 模态框设计简洁美观
4. **便捷的操作** - 一键打开预览，一键关闭
5. **响应式设计** - 适配不同屏幕尺寸

### 适用场景

- 查看题目的完整内容
- 验证题目的答案和解析
- 快速了解题目的启用状态
- 在编辑前预览题目信息

## 测试清单

- ✅ 点击预览按钮打开模态框
- ✅ 模态框显示题目基本信息
- ✅ 模态框显示完整题干
- ✅ 模态框显示选项（如果有）
- ✅ 模态框显示答案
- ✅ 模态框显示解析（如果有）
- ✅ 点击关闭按钮关闭模态框
- ✅ 点击 X 按钮关闭模态框
- ✅ 状态列显示题目状态
- ✅ 状态颜色正确（绿色=启用，红色=禁用）
- ✅ 模态框支持滚动
- ✅ 模态框响应式设计

## 性能考虑

- **模态框** - 使用 fixed 定位，不影响页面布局
- **状态管理** - 简单的状态管理，无额外开销
- **渲染性能** - 只在需要时渲染模态框
- **内存占用** - 预览数据存储在组件状态中

## 未来改进

- [ ] 支持在预览中编辑题目
- [ ] 支持在预览中删除题目
- [ ] 支持在预览中切换题目
- [ ] 支持导出题目为 PDF
- [ ] 支持打印题目

## 常见问题

### Q: 如何打开预览？
A: 在题目列表中点击该行的"预览"按钮

### Q: 预览中显示哪些信息？
A: 显示题目的所有信息，包括题干、选项、答案、解析

### Q: 如何关闭预览？
A: 点击"关闭"按钮或右上角的 X 按钮

### Q: 状态值是什么意思？
A: 1 表示已启用（绿色），0 表示已禁用（红色）

### Q: 预览中的选项如何显示？
A: 选项按 A、B、C、D 标记，每个选项占一行

### Q: 预览中的答案如何显示？
A: 答案显示在蓝色背景的框中

### Q: 预览中的解析如何显示？
A: 解析显示在绿色背景的框中

## 相关文档

- `QuestionBankManagement.tsx` - 完整组件代码
- `PAGE_JUMP_FEATURE.md` - 页码跳转功能说明
- `QUICK_REFERENCE.md` - 快速参考卡
- `FRONTEND_INTEGRATION_GUIDE.md` - 前端集成指南

---

**功能状态：** ✅ 已实现  
**最后更新：** 2025-10-18  
**版本：** 1.0.0

