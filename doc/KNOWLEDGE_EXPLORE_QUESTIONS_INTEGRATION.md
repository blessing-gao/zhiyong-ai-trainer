# 知识探索页面 - 题目集成文档

## 功能概述

知识探索页面已集成题目查询功能。用户点击二级标签下的"学习"按钮时，系统会调用后端接口获取该二级标签下的所有题目，然后导航到答题页面进行练习。

## 页面流程

### 1. 页面初始化
- 加载所有一级标签
- 自动选中第一个一级标签
- 加载第一个一级标签下的所有二级标签

### 2. 用户交互
- 用户点击左侧一级标签
- 右侧显示该一级标签下的所有二级标签
- 用户点击二级标签下的"学习"按钮

### 3. 题目加载
- 前端调用 `questionApi.getQuestionsBySecondLevelTag(secondLevelTagId)`
- 显示加载状态（加载中...）
- 后端返回该二级标签下的所有题目

### 4. 导航到答题页面
- 题目加载完成后，导航到 `/training/chapter/{tagName}`
- 将题目数据通过 localStorage 和路由状态传递
- 答题页面可以使用这些数据进行练习

## 代码实现

### 导入

```typescript
import { tagApi, questionApi } from "@/services/api";
```

### 状态管理

```typescript
const [loadingSecondLevel, setLoadingSecondLevel] = useState(false);
```

### 处理函数

```typescript
const handleLearnClick = async (secondLevelTagId: number, tagName: string) => {
  try {
    setLoadingSecondLevel(true);
    // 调用 API 获取该二级标签下的所有题目
    const response: any = await questionApi.getQuestionsBySecondLevelTag(secondLevelTagId);
    if (response.code === 0 && response.data) {
      // 将题目数据存储到 localStorage，供 ChapterPractice 页面使用
      localStorage.setItem(`questions_${secondLevelTagId}`, JSON.stringify(response.data));
      // 导航到答题页面
      navigate(`/training/chapter/${tagName}`, { 
        state: { 
          secondLevelTagId,
          questions: response.data 
        } 
      });
    }
  } catch (error) {
    console.error("Failed to load questions:", error);
  } finally {
    setLoadingSecondLevel(false);
  }
};
```

### UI 更新

"学习"按钮现在显示加载状态：

```typescript
<Button
  onClick={() => handleLearnClick(Number(tag.id), tag.tagName)}
  disabled={loadingSecondLevel}
  className="ml-4 bg-primary hover:bg-primary-dark"
>
  {loadingSecondLevel ? (
    <>
      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      加载中...
    </>
  ) : (
    <>
      学习
      <ChevronRight className="h-4 w-4 ml-1" />
    </>
  )}
</Button>
```

## 数据流

```
用户点击"学习"按钮
    ↓
调用 handleLearnClick(secondLevelTagId, tagName)
    ↓
调用 questionApi.getQuestionsBySecondLevelTag(secondLevelTagId)
    ↓
后端返回题目列表
    ↓
存储到 localStorage: questions_{secondLevelTagId}
    ↓
导航到 /training/chapter/{tagName}
    ↓
ChapterPractice 页面从 localStorage 或路由状态获取题目
    ↓
显示答题卡和题目
```

## 错误处理

- 如果 API 调用失败，错误会被记录到控制台
- 加载状态会被重置，用户可以重新尝试
- 如果响应码不是 0，不会导航到答题页面

## 性能优化

- 使用 localStorage 缓存题目数据，避免重复加载
- 使用路由状态传递数据，便于页面间通信
- 加载状态管理，防止重复点击

## 集成点

### 与 ChapterPractice 页面的集成

ChapterPractice 页面可以通过以下方式获取题目数据：

```typescript
// 从路由状态获取
const location = useLocation();
const { questions, secondLevelTagId } = location.state || {};

// 或从 localStorage 获取
const cachedQuestions = localStorage.getItem(`questions_${secondLevelTagId}`);
```

## 测试步骤

1. 访问 `http://localhost:8080/training/knowledge-explore`
2. 等待页面加载一级标签
3. 点击左侧一级标签
4. 等待右侧加载二级标签
5. 点击二级标签下的"学习"按钮
6. 观察加载状态
7. 等待导航到答题页面
8. 验证题目数据是否正确加载

## 注意事项

- 确保后端服务器正在运行
- 确保 API 端点 `/api/questions/by-second-level-tag/{secondLevelTagId}` 可用
- 确保题目数据已正确绑定到二级标签
- 浏览器控制台可以查看详细的错误信息

