# 知识探索页面实现文档

## 功能概述

知识探索页面 (`/training/knowledge-explore`) 已实现为二级树结构，支持：
1. 加载并显示所有一级标签（知识体系）
2. 点击一级标签时，加载并显示对应的二级标签
3. 点击二级标签的"学习"按钮，导航到对应的学习页面

## 页面布局

### 左侧面板（知识体系导航）
- 显示所有一级标签列表
- 点击一级标签时，该标签高亮显示（背景色变为主题色）
- 显示一级标签的名称和描述

### 右侧面板（二级标签详情）
- 显示选中一级标签的名称和描述
- 显示该一级标签下的所有二级标签
- 每个二级标签显示名称、描述和"学习"按钮
- 加载中时显示加载动画

## 后端 API

### 1. 获取所有一级标签
**端点**: `GET /api/tags/first-level`

**响应示例**:
```json
{
  "code": 0,
  "msg": null,
  "data": [
    {
      "id": "1",
      "tagName": "职业道德与法律法规",
      "tagCode": "ETHICS_LAW",
      "description": "人工智能训练师职业道德规范、法律法规、知识产权等相关内容",
      "sortOrder": null
    }
  ]
}
```

### 2. 根据一级标签ID获取二级标签
**端点**: `GET /api/tags/second-level/{firstLevelId}`

**响应示例**:
```json
{
  "code": 0,
  "msg": null,
  "data": [
    {
      "id": "1",
      "tagName": "职业道德",
      "tagCode": "PROFESSIONAL_ETHICS",
      "description": "人工智能训练师职业道德规范和行为准则",
      "sortOrder": 1
    }
  ]
}
```

## 前端实现

### 文件修改

#### 1. `zhiyong-fronted/src/pages/KnowledgeExplore.tsx`
- 移除了硬编码的知识体系数据
- 添加了 `FirstLevelTag` 和 `SecondLevelTag` 接口定义
- 实现了 `loadFirstLevelTags()` 函数，在组件挂载时加载一级标签
- 实现了 `loadSecondLevelTags()` 函数，根据一级标签ID加载二级标签
- 实现了 `handleFirstLevelClick()` 函数，处理一级标签点击事件
- 更新了 JSX 以显示真实的后端数据

#### 2. `zhiyong-fronted/src/services/api.ts`
- 更新了 `tagApi.getSecondLevelTags()` 方法，使用路径参数而不是查询参数
- 方法签名: `getSecondLevelTags(firstLevelId: number)`

### 数据流

1. **页面加载**
   - 组件挂载时，调用 `loadFirstLevelTags()`
   - 获取所有一级标签并存储到 `firstLevelTags` 状态
   - 自动选中第一个一级标签，并加载其二级标签

2. **用户交互**
   - 用户点击左侧一级标签
   - 调用 `handleFirstLevelClick()`
   - 更新 `selectedFirstLevelId` 状态
   - 调用 `loadSecondLevelTags()` 加载对应的二级标签
   - 右侧面板更新显示新的二级标签列表

3. **学习导航**
   - 用户点击二级标签的"学习"按钮
   - 导航到 `/training/chapter/{tagName}` 页面

## 状态管理

```typescript
// 一级标签列表
const [firstLevelTags, setFirstLevelTags] = useState<FirstLevelTag[]>([]);

// 二级标签列表
const [secondLevelTags, setSecondLevelTags] = useState<SecondLevelTag[]>([]);

// 当前选中的一级标签ID
const [selectedFirstLevelId, setSelectedFirstLevelId] = useState<number | null>(null);

// 一级标签加载状态
const [loading, setLoading] = useState(true);

// 二级标签加载状态
const [loadingSecondLevel, setLoadingSecondLevel] = useState(false);
```

## 样式特点

- 响应式设计：左侧占1列，右侧占3列（md及以上屏幕）
- 粘性定位：左侧导航栏在滚动时保持可见
- 悬停效果：卡片和按钮有悬停动画
- 加载状态：显示加载动画和提示文本
- 空状态：当没有二级标签时显示提示信息

## 测试

### 测试步骤

1. 访问 `http://localhost:8080/training/knowledge-explore`
2. 验证左侧显示所有一级标签
3. 验证右侧显示第一个一级标签的二级标签
4. 点击不同的一级标签，验证右侧内容更新
5. 点击"学习"按钮，验证导航到学习页面

### 预期结果

- 页面加载时显示加载动画
- 一级标签正确显示
- 点击一级标签时，二级标签列表正确更新
- 没有控制台错误

## 注意事项

- 后端返回的字段名为驼峰式（如 `tagName`、`tagCode`），前端接口定义已相应调整
- ID 字段可能是字符串或数字，前端已处理类型转换
- 所有 API 调用都包含错误处理和加载状态管理

