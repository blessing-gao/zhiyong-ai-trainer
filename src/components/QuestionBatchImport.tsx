import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { generateExcelTemplate, parseExcelFile } from '@/utils/excelTemplateGenerator';
import { questionApi } from '@/services/api';

interface ImportedQuestion {
  sheetName: string;
  rowIndex: number;
  data: any;
  questionType: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
}

interface QuestionBatchImportProps {
  onImportSuccess?: () => void;
}

export const QuestionBatchImport: React.FC<QuestionBatchImportProps> = ({ onImportSuccess }) => {
  const [step, setStep] = useState<'download' | 'upload' | 'preview' | 'importing'>('download');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importedQuestions, setImportedQuestions] = useState<ImportedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 下载 Excel 模板
   */
  const handleDownloadTemplate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await generateExcelTemplate();
    } catch (err) {
      setError(err instanceof Error ? err.message : '下载模板失败');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理文件选择
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);

      // 验证文件类型
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        throw new Error('请选择 Excel 文件（.xlsx 或 .xls）');
      }

      // 解析 Excel 文件
      const parsedData = await parseExcelFile(file);

      // 转换为导入格式
      const questions: ImportedQuestion[] = [];
      parsedData.forEach((sheet) => {
        sheet.data.forEach((row, index) => {
          questions.push({
            sheetName: sheet.sheetName,
            rowIndex: index + 2, // Excel 行号（从第2行开始，第1行是标题）
            data: row,
            questionType: sheet.questionType,
            status: 'pending',
          });
        });
      });

      setSelectedFile(file);
      setImportedQuestions(questions);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析文件失败');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理文件上传点击
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * 执行批量导入
   */
  const handleImport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setStep('importing');
      setImportProgress(0);

      let successCount = 0;
      let errorCount = 0;

      // 逐个导入题目
      for (let i = 0; i < importedQuestions.length; i++) {
        const question = importedQuestions[i];

        try {
          // 根据题型构建请求数据
          const requestData = buildQuestionRequest(question);

          // 调用 API 创建题目
          const response = await questionApi.createQuestion(requestData);

          if (response.code === 0) {
            question.status = 'success';
            successCount++;
          } else {
            question.status = 'error';
            question.message = response.msg || '导入失败';
            errorCount++;
          }
        } catch (err) {
          question.status = 'error';
          question.message = err instanceof Error ? err.message : '导入失败';
          errorCount++;
        }

        // 更新进度
        setImportProgress(Math.round(((i + 1) / importedQuestions.length) * 100));
        setImportedQuestions([...importedQuestions]);
      }

      // 导入完成
      if (errorCount === 0) {
        setError(null);
        setTimeout(() => {
          alert(`成功导入 ${successCount} 道题目！`);
          onImportSuccess?.();
          resetForm();
        }, 1000);
      } else {
        setError(`导入完成：成功 ${successCount} 道，失败 ${errorCount} 道`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '导入失败');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 根据题型构建请求数据
   */
  function buildQuestionRequest(question: ImportedQuestion): any {
    const { data, questionType } = question;

    const request: any = {
      type: questionType,
      stem: data['题干'] || '',
      answer: data['正确答案'] || '',
      difficulty: data['难度'] || 'medium',
      level: data['等级'] || 'level1',
      analysis: data['解析'] || '',
      status: 1,
    };

    // 根据题型处理选项
    if (questionType === 'single' || questionType === 'multiple') {
      const options = [];
      if (data['选项A']) options.push(data['选项A']);
      if (data['选项B']) options.push(data['选项B']);
      if (data['选项C']) options.push(data['选项C']);
      if (data['选项D']) options.push(data['选项D']);
      request.options = JSON.stringify(options);
    }

    return request;
  }

  /**
   * 重置表单
   */
  const resetForm = () => {
    setStep('download');
    setSelectedFile(null);
    setImportedQuestions([]);
    setImportProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* 步骤指示器 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          {['download', 'upload', 'preview', 'importing'].map((s, index) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s
                    ? 'bg-blue-500 text-white'
                    : ['download', 'upload', 'preview', 'importing'].indexOf(step) > index
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              <span className="text-sm font-medium">
                {s === 'download' && '下载模板'}
                {s === 'upload' && '上传文件'}
                {s === 'preview' && '预览数据'}
                {s === 'importing' && '导入中'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* 第一步：下载模板 */}
      {step === 'download' && (
        <Card>
          <CardHeader>
            <CardTitle>第一步：下载 Excel 模板</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              点击下载按钮获取 Excel 模板。模板包含不同题型的 Sheet 页：
            </p>
            <ul className="text-sm text-gray-600 space-y-2 ml-4">
              <li>• <strong>单选题</strong> - 只有一个正确答案</li>
              <li>• <strong>多选题</strong> - 有多个正确答案</li>
              <li>• <strong>判断题</strong> - 判断题目正误</li>
              <li>• <strong>填空题</strong> - 需要填写答案</li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              请根据题目类型在对应的 Sheet 页中填写数据，然后上传文件。
            </p>
            <Button
              onClick={handleDownloadTemplate}
              disabled={isLoading}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {isLoading ? '生成中...' : '下载 Excel 模板'}
            </Button>
            <Button
              onClick={() => setStep('upload')}
              variant="outline"
              className="w-full"
            >
              已下载，继续上传
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 第二步：上传文件 */}
      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>第二步：上传 Excel 文件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
              onClick={handleUploadClick}
            >
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">点击选择文件或拖拽上传</p>
              <p className="text-xs text-gray-500 mt-1">支持 .xlsx 和 .xls 格式</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
            {selectedFile && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  ✓ 已选择文件：{selectedFile.name}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                onClick={handleUploadClick}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                {isLoading ? '解析中...' : '选择文件'}
              </Button>
              <Button
                onClick={() => setStep('download')}
                variant="outline"
                className="flex-1"
              >
                返回
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 第三步：预览数据 */}
      {step === 'preview' && (
        <Card>
          <CardHeader>
            <CardTitle>第三步：预览导入数据</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              共有 <strong>{importedQuestions.length}</strong> 道题目待导入
            </div>

            {/* 题目预览列表 */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {importedQuestions.map((question, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {index + 1}. {question.data['题干']?.substring(0, 50)}...
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Sheet: {question.sheetName} | 题型: {question.questionType}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleImport}
                disabled={isLoading || importedQuestions.length === 0}
                className="flex-1"
              >
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                {isLoading ? '导入中...' : '开始导入'}
              </Button>
              <Button
                onClick={() => setStep('upload')}
                variant="outline"
                className="flex-1"
                disabled={isLoading}
              >
                返回
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 第四步：导入中 */}
      {step === 'importing' && (
        <Card>
          <CardHeader>
            <CardTitle>导入进度</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>导入进度</span>
                <span className="font-medium">{importProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
            </div>

            {/* 导入结果列表 */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {importedQuestions.map((question, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg text-sm flex items-center gap-2 ${
                    question.status === 'success'
                      ? 'bg-green-50 text-green-700'
                      : question.status === 'error'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  {question.status === 'success' && <CheckCircle className="h-4 w-4" />}
                  {question.status === 'error' && <AlertCircle className="h-4 w-4" />}
                  {question.status === 'pending' && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span className="flex-1">
                    {index + 1}. {question.data['题干']?.substring(0, 40)}...
                  </span>
                  {question.message && <span className="text-xs">{question.message}</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionBatchImport;

