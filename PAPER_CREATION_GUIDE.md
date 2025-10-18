# 试卷创建功能前端集成指南

## 1. 功能概述

试卷创建功能允许管理员通过配置试卷基本信息和组卷规则，自动从题库中智能抽题生成试卷。

## 2. 核心流程

```
用户输入试卷信息 → 配置题型比例 → 配置知识点比例 → 生成试卷 → 显示结果
```

## 3. 前端参数设计

### 3.1 试卷基本信息

```typescript
interface PaperBasicInfo {
  name: string;              // 试卷名称
  description?: string;      // 试卷说明
  type: 'exam' | 'practice' | 'mock';  // 试卷类型
  totalScore: number;        // 试卷总分
  passScore: number;         // 及格分数
  duration: number;          // 考试时长（分钟）
  questionCount: number;     // 题目总数
}
```

### 3.2 题型比例配置

```typescript
interface TypeRatio {
  judge: number;    // 判断题比例 (0-100)
  single: number;   // 单选题比例 (0-100)
  multiple: number; // 多选题比例 (0-100)
  // 注意：三个比例之和必须等于 100
}
```

**题型说明**:
- `judge`: 判断题（是非题）
- `single`: 单选题（单项选择题）
- `multiple`: 多选题（多项选择题）

### 3.3 知识点比例配置

```typescript
interface KnowledgeRatio {
  [firstLevelTagId: number]: number;  // 一级知识点ID -> 比例
  // 示例: { 1: 20, 2: 20, 3: 20, 4: 20, 5: 20 }
  // 注意：所有比例之和必须等于 100
}
```

## 4. 前端UI组件设计

### 4.1 试卷创建表单

```typescript
// 表单字段
- 试卷名称 (text input)
- 试卷说明 (textarea)
- 试卷类型 (select: exam/practice/mock)
- 试卷总分 (number input)
- 及格分数 (number input)
- 考试时长 (number input, 单位：分钟)
- 题目总数 (number input)
```

### 4.2 题型比例配置组件

```typescript
// 使用滑块或输入框配置
- 判断题比例: [slider/input] %
- 单选题比例: [slider/input] %
- 多选题比例: [slider/input] % (自动计算)

// 实时显示
- 总比例: 100% (必须)
- 各题型数量预览:
  - 判断题: X 道
  - 单选题: Y 道
  - 多选题: Z 道
```

### 4.3 知识点比例配置组件

```typescript
// 显示所有一级知识点
- 知识点1: [slider/input] %
- 知识点2: [slider/input] %
- 知识点3: [slider/input] %
- ...

// 实时显示
- 总比例: 100% (必须)
- 均匀分配按钮 (快速设置)
```

## 5. 前端验证规则

### 5.1 试卷基本信息验证

```typescript
function validateBasicInfo(info: PaperBasicInfo): string[] {
  const errors: string[] = [];

  if (!info.name || info.name.trim() === '') {
    errors.push('试卷名称不能为空');
  }

  if (info.totalScore <= 0) {
    errors.push('试卷总分必须大于0');
  }

  if (info.passScore <= 0) {
    errors.push('及格分数必须大于0');
  }

  if (info.passScore > info.totalScore) {
    errors.push('及格分数不能大于试卷总分');
  }

  if (info.duration <= 0) {
    errors.push('考试时长必须大于0');
  }

  if (info.questionCount <= 0) {
    errors.push('题目总数必须大于0');
  }

  return errors;
}
```

### 5.2 题型比例验证

```typescript
function validateTypeRatio(ratio: TypeRatio): string[] {
  const errors: string[] = [];
  const total = ratio.judge + ratio.single + ratio.multiple;

  if (total !== 100) {
    errors.push(`题型比例之和必须等于100，当前为: ${total}`);
  }

  if (ratio.judge < 0 || ratio.single < 0 || ratio.multiple < 0) {
    errors.push('题型比例不能为负数');
  }

  return errors;
}
```

### 5.3 知识点比例验证

```typescript
function validateKnowledgeRatio(ratio: KnowledgeRatio): string[] {
  const errors: string[] = [];
  const total = Object.values(ratio).reduce((sum, val) => sum + val, 0);

  if (total !== 100) {
    errors.push(`知识点比例之和必须等于100，当前为: ${total}`);
  }

  for (const [key, value] of Object.entries(ratio)) {
    if (value < 0) {
      errors.push(`知识点 ${key} 的比例不能为负数`);
    }
  }

  return errors;
}
```

## 6. 前端API调用

### 6.1 创建试卷API

```typescript
// 在 api.ts 中添加
export const paperApi = {
  createPaper: async (request: CreatePaperRequest) => {
    return apiRequest('/api/papers', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }
};
```

### 6.2 获取一级知识点列表

```typescript
// 需要实现的API
export const tagApi = {
  getFirstLevelTags: async () => {
    return apiRequest('/api/tags/first-level');
  }
};
```

## 7. 前端交互流程

### 7.1 页面加载

```typescript
useEffect(() => {
  // 1. 加载一级知识点列表
  const tags = await tagApi.getFirstLevelTags();
  setFirstLevelTags(tags);

  // 2. 初始化知识点比例（均匀分配）
  const ratio = {};
  const percentPerTag = 100 / tags.length;
  tags.forEach(tag => {
    ratio[tag.id] = Math.round(percentPerTag);
  });
  setKnowledgeRatio(ratio);
}, []);
```

### 7.2 题型比例变化处理

```typescript
function handleTypeRatioChange(type: string, value: number) {
  const newRatio = { ...typeRatio, [type]: value };

  // 自动调整其他比例
  if (type === 'judge') {
    // 用户调整判断题，其他两个自动调整
    const remaining = 100 - value;
    newRatio.single = Math.round(remaining * 0.7);
    newRatio.multiple = remaining - newRatio.single;
  }

  setTypeRatio(newRatio);
  updateQuestionCountPreview();
}
```

### 7.3 生成试卷

```typescript
async function handleCreatePaper() {
  // 1. 验证所有参数
  const basicErrors = validateBasicInfo(basicInfo);
  const typeErrors = validateTypeRatio(typeRatio);
  const knowledgeErrors = validateKnowledgeRatio(knowledgeRatio);

  if (basicErrors.length > 0 || typeErrors.length > 0 || knowledgeErrors.length > 0) {
    showErrors([...basicErrors, ...typeErrors, ...knowledgeErrors]);
    return;
  }

  // 2. 构建请求
  const request: CreatePaperRequest = {
    ...basicInfo,
    typeRatio,
    knowledgeRatio
  };

  // 3. 调用API
  try {
    setLoading(true);
    const paper = await paperApi.createPaper(request);
    showSuccess('试卷创建成功');
    navigateToPaperDetail(paper.id);
  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
}
```

## 8. 数据流示例

### 8.1 完整请求示例

```json
{
  "name": "高考数学模拟卷",
  "description": "2025年高考数学模拟卷",
  "type": "exam",
  "totalScore": 150,
  "passScore": 90,
  "duration": 120,
  "questionCount": 100,
  "typeRatio": {
    "judge": 20,
    "single": 70,
    "multiple": 10
  },
  "knowledgeRatio": {
    "1": 20,
    "2": 20,
    "3": 20,
    "4": 20,
    "5": 20
  }
}
```

### 8.2 完整响应示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "name": "高考数学模拟卷",
    "description": "2025年高考数学模拟卷",
    "type": "exam",
    "totalScore": 150,
    "passScore": 90,
    "duration": 120,
    "questionCount": 100,
    "knowledgeRatio": "{\"1\":20,\"2\":20,\"3\":20,\"4\":20,\"5\":20}",
    "typeRatio": "{\"judge\":20,\"single\":70,\"multiple\":10}",
    "questionsJson": "[1,2,3,...,100]",
    "status": 0,
    "createdBy": 1,
    "updaterBy": 1,
    "createdAt": "2025-10-18T10:30:00",
    "updatedAt": "2025-10-18T10:30:00"
  }
}
```

## 9. 错误处理

### 9.1 常见错误处理

```typescript
function handleApiError(error: any) {
  const errorCode = error.code;
  const errorMessage = error.message;

  switch (errorCode) {
    case 'PAPER_INVALID_PARAMETER':
      showError(`参数错误: ${errorMessage}`);
      break;
    case 'PAPER_INCOMPLETE':
      showError(`组卷失败: ${errorMessage}`);
      break;
    default:
      showError(`创建失败: ${errorMessage}`);
  }
}
```

## 10. 快速参考

### 10.1 常用配置模板

#### 模板1：标准高考卷
```typescript
{
  type: 'exam',
  totalScore: 150,
  passScore: 90,
  duration: 120,
  questionCount: 100,
  typeRatio: { judge: 20, single: 70, multiple: 10 },
  knowledgeRatio: { 1: 20, 2: 20, 3: 20, 4: 20, 5: 20 }
}
```

#### 模板2：练习卷
```typescript
{
  type: 'practice',
  totalScore: 100,
  passScore: 60,
  duration: 60,
  questionCount: 50,
  typeRatio: { judge: 30, single: 50, multiple: 20 },
  knowledgeRatio: { 1: 25, 2: 25, 3: 25, 4: 25 }
}
```

#### 模板3：模拟卷
```typescript
{
  type: 'mock',
  totalScore: 120,
  passScore: 72,
  duration: 90,
  questionCount: 80,
  typeRatio: { judge: 25, single: 60, multiple: 15 },
  knowledgeRatio: { 1: 20, 2: 20, 3: 20, 4: 20, 5: 20 }
}
```

## 11. 相关文档

- [后端组卷API文档](./doc/PAPER_GENERATION_API.md)
- [试卷管理模块设计](./doc/PAPER_DOMAIN_DESIGN.md)
- [题库管理模块设计](./doc/QUESTION_MODULE_DESIGN.md)

