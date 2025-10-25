/**
 * Excel 模板生成工具
 */

/**
 * 生成用户导入 Excel 模板
 */
export const generateUserTemplate = () => {
  // 创建工作簿数据
  const headers = ['用户名', '密码', '邮箱', '手机号', '真实姓名', '用户类型', '状态'];
  
  // 示例数据
  const exampleData = [
    ['user001', 'Password123', 'user001@example.com', '13800138000', '张三', 'user', '1'],
    ['user002', 'Password456', 'user002@example.com', '13800138001', '李四', 'user', '1'],
    ['user003', 'Password789', 'user003@example.com', '13800138002', '王五', 'user', '1'],
  ];

  // 创建 CSV 内容
  let csvContent = headers.join(',') + '\n';
  exampleData.forEach(row => {
    csvContent += row.join(',') + '\n';
  });

  // 创建 Blob 对象
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // 创建下载链接
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', '用户导入模板.csv');
  link.style.visibility = 'hidden';
  
  // 触发下载
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 解析 CSV 文件
 */
export const parseCSVFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          reject(new Error('文件内容为空'));
          return;
        }

        // 解析标题行
        const headers = lines[0].split(',').map(h => h.trim());
        
        // 验证必要的列
        const requiredColumns = ['用户名', '密码'];
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
          reject(new Error(`缺少必要的列: ${missingColumns.join(', ')}`));
          return;
        }

        // 解析数据行
        const data = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length > 0 && values[0]) {
            const row: any = {};
            headers.forEach((header, index) => {
              const key = headerToKey(header);
              row[key] = values[index] || '';
            });
            data.push(row);
          }
        }

        if (data.length === 0) {
          reject(new Error('没有有效的数据行'));
          return;
        }

        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsText(file, 'utf-8');
  });
};

/**
 * 将 Excel 列名转换为对象键名
 */
const headerToKey = (header: string): string => {
  const mapping: Record<string, string> = {
    '用户名': 'username',
    '密码': 'password',
    '邮箱': 'email',
    '手机号': 'phone',
    '真实姓名': 'realName',
    '用户类型': 'userType',
    '状态': 'status',
  };
  return mapping[header] || header;
};

/**
 * 验证用户数据
 */
export const validateUserData = (users: any[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  users.forEach((user, index) => {
    const rowNumber = index + 2; // Excel 行号从 2 开始

    // 验证用户名
    if (!user.username) {
      errors.push(`第 ${rowNumber} 行：用户名不能为空`);
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(user.username)) {
      errors.push(`第 ${rowNumber} 行：用户名只能包含字母、数字和下划线，长度 3-20`);
    }

    // 验证密码
    if (!user.password) {
      errors.push(`第 ${rowNumber} 行：密码不能为空`);
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(user.password)) {
      errors.push(`第 ${rowNumber} 行：密码至少 8 个字符，必须包含大小写字母和数字`);
    }

    // 验证邮箱
    if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      errors.push(`第 ${rowNumber} 行：邮箱格式不正确`);
    }

    // 验证手机号
    if (user.phone && !/^1[3-9]\d{9}$/.test(user.phone)) {
      errors.push(`第 ${rowNumber} 行：手机号格式不正确`);
    }

    // 验证用户类型
    if (user.userType && !['admin', 'user'].includes(user.userType)) {
      errors.push(`第 ${rowNumber} 行：用户类型只能是 admin 或 user`);
    }

    // 验证状态
    if (user.status && ![0, 1, '0', '1'].includes(user.status)) {
      errors.push(`第 ${rowNumber} 行：状态只能是 0 或 1`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

