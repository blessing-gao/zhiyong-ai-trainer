# API 快速参考卡片

## 🎯 题库管理 - 快速查询

### 题库操作
```
GET    /api/admin/question-banks              # 列表
POST   /api/admin/question-banks              # 创建
GET    /api/admin/question-banks/{id}         # 详情
PUT    /api/admin/question-banks/{id}         # 编辑
DELETE /api/admin/question-banks/{id}         # 删除
GET    /api/admin/question-banks/statistics   # 统计
```

### 题库导入导出
```
POST   /api/admin/question-banks/import       # 导入
GET    /api/admin/question-banks/{id}/export  # 导出
```

### 题目操作
```
GET    /api/admin/questions                   # 列表
POST   /api/admin/questions                   # 创建
GET    /api/admin/questions/{id}              # 详情
PUT    /api/admin/questions/{id}              # 编辑
DELETE /api/admin/questions/{id}              # 删除
```

---

## 🎓 考试管理 - 快速查询

### 考试操作
```
GET    /api/admin/exams                       # 列表
POST   /api/admin/exams                       # 创建
GET    /api/admin/exams/{id}                  # 详情
PUT    /api/admin/exams/{id}                  # 编辑
DELETE /api/admin/exams/{id}                  # 删除
GET    /api/admin/exams/statistics            # 统计
```

### 考试成绩
```
GET    /api/admin/exams/{id}/scores           # 成绩列表
GET    /api/admin/exams/{id}/export-scores    # 导出成绩
```

### 考试管理
```
GET    /api/admin/exams/{id}/monitor          # 监控
POST   /api/admin/exams/{id}/publish          # 发布
POST   /api/admin/exams/{id}/close            # 关闭
GET    /api/admin/exams/{id}/questions        # 题目列表
POST   /api/admin/exams/{id}/questions        # 添加题目
DELETE /api/admin/exams/{id}/questions/{qid}  # 移除题目
```

---

## 📊 仪表盘 - 快速查询

```
GET    /api/admin/dashboard/statistics        # 统计数据
```

---

## 🔄 常用请求示例

### 获取题库列表
```bash
curl -X GET "http://api.example.com/api/admin/question-banks?page=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 创建题库
```bash
curl -X POST "http://api.example.com/api/admin/question-banks" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "新题库",
    "category": "AI基础理论",
    "difficulty": "初级"
  }'
```

### 创建题目
```bash
curl -X POST "http://api.example.com/api/admin/questions" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bankId": 1,
    "question": "什么是机器学习？",
    "type": "single",
    "category": "AI基础理论",
    "difficulty": "easy",
    "options": ["选项A", "选项B", "选项C", "选项D"],
    "correctAnswer": 0,
    "analysis": "详细解析"
  }'
```

### 创建考试
```bash
curl -X POST "http://api.example.com/api/admin/exams" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AI训练师认证考试",
    "type": "formal",
    "date": "2024-04-15",
    "startTime": "09:00",
    "endTime": "11:00",
    "duration": 120,
    "totalScore": 100,
    "passingScore": 60,
    "questionCount": 100
  }'
```

### 获取考试成绩
```bash
curl -X GET "http://api.example.com/api/admin/exams/1/scores?page=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📋 请求参数速查

### 分页参数
```json
{
  "page": 1,           // 页码，从1开始
  "pageSize": 10       // 每页数量
}
```

### 题库筛选参数
```json
{
  "search": "关键词",
  "category": "AI基础理论",
  "difficulty": "easy|medium|hard"
}
```

### 题目筛选参数
```json
{
  "bankId": 1,
  "search": "关键词",
  "category": "AI基础理论",
  "difficulty": "easy|medium|hard",
  "type": "single|multiple|fill|essay"
}
```

### 考试筛选参数
```json
{
  "search": "关键词",
  "status": "pending|ongoing|ended",
  "type": "formal|simulation|practice"
}
```

---

## 📊 响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "success",
  "data": {
    // 具体数据
  }
}
```

### 列表响应
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "list": [
      { /* 数据项 */ }
    ]
  }
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "错误信息",
  "data": null
}
```

---

## 🎯 优先级速查

### 高优先级 ⭐⭐⭐ (第1-2周)
- 题库 CRUD
- 题目 CRUD
- 考试 CRUD
- 考试成绩查询
- 统计接口

### 中优先级 ⭐⭐ (第3-4周)
- 导入导出
- 考试监控
- 详情查询
- 题目管理

---

## 🔐 认证

所有接口都需要在请求头中包含 Bearer Token：

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📞 常见错误码

| 错误码 | 含义 | 解决方案 |
|--------|------|---------|
| 200 | 成功 | - |
| 400 | 请求参数错误 | 检查参数格式 |
| 401 | 未授权 | 检查 Token 是否有效 |
| 403 | 禁止访问 | 检查权限 |
| 404 | 资源不存在 | 检查 ID 是否正确 |
| 500 | 服务器错误 | 联系后端团队 |

---

## 💾 数据类型

### 难度等级
- `easy` - 简单
- `medium` - 中等
- `hard` - 困难

### 题目类型
- `single` - 单选题
- `multiple` - 多选题
- `fill` - 填空题
- `essay` - 简答题

### 考试类型
- `formal` - 正式考试
- `simulation` - 模拟考试
- `practice` - 练习测试

### 考试状态
- `pending` - 未开始
- `ongoing` - 进行中
- `ended` - 已结束

---

## 🚀 快速开始

1. **获取 Token**
   ```bash
   POST /api/auth/login
   ```

2. **查询题库**
   ```bash
   GET /api/admin/question-banks
   ```

3. **创建题库**
   ```bash
   POST /api/admin/question-banks
   ```

4. **创建题目**
   ```bash
   POST /api/admin/questions
   ```

5. **创建考试**
   ```bash
   POST /api/admin/exams
   ```

6. **发布考试**
   ```bash
   POST /api/admin/exams/{id}/publish
   ```

---

## 📚 完整文档

- 详细文档: `API_INTERFACE_DOCUMENTATION.md`
- 接口清单: `API_INTERFACE_DETAILED_LIST.md`
- OpenAPI 规范: `API_OPENAPI_SPEC.yaml`
- 文档总结: `API_DOCUMENTATION_SUMMARY.md`

---

**最后更新**: 2024-03-25  
**版本**: 1.0

