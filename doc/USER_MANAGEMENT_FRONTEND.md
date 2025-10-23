# 前端用户管理模块文档

## 概述

前端用户管理模块已完全集成后端 API，提供了完整的用户管理界面，包括用户列表查询、搜索、状态筛选、禁用/启用用户等功能。

## 文件结构

### 核心文件

1. **src/components/UserManagement.tsx**
   - 用户管理主组件
   - 负责用户列表的展示、搜索、分页、禁用/启用等操作

2. **src/services/api.ts**
   - API 服务层
   - 包含 `userApi` 对象，提供所有用户管理相关的 API 调用

3. **src/pages/AdminDashboard.tsx**
   - 管理员仪表板
   - 集成了 UserManagement 组件

## 功能特性

### 1. 用户列表查询
- 分页显示用户列表
- 显示用户信息：用户名、邮箱、真实姓名、注册时间、状态
- 支持分页导航（上一页/下一页）

### 2. 用户搜索
- 按用户名搜索（模糊查询）
- 按状态筛选（启用/禁用/全部）
- 支持回车键快速搜索

### 3. 用户状态管理
- 显示用户当前状态（启用/禁用）
- 一键禁用用户
- 一键启用用户
- 实时更新用户列表

### 4. 用户操作
- 查看用户详情（预留功能）
- 禁用/启用用户账户
- 操作后自动刷新列表

## API 集成

### userApi 对象

```typescript
export const userApi = {
  // 分页查询用户
  pageUsers: async (data: {
    page?: number;
    pageSize?: number;
    username?: string;
    realName?: string;
    email?: string;
    phone?: string;
    status?: number;
    sortBy?: string;
    sortOrder?: string;
  }) => { ... },

  // 添加用户
  addUser: async (data: { ... }) => { ... },

  // 获取用户详情
  getUserDetail: async (userId: number) => { ... },

  // 禁用用户
  disableUser: async (userId: number) => { ... },

  // 启用用户
  enableUser: async (userId: number) => { ... },
};
```

## 组件状态管理

### 主要状态变量

```typescript
const [users, setUsers] = useState<User[]>([]);           // 用户列表
const [loading, setLoading] = useState(false);            // 加载状态
const [currentPage, setCurrentPage] = useState(1);        // 当前页码
const [pageSize, setPageSize] = useState(10);             // 每页数量
const [totalPages, setTotalPages] = useState(0);          // 总页数
const [totalCount, setTotalCount] = useState(0);          // 总记录数
const [searchTerm, setSearchTerm] = useState("");          // 搜索词
const [statusFilter, setStatusFilter] = useState("all");  // 状态筛选
```

## 主要函数

### loadUsers(page: number)
加载用户列表，支持分页和搜索条件

```typescript
const loadUsers = async (page: number = 1) => {
  setLoading(true);
  try {
    const response = await userApi.pageUsers({
      page,
      pageSize,
      username: searchTerm || undefined,
      status: statusFilter !== "all" ? parseInt(statusFilter) : undefined,
    });
    // 处理响应...
  } finally {
    setLoading(false);
  }
};
```

### handleSearch()
执行搜索操作

```typescript
const handleSearch = () => {
  setCurrentPage(1);
  loadUsers(1);
};
```

### handleDisableUser(userId: number)
禁用用户

```typescript
const handleDisableUser = async (userId: number) => {
  try {
    const response = await userApi.disableUser(userId);
    if (response.code === 0) {
      toast({ title: "成功", description: "用户已禁用" });
      loadUsers(currentPage);
    }
  } catch (error) {
    toast({ title: "错误", description: "禁用用户失败", variant: "destructive" });
  }
};
```

### handleEnableUser(userId: number)
启用用户

```typescript
const handleEnableUser = async (userId: number) => {
  try {
    const response = await userApi.enableUser(userId);
    if (response.code === 0) {
      toast({ title: "成功", description: "用户已启用" });
      loadUsers(currentPage);
    }
  } catch (error) {
    toast({ title: "错误", description: "启用用户失败", variant: "destructive" });
  }
};
```

## UI 组件

### 搜索和筛选区域
- 用户名搜索输入框
- 状态筛选下拉菜单
- 搜索按钮

### 用户列表表格
- 用户信息列（头像、用户名、邮箱）
- 用户名列
- 注册时间列
- 状态列（启用/禁用）
- 操作列（禁用/启用、查看详情）

### 分页控件
- 显示当前页码和总页数
- 显示总记录数
- 上一页/下一页按钮

## 使用说明

### 访问用户管理页面
1. 以管理员身份登录
2. 在管理员仪表板中点击"用户管理"菜单项
3. 进入用户管理页面

### 搜索用户
1. 在搜索框中输入用户名
2. 点击"搜索"按钮或按回车键
3. 列表会显示匹配的用户

### 筛选用户
1. 在状态筛选下拉菜单中选择状态
2. 列表会自动更新显示对应状态的用户

### 禁用/启用用户
1. 在用户列表中找到目标用户
2. 点击操作列中的锁定/解锁图标
3. 用户状态会立即更新

## 错误处理

所有 API 调用都包含错误处理，错误信息会通过 Toast 通知显示给用户。

## 后续改进

1. 添加用户详情弹窗
2. 添加批量操作功能
3. 添加用户编辑功能
4. 添加用户删除功能
5. 添加导出用户列表功能
6. 添加高级搜索功能

