# 🚀 快速参考卡

## 启动命令

### 后端
```bash
cd zhiyong-backend
mvn spring-boot:run
# 运行在 http://localhost:8081
```

### 前端
```bash
cd zhiyong-fronted
npm run dev
# 运行在 http://localhost:8082
```

## 访问应用

1. 打开浏览器：`http://localhost:8082`
2. 登录管理员账户
3. 点击左侧菜单 "题库管理"
4. 查看题目列表

## API 端点

### 分页查询题目
```
GET /api/questions/page?page=1&pageSize=10
```

**参数：**
- `page` - 页码（从1开始）
- `pageSize` - 每页数量

**响应：**
```json
{
  "code": 0,
  "data": {
    "current": "1",
    "size": "10",
    "total": "1146",
    "pages": "115",
    "records": [...]
  }
}
```

## 关键文件

### 前端代码
- `src/services/api.ts` - API 服务层
- `src/components/QuestionBankManagement.tsx` - 题库管理组件
- `src/pages/AdminDashboard.tsx` - 管理员页面

### 文档
- `FRONTEND_INTEGRATION_GUIDE.md` - 完整指南
- `QUICK_TEST_GUIDE.md` - 测试指南
- `INTEGRATION_COMPLETE.md` - 完成报告

## 数据统计

| 指标 | 值 |
|------|-----|
| 总题目数 | 1,146 |
| 总页数（每页10条） | 115 |
| 总页数（每页20条） | 58 |
| 总页数（每页50条） | 23 |

## 题型映射

| 后端值 | 前端显示 |
|--------|---------|
| single | 单选题 |
| multiple | 多选题 |
| judge | 判断题 |
| fill | 填空题 |

## 难度映射

| 后端值 | 前端显示 | 颜色 |
|--------|---------|------|
| easy | 简单 | 🟢 绿色 |
| medium | 中等 | 🟡 黄色 |
| hard | 困难 | 🔴 红色 |

## 功能清单

### 已实现
- ✅ 分页查询
- ✅ 题目列表展示
- ✅ 分页导航
- ✅ 每页数量切换
- ✅ 加载状态显示
- ✅ 错误提示

### 待实现
- ⏳ 题目详情
- ⏳ 编辑功能
- ⏳ 删除功能
- ⏳ 搜索功能
- ⏳ 筛选功能

## 测试 API

```bash
# 测试分页查询
curl "http://localhost:8081/api/questions/page?page=1&pageSize=5" | jq '.'

# 查看题目数量
curl "http://localhost:8081/api/questions/page?page=1&pageSize=1" | jq '.data.total'

# 查看总页数
curl "http://localhost:8081/api/questions/page?page=1&pageSize=1" | jq '.data.pages'
```

## 浏览器开发者工具

### 打开
- Windows/Linux: `F12` 或 `Ctrl+Shift+I`
- Mac: `Cmd+Option+I`

### 检查网络请求
1. 点击 "Network" 标签
2. 刷新页面
3. 查找 `page?page=1&pageSize=10` 请求
4. 验证状态码为 200

### 检查控制台
1. 点击 "Console" 标签
2. 验证没有红色错误

## 常见问题

### 题目列表为空
- 检查后端是否运行
- 检查浏览器控制台错误
- 检查网络请求状态

### 分页不工作
- 刷新页面
- 检查浏览器控制台
- 查看网络请求

### CORS 错误
- 确保后端允许跨域
- 检查请求头

## 性能指标

| 指标 | 值 |
|------|-----|
| 首次加载 | < 2 秒 |
| 分页切换 | < 500 毫秒 |
| API 响应 | < 100 毫秒 |

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI

### 后端
- Spring Boot 3.5.0
- MyBatis-Plus 3.5.10
- MySQL 8.0
- Druid 连接池

## 项目状态

🟢 **运行中** - 所有功能正常工作

---

**最后更新：** 2025-10-18

