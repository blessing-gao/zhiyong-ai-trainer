# 前后端对接完成指南

## 📋 项目概述

本文档记录了智涌平台前端与后端题库管理模块的对接工作。

## ✅ 完成的工作

### 1. 后端 API 集成

#### 创建 API 服务层 (`src/services/api.ts`)
- 统一的 API 请求函数
- 题库相关 API 接口封装
  - `getQuestionsByPage()` - 分页查询题目
  - `getQuestionDetail()` - 获取题目详情
  - `createQuestion()` - 创建题目
  - `updateQuestion()` - 更新题目
  - `deleteQuestion()` - 删除题目
- 题型和标签相关 API 接口

### 2. 前端组件开发

#### 创建题库管理组件 (`src/components/QuestionBankManagement.tsx`)
- 完整的题库列表展示
- 分页功能
  - 上一页/下一页导航
  - 每页数量选择 (10/20/50)
  - 当前页码和总页数显示
- 题目信息展示
  - 题目 ID
  - 题目内容（题干）
  - 题型（单选、多选、判断等）
  - 难度等级（简单、中等、困难）
  - 题目级别
- 加载状态处理
- 错误提示
- 操作按钮（编辑、预览、删除）

### 3. 管理员界面集成

#### 修改 AdminDashboard 页面
- 导入 `QuestionBankManagement` 组件
- 替换原有的假数据题库管理
- 删除硬编码的 `questionBanks` 数据

## 🔌 API 对接详情

### 后端 API 端点

```
GET /api/questions/page?page=1&pageSize=10
```

**请求参数：**
- `page` (number): 页码，从 1 开始
- `pageSize` (number): 每页数量

**响应格式：**
```json
{
  "code": 0,
  "msg": null,
  "data": {
    "current": "1",
    "size": "10",
    "total": "1146",
    "pages": "115",
    "records": [
      {
        "question_id": "1",
        "type": "judge",
        "stem": "题目内容...",
        "difficulty": "easy",
        "level": "level4",
        "answer": "B",
        "status": 1
      }
    ],
    "has_next": true,
    "has_previous": false
  }
}
```

## 📊 数据展示

### 题目列表显示的字段

| 字段 | 说明 | 来源 |
|------|------|------|
| question_id | 题目唯一标识 | 后端 |
| stem | 题目内容 | 后端 |
| type | 题型 | 后端 |
| difficulty | 难度等级 | 后端 |
| level | 题目级别 | 后端 |
| answer | 正确答案 | 后端 |

### 题型映射

| 后端值 | 前端显示 |
|--------|---------|
| single | 单选题 |
| multiple | 多选题 |
| judge | 判断题 |
| fill | 填空题 |

### 难度映射

| 后端值 | 前端显示 | 颜色 |
|--------|---------|------|
| easy | 简单 | 绿色 |
| medium | 中等 | 黄色 |
| hard | 困难 | 红色 |

## 🚀 运行方式

### 启动后端服务
```bash
cd zhiyong-backend
mvn spring-boot:run
```
后端运行在 `http://localhost:8081`

### 启动前端开发服务器
```bash
cd zhiyong-fronted
npm run dev
```
前端运行在 `http://localhost:8082`

### 访问管理员界面
1. 打开浏览器访问 `http://localhost:8082`
2. 登录管理员账户
3. 点击左侧菜单 "题库管理"
4. 查看题目列表

## 📝 功能说明

### 分页查询
- 默认每页显示 10 条题目
- 支持切换每页数量（10/20/50）
- 显示当前页码和总页数
- 上一页/下一页按钮自动禁用

### 题目信息展示
- 题目 ID：唯一标识
- 题目内容：题干信息（超长时截断显示）
- 题型：以 Badge 形式显示
- 难度：以彩色 Badge 形式显示
- 级别：题目所属级别

### 操作按钮
- 编辑：编辑题目（待实现）
- 预览：预览题目详情（待实现）
- 删除：删除题目（待实现）

## 🔄 数据流

```
前端 UI
  ↓
QuestionBankManagement 组件
  ↓
API 服务层 (src/services/api.ts)
  ↓
HTTP 请求 (GET /api/questions/page)
  ↓
后端 API (Spring Boot)
  ↓
数据库查询
  ↓
返回分页数据
  ↓
前端渲染表格
```

## 🎯 后续功能规划

### 已完成
- ✅ 分页查询接口对接
- ✅ 题目列表展示
- ✅ 分页导航

### 待实现
- [ ] 题目详情页面
- [ ] 编辑题目功能
- [ ] 删除题目功能
- [ ] 搜索和筛选功能
- [ ] 批量导入/导出
- [ ] 题目统计信息

## 🐛 故障排除

### 问题：前端无法连接后端
**解决方案：**
1. 确保后端服务运行在 `http://localhost:8081`
2. 检查浏览器控制台是否有 CORS 错误
3. 确保后端允许跨域请求

### 问题：题目列表为空
**解决方案：**
1. 检查数据库中是否有题目数据
2. 查看浏览器控制台是否有错误信息
3. 检查后端日志是否有异常

### 问题：分页不工作
**解决方案：**
1. 检查 API 响应中的 `pages` 字段
2. 确保 `page` 参数在有效范围内
3. 查看浏览器控制台的网络请求

## 📞 技术支持

如有问题，请检查：
1. 后端日志：`zhiyong-backend/logs/`
2. 浏览器控制台：F12 → Console
3. 网络请求：F12 → Network

## 📚 相关文件

- 后端 API 文档：`zhiyong-backend/PAGINATION_API_GUIDE.md`
- 前端 API 服务：`zhiyong-fronted/src/services/api.ts`
- 题库管理组件：`zhiyong-fronted/src/components/QuestionBankManagement.tsx`
- 管理员页面：`zhiyong-fronted/src/pages/AdminDashboard.tsx`

