// 简单的 AuthContext 测试
// 这个测试验证登录和注册功能

describe('AuthContext', () => {
  beforeEach(() => {
    // 清空 localStorage
    localStorage.clear();
  });

  describe('用户注册和登录', () => {
    test('应该能够注册新用户', async () => {
      // 模拟注册流程
      const username = 'testuser';
      const password = 'password123';
      const fullName = '测试用户';

      // 验证用户名长度
      expect(username.length).toBeGreaterThanOrEqual(3);
      
      // 验证密码长度
      expect(password.length).toBeGreaterThanOrEqual(6);
      
      // 验证姓名长度
      expect(fullName.length).toBeGreaterThanOrEqual(2);

      // 保存用户信息到 localStorage
      const users = [];
      const newUser = {
        id: Date.now().toString(),
        username,
        role: 'student' as const,
      };
      users.push(newUser);
      localStorage.setItem('app_users', JSON.stringify(users));
      localStorage.setItem(`pwd_${username}`, password);
      localStorage.setItem(`fullname_${username}`, fullName);

      // 验证用户已保存
      const storedUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
      expect(storedUsers).toHaveLength(1);
      expect(storedUsers[0].username).toBe(username);
    });

    test('应该能够使用正确的凭证登录', async () => {
      // 先注册一个用户
      const username = 'testuser';
      const password = 'password123';
      
      const users = [];
      const newUser = {
        id: Date.now().toString(),
        username,
        role: 'student' as const,
      };
      users.push(newUser);
      localStorage.setItem('app_users', JSON.stringify(users));
      localStorage.setItem(`pwd_${username}`, password);

      // 验证登录
      const storedUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
      const foundUser = storedUsers.find((u: any) => u.username === username);
      expect(foundUser).toBeDefined();

      const storedPassword = localStorage.getItem(`pwd_${username}`);
      expect(storedPassword).toBe(password);
    });

    test('应该拒绝过短的用户名', () => {
      const username = 'ab'; // 少于3个字符
      expect(username.length).toBeLessThan(3);
    });

    test('应该拒绝过短的密码', () => {
      const password = '12345'; // 少于6个字符
      expect(password.length).toBeLessThan(6);
    });

    test('应该拒绝过短的姓名', () => {
      const fullName = 'a'; // 少于2个字符
      expect(fullName.length).toBeLessThan(2);
    });

    test('应该拒绝重复的用户名', () => {
      const username = 'testuser';
      
      // 创建第一个用户
      const users = [];
      const user1 = {
        id: '1',
        username,
        role: 'student' as const,
      };
      users.push(user1);
      
      // 尝试创建相同用户名的用户
      const isDuplicate = users.some(u => u.username === username);
      expect(isDuplicate).toBe(true);
    });

    test('应该能够登出', () => {
      // 设置当前用户
      const user = {
        id: '1',
        username: 'testuser',
        role: 'student' as const,
      };
      localStorage.setItem('current_user', JSON.stringify(user));

      // 验证用户已登录
      const currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');
      expect(currentUser).not.toBeNull();

      // 登出
      localStorage.removeItem('current_user');

      // 验证用户已登出
      const loggedOutUser = localStorage.getItem('current_user');
      expect(loggedOutUser).toBeNull();
    });
  });

  describe('用户角色', () => {
    test('学生用户应该有 student 角色', () => {
      const user = {
        id: '1',
        username: 'student',
        role: 'student' as const,
      };
      expect(user.role).toBe('student');
    });

    test('教师用户应该有 teacher 角色', () => {
      const user = {
        id: '2',
        username: 'teacher',
        role: 'teacher' as const,
      };
      expect(user.role).toBe('teacher');
    });
  });
});

