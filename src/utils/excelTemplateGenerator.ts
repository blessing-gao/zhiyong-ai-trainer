/**
 * Excel 模板生成工具
 * 用于生成不同题型的 Excel 导入模板
 */

// 使用 xlsx 库生成 Excel 文件
// 需要安装: npm install xlsx

interface ExcelTemplate {
  sheetName: string;
  headers: string[];
  description: string;
  exampleData: any[];
}

/**
 * 题型定义
 */
export const QUESTION_TYPES = {
  SINGLE_CHOICE: {
    id: 'single',
    name: '单选题',
    description: '只有一个正确答案的题目',
  },
  MULTIPLE_CHOICE: {
    id: 'multiple',
    name: '多选题',
    description: '有多个正确答案的题目',
  },
  TRUE_FALSE: {
    id: 'judge',
    name: '判断题',
    description: '判断题目正误的题目',
  },
  FILL_BLANK: {
    id: 'fill',
    name: '填空题',
    description: '需要填写答案的题目',
  },
};

/**
 * 难度定义
 */
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

/**
 * 技能等级定义
 */
export const SKILL_LEVELS = {
  LEVEL_1: 'level1',
  LEVEL_2: 'level2',
  LEVEL_3: 'level3',
};

/**
 * 生成单选题模板
 */
function generateSingleChoiceTemplate(): ExcelTemplate {
  return {
    sheetName: '单选题',
    headers: ['题干', '选项A', '选项B', '选项C', '选项D', '正确答案', '难度', '等级', '解析'],
    description: '单选题模板 - 每行一道题，正确答案填写 A/B/C/D',
    exampleData: [
      {
        题干: '下列哪个是正确的？',
        选项A: '选项A内容',
        选项B: '选项B内容',
        选项C: '选项C内容',
        选项D: '选项D内容',
        正确答案: 'A',
        难度: 'easy',
        等级: 'level1',
        解析: '这是题目解析',
      },
    ],
  };
}

/**
 * 生成多选题模板
 */
function generateMultipleChoiceTemplate(): ExcelTemplate {
  return {
    sheetName: '多选题',
    headers: ['题干', '选项A', '选项B', '选项C', '选项D', '正确答案', '难度', '等级', '解析'],
    description: '多选题模板 - 每行一道题，正确答案填写 A/B/C/D 的组合（如：AB、ABC）',
    exampleData: [
      {
        题干: '下列哪些是正确的？',
        选项A: '选项A内容',
        选项B: '选项B内容',
        选项C: '选项C内容',
        选项D: '选项D内容',
        正确答案: 'AB',
        难度: 'medium',
        等级: 'level2',
        解析: '这是题目解析',
      },
    ],
  };
}

/**
 * 生成判断题模板
 */
function generateTrueFalseTemplate(): ExcelTemplate {
  return {
    sheetName: '判断题',
    headers: ['题干', '正确答案', '难度', '等级', '解析'],
    description: '判断题模板 - 每行一道题，正确答案填写 true/false 或 对/错',
    exampleData: [
      {
        题干: '这个说法是否正确？',
        正确答案: 'true',
        难度: 'easy',
        等级: 'level1',
        解析: '这是题目解析',
      },
    ],
  };
}

/**
 * 生成填空题模板
 */
function generateFillBlankTemplate(): ExcelTemplate {
  return {
    sheetName: '填空题',
    headers: ['题干', '正确答案', '难度', '等级', '解析'],
    description: '填空题模板 - 每行一道题，正确答案可以是单个或多个（用|分隔）',
    exampleData: [
      {
        题干: '请填写答案：_____',
        正确答案: '答案1|答案2',
        难度: 'medium',
        等级: 'level2',
        解析: '这是题目解析',
      },
    ],
  };
}

/**
 * 生成所有模板
 */
export function generateAllTemplates(): ExcelTemplate[] {
  return [
    generateSingleChoiceTemplate(),
    generateMultipleChoiceTemplate(),
    generateTrueFalseTemplate(),
    generateFillBlankTemplate(),
  ];
}

/**
 * 使用 xlsx 库生成 Excel 文件
 * 注意：需要在项目中安装 xlsx 库
 */
export async function generateExcelTemplate() {
  try {
    // 动态导入 xlsx 库
    const XLSX = await import('xlsx');

    const workbook = XLSX.utils.book_new();
    const templates = generateAllTemplates();

    // 为每个题型创建一个 Sheet
    templates.forEach((template) => {
      // 创建工作表数据
      const wsData = [
        template.headers,
        ...template.exampleData.map((row) =>
          template.headers.map((header) => row[header] || '')
        ),
      ];

      // 创建工作表
      const worksheet = XLSX.utils.aoa_to_sheet(wsData);

      // 设置列宽
      const colWidths = template.headers.map(() => 20);
      worksheet['!cols'] = colWidths.map((width) => ({ wch: width }));

      // 添加到工作簿
      XLSX.utils.book_append_sheet(workbook, worksheet, template.sheetName);
    });

    // 生成文件
    XLSX.writeFile(workbook, '题目导入模板.xlsx');
  } catch (error) {
    console.error('生成 Excel 模板失败:', error);
    throw new Error('生成 Excel 模板失败，请确保已安装 xlsx 库');
  }
}

/**
 * 解析上传的 Excel 文件
 */
export async function parseExcelFile(file: File): Promise<{
  sheetName: string;
  data: any[];
  questionType: string;
}[]> {
  try {
    const XLSX = await import('xlsx');

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });

          const results: any[] = [];

          // 遍历所有 Sheet
          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // 根据 Sheet 名称确定题型
            let questionType = '';
            if (sheetName.includes('单选')) {
              questionType = 'single';
            } else if (sheetName.includes('多选')) {
              questionType = 'multiple';
            } else if (sheetName.includes('判断')) {
              questionType = 'judge';
            } else if (sheetName.includes('填空')) {
              questionType = 'fill';
            }

            results.push({
              sheetName,
              data: jsonData,
              questionType,
            });
          });

          resolve(results);
        } catch (error) {
          reject(new Error('解析 Excel 文件失败'));
        }
      };

      reader.onerror = () => {
        reject(new Error('读取文件失败'));
      };

      reader.readAsBinaryString(file);
    });
  } catch (error) {
    console.error('解析 Excel 文件失败:', error);
    throw new Error('解析 Excel 文件失败，请确保已安装 xlsx 库');
  }
}

